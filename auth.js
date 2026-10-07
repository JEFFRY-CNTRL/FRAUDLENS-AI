/**
 * FraudLens AI - Authentication & Session Service
 * Simple User ID + Password login (no mobile number, no OTP, no Firebase).
 * Session is kept in sessionStorage so a refresh does not force re-login.
 */

window.FraudLensAuth = (function () {
  const SESSION_KEY = "fraudlens_authenticated";
  const USER_KEY = "fraudlens_user";

  // Demo credentials
  const VALID_USER_ID = "admin001";
  const VALID_PASSWORD = "FraudLens@2026";

  const DEFAULT_USER = {
    userId: VALID_USER_ID,
    name: "Admin",
    title: "SOC Lead / Risk Director",
    role: "Enterprise Fraud Analyst"
  };

  /**
   * Validate credentials and start a session.
   * Returns { success, user } or { success: false, error }
   */
  function login(userId, password) {
    const id = (userId || "").trim();
    const pw = password || "";

    if (!id || !pw) {
      return { success: false, error: "Enter your User ID and Password." };
    }

    // Generic message to avoid user enumeration
    if (id !== VALID_USER_ID || pw !== VALID_PASSWORD) {
      return { success: false, error: "Invalid User ID or Password." };
    }

    setAuthenticated(DEFAULT_USER);
    return { success: true, user: DEFAULT_USER };
  }

  function setAuthenticated(user) {
    try {
      sessionStorage.setItem(SESSION_KEY, "true");
      sessionStorage.setItem(USER_KEY, JSON.stringify(user || DEFAULT_USER));
    } catch (e) {
      console.error("Session storage error:", e);
    }
  }

  function isAuthenticated() {
    try {
      return sessionStorage.getItem(SESSION_KEY) === "true";
    } catch (e) {
      return false;
    }
  }

  function getCurrentUser() {
    try {
      const data = sessionStorage.getItem(USER_KEY);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error("Could not read user session", e);
    }
    return null;
  }

  function logout() {
    try {
      sessionStorage.removeItem(SESSION_KEY);
      sessionStorage.removeItem(USER_KEY);
    } catch (e) {
      console.error("Logout error:", e);
    }

    if (window.FraudLensToast) {
      window.FraudLensToast.info("Session Closed", "You have been securely signed out.");
    }
    if (window.FraudLensApp) {
      window.FraudLensApp.navigate("login");
    }
  }

  return {
    login,
    isAuthenticated,
    setAuthenticated,
    getCurrentUser,
    logout,
    demoCredentials: { userId: VALID_USER_ID, password: VALID_PASSWORD }
  };
})();