self.addEventListener("install", () => {
    self.skipWaiting();
});

self.addEventListener("activate", () => {
    console.log("Service Worker Active");
});

self.addEventListener("fetch", (event) => {
    // pass-through
});
