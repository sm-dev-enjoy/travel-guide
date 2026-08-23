import test from 'node:test';
import assert from 'node:assert/strict';
import { MOCK_DESTINATIONS } from '../src/data/destinations.js';
import { calculateRecommendations } from '../src/utils/recommendationEngine.js';
import { Destination, RecommendationScore } from '../src/types/travel.js';
import {
  STORAGE_KEY,
  CUSTOM_EVENT_NAME,
  SERVER_SNAPSHOT,
  sanitizeBookmarkIds,
} from '../src/context/BookmarkContext.js';

// In-memory mock localStorage for testing with cross-tab storage event dispatching and optional failure simulation
class MockLocalStorage {
  private store = new Map<string, string>();
  private listeners = new Set<{ owner: object; fn: (key: string, value: string) => void }>();
  public shouldThrowOnGet = false;
  public shouldThrowOnSet = false;

  getItem(key: string): string | null {
    if (this.shouldThrowOnGet) {
      throw new Error('SecurityError: The operation is insecure.');
    }
    return this.store.has(key) ? this.store.get(key)! : null;
  }
  setItem(key: string, value: string, sourceOwner?: object): void {
    if (this.shouldThrowOnSet) {
      throw new Error('QuotaExceededError: The quota has been exceeded.');
    }
    this.store.set(key, String(value));
    // Window storage event only fires on other windows/tabs (not the originating source)
    this.listeners.forEach(({ owner, fn }) => {
      if (owner !== sourceOwner) {
        fn(key, String(value));
      }
    });
  }
  removeItem(key: string, sourceOwner?: object): void {
    this.store.delete(key);
    this.listeners.forEach(({ owner, fn }) => {
      if (owner !== sourceOwner) {
        fn(key, '');
      }
    });
  }
  clear(sourceOwner?: object): void {
    this.store.clear();
    this.listeners.forEach(({ owner, fn }) => {
      if (owner !== sourceOwner) {
        fn('', '');
      }
    });
  }
  onStorage(owner: object, fn: (key: string, value: string) => void) {
    const entry = { owner, fn };
    this.listeners.add(entry);
    return () => this.listeners.delete(entry);
  }
}

// Logic replicate matching BookmarkContext implementation
function createBookmarkStore(storage: MockLocalStorage) {
  const instanceKey = {};
  let listeners: Array<() => void> = [];
  let inMemoryFallback = '[]';
  let isStorageFailing = false;

  function subscribe(listener: () => void) {
    listeners.push(listener);
    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  }

  function notifyLocal() {
    listeners.forEach((l) => l());
  }

  // Cross-tab storage change listener
  storage.onStorage(instanceKey, (key) => {
    if (key === STORAGE_KEY || key === '') {
      isStorageFailing = false;
      notifyLocal();
    }
  });

  function getRawSnapshot(): string {
    if (isStorageFailing) return inMemoryFallback;
    try {
      const val = storage.getItem(STORAGE_KEY);
      if (val !== null) {
        inMemoryFallback = val;
        return val;
      }
      inMemoryFallback = '[]';
      return '[]';
    } catch {
      isStorageFailing = true;
      return inMemoryFallback;
    }
  }

  function getBookmarks(): string[] {
    try {
      const raw = getRawSnapshot();
      const parsed = JSON.parse(raw);
      return sanitizeBookmarkIds(parsed);
    } catch {
      return [];
    }
  }

  function persistBookmarks(newBookmarks: string[]): void {
    const sanitized = sanitizeBookmarkIds(newBookmarks);
    const serialized = JSON.stringify(sanitized);
    inMemoryFallback = serialized;

    try {
      storage.setItem(STORAGE_KEY, serialized, instanceKey);
      isStorageFailing = false;
    } catch {
      isStorageFailing = true;
      // fallback in memory
    }
    notifyLocal();
  }

  function isBookmarked(id: string): boolean {
    return getBookmarks().includes(id);
  }

  function addBookmark(id: string): void {
    if (!MOCK_DESTINATIONS.some((d) => d.id === id)) return;
    const current = getBookmarks();
    if (!current.includes(id)) {
      persistBookmarks([...current, id]);
    }
  }

  function removeBookmark(id: string): void {
    const current = getBookmarks();
    persistBookmarks(current.filter((item) => item !== id));
  }

  function toggleBookmark(id: string): void {
    if (!MOCK_DESTINATIONS.some((d) => d.id === id)) return;
    const current = getBookmarks();
    if (current.includes(id)) {
      persistBookmarks(current.filter((item) => item !== id));
    } else {
      persistBookmarks([...current, id]);
    }
  }

  function clearBookmarks(): void {
    persistBookmarks([]);
  }

  function getBookmarkedDestinations(): Destination[] {
    const ids = getBookmarks();
    return ids
      .map((id) => MOCK_DESTINATIONS.find((dest) => dest.id === id))
      .filter((dest): dest is Destination => dest !== undefined);
  }

  return {
    subscribe,
    getRawSnapshot,
    getBookmarks,
    isBookmarked,
    addBookmark,
    removeBookmark,
    toggleBookmark,
    clearBookmarks,
    getBookmarkedDestinations,
  };
}

