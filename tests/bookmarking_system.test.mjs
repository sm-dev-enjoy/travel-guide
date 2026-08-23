import test from 'node:test';
import assert from 'node:assert/strict';

// Load mock destinations
const { MOCK_DESTINATIONS } = await import('../src/data/destinations.ts');
const { calculateRecommendations } = await import('../src/utils/recommendationEngine.ts');

const STORAGE_KEY = 'tripfinder_bookmarks';

// In-memory mock localStorage for testing
class MockLocalStorage {
  constructor() {
    this.store = new Map();
  }
  getItem(key) {
    return this.store.has(key) ? this.store.get(key) : null;
  }
  setItem(key, value) {
    this.store.set(key, String(value));
  }
  removeItem(key) {
    this.store.delete(key);
  }
  clear() {
    this.store.clear();
  }
}

// Logic replicate matching BookmarkContext implementation
function createBookmarkStore(storage) {
  let listeners = [];

  function subscribe(listener) {
    listeners.push(listener);
    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  }

  function notify() {
    listeners.forEach((l) => l());
  }

  function getRawSnapshot() {
    return storage.getItem(STORAGE_KEY) || '[]';
  }

  function getBookmarks() {
    try {
      const raw = getRawSnapshot();
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed.filter(
          (id) => typeof id === 'string' && MOCK_DESTINATIONS.some((d) => d.id === id)
        );
      }
    } catch {
      // ignore
    }
    return [];
  }

  function persistBookmarks(newBookmarks) {
    storage.setItem(STORAGE_KEY, JSON.stringify(newBookmarks));
    notify();
  }

  function isBookmarked(id) {
    return getBookmarks().includes(id);
  }

  function addBookmark(id) {
    const current = getBookmarks();
    if (!current.includes(id)) {
      persistBookmarks([...current, id]);
    }
  }

  function removeBookmark(id) {
    const current = getBookmarks();
    persistBookmarks(current.filter((item) => item !== id));
  }

  function toggleBookmark(id) {
    const current = getBookmarks();
    if (current.includes(id)) {
      persistBookmarks(current.filter((item) => item !== id));
    } else {
      persistBookmarks([...current, id]);
    }
  }

  function clearBookmarks() {
    persistBookmarks([]);
  }

  function getBookmarkedDestinations() {
    const ids = getBookmarks();
    return ids
      .map((id) => MOCK_DESTINATIONS.find((dest) => dest.id === id))
      .filter((dest) => dest !== undefined);
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

  // 3. Toggle off
  store.toggleBookmark('jeju');
  assert.equal(store.isBookmarked('jeju'), false);
  assert.deepEqual(store.getBookmarks(), []);

  // 4. Toggle on
  store.toggleBookmark('fukuoka');
  assert.equal(store.isBookmarked('fukuoka'), true);
  assert.deepEqual(store.getBookmarks(), ['fukuoka']);
  assert.equal(store.getBookmarkedDestinations()[0].name, '후쿠오카');
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

  // Clear all
  store.clearBookmarks();
  assert.deepEqual(store.getBookmarks(), []);
  assert.equal(store.getBookmarkedDestinations().length, 0);
  assert.equal(storage.getItem(STORAGE_KEY), '[]');
});

test('Requirement R3 & Store: LocalStorage hydration and filtering corrupt/invalid data', () => {
  const storage = new MockLocalStorage();

  // Pre-seed storage with mix of valid IDs, non-existent IDs, and corrupt types
  const corruptPayload = ['jeju', 'invalid_destination_id_999', 12345, null, 'interlaken', 'unknown'];
  storage.setItem(STORAGE_KEY, JSON.stringify(corruptPayload));

  const store = createBookmarkStore(storage);
  const loaded = store.getBookmarks();

  // Only valid destination IDs that exist in MOCK_DESTINATIONS should be retained
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
  const drawerItems = store.getBookmarkedDestinations();
  assert.equal(drawerItems.length, 3);
  assert.ok(drawerItems.some((d) => d.id === 'gangneung'));
  assert.ok(drawerItems.some((d) => d.id === top1.id));
  assert.ok(drawerItems.some((d) => d.id === 'bali'));

  // Step 6: Browser refresh simulation - verify persistent storage restoration
  const newSessionStore = createBookmarkStore(storage);
  assert.equal(newSessionStore.getBookmarks().length, 3);
  assert.equal(newSessionStore.isBookmarked('gangneung'), true);
  assert.equal(newSessionStore.isBookmarked(top1.id), true);
  assert.equal(newSessionStore.isBookmarked('bali'), true);
});

test('Data Integrity: All MOCK_DESTINATIONS have valid structure for bookmarking and detail modal', () => {
  assert.ok(MOCK_DESTINATIONS.length >= 10, 'Expected at least 10 mock destinations');

  const idSet = new Set();
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
