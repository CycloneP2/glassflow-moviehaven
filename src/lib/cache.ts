// Cache management utilities

export async function clearAllCache() {
  try {
    // Clear IndexedDB
    const dbs = await indexedDB.databases();
    for (const db of dbs) {
      if (db.name === "SansekaiCache") {
        indexedDB.deleteDatabase(db.name);
      }
    }
    console.log("✅ Cache cleared successfully");
  } catch (error) {
    console.error("Error clearing cache:", error);
  }
}

export async function getCacheSize() {
  try {
    if (!navigator.storage?.estimate) return null;
    const estimate = await navigator.storage.estimate();
    return {
      usage: estimate.usage,
      quota: estimate.quota,
      percentage: ((estimate.usage || 0) / (estimate.quota || 1)) * 100,
    };
  } catch {
    return null;
  }
}

export async function requestPersistentStorage() {
  try {
    if (navigator.storage?.persist) {
      const persistent = await navigator.storage.persist();
      console.log("Persistent storage:", persistent ? "granted" : "denied");
      return persistent;
    }
  } catch {
    return false;
  }
}