test('Sanitization Function: sanitizeBookmarkIds thoroughly cleans corrupted inputs', () => {
  // 1. Non-array inputs return []
  assert.deepEqual(sanitizeBookmarkIds(null), []);
  assert.deepEqual(sanitizeBookmarkIds(undefined), []);
  assert.deepEqual(sanitizeBookmarkIds('jeju'), []);
  assert.deepEqual(sanitizeBookmarkIds(12345), []);
  assert.deepEqual(sanitizeBookmarkIds({ id: 'jeju' }), []);

  // 2. Mix of invalid types and non-existent IDs
  const dirty = ['jeju', null, 999, 'non_existent_destination', {}, ['nested'], 'danang', 'jeju'];
  const cleaned = sanitizeBookmarkIds(dirty);

  // Should contain only unique valid destination IDs in order
  assert.deepEqual(cleaned, ['jeju', 'danang']);

  // 3. Deduplication of valid IDs
  assert.deepEqual(sanitizeBookmarkIds(['paris', 'paris', 'paris', 'guam']), ['paris', 'guam']);

  // 4. Server snapshot constant
  assert.equal(SERVER_SNAPSHOT, '[]');
  assert.equal(STORAGE_KEY, 'tripfinder_bookmarks');
  assert.equal(CUSTOM_EVENT_NAME, 'tripfinder_bookmarks_change');
});

test('Requirement R3 & Store: Initial empty state and snapshot', () => {
  const storage = new MockLocalStorage();
  const store = createBookmarkStore(storage);

  assert.deepEqual(store.getBookmarks(), []);
  assert.deepEqual(store.getBookmarkedDestinations(), []);
  assert.equal(store.isBookmarked('jeju'), false);
  assert.equal(store.getRawSnapshot(), '[]');
});

test('Requirement R1 & Store: Add and toggle bookmark interaction', () => {
  const storage = new MockLocalStorage();
  const store = createBookmarkStore(storage);

  // 1. Add Jeju
  store.addBookmark('jeju');
  assert.equal(store.isBookmarked('jeju'), true);
  assert.deepEqual(store.getBookmarks(), ['jeju']);
  assert.equal(store.getBookmarkedDestinations().length, 1);
  assert.equal(store.getBookmarkedDestinations()[0].name, '제주도');

  // 2. Duplicate add is idempotent
  store.addBookmark('jeju');
  assert.deepEqual(store.getBookmarks(), ['jeju']);

  // 3. Adding an invalid ID is safely ignored
  store.addBookmark('invalid_non_existent_id');
  assert.deepEqual(store.getBookmarks(), ['jeju']);

  // 4. Toggle off
  store.toggleBookmark('jeju');
  assert.equal(store.isBookmarked('jeju'), false);
  assert.deepEqual(store.getBookmarks(), []);

  // 5. Toggle on
  store.toggleBookmark('fukuoka');
  assert.equal(store.isBookmarked('fukuoka'), true);
  assert.deepEqual(store.getBookmarks(), ['fukuoka']);
  assert.equal(store.getBookmarkedDestinations()[0].name, '후쿠오카');

  // 6. Toggle invalid ID is ignored
  store.toggleBookmark('fake_id_xyz');
  assert.deepEqual(store.getBookmarks(), ['fukuoka']);
});

