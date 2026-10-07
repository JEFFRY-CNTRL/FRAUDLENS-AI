/**
 * FraudLens AI - Real-Time Transaction Intelligence Page
 * Live-streaming table with risk color coding, filters, search, and instant SOC actions
 */

window.FraudLensTransactionsPage = (function () {
  let activeFilter = "ALL";
  let searchQuery = "";

  function render(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
      <div class="page-content transactions-page">
        <!-- Page Header -->
        <div class="page-header-row">
          <div>
            <div class="breadcrumb-tag">TRANSACTION INTELLIGENCE</div>
            <h1 class="page-title">Live Real-Time Transaction Feed</h1>
            <p class="page-description">
              In-flight transactions evaluated in sub-20ms against entity relationships, hardware fingerprints, and syndicate graph models.
            </p>
          </div>
          <div class="header-action-group">
            <button class="btn btn-secondary btn-sm" id="streamToggleBtn" onclick="FraudLensTransactionsPage.toggleStream()">
              <span id="streamToggleIcon">⏸</span> <span id="streamToggleLabel">Pause Stream</span>
            </button>
            <button class="btn btn-demo-pill" onclick="FraudLensModal.showDemoModal()">
              <span>✨</span> Run Ring Demo
            </button>
          </div>
        </div>

        <!-- Filter & Search Toolbar -->
        <div class="table-toolbar">
          <div class="filter-pills-group">
            <button class="filter-pill ${activeFilter === 'ALL' ? 'active' : ''}" onclick="FraudLensTransactionsPage.setFilter('ALL')">All (50+)</button>
            <button class="filter-pill ${activeFilter === 'CRITICAL' ? 'active' : ''}" onclick="FraudLensTransactionsPage.setFilter('CRITICAL')">Critical (90+)</button>
            <button class="filter-pill ${activeFilter === 'HIGH' ? 'active' : ''}" onclick="FraudLensTransactionsPage.setFilter('HIGH')">High (70-89)</button>
            <button class="filter-pill ${activeFilter === 'MEDIUM' ? 'active' : ''}" onclick="FraudLensTransactionsPage.setFilter('MEDIUM')">Medium (40-69)</button>
            <button class="filter-pill ${activeFilter === 'LOW' ? 'active' : ''}" onclick="FraudLensTransactionsPage.setFilter('LOW')">Low / Safe</button>
          </div>

          <div class="search-box-wrap">
            <span class="search-ico">🔍</span>
            <input type="text" class="table-search-input" placeholder="Filter by ID, Account, Device, Merchant..." value="${searchQuery}" oninput="FraudLensTransactionsPage.handleSearch(this.value)" />
          </div>
        </div>

        <!-- Transaction Feed Table -->
        <div class="table-container full-page-table">
          <table class="data-table">
            <thead>
              <tr>
                <th>Transaction ID</th>
                <th>Account</th>
                <th>Amount</th>
                <th>Merchant</th>
                <th>Location</th>
                <th>Device</th>
                <th>Risk Score</th>
                <th>Risk Level</th>
                <th>Detection Reason</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody id="liveTxnTableBody">
              ${renderTableRows()}
            </tbody>
          </table>
        </div>
      </div>
    `;

    // Hook simulator for live row injection
    FraudLensSimulator.subscribe((type, data) => {
      if (type === "new_transaction" && data) {
        const tbody = document.getElementById("liveTxnTableBody");
        if (tbody) {
          if (matchesFilter(data)) {
            const rowHtml = buildRowHtml(data, true);
            tbody.insertAdjacentHTML("afterbegin", rowHtml);
          }
        }
      }
    });
  }

  function matchesFilter(t) {
    if (activeFilter !== "ALL" && t.riskLevel !== activeFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        t.id.toLowerCase().includes(q) ||
        t.accountId.toLowerCase().includes(q) ||
        t.merchant.toLowerCase().includes(q) ||
        t.device.toLowerCase().includes(q) ||
        t.location.toLowerCase().includes(q)
      );
    }
    return true;
  }

  function buildRowHtml(t, isNew = false) {
    const isCrit = t.riskLevel === "CRITICAL";
    const isHigh = t.riskLevel === "HIGH";
    const isMed = t.riskLevel === "MEDIUM";
    const badgeClass = isCrit ? "badge-critical" : (isHigh ? "badge-high" : (isMed ? "badge-medium" : "badge-safe"));

    return `
      <tr class="${isNew ? 'row-new-animate' : ''}">
        <td class="font-mono text-cyan cursor-pointer" onclick="FraudLensModal.showXaiModal('${t.id}')">
          ${t.id}
        </td>
        <td class="font-mono">${t.accountId}</td>
        <td class="font-semibold text-white">$${t.amount.toFixed(2)}</td>
        <td>${t.merchant}</td>
        <td>${t.location}</td>
        <td class="font-mono text-purple">${t.device}</td>
        <td>
          <span class="score-pill ${badgeClass}">${t.riskScore}</span>
        </td>
        <td><span class="${badgeClass}">${t.riskLevel}</span></td>
        <td class="reason-cell" title="${t.reason}">
          ${t.reason}
        </td>
        <td>
          <div class="row-actions">
            <button class="btn btn-xs btn-secondary" onclick="FraudLensModal.showXaiModal('${t.id}')" title="Explain with AI">View</button>
            ${isCrit || isHigh ? `
              <button class="btn btn-xs btn-primary" onclick="FraudLensModal.showInvestigationModal('FR-07')" title="Investigate Ring">Investigate</button>
              <button class="btn btn-xs btn-danger" onclick="FraudLensToast.danger('Transaction Blocked', 'Authorization for ${t.id} rejected.');" title="Block Transaction">Block</button>
            ` : `
              <button class="btn btn-xs btn-success" onclick="FraudLensToast.success('Transaction Allowed', 'Cleared authorization for ${t.id}.');" title="Allow Transaction">Allow</button>
            `}
          </div>
        </td>
      </tr>
    `;
  }

  function renderTableRows() {
    const all = window.FraudLensData.initialTransactions;
    const filtered = all.filter(matchesFilter);
    if (filtered.length === 0) {
      return `<tr><td colspan="10" class="empty-table-msg">No transactions matching current filter criteria.</td></tr>`;
    }
    return filtered.map(t => buildRowHtml(t)).join("");
  }

  function setFilter(filter) {
    activeFilter = filter;
    updateTable();
    // Update active pill
    document.querySelectorAll(".filter-pill").forEach(p => {
      p.classList.remove("active");
      if (p.textContent.toUpperCase().includes(filter)) p.classList.add("active");
    });
  }

  function handleSearch(query) {
    searchQuery = (query || "").trim();
    updateTable();
  }

  function updateTable() {
    const tbody = document.getElementById("liveTxnTableBody");
    if (tbody) {
      tbody.innerHTML = renderTableRows();
    }
  }

  function toggleStream() {
    const isRunning = FraudLensSimulator.toggle();
    const icon = document.getElementById("streamToggleIcon");
    const label = document.getElementById("streamToggleLabel");
    if (icon && label) {
      icon.textContent = isRunning ? "⏸" : "▶";
      label.textContent = isRunning ? "Pause Stream" : "Resume Stream";
    }
    FraudLensToast.info(isRunning ? "Stream Resumed" : "Stream Paused", isRunning ? "Live transactions streaming every 3.5s." : "Live ingestion held.");
  }

  return {
    render,
    setFilter,
    handleSearch,
    toggleStream
  };
})();
