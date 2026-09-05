/* =========================================================
   SetuFin — loan app logic
   ---------------------------------------------------------
   BEFORE GOING LIVE, replace these placeholders:
   1. FIREBASE_CONFIG below — get it from your Firebase project settings.
   2. GOOGLE_CLIENT_ID — from Google Cloud Console (OAuth client).
   3. RAZORPAY_KEY_ID — your live Razorpay key.
   4. Home/Profile screens in index.html — put your real NBFC
      registration number and Delhi Moneylender license number
      where it currently says "XXXXX" (RBI requires these to be
      displayed, and it builds borrower trust).

   IMPORTANT — DATA WE INTENTIONALLY DO NOT COLLECT:
   We never ask for or store a user's Aadhaar NUMBER anywhere in
   this app. Under Aadhaar Act 2016 Section 29, only entities with
   UIDAI AUA/KUA authorization may collect Aadhaar numbers — most
   NBFCs do not have this. Instead we collect a MASKED Aadhaar /
   address-proof photo (upload only) as one KYC document, alongside
   PAN, income proof, bank statement and a selfie. If you obtain
   UIDAI authorization later, that is a separate integration
   (DigiLocker / Aadhaar eKYC), not a raw text field to add here.
   ========================================================= */

const FIREBASE_CONFIG = {
  apiKey: "YOUR_FIREBASE_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
};

const GOOGLE_CLIENT_ID = "452456583028-1l86bibq60ggkl3o1h5j88sed7v04eof.apps.googleusercontent.com";
const RAZORPAY_KEY_ID = "rzp_live_TCZM7OsD80tNpH";
const PROCESSING_FEE_PAISE = 3500; // ₹35.00

/* ---------------- Firebase init ---------------- */
let db = null;
let auth = null;
try {
  firebase.initializeApp(FIREBASE_CONFIG);
  auth = firebase.auth();
  db = firebase.firestore();
} catch (err) {
  console.warn("Firebase not configured yet:", err.message);
}

/* ---------------- App state ---------------- */
const state = {
  activeTab: "home",
  isSignedIn: false,
  user: null, // { uid, name, email, phone, picture, authMethod }
  applyStep: 1,
  apply: {
    loanType: "Personal",
    amount: "",
    tenure: "",
    purpose: "",
    name: "",
    dob: "",
    gender: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    pincode: "",
    employment: "",
    company: "",
    income: "",
    pan: "",
    docs: {
      pan: null,
      aadhaarMasked: null,
      income: null,
      bank: null,
      selfie: null,
    },
  },
  confirmationResult: null,
};

/* =========================================================
   Init
   ========================================================= */
document.addEventListener("DOMContentLoaded", () => {
  waitForGoogleThenInit();
  updateEmi();
  document.getElementById("phone-input").addEventListener("input", (e) => {
    e.target.value = e.target.value.replace(/\D/g, "").slice(0, 10);
  });
  document.getElementById("otp-input").addEventListener("input", (e) => {
    e.target.value = e.target.value.replace(/\D/g, "").slice(0, 6);
  });
  document.getElementById("p-pan").addEventListener("input", (e) => {
    e.target.value = e.target.value.toUpperCase();
  });
});

/* =========================================================
   Tabs
   ========================================================= */
function switchTab(tab, el) {
  state.activeTab = tab;
  document.querySelectorAll(".screen-content").forEach((s) => s.classList.remove("active"));
  document.getElementById(`screen-${tab}`).classList.add("active");
  document.querySelectorAll(".nav-item").forEach((n) => n.classList.remove("active"));
  if (el) el.classList.add("active");

  if (tab === "myloans") loadMyApplications();
}

function startApplyWithType(type) {
  state.apply.loanType = type;
  document.querySelectorAll("#loan-type-chips .chip").forEach((c) => {
    c.classList.toggle("active", c.dataset.type === type);
  });
  switchTab("apply", document.getElementById("nav-apply"));
}

/* =========================================================
   EMI Calculator
   ========================================================= */
function formatRupees(n) {
  return "₹" + Math.round(n).toLocaleString("en-IN");
}

