/**
 * FraudLens AI - Sidebar Navigation Component
 * Provides clean navigation between platform modules and engine status
 */

window.FraudLensSidebar = (function () {
  const navItems = [
    { id: "overview", label: "Overview", icon: "📊", badge: null },
    { id: "transactions", label: "Transactions", icon: "⚡", badge: "LIVE" },
    { id: "fraudRings", label: "Fraud Rings", icon: "🕸️", badge: "7" },
    { id: "network", label: "Network", icon: "🌐", badge: "Graph" },
    { id: "accounts", label: "Accounts", icon: "👥", badge: "48" },
    { id: "explainableAi", label: "AI Insights", icon: "🧠", badge: "XAI" },
    { id: "alerts", label: "Alerts", icon: "🚨", badge: "4" },
    { id: "settings", label: "Settings", icon: "⚙️", badge: null }
  ];

  function render(containerId, activePage = "overview") {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
      <aside class="sidebar" id="mainSidebar">
        <!-- Brand Logo Block -->
        <div class="sidebar-brand" onclick="FraudLensApp.navigate('overview')">
          <div class="brand-logo-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polygon points="12 2 2 7 12 12 22 7 12 2" stroke="#00f2fe"/>
              <polyline points="2 17 12 22 22 17" stroke="#38bdf8"/>
              <polyline points="2 12 12 17 22 12" stroke="#60a5fa"/>
            </svg>
          </div>
          <div class="brand-text">
            <span class="brand-title">FraudLens AI</span>
            <span class="brand-edition">Enterprise SOC</span>
          </div>
        </div>

        <!-- Navigation Menu -->
        <nav class="sidebar-nav">
          <div class="nav-section-label">INTELLIGENCE PLATFORM</div>
          <ul class="nav-list">
            ${navItems.map(item => `
              <li class="nav-item">
                <button class="nav-link ${item.id === activePage ? 'active' : ''}" onclick="FraudLensApp.navigate('${item.id}'); FraudLensSidebar.closeMobile();">
                  <span class="nav-icon">${item.icon}</span>
                  <span class="nav-label">${item.label}</span>
                  ${item.badge ? `<span class="nav-badge ${item.id === 'transactions' ? 'badge-pulse' : ''}">${item.badge}</span>` : ''}
                </button>
              </li>
            `).join("")}
          </ul>
        </nav>

        <!-- Quick Demo Callout Box -->
        <div class="sidebar-promo-box" onclick="FraudLensModal.showDemoModal()">
          <div class="promo-header">
            <span class="promo-icon">✨</span>
            <span class="promo-title">Hackathon Demo</span>
          </div>
          <div class="promo-desc">Simulate Ring #FR-07 coordinated attack lifecycle.</div>
          <button class="promo-btn">Launch Scenario →</button>
        </div>

        <!-- Authenticated User & Logout Strip -->
        <div class="sidebar-user-card">
          <div class="sidebar-user-left">
            <div class="sidebar-user-avatar">A</div>
            <div>
              <span class="sidebar-user-name">Admin (SOC Lead)</span>
              <span class="sidebar-user-badge">● Session Active</span>
            </div>
          </div>
          <button class="sidebar-logout-btn" onclick="FraudLensAuth.logout()" title="Logout">
            ⏻
          </button>
        </div>

        <!-- Bottom System Status -->
        <div class="sidebar-status-footer">
          <div class="status-indicator-box">
            <span class="engine-pulse-dot"></span>
            <div class="status-copy">
              <span class="status-name">System Status</span>
              <span class="status-state">Detection Engine Online</span>
            </div>
          </div>
          <div class="status-details">
            <span>Latency: 14.8ms</span>
            <span>Graph Nodes: 45</span>
          </div>
        </div>
      </aside>
    `;
  }

  function setActive(pageId) {
    const links = document.querySelectorAll(".nav-link");
    links.forEach(l => {
      l.classList.remove("active");
      if (l.getAttribute("onclick") && l.getAttribute("onclick").includes(`'${pageId}'`)) {
        l.classList.add("active");
      }
    });
  }

  function toggleMobile() {
    const sidebar = document.getElementById("mainSidebar");
    if (sidebar) {
      sidebar.classList.toggle("mobile-open");
    }
  }

  function closeMobile() {
    const sidebar = document.getElementById("mainSidebar");
    if (sidebar) {
      sidebar.classList.remove("mobile-open");
    }
  }

  return {
    render,
    setActive,
    toggleMobile,
    closeMobile
  };
})();
