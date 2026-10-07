/**
 * FraudLens AI - Landing / Intro Section
 * High-impact hero page presenting the problem, vision, and entry points
 */

window.FraudLensLandingPage = (function () {
  function render(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
      <div class="landing-page-wrapper">
        <!-- Hero Section -->
        <section class="landing-hero">
          <div class="hero-badge-row">
            <span class="hero-tag">PROBLEM STATEMENT HNX26PSI04</span>
            <span class="hero-subtag">REAL-TIME FINANCIAL FRAUD INTELLIGENCE</span>
          </div>

          <h1 class="hero-title">
            Detect the patterns.<br/>
            <span class="hero-gradient-text">Stop the fraud.</span>
          </h1>

          <p class="hero-subtitle">
            Fraud does not always appear as one suspicious transaction. It often appears as coordinated patterns across multiple accounts, devices, stores, locations, and payment channels.
          </p>

          <div class="hero-cta-group">
            <button class="btn btn-primary btn-lg" onclick="FraudLensApp.navigate('overview')">
              Launch Intelligence Dashboard →
            </button>
            <button class="btn btn-demo-lg" onclick="FraudLensModal.showDemoModal()">
              <span>✨</span> View Fraud Ring Demo
            </button>
            <button class="btn btn-secondary btn-lg" onclick="FraudLensApp.navigate('network')">
              Explore Network Graph
            </button>
          </div>

          <!-- Hero Metrics Strip -->
          <div class="hero-metrics-strip">
            <div class="hero-metric-item">
              <span class="hero-metric-num text-cyan">24,891</span>
              <span class="hero-metric-lbl">Transactions Analyzed</span>
            </div>
            <div class="hero-metric-divider"></div>
            <div class="hero-metric-item">
              <span class="hero-metric-num text-critical">7</span>
              <span class="hero-metric-lbl">Syndicate Rings Detected</span>
            </div>
            <div class="hero-metric-divider"></div>
            <div class="hero-metric-item">
              <span class="hero-metric-num text-success">$184,250</span>
              <span class="hero-metric-lbl">Estimated Loss Prevented</span>
            </div>
            <div class="hero-metric-divider"></div>
            <div class="hero-metric-item">
              <span class="hero-metric-num text-accent">1.3%</span>
              <span class="hero-metric-lbl">Ultra-Low False Positive Rate</span>
            </div>
          </div>
        </section>

        <!-- Core Intelligence Pillars -->
        <section class="landing-pillars-section">
          <h2 class="landing-section-title">Why Legacy Rule Engines Fail & How FraudLens AI Solves It</h2>
          <div class="pillars-grid">
            <div class="pillar-card">
              <div class="pillar-icon">🕸️</div>
              <h3 class="pillar-title">Coordinated Ring Detection</h3>
              <p class="pillar-desc">
                Disparate accounts acting in synchrony to scalp inventory or drain credit lines are immediately identified via graph correlation algorithms connecting shared hardware and destination vaults.
              </p>
              <div class="pillar-tag">Graph Analysis</div>
            </div>

            <div class="pillar-card">
              <div class="pillar-icon">🧠</div>
              <h3 class="pillar-title">Explainable AI (XAI)</h3>
              <p class="pillar-desc">
                No black-box guesses. Every risk score is decomposed into transparent mathematical contributions (amount deviation, device novelty, emulator detection, and syndicate edges) with confidence metrics.
              </p>
              <div class="pillar-tag">Decomposed Scoring</div>
            </div>

            <div class="pillar-card">
              <div class="pillar-icon">🛡️</div>
              <h3 class="pillar-title">False Positive Protection</h3>
              <p class="pillar-desc">
                Protects legitimate VIP clients and enterprise purchases from embarrassing declines. Historical baseline profiling ensures genuine high-value purchases clear without customer friction.
              </p>
              <div class="pillar-tag">98.7% Legitimate Allowed</div>
            </div>

            <div class="pillar-card">
              <div class="pillar-icon">⚡</div>
              <h3 class="pillar-title">Actionable Containment</h3>
              <p class="pillar-desc">
                Automated containment recommendations: Temporary Holds, Step-Up Biometrics, Outbound Clearing Wire Freezes, and Destination Mule Blacklisting executed with one click.
              </p>
              <div class="pillar-tag">Real-Time SOC Playbooks</div>
            </div>
          </div>
        </section>

        <!-- Hackathon Judging Showcase Banner -->
        <section class="landing-demo-banner">
          <div class="demo-banner-content">
            <div class="banner-badge">HACKATHON DEMO SCENARIO</div>
            <h3 class="banner-title">Fraud Ring #FR-07: Coordinated Product Scalping</h3>
            <p class="banner-desc">
              10 accounts, 6 emulated devices, 4 merchants, and 5 locations converging funds into 1 common offshore destination. Experience the full detection lifecycle.
            </p>
          </div>
          <button class="btn btn-primary" onclick="FraudLensModal.showDemoModal()">
            Run Ring Demo Now →
          </button>
        </section>
      </div>
    `;
  }

  return {
    render
  };
})();