function updateEmi() {
  const amount = parseFloat(document.getElementById("calc-amount").value);
  const tenure = parseInt(document.getElementById("calc-tenure").value, 10);
  const rate = parseFloat(document.getElementById("calc-rate").value);

  document.getElementById("calc-amount-val").textContent = formatRupees(amount);
  document.getElementById("calc-tenure-val").textContent = tenure;
  document.getElementById("calc-rate-val").textContent = rate.toFixed(1) + "%";

  const monthlyRate = rate / 12 / 100;
  let emi;
  if (monthlyRate === 0) {
    emi = amount / tenure;
  } else {
    emi = (amount * monthlyRate * Math.pow(1 + monthlyRate, tenure)) / (Math.pow(1 + monthlyRate, tenure) - 1);
  }
  const totalPayment = emi * tenure;
  const totalInterest = totalPayment - amount;

  document.getElementById("calc-emi-result").textContent = formatRupees(emi) + "/mo";
  document.getElementById("calc-principal-result").textContent = formatRupees(amount);
  document.getElementById("calc-interest-result").textContent = formatRupees(totalInterest);
  document.getElementById("calc-total-result").textContent = formatRupees(totalPayment);
}

/* =========================================================
   Apply flow — step navigation
   ========================================================= */
function selectLoanType(el) {
  document.querySelectorAll("#loan-type-chips .chip").forEach((c) => c.classList.remove("active"));
  el.classList.add("active");
  state.apply.loanType = el.dataset.type;
}

function syncApplyAmount() {
  // no-op hook kept for future live EMI preview inside the apply flow
}

function applyNextStep() {
  if (!validateApplyStep(state.applyStep)) return;
  collectStepData(state.applyStep);

  if (state.applyStep === 5) {
    submitApplication();
    return;
  }

  state.applyStep += 1;
  renderApplyStep();
}

function applyPrevStep() {
  if (state.applyStep === 1) return;
  state.applyStep -= 1;
  renderApplyStep();
}

function renderApplyStep() {
  document.querySelectorAll(".apply-step").forEach((s) => s.classList.remove("active"));
  document.getElementById(`apply-step-${state.applyStep}`).classList.add("active");

  document.querySelectorAll(".stepper-step").forEach((s) => {
    const step = parseInt(s.dataset.step, 10);
    s.classList.toggle("active", step === state.applyStep);
    s.classList.toggle("done", step < state.applyStep);
  });

  document.getElementById("apply-back-btn").style.visibility = state.applyStep === 1 ? "hidden" : "visible";
  document.getElementById("apply-next-btn").textContent = state.applyStep === 5 ? "Pay ₹35 & Submit" : "Continue";

  if (state.applyStep === 5) renderReviewSummary();
}

function validateApplyStep(step) {
  if (step === 1) {
    const amount = document.getElementById("apply-amount").value;
    const tenure = document.getElementById("apply-tenure").value;
    if (!amount || !tenure) {
      showToast("Please enter loan amount and tenure");
      return false;
    }
  }
  if (step === 2) {
    const name = document.getElementById("p-name").value.trim();
    const phone = document.getElementById("p-phone").value.trim();
    const pincode = document.getElementById("p-pincode").value.trim();
    if (!name || phone.length !== 10 || pincode.length !== 6) {
      showToast("Please fill name, a 10-digit phone number, and a 6-digit pincode");
      return false;
    }
  }
  if (step === 3) {
    const pan = document.getElementById("p-pan").value.trim();
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    if (!state.apply.employment) {
      // employment select validated below via collectStepData read
    }
    const employment = document.getElementById("p-employment").value;
    const income = document.getElementById("p-income").value;
    if (!employment || !income || !panRegex.test(pan)) {
      showToast("Please complete employment details and a valid PAN (e.g. ABCDE1234F)");
      return false;
    }
  }
  if (step === 4) {
    const required = ["pan", "aadhaarMasked", "income", "bank", "selfie"];
    const missing = required.filter((k) => !state.apply.docs[k]);
    if (missing.length) {
      showToast("Please upload all required documents");
      return false;
    }
  }
  return true;
}

