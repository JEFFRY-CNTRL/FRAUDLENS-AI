/**
 * FraudLens AI - Coordinated Fraud Ring Detection & Behavioral Patterns Page
 * Crucial hackathon showcase section displaying syndicates, convergence graphs, and patterns
 */

window.FraudLensFraudRingsPage = (function () {
  function render(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const rings = window.FraudLensData.fraudRings;
    const patterns = window.FraudLensData.patterns;

    container.innerHTML = `
      <div class="page-content fraud-rings-page">
        <!-- Page Header -->
        <div class="page-header-row">
          <div>
            <div class="breadcrumb-tag">SYNDICATE INTELLIGENCE</div>
            <h1 class="page-title">Coordinated Fraud Rings</h1>
            <p class="page-description">
              Fraud rings are detected by analyzing relationships between accounts, devices, merchants, locations and transactions.
            </p>
          </div>
          <div class="header-action-group">
            <button class="btn btn-demo-pill" onclick="FraudLensModal.showDemoModal()">
              <span>✨</span> Run Judge Demo (FR-07)
            </button>
            <button class="btn btn-secondary btn-sm" onclick="FraudLensApp.navigate('network'); setTimeout(() => FraudLensNetworkGraph.focusRingCluster(), 200);">
              Open Network Graph →
            </button>
          </div>
        </div>

        <!-- Coordinated Rings Grid -->
        <div class="fraud-rings-grid">
          ${rings.map(ring => `
            <div class="ring-card ${ring.status === 'CRITICAL' ? 'ring-card-critical' : 'ring-card-high'}">
              <div class="ring-card-top">
                <div class="ring-identity">
                  <span class="badge-${ring.status === 'CRITICAL' ? 'critical' : 'high'}">${ring.status} RING</span>
                  <h2 class="ring-id-title">${ring.id}</h2>
                  <div class="ring-name-subtitle">${ring.name}</div>
                </div>
                <div class="ring-score-circle">
                  <span class="score-val">${ring.riskScore}</span>
                  <span class="score-sub">/100</span>
                </div>
              </div>

              <!-- Entities Count Bar -->
              <div class="ring-stats-strip">
                <div class="stat-pill">
                  <span class="stat-label">Accounts</span>
                  <span class="stat-num text-cyan">${ring.accountsCount}</span>
                </div>
                <div class="stat-pill">
                  <span class="stat-label">Devices</span>
                  <span class="stat-num text-purple">${ring.devicesCount}</span>
                </div>
                <div class="stat-pill">
                  <span class="stat-label">Merchants</span>
                  <span class="stat-num">${ring.merchantsCount}</span>
                </div>
                <div class="stat-pill">
                  <span class="stat-label">Transactions</span>
                  <span class="stat-num">${ring.transactionsCount}</span>
                </div>
                <div class="stat-pill">
                  <span class="stat-label">Locations</span>
                  <span class="stat-num">${ring.locationsCount}</span>
                </div>
              </div>

              <!-- Detected Pattern Box -->
              <div class="ring-pattern-snippet">
                <span class="snippet-icon">⚡</span>
                <span class="snippet-text">"${ring.patternSummary}"</span>
              </div>

              <!-- Destination Mule Callout -->
              <div class="ring-mule-callout">
                <span class="mule-label">Common Destination Target:</span>
                <span class="mule-value text-critical">${ring.destinationAccount}</span>
                <span class="mule-vol">Volume: ${ring.totalVolume}</span>
              </div>

              <!-- Evidence Bullet List -->
              <div class="ring-evidence-preview">
                <div class="evidence-preview-title">Forensic Indicators:</div>
                <ul class="evidence-preview-list">
                  ${ring.evidence.slice(0, 2).map(e => `<li>${e}</li>`).join("")}
                </ul>
              </div>

              <!-- Action Buttons -->
              <div class="ring-card-actions">
                <button class="btn btn-primary btn-flex" onclick="FraudLensModal.showInvestigationModal('${ring.id}')">
                  Investigate Ring
                </button>
                <button class="btn btn-secondary btn-flex" onclick="FraudLensApp.navigate('network'); setTimeout(() => FraudLensNetworkGraph.focusRingCluster(), 200);">
                  View Network
                </button>
                <button class="btn btn-danger btn-sm" onclick="FraudLensToast.danger('Syndicate Quarantined', 'All associated accounts in ${ring.id} frozen.');">
                  Freeze
                </button>
              </div>
            </div>
          `).join("")}
        </div>

        <!-- SECTION 10: PATTERN DETECTION -->
        <div class="patterns-section-wrapper">
          <div class="section-header-block">
            <div class="breadcrumb-tag">BEHAVIORAL FINGERPRINTS</div>
            <h2 class="section-title">Detected Behavioral Patterns</h2>
            <p class="section-desc">
              Algorithmic graph queries and temporal velocity models continuously classify coordinated attack archetypes across accounts.
            </p>
          </div>

          <div class="patterns-grid">
            ${patterns.map(pat => `
              <div class="pattern-card">
                <div class="pattern-card-header">
                  <span class="pattern-number-tag">Pattern ${pat.number}</span>
                  <span class="pattern-conf-badge">${pat.confidence}% Confidence</span>
                </div>
                <h3 class="pattern-title-text">${pat.name}</h3>
                <p class="pattern-explanation">${pat.description}</p>
                <div class="pattern-meta-row">
                  <div class="meta-item">
                    <span class="meta-lbl">Accounts Involved:</span>
                    <span class="meta-val text-cyan">${pat.accountsInvolved} accounts</span>
                  </div>
                  <div class="meta-item">
                    <span class="meta-lbl">Category:</span>
                    <span class="meta-val">${pat.flaggedCategory}</span>
                  </div>
                </div>
                <div class="pattern-example-box">
                  <span class="ex-lbl">Observed in Telemetry:</span>
                  <span class="ex-text">${pat.example}</span>
                </div>
                <div class="pattern-card-footer">
                  <button class="btn btn-secondary btn-xs" onclick="FraudLensApp.navigate('accounts')">
                    View Flagged Accounts (${pat.accountsInvolved}) →
                  </button>
                </div>
              </div>
            `).join("")}
          </div>
        </div>
      </div>
    `;
  }

  return {
    render
  };
})();
