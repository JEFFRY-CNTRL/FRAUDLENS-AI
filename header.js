/**
 * FraudLens AI - Top Dashboard Header
 * Includes branding, global search, notifications, live status, and demo triggers
 */

window.FraudLensHeader = (function () {
  function render(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
      <header class="top-header">
        <div class="header-left">
          <button class="mobile-nav-toggle" id="mobileNavToggle" onclick="FraudLensSidebar.toggleMobile()">☰</button>
          <div class="brand-title-group">
            <div class="brand-row">
              <span class="brand-name">FraudLens AI</span>
              <span class="project-code-tag">HNX26PSI04</span>
            </div>
            <span class="brand-tagline">Real-Time Financial Fraud Intelligence</span>
          </div>
        </div>

        <div class="header-right">
          <!-- Global Search Input with Dropdown -->
          <div class="search-container">
            <span class="search-icon">🔍</span>
            <input type="text" id="globalSearchInput" class="search-input" placeholder="Search TXN, Account, Device, Merchant, Ring..." oninput="FraudLensHeader.handleSearch(this.value)" />
            <div id="searchResultsDropdown" class="search-dropdown"></div>
          </div>

          <!-- Live Status Indicator -->
          <div class="live-status-pill" id="liveStatusPill" onclick="FraudLensSimulator.toggle()">
            <span class="pulse-dot"></span>
            <span class="status-text" id="liveStatusText">LIVE MONITORING</span>
          </div>

          <!-- Demo Mode Trigger Button -->
          <button class="btn btn-demo-pill" onclick="FraudLensModal.showDemoModal()">
            <span class="demo-sparkle">✨</span>
            <span>Demo Mode</span>
          </button>

          <!-- Notification Bell -->
          <div class="header-icon-btn notification-btn" onclick="FraudLensApp.navigate('alerts')">
            <span class="icon">🔔</span>
            <span class="notification-badge" id="alertCountBadge">4</span>
          </div>

          <!-- Last Updated Timestamp -->
          <div class="last-updated-chip" id="lastUpdatedChip">
            <span class="update-label">Updated:</span>
            <span class="update-time" id="lastUpdateTime">Just now</span>
          </div>

          <!-- Authenticated User Chip & Logout Button -->
          <div class="header-user-chip" id="headerUserChip">
            <div class="user-avatar-dot">A</div>
            <div class="user-info-text">
              <span class="user-name-tag">Admin</span>
              <span class="user-role-tag">SOC Lead</span>
            </div>
          </div>

          <button class="btn-header-logout" onclick="FraudLensAuth.logout()" title="Sign out of SOC terminal">
            <span>⏻</span>
            <span>Logout</span>
          </button>
        </div>
      </header>
    `;

    // Hook up simulator status updates
    FraudLensSimulator.subscribe((type, data) => {
      if (type === "status") {
        const text = document.getElementById("liveStatusText");
        const pill = document.getElementById("liveStatusPill");
        if (text && pill) {
          if (data.isRunning) {
            text.textContent = "LIVE MONITORING";
            pill.classList.remove("paused");
          } else {
            text.textContent = "SIMULATION PAUSED";
            pill.classList.add("paused");
          }
        }
      } else if (type === "new_transaction") {
        const timeEl = document.getElementById("lastUpdateTime");
        if (timeEl) {
          timeEl.textContent = data.timestamp;
        }
      }
    });

    // Close search dropdown on click outside
    document.addEventListener("click", (e) => {
      const searchBox = document.querySelector(".search-container");
      const dropdown = document.getElementById("searchResultsDropdown");
      if (searchBox && dropdown && !searchBox.contains(e.target)) {
        dropdown.classList.remove("active");
      }
    });
  }

  function handleSearch(query) {
    const dropdown = document.getElementById("searchResultsDropdown");
    if (!dropdown) return;

    const q = (query || "").trim().toLowerCase();
    if (!q || q.length < 2) {
      dropdown.classList.remove("active");
      dropdown.innerHTML = "";
      return;
    }

    const matches = [];

    // Search transactions
    window.FraudLensData.initialTransactions.forEach(t => {
      if (t.id.toLowerCase().includes(q) || t.accountId.toLowerCase().includes(q) || t.merchant.toLowerCase().includes(q)) {
        matches.push({ type: "Transaction", id: t.id, title: `${t.id} - ${t.merchant} ($${t.amount.toFixed(2)})`, extra: `Risk: ${t.riskScore}/100`, action: () => FraudLensModal.showXaiModal(t.id) });
      }
    });

    // Search accounts
    window.FraudLensData.accounts.forEach(a => {
      if (a.id.toLowerCase().includes(q) || a.holderName.toLowerCase().includes(q)) {
        matches.push({ type: "Account", id: a.id, title: `${a.id} - ${a.holderName}`, extra: `Risk: ${a.riskScore}/100 (${a.status})`, action: () => { FraudLensApp.navigate("accounts"); } });
      }
    });

    // Search devices
    window.FraudLensData.devices.forEach(d => {
      if (d.id.toLowerCase().includes(q) || d.name.toLowerCase().includes(q)) {
        matches.push({ type: "Device", id: d.id, title: `${d.id} - ${d.name}`, extra: `${d.linkedAccounts} accounts linked`, action: () => { FraudLensApp.navigate("network"); setTimeout(() => FraudLensNetworkGraph.focusNodeById(d.id), 200); } });
      }
    });

    // Search fraud rings
    window.FraudLensData.fraudRings.forEach(r => {
      if (r.id.toLowerCase().includes(q) || r.name.toLowerCase().includes(q)) {
        matches.push({ type: "Fraud Ring", id: r.id, title: `${r.id} - ${r.name}`, extra: `Risk: ${r.riskScore}/100 (${r.accountsCount} accounts)`, action: () => FraudLensModal.showInvestigationModal(r.id) });
      }
    });

    if (matches.length === 0) {
      dropdown.innerHTML = `<div class="search-item empty">No results matching "${q}"</div>`;
    } else {
      dropdown.innerHTML = matches.slice(0, 6).map(m => `
        <div class="search-item" onclick="FraudLensHeader.triggerSearchAction('${m.type}', '${m.id}')">
          <div class="search-item-header">
            <span class="search-item-type">${m.type}</span>
            <span class="search-item-title">${m.title}</span>
          </div>
          <div class="search-item-extra">${m.extra}</div>
        </div>
      `).join("");
    }

    dropdown.classList.add("active");
  }

  function triggerSearchAction(type, id) {
    const dropdown = document.getElementById("searchResultsDropdown");
    if (dropdown) dropdown.classList.remove("active");

    if (type === "Transaction") {
      FraudLensModal.showXaiModal(id);
    } else if (type === "Fraud Ring") {
      FraudLensModal.showInvestigationModal(id);
    } else if (type === "Account") {
      FraudLensApp.navigate("accounts");
    } else if (type === "Device") {
      FraudLensApp.navigate("network");
      setTimeout(() => FraudLensNetworkGraph.focusNodeById(id), 250);
    }
  }

  return {
    render,
    handleSearch,
    triggerSearchAction
  };
})();