test('Requirement R2 & Store: Manage multiple bookmarks, individual removal and clear all', () => {
  const storage = new MockLocalStorage();
  const store = createBookmarkStore(storage);

  // Add 3 destinations
  store.addBookmark('jeju');
  store.addBookmark('danang');
  store.addBookmark('paris');

  assert.equal(store.getBookmarks().length, 3);
  assert.deepEqual(store.getBookmarks(), ['jeju', 'danang', 'paris']);

  const destinations = store.getBookmarkedDestinations();
  assert.equal(destinations.length, 3);
  assert.equal(destinations[0].id, 'jeju');
  assert.equal(destinations[1].id, 'danang');
  assert.equal(destinations[2].id, 'paris');

  // Remove one item
  store.removeBookmark('danang');
  assert.equal(store.isBookmarked('danang'), false);
  assert.deepEqual(store.getBookmarks(), ['jeju', 'paris']);

  // Removing a non-existent item is a safe no-op
  store.removeBookmark('non_existent');
  assert.deepEqual(store.getBookmarks(), ['jeju', 'paris']);

  // Clear all
  store.clearBookmarks();
  assert.deepEqual(store.getBookmarks(), []);
  assert.equal(store.getBookmarkedDestinations().length, 0);
  assert.equal(storage.getItem(STORAGE_KEY), '[]');
});

test('Requirement R3 & Store: LocalStorage hydration and filtering corrupt/invalid data', () => {
  const storage = new MockLocalStorage();

  // Pre-seed storage with mix of valid IDs, non-existent IDs, and corrupt types
  const corruptPayload = ['jeju', 'invalid_destination_id_999', 12345, null, 'interlaken', 'unknown', 'jeju'];
  storage.setItem(STORAGE_KEY, JSON.stringify(corruptPayload));

  const store = createBookmarkStore(storage);
  const loaded = store.getBookmarks();

  // Only valid destination IDs that exist in MOCK_DESTINATIONS should be retained, deduplicated
  assert.deepEqual(loaded, ['jeju', 'interlaken']);
  assert.equal(store.isBookmarked('jeju'), true);
  assert.equal(store.isBookmarked('interlaken'), true);
  assert.equal(store.isBookmarked('invalid_destination_id_999'), false);

  const resolved = store.getBookmarkedDestinations();
  assert.equal(resolved.length, 2);
  assert.equal(resolved[0].name, '제주도');
  assert.equal(resolved[1].name, '인터라켄 & 융프라우');
});

test('Requirement R3 & Store: Handles JSON parse errors safely without crash', () => {
  const storage = new MockLocalStorage();
  storage.setItem(STORAGE_KEY, 'INVALID_JSON_CORRUPTED{[');

  const store = createBookmarkStore(storage);
  assert.deepEqual(store.getBookmarks(), []);
  assert.deepEqual(store.getBookmarkedDestinations(), []);

  // Adding a bookmark recovers and overwrites valid JSON
  store.addBookmark('guam');
  assert.deepEqual(store.getBookmarks(), ['guam']);
  assert.equal(storage.getItem(STORAGE_KEY), JSON.stringify(['guam']));
});

