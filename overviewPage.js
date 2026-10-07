/**
 * FraudLens AI - Overview Page (SOC Radar)
 * Self-contained & defensive: every number is safely formatted, so a missing
 * value can never crash the page. Styles are scoped (.ov-*) and injected here.
 */

window.FraudLensOverviewPage = (function () {
  const STYLE_ID = "ov-inline-style";
  let subscribed = false;
  let resizeBound = false;
  const live = { total: 25030, suspicious: 361 };

  // ---------- helpers ----------
  const num = (v, fb = 0) => (typeof v === "number" && isFinite(v) ? v : fb);
  const fmt = (v, fb = 0) => num(v, fb).toLocaleString("en-IN");
  const safe = (fn, fb) => { try { const r = fn(); return r === undefined || r === null ? fb : r; } catch (e) { return fb; } };

  function injectStyle() {
    if (document.getElementById(STYLE_ID)) return;
    const s = document.createElement("style");
    s.id = STYLE_ID;
    s.textContent = `
      .ov{padding:20px 24px;color:#e2e8f0;font-family:system-ui,sans-serif}
      .ov-hero{display:flex;flex-wrap:wrap;align-items:center;gap:10px;font-size:13px;color:#cbd5e1;margin-bottom:10px}
      .ov-hero b{font-size:18px;color:#fff}
      .ov-live{color:#34d399;font-size:11px;letter-spacing:.08em}
      .ov-actions{display:flex;gap:10px;margin-bottom:16px;flex-wrap:wrap}
      .ov-btn{padding:8px 14px;border-radius:8px;font-size:12px;font-weight:600;cursor:pointer;border:1px solid #1e3a5f;background:#0f1d33;color:#fff}
      .ov-btn.primary{background:#0ea5e9;border-color:#0ea5e9}
      .ov-btn.danger{background:rgba(239,68,68,.15);border-color:#ef4444;color:#fca5a5}
      .ov-kpis{display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:14px;margin-bottom:18px}
      .ov-card{background:#0c1424;border:1px solid #17233b;border-radius:12px;padding:16px}
      .ov-kpi-title{font-size:11px;letter-spacing:.06em;color:#94a3b8;display:flex;justify-content:space-between}
      .ov-kpi-val{font-size:28px;font-weight:700;color:#fff;margin:10px 0 6px;display:flex;align-items:baseline;justify-content:space-between}
      .ov-kpi-val small{font-size:11px;font-weight:600}
      .ov-bar{height:4px;border-radius:4px;background:#1e293b;overflow:hidden;margin:8px 0 6px}
      .ov-bar i{display:block;height:100%}
      .ov-sub{font-size:10px;color:#64748b}
      .ov-green{color:#34d399}.ov-red{color:#f87171}.ov-cyan{color:#22d3ee}.ov-amber{color:#fbbf24}
      .ov-row{display:grid;grid-template-columns:1fr 1.7fr;gap:16px;margin-bottom:18px}
      .ov-row2{display:grid;grid-template-columns:1.2fr 1fr;gap:16px;margin-bottom:18px}
      @media(max-width:980px){.ov-row,.ov-row2{grid-template-columns:1fr}}
      .ov-h{display:flex;justify-content:space-between;align-items:center;margin-bottom:4px}
      .ov-h h3{margin:0;font-size:15px;color:#fff}
      .ov-desc{font-size:11px;color:#64748b;margin-bottom:12px}
      .ov-pill{font-size:10px;padding:3px 9px;border-radius:99px;background:rgba(34,211,238,.12);color:#22d3ee}
      .ov-canvas{width:100%;height:280px;display:block}
      .ov-legend{display:grid;grid-template-columns:1fr 1fr;gap:6px;font-size:11px;color:#94a3b8;margin-top:10px}
      .ov-dot{display:inline-block;width:8px;height:8px;border-radius:50%;margin-right:6px}
      .ov-tabs{display:flex;gap:6px}
      .ov-tab{font-size:10px;padding:3px 9px;border-radius:6px;border:1px solid #1e293b;background:#0f1d33;color:#94a3b8;cursor:pointer}
      .ov-tab.active{color:#22d3ee;border-color:#22d3ee}
      .ov-spikes{display:flex;gap:10px;flex-wrap:wrap;margin-top:10px;font-size:11px}
      .ov-spike{padding:5px 10px;border-radius:6px;background:rgba(239,68,68,.15);border:1px solid #7f1d1d;color:#fca5a5}
      .ov-alert{background:linear-gradient(135deg,#1c0f17,#0c1424);border-color:#5b1a26}
      .ov-tag{font-size:10px;padding:3px 8px;border-radius:6px;background:rgba(239,68,68,.2);color:#fca5a5;font-weight:700}
      .ov-score{border:1px solid #7f1d1d;border-radius:10px;padding:8px 14px;color:#f87171;font-size:24px;font-weight:700}
      .ov-score small{font-size:11px;color:#94a3b8}
      .ov-chips{display:flex;flex-wrap:wrap;gap:8px;margin:12px 0}
      .ov-chip{font-size:10px;padding:4px 9px;border-radius:99px;border:1px solid #1e3a5f;background:#0f1d33;color:#94a3b8}
      .ov-fp{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-top:10px}
      .ov-fp div{background:#0f1d33;border:1px solid #1e293b;border-radius:10px;padding:12px 6px;text-align:center}
      .ov-fp b{display:block;font-size:20px;margin-bottom:4px}
      .ov-fp span{font-size:9px;color:#64748b}
    `;
    document.head.appendChild(s);
  }

  function kpiCard(title, icon, value, valueNote, noteClass, barPct, barColor, sub, id) {
    return `
      <div class="ov-card">
        <div class="ov-kpi-title"><span>${title}</span><span>${icon}</span></div>
        <div class="ov-kpi-val"><span ${id ? `id="${id}"` : ""}>${value}</span><small class="${noteClass}">${valueNote}</small></div>
        <div class="ov-bar"><i style="width:${barPct}%;background:${barColor}"></i></div>
        <div class="ov-sub">${sub}</div>
      </div>`;
  }

  function render(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    injectStyle();

    const D = window.FraudLensData || {};
    const k = safe(() => D.kpis, {}) || {};
    const rings = safe(() => D.fraudRings, []) || [];
    const ring = rings.find(r => r.id === "FR-07") || rings[0] || {};
    const fp = safe(() => D.falsePositiveMetrics, {}) || {};

    live.total = Math.max(live.total, num(k.totalTransactions, 0), 25030);
    live.suspicious = Math.max(live.suspicious, 361);

    const prevented = num(k.estimatedFraudPrevented, 233696);
    const highRisk = num(k.highRiskAccounts, 48);
    const ringCount = rings.length || 7;
    const critical = rings.filter(r => r.status === "CRITICAL").length || 3;

    container.innerHTML = `
      <div class="ov">
        <div class="ov-hero">
          <span class="ov-live">● LIVE SOC RADAR</span>
          <b>Real-Time Threat Overview</b>
          <span>Continuously evaluating cross-account entity relationships across all payment rails.</span>
        </div>
        <div class="ov-actions">
          <button class="ov-btn" onclick="FraudLensModal.showDemoModal()">✨ Run Hackathon Ring Demo</button>
          <button class="ov-btn" onclick="FraudLensApp.navigate('transactions')">View Live Stream ( ⚡ )</button>
        </div>

        <div class="ov-kpis">
          ${kpiCard("TOTAL TRANSACTIONS", "📊", fmt(live.total), "↑ 12.4%", "ov-green", 80, "#38bdf8", "Peak 480 txn/sec", "ovTotal")}
          ${kpiCard("TRANSACTIONS ANALYZED", "🔍", fmt(live.total), "100%", "ov-cyan", 100, "#38bdf8", "Avg latency: " + num(fp.avgScoringLatencyMs, 14.8) + "ms", "ovAnalyzed")}
          ${kpiCard("SUSPICIOUS TRANSACTIONS", "⚠️", fmt(live.suspicious), "1.31% flag rate", "ov-red", 30, "#f97316", "+18 in last hour", "ovSuspicious")}
          ${kpiCard("HIGH RISK ACCOUNTS", "👤", fmt(highRisk), "↑ +3 today", "ov-green", 45, "#f97316", "14 under active hold")}
          ${kpiCard("FRAUD RINGS DETECTED", "🕸️", fmt(ringCount), critical + " Critical Active", "ov-red", 65, "#22d3ee", rings.slice(0, 3).map(r => r.id).join(", ") || "FR-07, FR-03, FR-11")}
          ${kpiCard("ESTIMATED FRAUD PREVENTED", "🛡️", "$" + fmt(prevented), "+$12,400 today", "ov-green", 98, "#10b981", num(fp.legitimateAllowedPct, 98.7) + "% accuracy")}
        </div>

        <div class="ov-row">
          <div class="ov-card">
            <div class="ov-h"><h3>Transaction Risk Distribution</h3><span class="ov-pill">Real-Time</span></div>
            <div class="ov-desc">Categorized breakdown across all 24,891 operations</div>
            <canvas id="ovDonut" class="ov-canvas"></canvas>
            <div class="ov-legend">
              <span><i class="ov-dot" style="background:#10b981"></i>Low Risk: 82.4%</span>
              <span><i class="ov-dot" style="background:#eab308"></i>Medium Risk: 12.1%</span>
              <span><i class="ov-dot" style="background:#f97316"></i>High Risk: 4.2%</span>
              <span><i class="ov-dot" style="background:#ef4444"></i>Critical: 1.3%</span>
            </div>
          </div>
          <div class="ov-card">
            <div class="ov-h"><h3>Fraud Risk Over Time</h3>
              <div class="ov-tabs">
                <button class="ov-tab active" onclick="FraudLensOverviewPage.setRange(this)">1 Hour</button>
                <button class="ov-tab" onclick="FraudLensOverviewPage.setRange(this)">6 Hours</button>
                <button class="ov-tab" onclick="FraudLensOverviewPage.setRange(this)">24 Hours</button>
              </div>
            </div>
            <div class="ov-desc">Y-Axis: Risk Score (0–100%) vs X-Axis: Time (Spikes reveal coordinated syndicate bursts)</div>
            <canvas id="ovTimeline" class="ov-canvas"></canvas>
            <div class="ov-spikes">
              <span class="ov-spike">Spike #1 (21:08): Synchronized $1,299 GPU Bursts (FR-07)</span>
              <span class="ov-sub" style="color:#cbd5e1">Spike #2 (21:10): Mule Funnel Extraction Attempt</span>
            </div>
          </div>
        </div>

        <div class="ov-row2">
          <div class="ov-card ov-alert">
            <div style="display:flex;justify-content:space-between;align-items:flex-start">
              <div>
                <span class="ov-tag">CRITICAL ALERT</span>
                <h3 style="margin:10px 0 4px;color:#fff;font-size:18px">Coordinated Fraud Ring #${ring.id || "FR-07"}</h3>
                <div class="ov-sub">${num(ring.accountsCount, 10)} Accounts • ${num(ring.devicesCount, 6)} Devices • ${num(ring.merchantsCount, 4)} Merchants • $78,420 Volume</div>
              </div>
              <div class="ov-score">${num(ring.riskScore, 96)} <small>/100</small></div>
            </div>
            <p style="font-size:12px;color:#cbd5e1;margin:12px 0">"${ring.patternSummary || "Multiple accounts purchased the same unusual products in the same sequence and transferred funds to a common destination (ACC-MULE-881)."}"</p>
            <div class="ov-chips">
              <span class="ov-chip">Core Account: ACC-2041</span>
              <span class="ov-chip">Shared Hardware: DEV-91 (Emulator)</span>
              <span class="ov-chip">Destination Mule: ${ring.destinationAccount || "ACC-MULE-881"}</span>
              <span class="ov-chip">Target Store: ElectroMart</span>
            </div>
            <div class="ov-actions" style="margin:0">
              <button class="ov-btn primary" onclick="FraudLensModal.showInvestigationModal('${ring.id || "FR-07"}')">Investigate Ring ${ring.id || "FR-07"} →</button>
              <button class="ov-btn" onclick="FraudLensOverviewPage.viewCluster()">View Network Cluster</button>
              <button class="ov-btn danger" onclick="FraudLensOverviewPage.freezeRing()">Freeze Ring</button>
            </div>
          </div>

          <div class="ov-card">
            <div class="ov-h"><h3>False Positive Protection</h3><span class="ov-pill">Behavioral Baseline Active</span></div>
            <div class="ov-desc">Guarding legitimate high-value customers from erroneous declines</div>
            <div class="ov-fp">
              <div><b class="ov-green">${num(fp.legitimateAllowedPct, 98.7)}%</b><span>Legitimate High-Value Allowed</span></div>
              <div><b class="ov-cyan">${num(fp.falsePositiveRatePct, 1.3)}%</b><span>False Positive Rate</span></div>
              <div><b class="ov-green">${num(fp.precisionPct, 97.8)}%</b><span>Model Precision</span></div>
              <div><b class="ov-green">${num(fp.recallPct, 94.2)}%</b><span>Detection Recall</span></div>
            </div>
            <p style="font-size:11px;color:#94a3b8;margin-top:14px">The system compares transactions against <b style="color:#fff">${fmt(fp.baselineProfileCount, 19420)} historical account baselines</b> before assigning a high-risk score. For example, a $4,200 enterprise purchase by Zenith Ltd (ACC-9014) is automatically granted frictionless clearance because hardware tokens, corporate IP, and monthly patterns match established baselines.</p>
          </div>
        </div>
      </div>`;

    // Draw charts after layout so canvases have real sizes
    requestAnimationFrame(drawCharts);

    if (!resizeBound) {
      resizeBound = true;
      window.addEventListener("resize", () => { if (document.getElementById("ovDonut")) drawCharts(); });
    }

    // Live counters from the simulator (guarded: works even if it is missing)
    if (!subscribed && window.FraudLensSimulator && typeof FraudLensSimulator.subscribe === "function") {
      subscribed = true;
      FraudLensSimulator.subscribe((type, data) => {
        if (type !== "new_transaction") return;
        live.total += 1;
        if (data && num(data.riskScore, 0) >= 70) live.suspicious += 1;
        ["ovTotal", "ovAnalyzed"].forEach(id => { const e = document.getElementById(id); if (e) e.textContent = fmt(live.total); });
        const s = document.getElementById("ovSuspicious"); if (s) s.textContent = fmt(live.suspicious);
      });
    }
  }

  function drawCharts() {
    if (!window.FraudLensCharts) return;
    safe(() => FraudLensCharts.renderRiskDonut("ovDonut", { low: 82.4, medium: 12.1, high: 4.2, critical: 1.3 }));
    safe(() => FraudLensCharts.renderRiskTimeline("ovTimeline"));
  }

  function setRange(btn) {
    document.querySelectorAll(".ov-tab").forEach(t => t.classList.remove("active"));
    btn.classList.add("active");
    drawCharts();
  }

  function viewCluster() {
    FraudLensApp.navigate("network");
    setTimeout(() => safe(() => FraudLensNetworkGraph.focusRingCluster("FR-07")), 300);
  }

  function freezeRing() {
    if (window.FraudLensToast) FraudLensToast.danger("Ring FR-07 Frozen", "All 10 ring accounts frozen and ACC-MULE-881 blacklisted.");
  }

  return { render, setRange, viewCluster, freezeRing };
})();