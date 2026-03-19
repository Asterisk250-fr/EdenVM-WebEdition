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
}

async function loadDisk(name) {
  const db = await openDB();
  const tx = db.transaction(STORE_NAME, "readonly");

  return new Promise(resolve => {
    const req = tx.objectStore(STORE_NAME).get(name);
    req.onsuccess = () => resolve(req.result);
  });
}

async function listDisks() {
  const db = await openDB();
  const tx = db.transaction(STORE_NAME, "readonly");

  return new Promise(resolve => {
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

// UI helpers
async function refreshDisks() {
  const list = await listDisks();
  const select = document.getElementById("diskSelect");

  select.innerHTML = "";

  list.forEach(name => {
    const opt = document.createElement("option");
    opt.value = name;
    opt.innerText = name;
    select.appendChild(opt);
  });
}

function createDiskPrompt() {
  const name = prompt("Disk name?");
  const size = parseInt(prompt("Size in MB?"));

  if (!name || !size) return;

  createDisk(name, size).then(refreshDisks);
}
