/**
 * FraudLens AI - Explainable AI (XAI) Risk Engine
 * Computes transparent, decomposed risk scores and evidence contributions
 */

window.FraudLensRiskEngine = (function () {
  /**
   * Determine risk tier and color from raw score
   */
  function getRiskLevel(score) {
    if (score >= 90) return { label: "CRITICAL", color: "#ef4444", bg: "rgba(239, 68, 68, 0.15)", border: "rgba(239, 68, 68, 0.4)" };
    if (score >= 70) return { label: "HIGH", color: "#f97316", bg: "rgba(249, 115, 22, 0.15)", border: "rgba(249, 115, 22, 0.4)" };
    if (score >= 40) return { label: "MEDIUM", color: "#eab308", bg: "rgba(234, 179, 8, 0.15)", border: "rgba(234, 179, 8, 0.4)" };
    return { label: "LOW", color: "#10b981", bg: "rgba(16, 185, 129, 0.15)", border: "rgba(16, 185, 129, 0.4)" };
  }

  /**
   * Determine recommended action based on risk score & flags
   */
  function getRecommendedAction(score, hasRingLink, isMule) {
    if (isMule || (score >= 95 && hasRingLink)) {
      return {
        action: "FREEZE ACCOUNT & BLACKLIST DESTINATION",
        type: "danger",
        confidence: 97,
        reason: "Active participation in confirmed Coordinated Fraud Ring #FR-07.",
        guidance: "Immediate systemic lockout across all linked device tokens and outbound clearing rails."
      };
    }
    if (score >= 90) {
      return {
        action: "BLOCK TRANSACTION & TEMPORARILY FREEZE",
        type: "danger",
        confidence: 94,
        reason: "Severe anomaly: multiple shared emulator devices and velocity spikes.",
        guidance: "Halt transaction authorization; notify fraud operations for manual KYC audit."
      };
    }
    if (score >= 75) {
      return {
        action: "TEMPORARILY HOLD TRANSACTION",
        type: "warning",
        confidence: 92,
        reason: "Unusual purchasing sequence correlated with high-risk merchant targets.",
        guidance: "Place funds in escrow queue for 30 minutes; analyze graph neighborhood."
      };
    }
    if (score >= 50) {
      return {
        action: "REQUEST STEP-UP VERIFICATION & MONITOR",
        type: "warning",
        confidence: 86,
        reason: "Moderate anomaly in geographic location or unfamiliar terminal.",
        guidance: "Trigger hardware-bound WebAuthn or out-of-band push authorization."
      };
    }
    return {
      action: "ALLOW TRANSACTION",
      type: "success",
      confidence: 99,
      reason: "Consistent with historical account behavior, known hardware, and residential baseline.",
      guidance: "Pass through clearing channel; preserve zero-friction user experience."
    };
  }

  /**
   * Deconstruct transaction risk into explainable feature contributions
   */
  function analyzeTransaction(txn, account, allAccounts, devices) {
    if (txn.explanation && txn.explanation.factors) {
      return txn.explanation;
    }

    const factors = [];
    let runningScore = 0;

    // 1. Amount deviation analysis
    const accountAvg = (account && account.normalSpendAvg) || 75.0;
    const amountRatio = txn.amount / accountAvg;

    if (amountRatio > 5.0) {
      const contrib = Math.min(25, Math.round(15 + (amountRatio - 5)));
      factors.push({
        name: `Extreme amount deviation (${amountRatio.toFixed(1)}x normal)`,
        score: contrib,
        confidence: 98,
        evidence: `Amount $${txn.amount.toFixed(2)} exceeds normal account benchmark of $${accountAvg.toFixed(2)}`
      });
      runningScore += contrib;
    } else if (amountRatio > 2.0) {
      const contrib = 14;
      factors.push({
        name: `Elevated transaction value (${amountRatio.toFixed(1)}x normal)`,
        score: contrib,
        confidence: 91,
        evidence: `Amount $${txn.amount.toFixed(2)} moderately higher than standard baseline $${accountAvg.toFixed(2)}`
      });
      runningScore += contrib;
    } else {
      factors.push({
        name: "Historical amount baseline conformity",
        score: 4,
        confidence: 99,
        evidence: `Amount $${txn.amount.toFixed(2)} is well within historical spending tolerance`
      });
      runningScore += 4;
    }

    // 2. Device analysis
    const devInfo = devices.find(d => d.id === txn.device);
    if (devInfo && devInfo.linkedAccounts > 1) {
      const contrib = devInfo.linkedAccounts >= 3 ? 24 : 16;
      factors.push({
        name: `Shared device fingerprint (${devInfo.linkedAccounts} accounts)`,
        score: contrib,
        confidence: 99,
        evidence: `${devInfo.id} (${devInfo.name}) is actively shared by multiple flagged entities`
      });
      runningScore += contrib;
    } else if (devInfo && devInfo.isRooted) {
      const contrib = 20;
      factors.push({
        name: "Rooted / Emulated execution environment",
        score: contrib,
        confidence: 96,
        evidence: `${devInfo.name} exhibited containerized or virtualized environment signatures`
      });
      runningScore += contrib;
    } else {
      factors.push({
        name: "Known trusted device binding",
        score: 3,
        confidence: 98,
        evidence: "Device cryptographic keychain validated against registered hardware profile"
      });
      runningScore += 3;
    }

    // 3. Ring connection
    if (account && account.fraudRingId) {
      const contrib = 23;
      factors.push({
        name: `Fraud Ring connection #${account.fraudRingId}`,
        score: contrib,
        confidence: 98,
        evidence: `Direct graph edge connected to syndicate cluster #${account.fraudRingId}`
      });
      runningScore += contrib;
    }

    // 4. Location discrepancy
    if (txn.location === "Singapore" || txn.location === "Dubai" || txn.location === "Jaipur") {
      const contrib = 15;
      factors.push({
        name: "Unusual geographic access point",
        score: contrib,
        confidence: 92,
        evidence: `Geolocation hop to ${txn.location} deviates significantly from home billing registry`
      });
      runningScore += contrib;
    } else {
      factors.push({
        name: "Residential geolocation match",
        score: 5,
        confidence: 97,
        evidence: `Transaction initiated within verified home corridor (${txn.location})`
      });
      runningScore += 5;
    }

    const finalScore = Math.min(99, Math.max(10, runningScore));
    return {
      score: finalScore,
      factors: factors
    };
  }

  /**
   * Compare normal baseline vs anomalous behavior metrics
   */
  function getBehavioralComparison() {
    return {
      normal: {
        title: "Normal Behavioral Baseline",
        metrics: [
          { label: "Typical Transaction Range", value: "$25.00 – $180.00", icon: "dollar-sign" },
          { label: "Geographical Origin", value: "Registered Home Metro Corridor (0–15 km)", icon: "map-pin" },
          { label: "Device Binding", value: "Single Verified Hardware Keychain Token", icon: "smartphone" },
          { label: "Temporal Velocity", value: "Standard Business/Evening Hours (1–2 txn/day)", icon: "clock" },
          { label: "Merchant Familiarity", value: "Known Essential & Recurring Utilities", icon: "shopping-bag" },
          { label: "False Positive Defense", value: "Automatic VIP/Corporate White-Listing Active", icon: "shield-check" }
        ]
      },
      anomalous: {
        title: "Anomalous Syndicate Profile",
        metrics: [
          { label: "Observed Transaction Amount", value: "$1,850.00 – $4,200.00 (Burst Spike)", icon: "alert-triangle", alert: true },
          { label: "Geographical Origin", value: "Rapid Hop across 620+ km / Offshore Proxy", icon: "globe", alert: true },
          { label: "Device Binding", value: "Emulated S24 / Headless Script Farm (4+ accounts)", icon: "cpu", alert: true },
          { label: "Temporal Velocity", value: "Sub-Second Automated Synchronized Bursts", icon: "zap", alert: true },
          { label: "Merchant Target", value: "High-Liquidity Luxury Tech & Offshore Remit", icon: "store", alert: true },
          { label: "Graph Convergence", value: "Funds Aggregated to Destination Mule X", icon: "git-merge", alert: true }
        ]
      }
    };
  }

  return {
    getRiskLevel,
    getRecommendedAction,
    analyzeTransaction,
    getBehavioralComparison
  };
})();
