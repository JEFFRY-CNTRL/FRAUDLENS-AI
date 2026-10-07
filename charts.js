/**
 * FraudLens AI - Interactive Zero-Dependency Visualizations Engine
 * Renders Donut Charts, Time-Series Area Charts, and XAI Contribution Meters
 */

window.FraudLensCharts = (function () {
  /**
   * Render Transaction Risk Distribution Donut Chart
   */
  function renderRiskDonut(canvasId, stats) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;
    const cx = width / 2;
    const cy = height / 2;
    const radius = Math.min(cx, cy) - 20;
    const innerRadius = radius * 0.62;

    const data = [
      { label: "Low Risk", value: stats.low || 82.4, color: "#10b981" },
      { label: "Medium Risk", value: stats.medium || 12.1, color: "#eab308" },
      { label: "High Risk", value: stats.high || 4.2, color: "#f97316" },
      { label: "Critical", value: stats.critical || 1.3, color: "#ef4444" }
    ];

    const total = data.reduce((a, b) => a + b.value, 0);
    let startAngle = -Math.PI / 2;

    ctx.clearRect(0, 0, width, height);

    data.forEach(segment => {
      const sliceAngle = (segment.value / total) * (Math.PI * 2);
      ctx.beginPath();
      ctx.arc(cx, cy, radius, startAngle, startAngle + sliceAngle);
      ctx.arc(cx, cy, innerRadius, startAngle + sliceAngle, startAngle, true);
      ctx.closePath();

      ctx.fillStyle = segment.color;
      ctx.fill();

      // Thin separation border
      ctx.lineWidth = 2;
      ctx.strokeStyle = "#0c121e";
      ctx.stroke();

      startAngle += sliceAngle;
    });

    // Center display
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 20px system-ui";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("24.8k", cx, cy - 8);

    ctx.fillStyle = "#94a3b8";
    ctx.font = "11px system-ui";
    ctx.fillText("Analyzed", cx, cy + 12);
  }

  /**
   * Render Fraud Risk Over Time Area/Line Chart with Event Spikes
   */
  function renderRiskTimeline(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;
    const padLeft = 45;
    const padRight = 25;
    const padTop = 25;
    const padBottom = 35;
    const plotW = width - padLeft - padRight;
    const plotH = height - padTop - padBottom;

    // Time points with realistic spikes for FR-07 and FR-03 bursts
    const points = [
      { time: "20:00", risk: 14, label: "Baseline" },
      { time: "20:15", risk: 18, label: "" },
      { time: "20:30", risk: 22, label: "" },
      { time: "20:45", risk: 38, label: "FR-03 farm" },
      { time: "21:00", risk: 28, label: "" },
      { time: "21:02", risk: 78, label: "FR-07 probe" },
      { time: "21:08", risk: 94, label: "Burst spike" },
      { time: "21:10", risk: 96, label: "Mule funnel" },
      { time: "21:12", risk: 42, label: "Contained" }
    ];

    ctx.clearRect(0, 0, width, height);

    // Draw horizontal grid lines
    ctx.strokeStyle = "rgba(255, 255, 255, 0.07)";
    ctx.lineWidth = 1;
    ctx.font = "10px system-ui";
    ctx.fillStyle = "#64748b";
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";

    const yLevels = [0, 25, 50, 75, 100];
    yLevels.forEach(lvl => {
      const y = padTop + plotH - (lvl / 100) * plotH;
      ctx.beginPath();
      ctx.moveTo(padLeft, y);
      ctx.lineTo(width - padRight, y);
      ctx.stroke();
      ctx.fillText(lvl + "%", padLeft - 8, y);
    });

    // Compute coordinate mapping
    const coords = points.map((p, i) => {
      const x = padLeft + (i / (points.length - 1)) * plotW;
      const y = padTop + plotH - (p.risk / 100) * plotH;
      return { x, y, ...p };
    });

    // Fill gradient under curve
    const grad = ctx.createLinearGradient(0, padTop, 0, padTop + plotH);
    grad.addColorStop(0, "rgba(239, 68, 68, 0.45)");
    grad.addColorStop(0.5, "rgba(249, 115, 22, 0.2)");
    grad.addColorStop(1, "rgba(6, 182, 212, 0.0)");

    ctx.beginPath();
    ctx.moveTo(coords[0].x, padTop + plotH);
    coords.forEach(pt => ctx.lineTo(pt.x, pt.y));
    ctx.lineTo(coords[coords.length - 1].x, padTop + plotH);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();

    // Draw main line
    ctx.beginPath();
    coords.forEach((pt, i) => {
      if (i === 0) ctx.moveTo(pt.x, pt.y);
      else ctx.lineTo(pt.x, pt.y);
    });
    ctx.strokeStyle = "#38bdf8";
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Draw points and spikes
    coords.forEach(pt => {
      const isCritical = pt.risk >= 80;
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, isCritical ? 5.5 : 3.5, 0, Math.PI * 2);
      ctx.fillStyle = isCritical ? "#ef4444" : "#0284c7";
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = "#ffffff";
      ctx.stroke();

      // Spike label
      if (pt.label) {
        ctx.fillStyle = isCritical ? "#f87171" : "#94a3b8";
        ctx.font = isCritical ? "bold 10px system-ui" : "9px system-ui";
        ctx.textAlign = "center";
        ctx.textBaseline = "bottom";
        ctx.fillText(pt.label, pt.x, pt.y - 8);
      }

      // X-axis time label
      ctx.fillStyle = "#64748b";
      ctx.font = "10px system-ui";
      ctx.textAlign = "center";
      ctx.textBaseline = "top";
      ctx.fillText(pt.time, pt.x, padTop + plotH + 8);
    });
  }

  /**
   * Render XAI Contribution Waterfall / Meter
   */
  function renderXaiMeter(containerId, factors, totalScore) {
    const container = document.getElementById(containerId);
    if (!container) return;

    let html = `
      <div class="xai-meter-header">
        <div class="xai-total-score">
          <span class="xai-score-num ${totalScore >= 90 ? 'critical' : (totalScore >= 70 ? 'high' : 'safe')}">${totalScore}</span>
          <span class="xai-score-label">/ 100 Calculated Risk Score</span>
        </div>
        <div class="xai-confidence-pill">AI Confidence: 96.8%</div>
      </div>
      <div class="xai-factor-bars">
    `;

    factors.forEach(f => {
      const pct = Math.min(100, (f.score / 35) * 100);
      const isHigh = f.score >= 20;
      html += `
        <div class="xai-factor-row">
          <div class="xai-factor-meta">
            <span class="xai-factor-name">${f.name}</span>
            <span class="xai-factor-pts">+${f.score} pts</span>
          </div>
          <div class="xai-bar-track">
            <div class="xai-bar-fill ${isHigh ? 'critical' : 'moderate'}" style="width: ${pct}%"></div>
          </div>
          <div class="xai-factor-evidence">
            <span class="evidence-icon">🔍</span>
            <span class="evidence-text">${f.evidence}</span>
            <span class="evidence-conf">(${f.confidence}% conf)</span>
          </div>
        </div>
      `;
    });

    html += `</div>`;
    container.innerHTML = html;
  }

  return {
    renderRiskDonut,
    renderRiskTimeline,
    renderXaiMeter
  };
})();