test('Requirement R3: Storage throwing errors (SecurityError / QuotaExceededError) falls back to memory safely and recovers when storage resumes', () => {
  const storage = new MockLocalStorage();
  const store = createBookmarkStore(storage);

  // 1. Initial healthy write
  store.addBookmark('jeju');
  assert.equal(store.isBookmarked('jeju'), true);
  assert.deepEqual(store.getBookmarks(), ['jeju']);

  // 2. Storage quota exceeded error during setItem
  storage.shouldThrowOnSet = true;
  store.addBookmark('bali');

  // Should still work in memory snapshot without crashing
  assert.equal(store.isBookmarked('bali'), true);
  assert.deepEqual(store.getBookmarks(), ['jeju', 'bali']);

  // 3. Storage security error during getItem
  storage.shouldThrowOnGet = true;
  assert.equal(store.isBookmarked('bali'), true);
  assert.deepEqual(store.getBookmarks(), ['jeju', 'bali']);

  // 4. Storage recovers to healthy state
  storage.shouldThrowOnSet = false;
  storage.shouldThrowOnGet = false;
  store.addBookmark('danang');
  assert.deepEqual(store.getBookmarks(), ['jeju', 'bali', 'danang']);
  assert.equal(storage.getItem(STORAGE_KEY), JSON.stringify(['jeju', 'bali', 'danang']));
});

test('Requirement R3: Multi-tab storage synchronization and external clear simulation', () => {
  const storage = new MockLocalStorage();
  const storeA = createBookmarkStore(storage);
  const storeB = createBookmarkStore(storage);

  let notifiedB = 0;
  storeB.subscribe(() => {
    notifiedB++;
  });

  // Tab A adds a bookmark
  storeA.addBookmark('bali');
  assert.equal(storeA.isBookmarked('bali'), true);
  assert.equal(notifiedB, 1);

  // Tab B checks storage
  assert.equal(storeB.isBookmarked('bali'), true);

  // Tab B adds 'guam'
  storeB.addBookmark('guam');
  assert.equal(notifiedB, 2);
  assert.deepEqual(storeA.getBookmarks(), ['bali', 'guam']);
  assert.deepEqual(storeB.getBookmarks(), ['bali', 'guam']);

  // Tab A removes item key completely (simulating external storage clear / removeItem)
  storage.removeItem(STORAGE_KEY);
  assert.deepEqual(storeB.getBookmarks(), []);
  assert.equal(storeB.isBookmarked('bali'), false);
  assert.equal(storeB.isBookmarked('guam'), false);

  // Tab A re-adds an item after clear
  storeA.addBookmark('paris');
  assert.deepEqual(storeB.getBookmarks(), ['paris']);
});

test('Requirement R1 & R2: Drawer and Nested Detail Modal keyboard hierarchy simulation', () => {
  let isDrawerOpen = true;
  let activeDetailDest: Destination | null = null;

  const closeDrawer = () => {
    isDrawerOpen = false;
  };
  const closeDetailModal = () => {
    activeDetailDest = null;
  };

  // Simulate keydown event handler stack
  function simulateEscapePress() {
    let stopped = false;
    const event = {
      key: 'Escape',
      stopPropagation: () => { stopped = true; },
      stopImmediatePropagation: () => { stopped = true; },
    };

    // 1. DestinationDetailModal listener
    if (activeDetailDest) {
      event.stopImmediatePropagation();
      closeDetailModal();
      return stopped;
    }

    // 2. BookmarkDrawer listener (guarded by !activeDetailDest)
    if (event.key === 'Escape' && isDrawerOpen && !activeDetailDest) {
      closeDrawer();
    }
    return stopped;
  }

  // Initial state: Drawer is open
  assert.equal(isDrawerOpen, true);
  assert.equal(activeDetailDest, null);

  // User opens detail modal from drawer
  const jeju = MOCK_DESTINATIONS.find((d) => d.id === 'jeju')!;
  activeDetailDest = jeju;

  // Pressing Escape while detail modal is open closes ONLY the detail modal
  const stoppedFirst = simulateEscapePress();
  assert.equal(stoppedFirst, true, 'Event propagation stopped by child modal');
  assert.equal(activeDetailDest, null);
  assert.equal(isDrawerOpen, true, 'Drawer should stay open when child modal closes');

  // Pressing Escape again now closes the drawer
  const stoppedSecond = simulateEscapePress();
  assert.equal(stoppedSecond, false);
  assert.equal(isDrawerOpen, false, 'Drawer closes on second Escape');
});

