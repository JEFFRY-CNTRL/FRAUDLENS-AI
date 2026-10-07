/**
 * FraudLens AI - Interactive Network Graph Page
 * Full-screen interactive graph workbench with entity inspector drawer and cluster navigation
 */

window.FraudLensNetworkPage = (function () {
  let selectedEntityData = null;

  function render(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
      <div class="page-content network-page">
        <!-- Top Toolbar & Navigation -->
        <div class="network-header-toolbar">
          <div class="toolbar-title-group">
            <div class="breadcrumb-tag">GRAPH INTELLIGENCE</div>
            <h1 class="page-title">Entity Relationship Network</h1>
          </div>

          <!-- Filter Pills -->
          <div class="network-filters-bar">
            <button class="filter-pill active" onclick="FraudLensNetworkPage.applyFilter('ALL', this)">All Entities (45)</button>
            <button class="filter-pill pill-ring-focus" onclick="FraudLensNetworkPage.applyFilter('FR-07', this)">Focus Ring #FR-07 (Cluster)</button>
            <button class="filter-pill" onclick="FraudLensNetworkPage.applyFilter('ACCOUNTS', this)">Accounts</button>
            <button class="filter-pill" onclick="FraudLensNetworkPage.applyFilter('DEVICES', this)">Devices</button>
            <button class="filter-pill" onclick="FraudLensNetworkPage.applyFilter('DESTINATIONS', this)">Mule Destinations</button>
          </div>

          <!-- Controls Group -->
          <div class="network-controls-group">
            <div class="search-box-wrap-sm">
              <input type="text" class="graph-search-input" id="graphSearchInput" placeholder="Locate Node (e.g. ACC-2041, DEV-91)..." onkeydown="if(event.key==='Enter') FraudLensNetworkPage.searchNode(this.value)" />
              <button class="btn btn-xs btn-secondary" onclick="FraudLensNetworkPage.searchNode(document.getElementById('graphSearchInput').value)">Go</button>
            </div>
            <button class="btn btn-secondary btn-sm" onclick="FraudLensNetworkGraph.focusRingCluster()" title="Cluster Focus">
              🎯 Center FR-07
            </button>
            <button class="btn btn-secondary btn-sm" onclick="FraudLensNetworkGraph.centerGraph()" title="Reset View">
              ↺ Reset
            </button>
          </div>
        </div>

        <!-- Main Graph Area with Side Panel Layout -->
        <div class="network-workbench-layout">
          <!-- Graph Canvas Container -->
          <div class="graph-canvas-wrapper" id="graphCanvasWrapper">
            <canvas id="networkGraphCanvas" class="network-canvas"></canvas>

            <!-- Graph Legend Overlay -->
            <div class="graph-legend-overlay">
              <div class="legend-group-title">NODE ENTITIES & RISK</div>
              <div class="legend-row">
                <span class="legend-dot" style="background:#ef4444; box-shadow: 0 0 8px #ef4444;"></span>
                <span>Critical Risk (90+)</span>
              </div>
              <div class="legend-row">
                <span class="legend-dot" style="background:#f97316;"></span>
                <span>High Risk (70-89)</span>
              </div>
              <div class="legend-row">
                <span class="legend-dot" style="background:#10b981;"></span>
                <span>Normal / Safe</span>
              </div>
              <div class="legend-row">
                <span class="legend-shape-square" style="background:#7c3aed;"></span>
                <span>Device Fingerprint</span>
              </div>
              <div class="legend-row">
                <span class="legend-shape-diamond" style="background:#dc2626;"></span>
                <span>Mule Destination</span>
              </div>
              <div class="legend-hint">Tip: Drag nodes • Scroll to Zoom • Click node for details</div>
            </div>
          </div>

          <!-- Entity Details Side Panel (Section 9 requirement) -->
          <div class="entity-inspector-panel" id="entityInspectorPanel">
            ${renderDefaultSidePanel()}
          </div>
        </div>
      </div>
    `;

    // Initialize Network Canvas
    setTimeout(() => {
      const canvasEl = document.getElementById("networkGraphCanvas");
      if (canvasEl) {
        FraudLensNetworkGraph.init(canvasEl, handleNodeSelected);
        // Default select ACC-2041 so the side panel has rich content immediately
        setTimeout(() => {
          FraudLensNetworkGraph.focusNodeById("ACC-2041");
        }, 150);
      }
    }, 50);
  }

  function renderDefaultSidePanel() {
    return `
      <div class="inspector-empty-state">
        <div class="empty-icon">👆</div>
        <h3 class="empty-title">Select Any Node</h3>
        <p class="empty-desc">Click any Account, Device, Merchant, or Destination node in the graph to inspect relationship forensics and evidence.</p>
        <button class="btn btn-primary btn-sm" onclick="FraudLensNetworkGraph.focusNodeById('ACC-2041')">
          Inspect Core Mule ACC-2041
        </button>
      </div>
    `;
  }

  function handleNodeSelected(data) {
    selectedEntityData = data;
    const panel = document.getElementById("entityInspectorPanel");
    if (!panel) return;

    const n = data.node;
    const isCrit = n.risk === "Critical";
    const isHigh = n.risk === "High";
    const badgeClass = isCrit ? "badge-critical" : (isHigh ? "badge-high" : (n.risk === "Medium" ? "badge-medium" : "badge-safe"));

    // Synthesize realistic evidence points as specified in Section 9
    let evidenceList = [];
    if (n.id.startsWith("ACC-204")) {
      evidenceList = [
        "Shared emulated device DEV-91 with 3 other suspicious accounts",
        "Synchronized purchase sequence at ElectroMart ($1,299 GPU SKU)",
        "Repeated destination funnel to Offshore Vault ACC-MULE-881",
        "Abnormal transaction velocity (3 operations in under 6 minutes)"
      ];
    } else if (n.type === "Device") {
      evidenceList = [
        `Hardware fingerprint bound to ${n.score >= 90 ? '4' : '2'} distinct banking user profiles`,
        "Rooted / Emulated execution sandbox environment confirmed",
        "Geolocation hopping across multiple metros within 20 minutes",
        "Automated macro order timing signature (<0.4s between keystrokes)"
      ];
    } else if (n.type === "Destination") {
      evidenceList = [
        "Aggregation destination for 10 distinct funneling accounts",
        "Immediate outbound wire pass-through to unverified offshore rails",
        "Total flagged inbound syndicate volume: $78,420",
        "Classified as primary mule vault for Fraud Ring #FR-07"
      ];
    } else {
      evidenceList = [
        "Verified user profile with 18+ months historical consistency",
        "Cryptographically signed hardware token (Genuine Device)",
        "Zero suspicious graph neighbor links detected",
        "Standard domestic residential IP routing"
      ];
    }

    panel.innerHTML = `
      <div class="inspector-content">
        <!-- Inspector Top Header -->
        <div class="inspector-header">
          <div class="entity-type-badge">${n.type}</div>
          <h2 class="entity-name-heading">${n.label}</h2>
          <div class="entity-id-sub font-mono">${n.id}</div>
        </div>

        <!-- Risk Score Meter -->
        <div class="inspector-score-card">
          <div class="inspector-score-top">
            <span class="score-card-lbl">Calculated Risk Score</span>
            <span class="score-card-badge ${badgeClass}">${n.risk.toUpperCase()}</span>
          </div>
          <div class="score-number-display">
            <span class="num-large ${isCrit ? 'text-critical' : (isHigh ? 'text-orange' : 'text-success')}">${n.score}</span>
            <span class="denom">/ 100</span>
          </div>
          <div class="score-progress-bar">
            <div class="score-progress-fill ${isCrit ? 'fill-critical' : (isHigh ? 'fill-orange' : 'fill-green')}" style="width: ${n.score}%"></div>
          </div>
        </div>

        <!-- Metric Counters -->
        <div class="inspector-metrics-row">
          <div class="inspector-metric-box">
            <span class="box-lbl">Connections</span>
            <span class="box-val text-cyan">${data.connectionsCount}</span>
          </div>
          <div class="inspector-metric-box">
            <span class="box-lbl">Transactions</span>
            <span class="box-val">${n.id.startsWith('ACC') ? (n.score > 80 ? '27' : '42') : '38'}</span>
          </div>
          <div class="inspector-metric-box">
            <span class="box-lbl">Syndicate</span>
            <span class="box-val text-orange">${n.ring || 'None'}</span>
          </div>
        </div>

        <!-- Section 9: Forensic Evidence -->
        <div class="inspector-evidence-section">
          <h4 class="evidence-header-title">Forensic Evidence</h4>
          <ul class="inspector-evidence-list">
            ${evidenceList.map(e => `
              <li>
                <span class="ev-bullet">▸</span>
                <span class="ev-text">${e}</span>
              </li>
            `).join("")}
          </ul>
        </div>

        <!-- Connected Entities Pills -->
        <div class="inspector-neighbors-section">
          <h4 class="evidence-header-title">Connected Graph Neighbors (${data.connections.length})</h4>
          <div class="neighbor-pills-wrap">
            ${data.connections.map(c => `
              <div class="neighbor-pill pill-risk-${c.risk.toLowerCase()}" onclick="FraudLensNetworkGraph.focusNodeById('${c.id}')" title="Click to focus on ${c.id}">
                <span class="n-type">${c.type}:</span>
                <span class="n-id">${c.id}</span>
              </div>
            `).join("")}
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="inspector-actions-section">
          ${n.score >= 70 ? `
            <button class="btn btn-danger btn-block" onclick="FraudLensToast.danger('Entity Frozen', '${n.id} has been suspended across all rails.');">
              Freeze Entity (${n.id})
            </button>
            <button class="btn btn-warning btn-block" onclick="FraudLensModal.showInvestigationModal('FR-07')">
              Investigate Associated Ring
            </button>
          ` : `
            <button class="btn btn-success btn-block" onclick="FraudLensToast.success('Entity Verified', '${n.id} verified as legitimate baseline.');">
              Whitelisted Baseline
            </button>
          `}
          <button class="btn btn-secondary btn-block" onclick="FraudLensToast.info('Watchlist Updated', '${n.id} added to high-priority telemetry stream.');">
            Add to Active Watchlist
          </button>
        </div>
      </div>
    `;
  }

  function applyFilter(filter, btnEl) {
    FraudLensNetworkGraph.setFilter(filter);
    document.querySelectorAll(".network-filters-bar .filter-pill").forEach(p => p.classList.remove("active"));
    if (btnEl) btnEl.classList.add("active");
  }

  function searchNode(query) {
    if (!query) return;
    const found = FraudLensNetworkGraph.focusNodeById(query.trim());
    if (!found) {
      FraudLensToast.warning("Node Not Found", `No graph entity matched "${query}".`);
    } else {
      FraudLensToast.success("Node Focused", `Centered graph on "${query}".`);
    }
  }

  return {
    render,
    applyFilter,
    searchNode
  };
})();
