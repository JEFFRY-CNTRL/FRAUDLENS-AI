/**
 * FraudLens AI - Simulated One-Time Password (OTP) Engine
 * Manages OTP generation, validation, attempt limits, lockouts, and resend cycles
 * Designed with simulated delivery and clean separation for future real SMS API integration
 */

window.FraudLensOtp = (function () {
  let activeOtp = null;
  let targetMobile = "";
  let failedAttempts = 0;
  let lockoutUntil = null;
  let createdAt = null;
  const MAX_ATTEMPTS = 3;
  const LOCKOUT_DURATION_SEC = 30;

  /**
   * Format and mask mobile number to +91 ******XXXX
   */
  function maskMobile(mobile) {
    const cleaned = (mobile || "").replace(/\D/g, "");
    const last4 = cleaned.slice(-4) || "3210";
    return `+91 ******${last4}`;
  }

  /**
   * Generate a fresh 6-digit random OTP
   */
  function generateOtp(mobile) {
    targetMobile = mobile || "9876543210";
    // Generate random 6-digit integer between 100000 and 999999
    activeOtp = Math.floor(100000 + Math.random() * 900000).toString();
    createdAt = Date.now();
    failedAttempts = 0;
    lockoutUntil = null;

    console.log(`[FraudLens Demo SMS Gateway] OTP generated for ${maskMobile(targetMobile)}: ${activeOtp}`);
    return {
      otp: activeOtp,
      maskedMobile: maskMobile(targetMobile),
      expiresInSeconds: 300
    };
  }

  /**
   * Check if user is currently locked out after 3 failed attempts
   */
  function isLockedOut() {
    if (!lockoutUntil) return false;
    const remaining = Math.ceil((lockoutUntil - Date.now()) / 1000);
    if (remaining > 0) {
      return true;
    }
    // Lockout expired: reset
    lockoutUntil = null;
    failedAttempts = 0;
    return false;
  }

  function getRemainingLockoutSeconds() {
    if (!lockoutUntil) return 0;
    const remaining = Math.ceil((lockoutUntil - Date.now()) / 1000);
    return Math.max(0, remaining);
  }

  /**
   * Verify entered 6-digit OTP
   */
  function verifyOtp(enteredOtp) {
    // Check lockout first
    if (isLockedOut()) {
      return {
        success: false,
        locked: true,
        remainingLockoutSeconds: getRemainingLockoutSeconds(),
        message: `Too many incorrect attempts. Try again in ${getRemainingLockoutSeconds()} seconds.`
      };
    }

    if (!activeOtp) {
      return {
        success: false,
        locked: false,
        message: "No active OTP found. Please request a new code."
      };
    }

    const cleanInput = (enteredOtp || "").toString().trim();

    if (cleanInput === activeOtp) {
      // Verified successfully
      activeOtp = null;
      failedAttempts = 0;
      lockoutUntil = null;
      return {
        success: true,
        message: "Identity verified"
      };
    }

    // Failed attempt
    failedAttempts += 1;

    if (failedAttempts >= MAX_ATTEMPTS) {
      lockoutUntil = Date.now() + (LOCKOUT_DURATION_SEC * 1000);
      return {
        success: false,
        locked: true,
        remainingLockoutSeconds: LOCKOUT_DURATION_SEC,
        attemptsLeft: 0,
        message: "Too many incorrect attempts. Try again in 30 seconds."
      };
    }

    const attemptsLeft = MAX_ATTEMPTS - failedAttempts;
    return {
      success: false,
      locked: false,
      attemptsLeft: attemptsLeft,
      message: `Incorrect OTP. Please try again. (${attemptsLeft} attempt${attemptsLeft === 1 ? '' : 's'} remaining)`
    };
  }

  /**
   * Resend / regenerate OTP
   */
  function resendOtp() {
    failedAttempts = 0;
    lockoutUntil = null;
    const newGen = generateOtp(targetMobile);
    return {
      success: true,
      otp: newGen.otp,
      maskedMobile: newGen.maskedMobile,
      message: "New OTP generated successfully."
    };
  }

  return {
    generateOtp,
    verifyOtp,
    resendOtp,
    isLockedOut,
    getRemainingLockoutSeconds,
    getCurrentOtp: () => activeOtp,
    getMaskedMobile: () => maskMobile(targetMobile),
    getFailedAttempts: () => failedAttempts
  };
})();