function collectStepData(step) {
  if (step === 1) {
    state.apply.amount = document.getElementById("apply-amount").value;
    state.apply.tenure = document.getElementById("apply-tenure").value;
    state.apply.purpose = document.getElementById("apply-purpose").value;
  }
  if (step === 2) {
    state.apply.name = document.getElementById("p-name").value.trim();
    state.apply.dob = document.getElementById("p-dob").value;
    state.apply.gender = document.getElementById("p-gender").value;
    state.apply.phone = document.getElementById("p-phone").value.trim();
    state.apply.email = document.getElementById("p-email").value.trim();
    state.apply.address = document.getElementById("p-address").value.trim();
    state.apply.city = document.getElementById("p-city").value.trim();
    state.apply.pincode = document.getElementById("p-pincode").value.trim();
  }
  if (step === 3) {
    state.apply.employment = document.getElementById("p-employment").value;
    state.apply.company = document.getElementById("p-company").value.trim();
    state.apply.income = document.getElementById("p-income").value;
    state.apply.pan = document.getElementById("p-pan").value.trim();
  }
}

function renderReviewSummary() {
  const a = state.apply;
  const rows = [
    ["Loan type", a.loanType],
    ["Amount", formatRupees(parseFloat(a.amount || 0))],
    ["Tenure", `${a.tenure} months`],
    ["Applicant", a.name],
    ["Phone", a.phone],
    ["City / Pincode", `${a.city} / ${a.pincode}`],
    ["Employment", a.employment],
    ["Monthly income", formatRupees(parseFloat(a.income || 0))],
    ["PAN", a.pan],
    ["Documents", "5 of 5 uploaded"],
  ];
  document.getElementById("review-summary").innerHTML = rows
    .map(([label, val]) => `<div class="review-row"><span>${label}</span><span>${val || "—"}</span></div>`)
    .join("");
}

/* =========================================================
   Document uploads
   NOTE: stored here as data-URLs for simplicity. For production,
   upload to Firebase Storage instead and store only the download
   URL in Firestore — data-URLs are fine for a demo but bloat
   Firestore documents fast.
   ========================================================= */
function handleDocUpload(event, key) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;
  if (file.size > 8 * 1024 * 1024) {
    showToast("File is larger than 8MB");
    event.target.value = "";
    return;
  }
  const reader = new FileReader();
  reader.onload = (e) => {
    state.apply.docs[key] = { dataUrl: e.target.result, name: file.name };
    const statusEl = document.getElementById(`status-${key}`);
    statusEl.textContent = `Uploaded: ${file.name}`;
    statusEl.classList.add("uploaded");
  };
  reader.readAsDataURL(file);
}

/* =========================================================
   Submission — Razorpay fee, then save to Firestore
   ========================================================= */
function submitApplication() {
  if (!state.isSignedIn) {
    showToast("Please sign in first");
    return;
  }

  if (typeof Razorpay === "undefined") {
    showToast("Payments unavailable right now — check your connection");
    return;
  }

  const options = {
    key: RAZORPAY_KEY_ID,
    amount: PROCESSING_FEE_PAISE,
    currency: "INR",
    name: "SetuFin — Loan Application",
    description: `Processing fee — ${state.apply.loanType} loan`,
    prefill: {
      name: state.apply.name || state.user?.name || "",
      email: state.apply.email || state.user?.email || "",
      contact: state.apply.phone || state.user?.phone || "",
    },
    theme: { color: "#142850" },
    handler: function (response) {
      saveApplicationToFirestore(response.razorpay_payment_id);
    },
    modal: {
      ondismiss: function () {
        showToast("Payment cancelled — your application was not submitted");
      },
    },
  };

  const rzp = new Razorpay(options);
  rzp.on("payment.failed", function () {
    showToast("Payment failed, please try again");
  });
  rzp.open();
}

function saveApplicationToFirestore(paymentId) {
  if (!db) {
    showToast("Backend not configured yet — see FIREBASE_CONFIG in script.js");
    return;
  }

  const a = state.apply;
  const record = {
    uid: state.user.uid,
    loanType: a.loanType,
    amount: Number(a.amount) || 0,
    tenureMonths: Number(a.tenure) || 0,
    purpose: a.purpose,
    applicant: {
      name: a.name,
      dob: a.dob,
      gender: a.gender,
      phone: a.phone,
      email: a.email,
      address: a.address,
      city: a.city,
      pincode: a.pincode,
    },
    income: {
      employment: a.employment,
      company: a.company,
      monthlyIncome: Number(a.income) || 0,
      pan: a.pan, // PAN is fine to store — standard KYC field
    },
    // Aadhaar NUMBER is intentionally never collected or stored.
    // Only a masked photo is kept, alongside the other KYC documents.
    documents: a.docs,
    status: "pending",
    processingFeePaymentId: paymentId,
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
  };

  db.collection("loanApplications")
    .add(record)
    .then(() => {
      showToast("Application submitted! We'll review and contact you soon.");
      resetApplyFlow();
      switchTab("myloans", document.getElementById("nav-myloans"));
    })
    .catch((err) => {
      console.error(err);
      showToast("Payment succeeded but saving failed — contact support with payment ID " + paymentId);
    });
}

