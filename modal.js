/**
 * FraudLens AI - Modal & Drawer Manager
 * Renders Investigation Dossiers, XAI Breakdowns, Entity Inspector, and Demo Walkthrough
 */

window.FraudLensModal = (function () {
  let activeModal = null;

  function closeModal() {
    const backdrop = document.getElementById("modalBackdrop");
    const container = document.getElementById("modalContainer");
    if (backdrop && container) {
      backdrop.classList.remove("active");
      container.classList.remove("active");
      container.innerHTML = "";
    }
    activeModal = null;
  }

  function openModal(contentHtml) {
    let backdrop = document.getElementById("modalBackdrop");
    let container = document.getElementById("modalContainer");

    if (!backdrop) {
      backdrop = document.createElement("div");
      backdrop.id = "modalBackdrop";
      backdrop.className = "fraudlens-modal-backdrop";
      backdrop.onclick = closeModal;
      document.body.appendChild(backdrop);
    }

    if (!container) {
      container = document.createElement("div");
      container.id = "modalContainer";
      container.className = "fraudlens-modal-container";
      document.body.appendChild(container);
    }

    container.innerHTML = contentHtml;
    backdrop.classList.add("active");
    container.classList.add("active");
  }

  /**
   * SECTION 17: FRAUD INVESTIGATION VIEW
   */
  function showInvestigationModal(ringId = "FR-07") {
    const ring = window.FraudLensData.fraudRings.find(r => r.id === ringId) || window.FraudLensData.fraudRings[0];

    const html = `
      <div class="modal-card investigation-modal">
        <div class="modal-header">
          <div class="modal-header-left">
            <span class="badge-critical">${ring.status} SYNDICATE</span>
            <h2 class="modal-title">Investigation Dossier: ${ring.id}</h2>
            <div class="modal-subtitle">${ring.name}</div>
          </div>
          <button class="modal-close-btn" onclick="FraudLensModal.closeModal()">✕</button>
        </div>

        <div class="modal-body">
          <!-- KPI Summary Strip -->
          <div class="investigation-metrics-grid">
            <div class="inv-metric-card">
              <span class="inv-metric-label">Overall Risk</span>
              <span class="inv-metric-val text-critical">${ring.riskScore}/100</span>
            </div>
            <div class="inv-metric-card">
              <span class="inv-metric-label">Accounts Involved</span>
              <span class="inv-metric-val">${ring.accountsCount}</span>
            </div>
            <div class="inv-metric-card">
              <span class="inv-metric-label">Devices Involved</span>
              <span class="inv-metric-val">${ring.devicesCount}</span>
            </div>
            <div class="inv-metric-card">
              <span class="inv-metric-label">Transactions</span>
              <span class="inv-metric-val">${ring.transactionsCount}</span>
            </div>
            <div class="inv-metric-card">
              <span class="inv-metric-label">Locations</span>
              <span class="inv-metric-val">${ring.locationsCount}</span>
            </div>
            <div class="inv-metric-card">
              <span class="inv-metric-label">Common Destination</span>
              <span class="inv-metric-val text-cyan">${ring.destinationAccount}</span>
            </div>
          </div>

          <!-- Pattern Explanation Banner -->
          <div class="pattern-alert-box">
            <div class="pattern-alert-title">⚡ Detected Behavioral Pattern</div>
            <div class="pattern-alert-desc">
              "${ring.patternSummary}"
            </div>
          </div>

          <!-- Investigation Timeline -->
          <div class="investigation-timeline-section">
            <h3 class="section-subheading">Incident Execution Timeline</h3>
            <div class="timeline-list">
              ${ring.timeline.map(item => `
                <div class="timeline-item">
                  <div class="timeline-time">${item.time}</div>
                  <div class="timeline-dot"></div>
                  <div class="timeline-content">${item.event}</div>
                </div>
              `).join("")}
            </div>
          </div>

          <!-- Concrete Evidence Findings -->
          <div class="evidence-findings-section">
            <h3 class="section-subheading">Key Forensic Evidence</h3>
            <div class="evidence-grid">
              ${ring.evidence.map(ev => `
                <div class="evidence-item-card">
                  <span class="ev-check">⚠</span>
                  <span class="ev-text">${ev}</span>
                </div>
              `).join("")}
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <div class="footer-action-summary">
            <span class="action-label">Recommended Action:</span>
            <span class="action-badge-danger">${ring.recommendedAction}</span>
          </div>
          <div class="modal-footer-btns">
            <button class="btn btn-secondary" onclick="FraudLensModal.closeModal(); FraudLensApp.navigate('network'); setTimeout(() => FraudLensNetworkGraph.focusRingCluster(), 200);">
              View in Network Graph
            </button>
            <button class="btn btn-danger" onclick="FraudLensToast.danger('Containment Executed', 'All 10 syndicate accounts frozen and Mule ${ring.destinationAccount} blocked.'); FraudLensModal.closeModal();">
              Execute Ring Containment
            </button>
          </div>
        </div>
      </div>
    `;

    openModal(html);
  }

  /**
   * SECTION 11: EXPLAINABLE AI MODAL
   */
  function showXaiModal(txnId = "TXN-10482") {
    const txn = window.FraudLensData.initialTransactions.find(t => t.id === txnId) || window.FraudLensData.initialTransactions[0];
    const explanation = txn.explanation || {
      score: txn.riskScore,
      factors: [
        { name: "Unusual transaction amount", score: 22, confidence: 96, evidence: "Historical avg exceeded by 3.4x" },
        { name: "New untrusted device", score: 18, confidence: 94, evidence: "First seen hardware signature" },
        { name: "Shared device linkage", score: 24, confidence: 99, evidence: "Linked to multiple critical identities" },
        { name: "Geographic distance anomaly", score: 14, confidence: 90, evidence: "620km from registered domestic location" },
        { name: "Syndicate cluster link", score: 18, confidence: 97, evidence: "Direct graph edge to Ring FR-07" }
      ]
    };

    const actionInfo = window.FraudLensRiskEngine.getRecommendedAction(txn.riskScore, true, false);

    const html = `
      <div class="modal-card xai-modal">
        <div class="modal-header">
          <div>
            <span class="badge-${txn.riskLevel.toLowerCase()}">${txn.riskLevel} RISK</span>
            <h2 class="modal-title">AI Risk Explanation: ${txn.id}</h2>
            <div class="modal-subtitle">Account: ${txn.accountId} | Amount: $${txn.amount.toFixed(2)} | Merchant: ${txn.merchant}</div>
          </div>
          <button class="modal-close-btn" onclick="FraudLensModal.closeModal()">✕</button>
        </div>

        <div class="modal-body">
          <div class="xai-why-flagged">
            <h3 class="xai-header-title">Why was this transaction flagged?</h3>
            <p class="xai-header-desc">
              FraudLens AI evaluated 42 behavioral telemetry signals. The score of <strong>${txn.riskScore}/100</strong> is transparently broken down below into verifiable feature contributions:
            </p>
          </div>

          <div class="xai-factors-container">
            ${explanation.factors.map((f, i) => `
              <div class="xai-factor-card">
                <div class="xai-factor-top">
                  <span class="xai-factor-num">#${i + 1}</span>
                  <span class="xai-factor-title">${f.name}</span>
                  <span class="xai-factor-contrib">+${f.score}</span>
                </div>
                <div class="xai-meter-line">
                  <div class="xai-meter-fill" style="width: ${Math.min(100, (f.score / 30) * 100)}%"></div>
                </div>
                <div class="xai-factor-bottom">
                  <span class="xai-ev-text">${f.evidence}</span>
                  <span class="xai-conf-tag">Confidence: ${f.confidence}%</span>
                </div>
              </div>
            `).join("")}
          </div>

          <div class="xai-math-summary">
            <span class="math-label">Feature Contribution Sum:</span>
            <span class="math-calc">${explanation.factors.map(f => `+${f.score}`).join(" ")} = <strong>${txn.riskScore} / 100</strong></span>
          </div>

          <!-- Recommended Action Box -->
          <div class="xai-rec-box">
            <div class="xai-rec-header">
              <span class="rec-icon">🛡</span>
              <span class="rec-title">Recommended Action: ${actionInfo.action}</span>
            </div>
            <div class="rec-detail">${actionInfo.reason} ${actionInfo.guidance}</div>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn btn-secondary" onclick="FraudLensModal.closeModal()">Dismiss</button>
          <button class="btn btn-warning" onclick="FraudLensToast.warning('Transaction Held', 'Transaction ${txn.id} has been moved to manual review queue.'); FraudLensModal.closeModal();">
            Temporarily Hold
          </button>
          <button class="btn btn-danger" onclick="FraudLensToast.danger('Transaction Blocked', 'Transaction ${txn.id} blocked and authorization token revoked.'); FraudLensModal.closeModal();">
            Block Transaction
          </button>
        </div>
      </div>
    `;

    openModal(html);
  }

  /**
   * SECTION 21: DEMO MODE FOR JUDGES
   */
  function showDemoModal() {
    let currentStepIndex = 0;
    const steps = window.FraudLensDemo.scenarioSteps;

    function renderStep() {
      const s = steps[currentStepIndex];
      const isLast = currentStepIndex === steps.length - 1;

      return `
        <div class="modal-card demo-modal">
          <div class="modal-header">
            <div>
              <span class="badge-demo">HACKATHON JUDGE DEMO MODE</span>
              <h2 class="modal-title">Live Fraud Ring Scenario: Ring #FR-07</h2>
              <div class="modal-subtitle">Step ${s.step} of ${steps.length}: ${s.phase}</div>
            </div>
            <button class="modal-close-btn" onclick="FraudLensModal.closeModal()">✕</button>
          </div>

          <div class="modal-body">
            <!-- Progress Bar -->
            <div class="demo-progress-track">
              ${steps.map((st, idx) => `
                <div class="demo-step-pill ${idx === currentStepIndex ? 'active' : (idx < currentStepIndex ? 'completed' : '')}" onclick="FraudLensModal.setDemoStep(${idx})">
                  <span class="step-num">${st.step}</span>
                  <span class="step-label">${st.phase}</span>
                </div>
              `).join("")}
            </div>

            <!-- Main Step Card -->
            <div class="demo-scenario-card status-${s.status.toLowerCase()}">
              <div class="demo-scenario-top">
                <span class="demo-time-stamp">⏰ Simulated Time: ${s.time}</span>
                <span class="demo-status-badge status-${s.status.toLowerCase()}">${s.status}</span>
              </div>
              <h3 class="demo-step-heading">${s.title}</h3>
              <p class="demo-step-desc">${s.description}</p>

              <div class="demo-telemetry-grid">
                <div class="demo-telem-box">
                  <span class="telem-label">Target Accounts</span>
                  <span class="telem-val">${s.activeAccounts.join(", ")}</span>
                </div>
                <div class="demo-telem-box">
                  <span class="telem-label">System State</span>
                  <span class="telem-val">Flagged: ${s.metrics.flagged} | Rings: ${s.metrics.rings}</span>
                </div>
              </div>

              <div class="demo-action-guidance">
                <strong>AI System Reaction:</strong> ${s.actionAdvice}
              </div>
            </div>
          </div>

          <div class="modal-footer">
            <div class="demo-footer-left">
              <button class="btn btn-secondary btn-sm" onclick="FraudLensModal.prevDemoStep()" ${currentStepIndex === 0 ? 'disabled' : ''}>← Previous</button>
              <button class="btn btn-secondary btn-sm" onclick="FraudLensModal.resetDemo()">Reset Baseline</button>
            </div>
            <div class="demo-footer-right">
              ${isLast ? `
                <button class="btn btn-primary" onclick="FraudLensModal.closeModal(); FraudLensApp.navigate('network'); setTimeout(() => FraudLensNetworkGraph.focusRingCluster(), 250); FraudLensToast.success('Syndicate Cluster Isolated', 'Graph centered on Fraud Ring #FR-07 nodes.');">
                  View Cluster in Network Graph →
                </button>
              ` : `
                <button class="btn btn-primary" onclick="FraudLensModal.nextDemoStep()">
                  Next Step (${currentStepIndex + 2} / ${steps.length}) →
                </button>
              `}
            </div>
          </div>
        </div>
      `;
    }

    window._demoStepIndex = currentStepIndex;
    openModal(renderStep());
  }

  function setDemoStep(idx) {
    window._demoStepIndex = idx;
    const steps = window.FraudLensDemo.scenarioSteps;
    const container = document.getElementById("modalContainer");
    if (container) {
      // Re-render
      const s = steps[idx];
      const isLast = idx === steps.length - 1;
      container.innerHTML = `
        <div class="modal-card demo-modal">
          <div class="modal-header">
            <div>
              <span class="badge-demo">HACKATHON JUDGE DEMO MODE</span>
              <h2 class="modal-title">Live Fraud Ring Scenario: Ring #FR-07</h2>
              <div class="modal-subtitle">Step ${s.step} of ${steps.length}: ${s.phase}</div>
            </div>
            <button class="modal-close-btn" onclick="FraudLensModal.closeModal()">✕</button>
          </div>

          <div class="modal-body">
            <div class="demo-progress-track">
              ${steps.map((st, i) => `
                <div class="demo-step-pill ${i === idx ? 'active' : (i < idx ? 'completed' : '')}" onclick="FraudLensModal.setDemoStep(${i})">
                  <span class="step-num">${st.step}</span>
                  <span class="step-label">${st.phase}</span>
                </div>
              `).join("")}
            </div>

            <div class="demo-scenario-card status-${s.status.toLowerCase()}">
              <div class="demo-scenario-top">
                <span class="demo-time-stamp">⏰ Simulated Time: ${s.time}</span>
                <span class="demo-status-badge status-${s.status.toLowerCase()}">${s.status}</span>
              </div>
              <h3 class="demo-step-heading">${s.title}</h3>
              <p class="demo-step-desc">${s.description}</p>

              <div class="demo-telemetry-grid">
                <div class="demo-telem-box">
                  <span class="telem-label">Target Accounts</span>
                  <span class="telem-val">${s.activeAccounts.join(", ")}</span>
                </div>
                <div class="demo-telem-box">
                  <span class="telem-label">System State</span>
                  <span class="telem-val">Flagged: ${s.metrics.flagged} | Rings: ${s.metrics.rings}</span>
                </div>
              </div>

              <div class="demo-action-guidance">
                <strong>AI System Reaction:</strong> ${s.actionAdvice}
              </div>
            </div>
          </div>

          <div class="modal-footer">
            <div class="demo-footer-left">
              <button class="btn btn-secondary btn-sm" onclick="FraudLensModal.prevDemoStep()" ${idx === 0 ? 'disabled' : ''}>← Previous</button>
              <button class="btn btn-secondary btn-sm" onclick="FraudLensModal.resetDemo()">Reset Baseline</button>
            </div>
            <div class="demo-footer-right">
              ${isLast ? `
                <button class="btn btn-primary" onclick="FraudLensModal.closeModal(); FraudLensApp.navigate('network'); setTimeout(() => FraudLensNetworkGraph.focusRingCluster(), 250); FraudLensToast.success('Syndicate Cluster Isolated', 'Graph centered on Fraud Ring #FR-07 nodes.');">
                  View Cluster in Network Graph →
                </button>
              ` : `
                <button class="btn btn-primary" onclick="FraudLensModal.nextDemoStep()">
                  Next Step (${idx + 2} / ${steps.length}) →
                </button>
              `}
            </div>
          </div>
        </div>
      `;
    }
  }

  function nextDemoStep() {
    let idx = window._demoStepIndex || 0;
    if (idx < window.FraudLensDemo.scenarioSteps.length - 1) {
      setDemoStep(idx + 1);
    }
  }

  function prevDemoStep() {
    let idx = window._demoStepIndex || 0;
    if (idx > 0) {
      setDemoStep(idx - 1);
    }
  }

  function resetDemo() {
    setDemoStep(0);
    FraudLensToast.info("Demo Reset", "Scenario reset to baseline monitoring state.");
  }

  return {
    openModal,
    closeModal,
    showInvestigationModal,
    showXaiModal,
    showDemoModal,
    setDemoStep,
    nextDemoStep,
    prevDemoStep,
    resetDemo
  };
})();
