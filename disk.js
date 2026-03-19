const DB_NAME = "VM_DISKS";
const STORE_NAME = "disks";

function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);

    req.onupgradeneeded = () => {
      req.result.createObjectStore(STORE_NAME);
    };

    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function saveDisk(name, buffer) {
  const db = await openDB();
  const tx = db.transaction(STORE_NAME, "readwrite");
  tx.objectStore(STORE_NAME).put(buffer, name);
  return tx.complete;
}

async function loadDisk(name) {
  const db = await openDB();
  const tx = db.transaction(STORE_NAME, "readonly");
  return new Promise((resolve) => {
    const req = tx.objectStore(STORE_NAME).get(name);
    req.onsuccess = () => resolve(req.result);
  });
}

async function listDisks() {
  const db = await openDB();
  const tx = db.transaction(STORE_NAME, "readonly");
  return new Promise((resolve) => {
    const req = tx.objectStore(STORE_NAME).getAllKeys();
    req.onsuccess = () => resolve(req.result);
  });
}

async function createDisk(name, sizeMB) {
  const size = sizeMB * 1024 * 1024;
  const buffer = new Uint8Array(size);

  await saveDisk(name, buffer);
  alert(`Disk "${name}" created (${sizeMB}MB)`);
}