function resetApplyFlow() {
  state.applyStep = 1;
  state.apply = {
    loanType: "Personal", amount: "", tenure: "", purpose: "",
    name: "", dob: "", gender: "", phone: "", email: "", address: "", city: "", pincode: "",
    employment: "", company: "", income: "", pan: "",
    docs: { pan: null, aadhaarMasked: null, income: null, bank: null, selfie: null },
  };
  document.querySelectorAll("#screen-apply input, #screen-apply textarea, #screen-apply select").forEach((el) => (el.value = ""));
  document.querySelectorAll(".upload-row-text p").forEach((p) => {
    p.classList.remove("uploaded");
  });
  renderApplyStep();
}

/* =========================================================
   My Applications
   ========================================================= */
function loadMyApplications() {
  const container = document.getElementById("myloans-list");
  if (!state.isSignedIn) {
    container.innerHTML = `<div class="empty-state"><i class="fa-solid fa-lock"></i>Sign in to see your applications</div>`;
    return;
  }
  if (!db) {
    container.innerHTML = `<div class="empty-state"><i class="fa-solid fa-plug-circle-xmark"></i>Backend not configured yet</div>`;
    return;
  }

  db.collection("loanApplications")
    .where("uid", "==", state.user.uid)
    .orderBy("createdAt", "desc")
    .get()
    .then((snap) => {
      if (snap.empty) {
        container.innerHTML = `<div class="empty-state"><i class="fa-solid fa-file-circle-plus"></i>No applications yet — apply for your first loan</div>`;
        return;
      }
      container.innerHTML = snap.docs
        .map((doc) => {
          const d = doc.data();
          const status = d.status || "pending";
          return `
            <div class="loan-app-card">
              <div class="loan-app-top">
                <h4>${d.loanType} Loan</h4>
                <span class="status-badge ${status}">${status.charAt(0).toUpperCase() + status.slice(1)}</span>
              </div>
              <p>Amount: ${formatRupees(d.amount)} • Tenure: ${d.tenureMonths} months</p>
              <p>Applied: ${d.createdAt ? d.createdAt.toDate().toLocaleDateString("en-IN") : "—"}</p>
            </div>
          `;
        })
        .join("");
    })
    .catch((err) => {
      console.error(err);
      container.innerHTML = `<div class="empty-state"><i class="fa-solid fa-triangle-exclamation"></i>Couldn't load applications</div>`;
    });
}

/* =========================================================
   Auth — Phone OTP (Firebase) + Google Sign-In
   ========================================================= */
let recaptchaVerifier = null;

function setupRecaptcha() {
  if (!auth || recaptchaVerifier) return;
  recaptchaVerifier = new firebase.auth.RecaptchaVerifier("recaptcha-container", {
    size: "invisible",
  });
}

function sendOtp() {
  if (!auth) {
    showToast("Backend not configured yet — see FIREBASE_CONFIG in script.js");
    return;
  }
  const phoneDigits = document.getElementById("phone-input").value.trim();
  if (phoneDigits.length !== 10) {
    showToast("Enter a valid 10-digit mobile number");
    return;
  }
  setupRecaptcha();

  auth
    .signInWithPhoneNumber(`+91${phoneDigits}`, recaptchaVerifier)
    .then((confirmationResult) => {
      state.confirmationResult = confirmationResult;
      document.getElementById("otp-row").classList.remove("hidden");
      showToast("OTP sent");
    })
    .catch((err) => {
      logDebug("OTP send failed: " + err.message);
      showToast("Couldn't send OTP, try again");
    });
}

