/**
 * FraudLens AI - Explainable AI (XAI) & Behavioral Intelligence Page
 * Transparent risk score deconstruction, false positive controls, and normal vs anomaly comparison
 */

window.FraudLensExplainableAiPage = (function () {
  let selectedTxnId = "TXN-10482";

  function render(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const data = window.FraudLensData;
    const fp = data.falsePositiveMetrics;
    const comparison = window.FraudLensRiskEngine.getBehavioralComparison();
    const currentTxn = data.initialTransactions.find(t => t.id === selectedTxnId) || data.initialTransactions[0];
    const explanation = currentTxn.explanation;
    const recAction = window.FraudLensRiskEngine.getRecommendedAction(currentTxn.riskScore, true, false);

    const isCrit = currentTxn.riskLevel === "CRITICAL";
    const isHigh = currentTxn.riskLevel === "HIGH";
    const badgeClass = isCrit ? "badge-critical" : (isHigh ? "badge-high" : (currentTxn.riskLevel === "MEDIUM" ? "badge-medium" : "badge-safe"));

    container.innerHTML = `
      <div class="page-content xai-page">
        <!-- Page Header -->
        <div class="page-header-row">
          <div>
            <div class="breadcrumb-tag">TRANSPARENT FORENSICS</div>
            <h1 class="page-title">Explainable AI (XAI) Risk Intelligence</h1>
            <p class="page-description">
              Every risk score is deconstructed into quantifiable mathematical feature contributions with verifiable evidentiary backing.
            </p>
          </div>
          <div class="header-action-group">
            <button class="btn btn-demo-pill" onclick="FraudLensModal.showDemoModal()">
              <span>✨</span> Run Judge Demo
            </button>
          </div>
        </div>

        <!-- Transaction Selector Strip -->
        <div class="xai-selector-strip">
          <span class="selector-lbl">Inspect Sample Transaction:</span>
          <div class="txn-selector-buttons">
            <button class="txn-select-btn ${selectedTxnId === 'TXN-10482' ? 'active' : ''}" onclick="FraudLensExplainableAiPage.selectTxn('TXN-10482')">
              <span class="font-mono">TXN-10482</span> (Risk 91 - Syndicate Bot)
            </button>
            <button class="txn-select-btn ${selectedTxnId === 'TXN-10291' ? 'active' : ''}" onclick="FraudLensExplainableAiPage.selectTxn('TXN-10291')">
              <span class="font-mono">TXN-10291</span> (Risk 92 - Shared Emulator)
            </button>
            <button class="txn-select-btn ${selectedTxnId === 'TXN-10115' ? 'active' : ''}" onclick="FraudLensExplainableAiPage.selectTxn('TXN-10115')">
              <span class="font-mono">TXN-10115</span> (Risk 14 - $4,200 VIP Corporate Exemption)
            </button>
            <button class="txn-select-btn ${selectedTxnId === 'TXN-10330' ? 'active' : ''}" onclick="FraudLensExplainableAiPage.selectTxn('TXN-10330')">
              <span class="font-mono">TXN-10330</span> (Risk 58 - Travel Geo Hop)
            </button>
          </div>
        </div>

        <!-- Main XAI Workbench Grid -->
        <div class="xai-main-grid">
          <!-- Left: Score Deconstruction & Factors -->
          <div class="xai-deconstruct-card">
            <div class="xai-card-header">
              <div>
                <span class="${badgeClass}">${currentTxn.riskLevel} RISK</span>
                <h2 class="xai-txn-heading">Transaction: <span class="font-mono text-cyan">${currentTxn.id}</span></h2>
                <div class="xai-meta-sub">Account: ${currentTxn.accountId} • Amount: $${currentTxn.amount.toFixed(2)} • Store: ${currentTxn.merchant} • Device: ${currentTxn.device}</div>
              </div>
              <div class="xai-total-score-badge">
                <span class="score-large ${isCrit ? 'text-critical' : (isHigh ? 'text-orange' : 'text-success')}">${currentTxn.riskScore}</span>
                <span class="score-denom">/100</span>
              </div>
            </div>

            <div class="xai-why-section">
              <h3 class="why-flagged-title">Why was this transaction assigned this score?</h3>
              <p class="why-flagged-desc">
                FraudLens AI evaluated telemetry signals against individual baselines and global graph topology. Each contributing feature contributes directly to the total score:
              </p>
            </div>

            <!-- Mathematical Feature Contribution List -->
            <div class="feature-contributions-list">
              ${explanation.factors.map((f, i) => {
                const isMajor = f.score >= 18;
                return `
                  <div class="feature-item-card">
                    <div class="feature-top-row">
                      <div class="feature-title-block">
                        <span class="feature-num">#${i + 1}</span>
                        <span class="feature-name">${f.name}</span>
                      </div>
                      <span class="feature-score-tag ${isMajor ? 'tag-critical' : 'tag-neutral'}">+${f.score} pts</span>
                    </div>

                    <!-- Contribution Bar -->
                    <div class="feature-bar-wrap">
                      <div class="feature-bar-fill ${isMajor ? 'fill-critical' : 'fill-cyan'}" style="width: ${Math.min(100, (f.score / 28) * 100)}%"></div>
                    </div>

                    <div class="feature-evidence-row">
                      <span class="evidence-icon">🔍 Evidence:</span>
                      <span class="evidence-text">${f.evidence}</span>
                      <span class="confidence-tag">Confidence: ${f.confidence}%</span>
                    </div>
                  </div>
                `;
              }).join("")}
            </div>

            <!-- Formula Summary -->
            <div class="xai-formula-box">
              <span class="formula-label">Contribution Formula:</span>
              <span class="formula-math font-mono">
                ${explanation.factors.map(f => `+${f.score}`).join(" ")} = <strong>${currentTxn.riskScore}</strong> / 100
              </span>
            </div>
          </div>

          <!-- Right: Recommended Action & False Positive Exemption -->
          <div class="xai-sidebar-column">
            <!-- SECTION 14: RECOMMENDED ACTION -->
            <div class="recommended-action-card">
              <div class="rec-card-header">
                <div class="rec-icon-shield">🛡️</div>
                <div>
                  <h3 class="rec-title">Recommended Action</h3>
                  <div class="rec-confidence-badge">AI Confidence: ${recAction.confidence}%</div>
                </div>
              </div>

              <div class="rec-action-banner action-${recAction.type}">
                ${recAction.action}
              </div>

              <div class="rec-details-block">
                <div class="rec-field">
                  <span class="rec-field-lbl">Rationale:</span>
                  <span class="rec-field-val">${recAction.reason}</span>
                </div>
                <div class="rec-field">
                  <span class="rec-field-lbl">Standard Operating Procedure:</span>
                  <span class="rec-field-val">${recAction.guidance}</span>
                </div>
              </div>

              <div class="rec-action-buttons">
                ${currentTxn.riskScore >= 70 ? `
                  <button class="btn btn-danger btn-block" onclick="FraudLensToast.danger('Action Executed', 'Transaction ${currentTxn.id} blocked and session terminated.');">
                    Execute Recommended Action
                  </button>
                  <button class="btn btn-secondary btn-block" onclick="FraudLensToast.warning('Held for Audit', 'Transaction ${currentTxn.id} held in manual queue.');">
                    Hold for Operations Review
                  </button>
                ` : `
                  <button class="btn btn-success btn-block" onclick="FraudLensToast.success('Transaction Cleared', 'Zero friction pass-through applied.');">
                    Allow & Whitelist Transaction
                  </button>
                `}
              </div>
            </div>

            <!-- VIP Legitimate Clearance Note (False Positive Example) -->
            <div class="vip-protection-banner">
              <div class="vip-banner-header">
                <span class="vip-icon">💡</span>
                <span class="vip-title">False Positive Protection in Action</span>
              </div>
              <p class="vip-desc">
                When inspecting <strong>TXN-10115 ($4,200.00)</strong>, notice how a huge purchase amount was <em>not</em> flagged. The system verified enterprise hardware tokens and historical company spend habits, assigning a harmless risk score of <strong>14/100</strong>.
              </p>
              <button class="btn btn-secondary btn-xs" onclick="FraudLensExplainableAiPage.selectTxn('TXN-10115')">
                Inspect TXN-10115 Breakdown →
              </button>
            </div>
          </div>
        </div>

        <!-- SECTION 15 & 16: FALSE POSITIVE CONTROL & NORMAL VS ANOMALY -->
        <div class="fp-control-section">
          <div class="section-header-block">
            <div class="breadcrumb-tag">MODEL QUALITY & FALSE POSITIVE MITIGATION</div>
            <h2 class="section-title">False Positive Control & Behavioral Baseline</h2>
            <p class="section-desc">
              High detection precision without choking genuine consumer business. The system compares transactions against historical account behavior before assigning a high-risk score.
            </p>
          </div>

          <!-- 4 Core Quality Metrics -->
          <div class="fp-metrics-row">
            <div class="fp-metric-card">
              <span class="fp-val text-success">${fp.legitimateAllowedPct}%</span>
              <span class="fp-lbl">Legitimate High-Value Transactions Allowed</span>
              <span class="fp-sub">Tested across 19,420 baseline accounts</span>
            </div>
            <div class="fp-metric-card">
              <span class="fp-val text-cyan">${fp.falsePositiveRatePct}%</span>
              <span class="fp-lbl">False Positive Rate</span>
              <span class="fp-sub">Industry average: 4.8%</span>
            </div>
            <div class="fp-metric-card">
              <span class="fp-val">${fp.precisionPct}%</span>
              <span class="fp-lbl">Precision</span>
              <span class="fp-sub">Ratio of true fraud to flagged</span>
            </div>
            <div class="fp-metric-card">
              <span class="fp-val">${fp.recallPct}%</span>
              <span class="fp-lbl">Detection Recall</span>
              <span class="fp-sub">Syndicate ring capture rate</span>
            </div>
          </div>

          <!-- SECTION 16: VISUAL COMPARISON (Normal vs Anomalous Behavior) -->
          <div class="comparison-panels-grid">
            <!-- Normal Behavior -->
            <div class="behavior-panel panel-normal">
              <div class="behavior-panel-header">
                <span class="badge-safe">VERIFIED BASELINE</span>
                <h3 class="behavior-title">Normal Behavioral Profile</h3>
              </div>
              <div class="behavior-attributes-list">
                <div class="b-attr-item">
                  <span class="b-icon">💵</span>
                  <div>
                    <span class="b-label">Typical Transaction:</span>
                    <span class="b-value">$25 – $180</span>
                  </div>
                </div>
                <div class="b-attr-item">
                  <span class="b-icon">📍</span>
                  <div>
                    <span class="b-label">Location:</span>
                    <span class="b-value">Normal registered home corridor</span>
                  </div>
                </div>
                <div class="b-attr-item">
                  <span class="b-icon">📱</span>
                  <div>
                    <span class="b-label">Hardware Device:</span>
                    <span class="b-value">Known genuine device token</span>
                  </div>
                </div>
                <div class="b-attr-item">
                  <span class="b-icon">⏰</span>
                  <div>
                    <span class="b-label">Timing:</span>
                    <span class="b-value">Normal waking hours</span>
                  </div>
                </div>
                <div class="b-attr-item">
                  <span class="b-icon">🏬</span>
                  <div>
                    <span class="b-label">Merchant Category:</span>
                    <span class="b-value">Known recurring grocery & utilities</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Anomalous Behavior -->
            <div class="behavior-panel panel-anomalous">
              <div class="behavior-panel-header">
                <span class="badge-critical">ANOMALOUS ACTIVITY</span>
                <h3 class="behavior-title">Anomalous Behavior Profile</h3>
              </div>
              <div class="behavior-attributes-list">
                <div class="b-attr-item">
                  <span class="b-icon text-critical">⚡</span>
                  <div>
                    <span class="b-label">Observed Transaction:</span>
                    <span class="b-value text-critical font-semibold">$1,850.00 transaction (23x surge)</span>
                  </div>
                </div>
                <div class="b-attr-item">
                  <span class="b-icon text-critical">📍</span>
                  <div>
                    <span class="b-label">Location:</span>
                    <span class="b-value text-critical font-semibold">New location (620 km / offshore proxy)</span>
                  </div>
                </div>
                <div class="b-attr-item">
                  <span class="b-icon text-critical">📱</span>
                  <div>
                    <span class="b-label">Hardware Device:</span>
                    <span class="b-value text-critical font-semibold">Unknown / shared emulated build</span>
                  </div>
                </div>
                <div class="b-attr-item">
                  <span class="b-icon text-critical">⏰</span>
                  <div>
                    <span class="b-label">Timing:</span>
                    <span class="b-value text-critical font-semibold">Unusual midnight synchronized burst</span>
                  </div>
                </div>
                <div class="b-attr-item">
                  <span class="b-icon text-critical">🏬</span>
                  <div>
                    <span class="b-label">Merchant Category:</span>
                    <span class="b-value text-critical font-semibold">Merchant never used before (Luxury / Tech)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function selectTxn(id) {
    selectedTxnId = id;
    render("appContent");
  }

  return {
    render,
    selectTxn
  };
})();
