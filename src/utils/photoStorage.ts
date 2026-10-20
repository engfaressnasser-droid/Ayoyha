import { MemoryImage } from '../types';

const DB_NAME = 'RomanticAppPhotosDB';
const DB_VERSION = 1;
const STORE_NAME = 'memories_store';

function openPhotoDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB is not supported'));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function saveMemoriesToIndexedDB(memories: MemoryImage[]): Promise<void> {
  try {
    const db = await openPhotoDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);

      // Clear old entries and save updated list
      const clearReq = store.clear();
      clearReq.onsuccess = () => {
        for (const item of memories) {
          store.put(item);
        }
      };

      tx.oncomplete = () => {
        db.close();
        resolve();
      };
      tx.onerror = () => reject(tx.error);
    });
  } catch (err) {
    console.warn('Failed to save memories to IndexedDB:', err);
  }
}

export async function getMemoriesFromIndexedDB(): Promise<MemoryImage[] | null> {
  try {
    const db = await openPhotoDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => {
        const result = request.result as MemoryImage[] | undefined;
        resolve(result && result.length > 0 ? result : null);
      };

      request.onerror = () => reject(request.error);
      tx.oncomplete = () => db.close();
    });
  } catch (err) {
    console.warn('Failed to load memories from IndexedDB:', err);
    return null;
  }
}
