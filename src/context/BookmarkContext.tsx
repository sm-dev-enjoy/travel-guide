'use client';

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  useSyncExternalStore,
} from 'react';
import { BookmarkContextType, Destination } from '@/types/travel';
import { MOCK_DESTINATIONS } from '@/data/destinations';

export const STORAGE_KEY = 'tripfinder_bookmarks';
export const CUSTOM_EVENT_NAME = 'tripfinder_bookmarks_change';

// In-memory fallback snapshot for environments where localStorage throws or is restricted
let memoryFallbackSnapshot = '[]';
let isStorageFailing = false;

export function sanitizeBookmarkIds(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  const validIds = new Set(MOCK_DESTINATIONS.map((d) => d.id));
  const seen = new Set<string>();
  const result: string[] = [];
  for (const item of raw) {
    if (typeof item === 'string' && validIds.has(item) && !seen.has(item)) {
      seen.add(item);
      result.push(item);
    }
  }
  return result;
}

export function subscribe(callback: () => void) {
  if (typeof window === 'undefined') return () => {};
  const handleStorage = () => {
    isStorageFailing = false;
    callback();
  };
  window.addEventListener('storage', handleStorage);
  window.addEventListener(CUSTOM_EVENT_NAME, callback);
  return () => {
    window.removeEventListener('storage', handleStorage);
    window.removeEventListener(CUSTOM_EVENT_NAME, callback);
  };
}

export function getSnapshot(): string {
  if (typeof window === 'undefined') return '[]';
  if (isStorageFailing) return memoryFallbackSnapshot;
  try {
    const val = localStorage.getItem(STORAGE_KEY);
    if (val !== null) {
      memoryFallbackSnapshot = val;
      return val;
    }
    memoryFallbackSnapshot = '[]';
    return '[]';
  } catch {
    isStorageFailing = true;
    return memoryFallbackSnapshot;
  }
}

export const SERVER_SNAPSHOT = '[]';
export function getServerSnapshot(): string {
  return SERVER_SNAPSHOT;
}

export function getBookmarksFromStorage(): string[] {
  try {
    const raw = getSnapshot();
    const parsed = JSON.parse(raw);
    return sanitizeBookmarkIds(parsed);
  } catch {
    return [];
  }
}

export function writeBookmarksToStorage(newBookmarks: string[]): void {
  const sanitized = sanitizeBookmarkIds(newBookmarks);
  const serialized = JSON.stringify(sanitized);
  memoryFallbackSnapshot = serialized;

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, serialized);
      isStorageFailing = false;
    } catch (e) {
      isStorageFailing = true;
      console.warn('Failed to save bookmarks to localStorage, in-memory fallback active:', e);
    }
    try {
      window.dispatchEvent(new Event(CUSTOM_EVENT_NAME));
    } catch {
      // ignore
    }
  }
}

const emptySubscribe = () => () => {};

const BookmarkContext = createContext<BookmarkContextType | undefined>(undefined);

export const BookmarkProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);

  // SSR-safe hydration indicator powered by useSyncExternalStore
  const isHydrated = useSyncExternalStore(emptySubscribe, () => true, () => false);

  // Subscribe to external localStorage store with SSR safe hydration
  const rawStoreSnapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const bookmarks = useMemo(() => {
    try {
      const parsed = JSON.parse(rawStoreSnapshot);
      return sanitizeBookmarkIds(parsed);
    } catch {
      return [];
    }
  }, [rawStoreSnapshot]);

  const isBookmarked = useCallback(
    (id: string): boolean => {
      return bookmarks.includes(id);
    },
    [bookmarks]
  );

  const addBookmark = useCallback(
    (id: string) => {
      if (!MOCK_DESTINATIONS.some((d) => d.id === id)) return;
      const current = getBookmarksFromStorage();
      if (!current.includes(id)) {
        writeBookmarksToStorage([...current, id]);
      }
    },
    []
  );

  const removeBookmark = useCallback(
    (id: string) => {
      const current = getBookmarksFromStorage();
      writeBookmarksToStorage(current.filter((item) => item !== id));
    },
    []
  );

  const toggleBookmark = useCallback(
    (id: string) => {
      if (!MOCK_DESTINATIONS.some((d) => d.id === id)) return;
      const current = getBookmarksFromStorage();
      const next = current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id];
      writeBookmarksToStorage(next);
    },
    []
  );

  const clearBookmarks = useCallback(() => {
    writeBookmarksToStorage([]);
  }, []);

  const openDrawer = useCallback(() => setIsDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setIsDrawerOpen(false), []);

  const bookmarkedDestinations = useMemo(() => {
    return bookmarks
      .map((id) => MOCK_DESTINATIONS.find((dest) => dest.id === id))
      .filter((dest): dest is Destination => dest !== undefined);
  }, [bookmarks]);

  const value = useMemo(
    () => ({
      bookmarks,
      bookmarkedDestinations,
      isBookmarked,
      toggleBookmark,
      addBookmark,
      removeBookmark,
      clearBookmarks,
      isDrawerOpen,
      setIsDrawerOpen,
      openDrawer,
      closeDrawer,
      isHydrated,
      selectedDestination,
      setSelectedDestination,
    }),
    [
      bookmarks,
      bookmarkedDestinations,
      isBookmarked,
      toggleBookmark,
      addBookmark,
      removeBookmark,
      clearBookmarks,
      isDrawerOpen,
      openDrawer,
      closeDrawer,
      isHydrated,
      selectedDestination,
    ]
  );

  return <BookmarkContext.Provider value={value}>{children}</BookmarkContext.Provider>;
};

export const useBookmarks = (): BookmarkContextType => {
  const context = useContext(BookmarkContext);
  if (!context) {
    throw new Error('useBookmarks must be used within a BookmarkProvider');
  }
  return context;
};
