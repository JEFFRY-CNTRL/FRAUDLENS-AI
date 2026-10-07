/**
 * FraudLens AI - Settings & System Architecture Page
 * Configuration parameters, engine status, and hackathon project metadata
 */

window.FraudLensSettingsPage = (function () {
  function render(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
      <div class="page-content settings-page">
        <!-- Page Header -->
        <div class="page-header-row">
          <div>
            <div class="breadcrumb-tag">CONFIGURATION & SYSTEM HEALTH</div>
            <h1 class="page-title">Settings & Engine Architecture</h1>
            <p class="page-description">
              Operational parameters, detection thresholds, and real-time engine telemetry for FraudLens AI.
            </p>
          </div>
          <div class="header-action-group">
            <button class="btn btn-secondary btn-sm" onclick="FraudLensToast.success('Config Saved', 'Engine rules updated successfully.');">
              Save Parameters
            </button>
            <button class="btn btn-demo-pill" onclick="FraudLensModal.showDemoModal()">
              <span>✨</span> Run Judge Demo
            </button>
          </div>
        </div>

        <div class="settings-grid">
          <!-- Left Column: Engine Configuration -->
          <div class="settings-card">
            <div class="card-title-row">
              <span class="card-icon">⚙️</span>
              <h3 class="card-heading">Risk Scoring Thresholds</h3>
            </div>
            <div class="settings-form-group">
              <label class="form-label">Critical Threat Threshold (Auto-Block):</label>
              <div class="range-row">
                <input type="range" class="range-slider" min="80" max="98" value="90" oninput="document.getElementById('critVal').textContent = this.value" />
                <span class="range-val font-mono text-critical" id="critVal">90</span>
              </div>
              <span class="form-hint">Scores equal or above this trigger automatic clearing halts and token freezes.</span>
            </div>

            <div class="settings-form-group">
              <label class="form-label">High Risk Threshold (Temporary Hold):</label>
              <div class="range-row">
                <input type="range" class="range-slider" min="60" max="85" value="70" oninput="document.getElementById('highVal').textContent = this.value" />
                <span class="range-val font-mono text-orange" id="highVal">70</span>
              </div>
              <span class="form-hint">Transactions held in temporary escrow queue for manual graph inspection.</span>
            </div>

            <div class="settings-form-group">
              <label class="form-label">Syndicate Ring Correlation Coefficient:</label>
              <div class="range-row">
                <input type="range" class="range-slider" min="0.5" max="0.99" step="0.05" value="0.85" oninput="document.getElementById('ringVal').textContent = this.value" />
                <span class="range-val font-mono text-cyan" id="ringVal">0.85</span>
              </div>
              <span class="form-hint">Minimum graph edge density required to cluster multiple accounts into a single syndicate.</span>
            </div>

            <div class="settings-form-group">
              <label class="form-label">False Positive Baseline History Period:</label>
              <select class="settings-select">
                <option value="90">90 Days Rolling Baseline</option>
                <option value="180" selected>180 Days Rolling Baseline (Recommended)</option>
                <option value="365">365 Days Multi-Season Baseline</option>
              </select>
            </div>
          </div>

          <!-- Right Column: System Telemetry & About -->
          <div class="settings-column">
            <!-- System Status Card -->
            <div class="settings-card">
              <div class="card-title-row">
                <span class="card-icon">⚡</span>
                <h3 class="card-heading">Engine Health & Telemetry</h3>
              </div>
              <div class="telemetry-items-list">
                <div class="telem-row">
                  <span class="telem-name">Detection Engine Status:</span>
                  <span class="status-pill-green">● Online & Healthy</span>
                </div>
                <div class="telem-row">
                  <span class="telem-name">Scoring Latency (p99):</span>
                  <span class="font-mono text-cyan">14.8 ms</span>
                </div>
                <div class="telem-row">
                  <span class="telem-name">Active Graph Entities:</span>
                  <span class="font-mono">45 nodes • 38 edges</span>
                </div>
                <div class="telem-row">
                  <span class="telem-name">Memory Footprint:</span>
                  <span class="font-mono">34.2 MB (Client-Optimized)</span>
                </div>
                <div class="telem-row">
                  <span class="telem-name">Simulated Stream Rate:</span>
                  <span class="font-mono text-cyan">1 txn / 3.5 sec</span>
                </div>
              </div>
            </div>

            <!-- About HNX26PSI04 Card -->
            <div class="settings-card project-info-card">
              <div class="card-title-row">
                <span class="card-icon">🏆</span>
                <h3 class="card-heading">Project Metadata</h3>
              </div>
              <div class="project-info-body">
                <div class="info-row">
                  <span class="info-lbl">Project ID:</span>
                  <span class="info-val font-mono text-cyan">HNX26PSI04</span>
                </div>
                <div class="info-row">
                  <span class="info-lbl">Project Title:</span>
                  <span class="info-val">Real-Time Financial Fraud Intelligence</span>
                </div>
                <div class="info-row">
                  <span class="info-lbl">Product Name:</span>
                  <span class="info-val font-bold">FraudLens AI</span>
                </div>
                <div class="info-row">
                  <span class="info-lbl">Tagline:</span>
                  <span class="info-val italic">"See the hidden patterns behind financial fraud."</span>
                </div>
                <div class="info-row">
                  <span class="info-lbl">Target Deployment:</span>
                  <span class="info-val">SOC Teams, Tier-1 Banks, FinTech Acquirers</span>
                </div>
              </div>
              <div class="project-actions-row">
                <button class="btn btn-primary btn-block" onclick="FraudLensModal.showDemoModal()">
                  Launch Hackathon Judge Showcase →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  return {
    render
  };
})();
