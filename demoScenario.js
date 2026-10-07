/**
 * FraudLens AI - Demo Mode Scenario Engine for Hackathon Judges
 * Scenario: Coordinated Fraud Ring FR-07 Detection Lifecycle
 */

window.FraudLensDemo = (function () {
  const scenarioSteps = [
    {
      step: 1,
      phase: "Baseline Monitoring",
      time: "10:00:00 PM",
      title: "Normal Baseline Operations",
      description: "FraudLens AI observes regular consumer transactions across banking rails. System false positive guard active. Baseline spend limits are within normal distribution.",
      status: "SAFE",
      activeAccounts: ["ACC-8831", "ACC-9014", "ACC-1092"],
      metrics: { analyzed: "24,891", flagged: "327", rings: "6" },
      highlightNodes: ["ACC-8831", "M-FoodHub", "ACC-9014"],
      actionAdvice: "Normal operations. High-value legitimate transactions bypass holds."
    },
    {
      step: 2,
      phase: "Syndicate Probe & Device Sharing",
      time: "10:02:15 PM",
      title: "Coordinated Probe Purchases Commenced",
      description: "10 disparate accounts (ACC-2041 through ACC-2050) initiate identical $1,299 GPU SKU checkouts across ElectroMart and TechNexus. 4 accounts share the single emulated device DEV-91.",
      status: "WARNING",
      activeAccounts: ["ACC-2041", "ACC-2042", "ACC-2043", "ACC-2044"],
      metrics: { analyzed: "24,895", flagged: "331", rings: "6" },
      highlightNodes: ["ACC-2041", "ACC-2042", "DEV-91", "M-ElectroMart"],
      actionAdvice: "Flagged Device DEV-91. Graph relationship density elevated to 3.8."
    },
    {
      step: 3,
      phase: "Geo-Discrepancy & Virtualization",
      time: "10:15:30 PM",
      title: "Geographic Inconsistency & Headless Automation",
      description: "Accounts ACC-2043 and ACC-2048 checkout via VirtualBox fingerprint DEV-92 (Singapore proxy) and Kali headless browser DEV-104 (Mumbai). Cart completion time < 0.4s.",
      status: "HIGH_RISK",
      activeAccounts: ["ACC-2043", "ACC-2047", "ACC-2048", "ACC-2049"],
      metrics: { analyzed: "24,902", flagged: "338", rings: "6" },
      highlightNodes: ["ACC-2043", "DEV-92", "DEV-104", "LOC-Singapore", "LOC-Dubai"],
      actionAdvice: "Algorithmic bot sequence detected (Pattern 06). Confidence: 93%."
    },
    {
      step: 4,
      phase: "Funneling & Graph Convergence",
      time: "11:03:00 PM",
      title: "Fund Extraction to Common Mule Vault",
      description: "All 10 accounts simultaneously initiate rapid outbound wires through CloudPay Remit, converging all proceeds ($78,420) into a single offshore aggregation account: ACC-MULE-881.",
      status: "CRITICAL",
      activeAccounts: ["ACC-2041", "ACC-2043", "ACC-2045", "ACC-2047", "ACC-2050", "ACC-MULE-881"],
      metrics: { analyzed: "24,912", flagged: "348", rings: "7" },
      highlightNodes: ["ACC-MULE-881", "M-CloudPay", "ACC-2041", "ACC-2043", "ACC-2045"],
      actionAdvice: "Common Destination Anomaly (Pattern 04). Ring probability: 99.4%."
    },
    {
      step: 5,
      phase: "AI Ring Detection & Containment",
      time: "11:04:12 PM",
      title: "Fraud Ring #FR-07 Confirmed & Auto-Containment",
      description: "FraudLens AI graph intelligence clusters 10 accounts, 6 devices, 4 merchants, and 5 locations. Ring Risk Score: 96/100 (CRITICAL). Automated hold placed, preventing $78,420 loss.",
      status: "CONTAINED",
      activeAccounts: ["ALL 10 RING ACCOUNTS", "ACC-MULE-881"],
      metrics: { analyzed: "24,929", flagged: "365", rings: "7", prevented: "$184,250 + $78,420" },
      highlightNodes: [
        "ACC-2041", "ACC-2042", "ACC-2043", "ACC-2044", "ACC-2045", "ACC-2046", "ACC-2047", "ACC-2048", "ACC-2049", "ACC-2050",
        "DEV-91", "DEV-92", "DEV-83", "DEV-44", "DEV-104", "ACC-MULE-881", "M-ElectroMart", "M-CloudPay"
      ],
      actionAdvice: "RECOMMENDED ACTION EXECUTED: All 10 Ring Accounts Frozen. Destination Mule Blacklisted."
    }
  ];

  return {
    scenarioSteps
  };
})();