function verifyOtp() {
  const code = document.getElementById("otp-input").value.trim();
  if (!state.confirmationResult || code.length !== 6) {
    showToast("Enter the 6-digit OTP");
    return;
  }
  state.confirmationResult
    .confirm(code)
    .then((result) => {
      const fbUser = result.user;
      signInUser({
        uid: fbUser.uid,
        name: fbUser.displayName || "SetuFin User",
        email: fbUser.email || "",
        phone: fbUser.phoneNumber || `+91${document.getElementById("phone-input").value.trim()}`,
        picture: fbUser.photoURL || "",
        authMethod: "phone",
      });
    })
    .catch((err) => {
      logDebug("OTP verify failed: " + err.message);
      showToast("Incorrect OTP, please try again");
    });
}

function waitForGoogleThenInit() {
  const statusEl = document.getElementById("signin-status");
  const fallbackBtn = document.getElementById("google-fallback-btn");
  let attempts = 0;
  const poll = setInterval(() => {
    attempts++;
    if (typeof google !== "undefined" && google.accounts && google.accounts.id) {
      clearInterval(poll);
      initGoogleSignIn();
      return;
    }
    if (attempts > 25) {
      clearInterval(poll);
      logDebug("Google Identity Services script did not load in time.");
      if (fallbackBtn) fallbackBtn.style.display = "flex";
    }
  }, 200);
}

function initGoogleSignIn() {
  const fallbackBtn = document.getElementById("google-fallback-btn");
  try {
    google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: handleGoogleCredential,
      auto_select: false,
    });
    google.accounts.id.renderButton(document.getElementById("google-signin-btn-gate"), {
      theme: "filled_white",
      size: "large",
      shape: "pill",
      width: 300,
    });
  } catch (err) {
    logDebug("Google init failed: " + err.message);
    fallbackBtn.style.display = "flex";
  }
}

function handleFallbackGoogleClick() {
  if (typeof google !== "undefined" && google.accounts && google.accounts.id) {
    google.accounts.id.prompt();
  } else {
    showToast("Sign-in isn't configured yet");
  }
}

function handleGoogleCredential(response) {
  try {
    const payload = decodeJwt(response.credential);
    signInUser({
      uid: payload.sub,
      name: payload.name,
      email: payload.email,
      phone: "",
      picture: payload.picture,
      authMethod: "google",
    });
  } catch (err) {
    logDebug("Credential decode failed: " + err.message);
    showToast("Sign-in failed, please try again");
  }
}

function decodeJwt(token) {
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const json = decodeURIComponent(
    atob(base64)
      .split("")
      .map((c) => "%" + c.charCodeAt(0).toString(16).padStart(2, "0"))
      .join("")
  );
  return JSON.parse(json);
}

function signInUser(user) {
  state.isSignedIn = true;
  state.user = user;

  document.getElementById("login-gate").classList.add("hidden");
  document.getElementById("login-gate").style.display = "none";

  document.getElementById("home-username").textContent = user.name.split(" ")[0];
  document.getElementById("profile-name-text").textContent = user.name;
  document.getElementById("profile-email-text").textContent = user.email || user.phone;

  const avatar = document.getElementById("profile-avatar");
  avatar.innerHTML = user.picture
    ? `<img src="${user.picture}" style="width:100%;height:100%;object-fit:cover;" />`
    : (user.name?.[0]?.toUpperCase() || "U");

  showToast(`Welcome, ${user.name.split(" ")[0]}!`);
}

function signOutUser() {
  state.isSignedIn = false;
  state.user = null;
  if (auth) auth.signOut().catch(() => {});
  if (typeof google !== "undefined" && google.accounts) {
    google.accounts.id.disableAutoSelect();
  }
  document.getElementById("login-gate").style.display = "flex";
  document.getElementById("login-gate").classList.remove("hidden");
  document.getElementById("profile-name-text").textContent = "Not signed in";
  document.getElementById("profile-email-text").textContent = "";
  document.getElementById("profile-avatar").innerHTML = "U";
  document.getElementById("home-username").textContent = "Guest";
  showToast("Signed out");
}

/* =========================================================
   Toast + debug
   ========================================================= */
let toastTimer = null;
function showToast(message) {
  const toast = document.getElementById("app-toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2400);
}

function logDebug(msg) {
  const el = document.getElementById("debug-log");
  el.classList.add("show");
  const line = document.createElement("div");
  line.textContent = msg;
  el.appendChild(line);
}
