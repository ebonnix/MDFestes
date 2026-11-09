/**
 * Offline queue for proof submissions (IndexedDB). Estes Park canyons lose
 * signal; the driver can still take the stamped photo and it uploads when the
 * phone is back online.
 */

export type QueuedProof = {
  id: string;
  createdAt: number;
  payload: {
    stopId?: number;
    propertyId: number;
    kind: "before" | "after";
    imageBase64: string;
    lat: number | null;
    lng: number | null;
    accuracyM: number | null;
    locationSource: "gps" | "property" | "manual";
    capturedAt: string;
    note?: string;
    notifyOwnerNow: boolean;
  };
  previewDataUrl?: string;
  address: string;
};

const DB = "plowops";
const STORE = "proofQueue";

function open(): Promise<IDBDatabase> {
  return new Promise((res, rej) => {
    const r = indexedDB.open(DB, 1);
    r.onupgradeneeded = () => {
      if (!r.result.objectStoreNames.contains(STORE)) r.result.createObjectStore(STORE, { keyPath: "id" });
    };
    r.onsuccess = () => res(r.result);
    r.onerror = () => rej(r.error);
  });
}

function tx<T>(mode: IDBTransactionMode, fn: (s: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  return open().then(
    db =>
      new Promise<T>((res, rej) => {
        const t = db.transaction(STORE, mode);
        const req = fn(t.objectStore(STORE));
        req.onsuccess = () => res(req.result);
        req.onerror = () => rej(req.error);
      }),
  );
}

export const proofQueue = {
  supported: () => typeof indexedDB !== "undefined",
  async add(item: QueuedProof) {
    await tx("readwrite", s => s.put(item));
  },
  async all(): Promise<QueuedProof[]> {
    try {
      const rows = await tx<QueuedProof[]>("readonly", s => s.getAll());
      return rows.sort((a, b) => a.createdAt - b.createdAt);
    } catch {
      return [];
    }
  },
  async remove(id: string) {
    await tx("readwrite", s => s.delete(id));
  },
  async count(): Promise<number> {
    try {
      return await tx<number>("readonly", s => s.count());
    } catch {
      return 0;
    }
  },
};
