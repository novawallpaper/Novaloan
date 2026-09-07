/* =========================================================
   REQUEST WEBSITE — Google Login + ₹45 Razorpay
   Flow:
   Google Login → Payment Page → ₹45 Payment
   → Backend Verification → Request Saved
   ========================================================= */

/* ================= PUBLIC CONFIG ================= */

const GOOGLE_CLIENT_ID =
  "470674864622-aqmvbmn0r33nasost2814phsqljgtc3l.apps.googleusercontent.com";

const RAZORPAY_KEY_ID =
  "rzp_live_TCZM7OsD80tNpH";

const PAYMENT_AMOUNT = 45;


/* ================= APP STATE ================= */

let currentUser = null;
let paymentInProgress = false;


/* ================= PAGE ELEMENTS ================= */

const loginPage = document.getElementById("login-page");
const paymentPage = document.getElementById("payment-page");
const successPage = document.getElementById("success-page");

const loadingOverlay = document.getElementById("loading-overlay");
const toast = document.getElementById("toast");


/* ================= PAGE CONTROL ================= */

function showPage(page) {
  document.querySelectorAll(".page").forEach((el) => {
    el.classList.remove("active");
  });

  if (page) {
    page.classList.add("active");
  }
}


function showLoginPage() {
  showPage(loginPage);
}


function showPaymentPage() {
  showPage(paymentPage);
}


function showSuccessPage() {
  showPage(successPage);
}


/* ================= LOADING ================= */

function showLoading(text = "Please wait...") {
  if (!loadingOverlay) return;

  const textElement =
    loadingOverlay.querySelector(".loading-text");

  if (textElement) {
    textElement.textContent = text;
  }

  loadingOverlay.classList.add("active");
}


function hideLoading() {
  if (!loadingOverlay) return;

  loadingOverlay.classList.remove("active");
}


/* ================= TOAST ================= */

let toastTimer;

function showToast(message) {
  if (!toast) {
    alert(message);
    return;
  }

  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(toastTimer);

  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}


/* =========================================================
   GOOGLE LOGIN
   ========================================================= */

function initGoogleLogin() {

  if (
    typeof google === "undefined" ||
    !google.accounts ||
    !google.accounts.id
  ) {
    console.error("Google Identity Services not loaded.");
    showToast("Google Login load nahi ho paya.");
    return;
  }

  try {

    google.accounts.id.initialize({

      client_id: GOOGLE_CLIENT_ID,

      callback: handleGoogleLogin,

      auto_select: false,

      cancel_on_tap_outside: true

    });


    const buttonContainer =
      document.getElementById("google-login-button");

    if (buttonContainer) {

      buttonContainer.innerHTML = "";

      google.accounts.id.renderButton(
        buttonContainer,
        {
          theme: "outline",
          size: "large",
          shape: "rectangular",
          width: 320,
          text: "continue_with"
        }
      );

    }

  } catch (error) {

    console.error("Google initialization error:", error);

    showToast("Google Login setup error.");

  }
}


/* ================= GOOGLE CALLBACK ================= */

function handleGoogleLogin(response) {

  if (!response || !response.credential) {

    showToast("Google Login failed.");
    return;

  }

  try {

    const user = decodeGoogleJWT(response.credential);

    if (!user || !user.email) {
      throw new Error("Invalid Google account information.");
    }

    currentUser = {

      name: user.name || "User",

      email: user.email,

      picture: user.picture || "",

      googleCredential: response.credential

    };


    /* Save login for current browser session */

    sessionStorage.setItem(
      "request_user",
      JSON.stringify({
        name: currentUser.name,
        email: currentUser.email,
        picture: currentUser.picture
      })
    );


    updateUserUI();

    showToast(
      `Welcome, ${currentUser.name.split(" ")[0]}!`
    );


    setTimeout(() => {

      showPaymentPage();

    }, 500);

  } catch (error) {

    console.error("Google login error:", error);

    showToast("Google Login failed. Please try again.");

  }

}


/* ================= DECODE GOOGLE JWT ================= */

function decodeGoogleJWT(token) {

  const parts = token.split(".");

  if (parts.length !== 3) {
    throw new Error("Invalid Google token.");
  }

  const base64Url = parts[1];

  const base64 = base64Url
    .replace(/-/g, "+")
    .replace(/_/g, "/");

  const padded =
    base64 +
    "=".repeat((4 - (base64.length % 4)) % 4);

  const binary = atob(padded);

  const bytes = new Uint8Array(binary.length);

  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }

  const decoder = new TextDecoder("utf-8");

  return JSON.parse(decoder.decode(bytes));

}


