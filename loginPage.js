/**
 * FraudLens AI - Login Page (User ID + Password only, no mobile / OTP)
 * Self-contained: injects its own scoped styles, so it works with or without login.css.
 */

window.FraudLensLoginPage = (function () {
  const STYLE_ID = "fl-login-inline-style";

  function injectStyle() {
    if (document.getElementById(STYLE_ID)) return;
    const s = document.createElement("style");
    s.id = STYLE_ID;
    s.textContent = `
      .fl-login-wrap{min-height:100vh;display:flex;align-items:center;justify-content:center;padding:24px;
        background:radial-gradient(circle at 20% 20%,#12304f 0%,#0a1220 55%,#060b14 100%);color:#e2e8f0;font-family:system-ui,sans-serif}
      .fl-login-card{width:100%;max-width:420px;padding:36px 32px;border-radius:18px;
        background:rgba(15,23,42,.75);border:1px solid rgba(148,163,184,.18);backdrop-filter:blur(14px);
        box-shadow:0 20px 60px rgba(0,0,0,.5)}
      .fl-login-brand{font-size:26px;font-weight:700;color:#fff;margin-bottom:4px}
      .fl-login-sub{font-size:13px;color:#94a3b8;margin-bottom:26px}
      .fl-field{margin-bottom:16px}
      .fl-field label{display:block;font-size:12px;color:#94a3b8;margin-bottom:6px;letter-spacing:.04em}
      .fl-input-row{position:relative}
      .fl-input-row input{width:100%;box-sizing:border-box;padding:12px 14px;border-radius:10px;font-size:14px;
        background:#0b1424;border:1px solid #1e293b;color:#fff;outline:none}
      .fl-input-row input:focus{border-color:#38bdf8}
      .fl-eye{position:absolute;right:10px;top:50%;transform:translateY(-50%);background:none;border:0;color:#94a3b8;cursor:pointer;font-size:15px}
      .fl-error{display:none;margin-bottom:14px;padding:10px 12px;border-radius:8px;font-size:13px;
        background:rgba(239,68,68,.12);border:1px solid rgba(239,68,68,.4);color:#fca5a5}
      .fl-btn{width:100%;padding:12px;border:0;border-radius:10px;font-size:14px;font-weight:600;cursor:pointer;
        background:linear-gradient(90deg,#0ea5e9,#2563eb);color:#fff}
      .fl-btn:disabled{opacity:.6;cursor:default}
      .fl-btn-ghost{margin-top:12px;background:transparent;border:1px dashed #334155;color:#7dd3fc}
      .fl-verify{display:none;text-align:center;padding:10px 0}
      .fl-spinner{width:42px;height:42px;margin:0 auto 14px;border-radius:50%;border:3px solid #1e293b;border-top-color:#38bdf8;animation:flspin .8s linear infinite}
      @keyframes flspin{to{transform:rotate(360deg)}}
      .fl-verify-text{font-size:14px;color:#cbd5e1}
    `;
    document.head.appendChild(s);
  }

  function render(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    injectStyle();

    container.innerHTML = `
      <div class="fl-login-wrap">
        <div class="fl-login-card">
          <div class="fl-login-brand">FraudLens AI</div>
          <div class="fl-login-sub">Real-Time Financial Fraud Intelligence • Secure SOC Access</div>

          <div id="flLoginForm">
            <div class="fl-error" id="flLoginError"></div>

            <div class="fl-field">
              <label for="flUserId">USER ID</label>
              <div class="fl-input-row">
                <input id="flUserId" type="text" autocomplete="username" placeholder="Enter your User ID" />
              </div>
            </div>

            <div class="fl-field">
              <label for="flPassword">PASSWORD</label>
              <div class="fl-input-row">
                <input id="flPassword" type="password" autocomplete="current-password" placeholder="Enter your password" />
                <button type="button" class="fl-eye" id="flEye" title="Show / hide password">👁</button>
              </div>
            </div>

            <button class="fl-btn" id="flLoginBtn">Continue Securely →</button>
            <button class="fl-btn fl-btn-ghost" id="flAutoFill">⚡ Auto-Fill Demo Credentials</button>
          </div>

          <div class="fl-verify" id="flVerify">
            <div class="fl-spinner"></div>
            <div class="fl-verify-text" id="flVerifyText">Checking credentials…</div>
          </div>
        </div>
      </div>
    `;

    const $ = (id) => document.getElementById(id);
    const userEl = $("flUserId");
    const passEl = $("flPassword");
    const errEl = $("flLoginError");

    function showError(msg) {
      errEl.textContent = msg;
      errEl.style.display = "block";
    }

    $("flEye").addEventListener("click", () => {
      passEl.type = passEl.type === "password" ? "text" : "password";
    });

    $("flAutoFill").addEventListener("click", () => {
      const c = FraudLensAuth.demoCredentials;
      userEl.value = c.userId;
      passEl.value = c.password;
      errEl.style.display = "none";
    });

    function submit() {
      errEl.style.display = "none";
      const result = FraudLensAuth.login(userEl.value, passEl.value);
      if (!result.success) {
        showError(result.error);
        return;
      }

      // Short verification animation, then go to dashboard
      $("flLoginForm").style.display = "none";
      $("flVerify").style.display = "block";
      const steps = ["Checking credentials…", "Analyzing secure session…", "Access granted ✓"];
      steps.forEach((text, i) => {
        setTimeout(() => { $("flVerifyText").textContent = text; }, i * 500);
      });
      setTimeout(() => {
        if (window.FraudLensToast) {
          FraudLensToast.success("Welcome back", "Signed in as " + result.user.name);
        }
        FraudLensApp.navigate("overview");
      }, 1500);
    }

    $("flLoginBtn").addEventListener("click", submit);
    [userEl, passEl].forEach((el) =>
      el.addEventListener("keydown", (e) => { if (e.key === "Enter") submit(); })
    );
    userEl.focus();
  }

  return { render };
})();