test('Requirement R1, R2, R3: Full End-to-End User Simulation Flow', () => {
  const storage = new MockLocalStorage();
  const store = createBookmarkStore(storage);

  // Step 1: User browses Hero Section and bookmarks 'gangneung'
  store.toggleBookmark('gangneung');
  assert.equal(store.isBookmarked('gangneung'), true);

  // Step 2: User completes survey and gets AI recommendation Top 3
  const surveyResult = calculateRecommendations({
    styles: ['휴양', '맛집'],
    duration: '3박 4일',
    budget: '100만원 이하',
    companion: '연인',
  });
  assert.ok(surveyResult.length >= 3);
  const top1 = surveyResult[0].destination;

  // Step 3: User bookmarks top1 result
  store.toggleBookmark(top1.id);
  assert.equal(store.isBookmarked(top1.id), true);

  // Step 4: User opens detail modal and bookmarks 'bali'
  store.addBookmark('bali');

  // Step 5: Verify Drawer contents and count badge
  let drawerItems = store.getBookmarkedDestinations();
  assert.equal(drawerItems.length, 3);
  assert.ok(drawerItems.some((d) => d.id === 'gangneung'));
  assert.ok(drawerItems.some((d) => d.id === top1.id));
  assert.ok(drawerItems.some((d) => d.id === 'bali'));

  // Step 6: User unbookmarks 'bali' from within detail modal
  store.toggleBookmark('bali');
  drawerItems = store.getBookmarkedDestinations();
  assert.equal(drawerItems.length, 2);
  assert.equal(store.isBookmarked('bali'), false);

  // Step 7: Browser refresh simulation - verify persistent storage restoration
  const newSessionStore = createBookmarkStore(storage);
  assert.equal(newSessionStore.getBookmarks().length, 2);
  assert.equal(newSessionStore.isBookmarked('gangneung'), true);
  assert.equal(newSessionStore.isBookmarked(top1.id), true);
  assert.equal(newSessionStore.isBookmarked('bali'), false);
});

test('Modal Props Adapter: Detail modal fallback logic when passed destination directly', () => {
  const jeju = MOCK_DESTINATIONS.find((d) => d.id === 'jeju')!;
  assert.ok(jeju);

  // Simulate DestinationDetailModal data resolution
  function resolveModalData(props: { scoreItem?: RecommendationScore | null; destination?: Destination | null }) {
    const activeDest = props.scoreItem ? props.scoreItem.destination : props.destination || null;
    if (!activeDest) return null;
    return {
      dest: activeDest,
      matchPercentage: props.scoreItem ? props.scoreItem.matchPercentage : 95,
      tailoredReason: props.scoreItem ? props.scoreItem.tailoredReason : activeDest.whyRecommendedReasons.general,
      matchHighlights: props.scoreItem ? props.scoreItem.matchHighlights : [`'${activeDest.suitableStyles.join(', ')}' 스타일에 잘 부합합니다.`],
    };
  }

  // 1. With scoreItem
  const scoreData = resolveModalData({
    scoreItem: {
      destination: jeju,
      score: 88,
      matchPercentage: 92,
      matchedStyles: ['휴양'],
      tailoredReason: 'Custom reason',
      matchHighlights: ['Highlight 1'],
    },
  });
  assert.equal(scoreData?.matchPercentage, 92);
  assert.equal(scoreData?.tailoredReason, 'Custom reason');
  assert.deepEqual(scoreData?.matchHighlights, ['Highlight 1']);

  // 2. With direct destination (from Drawer)
  const destData = resolveModalData({ destination: jeju });
  assert.equal(destData?.matchPercentage, 95);
  assert.equal(destData?.dest.id, 'jeju');
  assert.ok(destData?.tailoredReason.length > 0);
  assert.deepEqual(destData?.matchHighlights, [`'${jeju.suitableStyles.join(', ')}' 스타일에 잘 부합합니다.`]);

  // 3. With neither
  assert.equal(resolveModalData({}), null);
});