/* ================= USER UI ================= */

function updateUserUI() {

  if (!currentUser) return;


  const nameElements =
    document.querySelectorAll("[data-user-name]");

  nameElements.forEach((el) => {
    el.textContent = currentUser.name;
  });


  const emailElements =
    document.querySelectorAll("[data-user-email]");

  emailElements.forEach((el) => {
    el.textContent = currentUser.email;
  });


  const avatarElements =
    document.querySelectorAll("[data-user-avatar]");

  avatarElements.forEach((el) => {

    if (currentUser.picture) {

      el.innerHTML = `
        <img
          src="${currentUser.picture}"
          alt="Profile"
          style="width:100%;height:100%;object-fit:cover;border-radius:50%;"
        >
      `;

    } else {

      el.textContent =
        currentUser.name.charAt(0).toUpperCase();

    }

  });

}


/* =========================================================
   RAZORPAY PAYMENT
   ========================================================= */

async function startPayment() {

  if (paymentInProgress) {
    return;
  }


  if (!currentUser) {

    showToast("Please login with Google first.");
    showLoginPage();

    return;

  }


  if (
    typeof Razorpay === "undefined"
  ) {

    showToast(
      "Payment system load nahi hua. Page refresh karein."
    );

    return;

  }


  paymentInProgress = true;

  showLoading("Creating payment...");


  try {

    /*
      IMPORTANT:

      ₹45 ka Razorpay Order BACKEND par create hoga.

      Frontend directly trusted payment amount/order
      create nahi karega.
    */

    const orderResponse = await fetch(
      "/api/create-order",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({

          amount: PAYMENT_AMOUNT,

          user: {
            name: currentUser.name,

            email: currentUser.email
          }

        })
      }
    );


    if (!orderResponse.ok) {

      throw new Error(
        "Unable to create payment order."
      );

    }


    const order = await orderResponse.json();


    if (!order.order_id) {

      throw new Error(
        "Backend did not return Razorpay order ID."
      );

    }


    hideLoading();


    openRazorpayCheckout(order);


  } catch (error) {

    console.error("Create order error:", error);

    hideLoading();

    paymentInProgress = false;

    showToast(
      "Payment start nahi ho paya. Please try again."
    );

  }

}


/* =========================================================
   RAZORPAY CHECKOUT
   ========================================================= */

function openRazorpayCheckout(order) {

  const options = {

    key: RAZORPAY_KEY_ID,

    order_id: order.order_id,

    amount: order.amount || 4500,

    currency: order.currency || "INR",

    name: "Your Request",

    description: "Request Processing Fee",

    image: "",


    prefill: {

      name: currentUser?.name || "",

      email: currentUser?.email || ""

    },


    notes: {

      user_email: currentUser?.email || "",

      user_name: currentUser?.name || ""

    },


    theme: {

      color: "#2563eb"

    },


    handler: async function (response) {

      await verifyPayment(response);

    },


    modal: {

      ondismiss: function () {

        paymentInProgress = false;

        showToast("Payment cancelled.");

      }

    }

  };


  try {

    const razorpay =
      new Razorpay(options);


    razorpay.on(
      "payment.failed",
      function (response) {

        console.error(
          "Payment failed:",
          response
        );

        paymentInProgress = false;

        showToast(
          "Payment failed. Please try again."
        );

      }
    );


    razorpay.open();


  } catch (error) {

    console.error(
      "Razorpay checkout error:",
      error
    );

    paymentInProgress = false;

    showToast(
      "Unable to open payment window."
    );

  }

}


/* =========================================================
   PAYMENT VERIFICATION
   ========================================================= */

async function verifyPayment(paymentResponse) {

  showLoading("Verifying payment...");


  try {

    const verifyResponse = await fetch(
      "/api/verify-payment",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({

          razorpay_order_id:
            paymentResponse.razorpay_order_id,

          razorpay_payment_id:
            paymentResponse.razorpay_payment_id,

          razorpay_signature:
            paymentResponse.razorpay_signature,

          user: {

            name:
              currentUser?.name || "",

            email:
              currentUser?.email || ""

          }

        })
      }
    );


    const result =
      await verifyResponse.json();


    if (
      !verifyResponse.ok ||
      !result.success
    ) {

      throw new Error(
        result.message ||
        "Payment verification failed."
      );

    }


    /*
      PAYMENT VERIFIED SUCCESSFULLY
    */

    paymentInProgress = false;

    hideLoading();

    savePaymentLocally(paymentResponse);

    showSuccessPage();

  } catch (error) {

    console.error(
      "Payment verification error:",
      error
    );

    paymentInProgress = false;

    hideLoading();

    showToast(
      "Payment verify nahi ho paya. Support se contact karein."
    );

  }

}


