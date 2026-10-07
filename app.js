/**
 * FraudLens AI - Application Controller & Protected Router
 * Coordinates authentication state, top header, sidebar navigation, protected pages, and global events
 */

window.FraudLensApp = (function () {
  let currentPage = "overview";

  // Page registry resolved lazily (at navigation time) so script load order
  // or a late-loading page file can never leave an entry permanently undefined.
  const pageNames = {
    login: "FraudLensLoginPage",
    overview: "FraudLensOverviewPage",
    transactions: "FraudLensTransactionsPage",
    fraudRings: "FraudLensFraudRingsPage",
    network: "FraudLensNetworkPage",
    accounts: "FraudLensAccountsPage",
    explainableAi: "FraudLensExplainableAiPage",
    alerts: "FraudLensAlertsPage",
    settings: "FraudLensSettingsPage",
    landing: "FraudLensLandingPage"
  };

  const pages = new Proxy({}, {
    get: (_, id) => window[pageNames[id]],
    has: (_, id) => id in pageNames
  });

  function renderPageError(pageId, message) {
    const el = document.getElementById("appContent");
    if (!el) return;
    el.innerHTML = `
      <div style="margin:40px auto;max-width:720px;padding:24px;border-radius:12px;
                  background:rgba(239,68,68,.1);border:1px solid rgba(239,68,68,.45);color:#fecaca;font-family:system-ui,sans-serif">
        <h2 style="margin:0 0 8px;color:#fff">Could not load "${pageId}" page</h2>
        <p style="margin:0 0 10px">${message}</p>
        <p style="margin:0;font-size:12px;color:#fca5a5">Open the browser console (F12 → Console) for the full error.</p>
      </div>`;
  }

  function init() {
    // Render top header and sidebar shell
    FraudLensHeader.render("headerContainer");
    FraudLensSidebar.render("sidebarContainer", currentPage);
    renderFooter("footerContainer");

    // Check initial authentication state
    const isAuth = window.FraudLensAuth && window.FraudLensAuth.isAuthenticated();

    if (!isAuth) {
      currentPage = "login";
      window.location.hash = "login";
    } else {
      // Check URL hash for initial route if authenticated
      const hash = window.location.hash.replace("#", "");
      if (hash && pages[hash] && hash !== "login") {
        currentPage = hash;
      } else {
        currentPage = "overview";
        window.location.hash = "overview";
      }
    }

    // Render active page
    navigate(currentPage, false);

    // Listen to hash changes with Auth Guard
    window.addEventListener("hashchange", () => {
      const newHash = window.location.hash.replace("#", "");
      if (newHash && pages[newHash] && newHash !== currentPage) {
        navigate(newHash, false);
      }
    });

    console.log("FraudLens AI initialized successfully. Authentication Guard Active.");
  }

  function navigate(pageId, updateHash = true) {
    const isAuth = window.FraudLensAuth && window.FraudLensAuth.isAuthenticated();

    // Route Guard: Redirect unauthenticated access to login
    if (!isAuth) {
      pageId = "login";
    } else if (pageId === "login" && isAuth) {
      // If already authenticated and trying to visit login, redirect to overview
      pageId = "overview";
    }

    if (!pages[pageId]) {
      pageId = isAuth ? "overview" : "login";
    }

    currentPage = pageId;
    if (updateHash) {
      window.location.hash = pageId;
    }

    const sidebarEl = document.getElementById("sidebarContainer");
    const headerEl = document.getElementById("headerContainer");
    const footerEl = document.getElementById("footerContainer");
    const mainWrapperEl = document.querySelector(".main-wrapper");

    // Toggle Dashboard Shell Visibility for Login vs Protected Pages
    if (pageId === "login") {
      if (sidebarEl) sidebarEl.style.display = "none";
      if (headerEl) headerEl.style.display = "none";
      if (footerEl) footerEl.style.display = "none";
      if (mainWrapperEl) {
        mainWrapperEl.style.marginLeft = "0";
        mainWrapperEl.style.width = "100%";
      }
    } else {
      if (sidebarEl) sidebarEl.style.display = "";
      if (headerEl) headerEl.style.display = "";
      if (footerEl) footerEl.style.display = "";
      if (mainWrapperEl) {
        mainWrapperEl.style.marginLeft = "";
        mainWrapperEl.style.width = "";
      }
      // Update sidebar active link
      FraudLensSidebar.setActive(pageId);
    }

    // Render page (errors are shown on screen instead of leaving a blank page)
    const pageObj = pages[pageId];
    if (!pageObj || typeof pageObj.render !== "function") {
      const msg = `window.${pageNames[pageId]} is not defined. Check that its &lt;script&gt; file exists, the path is correct, and it has no syntax errors.`;
      console.error("[FraudLens] " + msg);
      renderPageError(pageId, msg);
    } else {
      try {
        pageObj.render("appContent");
      } catch (err) {
        console.error(`[FraudLens] Error rendering "${pageId}":`, err);
        const stack = (err && err.stack ? err.stack : "").split("\n").slice(0, 4).join("<br>").replace(/</g, "&lt;").replace(/&lt;br>/g, "<br>");
        renderPageError(pageId, "Render error: " + (err && err.message ? err.message : err) +
          (stack ? `<br><code style="display:block;margin-top:8px;font-size:12px;color:#fda4af;white-space:pre-wrap">${stack}</code>` : ""));
      }
    }

    // Scroll to top of app content
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function renderFooter(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
      <footer class="app-footer">
        <div class="footer-top-row">
          <div class="footer-brand-block">
            <div class="footer-brand-title">FraudLens AI</div>
            <div class="footer-tagline">Real-Time Financial Fraud Intelligence</div>
            <div class="footer-desc">Built for detecting coordinated financial fraud, synthetic identities, and syndicate rings.</div>
          </div>
          <div class="footer-nav-links">
            <span class="footer-link" onclick="FraudLensApp.navigate('landing')">Landing</span>
            <span class="footer-link" onclick="FraudLensApp.navigate('overview')">Dashboard</span>
            <span class="footer-link" onclick="FraudLensApp.navigate('transactions')">Transactions</span>
            <span class="footer-link" onclick="FraudLensApp.navigate('fraudRings')">Fraud Rings</span>
            <span class="footer-link" onclick="FraudLensApp.navigate('network')">Network</span>
            <span class="footer-link" onclick="FraudLensApp.navigate('explainableAi')">AI Insights</span>
            <span class="footer-link" onclick="FraudLensApp.navigate('settings')">Settings</span>
          </div>
        </div>
        <div class="footer-bottom-row">
          <span class="footer-copy">© 2026 FraudLens AI • HNX26PSI04 • Hackathon Prototype Build</span>
          <span class="footer-status-pill">● System Status: Engine Active</span>
        </div>
      </footer>
    `;
  }

  return {
    init,
    navigate,
    getCurrentPage: () => currentPage
  };
})();

// Auto bootstrap when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  FraudLensApp.init();
});