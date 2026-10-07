/**
 * FraudLens AI - Real-Time Transaction Simulator
 * Injects controlled live simulated transactions and fires system events
 */

window.FraudLensSimulator = (function () {
  let isRunning = true;
  let intervalId = null;
  let tickIntervalMs = 3500;
  let listeners = [];
  let txnCounter = 10502;

  // Real-time generator pools
  const sampleAccounts = [
    { id: "ACC-8831", name: "Deepak Chawla", dev: "DEV-21", loc: "Coimbatore", riskBase: 15 },
    { id: "ACC-1092", name: "Ananya Iyer", dev: "DEV-77", loc: "Chennai", riskBase: 20 },
    { id: "ACC-7721", name: "Rahul Dravid", dev: "DEV-IPHONE-16", loc: "Bangalore", riskBase: 25 },
    { id: "ACC-9014", name: "Zenith Enterprise", dev: "DEV-CORP-01", loc: "Bangalore", riskBase: 12 },
    { id: "ACC-2041", name: "Alex Mercer", dev: "DEV-91", loc: "Chennai", riskBase: 92 },
    { id: "ACC-2044", name: "Sanjay Singhania", dev: "DEV-91", loc: "Coimbatore", riskBase: 91 },
    { id: "ACC-6120", name: "Meera Krishnan", dev: "DEV-TAB-09", loc: "Jaipur", riskBase: 55 }
  ];

  const merchants = [
    "ElectroMart", "FoodHub", "UrbanMart Express", "TechNexus Online", "CloudPay Remit", "QuickCrypto Exchange", "LuxuryTime Watches"
  ];

  function getTimestamp() {
    const d = new Date();
    return d.toTimeString().split(" ")[0];
  }

  function start() {
    if (intervalId) clearInterval(intervalId);
    isRunning = true;
    intervalId = setInterval(tick, tickIntervalMs);
    notifyListeners("status", { isRunning: true });
  }

  function pause() {
    if (intervalId) clearInterval(intervalId);
    intervalId = null;
    isRunning = false;
    notifyListeners("status", { isRunning: false });
  }

  function toggle() {
    if (isRunning) {
      pause();
    } else {
      start();
    }
    return isRunning;
  }

  function setSpeed(ms) {
    tickIntervalMs = ms;
    if (isRunning) {
      start();
    }
  }

  function subscribe(fn) {
    listeners.push(fn);
    return () => {
      listeners = listeners.filter(l => l !== fn);
    };
  }

  function notifyListeners(type, data) {
    listeners.forEach(fn => {
      try {
        fn(type, data);
      } catch (e) {
        console.error("Simulator listener error:", e);
      }
    });
  }

  function tick() {
    if (!isRunning) return;

    // 80% safe transactions, 20% suspicious/elevated transactions
    const isSuspicious = Math.random() < 0.22;
    let selectedAcc;
    let amount;
    let merchant;
    let location;
    let device;
    let riskScore;
    let riskLevel;
    let reason;
    let recommendedAction;
    let explanation;

    if (isSuspicious) {
      // Pick a ring account or elevated user
      const suspiciousPool = sampleAccounts.filter(a => a.riskBase > 50);
      selectedAcc = suspiciousPool[Math.floor(Math.random() * suspiciousPool.length)];
      amount = Math.floor(600 + Math.random() * 2200) + 0.50;
      merchant = Math.random() > 0.5 ? "ElectroMart" : (Math.random() > 0.5 ? "CloudPay Remit" : "QuickCrypto Exchange");
      location = selectedAcc.loc;
      device = selectedAcc.dev;
      riskScore = Math.floor(85 + Math.random() * 12);
      riskLevel = riskScore >= 90 ? "CRITICAL" : "HIGH";
      reason = "Syndicate sequence pattern + shared emulator " + device;
      recommendedAction = riskScore >= 90 ? "Block Transaction" : "Temporarily Hold";
      explanation = {
        score: riskScore,
        factors: [
          { name: "Burst transaction velocity", score: 24, confidence: 97, evidence: "Correlated multi-account order pattern" },
          { name: "Shared emulator hardware", score: 26, confidence: 99, evidence: `${device} observed in 4 concurrent sessions` },
          { name: "Ring FR-07 graph linkage", score: 22, confidence: 98, evidence: "Direct connection to Mule ACC-MULE-881" },
          { name: "Amount velocity anomaly", score: 18, confidence: 92, evidence: `$${amount.toFixed(2)} exceeds 99th percentile limit` }
        ]
      };
    } else {
      // Safe transaction
      const safePool = sampleAccounts.filter(a => a.riskBase < 50);
      selectedAcc = safePool[Math.floor(Math.random() * safePool.length)];
      if (selectedAcc.id === "ACC-9014") {
        // Legitimate high-value business client
        amount = Math.floor(2500 + Math.random() * 2500) + 0.00;
        merchant = "Apex Retail B2B";
        riskScore = 14;
        riskLevel = "LOW";
        reason = "Legitimate high-value corporate purchase (Protected False Positive)";
        recommendedAction = "Allow Transaction";
      } else {
        amount = Math.floor(18 + Math.random() * 95) + 0.25;
        merchant = Math.random() > 0.5 ? "FoodHub" : "UrbanMart Express";
        riskScore = Math.floor(12 + Math.random() * 15);
        riskLevel = "LOW";
        reason = "Normal recurring consumer behavior";
        recommendedAction = "Allow Transaction";
      }
      location = selectedAcc.loc;
      device = selectedAcc.dev;
      explanation = {
        score: riskScore,
        factors: [
          { name: "Historical amount baseline", score: 4, confidence: 99, evidence: "Transaction value conforms with profile habits" },
          { name: "Device cryptographic binding", score: 3, confidence: 99, evidence: "Registered personal smartphone" },
          { name: "Geographic residential corridor", score: 4, confidence: 98, evidence: `Matches standard home registry (${location})` }
        ]
      };
    }

    const newTxn = {
      id: "TXN-" + (++txnCounter),
      accountId: selectedAcc.id,
      amount: amount,
      merchant: merchant,
      location: location,
      device: device,
      timestamp: getTimestamp(),
      riskScore: riskScore,
      riskLevel: riskLevel,
      reason: reason,
      recommendedAction: recommendedAction,
      explanation: explanation
    };

    // Update global dataset
    if (window.FraudLensData) {
      window.FraudLensData.kpis.totalTransactions += 1;
      window.FraudLensData.kpis.transactionsAnalyzed += 1;
      if (riskLevel === "CRITICAL" || riskLevel === "HIGH") {
        window.FraudLensData.kpis.suspiciousTransactions += 1;
        window.FraudLensData.kpis.estimatedFraudPrevented += amount;
      }
      window.FraudLensData.initialTransactions.unshift(newTxn);
      if (window.FraudLensData.initialTransactions.length > 50) {
        window.FraudLensData.initialTransactions.pop();
      }
    }

    // Broadcast new transaction and updated metrics
    notifyListeners("new_transaction", newTxn);
    notifyListeners("kpi_update", window.FraudLensData ? window.FraudLensData.kpis : null);
  }

  // Self start immediately
  setTimeout(() => {
    start();
  }, 1000);

  return {
    start,
    pause,
    toggle,
    setSpeed,
    subscribe,
    isRunning: () => isRunning
  };
})();