/* =========================================================
   SAVE PAYMENT STATUS
   ========================================================= */

function savePaymentLocally(paymentResponse) {

  const paymentData = {

    paymentId:
      paymentResponse.razorpay_payment_id,

    orderId:
      paymentResponse.razorpay_order_id,

    email:
      currentUser?.email || "",

    name:
      currentUser?.name || "",

    amount: PAYMENT_AMOUNT,

    date:
      new Date().toISOString()

  };


  sessionStorage.setItem(
    "request_payment",
    JSON.stringify(paymentData)
  );

}


/* =========================================================
   SESSION RESTORE
   ========================================================= */

function restoreSession() {

  try {

    const savedUser =
      sessionStorage.getItem("request_user");

    const savedPayment =
      sessionStorage.getItem("request_payment");


    if (savedUser) {

      currentUser =
        JSON.parse(savedUser);

      updateUserUI();

    }


    /*
      Agar payment already verified hai,
      refresh ke baad success page dikhao.
    */

    if (savedUser && savedPayment) {

      showSuccessPage();

      return;

    }


    if (savedUser) {

      showPaymentPage();

      return;

    }


    showLoginPage();

  } catch (error) {

    console.error(
      "Session restore error:",
      error
    );

    sessionStorage.clear();

    showLoginPage();

  }

}


/* =========================================================
   SIGN OUT
   ========================================================= */

function signOut() {

  currentUser = null;

  sessionStorage.removeItem("request_user");
  sessionStorage.removeItem("request_payment");


  if (
    typeof google !== "undefined" &&
    google.accounts &&
    google.accounts.id
  ) {

    google.accounts.id.disableAutoSelect();

  }


  showLoginPage();

  showToast("Signed out.");

}


/* =========================================================
   TERMS / PRIVACY MODALS
   ========================================================= */

function openModal(id) {

  const modal =
    document.getElementById(id);

  if (modal) {

    modal.classList.add("active");

  }

}


function closeModal(id) {

  const modal =
    document.getElementById(id);

  if (modal) {

    modal.classList.remove("active");

  }

}


function closeAllModals() {

  document
    .querySelectorAll(".modal")
    .forEach((modal) => {

      modal.classList.remove("active");

    });

}


/* Close modal when clicking outside */

document.addEventListener(
  "click",
  function (event) {

    if (
      event.target.classList.contains("modal")
    ) {

      event.target.classList.remove(
        "active"
      );

    }

  }
);


/* =========================================================
   BUTTON EVENT FALLBACKS
   ========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  function () {

    /* Google Login */

    const googleButton =
      document.getElementById(
        "google-login-button"
      );


    /* Payment */

    const payButton =
      document.getElementById(
        "pay-button"
      );

    if (payButton) {

      payButton.addEventListener(
        "click",
        startPayment
      );

    }


    /* Terms */

    const termsButton =
      document.getElementById(
        "terms-button"
      );

    if (termsButton) {

      termsButton.addEventListener(
        "click",
        () => openModal("terms-modal")
      );

    }


    /* Privacy */

    const privacyButton =
      document.getElementById(
        "privacy-button"
      );

    if (privacyButton) {

      privacyButton.addEventListener(
        "click",
        () => openModal("privacy-modal")
      );

    }


    /* Close buttons */

    document
      .querySelectorAll("[data-close-modal]")
      .forEach((button) => {

        button.addEventListener(
          "click",
          () => {

            closeModal(
              button.dataset.closeModal
            );

          }
        );

      });


    /*
      Google library kabhi-kabhi DOMContentLoaded
      ke baad load hoti hai, isliye thoda wait.
    */

    let attempts = 0;

    const googleTimer =
      setInterval(() => {

        attempts++;

        if (
          typeof google !== "undefined" &&
          google.accounts &&
          google.accounts.id
        ) {

          clearInterval(googleTimer);

          initGoogleLogin();

        }


        if (attempts >= 30) {

          clearInterval(googleTimer);

          console.error(
            "Google Identity Services timeout."
          );

        }

      }, 300);


    restoreSession();

  }
);


/* =========================================================
   GLOBAL FUNCTIONS
   HTML onclick="" ke liye
   ========================================================= */

window.startPayment =
  startPayment;

window.handleGoogleLogin =
  handleGoogleLogin;

window.signOut =
  signOut;

window.openModal =
  openModal;

window.closeModal =
  closeModal;

window.closeAllModals =
  closeAllModals;
