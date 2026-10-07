/**
 * FraudLens AI - Centralized Financial Fraud Intelligence Store
 * Problem: HNX26PSI04: Real-Time Financial Fraud Intelligence
 * 
 * Provides:
 * - 20+ Customer Accounts with forensic profiling and activity histories
 * - 80+ Relational Transactions spanning Oct 1–Oct 7, 2026 with full forensic telemetry
 * - Alerts, Fraud Rings, Shared Hardware, Graph Nodes/Edges, and Audit Logs
 * - Dynamic recalculation of KPIs, Fraud Prevention metrics, and Trends
 * - Persistent browser localStorage state management for Block/Unblock actions
 */

window.FraudLensData = (function () {
  const STORAGE_KEY = "fraudlens_soc_state_v3";

  // Base Accounts Data (22 Accounts: Mix of Ring Mules, High-Risk Bots, Safe Consumers, and VIP Corporates)
  const defaultAccounts = [
    {
      id: "ACC-2041",
      customerId: "CUST-1041",
      holderName: "Alex Mercer (Synthetic ID)",
      accountNumber: "AC••••4821",
      email: "a***r@syntech.io",
      mobile: "+91 98765 ••041",
      accountType: "Savings",
      status: "ACTIVE",
      riskScore: 96,
      riskLevel: "CRITICAL",
      devices: ["DEV-91", "DEV-92"],
      locations: ["Chennai", "Coimbatore", "Singapore"],
      fraudConnections: 8,
      balance: 142500.00,
      joinedDate: "2026-08-14",
      lastLogin: "2026-10-07 21:05:14",
      fraudRingId: "FR-07",
      flagReason: "Core mule in Coordinated Scalping Ring FR-07; identical burst checkouts on DEV-91",
      suspiciousActivity: "3 synchronized luxury electronics checkouts; fund funneling to ACC-MULE-881",
      normalSpendAvg: 5500.00,
      activityHistory: [
        { time: "2026-10-07 21:10:42", action: "Flagged Suspicious", admin: "AI Risk Engine", reason: "Synchronized burst pattern detected with ACC-2042" },
        { time: "2026-10-05 14:22:10", action: "Device Linked", admin: "System", reason: "New hardware signature DEV-92 registered from Singapore proxy" },
        { time: "2026-08-14 10:00:00", action: "Account Created", admin: "Onboarding System", reason: "Digital e-KYC verified" }
      ]
    },
    {
      id: "ACC-2042",
      customerId: "CUST-1042",
      holderName: "Rohan Varma",
      accountNumber: "AC••••5932",
      email: "r***a@varmaholdings.in",
      mobile: "+91 98401 ••142",
      accountType: "Current",
      status: "ACTIVE",
      riskScore: 94,
      riskLevel: "CRITICAL",
      devices: ["DEV-91", "DEV-83"],
      locations: ["Chennai", "Bangalore"],
      fraudConnections: 7,
      balance: 89050.00,
      joinedDate: "2026-08-19",
      lastLogin: "2026-10-07 21:08:30",
      fraudRingId: "FR-07",
      flagReason: "Synchronized purchasing pattern with ACC-2041 on emulated hardware DEV-91",
      suspiciousActivity: "High-value GPU checkout within 5 seconds of sibling node",
      normalSpendAvg: 6000.00,
      activityHistory: [
        { time: "2026-10-07 21:08:30", action: "Flagged Suspicious", admin: "AI Risk Engine", reason: "Sub-second synchronized checkout at ElectroMart" },
        { time: "2026-08-19 11:30:00", action: "Account Created", admin: "Onboarding System", reason: "Self-service onboarding" }
      ]
    },
    {
      id: "ACC-2043",
      customerId: "CUST-1043",
      holderName: "David K. Chen",
      accountNumber: "AC••••7124",
      email: "d***n@chenlogistics.com",
      mobile: "+91 98192 ••243",
      accountType: "Savings",
      status: "ACTIVE",
      riskScore: 92,
      riskLevel: "CRITICAL",
      devices: ["DEV-92", "DEV-44"],
      locations: ["Chennai", "Dubai"],
      fraudConnections: 6,
      balance: 112000.00,
      joinedDate: "2026-08-20",
      lastLogin: "2026-10-07 21:09:48",
      fraudRingId: "FR-07",
      flagReason: "Virtual machine clone DEV-92; common extraction destination ACC-MULE-881",
      suspiciousActivity: "Rapid wire outbound transfer via CloudPay Remit with zero dormancy",
      normalSpendAvg: 6800.00,
      activityHistory: [
        { time: "2026-10-07 21:09:48", action: "Flagged Suspicious", admin: "AI Risk Engine", reason: "23x normal spend elevation + offshore proxy hop" },
        { time: "2026-08-20 09:15:00", action: "Account Created", admin: "Onboarding System", reason: "Branch verified" }
      ]
    },
    {
      id: "ACC-2044",
      customerId: "CUST-1044",
      holderName: "Sanjay Singhania",
      accountNumber: "AC••••8235",
      email: "s***a@singhaniatraders.in",
      mobile: "+91 99402 ••344",
      accountType: "Current",
      status: "ACTIVE",
      riskScore: 91,
      riskLevel: "CRITICAL",
      devices: ["DEV-91"],
      locations: ["Coimbatore", "Chennai"],
      fraudConnections: 6,
      balance: 67500.00,
      joinedDate: "2026-08-22",
      lastLogin: "2026-10-07 21:06:55",
      fraudRingId: "FR-07",
      flagReason: "Identical transaction burst at ElectroMart and shared DEV-91 binding",
      suspiciousActivity: "Repeated card velocity testing probes across retail POS",
      normalSpendAvg: 4500.00,
      activityHistory: [
        { time: "2026-10-07 21:06:55", action: "Flagged High Risk", admin: "AI Risk Engine", reason: "Direct mule transfer initiate to ACC-MULE-881" },
        { time: "2026-08-22 14:00:00", action: "Account Created", admin: "Onboarding System", reason: "Standard onboarding" }
      ]
    },
    {
      id: "ACC-2045",
      customerId: "CUST-1045",
      holderName: "Kavita Rao",
      accountNumber: "AC••••9346",
      email: "k***o@raodesigns.org",
      mobile: "+91 97903 ••445",
      accountType: "Savings",
      status: "ACTIVE",
      riskScore: 89,
      riskLevel: "HIGH",
      devices: ["DEV-83"],
      locations: ["Chennai", "Bangalore"],
      fraudConnections: 5,
      balance: 54000.00,
      joinedDate: "2026-08-25",
      lastLogin: "2026-10-07 20:55:10",
      fraudRingId: "FR-07",
      flagReason: "Rapid fund transfer to destination mule via CloudPay Remit",
      suspiciousActivity: "Outbound drain triggered 45 seconds after voucher deposit",
      normalSpendAvg: 7500.00,
      activityHistory: [
        { time: "2026-10-07 20:55:10", action: "Flagged High Risk", admin: "AI Risk Engine", reason: "Rapid liquidity drain anomaly" },
        { time: "2026-08-25 16:30:00", action: "Account Created", admin: "Onboarding System", reason: "Online KYC" }
      ]
    },
    {
      id: "ACC-2046",
      customerId: "CUST-1046",
      holderName: "Vikram Malhotra",
      accountNumber: "AC••••1457",
      email: "v***a@malhotrafin.com",
      mobile: "+91 98844 ••546",
      accountType: "Current",
      status: "ACTIVE",
      riskScore: 88,
      riskLevel: "HIGH",
      devices: ["DEV-44"],
      locations: ["Chennai"],
      fraudConnections: 5,
      balance: 43000.00,
      joinedDate: "2026-08-28",
      lastLogin: "2026-10-07 20:50:00",
      fraudRingId: "FR-07",
      flagReason: "High-velocity product testing sequence on luxury electronics merchants",
      suspiciousActivity: "Multiple micro-authorizations followed by max cart checkout",
      normalSpendAvg: 5000.00,
      activityHistory: [
        { time: "2026-10-07 20:50:00", action: "Flagged High Risk", admin: "AI Risk Engine", reason: "Tor exit node session match DEV-44" },
        { time: "2026-08-28 12:10:00", action: "Account Created", admin: "Onboarding System", reason: "Commercial partner" }
      ]
    },
    {
      id: "ACC-2047",
      customerId: "CUST-1047",
      holderName: "Priya Sundaram",
      accountNumber: "AC••••2568",
      email: "p***m@sundaramlabs.in",
      mobile: "+91 94445 ••647",
      accountType: "Savings",
      status: "ACTIVE",
      riskScore: 87,
      riskLevel: "HIGH",
      devices: ["DEV-92"],
      locations: ["Chennai", "Singapore"],
      fraudConnections: 5,
      balance: 78000.00,
      joinedDate: "2026-09-01",
      lastLogin: "2026-10-07 20:45:22",
      fraudRingId: "FR-07",
      flagReason: "Proxy IP switching linked to Ring FR-07 emulator farm",
      suspiciousActivity: "Singapore IP checkout 12 minutes after Chennai domestic session",
      normalSpendAvg: 6200.00,
      activityHistory: [
        { time: "2026-10-07 20:45:22", action: "Flagged High Risk", admin: "AI Risk Engine", reason: "Impossible physical travel velocity" },
        { time: "2026-09-01 15:40:00", action: "Account Created", admin: "Onboarding System", reason: "Standard onboarding" }
      ]
    },
    {
      id: "ACC-2048",
      customerId: "CUST-1048",
      holderName: "Tariq Mansoor",
      accountNumber: "AC••••3679",
      email: "t***r@mansoorholdings.com",
      mobile: "+91 98206 ••748",
      accountType: "Current",
      status: "ACTIVE",
      riskScore: 95,
      riskLevel: "CRITICAL",
      devices: ["DEV-91", "DEV-104"],
      locations: ["Mumbai", "Chennai"],
      fraudConnections: 6,
      balance: 91000.00,
      joinedDate: "2026-09-02",
      lastLogin: "2026-10-07 21:01:19",
      fraudRingId: "FR-07",
      flagReason: "Rooted device DEV-104 credential cycling and automated headless webdriver orders",
      suspiciousActivity: "Cart checkout executed in 0.38 seconds at LuxuryTime Watches",
      normalSpendAvg: 5500.00,
      activityHistory: [
        { time: "2026-10-07 21:01:19", action: "Flagged Critical", admin: "AI Risk Engine", reason: "Headless Kali Linux automation signature" },
        { time: "2026-09-02 10:20:00", action: "Account Created", admin: "Onboarding System", reason: "Standard verification" }
      ]
    },
    {
      id: "ACC-2049",
      customerId: "CUST-1049",
      holderName: "Elena Rostova",
      accountNumber: "AC••••4780",
      email: "e***a@rostovaglobal.net",
      mobile: "+91 97117 ••849",
      accountType: "Savings",
      status: "ACTIVE",
      riskScore: 85,
      riskLevel: "HIGH",
      devices: ["DEV-104"],
      locations: ["Dubai", "Chennai"],
      fraudConnections: 4,
      balance: 62000.00,
      joinedDate: "2026-09-05",
      lastLogin: "2026-10-07 20:30:15",
      fraudRingId: "FR-07",
      flagReason: "Repeated luxury purchase pattern at TechNexus matching FR-07 sequence",
      suspiciousActivity: "Sequential high-end tech orders matching syndicate SKU batch",
      normalSpendAvg: 7000.00,
      activityHistory: [
        { time: "2026-10-07 20:30:15", action: "Flagged High Risk", admin: "AI Risk Engine", reason: "Correlated purchase sequence matching FR-07" },
        { time: "2026-09-05 13:00:00", action: "Account Created", admin: "Onboarding System", reason: "Digital KYC" }
      ]
    },
    {
      id: "ACC-2050",
      customerId: "CUST-1050",
      holderName: "Arjun Nair",
      accountNumber: "AC••••5891",
      email: "a***r@nairtech.in",
      mobile: "+91 99008 ••950",
      accountType: "Current",
      status: "ACTIVE",
      riskScore: 86,
      riskLevel: "HIGH",
      devices: ["DEV-83"],
      locations: ["Coimbatore"],
      fraudConnections: 4,
      balance: 51000.00,
      joinedDate: "2026-09-06",
      lastLogin: "2026-10-07 20:25:00",
      fraudRingId: "FR-07",
      flagReason: "Automated sequence timing (burst interval < 4s) across common payment gateway",
      suspiciousActivity: "High-frequency voucher redemption burst",
      normalSpendAvg: 5800.00,
      activityHistory: [
        { time: "2026-10-07 20:25:00", action: "Flagged High Risk", admin: "AI Risk Engine", reason: "Timing interval variance < 100ms (Bot signature)" },
        { time: "2026-09-06 17:15:00", action: "Account Created", admin: "Onboarding System", reason: "Branch verification" }
      ]
    },
    {
      id: "ACC-MULE-881",
      customerId: "CUST-9881",
      holderName: "Global Offshore Vault (Mule Account X)",
      accountNumber: "AC••••9981",
      email: "m***e@offshorevault.ky",
      mobile: "+91 90000 ••881",
      accountType: "Corporate",
      status: "BLOCKED",
      riskScore: 99,
      riskLevel: "CRITICAL",
      devices: ["DEV-99X"],
      locations: ["Offshore Hub / Cayman"],
      fraudConnections: 14,
      balance: 1482000.00,
      joinedDate: "2026-07-10",
      lastLogin: "2026-10-07 19:40:00",
      fraudRingId: "FR-07",
      flagReason: "Ultimate aggregation mule account funneled by 10 scalping accounts in Ring FR-07",
      suspiciousActivity: "Converging inbound wires totaling ₹78,42,000 within 60 minutes",
      normalSpendAvg: 0.00,
      activityHistory: [
        { time: "2026-10-07 19:45:00", action: "Account Blocked", admin: "Admin (SOC Lead)", reason: "Syndicate extraction vault confirmed in Ring FR-07 investigation" },
        { time: "2026-10-07 19:30:00", action: "Flagged Critical", admin: "AI Risk Engine", reason: "Convergence of 10 incoming remittance wires" }
      ]
    },
    {
      id: "ACC-3101",
      customerId: "CUST-3101",
      holderName: "Samir Sen",
      accountNumber: "AC••••6902",
      email: "s***n@senassociates.in",
      mobile: "+91 98210 ••101",
      accountType: "Current",
      status: "ACTIVE",
      riskScore: 89,
      riskLevel: "HIGH",
      devices: ["DEV-FARM-01", "DEV-FARM-02"],
      locations: ["Mumbai", "Delhi"],
      fraudConnections: 6,
      balance: 124000.00,
      joinedDate: "2026-08-01",
      lastLogin: "2026-10-07 21:02:45",
      fraudRingId: "FR-03",
      flagReason: "Device farm emulator rig matching 7 concurrent high-risk accounts",
      suspiciousActivity: "Rapid sequential crypto buy on QuickCrypto Exchange",
      normalSpendAvg: 9200.00,
      activityHistory: [
        { time: "2026-10-07 21:02:45", action: "Flagged High Risk", admin: "AI Risk Engine", reason: "Device farm signature DEV-FARM-01" },
        { time: "2026-08-01 11:00:00", action: "Account Created", admin: "Onboarding System", reason: "Business onboarding" }
      ]
    },
    {
      id: "ACC-3102",
      customerId: "CUST-3102",
      holderName: "Nisha Patel",
      accountNumber: "AC••••7013",
      email: "n***l@patelcreatives.com",
      mobile: "+91 98791 ••102",
      accountType: "Savings",
      status: "ACTIVE",
      riskScore: 84,
      riskLevel: "HIGH",
      devices: ["DEV-FARM-01"],
      locations: ["Mumbai", "London"],
      fraudConnections: 5,
      balance: 78000.00,
      joinedDate: "2026-08-05",
      lastLogin: "2026-10-07 20:15:30",
      fraudRingId: "FR-03",
      flagReason: "Rapid geographic switching under 20 minutes across international VPNs",
      suspiciousActivity: "Micro-debits preceding sudden large withdrawal attempt",
      normalSpendAvg: 8000.00,
      activityHistory: [
        { time: "2026-10-07 20:15:30", action: "Flagged High Risk", admin: "AI Risk Engine", reason: "Cloud Android Farm Rig match" },
        { time: "2026-08-05 14:20:00", action: "Account Created", admin: "Onboarding System", reason: "Self-service" }
      ]
    },
    {
      id: "ACC-3103",
      customerId: "CUST-3103",
      holderName: "Aakash Mehta",
      accountNumber: "AC••••8124",
      email: "a***a@mehtaventures.in",
      mobile: "+91 98252 ••103",
      accountType: "Current",
      status: "ACTIVE",
      riskScore: 82,
      riskLevel: "HIGH",
      devices: ["DEV-FARM-01"],
      locations: ["Mumbai"],
      fraudConnections: 4,
      balance: 95000.00,
      joinedDate: "2026-08-08",
      lastLogin: "2026-10-07 19:50:00",
      fraudRingId: "FR-03",
      flagReason: "Shared WebGL canvas fingerprint and hardware concurrency on DEV-FARM-01",
      suspiciousActivity: "Synchronized login session with ACC-3101 and ACC-3102",
      normalSpendAvg: 7500.00,
      activityHistory: [
        { time: "2026-10-07 19:50:00", action: "Flagged High Risk", admin: "AI Risk Engine", reason: "Hardware fingerprint correlation" },
        { time: "2026-08-08 10:45:00", action: "Account Created", admin: "Onboarding System", reason: "Online KYC" }
      ]
    },
    {
      id: "ACC-6120",
      customerId: "CUST-6120",
      holderName: "Meera Krishnan",
      accountNumber: "AC••••9235",
      email: "m***n@krishnanarts.in",
      mobile: "+91 98413 ••120",
      accountType: "Savings",
      status: "UNDER REVIEW",
      riskScore: 58,
      riskLevel: "MEDIUM",
      devices: ["DEV-TAB-09"],
      locations: ["Delhi", "Jaipur"],
      fraudConnections: 1,
      balance: 31000.00,
      joinedDate: "2026-01-20",
      lastLogin: "2026-10-07 21:04:10",
      fraudRingId: null,
      flagReason: "First-time crypto purchase while traveling in Jaipur; step-up verification prompted",
      suspiciousActivity: "High-value crypto on-ramp transaction 3.2x above domestic average",
      normalSpendAvg: 7800.00,
      activityHistory: [
        { time: "2026-10-07 21:04:10", action: "Step-Up Verification Requested", admin: "AI Risk Engine", reason: "Geographic travel anomaly; 2FA triggered" },
        { time: "2026-01-20 09:30:00", action: "Account Created", admin: "Onboarding System", reason: "Full KYC verified" }
      ]
    },
    {
      id: "ACC-8831",
      customerId: "CUST-8831",
      holderName: "Deepak Chawla",
      accountNumber: "AC••••1346",
      email: "d***a@chawlaeng.com",
      mobile: "+91 94434 ••831",
      accountType: "Savings",
      status: "ACTIVE",
      riskScore: 18,
      riskLevel: "LOW",
      devices: ["DEV-21"],
      locations: ["Coimbatore"],
      fraudConnections: 0,
      balance: 42000.00,
      joinedDate: "2024-03-12",
      lastLogin: "2026-10-07 21:10:15",
      fraudRingId: null,
      flagReason: "Legitimate customer: consistent residential profile and verified hardware token",
      suspiciousActivity: "None. Zero anomalies detected in 24-month tenure.",
      normalSpendAvg: 3800.00,
      activityHistory: [
        { time: "2026-10-07 21:10:15", action: "Transaction Approved", admin: "AI Risk Engine", reason: "Matches historical baseline at FoodHub" },
        { time: "2024-03-12 11:00:00", action: "Account Created", admin: "Branch Manager", reason: "In-person KYC completed" }
      ]
    },
    {
      id: "ACC-9014",
      customerId: "CUST-9014",
      holderName: "Zenith Enterprise Solutions Ltd",
      accountNumber: "AC••••2457",
      email: "f***e@zenithenterprise.in",
      mobile: "+91 80235 ••014",
      accountType: "Corporate",
      status: "ACTIVE",
      riskScore: 14,
      riskLevel: "LOW",
      devices: ["DEV-CORP-01", "DEV-CORP-02"],
      locations: ["Bangalore", "Mumbai"],
      fraudConnections: 0,
      balance: 4850000.00,
      joinedDate: "2023-01-15",
      lastLogin: "2026-10-07 21:07:12",
      fraudRingId: null,
      flagReason: "Legitimate high-value B2B client protected from false positive declines",
      suspiciousActivity: "None. High procurement spending conforms with corporate profile.",
      normalSpendAvg: 315000.00,
      activityHistory: [
        { time: "2026-10-07 21:07:12", action: "VIP Pass-Through", admin: "AI Risk Engine", reason: "₹4,20,000 B2B invoice cleared via dedicated hardware token" },
        { time: "2023-01-15 10:00:00", action: "Account Created", admin: "Corporate Banking Head", reason: "Enterprise account onboarded" }
      ]
    },
    {
      id: "ACC-1092",
      customerId: "CUST-1092",
      holderName: "Ananya Iyer",
      accountNumber: "AC••••3568",
      email: "a***r@iyerarchitects.in",
      mobile: "+91 98405 ••092",
      accountType: "Salary",
      status: "ACTIVE",
      riskScore: 22,
      riskLevel: "LOW",
      devices: ["DEV-77"],
      locations: ["Chennai"],
      fraudConnections: 0,
      balance: 154000.00,
      joinedDate: "2024-11-04",
      lastLogin: "2026-10-07 21:05:22",
      fraudRingId: null,
      flagReason: "Verified salaried profile with stable residential IP and registered MacBook Pro",
      suspiciousActivity: "None. Regular utility and retail purchases.",
      normalSpendAvg: 9800.00,
      activityHistory: [
        { time: "2026-10-07 21:05:22", action: "Transaction Approved", admin: "AI Risk Engine", reason: "Standard grocery purchase at UrbanMart Express" },
        { time: "2024-11-04 15:30:00", action: "Account Created", admin: "Salary Desk", reason: "Corporate salary tie-up" }
      ]
    },
    {
      id: "ACC-7721",
      customerId: "CUST-7721",
      holderName: "Rahul Dravid",
      accountNumber: "AC••••4679",
      email: "r***d@dravidacademy.org",
      mobile: "+91 98456 ••721",
      accountType: "Savings",
      status: "ACTIVE",
      riskScore: 24,
      riskLevel: "LOW",
      devices: ["DEV-IPHONE-16"],
      locations: ["Bangalore"],
      fraudConnections: 0,
      balance: 290000.00,
      joinedDate: "2025-02-18",
      lastLogin: "2026-10-07 20:40:00",
      fraudRingId: null,
      flagReason: "Stable salary direct deposit & verified Apple biometric keychain",
      suspiciousActivity: "None. Typical family consumer spend profile.",
      normalSpendAvg: 6900.00,
      activityHistory: [
        { time: "2025-02-18 10:00:00", action: "Account Created", admin: "Branch Officer", reason: "KYC verified" }
      ]
    },
    {
      id: "ACC-5511",
      customerId: "CUST-5511",
      holderName: "Kiran Bedi",
      accountNumber: "AC••••5780",
      email: "k***i@beditrust.org",
      mobile: "+91 98107 ••511",
      accountType: "Savings",
      status: "ACTIVE",
      riskScore: 26,
      riskLevel: "LOW",
      devices: ["DEV-55"],
      locations: ["Delhi"],
      fraudConnections: 0,
      balance: 185000.00,
      joinedDate: "2025-05-10",
      lastLogin: "2026-10-07 18:20:00",
      fraudRingId: null,
      flagReason: "Institutional trust account with regular scheduled donations",
      suspiciousActivity: "None. Consistent philanthropic disbursements.",
      normalSpendAvg: 4200.00,
      activityHistory: [
        { time: "2025-05-10 11:30:00", action: "Account Created", admin: "Trust Dept", reason: "Registered trust verification" }
      ]
    },
    {
      id: "ACC-5512",
      customerId: "CUST-5512",
      holderName: "Aditya Birla Finance Partner",
      accountNumber: "AC••••6891",
      email: "p***s@adityabirlapartners.in",
      mobile: "+91 98208 ••512",
      accountType: "Corporate",
      status: "ACTIVE",
      riskScore: 16,
      riskLevel: "LOW",
      devices: ["DEV-CORP-02"],
      locations: ["Mumbai"],
      fraudConnections: 0,
      balance: 3820000.00,
      joinedDate: "2024-06-15",
      lastLogin: "2026-10-07 17:45:00",
      fraudRingId: null,
      flagReason: "Corporate wholesale channel; high transaction volume baseline",
      suspiciousActivity: "None. Verified corporate clearing channel.",
      normalSpendAvg: 240000.00,
      activityHistory: [
        { time: "2024-06-15 14:00:00", action: "Account Created", admin: "Corporate Desk", reason: "Wholesale partnership" }
      ]
    },
    {
      id: "ACC-4401",
      customerId: "CUST-4401",
      holderName: "Suresh Kumar",
      accountNumber: "AC••••7902",
      email: "s***r@kumarlogistics.com",
      mobile: "+91 94459 ••401",
      accountType: "Salary",
      status: "ACTIVE",
      riskScore: 29,
      riskLevel: "LOW",
      devices: ["DEV-41"],
      locations: ["Chennai"],
      fraudConnections: 0,
      balance: 62000.00,
      joinedDate: "2025-09-12",
      lastLogin: "2026-10-07 16:30:00",
      fraudRingId: null,
      flagReason: "Regular consumer account with direct salary deposit",
      suspiciousActivity: "None. Predictable monthly retail activity.",
      normalSpendAvg: 5100.00,
      activityHistory: [
        { time: "2025-09-12 16:00:00", action: "Account Created", admin: "Salary Desk", reason: "Direct payroll" }
      ]
    }
  ];

  // Base Devices Data
  const defaultDevices = [
    { id: "DEV-91", name: "Samsung Galaxy S24 (Emulated)", type: "Mobile/Emulator", linkedAccounts: 4, isRooted: true, risk: "Critical", lastLocation: "Chennai" },
    { id: "DEV-92", name: "VirtualBox Fingerprint Clone", type: "Virtual Machine", linkedAccounts: 3, isRooted: true, risk: "Critical", lastLocation: "Singapore" },
    { id: "DEV-83", name: "OnePlus 12 Rooted Build", type: "Mobile Rooted", linkedAccounts: 3, isRooted: true, risk: "High", lastLocation: "Coimbatore" },
    { id: "DEV-44", name: "Tor Gateway Node 44", type: "Proxy/VPN Node", linkedAccounts: 2, isRooted: false, risk: "High", lastLocation: "Dubai" },
    { id: "DEV-104", name: "Linux Kali Script Container", type: "Headless Browser", linkedAccounts: 2, isRooted: true, risk: "Critical", lastLocation: "Mumbai" },
    { id: "DEV-FARM-01", name: "Cloud Android Farm Rig #1", type: "Device Farm", linkedAccounts: 3, isRooted: true, risk: "Critical", lastLocation: "Mumbai" },
    { id: "DEV-FARM-02", name: "Cloud Android Farm Rig #2", type: "Device Farm", linkedAccounts: 2, isRooted: true, risk: "Critical", lastLocation: "Delhi" },
    { id: "DEV-99X", name: "Offshore Shell Server 99X", type: "Cloud Datacenter", linkedAccounts: 1, isRooted: false, risk: "Critical", lastLocation: "Cayman" },
    { id: "DEV-21", name: "Apple iPhone 15 Pro", type: "Genuine Mobile", linkedAccounts: 1, isRooted: false, risk: "Safe", lastLocation: "Coimbatore" },
    { id: "DEV-77", name: "MacBook Pro M3 Max", type: "Genuine Desktop", linkedAccounts: 1, isRooted: false, risk: "Safe", lastLocation: "Chennai" },
    { id: "DEV-CORP-01", name: "Corporate Dell Precision Workstation", type: "Enterprise Verified", linkedAccounts: 1, isRooted: false, risk: "Safe", lastLocation: "Bangalore" },
    { id: "DEV-CORP-02", name: "Lenovo ThinkPad P1 Corporate", type: "Enterprise Verified", linkedAccounts: 1, isRooted: false, risk: "Safe", lastLocation: "Mumbai" },
    { id: "DEV-TAB-09", name: "Apple iPad Pro 12.9", type: "Genuine Tablet", linkedAccounts: 1, isRooted: false, risk: "Medium", lastLocation: "Jaipur" },
    { id: "DEV-IPHONE-16", name: "Apple iPhone 16", type: "Genuine Mobile", linkedAccounts: 1, isRooted: false, risk: "Safe", lastLocation: "Bangalore" },
    { id: "DEV-55", name: "Samsung Galaxy Tab S9", type: "Genuine Tablet", linkedAccounts: 1, isRooted: false, risk: "Safe", lastLocation: "Delhi" },
    { id: "DEV-41", name: "OnePlus 11 5G", type: "Genuine Mobile", linkedAccounts: 1, isRooted: false, risk: "Safe", lastLocation: "Chennai" }
  ];

  // Base Merchants
  const defaultMerchants = [
    { id: "M-101", name: "ElectroMart", category: "Electronics", riskLevel: "Monitored", volume: "₹94,20,000/day" },
    { id: "M-102", name: "TechNexus Online", category: "Luxury Tech", riskLevel: "Monitored", volume: "₹62,50,000/day" },
    { id: "M-103", name: "FoodHub", category: "Dining/Groceries", riskLevel: "Normal", volume: "₹18,40,000/day" },
    { id: "M-104", name: "CloudPay Remit", category: "Remittance", riskLevel: "High Alert", volume: "₹1,45,00,000/day" },
    { id: "M-105", name: "QuickCrypto Exchange", category: "VASP", riskLevel: "High Alert", volume: "₹2,10,00,000/day" },
    { id: "M-106", name: "UrbanMart Express", category: "Retail", riskLevel: "Normal", volume: "₹34,00,000/day" },
    { id: "M-107", name: "LuxuryTime Watches", category: "Jewelry", riskLevel: "High Alert", volume: "₹88,00,000/day" },
    { id: "M-108", name: "Apex Retail B2B", category: "Enterprise Wholesale", riskLevel: "Normal", volume: "₹3,40,00,000/day" }
  ];

  // Base 75+ Relational Transactions spanning Oct 1 to Oct 7, 2026
  const defaultTransactions = [
    // Oct 7: High-Intensity Syndicate Attacks & Recent Live Transactions
    {
      id: "TXN-10291",
      senderAccountId: "ACC-2041",
      receiverAccountId: "M-101",
      senderName: "Alex Mercer (Synthetic ID)",
      receiverName: "ElectroMart",
      amount: 84250.00,
      date: "2026-10-07",
      time: "21:10:42",
      dateTime: "2026-10-07 21:10:42",
      transactionType: "Credit Card Gateway",
      merchant: "ElectroMart",
      location: "Chennai",
      device: "DEV-91",
      ipAddress: "103.21.244.18",
      paymentMethod: "Visa Gold",
      status: "Flagged",
      riskScore: 92,
      riskLevel: "CRITICAL",
      fraudStatus: "Confirmed Fraud",
      isPrevented: true,
      preventedAmount: 84250.00,
      fraudType: "Coordinated Fraud",
      detectionReason: "Transaction flagged because amount is 15.3x customer normal spend and shares emulated device DEV-91 with 3 other critical accounts in Ring FR-07.",
      explanation: {
        score: 92,
        factors: [
          { name: "Unusual amount (15.3x normal average)", score: 22, confidence: 98, evidence: "Historical avg: ₹5,500.00 vs ₹84,250.00 today" },
          { name: "Shared emulated device DEV-91", score: 26, confidence: 99, evidence: "DEV-91 shared across 4 flagged accounts concurrently" },
          { name: "Fraud-ring connection #FR-07", score: 24, confidence: 99, evidence: "Direct graph edge to mule node ACC-MULE-881" },
          { name: "Burst interval velocity", score: 20, confidence: 94, evidence: "3rd high-value purchase within 6 minutes" }
        ]
      }
    },
    {
      id: "TXN-10292",
      senderAccountId: "ACC-8831",
      receiverAccountId: "M-103",
      senderName: "Deepak Chawla",
      receiverName: "FoodHub",
      amount: 4520.00,
      date: "2026-10-07",
      time: "21:10:15",
      dateTime: "2026-10-07 21:10:15",
      transactionType: "UPI Quick Pay",
      merchant: "FoodHub",
      location: "Coimbatore",
      device: "DEV-21",
      ipAddress: "122.164.88.92",
      paymentMethod: "UPI (Google Pay)",
      status: "Successful",
      riskScore: 18,
      riskLevel: "LOW",
      fraudStatus: "Legitimate",
      isPrevented: false,
      preventedAmount: 0.00,
      fraudType: "Normal",
      detectionReason: "Normal recurring dinner consumer transaction from verified personal smartphone in home metro.",
      explanation: {
        score: 18,
        factors: [
          { name: "Historical spend baseline conformity", score: 5, confidence: 99, evidence: "₹4,520 matches standard weekend dining pattern" },
          { name: "Known personal device DEV-21", score: 4, confidence: 100, evidence: "Used 42 times without security incident" },
          { name: "Home location match (Coimbatore)", score: 4, confidence: 98, evidence: "Zero geographic deviation" },
          { name: "Legitimate domestic merchant", score: 5, confidence: 96, evidence: "Recurring merchant frequented weekly" }
        ]
      }
    },
    {
      id: "TXN-10482",
      senderAccountId: "ACC-2043",
      receiverAccountId: "M-102",
      senderName: "David K. Chen",
      receiverName: "TechNexus Online",
      amount: 185000.00,
      date: "2026-10-07",
      time: "21:09:48",
      dateTime: "2026-10-07 21:09:48",
      transactionType: "IMPS Bank Transfer",
      merchant: "TechNexus Online",
      location: "Singapore",
      device: "DEV-92",
      ipAddress: "185.220.101.44",
      paymentMethod: "Net Banking",
      status: "Blocked",
      riskScore: 91,
      riskLevel: "CRITICAL",
      fraudStatus: "Confirmed Fraud",
      isPrevented: true,
      preventedAmount: 185000.00,
      fraudType: "Coordinated Fraud",
      detectionReason: "Transaction flagged because amount is 27x normal average, origin occurred via VirtualBox clone DEV-92 through Singapore VPN, and target links to Ring FR-07.",
      explanation: {
        score: 91,
        factors: [
          { name: "Extreme amount deviation (27x normal)", score: 25, confidence: 98, evidence: "Normal spend ₹6,800 vs ₹1,85,000 checkout" },
          { name: "VirtualBox Fingerprint Clone DEV-92", score: 25, confidence: 99, evidence: "Identified hardware virtualization sandbox" },
          { name: "Syndicate cluster link #FR-07", score: 23, confidence: 98, evidence: "Coordinated with ACC-2041 and ACC-2042" },
          { name: "Impossible travel proxy hop", score: 18, confidence: 92, evidence: "Origin 2,900 km from Chennai residential profile" }
        ]
      }
    },
    {
      id: "TXN-10483",
      senderAccountId: "ACC-2042",
      receiverAccountId: "M-101",
      senderName: "Rohan Varma",
      receiverName: "ElectroMart",
      amount: 129900.00,
      date: "2026-10-07",
      time: "21:08:30",
      dateTime: "2026-10-07 21:08:30",
      transactionType: "Credit Card Gateway",
      merchant: "ElectroMart",
      location: "Chennai",
      device: "DEV-91",
      ipAddress: "103.21.244.18",
      paymentMethod: "Mastercard World",
      status: "Blocked",
      riskScore: 94,
      riskLevel: "CRITICAL",
      fraudStatus: "Confirmed Fraud",
      isPrevented: true,
      preventedAmount: 129900.00,
      fraudType: "Coordinated Fraud",
      detectionReason: "Transaction flagged because identical ₹1,29,900 luxury GPU SKU was purchased in synchrony with ACC-2041 on shared emulated terminal DEV-91.",
      explanation: {
        score: 94,
        factors: [
          { name: "Shared hardware concurrent session", score: 26, confidence: 99, evidence: "Identical browser agent as ACC-2041 on DEV-91" },
          { name: "Exact SKU and amount matching", score: 24, confidence: 98, evidence: "Synchronized ₹1,29,900 order within 120 seconds" },
          { name: "Ring FR-07 co-membership", score: 24, confidence: 99, evidence: "Direct graph edge to mule node ACC-MULE-881" },
          { name: "Velocity anomaly", score: 20, confidence: 94, evidence: "Checkout completed without browsing history" }
        ]
      }
    },
    {
      id: "TXN-10115",
      senderAccountId: "ACC-9014",
      receiverAccountId: "M-108",
      senderName: "Zenith Enterprise Solutions Ltd",
      receiverName: "Apex Retail B2B",
      amount: 420000.00,
      date: "2026-10-07",
      time: "21:07:12",
      dateTime: "2026-10-07 21:07:12",
      transactionType: "RTGS Corporate",
      merchant: "Apex Retail B2B",
      location: "Bangalore",
      device: "DEV-CORP-01",
      ipAddress: "14.139.182.25",
      paymentMethod: "Corporate Net Banking",
      status: "Successful",
      riskScore: 14,
      riskLevel: "LOW",
      fraudStatus: "Legitimate",
      isPrevented: false,
      preventedAmount: 0.00,
      fraudType: "Normal",
      detectionReason: "Legitimate high-value business client protected from false positive decline. Monthly B2B invoice conforms to corporate telemetry baseline.",
      explanation: {
        score: 14,
        factors: [
          { name: "Verified corporate history baseline", score: 3, confidence: 99, evidence: "Enterprise tier client with ₹48.5L balance" },
          { name: "Dedicated enterprise workstation DEV-CORP-01", score: 3, confidence: 100, evidence: "Hardware token and corporate IP matched" },
          { name: "Standard procurement schedule", score: 4, confidence: 98, evidence: "Normal monthly wholesale order" },
          { name: "Known corporate supplier", score: 4, confidence: 97, evidence: "Supplier registered in trusted ERP matrix" }
        ]
      }
    },
    {
      id: "TXN-10295",
      senderAccountId: "ACC-2044",
      receiverAccountId: "ACC-MULE-881",
      senderName: "Sanjay Singhania",
      receiverName: "Global Offshore Vault (Mule Account X)",
      amount: 65000.00,
      date: "2026-10-07",
      time: "21:06:55",
      dateTime: "2026-10-07 21:06:55",
      transactionType: "IMPS Bank Transfer",
      merchant: "CloudPay Remit",
      location: "Coimbatore",
      device: "DEV-91",
      ipAddress: "103.21.244.18",
      paymentMethod: "IMPS",
      status: "Blocked",
      riskScore: 88,
      riskLevel: "HIGH",
      fraudStatus: "Confirmed Fraud",
      isPrevented: true,
      preventedAmount: 65000.00,
      fraudType: "Money Laundering Pattern",
      detectionReason: "Transaction flagged because outbound transfer funnels directly to known syndicate mule ACC-MULE-881 via CloudPay Remit immediately after deposit.",
      explanation: {
        score: 88,
        factors: [
          { name: "Funnel to syndicate mule ACC-MULE-881", score: 28, confidence: 99, evidence: "Target flagged as central mule hub in FR-07" },
          { name: "Shared device with Ring FR-07", score: 24, confidence: 98, evidence: "DEV-91 active in 4 simultaneous fraud holds" },
          { name: "Pass-through velocity drain", score: 19, confidence: 92, evidence: "Outbound transfer triggered in 110s from credit" },
          { name: "Unusual transfer channel", score: 17, confidence: 89, evidence: "First-time third-party remit service use" }
        ]
      }
    },
    {
      id: "TXN-10296",
      senderAccountId: "ACC-1092",
      receiverAccountId: "M-106",
      senderName: "Ananya Iyer",
      receiverName: "UrbanMart Express",
      amount: 11250.00,
      date: "2026-10-07",
      time: "21:05:22",
      dateTime: "2026-10-07 21:05:22",
      transactionType: "Credit Card Gateway",
      merchant: "UrbanMart Express",
      location: "Chennai",
      device: "DEV-77",
      ipAddress: "117.214.33.12",
      paymentMethod: "Visa Platinum",
      status: "Successful",
      riskScore: 22,
      riskLevel: "LOW",
      fraudStatus: "Legitimate",
      isPrevented: false,
      preventedAmount: 0.00,
      fraudType: "Normal",
      detectionReason: "Normal grocery spend on registered personal MacBook Pro from verified home IP corridor.",
      explanation: {
        score: 22,
        factors: [
          { name: "Historical baseline fit", score: 6, confidence: 98, evidence: "Conforms with monthly grocery habits (₹8,000–₹14,000)" },
          { name: "Cryptographically verified device DEV-77", score: 5, confidence: 99, evidence: "Keychain cryptographic token valid" },
          { name: "Home location match (Chennai)", score: 5, confidence: 99, evidence: "Residential broadband connection" },
          { name: "Known frequent merchant", score: 6, confidence: 96, evidence: "Merchant transacted 18 times historically" }
        ]
      }
    },
    {
      id: "TXN-10330",
      senderAccountId: "ACC-6120",
      receiverAccountId: "M-105",
      senderName: "Meera Krishnan",
      receiverName: "QuickCrypto Exchange",
      amount: 49000.00,
      date: "2026-10-07",
      time: "21:04:10",
      dateTime: "2026-10-07 21:04:10",
      transactionType: "UPI Quick Pay",
      merchant: "QuickCrypto Exchange",
      location: "Jaipur",
      device: "DEV-TAB-09",
      ipAddress: "49.207.199.50",
      paymentMethod: "UPI",
      status: "Flagged",
      riskScore: 58,
      riskLevel: "MEDIUM",
      fraudStatus: "Suspicious",
      isPrevented: false,
      preventedAmount: 0.00,
      fraudType: "Unusual Transaction",
      detectionReason: "Transaction flagged because customer initiated first-time crypto on-ramp while travelling in Jaipur; 3.2x higher than typical retail transactions.",
      explanation: {
        score: 58,
        factors: [
          { name: "High-risk merchant category (VASP)", score: 20, confidence: 95, evidence: "Crypto exchange with strict AML monitoring" },
          { name: "Travel geographic anomaly", score: 16, confidence: 90, evidence: "Resident of Delhi transacting in Jaipur" },
          { name: "Moderate amount elevation (3.2x)", score: 14, confidence: 86, evidence: "Exceeds daily average spend tolerance" },
          { name: "Device recognized DEV-TAB-09", score: 8, confidence: 80, evidence: "Known personal iPad with biometric session" }
        ]
      }
    },
    {
      id: "TXN-10499",
      senderAccountId: "ACC-3101",
      receiverAccountId: "M-105",
      senderName: "Samir Sen",
      receiverName: "QuickCrypto Exchange",
      amount: 240000.00,
      date: "2026-10-07",
      time: "21:02:45",
      dateTime: "2026-10-07 21:02:45",
      transactionType: "IMPS Bank Transfer",
      merchant: "QuickCrypto Exchange",
      location: "Mumbai",
      device: "DEV-FARM-01",
      ipAddress: "103.88.22.14",
      paymentMethod: "IMPS",
      status: "Blocked",
      riskScore: 89,
      riskLevel: "HIGH",
      fraudStatus: "Confirmed Fraud",
      isPrevented: true,
      preventedAmount: 240000.00,
      fraudType: "Money Laundering Pattern",
      detectionReason: "Transaction flagged because emulator farm rig DEV-FARM-01 was detected; connected to synthetic identity ring FR-03.",
      explanation: {
        score: 89,
        factors: [
          { name: "Device farming emulator host", score: 28, confidence: 99, evidence: "Cloud Android Farm signature identified" },
          { name: "Rapid sequential crypto buy", score: 24, confidence: 96, evidence: "3rd high-value purchase within 15 minutes" },
          { name: "Ring FR-03 correlation", score: 22, confidence: 95, evidence: "Synchronized with 3 active farm accounts" },
          { name: "Proxy IP hopping", score: 15, confidence: 90, evidence: "VPN exit node observed in Mumbai metro" }
        ]
      }
    },
    {
      id: "TXN-10501",
      senderAccountId: "ACC-2048",
      receiverAccountId: "M-107",
      senderName: "Tariq Mansoor",
      receiverName: "LuxuryTime Watches",
      amount: 320000.00,
      date: "2026-10-07",
      time: "21:01:19",
      dateTime: "2026-10-07 21:01:19",
      transactionType: "Credit Card Gateway",
      merchant: "LuxuryTime Watches",
      location: "Mumbai",
      device: "DEV-104",
      ipAddress: "194.26.29.11",
      paymentMethod: "Visa Signature",
      status: "Blocked",
      riskScore: 95,
      riskLevel: "CRITICAL",
      fraudStatus: "Confirmed Fraud",
      isPrevented: true,
      preventedAmount: 320000.00,
      fraudType: "Account Takeover",
      detectionReason: "Transaction flagged because cart-to-checkout elapsed time was 0.38s via rooted headless Selenium container DEV-104; linked to Ring FR-07.",
      explanation: {
        score: 95,
        factors: [
          { name: "Headless script automated checkout", score: 29, confidence: 100, evidence: "DEV-104 Kali Linux automated browser agent" },
          { name: "Extreme amount deviation (58x)", score: 24, confidence: 98, evidence: "Historical spend ₹5,500 vs ₹3,20,000 checkout" },
          { name: "Syndicate member FR-07", score: 24, confidence: 99, evidence: "Connected to scalping ring infrastructure" },
          { name: "Sub-second automation velocity", score: 18, confidence: 95, evidence: "Cart completion time 0.38 seconds" }
        ]
      }
    },

    // Oct 6: Coordinated Scalping Waves & Normal Daily Traffic
    {
      id: "TXN-10280",
      senderAccountId: "ACC-2045",
      receiverAccountId: "M-101",
      senderName: "Kavita Rao",
      receiverName: "ElectroMart",
      amount: 129900.00,
      date: "2026-10-06",
      time: "19:42:10",
      dateTime: "2026-10-06 19:42:10",
      transactionType: "Credit Card Gateway",
      merchant: "ElectroMart",
      location: "Chennai",
      device: "DEV-83",
      ipAddress: "103.21.244.20",
      paymentMethod: "Mastercard Platinum",
      status: "Blocked",
      riskScore: 90,
      riskLevel: "CRITICAL",
      fraudStatus: "Confirmed Fraud",
      isPrevented: true,
      preventedAmount: 129900.00,
      fraudType: "Coordinated Fraud",
      detectionReason: "Synchronized scalping batch purchase matching Ring FR-07 GPU sequence on rooted OnePlus build DEV-83.",
      explanation: {
        score: 90,
        factors: [
          { name: "Rooted device execution signature", score: 25, confidence: 98, evidence: "DEV-83 Magisk framework detected" },
          { name: "Identical SKU purchase sequence", score: 23, confidence: 97, evidence: "Matching ₹1,29,900 electronics SKU" },
          { name: "Ring FR-07 convergence link", score: 22, confidence: 98, evidence: "Direct connection to Mule ACC-MULE-881" },
          { name: "Amount surge anomaly", score: 20, confidence: 93, evidence: "17x higher than regular spending limits" }
        ]
      }
    },
    {
      id: "TXN-10281",
      senderAccountId: "ACC-2046",
      receiverAccountId: "M-101",
      senderName: "Vikram Malhotra",
      receiverName: "ElectroMart",
      amount: 129900.00,
      date: "2026-10-06",
      time: "19:44:20",
      dateTime: "2026-10-06 19:44:20",
      transactionType: "Credit Card Gateway",
      merchant: "ElectroMart",
      location: "Chennai",
      device: "DEV-44",
      ipAddress: "185.220.101.44",
      paymentMethod: "Visa Gold",
      status: "Blocked",
      riskScore: 89,
      riskLevel: "HIGH",
      fraudStatus: "Confirmed Fraud",
      isPrevented: true,
      preventedAmount: 129900.00,
      fraudType: "Coordinated Fraud",
      detectionReason: "Synchronized GPU SKU checkout via Tor gateway DEV-44 correlated with ACC-2045.",
      explanation: {
        score: 89,
        factors: [
          { name: "Tor proxy routing node", score: 26, confidence: 99, evidence: "DEV-44 confirmed exit relay" },
          { name: "Synchronized product purchase", score: 23, confidence: 97, evidence: "Matching ₹1,29,900 SKU batch" },
          { name: "Syndicate relationship link", score: 22, confidence: 98, evidence: "Ring FR-07 entity connection" },
          { name: "Velocity anomaly", score: 18, confidence: 91, evidence: "Second order within 3 minutes" }
        ]
      }
    },
    {
      id: "TXN-10282",
      senderAccountId: "ACC-7721",
      receiverAccountId: "M-103",
      senderName: "Rahul Dravid",
      receiverName: "FoodHub",
      amount: 3250.00,
      date: "2026-10-06",
      time: "18:15:30",
      dateTime: "2026-10-06 18:15:30",
      transactionType: "UPI Quick Pay",
      merchant: "FoodHub",
      location: "Bangalore",
      device: "DEV-IPHONE-16",
      ipAddress: "122.172.45.67",
      paymentMethod: "UPI",
      status: "Successful",
      riskScore: 16,
      riskLevel: "LOW",
      fraudStatus: "Legitimate",
      isPrevented: false,
      preventedAmount: 0.00,
      fraudType: "Normal",
      detectionReason: "Normal recurring food delivery purchase from genuine iPhone 16 in Bangalore home area.",
      explanation: {
        score: 16,
        factors: [
          { name: "Baseline spend match", score: 4, confidence: 99, evidence: "Within weekly dining range" },
          { name: "Genuine device token DEV-IPHONE-16", score: 4, confidence: 100, evidence: "Apple Secure Enclave certified" },
          { name: "Resident geo corridor", score: 4, confidence: 99, evidence: "Bangalore residential ISP" },
          { name: "Verified merchant history", score: 4, confidence: 98, evidence: "Recurring order pattern" }
        ]
      }
    },
    {
      id: "TXN-10283",
      senderAccountId: "ACC-5511",
      receiverAccountId: "M-106",
      senderName: "Kiran Bedi",
      receiverName: "UrbanMart Express",
      amount: 6800.00,
      date: "2026-10-06",
      time: "16:20:10",
      dateTime: "2026-10-06 16:20:10",
      transactionType: "Credit Card Gateway",
      merchant: "UrbanMart Express",
      location: "Delhi",
      device: "DEV-55",
      ipAddress: "125.19.44.88",
      paymentMethod: "Mastercard Standard",
      status: "Successful",
      riskScore: 19,
      riskLevel: "LOW",
      fraudStatus: "Legitimate",
      isPrevented: false,
      preventedAmount: 0.00,
      fraudType: "Normal",
      detectionReason: "Standard household retail purchase in Delhi on registered tablet DEV-55.",
      explanation: {
        score: 19,
        factors: [
          { name: "Expected monthly spend fit", score: 5, confidence: 98, evidence: "Typical household provisioning" },
          { name: "Trusted tablet profile", score: 5, confidence: 99, evidence: "DEV-55 known hardware keychain" },
          { name: "Home location match (Delhi)", score: 4, confidence: 98, evidence: "Domestic broadband" },
          { name: "Verified merchant", score: 5, confidence: 97, evidence: "Standard consumer merchant" }
        ]
      }
    },
    {
      id: "TXN-10284",
      senderAccountId: "ACC-2047",
      receiverAccountId: "M-102",
      senderName: "Priya Sundaram",
      receiverName: "TechNexus Online",
      amount: 145000.00,
      date: "2026-10-06",
      time: "15:10:45",
      dateTime: "2026-10-06 15:10:45",
      transactionType: "IMPS Bank Transfer",
      merchant: "TechNexus Online",
      location: "Singapore",
      device: "DEV-92",
      ipAddress: "185.220.101.44",
      paymentMethod: "Net Banking",
      status: "Blocked",
      riskScore: 88,
      riskLevel: "HIGH",
      fraudStatus: "Confirmed Fraud",
      isPrevented: true,
      preventedAmount: 145000.00,
      fraudType: "Coordinated Fraud",
      detectionReason: "VirtualBox emulator checkout from Singapore IP correlating with Ring FR-07 scalping schedule.",
      explanation: {
        score: 88,
        factors: [
          { name: "Emulated virtual machine signature", score: 25, confidence: 99, evidence: "VirtualBox fingerprint match DEV-92" },
          { name: "High amount deviation", score: 23, confidence: 96, evidence: "23x normal transaction limit" },
          { name: "Ring FR-07 network link", score: 22, confidence: 98, evidence: "Direct graph edge to mule node" },
          { name: "Proxy IP origin", score: 18, confidence: 92, evidence: "Singapore data center IP address" }
        ]
      }
    },
    {
      id: "TXN-10285",
      senderAccountId: "ACC-4401",
      receiverAccountId: "M-103",
      senderName: "Suresh Kumar",
      receiverName: "FoodHub",
      amount: 1850.00,
      date: "2026-10-06",
      time: "13:30:00",
      dateTime: "2026-10-06 13:30:00",
      transactionType: "UPI Quick Pay",
      merchant: "FoodHub",
      location: "Chennai",
      device: "DEV-41",
      ipAddress: "117.218.99.12",
      paymentMethod: "UPI (PhonePe)",
      status: "Successful",
      riskScore: 15,
      riskLevel: "LOW",
      fraudStatus: "Legitimate",
      isPrevented: false,
      preventedAmount: 0.00,
      fraudType: "Normal",
      detectionReason: "Routine lunch delivery transaction via UPI in Chennai.",
      explanation: {
        score: 15,
        factors: [
          { name: "Daily lunch routine", score: 4, confidence: 99, evidence: "Regular daytime cafeteria ordering" },
          { name: "Registered personal device", score: 4, confidence: 100, evidence: "DEV-41 genuine mobile token" },
          { name: "Home work corridor", score: 3, confidence: 99, evidence: "Chennai IT corridor cellular mast" },
          { name: "Standard transaction rail", score: 4, confidence: 98, evidence: "UPI token authenticated" }
        ]
      }
    },
    {
      id: "TXN-10286",
      senderAccountId: "ACC-5512",
      receiverAccountId: "M-108",
      senderName: "Aditya Birla Finance Partner",
      receiverName: "Apex Retail B2B",
      amount: 380000.00,
      date: "2026-10-06",
      time: "11:15:20",
      dateTime: "2026-10-06 11:15:20",
      transactionType: "RTGS Corporate",
      merchant: "Apex Retail B2B",
      location: "Mumbai",
      device: "DEV-CORP-02",
      ipAddress: "14.143.20.10",
      paymentMethod: "Corporate Net Banking",
      status: "Successful",
      riskScore: 15,
      riskLevel: "LOW",
      fraudStatus: "Legitimate",
      isPrevented: false,
      preventedAmount: 0.00,
      fraudType: "Normal",
      detectionReason: "Corporate wholesale clearing for inventory restocking. Validated enterprise token DEV-CORP-02.",
      explanation: {
        score: 15,
        factors: [
          { name: "High-value business baseline fit", score: 3, confidence: 99, evidence: "Within weekly wholesale allocation" },
          { name: "Dedicated corporate workstation", score: 4, confidence: 100, evidence: "Hardware TPM 2.0 cryptotoken valid" },
          { name: "Business hours execution", score: 4, confidence: 98, evidence: "11:15 AM enterprise treasury clearing" },
          { name: "Established wholesale partner", score: 4, confidence: 99, evidence: "Regular B2B beneficiary" }
        ]
      }
    },
    {
      id: "TXN-10287",
      senderAccountId: "ACC-2049",
      receiverAccountId: "M-102",
      senderName: "Elena Rostova",
      receiverName: "TechNexus Online",
      amount: 98000.00,
      date: "2026-10-06",
      time: "09:40:15",
      dateTime: "2026-10-06 09:40:15",
      transactionType: "Credit Card Gateway",
      merchant: "TechNexus Online",
      location: "Dubai",
      device: "DEV-104",
      ipAddress: "194.26.29.11",
      paymentMethod: "Visa Platinum",
      status: "Blocked",
      riskScore: 86,
      riskLevel: "HIGH",
      fraudStatus: "Confirmed Fraud",
      isPrevented: true,
      preventedAmount: 98000.00,
      fraudType: "Coordinated Fraud",
      detectionReason: "Headless container DEV-104 automated order matching Ring FR-07 luxury scalping schedule.",
      explanation: {
        score: 86,
        factors: [
          { name: "Headless Kali script webdriver", score: 27, confidence: 99, evidence: "Automated Selenium navigator fingerprint" },
          { name: "14x normal spend surge", score: 21, confidence: 95, evidence: "Historical spend ₹7,000 vs ₹98,000" },
          { name: "Syndicate ring connection #FR-07", score: 22, confidence: 98, evidence: "Coordinated cluster member" },
          { name: "Dubai proxy IP discrepancy", score: 16, confidence: 91, evidence: "Offshore IP routing node" }
        ]
      }
    },

    // Oct 5: Mule Convergence & Micro Velocity Probing
    {
      id: "TXN-10270",
      senderAccountId: "ACC-2041",
      receiverAccountId: "ACC-MULE-881",
      senderName: "Alex Mercer (Synthetic ID)",
      receiverName: "Global Offshore Vault (Mule Account X)",
      amount: 145000.00,
      date: "2026-10-05",
      time: "22:15:00",
      dateTime: "2026-10-05 22:15:00",
      transactionType: "IMPS Bank Transfer",
      merchant: "CloudPay Remit",
      location: "Chennai",
      device: "DEV-91",
      ipAddress: "103.21.244.18",
      paymentMethod: "IMPS",
      status: "Blocked",
      riskScore: 96,
      riskLevel: "CRITICAL",
      fraudStatus: "Confirmed Fraud",
      isPrevented: true,
      preventedAmount: 145000.00,
      fraudType: "Money Laundering Pattern",
      detectionReason: "Syndicate extraction wire funneled directly into offshore mule account ACC-MULE-881 via CloudPay Remit.",
      explanation: {
        score: 96,
        factors: [
          { name: "Syndicate destination mule hub", score: 30, confidence: 100, evidence: "Target flagged as central mule vault X" },
          { name: "Shared emulator DEV-91", score: 25, confidence: 99, evidence: "Shared across 4 flagged identities" },
          { name: "Ring FR-07 coordinated wire", score: 23, confidence: 99, evidence: "Convergence of scalping liquidation" },
          { name: "Outbound velocity drain", score: 18, confidence: 94, evidence: "Full account liquidity extraction attempt" }
        ]
      }
    },
    {
      id: "TXN-10271",
      senderAccountId: "ACC-2043",
      receiverAccountId: "ACC-MULE-881",
      senderName: "David K. Chen",
      receiverName: "Global Offshore Vault (Mule Account X)",
      amount: 110000.00,
      date: "2026-10-05",
      time: "22:18:30",
      dateTime: "2026-10-05 22:18:30",
      transactionType: "IMPS Bank Transfer",
      merchant: "CloudPay Remit",
      location: "Singapore",
      device: "DEV-92",
      ipAddress: "185.220.101.44",
      paymentMethod: "IMPS",
      status: "Blocked",
      riskScore: 93,
      riskLevel: "CRITICAL",
      fraudStatus: "Confirmed Fraud",
      isPrevented: true,
      preventedAmount: 110000.00,
      fraudType: "Money Laundering Pattern",
      detectionReason: "Converging wire into destination mule ACC-MULE-881 within 3 minutes of ACC-2041 extraction.",
      explanation: {
        score: 93,
        factors: [
          { name: "Syndicate destination mule hub", score: 29, confidence: 100, evidence: "Common destination node ACC-MULE-881" },
          { name: "Synchronized wire timing (3 min apart)", score: 24, confidence: 98, evidence: "Correlated pass-through with ACC-2041" },
          { name: "VirtualBox clone DEV-92", score: 22, confidence: 98, evidence: "Emulated OS container signature" },
          { name: "Offshore remittance channel", score: 18, confidence: 92, evidence: "Third-party remittance gateway" }
        ]
      }
    },
    {
      id: "TXN-10272",
      senderAccountId: "ACC-8831",
      receiverAccountId: "M-106",
      senderName: "Deepak Chawla",
      receiverName: "UrbanMart Express",
      amount: 2450.00,
      date: "2026-10-05",
      time: "17:40:10",
      dateTime: "2026-10-05 17:40:10",
      transactionType: "UPI Quick Pay",
      merchant: "UrbanMart Express",
      location: "Coimbatore",
      device: "DEV-21",
      ipAddress: "122.164.88.92",
      paymentMethod: "UPI",
      status: "Successful",
      riskScore: 12,
      riskLevel: "LOW",
      fraudStatus: "Legitimate",
      isPrevented: false,
      preventedAmount: 0.00,
      fraudType: "Normal",
      detectionReason: "Standard household provision purchase in Coimbatore verified with iPhone biometrics.",
      explanation: {
        score: 12,
        factors: [
          { name: "Normal household spend baseline", score: 3, confidence: 99, evidence: "Normal weekly essentials" },
          { name: "Verified iPhone DEV-21", score: 3, confidence: 100, evidence: "TouchID/FaceID authenticated" },
          { name: "Residential corridor", score: 3, confidence: 99, evidence: "Home ISP broadband match" },
          { name: "Regular merchant profile", score: 3, confidence: 98, evidence: "Recurring store visits" }
        ]
      }
    },
    {
      id: "TXN-10273",
      senderAccountId: "ACC-3102",
      receiverAccountId: "M-105",
      senderName: "Nisha Patel",
      receiverName: "QuickCrypto Exchange",
      amount: 175000.00,
      date: "2026-10-05",
      time: "15:20:00",
      dateTime: "2026-10-05 15:20:00",
      transactionType: "IMPS Bank Transfer",
      merchant: "QuickCrypto Exchange",
      location: "London",
      device: "DEV-FARM-01",
      ipAddress: "185.14.30.22",
      paymentMethod: "IMPS",
      status: "Blocked",
      riskScore: 87,
      riskLevel: "HIGH",
      fraudStatus: "Confirmed Fraud",
      isPrevented: true,
      preventedAmount: 175000.00,
      fraudType: "Card Velocity Probe",
      detectionReason: "Sudden crypto withdrawal jump preceded by 12 rapid micro-debits on emulator farm DEV-FARM-01.",
      explanation: {
        score: 87,
        factors: [
          { name: "Micro-debit probe velocity pattern", score: 26, confidence: 98, evidence: "12 sub-₹100 tests before ₹1,75,000 jump" },
          { name: "Device farm emulator rig", score: 24, confidence: 99, evidence: "DEV-FARM-01 multi-account host" },
          { name: "Synthetic identity ring FR-03", score: 21, confidence: 96, evidence: "Cluster member of 7 fake accounts" },
          { name: "Geographic proxy hop (London)", score: 16, confidence: 91, evidence: "Impossible flight travel time" }
        ]
      }
    },
    {
      id: "TXN-10274",
      senderAccountId: "ACC-1092",
      receiverAccountId: "M-103",
      senderName: "Ananya Iyer",
      receiverName: "FoodHub",
      amount: 1420.00,
      date: "2026-10-05",
      time: "13:10:00",
      dateTime: "2026-10-05 13:10:00",
      transactionType: "UPI Quick Pay",
      merchant: "FoodHub",
      location: "Chennai",
      device: "DEV-77",
      ipAddress: "117.214.33.12",
      paymentMethod: "UPI",
      status: "Successful",
      riskScore: 14,
      riskLevel: "LOW",
      fraudStatus: "Legitimate",
      isPrevented: false,
      preventedAmount: 0.00,
      fraudType: "Normal",
      detectionReason: "Regular weekday food order in Chennai; standard user spend pattern.",
      explanation: {
        score: 14,
        factors: [
          { name: "Normal lunch baseline", score: 3, confidence: 99, evidence: "Routine lunch delivery" },
          { name: "Verified MacBook Pro DEV-77", score: 4, confidence: 100, evidence: "Known personal laptop" },
          { name: "Home work geo corridor", score: 4, confidence: 98, evidence: "Chennai residential IP" },
          { name: "Frequent merchant", score: 3, confidence: 99, evidence: "High trust merchant rating" }
        ]
      }
    },
    {
      id: "TXN-10275",
      senderAccountId: "ACC-9014",
      receiverAccountId: "M-108",
      senderName: "Zenith Enterprise Solutions Ltd",
      receiverName: "Apex Retail B2B",
      amount: 510000.00,
      date: "2026-10-05",
      time: "10:30:15",
      dateTime: "2026-10-05 10:30:15",
      transactionType: "RTGS Corporate",
      merchant: "Apex Retail B2B",
      location: "Bangalore",
      device: "DEV-CORP-01",
      ipAddress: "14.139.182.25",
      paymentMethod: "Corporate RTGS",
      status: "Successful",
      riskScore: 16,
      riskLevel: "LOW",
      fraudStatus: "Legitimate",
      isPrevented: false,
      preventedAmount: 0.00,
      fraudType: "Normal",
      detectionReason: "High-value B2B quarterly IT hardware procurement. Enterprise client profile validated.",
      explanation: {
        score: 16,
        factors: [
          { name: "Quarterly corporate invoice baseline", score: 4, confidence: 99, evidence: "Within verified procurement limits" },
          { name: "Dedicated enterprise token DEV-CORP-01", score: 4, confidence: 100, evidence: "Certified corporate terminal" },
          { name: "Office business hours", score: 4, confidence: 98, evidence: "Standard daytime financial operations" },
          { name: "Wholesale vendor account", score: 4, confidence: 99, evidence: "Verified enterprise partner" }
        ]
      }
    },

    // Oct 4: High-Velocity Scalping Burst Wave 1
    {
      id: "TXN-10260",
      senderAccountId: "ACC-2041",
      receiverAccountId: "M-101",
      senderName: "Alex Mercer (Synthetic ID)",
      receiverName: "ElectroMart",
      amount: 129900.00,
      date: "2026-10-04",
      time: "20:02:15",
      dateTime: "2026-10-04 20:02:15",
      transactionType: "Credit Card Gateway",
      merchant: "ElectroMart",
      location: "Chennai",
      device: "DEV-91",
      ipAddress: "103.21.244.18",
      paymentMethod: "Visa Gold",
      status: "Blocked",
      riskScore: 94,
      riskLevel: "CRITICAL",
      fraudStatus: "Confirmed Fraud",
      isPrevented: true,
      preventedAmount: 129900.00,
      fraudType: "Coordinated Fraud",
      detectionReason: "Coordinated scalping bot purchase of high-demand GPU SKU via emulated mobile DEV-91.",
      explanation: {
        score: 94,
        factors: [
          { name: "Emulated Galaxy S24 device DEV-91", score: 26, confidence: 99, evidence: "Android emulator fingerprint" },
          { name: "Rare SKU product scalping", score: 24, confidence: 98, evidence: "High-liquidity luxury GPU" },
          { name: "Coordinated ring signature #FR-07", score: 24, confidence: 99, evidence: "Direct link to mule network" },
          { name: "Sub-second checkout execution", score: 20, confidence: 94, evidence: "Bot automated cart timing" }
        ]
      }
    },
    {
      id: "TXN-10261",
      senderAccountId: "ACC-2042",
      receiverAccountId: "M-101",
      senderName: "Rohan Varma",
      receiverName: "ElectroMart",
      amount: 129900.00,
      date: "2026-10-04",
      time: "20:07:40",
      dateTime: "2026-10-04 20:07:40",
      transactionType: "Credit Card Gateway",
      merchant: "ElectroMart",
      location: "Chennai",
      device: "DEV-91",
      ipAddress: "103.21.244.18",
      paymentMethod: "Mastercard World",
      status: "Blocked",
      riskScore: 92,
      riskLevel: "CRITICAL",
      fraudStatus: "Confirmed Fraud",
      isPrevented: true,
      preventedAmount: 129900.00,
      fraudType: "Coordinated Fraud",
      detectionReason: "Synchronized identical ₹1,29,900 purchase matching ACC-2041 on same physical hardware DEV-91.",
      explanation: {
        score: 92,
        factors: [
          { name: "Hardware collision with ACC-2041", score: 26, confidence: 99, evidence: "Identical device ID DEV-91" },
          { name: "Matching product SKU sequence", score: 24, confidence: 98, evidence: "Identical item ordered 5m apart" },
          { name: "Ring FR-07 co-membership", score: 22, confidence: 98, evidence: "Connected to extraction mule" },
          { name: "Velocity surge", score: 20, confidence: 93, evidence: "Rapid successive orders" }
        ]
      }
    },
    {
      id: "TXN-10262",
      senderAccountId: "ACC-2044",
      receiverAccountId: "M-101",
      senderName: "Sanjay Singhania",
      receiverName: "ElectroMart",
      amount: 129900.00,
      date: "2026-10-04",
      time: "20:21:00",
      dateTime: "2026-10-04 20:21:00",
      transactionType: "Credit Card Gateway",
      merchant: "ElectroMart",
      location: "Coimbatore",
      device: "DEV-91",
      ipAddress: "103.21.244.18",
      paymentMethod: "Visa Platinum",
      status: "Blocked",
      riskScore: 91,
      riskLevel: "CRITICAL",
      fraudStatus: "Confirmed Fraud",
      isPrevented: true,
      preventedAmount: 129900.00,
      fraudType: "Coordinated Fraud",
      detectionReason: "Third account in sequence purchasing identical ₹1,29,900 GPU SKU on DEV-91 within 20 minutes.",
      explanation: {
        score: 91,
        factors: [
          { name: "3rd consecutive account on DEV-91", score: 27, confidence: 100, evidence: "DEV-91 hardware sharing" },
          { name: "Matching scalping SKU", score: 23, confidence: 98, evidence: "Triple identical order" },
          { name: "Syndicate cluster link", score: 22, confidence: 98, evidence: "Ring FR-07 graph member" },
          { name: "Geographic IP collision", score: 19, confidence: 93, evidence: "Coimbatore account on Chennai IP" }
        ]
      }
    },
    {
      id: "TXN-10263",
      senderAccountId: "ACC-7721",
      receiverAccountId: "M-106",
      senderName: "Rahul Dravid",
      receiverName: "UrbanMart Express",
      amount: 4100.00,
      date: "2026-10-04",
      time: "16:45:00",
      dateTime: "2026-10-04 16:45:00",
      transactionType: "Credit Card Gateway",
      merchant: "UrbanMart Express",
      location: "Bangalore",
      device: "DEV-IPHONE-16",
      ipAddress: "122.172.45.67",
      paymentMethod: "Visa Signature",
      status: "Successful",
      riskScore: 17,
      riskLevel: "LOW",
      fraudStatus: "Legitimate",
      isPrevented: false,
      preventedAmount: 0.00,
      fraudType: "Normal",
      detectionReason: "Regular retail purchase on verified iPhone 16 in Bangalore home area.",
      explanation: {
        score: 17,
        factors: [
          { name: "Standard retail spend", score: 4, confidence: 99, evidence: "Within weekly baseline" },
          { name: "Trusted device token", score: 4, confidence: 100, evidence: "Known hardware profile" },
          { name: "Home geo corridor", score: 4, confidence: 99, evidence: "Bangalore domestic broadband" },
          { name: "Verified merchant", score: 5, confidence: 97, evidence: "Standard consumer store" }
        ]
      }
    },
    {
      id: "TXN-10264",
      senderAccountId: "ACC-5511",
      receiverAccountId: "M-103",
      senderName: "Kiran Bedi",
      receiverName: "FoodHub",
      amount: 2150.00,
      date: "2026-10-04",
      time: "12:30:00",
      dateTime: "2026-10-04 12:30:00",
      transactionType: "UPI Quick Pay",
      merchant: "FoodHub",
      location: "Delhi",
      device: "DEV-55",
      ipAddress: "125.19.44.88",
      paymentMethod: "UPI",
      status: "Successful",
      riskScore: 16,
      riskLevel: "LOW",
      fraudStatus: "Legitimate",
      isPrevented: false,
      preventedAmount: 0.00,
      fraudType: "Normal",
      detectionReason: "Standard meal purchase in Delhi with registered tablet.",
      explanation: {
        score: 16,
        factors: [
          { name: "Baseline dining cost", score: 4, confidence: 99, evidence: "Routine meal order" },
          { name: "Registered tablet DEV-55", score: 4, confidence: 99, evidence: "Valid biometric session" },
          { name: "Home metro", score: 4, confidence: 98, evidence: "Delhi residential area" },
          { name: "Trusted food merchant", score: 4, confidence: 98, evidence: "Regular provider" }
        ]
      }
    },
    {
      id: "TXN-10265",
      senderAccountId: "ACC-2050",
      receiverAccountId: "ACC-MULE-881",
      senderName: "Arjun Nair",
      receiverName: "Global Offshore Vault (Mule Account X)",
      amount: 51000.00,
      date: "2026-10-04",
      time: "11:05:00",
      dateTime: "2026-10-04 11:05:00",
      transactionType: "IMPS Bank Transfer",
      merchant: "CloudPay Remit",
      location: "Coimbatore",
      device: "DEV-83",
      ipAddress: "103.21.244.20",
      paymentMethod: "IMPS",
      status: "Blocked",
      riskScore: 89,
      riskLevel: "HIGH",
      fraudStatus: "Confirmed Fraud",
      isPrevented: true,
      preventedAmount: 51000.00,
      fraudType: "Money Laundering Pattern",
      detectionReason: "Rapid liquidation transfer into destination mule ACC-MULE-881 from rooted phone DEV-83.",
      explanation: {
        score: 89,
        factors: [
          { name: "Mule destination node ACC-MULE-881", score: 28, confidence: 99, evidence: "Common convergence node" },
          { name: "Rooted device build DEV-83", score: 24, confidence: 98, evidence: "Magisk environment detected" },
          { name: "Ring FR-07 association", score: 22, confidence: 97, evidence: "Mule network participant" },
          { name: "Immediate balance drain", score: 15, confidence: 91, evidence: "Zero dormancy pass-through" }
        ]
      }
    },

    // Oct 3: Earlier Syndicate Testing & Regular Operations
    {
      id: "TXN-10250",
      senderAccountId: "ACC-2048",
      receiverAccountId: "M-107",
      senderName: "Tariq Mansoor",
      receiverName: "LuxuryTime Watches",
      amount: 285000.00,
      date: "2026-10-03",
      time: "21:30:00",
      dateTime: "2026-10-03 21:30:00",
      transactionType: "Credit Card Gateway",
      merchant: "LuxuryTime Watches",
      location: "Mumbai",
      device: "DEV-104",
      ipAddress: "194.26.29.11",
      paymentMethod: "Visa Signature",
      status: "Blocked",
      riskScore: 93,
      riskLevel: "CRITICAL",
      fraudStatus: "Confirmed Fraud",
      isPrevented: true,
      preventedAmount: 285000.00,
      fraudType: "Account Takeover",
      detectionReason: "Rooted headless container DEV-104 attempting luxury purchase 51x above customer baseline.",
      explanation: {
        score: 93,
        factors: [
          { name: "Rooted headless Selenium browser", score: 28, confidence: 100, evidence: "Headless Kali Linux webdriver" },
          { name: "Extreme spend spike (51x)", score: 24, confidence: 98, evidence: "₹5,500 normal vs ₹2,85,000 checkout" },
          { name: "Ring FR-07 member", score: 23, confidence: 99, evidence: "Linked to core syndicate" },
          { name: "Abnormal late night velocity", score: 18, confidence: 92, evidence: "Rapid automated checkout sequence" }
        ]
      }
    },
    {
      id: "TXN-10251",
      senderAccountId: "ACC-8831",
      receiverAccountId: "M-103",
      senderName: "Deepak Chawla",
      receiverName: "FoodHub",
      amount: 3800.00,
      date: "2026-10-03",
      time: "20:10:00",
      dateTime: "2026-10-03 20:10:00",
      transactionType: "UPI Quick Pay",
      merchant: "FoodHub",
      location: "Coimbatore",
      device: "DEV-21",
      ipAddress: "122.164.88.92",
      paymentMethod: "UPI",
      status: "Successful",
      riskScore: 16,
      riskLevel: "LOW",
      fraudStatus: "Legitimate",
      isPrevented: false,
      preventedAmount: 0.00,
      fraudType: "Normal",
      detectionReason: "Normal weekend grocery delivery in Coimbatore on personal iPhone 15 Pro.",
      explanation: {
        score: 16,
        factors: [
          { name: "Weekend grocery baseline", score: 4, confidence: 99, evidence: "Typical consumer spend pattern" },
          { name: "Genuine iPhone DEV-21", score: 4, confidence: 100, evidence: "Registered device token" },
          { name: "Home location match", score: 4, confidence: 99, evidence: "Zero geographic deviation" },
          { name: "Verified food store", score: 4, confidence: 97, evidence: "Known merchant profile" }
        ]
      }
    },
    {
      id: "TXN-10252",
      senderAccountId: "ACC-3101",
      receiverAccountId: "M-105",
      senderName: "Samir Sen",
      receiverName: "QuickCrypto Exchange",
      amount: 195000.00,
      date: "2026-10-03",
      time: "18:40:00",
      dateTime: "2026-10-03 18:40:00",
      transactionType: "IMPS Bank Transfer",
      merchant: "QuickCrypto Exchange",
      location: "Mumbai",
      device: "DEV-FARM-01",
      ipAddress: "103.88.22.14",
      paymentMethod: "IMPS",
      status: "Blocked",
      riskScore: 88,
      riskLevel: "HIGH",
      fraudStatus: "Confirmed Fraud",
      isPrevented: true,
      preventedAmount: 195000.00,
      fraudType: "Money Laundering Pattern",
      detectionReason: "Cloud Android Farm Rig #1 emulator burst on cryptocurrency exchange; Ring FR-03 linkage.",
      explanation: {
        score: 88,
        factors: [
          { name: "Device farm emulator rig", score: 27, confidence: 99, evidence: "Host hardware DEV-FARM-01 identified" },
          { name: "Crypto exchange rapid on-ramp", score: 23, confidence: 96, evidence: "High liquidity AML tier threshold" },
          { name: "Synthetic identity ring FR-03", score: 22, confidence: 95, evidence: "Graph correlation with 7 accounts" },
          { name: "Proxy IP hopping", score: 16, confidence: 91, evidence: "Datacenter VPN exit range" }
        ]
      }
    },
    {
      id: "TXN-10253",
      senderAccountId: "ACC-1092",
      receiverAccountId: "M-106",
      senderName: "Ananya Iyer",
      receiverName: "UrbanMart Express",
      amount: 8900.00,
      date: "2026-10-03",
      time: "14:20:00",
      dateTime: "2026-10-03 14:20:00",
      transactionType: "Credit Card Gateway",
      merchant: "UrbanMart Express",
      location: "Chennai",
      device: "DEV-77",
      ipAddress: "117.214.33.12",
      paymentMethod: "Visa Platinum",
      status: "Successful",
      riskScore: 20,
      riskLevel: "LOW",
      fraudStatus: "Legitimate",
      isPrevented: false,
      preventedAmount: 0.00,
      fraudType: "Normal",
      detectionReason: "Weekend retail shopping on registered MacBook Pro in Chennai.",
      explanation: {
        score: 20,
        factors: [
          { name: "Monthly provisioning baseline", score: 5, confidence: 98, evidence: "Matches typical weekly pattern" },
          { name: "Known secure device DEV-77", score: 5, confidence: 99, evidence: "Apple Silicon keychain token" },
          { name: "Home broadband IP", score: 5, confidence: 99, evidence: "Residential provider" },
          { name: "Known retailer", score: 5, confidence: 97, evidence: "Recurring retail partner" }
        ]
      }
    },
    {
      id: "TXN-10254",
      senderAccountId: "ACC-9014",
      receiverAccountId: "M-108",
      senderName: "Zenith Enterprise Solutions Ltd",
      receiverName: "Apex Retail B2B",
      amount: 475000.00,
      date: "2026-10-03",
      time: "10:15:00",
      dateTime: "2026-10-03 10:15:00",
      transactionType: "RTGS Corporate",
      merchant: "Apex Retail B2B",
      location: "Bangalore",
      device: "DEV-CORP-01",
      ipAddress: "14.139.182.25",
      paymentMethod: "Corporate RTGS",
      status: "Successful",
      riskScore: 14,
      riskLevel: "LOW",
      fraudStatus: "Legitimate",
      isPrevented: false,
      preventedAmount: 0.00,
      fraudType: "Normal",
      detectionReason: "High-value B2B enterprise procurement protected from false positive decline.",
      explanation: {
        score: 14,
        factors: [
          { name: "Corporate spending tolerance", score: 3, confidence: 99, evidence: "Enterprise baseline ₹3.15L avg" },
          { name: "Dedicated corporate terminal DEV-CORP-01", score: 4, confidence: 100, evidence: "Dedicated hardware token" },
          { name: "Business hours execution", score: 3, confidence: 98, evidence: "Standard daytime cycle" },
          { name: "Verified B2B wholesale counterparty", score: 4, confidence: 99, evidence: "Longstanding supplier" }
        ]
      }
    },

    // Oct 2: Velocity Probing & Corporate Clearing
    {
      id: "TXN-10240",
      senderAccountId: "ACC-2041",
      receiverAccountId: "M-101",
      senderName: "Alex Mercer (Synthetic ID)",
      receiverName: "ElectroMart",
      amount: 72000.00,
      date: "2026-10-02",
      time: "20:50:00",
      dateTime: "2026-10-02 20:50:00",
      transactionType: "Credit Card Gateway",
      merchant: "ElectroMart",
      location: "Chennai",
      device: "DEV-91",
      ipAddress: "103.21.244.18",
      paymentMethod: "Visa Gold",
      status: "Blocked",
      riskScore: 91,
      riskLevel: "CRITICAL",
      fraudStatus: "Confirmed Fraud",
      isPrevented: true,
      preventedAmount: 72000.00,
      fraudType: "Coordinated Fraud",
      detectionReason: "Synthetic identity testing voucher purchase on emulated Galaxy S24 DEV-91.",
      explanation: {
        score: 91,
        factors: [
          { name: "Emulated Galaxy S24 signature", score: 26, confidence: 99, evidence: "DEV-91 emulator environment" },
          { name: "Elevated transaction amount", score: 23, confidence: 97, evidence: "13x normal account average" },
          { name: "Syndicate member FR-07", score: 24, confidence: 98, evidence: "Core mule account connection" },
          { name: "Automated timing signature", score: 18, confidence: 92, evidence: "Rapid sequence initiation" }
        ]
      }
    },
    {
      id: "TXN-10241",
      senderAccountId: "ACC-2042",
      receiverAccountId: "M-101",
      senderName: "Rohan Varma",
      receiverName: "ElectroMart",
      amount: 72000.00,
      date: "2026-10-02",
      time: "20:52:15",
      dateTime: "2026-10-02 20:52:15",
      transactionType: "Credit Card Gateway",
      merchant: "ElectroMart",
      location: "Chennai",
      device: "DEV-91",
      ipAddress: "103.21.244.18",
      paymentMethod: "Mastercard World",
      status: "Blocked",
      riskScore: 90,
      riskLevel: "CRITICAL",
      fraudStatus: "Confirmed Fraud",
      isPrevented: true,
      preventedAmount: 72000.00,
      fraudType: "Coordinated Fraud",
      detectionReason: "Synchronized voucher testing matching ACC-2041 on shared terminal DEV-91.",
      explanation: {
        score: 90,
        factors: [
          { name: "Shared hardware collision DEV-91", score: 26, confidence: 99, evidence: "Session on same emulated host" },
          { name: "Matching purchase value ₹72,000", score: 22, confidence: 97, evidence: "Identical SKU voucher 2m apart" },
          { name: "Ring FR-07 co-membership", score: 23, confidence: 98, evidence: "Connected to extraction mule" },
          { name: "Velocity surge", score: 19, confidence: 92, evidence: "Instant checkout" }
        ]
      }
    },
    {
      id: "TXN-10242",
      senderAccountId: "ACC-8831",
      receiverAccountId: "M-106",
      senderName: "Deepak Chawla",
      receiverName: "UrbanMart Express",
      amount: 2800.00,
      date: "2026-10-02",
      time: "18:15:00",
      dateTime: "2026-10-02 18:15:00",
      transactionType: "UPI Quick Pay",
      merchant: "UrbanMart Express",
      location: "Coimbatore",
      device: "DEV-21",
      ipAddress: "122.164.88.92",
      paymentMethod: "UPI",
      status: "Successful",
      riskScore: 15,
      riskLevel: "LOW",
      fraudStatus: "Legitimate",
      isPrevented: false,
      preventedAmount: 0.00,
      fraudType: "Normal",
      detectionReason: "Regular grocery provisions in Coimbatore on registered iPhone 15 Pro.",
      explanation: {
        score: 15,
        factors: [
          { name: "Normal grocery baseline", score: 4, confidence: 99, evidence: "Standard recurring amount" },
          { name: "Verified mobile DEV-21", score: 4, confidence: 100, evidence: "Biometric token validated" },
          { name: "Home location match", score: 3, confidence: 99, evidence: "Coimbatore ISP" },
          { name: "Trusted retailer", score: 4, confidence: 97, evidence: "Regular provider" }
        ]
      }
    },
    {
      id: "TXN-10243",
      senderAccountId: "ACC-7721",
      receiverAccountId: "M-103",
      senderName: "Rahul Dravid",
      receiverName: "FoodHub",
      amount: 2950.00,
      date: "2026-10-02",
      time: "13:20:00",
      dateTime: "2026-10-02 13:20:00",
      transactionType: "UPI Quick Pay",
      merchant: "FoodHub",
      location: "Bangalore",
      device: "DEV-IPHONE-16",
      ipAddress: "122.172.45.67",
      paymentMethod: "UPI",
      status: "Successful",
      riskScore: 14,
      riskLevel: "LOW",
      fraudStatus: "Legitimate",
      isPrevented: false,
      preventedAmount: 0.00,
      fraudType: "Normal",
      detectionReason: "Routine lunch delivery in Bangalore with verified iPhone 16.",
      explanation: {
        score: 14,
        factors: [
          { name: "Normal lunch baseline", score: 3, confidence: 99, evidence: "Typical food order" },
          { name: "Verified device token", score: 4, confidence: 100, evidence: "DEV-IPHONE-16" },
          { name: "Bangalore location", score: 3, confidence: 99, evidence: "Residential broadband" },
          { name: "Regular merchant", score: 4, confidence: 98, evidence: "Known provider" }
        ]
      }
    },
    {
      id: "TXN-10244",
      senderAccountId: "ACC-5512",
      receiverAccountId: "M-108",
      senderName: "Aditya Birla Finance Partner",
      receiverName: "Apex Retail B2B",
      amount: 410000.00,
      date: "2026-10-02",
      time: "11:00:00",
      dateTime: "2026-10-02 11:00:00",
      transactionType: "RTGS Corporate",
      merchant: "Apex Retail B2B",
      location: "Mumbai",
      device: "DEV-CORP-02",
      ipAddress: "14.143.20.10",
      paymentMethod: "Corporate Net Banking",
      status: "Successful",
      riskScore: 16,
      riskLevel: "LOW",
      fraudStatus: "Legitimate",
      isPrevented: false,
      preventedAmount: 0.00,
      fraudType: "Normal",
      detectionReason: "Weekly wholesale invoice clearing; validated corporate terminal DEV-CORP-02.",
      explanation: {
        score: 16,
        factors: [
          { name: "Weekly corporate schedule fit", score: 4, confidence: 99, evidence: "Expected commercial volume" },
          { name: "Corporate terminal DEV-CORP-02", score: 4, confidence: 100, evidence: "Hardware token registered" },
          { name: "Business hours execution", score: 4, confidence: 98, evidence: "Standard daytime banking" },
          { name: "Verified supplier", score: 4, confidence: 99, evidence: "Regular wholesale vendor" }
        ]
      }
    },

    // Oct 1: Early Detection Baseline & Historical Prevented Incursions
    {
      id: "TXN-10230",
      senderAccountId: "ACC-2041",
      receiverAccountId: "ACC-MULE-881",
      senderName: "Alex Mercer (Synthetic ID)",
      receiverName: "Global Offshore Vault (Mule Account X)",
      amount: 115000.00,
      date: "2026-10-01",
      time: "22:40:00",
      dateTime: "2026-10-01 22:40:00",
      transactionType: "IMPS Bank Transfer",
      merchant: "CloudPay Remit",
      location: "Chennai",
      device: "DEV-91",
      ipAddress: "103.21.244.18",
      paymentMethod: "IMPS",
      status: "Blocked",
      riskScore: 95,
      riskLevel: "CRITICAL",
      fraudStatus: "Confirmed Fraud",
      isPrevented: true,
      preventedAmount: 115000.00,
      fraudType: "Money Laundering Pattern",
      detectionReason: "Outbound remittance directly funneled into extraction mule ACC-MULE-881; blocked by automated graph filter.",
      explanation: {
        score: 95,
        factors: [
          { name: "Destination mule node ACC-MULE-881", score: 29, confidence: 100, evidence: "Flagged offshore extraction account" },
          { name: "Emulated Galaxy S24 DEV-91", score: 25, confidence: 99, evidence: "Emulated mobile container" },
          { name: "Ring FR-07 network link", score: 23, confidence: 99, evidence: "Syndicate funnels detected" },
          { name: "Rapid extraction drain", score: 18, confidence: 93, evidence: "Pass-through liquidation" }
        ]
      }
    },
    {
      id: "TXN-10231",
      senderAccountId: "ACC-2044",
      receiverAccountId: "ACC-MULE-881",
      senderName: "Sanjay Singhania",
      receiverName: "Global Offshore Vault (Mule Account X)",
      amount: 82000.00,
      date: "2026-10-01",
      time: "22:42:30",
      dateTime: "2026-10-01 22:42:30",
      transactionType: "IMPS Bank Transfer",
      merchant: "CloudPay Remit",
      location: "Coimbatore",
      device: "DEV-91",
      ipAddress: "103.21.244.18",
      paymentMethod: "IMPS",
      status: "Blocked",
      riskScore: 92,
      riskLevel: "CRITICAL",
      fraudStatus: "Confirmed Fraud",
      isPrevented: true,
      preventedAmount: 82000.00,
      fraudType: "Money Laundering Pattern",
      detectionReason: "Converging extraction wire funneled into ACC-MULE-881 2 minutes after ACC-2041 on same device DEV-91.",
      explanation: {
        score: 92,
        factors: [
          { name: "Destination mule hub ACC-MULE-881", score: 28, confidence: 100, evidence: "Identical mule target" },
          { name: "Shared hardware collision DEV-91", score: 25, confidence: 99, evidence: "Session on same emulated host" },
          { name: "Synchronized wire timing", score: 21, confidence: 97, evidence: "Executed 150s from sibling node" },
          { name: "Remittance drain velocity", score: 18, confidence: 92, evidence: "Immediate liquidation" }
        ]
      }
    },
    {
      id: "TXN-10232",
      senderAccountId: "ACC-8831",
      receiverAccountId: "M-103",
      senderName: "Deepak Chawla",
      receiverName: "FoodHub",
      amount: 3450.00,
      date: "2026-10-01",
      time: "19:15:00",
      dateTime: "2026-10-01 19:15:00",
      transactionType: "UPI Quick Pay",
      merchant: "FoodHub",
      location: "Coimbatore",
      device: "DEV-21",
      ipAddress: "122.164.88.92",
      paymentMethod: "UPI",
      status: "Successful",
      riskScore: 15,
      riskLevel: "LOW",
      fraudStatus: "Legitimate",
      isPrevented: false,
      preventedAmount: 0.00,
      fraudType: "Normal",
      detectionReason: "Routine dinner delivery in Coimbatore from registered mobile device.",
      explanation: {
        score: 15,
        factors: [
          { name: "Normal spend baseline", score: 4, confidence: 99, evidence: "Within weekly dining pattern" },
          { name: "Known personal device DEV-21", score: 4, confidence: 100, evidence: "Genuine hardware signature" },
          { name: "Home geo corridor", score: 3, confidence: 99, evidence: "Coimbatore residential ISP" },
          { name: "Regular merchant", score: 4, confidence: 98, evidence: "Known provider" }
        ]
      }
    },
    {
      id: "TXN-10233",
      senderAccountId: "ACC-9014",
      receiverAccountId: "M-108",
      senderName: "Zenith Enterprise Solutions Ltd",
      receiverName: "Apex Retail B2B",
      amount: 490000.00,
      date: "2026-10-01",
      time: "10:00:00",
      dateTime: "2026-10-01 10:00:00",
      transactionType: "RTGS Corporate",
      merchant: "Apex Retail B2B",
      location: "Bangalore",
      device: "DEV-CORP-01",
      ipAddress: "14.139.182.25",
      paymentMethod: "Corporate Net Banking",
      status: "Successful",
      riskScore: 14,
      riskLevel: "LOW",
      fraudStatus: "Legitimate",
      isPrevented: false,
      preventedAmount: 0.00,
      fraudType: "Normal",
      detectionReason: "Beginning of month commercial procurement cleared without friction. VIP enterprise customer.",
      explanation: {
        score: 14,
        factors: [
          { name: "Monthly procurement cycle", score: 3, confidence: 99, evidence: "Standard monthly restocking" },
          { name: "Dedicated enterprise terminal DEV-CORP-01", score: 4, confidence: 100, evidence: "Hardware token matched" },
          { name: "Business hours execution", score: 3, confidence: 98, evidence: "Morning treasury window" },
          { name: "Verified B2B wholesale partner", score: 4, confidence: 99, evidence: "Wholesale vendor account" }
        ]
      }
    }
  ];

  // Base Alerts
  const defaultAlerts = [
    {
      id: "ALT-901",
      time: "21:10:42",
      date: "2026-10-07",
      severity: "CRITICAL",
      title: "Coordinated Fraud Ring Scalping Detected",
      description: "10 accounts connected to destination mule (ACC-MULE-881) through coordinated GPU checkouts on DEV-91.",
      affectedAccounts: ["ACC-2041", "ACC-2042", "ACC-2043", "ACC-2044", "+6 others"],
      accountId: "ACC-2041",
      customerName: "Alex Mercer (Synthetic ID)",
      alertType: "Coordinated Fraud",
      riskScore: 96,
      amount: 84250.00,
      detectionReason: "Synchronized sub-second API purchase sequence across 4 emulated mobile fingerprints.",
      recommendedAction: "Freeze Ring Accounts & Destination Mule",
      ringId: "FR-07",
      status: "Active"
    },
    {
      id: "ALT-902",
      time: "21:08:30",
      date: "2026-10-07",
      severity: "HIGH",
      title: "Shared Device Farming Hardware Collision",
      description: "Multiple accounts using the same emulated device DEV-91 across distinct geographical locations.",
      affectedAccounts: ["ACC-2041", "ACC-2042", "ACC-2044", "ACC-2048"],
      accountId: "ACC-2042",
      customerName: "Rohan Varma",
      alertType: "Shared Device Fraud",
      riskScore: 94,
      amount: 129900.00,
      detectionReason: "Single Samsung S24 emulator signature active across 4 different banking credentials.",
      recommendedAction: "Quarantine Device ID DEV-91",
      ringId: "FR-07",
      status: "Active"
    },
    {
      id: "ALT-903",
      time: "21:05:14",
      date: "2026-10-07",
      severity: "HIGH",
      title: "Unusual Transaction Sequence Burst Detected",
      description: "Synchronized bursts of ₹1,29,900 electronics purchases executed within 3-minute intervals.",
      affectedAccounts: ["ACC-2041", "ACC-2042", "ACC-2043"],
      accountId: "ACC-2043",
      customerName: "David K. Chen",
      alertType: "Velocity Anomaly",
      riskScore: 91,
      amount: 185000.00,
      detectionReason: "Fixed timing delay between voucher checkout and automated beneficiary addition.",
      recommendedAction: "Temporarily Hold Matching SKU Orders",
      ringId: "FR-07",
      status: "Active"
    },
    {
      id: "ALT-904",
      time: "21:01:22",
      date: "2026-10-07",
      severity: "MEDIUM",
      title: "Account Behavior Anomaly (Travel Geo Hop)",
      description: "Account ACC-6120 initiated crypto purchase 3.2x above historical average from unusual location (Jaipur).",
      affectedAccounts: ["ACC-6120"],
      accountId: "ACC-6120",
      customerName: "Meera Krishnan",
      alertType: "Unusual Transaction",
      riskScore: 58,
      amount: 49000.00,
      detectionReason: "Geographic travel anomaly combined with first-time crypto on-ramp transaction.",
      recommendedAction: "Trigger 2FA Biometric Re-authentication",
      ringId: null,
      status: "Active"
    },
    {
      id: "ALT-905",
      time: "20:54:10",
      date: "2026-10-07",
      severity: "CRITICAL",
      title: "Mule Fund Extraction Velocity Spike",
      description: "Rapid aggregation of ₹78,42,000 into destination mule ACC-MULE-881 via multiple micro-wires.",
      affectedAccounts: ["ACC-MULE-881", "ACC-2041", "ACC-2043", "ACC-2045"],
      accountId: "ACC-MULE-881",
      customerName: "Global Offshore Vault (Mule Account X)",
      alertType: "Money Laundering Pattern",
      riskScore: 99,
      amount: 148200.00,
      detectionReason: "Pass-through extraction of funds into offshore clearing gates with zero holding dormancy.",
      recommendedAction: "Place Restraining Hold on Outbound SWIFT/Crypto Gates",
      ringId: "FR-07",
      status: "Active"
    },
    {
      id: "ALT-906",
      time: "20:42:00",
      date: "2026-10-07",
      severity: "LOW",
      title: "Legitimate High-Value Exemption Verified",
      description: "Zenith Enterprise transaction (₹4,20,000) matched verified corporate baseline; bypass hold applied.",
      affectedAccounts: ["ACC-9014"],
      accountId: "ACC-9014",
      customerName: "Zenith Enterprise Solutions Ltd",
      alertType: "VIP Exemption",
      riskScore: 14,
      amount: 420000.00,
      detectionReason: "Enterprise hardware token and regular B2B procurement baseline validated.",
      recommendedAction: "Allow Transaction (False Positive Exemption)",
      ringId: null,
      status: "Reviewed"
    }
  ];

  // Base Audit Logs
  const defaultAuditLogs = [
    {
      id: "AUD-1001",
      timestamp: "2026-10-07 19:45:00",
      date: "2026-10-07",
      time: "19:45:00",
      action: "Account Blocked",
      accountId: "ACC-MULE-881",
      customer: "Global Offshore Vault (Mule Account X)",
      administrator: "Admin (SOC Lead)",
      previousStatus: "ACTIVE",
      newStatus: "BLOCKED",
      reason: "Destination mule vault confirmed for syndicate Ring FR-07 funnels."
    },
    {
      id: "AUD-1002",
      timestamp: "2026-10-07 20:42:00",
      date: "2026-10-07",
      time: "20:42:00",
      action: "Alert Reviewed",
      accountId: "ACC-9014",
      customer: "Zenith Enterprise Solutions Ltd",
      administrator: "Admin (SOC Lead)",
      previousStatus: "Active",
      newStatus: "Reviewed",
      reason: "Confirmed legitimate B2B wholesale procurement; false positive exemption verified."
    },
    {
      id: "AUD-1003",
      timestamp: "2026-10-07 21:04:10",
      date: "2026-10-07",
      time: "21:04:10",
      action: "Step-Up 2FA Enforced",
      accountId: "ACC-6120",
      customer: "Meera Krishnan",
      administrator: "AI Risk Engine",
      previousStatus: "ACTIVE",
      newStatus: "UNDER REVIEW",
      reason: "Travel geo hop to Jaipur combined with first-time crypto on-ramp."
    }
  ];

  // Base Fraud Rings
  const defaultFraudRings = [
    {
      id: "FR-07",
      name: "Coordinated Scalping & Mule Funnel",
      riskScore: 96,
      status: "CRITICAL",
      accountsCount: 10,
      devicesCount: 6,
      merchantsCount: 4,
      transactionsCount: 38,
      locationsCount: 5,
      totalVolume: "₹78,42,000",
      destinationAccount: "ACC-MULE-881",
      patternSummary: "Multiple accounts purchased the same unusual products in the same sequence and transferred funds to a common destination (ACC-MULE-881).",
      accounts: ["ACC-2041", "ACC-2042", "ACC-2043", "ACC-2044", "ACC-2045", "ACC-2046", "ACC-2047", "ACC-2048", "ACC-2049", "ACC-2050"],
      devices: ["DEV-91", "DEV-92", "DEV-83", "DEV-44", "DEV-104", "DEV-99X"],
      merchants: ["ElectroMart", "TechNexus Online", "LuxuryTime Watches", "CloudPay Remit"],
      locations: ["Chennai", "Coimbatore", "Singapore", "Bangalore", "Dubai"],
      evidence: [
        "Identical purchase sequence: High-end GPU -> Gift Voucher -> Immediate crypto/mule transfer",
        "Sub-second synchronized API bursts across 4 emulated mobile fingerprints",
        "Converging fund transfers to common destination ACC-MULE-881 within 60 minutes",
        "620km geographic discrepancies between account billing and transaction origin"
      ],
      recommendedAction: "FREEZE ALL 10 ACCOUNTS & BLACKLIST DESTINATION ACC-MULE-881",
      timeline: [
        { time: "10:02 PM", event: "Account ACC-2041 purchases Product X (₹1,29,900) at ElectroMart via DEV-91 in Chennai" },
        { time: "10:07 PM", event: "Account ACC-2042 purchases Product X (₹1,29,900) at ElectroMart via DEV-91 in Chennai" },
        { time: "10:15 PM", event: "Account ACC-2043 purchases Product X (₹1,29,900) at TechNexus via DEV-92 in Singapore proxy" },
        { time: "10:21 PM", event: "Account ACC-2044 purchases Product X (₹1,29,900) at ElectroMart via DEV-91 in Coimbatore" },
        { time: "10:35 PM", event: "Accounts ACC-2045 through ACC-2050 execute identical ₹1,29,900 voucher redemptions" },
        { time: "11:03 PM", event: "Multiple accounts transfer aggregated funds (₹12,99,000) to Destination ACC-MULE-881 via CloudPay Remit" },
        { time: "11:04 PM", event: "FraudLens AI graph analysis detected synchronized sequence; Flagged FR-07 (Confidence: 96%)" }
      ]
    },
    {
      id: "FR-03",
      name: "Device Farming & Geo-Hopping Ring",
      riskScore: 89,
      status: "HIGH",
      accountsCount: 7,
      devicesCount: 2,
      merchantsCount: 3,
      transactionsCount: 24,
      locationsCount: 3,
      totalVolume: "₹34,18,000",
      destinationAccount: "ACC-MULE-881",
      patternSummary: "Rapid credential cycling and synthetic identity purchases coordinated across two shared emulated server rigs.",
      accounts: ["ACC-3101", "ACC-3102", "ACC-3103"],
      devices: ["DEV-FARM-01", "DEV-FARM-02"],
      merchants: ["QuickCrypto Exchange", "ElectroMart", "CloudPay Remit"],
      locations: ["Mumbai", "Delhi", "London"],
      evidence: [
        "7 synthetic profiles registered within 4 hours using incremental email permutations",
        "Same WebGL canvas fingerprint and hardware concurrency count across all logins",
        "Impossible travel hops: Mumbai to London in 20 minutes"
      ],
      recommendedAction: "SUSPEND SESSIONS ON DEV-FARM-01 AND REQUEST 2FA BIOMETRIC AUTH",
      timeline: [
        { time: "08:14 PM", event: "Batch login of 7 accounts from single IP range on DEV-FARM-01" },
        { time: "08:22 PM", event: "Concurrent micro-debits on QuickCrypto Exchange (₹15,000 each)" },
        { time: "08:45 PM", event: "Sudden escalation to ₹4,50,000 withdrawal attempt to offshore wallet" }
      ]
    },
    {
      id: "FR-11",
      name: "Micro-Transaction Velocity Probe Ring",
      riskScore: 92,
      status: "CRITICAL",
      accountsCount: 6,
      devicesCount: 4,
      merchantsCount: 4,
      transactionsCount: 36,
      locationsCount: 4,
      totalVolume: "₹61,90,000",
      destinationAccount: "ACC-MULE-881",
      patternSummary: "Sub-₹500 card testing velocity probes followed by immediate high-value luxury electronic withdrawals.",
      accounts: ["ACC-2048", "ACC-2049", "ACC-2050"],
      devices: ["DEV-104", "DEV-83"],
      merchants: ["FoodHub", "UrbanMart Express", "LuxuryTime Watches", "TechNexus Online"],
      locations: ["Chennai", "Bangalore", "Mumbai", "Delhi"],
      evidence: [
        "120 rapid test transactions under ₹200 in 3 minutes on low-risk food merchants",
        "Immediate pivot to maximum card limit purchases on luxury watch merchants",
        "Shared bin range originating from compromised banking batch"
      ],
      recommendedAction: "TEMPORARILY HOLD VELOCITY TRANSACTIONS & ALERT CARD ISSUER",
      timeline: [
        { time: "06:10 PM", event: "Card testing probe commenced at FoodHub (₹120, ₹150, ₹200)" },
        { time: "06:14 PM", event: "48 test transactions approved across accounts" },
        { time: "06:18 PM", event: "Immediate synchronized luxury jewelry purchase attempt (₹5,80,000 each)" }
      ]
    }
  ];

  const defaultPatterns = [
    {
      id: "PAT-01",
      number: "01",
      name: "Repeated Unusual Purchases",
      accountsInvolved: 18,
      confidence: 94,
      description: "Multiple disconnected accounts suddenly purchase identical rare SKU items within a tight 15-minute operational window.",
      flaggedCategory: "Electronics / Gift Cards",
      severity: "High",
      example: "Accounts ACC-2041 through ACC-2046 each purchasing ₹1,29,900 high-end GPUs at ElectroMart."
    },
    {
      id: "PAT-02",
      number: "02",
      name: "Shared Device Across Multiple Accounts",
      accountsInvolved: 24,
      confidence: 98,
      description: "A single physical or emulated hardware fingerprint logging into numerous distinct banking identities within hours.",
      flaggedCategory: "Device Fingerprinting",
      severity: "Critical",
      example: "Device DEV-91 observed routing sessions for 4 different high-risk identities in Chennai."
    },
    {
      id: "PAT-03",
      number: "03",
      name: "Rapid Money Movement",
      accountsInvolved: 12,
      confidence: 91,
      description: "Inbound deposits drained within 120 seconds into high-risk external channels or unverified destination wallets.",
      flaggedCategory: "Velocity Anomaly",
      severity: "High",
      example: "Immediate pass-through of ₹84,200 via CloudPay Remit with zero dormancy period."
    },
    {
      id: "PAT-04",
      number: "04",
      name: "Common Destination Account",
      accountsInvolved: 15,
      confidence: 99,
      description: "Distinct user accounts with differing credentials and geo-origins all funneling final proceeds into a single aggregation mule.",
      flaggedCategory: "Graph Convergence",
      severity: "Critical",
      example: "10 accounts funneling ₹78,42,000 into destination ACC-MULE-881."
    },
    {
      id: "PAT-05",
      number: "05",
      name: "Unusual Geographic Switching",
      accountsInvolved: 9,
      confidence: 87,
      description: "Consecutive authentication events occurring across impossible physical travel distances without commercial flight feasibility.",
      flaggedCategory: "Geo Anomaly",
      severity: "Medium",
      example: "Transaction in Chennai at 10:02 PM, followed by authenticated checkout in Singapore at 10:15 PM."
    },
    {
      id: "PAT-06",
      number: "06",
      name: "Repeated Transaction Sequence",
      accountsInvolved: 16,
      confidence: 93,
      description: "Algorithmic bot execution showing exact timestamp spacing, matching rounding values, and identical merchant order paths.",
      flaggedCategory: "Bot & Automation",
      severity: "High",
      example: "Fixed 4.2-second delay between voucher checkout and automated beneficiary addition."
    }
  ];

  // In-Memory Live State
  let accounts = [];
  let transactions = [];
  let alerts = [];
  let auditLogs = [];
  let devices = [];
  let merchants = [];
  let fraudRings = [];
  let patterns = [];
  let subscribers = [];

  // Load from Storage or Initialize Defaults
  function loadState() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        accounts = parsed.accounts || defaultAccounts;
        transactions = parsed.transactions || defaultTransactions;
        alerts = parsed.alerts || defaultAlerts;
        auditLogs = parsed.auditLogs || defaultAuditLogs;
        devices = parsed.devices || defaultDevices;
        merchants = parsed.merchants || defaultMerchants;
        fraudRings = parsed.fraudRings || defaultFraudRings;
        patterns = parsed.patterns || defaultPatterns;
        return;
      }
    } catch (e) {
      console.warn("Storage load error, initializing default data:", e);
    }

    // Default Fallback
    accounts = JSON.parse(JSON.stringify(defaultAccounts));
    transactions = JSON.parse(JSON.stringify(defaultTransactions));
    alerts = JSON.parse(JSON.stringify(defaultAlerts));
    auditLogs = JSON.parse(JSON.stringify(defaultAuditLogs));
    devices = JSON.parse(JSON.stringify(defaultDevices));
    merchants = JSON.parse(JSON.stringify(defaultMerchants));
    fraudRings = JSON.parse(JSON.stringify(defaultFraudRings));
    patterns = JSON.parse(JSON.stringify(defaultPatterns));
    saveState();
  }

  function saveState() {
    try {
      const payload = {
        accounts,
        transactions,
        alerts,
        auditLogs,
        devices,
        merchants,
        fraudRings,
        patterns
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch (e) {
      console.error("Storage save error:", e);
    }
  }

  function subscribe(callback) {
    subscribers.push(callback);
    return () => {
      subscribers = subscribers.filter(cb => cb !== callback);
    };
  }

  function notifySubscribers(eventType, data) {
    subscribers.forEach(cb => {
      try {
        cb(eventType, data);
      } catch (err) {
        console.error("Subscriber notification error:", err);
      }
    });
  }

  function getTimestamp() {
    const d = new Date();
    const pad = n => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  }

  // Calculate Real Global Metrics & Statistics (Requirement 1 & 2)
  function calculateKPIs() {
    const totalTransactions = transactions.length;
    const totalTransactionValue = transactions.reduce((acc, t) => acc + (t.amount || 0), 0);

    const fraudulentTransactions = transactions.filter(t => 
      t.fraudStatus === "Confirmed Fraud" || 
      t.fraudStatus === "Suspicious" || 
      t.status === "Blocked" || 
      t.status === "Flagged"
    ).length;

    const highRiskAccounts = accounts.filter(a => a.riskScore >= 60).length;
    const blockedAccounts = accounts.filter(a => a.status === "BLOCKED").length;
    const activeAlerts = alerts.filter(a => a.status === "Active").length;

    const fraudDetectionRate = totalTransactions > 0 
      ? ((fraudulentTransactions / totalTransactions) * 100).toFixed(1) + "%" 
      : "0.0%";

    // Estimated Fraud Prevented: sum of amounts of all prevented/blocked transactions
    // AND transactions from currently BLOCKED accounts
    const blockedAccountIds = new Set(accounts.filter(a => a.status === "BLOCKED").map(a => a.id));

    const preventedTransactions = transactions.filter(t => 
      t.isPrevented === true || 
      t.status === "Blocked" || 
      blockedAccountIds.has(t.senderAccountId)
    );

    const estimatedFraudPrevented = preventedTransactions.reduce((acc, t) => acc + (t.amount || 0), 0);
    const avgEstimatedFraudPrevented = preventedTransactions.length > 0
      ? Math.round(estimatedFraudPrevented / preventedTransactions.length)
      : 0;

    return {
      totalTransactions,
      totalTransactionValue,
      fraudulentTransactions,
      highRiskAccounts,
      blockedAccounts,
      activeAlerts,
      fraudDetectionRate,
      estimatedFraudPrevented,
      avgEstimatedFraudPrevented,
      preventedCount: preventedTransactions.length
    };
  }

  // Calculate Daily Estimated Fraud Prevented & Average (Requirement 2)
  function getPreventedFraudDailyTrend() {
    const blockedAccountIds = new Set(accounts.filter(a => a.status === "BLOCKED").map(a => a.id));

    const preventedList = transactions.filter(t => 
      t.isPrevented === true || 
      t.status === "Blocked" || 
      blockedAccountIds.has(t.senderAccountId)
    );

    // Group by Date
    const dailyMap = {};
    preventedList.forEach(t => {
      const d = t.date || (t.dateTime ? t.dateTime.split(" ")[0] : "2026-10-07");
      if (!dailyMap[d]) {
        dailyMap[d] = { date: d, totalAmount: 0, count: 0 };
      }
      dailyMap[d].totalAmount += t.amount;
      dailyMap[d].count += 1;
    });

    const dates = Object.keys(dailyMap).sort();
    const result = dates.map(d => {
      const item = dailyMap[d];
      return {
        date: d,
        displayDate: d.slice(5), // "10-01", etc.
        amount: item.totalAmount,
        count: item.count,
        avg: item.count > 0 ? Math.round(item.totalAmount / item.count) : 0
      };
    });

    const totalAmt = preventedList.reduce((acc, t) => acc + t.amount, 0);
    const overallAvg = preventedList.length > 0 ? Math.round(totalAmt / preventedList.length) : 0;

    return {
      daily: result,
      totalPrevented: totalAmt,
      totalCount: preventedList.length,
      overallAverage: overallAvg
    };
  }

  // Calculate Volume and Trend Time-Series (Requirement 3)
  function getTransactionVolumeTrend() {
    const dailyMap = {};
    transactions.forEach(t => {
      const d = t.date || (t.dateTime ? t.dateTime.split(" ")[0] : "2026-10-07");
      if (!dailyMap[d]) {
        dailyMap[d] = { date: d, totalCount: 0, totalAmount: 0, fraudCount: 0, fraudAmount: 0 };
      }
      dailyMap[d].totalCount += 1;
      dailyMap[d].totalAmount += t.amount;

      if (t.fraudStatus === "Confirmed Fraud" || t.fraudStatus === "Suspicious" || t.status === "Blocked" || t.status === "Flagged") {
        dailyMap[d].fraudCount += 1;
        dailyMap[d].fraudAmount += t.amount;
      }
    });

    const dates = Object.keys(dailyMap).sort();
    return dates.map(d => ({
      date: d,
      displayDate: d.slice(5),
      ...dailyMap[d]
    }));
  }

  // Calculate Account Risk Distribution (Requirement 3)
  function getRiskDistributionStats() {
    const dist = { Low: 0, Medium: 0, High: 0, Critical: 0 };
    accounts.forEach(a => {
      if (a.riskScore >= 90) dist.Critical += 1;
      else if (a.riskScore >= 70) dist.High += 1;
      else if (a.riskScore >= 40) dist.Medium += 1;
      else dist.Low += 1;
    });
    return dist;
  }

  // Calculate Transaction Status Distribution (Requirement 3)
  function getTransactionStatusStats() {
    const dist = { Successful: 0, Flagged: 0, Blocked: 0, Pending: 0 };
    transactions.forEach(t => {
      const s = t.status || "Successful";
      if (dist[s] !== undefined) dist[s] += 1;
      else dist.Successful += 1;
    });
    return dist;
  }

  // Calculate Fraud Type Categories Distribution (Requirement 3)
  function getFraudTypeStats() {
    const dist = {
      "Coordinated Fraud": 0,
      "Money Laundering Pattern": 0,
      "Account Takeover": 0,
      "Card Velocity Probe": 0,
      "Shared Device Fraud": 0,
      "Unusual Transaction": 0
    };

    transactions.forEach(t => {
      if (t.fraudType && dist[t.fraudType] !== undefined) {
        dist[t.fraudType] += 1;
      } else if (t.fraudStatus === "Confirmed Fraud" || t.fraudStatus === "Suspicious") {
        dist["Unusual Transaction"] += 1;
      }
    });

    return dist;
  }

  // Format INR Currency
  function formatINR(val) {
    if (val === undefined || val === null || isNaN(val)) return "₹0";
    const num = Math.round(val);
    return "₹" + num.toLocaleString("en-IN");
  }

  // Block Account Functionality (Requirement 5 & 12)
  function blockAccount(accountId, reason = "Suspicious activity detected across entity graph", admin = "Admin (SOC Lead)") {
    const acc = accounts.find(a => a.id === accountId);
    if (!acc) return { success: false, error: "Account not found." };

    const prevStatus = acc.status;
    acc.status = "BLOCKED";

    const timestamp = getTimestamp();
    const dateStr = timestamp.split(" ")[0];
    const timeStr = timestamp.split(" ")[1];

    // Add to Account Activity History
    if (!acc.activityHistory) acc.activityHistory = [];
    acc.activityHistory.unshift({
      time: timestamp,
      action: "Account Blocked",
      admin: admin,
      reason: reason
    });

    // Add to Global Security Audit Log (Requirement 14)
    const auditId = "AUD-" + (1000 + auditLogs.length + 1);
    auditLogs.unshift({
      id: auditId,
      timestamp: timestamp,
      date: dateStr,
      time: timeStr,
      action: "Account Blocked",
      accountId: acc.id,
      customer: acc.holderName,
      administrator: admin,
      previousStatus: prevStatus,
      newStatus: "BLOCKED",
      reason: reason
    });

    // Mark pending or flagged transactions from this account as Blocked/Prevented (Requirement 5)
    transactions.forEach(t => {
      if (t.senderAccountId === acc.id && (t.status === "Flagged" || t.status === "Pending")) {
        t.status = "Blocked";
        t.isPrevented = true;
        t.preventedAmount = t.amount;
      }
    });

    // Update related alerts status and notes (Requirement 5 & 11)
    alerts.forEach(alt => {
      if (alt.accountId === acc.id || (alt.affectedAccounts && alt.affectedAccounts.includes(acc.id))) {
        alt.status = "Contained";
        alt.containmentNote = `Account ${acc.id} blocked by ${admin} at ${timeStr}.`;
      }
    });

    saveState();
    notifySubscribers("account_blocked", { account: acc, auditId });
    return { success: true, account: acc };
  }

  // Unblock Account Functionality (Requirement 6 & 12)
  function unblockAccount(accountId, reason = "Identity re-verified; compliance review passed", admin = "Admin (SOC Lead)") {
    const acc = accounts.find(a => a.id === accountId);
    if (!acc) return { success: false, error: "Account not found." };

    const prevStatus = acc.status;
    acc.status = "ACTIVE";

    const timestamp = getTimestamp();
    const dateStr = timestamp.split(" ")[0];
    const timeStr = timestamp.split(" ")[1];

    // Add to Account Activity History
    if (!acc.activityHistory) acc.activityHistory = [];
    acc.activityHistory.unshift({
      time: timestamp,
      action: "Account Unblocked",
      admin: admin,
      reason: reason
    });

    // Add to Global Security Audit Log (Requirement 14)
    const auditId = "AUD-" + (1000 + auditLogs.length + 1);
    auditLogs.unshift({
      id: auditId,
      timestamp: timestamp,
      date: dateStr,
      time: timeStr,
      action: "Account Unblocked",
      accountId: acc.id,
      customer: acc.holderName,
      administrator: admin,
      previousStatus: prevStatus,
      newStatus: "ACTIVE",
      reason: reason
    });

    saveState();
    notifySubscribers("account_unblocked", { account: acc, auditId });
    return { success: true, account: acc };
  }

  // Block Individual Transaction
  function blockTransaction(txnId, admin = "Admin (SOC Lead)") {
    const t = transactions.find(item => item.id === txnId);
    if (!t) return false;

    t.status = "Blocked";
    t.isPrevented = true;
    t.preventedAmount = t.amount;
    t.fraudStatus = "Confirmed Fraud";

    const timestamp = getTimestamp();
    const auditId = "AUD-" + (1000 + auditLogs.length + 1);
    auditLogs.unshift({
      id: auditId,
      timestamp: timestamp,
      date: timestamp.split(" ")[0],
      time: timestamp.split(" ")[1],
      action: "Transaction Blocked",
      accountId: t.senderAccountId,
      customer: t.senderName,
      administrator: admin,
      previousStatus: "Flagged",
      newStatus: "Blocked",
      reason: `Manual freeze of Transaction ${t.id} (₹${t.amount.toLocaleString('en-IN')})`
    });

    saveState();
    notifySubscribers("transaction_blocked", t);
    return true;
  }

  // Clear / Allow Transaction (False Positive Exemption)
  function allowTransaction(txnId, admin = "Admin (SOC Lead)") {
    const t = transactions.find(item => item.id === txnId);
    if (!t) return false;

    t.status = "Successful";
    t.isPrevented = false;
    t.preventedAmount = 0;
    t.fraudStatus = "Legitimate";
    t.riskScore = Math.min(25, t.riskScore);
    t.riskLevel = "LOW";

    const timestamp = getTimestamp();
    const auditId = "AUD-" + (1000 + auditLogs.length + 1);
    auditLogs.unshift({
      id: auditId,
      timestamp: timestamp,
      date: timestamp.split(" ")[0],
      time: timestamp.split(" ")[1],
      action: "Transaction Whitelisted",
      accountId: t.senderAccountId,
      customer: t.senderName,
      administrator: admin,
      previousStatus: "Flagged",
      newStatus: "Successful",
      reason: `Transaction ${t.id} cleared as legitimate high-value spend.`
    });

    saveState();
    notifySubscribers("transaction_allowed", t);
    return true;
  }

  // Review Alert
  function markAlertReviewed(alertId, admin = "Admin (SOC Lead)") {
    const alt = alerts.find(a => a.id === alertId);
    if (!alt) return false;

    alt.status = "Reviewed";
    const timestamp = getTimestamp();
    const auditId = "AUD-" + (1000 + auditLogs.length + 1);
    auditLogs.unshift({
      id: auditId,
      timestamp: timestamp,
      date: timestamp.split(" ")[0],
      time: timestamp.split(" ")[1],
      action: "Alert Reviewed",
      accountId: alt.accountId,
      customer: alt.customerName,
      administrator: admin,
      previousStatus: "Active",
      newStatus: "Reviewed",
      reason: `Incident ${alt.id} analyzed and marked reviewed.`
    });

    saveState();
    notifySubscribers("alert_reviewed", alt);
    return true;
  }

  // Reset to Baseline
  function resetToBaseline() {
    localStorage.removeItem(STORAGE_KEY);
    loadState();
    notifySubscribers("reset", null);
  }

  // Dynamic Network Graph Generator (Requirement 10)
  function getDynamicNetworkData() {
    const nodes = [];
    const links = [];
    const nodeSet = new Set();

    // 1. Account Nodes
    accounts.forEach(a => {
      const isBlocked = a.status === "BLOCKED";
      nodes.push({
        id: a.id,
        label: a.id,
        subLabel: a.holderName,
        type: a.id.includes("MULE") ? "Destination" : "Account",
        risk: isBlocked ? "Critical" : (a.riskScore >= 90 ? "Critical" : (a.riskScore >= 70 ? "High" : (a.riskScore >= 40 ? "Medium" : "Safe"))),
        score: a.riskScore,
        ring: a.fraudRingId,
        isBlocked: isBlocked,
        details: `${a.holderName} • Status: ${a.status} • Risk: ${a.riskScore}/100`
      });
      nodeSet.add(a.id);
    });

    // 2. Device Nodes
    devices.forEach(d => {
      nodes.push({
        id: d.id,
        label: d.id,
        subLabel: d.name,
        type: "Device",
        risk: d.risk === "Critical" ? "Critical" : (d.risk === "High" ? "High" : "Safe"),
        score: d.risk === "Critical" ? 95 : 20,
        ring: d.id.startsWith("DEV-9") || d.id.startsWith("DEV-8") ? "FR-07" : null,
        isBlocked: false,
        details: `${d.name} • ${d.linkedAccounts} accounts linked`
      });
      nodeSet.add(d.id);
    });

    // 3. Merchant Nodes
    merchants.forEach(m => {
      nodes.push({
        id: m.id,
        label: m.name,
        subLabel: m.category,
        type: "Merchant",
        risk: m.riskLevel === "High Alert" ? "High" : "Safe",
        score: m.riskLevel === "High Alert" ? 75 : 15,
        ring: null,
        isBlocked: false,
        details: `${m.name} (${m.category}) • Volume: ${m.volume}`
      });
      nodeSet.add(m.id);
    });

    // 4. Connect Device Links
    accounts.forEach(a => {
      if (a.devices) {
        a.devices.forEach(dId => {
          if (nodeSet.has(dId)) {
            links.push({
              source: a.id,
              target: dId,
              type: "SHARED_DEVICE",
              weight: 3
            });
          }
        });
      }
    });

    // 5. Connect Real Transaction Relationships
    transactions.slice(0, 45).forEach(t => {
      const src = t.senderAccountId;
      const tgt = t.receiverAccountId;
      if (nodeSet.has(src) && nodeSet.has(tgt)) {
        links.push({
          source: src,
          target: tgt,
          type: tgt.includes("MULE") ? "MULE_EXTRACTION" : "PURCHASE",
          weight: 2
        });
      }
    });

    return { nodes, links };
  }

  // Initialize Data State
  loadState();

  // False Positive Metrics
  const falsePositiveMetrics = {
    legitimateAllowedPct: 98.7,
    falsePositiveRatePct: 1.3,
    precisionPct: 97.8,
    recallPct: 94.2,
    avgScoringLatencyMs: 14.8,
    baselineProfileCount: 19420
  };

  return {
    // Queries
    get accounts() { return accounts; },
    get initialTransactions() { return transactions; },
    get alerts() { return alerts; },
    get auditLogs() { return auditLogs; },
    get devices() { return devices; },
    get merchants() { return merchants; },
    get fraudRings() { return fraudRings; },
    get patterns() { return patterns; },
    get networkData() { return getDynamicNetworkData(); },
    get kpis() { return calculateKPIs(); },
    get falsePositiveMetrics() { return falsePositiveMetrics; },

    // Calculations & Statistics
    calculateKPIs,
    getPreventedFraudDailyTrend,
    getTransactionVolumeTrend,
    getRiskDistributionStats,
    getTransactionStatusStats,
    getFraudTypeStats,
    formatINR,

    // Mutation Operations
    blockAccount,
    unblockAccount,
    blockTransaction,
    allowTransaction,
    markAlertReviewed,
    resetToBaseline,

    // Subscriptions
    subscribe
  };
})();
