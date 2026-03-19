let vm;

const settings = {
  ram: 256, // MB
  vram: 16, // MB
};

document.getElementById("startBtn").onclick = () => {
  startVM();
};

function startVM() {
  vm = new V86Starter({
    wasm_path: "v86.wasm",
    memory_size: settings.ram * 1024 * 1024,
    vga_memory_size: settings.vram * 1024 * 1024,

    screen_container: document.getElementById("screen"),

    bios: { url: "bios/seabios.bin" },
    vga_bios: { url: "bios/vgabios.bin" },

    cdrom: {
      url: "ISO/TinyCore-current.iso"
    },

    boot_order: 0x132, // CD first

    autostart: true,
  });

  enableFullscreen();
  startStats();
}

function enableFullscreen() {
  const el = document.documentElement;

  if (el.requestFullscreen) {
    el.requestFullscreen();
  }
}

function startStats() {
  setInterval(() => {
    // Fake stats (real ones are limited in browser VM)
    document.getElementById("cpu").innerText =
      (Math.random() * 100).toFixed(1) + "%";

    document.getElementById("ram").innerText =
      settings.ram + "MB";

    document.getElementById("disk").innerText =
      "N/A";
  }, 1000);
}
