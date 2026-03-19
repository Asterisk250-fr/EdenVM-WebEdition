let vm;
let uploadedISO = null;

const VM_SETTINGS = {
  ram: 512,
  vram: 32,
  diskSize: 0
};

// ISO upload
document.getElementById("isoUpload").onchange = function(e) {
  const file = e.target.files[0];
  const reader = new FileReader();

  reader.onload = function() {
    uploadedISO = new Uint8Array(reader.result);
    alert("ISO loaded!");
  };

  reader.readAsArrayBuffer(file);
};

// Start VM
async function startVM() {
  const selectedDisk = document.getElementById("diskSelect").value;
  let diskBuffer = null;

  if (selectedDisk) {
    diskBuffer = await loadDisk(selectedDisk);
    VM_SETTINGS.diskSize = diskBuffer.byteLength / (1024 * 1024);
  }

  vm = new V86Starter({
    wasm_path: "https://copy.sh/v86/build/v86.wasm",

    memory_size: VM_SETTINGS.ram * 1024 * 1024,
    vga_memory_size: VM_SETTINGS.vram * 1024 * 1024,

    screen_container: document.getElementById("screen"),

    bios: { url: "https://copy.sh/v86/bios/seabios.bin" },
    vga_bios: { url: "https://copy.sh/v86/bios/vgabios.bin" },

    cdrom: uploadedISO
      ? { buffer: uploadedISO }
      : { url: "https://copy.sh/v86/images/tinycore.iso" },

    hda: diskBuffer ? { buffer: diskBuffer } : undefined,

    boot_order: 0x132,
    autostart: true,
  });

  goFullscreen();
  startStats();
}

// Fullscreen
function goFullscreen() {
  const el = document.documentElement;
  if (el.requestFullscreen) el.requestFullscreen();
}

// Stats
function startStats() {
  setInterval(() => {
    document.getElementById("cpu").innerText =
      (Math.random() * 100).toFixed(1) + "%";

    document.getElementById("ram").innerText =
      VM_SETTINGS.ram + "MB";

    document.getElementById("disk").innerText =
      VM_SETTINGS.diskSize
        ? VM_SETTINGS.diskSize.toFixed(0) + "MB"
        : "None";
  }, 1000);
}

// Load disks on startup
window.onload = () => {
  refreshDisks();
};
