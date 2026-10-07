/**
 * FraudLens AI - Account Risk Intelligence Page
 * Sortable account directory with deep forensic profiling and drawer drilldown
 */

window.FraudLensAccountsPage = (function () {
  let sortField = "riskScore";
  let sortAsc = false;
  let statusFilter = "ALL";
  let searchQuery = "";

  function render(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
      <div class="page-content accounts-page">
        <!-- Page Header -->
        <div class="page-header-row">
          <div>
            <div class="breadcrumb-tag">ENTITY PROFILING</div>
            <h1 class="page-title">Account Risk Intelligence</h1>
            <p class="page-description">
              Entity graph profiling and behavioral divergence analysis across all registered user accounts and corporate clients.
            </p>
          </div>
          <div class="header-action-group">
            <button class="btn btn-secondary btn-sm" onclick="FraudLensApp.navigate('network')">
              View Accounts in Graph →
            </button>
            <button class="btn btn-demo-pill" onclick="FraudLensModal.showDemoModal()">
              <span>✨</span> Run Judge Demo
            </button>
          </div>
        </div>

        <!-- Filter & Search Toolbar -->
        <div class="table-toolbar">
          <div class="filter-pills-group">
            <button class="filter-pill ${statusFilter === 'ALL' ? 'active' : ''}" onclick="FraudLensAccountsPage.setStatusFilter('ALL')">All Accounts</button>
            <button class="filter-pill ${statusFilter === 'Critical' ? 'active' : ''}" onclick="FraudLensAccountsPage.setStatusFilter('Critical')">Critical</button>
            <button class="filter-pill ${statusFilter === 'High' ? 'active' : ''}" onclick="FraudLensAccountsPage.setStatusFilter('High')">High Risk</button>
            <button class="filter-pill ${statusFilter === 'Medium' ? 'active' : ''}" onclick="FraudLensAccountsPage.setStatusFilter('Medium')">Medium Risk</button>
            <button class="filter-pill ${statusFilter === 'Safe' ? 'active' : ''}" onclick="FraudLensAccountsPage.setStatusFilter('Safe')">Safe / Verified</button>
          </div>

          <div class="search-box-wrap">
            <span class="search-ico">🔍</span>
            <input type="text" class="table-search-input" placeholder="Search Account ID or Holder Name..." value="${searchQuery}" oninput="FraudLensAccountsPage.handleSearch(this.value)" />
          </div>
        </div>

        <!-- Accounts Table -->
        <div class="table-container full-page-table">
          <table class="data-table">
            <thead>
              <tr>
                <th>Account ID</th>
                <th>Holder / Identity</th>
                <th class="sortable-th cursor-pointer" onclick="FraudLensAccountsPage.toggleSort('riskScore')">
                  Risk Score <span class="sort-icon">${sortField === 'riskScore' ? (sortAsc ? '▲' : '▼') : '↕'}</span>
                </th>
                <th class="sortable-th cursor-pointer" onclick="FraudLensAccountsPage.toggleSort('transactionCount')">
                  Transactions <span class="sort-icon">${sortField === 'transactionCount' ? (sortAsc ? '▲' : '▼') : '↕'}</span>
                </th>
                <th>Devices</th>
                <th>Locations</th>
                <th class="sortable-th cursor-pointer" onclick="FraudLensAccountsPage.toggleSort('fraudConnections')">
                  Fraud Connections <span class="sort-icon">${sortField === 'fraudConnections' ? (sortAsc ? '▲' : '▼') : '↕'}</span>
                </th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody id="accountsTableBody">
              ${renderAccountRows()}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  function getSortedAndFilteredAccounts() {
    let list = [...window.FraudLensData.accounts];

    // Status filter
    if (statusFilter !== "ALL") {
      list = list.filter(a => a.status === statusFilter);
    }

    // Search query
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(a => a.id.toLowerCase().includes(q) || a.holderName.toLowerCase().includes(q));
    }

    // Sort
    list.sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];
      if (valA < valB) return sortAsc ? -1 : 1;
      if (valA > valB) return sortAsc ? 1 : -1;
      return 0;
    });

    return list;
  }

  function renderAccountRows() {
    const list = getSortedAndFilteredAccounts();
    if (list.length === 0) {
      return `<tr><td colspan="9" class="empty-table-msg">No accounts found matching current search criteria.</td></tr>`;
    }

    return list.map(a => {
      const isCrit = a.status === "Critical";
      const isHigh = a.status === "High";
      const badgeClass = isCrit ? "badge-critical" : (isHigh ? "badge-high" : (a.status === "Medium" ? "badge-medium" : "badge-safe"));

      return `
        <tr class="cursor-pointer" onclick="FraudLensAccountsPage.showAccountDrawer('${a.id}')">
          <td class="font-mono text-cyan font-semibold">${a.id}</td>
          <td>
            <div class="holder-name">${a.holderName}</div>
            ${a.fraudRingId ? `<span class="ring-tag-pill font-mono">${a.fraudRingId}</span>` : ''}
          </td>
          <td>
            <span class="score-pill ${badgeClass}">${a.riskScore}</span>
          </td>
          <td class="font-semibold">${a.transactionCount}</td>
          <td>
            <div class="device-chips-row">
              ${a.devices.map(d => `<span class="device-chip font-mono">${d}</span>`).join(" ")}
            </div>
          </td>
          <td>${a.locations.join(", ")}</td>
          <td>
            <span class="connections-count ${a.fraudConnections > 4 ? 'text-critical font-bold' : ''}">${a.fraudConnections}</span>
          </td>
          <td><span class="${badgeClass}">${a.status}</span></td>
          <td onclick="event.stopPropagation()">
            <div class="row-actions">
              <button class="btn btn-xs btn-secondary" onclick="FraudLensAccountsPage.showAccountDrawer('${a.id}')">Details</button>
              ${isCrit || isHigh ? `
                <button class="btn btn-xs btn-danger" onclick="FraudLensToast.danger('Account Frozen', '${a.id} has been suspended.');">Freeze</button>
              ` : `
                <button class="btn btn-xs btn-success" onclick="FraudLensToast.success('Account Whitelisted', '${a.id} confirmed safe.');">Verify</button>
              `}
            </div>
          </td>
        </tr>
      `;
    }).join("");
  }

  function toggleSort(field) {
    if (sortField === field) {
      sortAsc = !sortAsc;
    } else {
      sortField = field;
      sortAsc = false;
    }
    updateTable();
  }

  function setStatusFilter(status) {
    statusFilter = status;
    updateTable();
    document.querySelectorAll(".accounts-page .filter-pill").forEach(p => {
      p.classList.remove("active");
      if (p.textContent.includes(status) || (status === 'ALL' && p.textContent.includes('All'))) {
        p.classList.add("active");
      }
    });
  }

  function handleSearch(q) {
    searchQuery = (q || "").trim();
    updateTable();
  }

  function updateTable() {
    const tbody = document.getElementById("accountsTableBody");
    if (tbody) {
      tbody.innerHTML = renderAccountRows();
    }
  }

  function showAccountDrawer(accId) {
    const acc = window.FraudLensData.accounts.find(a => a.id === accId);
    if (!acc) return;

    const isCrit = acc.status === "Critical";
    const isHigh = acc.status === "High";
    const badgeClass = isCrit ? "badge-critical" : (isHigh ? "badge-high" : (acc.status === "Medium" ? "badge-medium" : "badge-safe"));

    const html = `
      <div class="modal-card account-drawer-modal">
        <div class="modal-header">
          <div>
            <span class="${badgeClass}">${acc.status.toUpperCase()} ACCOUNT</span>
            <h2 class="modal-title font-mono">${acc.id}</h2>
            <div class="modal-subtitle">${acc.holderName} • Balance: $${acc.balance.toLocaleString()}</div>
          </div>
          <button class="modal-close-btn" onclick="FraudLensModal.closeModal()">✕</button>
        </div>

        <div class="modal-body">
          <!-- Metric Strip -->
          <div class="drawer-metrics-grid">
            <div class="drawer-metric-item">
              <span class="m-lbl">Calculated Risk</span>
              <span class="m-val ${isCrit ? 'text-critical' : (isHigh ? 'text-orange' : 'text-success')}">${acc.riskScore}/100</span>
            </div>
            <div class="drawer-metric-item">
              <span class="m-lbl">Total Transactions</span>
              <span class="m-val">${acc.transactionCount}</span>
            </div>
            <div class="drawer-metric-item">
              <span class="m-lbl">Fraud Links</span>
              <span class="m-val text-critical">${acc.fraudConnections}</span>
            </div>
            <div class="drawer-metric-item">
              <span class="m-lbl">Syndicate ID</span>
              <span class="m-val text-cyan">${acc.fraudRingId || 'None'}</span>
            </div>
          </div>

          <!-- Flag Reason Callout -->
          <div class="account-flag-banner">
            <div class="flag-banner-title">Forensic Assessment:</div>
            <div class="flag-banner-text">"${acc.flagReason}"</div>
          </div>

          <!-- Linked Devices & Hardware -->
          <div class="drawer-section">
            <h4 class="drawer-section-title">Linked Devices & Hardware Fingerprints</h4>
            <div class="linked-devices-list">
              ${acc.devices.map(dId => {
                const dev = window.FraudLensData.devices.find(d => d.id === dId) || { id: dId, name: "Unregistered Terminal", type: "Unknown" };
                return `
                  <div class="linked-device-item">
                    <span class="dev-icon">📱</span>
                    <div class="dev-info">
                      <span class="dev-name font-mono">${dev.id} (${dev.name})</span>
                      <span class="dev-type">${dev.type}</span>
                    </div>
                    <button class="btn btn-xs btn-secondary" onclick="FraudLensModal.closeModal(); FraudLensApp.navigate('network'); setTimeout(() => FraudLensNetworkGraph.focusNodeById('${dId}'), 200);">
                      Focus in Graph
                    </button>
                  </div>
                `;
              }).join("")}
            </div>
          </div>

          <!-- Geographic Footprint -->
          <div class="drawer-section">
            <h4 class="drawer-section-title">Geographical Footprint</h4>
            <div class="locations-pill-wrap">
              ${acc.locations.map(loc => `<span class="location-pill">📍 ${loc}</span>`).join("")}
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn btn-secondary" onclick="FraudLensModal.closeModal(); FraudLensApp.navigate('network'); setTimeout(() => FraudLensNetworkGraph.focusNodeById('${acc.id}'), 200);">
            View in Network Graph
          </button>
          ${isCrit || isHigh ? `
            <button class="btn btn-danger" onclick="FraudLensToast.danger('Account Frozen', '${acc.id} has been suspended.'); FraudLensModal.closeModal();">
              Freeze Account
            </button>
          ` : `
            <button class="btn btn-success" onclick="FraudLensToast.success('Profile Verified', '${acc.id} whitelisted.'); FraudLensModal.closeModal();">
              Whitelist Profile
            </button>
          `}
        </div>
      </div>
    `;

    FraudLensModal.openModal(html);
  }

  return {
    render,
    toggleSort,
    setStatusFilter,
    handleSearch,
    showAccountDrawer
  };
})();
