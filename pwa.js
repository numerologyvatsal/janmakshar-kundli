(function () {
  "use strict";

  const installButton = document.getElementById("install-app");
  const networkStatus = document.getElementById("network-status");
  const updateNotice = document.getElementById("pwa-update");
  const refreshButton = document.getElementById("refresh-app");
  let installPrompt = null;
  let waitingWorker = null;
  let reloading = false;

  function updateNetworkState() {
    if (networkStatus) networkStatus.hidden = navigator.onLine;
    document.documentElement.classList.toggle("is-offline", !navigator.onLine);
  }

  window.addEventListener("online", updateNetworkState);
  window.addEventListener("offline", updateNetworkState);
  updateNetworkState();

  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    installPrompt = event;
    if (installButton) installButton.hidden = false;
  });

  installButton?.addEventListener("click", async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    await installPrompt.userChoice;
    installPrompt = null;
    installButton.hidden = true;
  });

  window.addEventListener("appinstalled", () => {
    installPrompt = null;
    if (installButton) installButton.hidden = true;
  });

  if (!("serviceWorker" in navigator)) return;

  navigator.serviceWorker.addEventListener("controllerchange", () => {
    if (reloading) return;
    reloading = true;
    window.location.reload();
  });

  navigator.serviceWorker.register("./service-worker.js", { scope: "./" }).then((registration) => {
    if (registration.waiting) {
      waitingWorker = registration.waiting;
      updateNotice.hidden = false;
    }
    registration.addEventListener("updatefound", () => {
      const worker = registration.installing;
      worker?.addEventListener("statechange", () => {
        if (worker.state === "installed" && navigator.serviceWorker.controller) {
          waitingWorker = worker;
          updateNotice.hidden = false;
        }
      });
    });
  }).catch(() => {
    /* The website remains usable online when service-worker registration is unavailable. */
  });

  refreshButton?.addEventListener("click", () => {
    waitingWorker?.postMessage({ type: "SKIP_WAITING" });
  });
})();
