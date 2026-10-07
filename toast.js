/**
 * FraudLens AI - Toast Notification System
 * Delivers immediate interactive feedback for operator actions
 */

window.FraudLensToast = (function () {
  let toastContainer = null;

  function ensureContainer() {
    if (!toastContainer) {
      toastContainer = document.createElement("div");
      toastContainer.className = "fraudlens-toast-container";
      document.body.appendChild(toastContainer);
    }
  }

  function show(title, message, type = "info", duration = 4000) {
    ensureContainer();

    const toast = document.createElement("div");
    toast.className = `fraudlens-toast toast-${type}`;

    const iconMap = {
      success: "✓",
      danger: "✕",
      warning: "⚠",
      info: "ℹ"
    };

    toast.innerHTML = `
      <div class="toast-icon">${iconMap[type] || "ℹ"}</div>
      <div class="toast-body">
        <div class="toast-title">${title}</div>
        <div class="toast-message">${message}</div>
      </div>
      <button class="toast-close" onclick="this.parentElement.remove()">×</button>
    `;

    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.classList.add("fade-out");
      setTimeout(() => {
        if (toast.parentElement) toast.parentElement.removeChild(toast);
      }, 300);
    }, duration);
  }

  return {
    show,
    success: (title, msg) => show(title, msg, "success"),
    danger: (title, msg) => show(title, msg, "danger"),
    warning: (title, msg) => show(title, msg, "warning"),
    info: (title, msg) => show(title, msg, "info")
  };
})();