test('Data Integrity: All MOCK_DESTINATIONS have valid structure for bookmarking and detail modal', () => {
  assert.ok(MOCK_DESTINATIONS.length >= 10, 'Expected at least 10 mock destinations');

  const idSet = new Set<string>();
  for (const dest of MOCK_DESTINATIONS) {
    // Unique ID
    assert.ok(dest.id && typeof dest.id === 'string');
    assert.ok(!idSet.has(dest.id), `Duplicate ID found: ${dest.id}`);
    idSet.add(dest.id);

    // Required display fields
    assert.ok(dest.name && typeof dest.name === 'string');
    assert.ok(dest.country && typeof dest.country === 'string');
    assert.ok(dest.region && typeof dest.region === 'string');
    assert.ok(dest.imageUrl && dest.imageUrl.startsWith('https://'));
    assert.ok(dest.summary && typeof dest.summary === 'string');
    assert.ok(dest.estimatedCostPerPerson && typeof dest.estimatedCostPerPerson === 'string');
    assert.ok(Array.isArray(dest.highlightTags) && dest.highlightTags.length > 0);
    assert.ok(Array.isArray(dest.sampleItinerary) && dest.sampleItinerary.length > 0);
    assert.ok(Array.isArray(dest.mustEat) && dest.mustEat.length > 0);
    assert.ok(Array.isArray(dest.travelTips) && dest.travelTips.length > 0);
    assert.ok(dest.whyRecommendedReasons && typeof dest.whyRecommendedReasons.general === 'string');
  }
});

test('Requirement R3: Cross-tab failure recovery when receiving tab had prior storage error', () => {
  const storage = new MockLocalStorage();
  const storeA = createBookmarkStore(storage);
  const storeB = createBookmarkStore(storage);

  // 1. Tab B attempts write when storage throws QuotaExceededError
  storage.shouldThrowOnSet = true;
  storeB.addBookmark('jeju');
  assert.deepEqual(storeB.getBookmarks(), ['jeju']);

  // 2. Storage recovers in background (e.g. user cleaned cookies in Tab A)
  storage.shouldThrowOnSet = false;

  // 3. Tab A writes 'paris'
  storeA.addBookmark('paris');

  // 4. Tab B receives storage event -> isStorageFailing resets and reads fresh data from storage
  assert.deepEqual(storeB.getBookmarks(), ['paris']);
  assert.equal(storeB.isBookmarked('paris'), true);
});

test('Requirement R1: Rapid sequential bookmark toggling maintains synchronous integrity', () => {
  const storage = new MockLocalStorage();
  const store = createBookmarkStore(storage);

  // Toggle 10 times consecutively
  for (let i = 0; i < 10; i++) {
    store.toggleBookmark('jeju');
    if (i % 2 === 0) {
      assert.equal(store.isBookmarked('jeju'), true, `Expected bookmarked on iteration ${i}`);
      assert.deepEqual(store.getBookmarks(), ['jeju']);
    } else {
      assert.equal(store.isBookmarked('jeju'), false, `Expected unbookmarked on iteration ${i}`);
      assert.deepEqual(store.getBookmarks(), []);
    }
  }
});

test('Sanitization Function: Complex nested corruptions and boundary cases', () => {
  const complexCorrupt = [
    '',
    '   ',
    null,
    undefined,
    123,
    true,
    false,
    {},
    { id: 'jeju' },
    ['jeju'],
    'jeju',
    'non_existent_123',
    'fukuoka',
    'jeju', // duplicate
    'danang',
    'danang', // duplicate
  ];

  const sanitized = sanitizeBookmarkIds(complexCorrupt);
  assert.deepEqual(sanitized, ['jeju', 'fukuoka', 'danang']);
});
