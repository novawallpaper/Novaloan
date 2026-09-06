/* =========================================
   SETUFIN — SCRIPT.JS
   Flow:
   Google Login
        ↓
   ₹45 Razorpay Payment
        ↓
   Your Request Saved
========================================= */


/* =========================================
   PUBLIC CONFIG
========================================= */

// Google OAuth Client ID
const GOOGLE_CLIENT_ID =
  "470674864622-aqmvbmn0r33nasost2814phsqljgtc3l.apps.googleusercontent.com";

// Razorpay PUBLIC Key ID
const RAZORPAY_KEY_ID =
  "rzp_live_TCZM7OsD80tNpH";

// Payment amount
const PAYMENT_AMOUNT = 45;


/* =========================================
   APP STATE
========================================= */

let currentUser = null;
let paymentInProgress = false;


/* =========================================
   PAGE ELEMENTS
========================================= */

const loginPage = document.getElementById("loginPage");
const paymentPage = document.getElementById("paymentPage");
const successPage = document.getElementById("successPage");

const payButton = document.getElementById("payButton");
const payButtonText = document.getElementById("payButtonText");

const loadingOverlay = document.getElementById("loadingOverlay");
const loadingText = document.getElementById("loadingText");

const toast = document.getElementById("toast");
const toastMessage = document.getElementById("toastMessage");


/* =========================================
   INITIALIZE
========================================= */

document.addEventListener("DOMContentLoaded", () => {

  // Make sure login page is visible initially
  showPage("loginPage");

  // Check Razorpay availability
  if (typeof Razorpay === "undefined") {
    console.warn("Razorpay Checkout SDK not loaded.");
  }

});


/* =========================================
   PAGE SWITCHING
========================================= */

function showPage(pageId) {

  loginPage.classList.add("hidden");
  paymentPage.classList.add("hidden");
  successPage.classList.add("hidden");

  const page = document.getElementById(pageId);

  if (page) {
    page.classList.remove("hidden");
  }
}


/* =========================================
   GOOGLE LOGIN
========================================= */

/*
   Google Identity Services calls this function
   after successful Google authentication.
*/

function handleGoogleLogin(response) {

  if (!response || !response.credential) {
    showToast("Google login failed.");
    return;
  }

  try {

    // Decode Google credential payload
    const payload = parseJwt(response.credential);

    currentUser = {
      id: payload.sub || "",
      name: payload.name || "User",
      email: payload.email || "",
      picture: payload.picture || ""
    };


    // Save only basic non-sensitive session information
    sessionStorage.setItem(
      "setufin_user",
      JSON.stringify(currentUser)
    );


    // Continue to payment
    showPaymentPage();

  } catch (error) {

    console.error("Google Login Error:", error);

    showToast("Unable to complete Google login.");

  }
}


/* =========================================
   JWT DECODER
========================================= */

function parseJwt(token) {

  const base64Url = token.split(".")[1];

  const base64 = base64Url
    .replace(/-/g, "+")
    .replace(/_/g, "/");

  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map(function (c) {

        return "%" +
          ("00" + c.charCodeAt(0).toString(16)).slice(-2);

      })
      .join("")
  );

  return JSON.parse(jsonPayload);
}


/* =========================================
   PAYMENT PAGE
========================================= */

function showPaymentPage() {

  if (!currentUser) {
    showPage("loginPage");
    return;
  }

  showPage("paymentPage");

}


/* =========================================
   START RAZORPAY PAYMENT
========================================= */

async function startPayment() {

  if (paymentInProgress) {
    return;
  }

  if (!currentUser) {

    showToast("Please login with Google first.");

    showPage("loginPage");

    return;
  }


  // Check Razorpay SDK
  if (typeof Razorpay === "undefined") {

    showToast("Payment system is not loaded. Please refresh.");

    return;
  }


  // Check public key
  if (
    !RAZORPAY_KEY_ID ||
    RAZORPAY_KEY_ID === "PASTE_YOUR_RAZORPAY_KEY_ID_HERE"
  ) {

    showToast("Razorpay Key ID is not configured.");

    return;
  }


  paymentInProgress = true;

  setPaymentButtonLoading(true);


  try {

    /*
      IMPORTANT:

      For a real production payment, your backend should
      create the Razorpay Order and return its order_id.

      Expected backend response:

      {
        "order_id": "order_xxxxxxxxx",
        "amount": 4500,
        "currency": "INR"
      }
    */

    const order = await createPaymentOrder();


    if (!order || !order.order_id) {

      throw new Error(
        "Unable to create payment order."
      );

    }


    const options = {

      key: RAZORPAY_KEY_ID,

      amount: order.amount || 4500,

      currency: order.currency || "INR",

      name: "SetuFin",

      description: "Processing Fee",

      order_id: order.order_id,


      prefill: {

        name: currentUser.name || "",

        email: currentUser.email || ""

      },


      notes: {

        user_id: currentUser.id || ""

      },


      theme: {

        color: "#2563eb"

      },


      modal: {

        ondismiss: function () {

          paymentInProgress = false;

          setPaymentButtonLoading(false);

          showToast("Payment cancelled.");

        }

      },


      handler: async function (paymentResponse) {

        await verifyPayment(paymentResponse);

      }

    };


    const razorpay = new Razorpay(options);


    razorpay.on(
      "payment.failed",
      function (response) {

        console.error(
          "Razorpay Payment Failed:",
          response
        );

        paymentInProgress = false;

        setPaymentButtonLoading(false);

        showToast(
          response.error?.description ||
          "Payment failed. Please try again."
        );

      }
    );


    razorpay.open();


  } catch (error) {

    console.error("Payment Error:", error);

    paymentInProgress = false;

    setPaymentButtonLoading(false);

    showToast(
      error.message ||
      "Unable to start payment."
    );

  }

}


/* =========================================
   CREATE PAYMENT ORDER
========================================= */

/*
   CHANGE THIS URL to your actual backend API.

   Example:

   https://yourdomain.com/api/create-order
*/

async function createPaymentOrder() {

  const response = await fetch(
    "/api/create-order",
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({

        amount: PAYMENT_AMOUNT,

        currency: "INR",

        userId: currentUser.id,

        name: currentUser.name,

        email: currentUser.email

      })

    }
  );


  if (!response.ok) {

    throw new Error(
      "Server could not create payment order."
    );

  }


  return await response.json();

}


/* =========================================
   VERIFY PAYMENT
========================================= */

/*
   Payment verification MUST happen on your backend.

   The frontend sends Razorpay's response to backend.

   Backend should verify:

   - razorpay_order_id
   - razorpay_payment_id
   - razorpay_signature

   Backend should return:

   {
      "success": true
   }
*/

async function verifyPayment(paymentResponse) {

  try {

    showLoading("Verifying your payment...");


    const response = await fetch(
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

          userId:
            currentUser.id,

          name:
            currentUser.name,

          email:
            currentUser.email

        })

      }
    );


    if (!response.ok) {

      throw new Error(
        "Payment verification failed."
      );

    }


    const result = await response.json();


    hideLoading();


    if (result.success === true) {

      paymentInProgress = false;

      setPaymentButtonLoading(false);

      saveLocalPaymentInfo(paymentResponse);

      showSuccessPage();

    } else {

      throw new Error(
        "Payment could not be verified."
      );

    }


  } catch (error) {

    console.error(
      "Verification Error:",
      error
    );

    hideLoading();

    paymentInProgress = false;

    setPaymentButtonLoading(false);

    showToast(
      "Payment verification failed. Please contact support."
    );

  }

}


/* =========================================
   SUCCESS PAGE
========================================= */

function showSuccessPage() {

  showPage("successPage");

}


/* =========================================
   SAVE LOCAL PAYMENT INFO
========================================= */

function saveLocalPaymentInfo(paymentResponse) {

  const paymentData = {

    paymentId:
      paymentResponse.razorpay_payment_id || "",

    orderId:
      paymentResponse.razorpay_order_id || "",

    status:
      "success",

    amount:
      PAYMENT_AMOUNT,

    date:
      new Date().toISOString()

  };


  sessionStorage.setItem(
    "setufin_payment",
    JSON.stringify(paymentData)
  );

}


/* =========================================
   BUTTON LOADING
========================================= */

function setPaymentButtonLoading(isLoading) {

  if (!payButton) {
    return;
  }


  payButton.disabled = isLoading;


  if (isLoading) {

    payButtonText.textContent =
      "Processing...";

    payButton.querySelector("i").className =
      "fa-solid fa-spinner fa-spin";

  } else {

    payButtonText.textContent =
      "Pay ₹45 & Continue";

    payButton.querySelector("i").className =
      "fa-solid fa-arrow-right";

  }

}


/* =========================================
   LOADING OVERLAY
========================================= */

function showLoading(message) {

  if (!loadingOverlay) {
    return;
  }

  loadingText.textContent =
    message || "Please wait...";

  loadingOverlay.classList.remove("hidden");

}


function hideLoading() {

  if (!loadingOverlay) {
    return;
  }

  loadingOverlay.classList.add("hidden");

}


/* =========================================
   TOAST
========================================= */

let toastTimer;


function showToast(message) {

  if (!toast || !toastMessage) {
    return;
  }


  toastMessage.textContent =
    message;


  toast.classList.remove("hidden");


  clearTimeout(toastTimer);


  toastTimer = setTimeout(() => {

    toast.classList.add("hidden");

  }, 3500);

}


/* =========================================
   TERMS
========================================= */

function openTerms(event) {

  if (event) {
    event.preventDefault();
  }

  const modal =
    document.getElementById("termsModal");

  if (modal) {
    modal.classList.remove("hidden");
  }

}


/* =========================================
   PRIVACY
========================================= */

function openPrivacy(event) {

  if (event) {
    event.preventDefault();
  }

  const modal =
    document.getElementById("privacyModal");

  if (modal) {
    modal.classList.remove("hidden");
  }

}


/* =========================================
   CLOSE MODAL
========================================= */

function closeModal(id) {

  const modal =
    document.getElementById(id);

  if (modal) {
    modal.classList.add("hidden");
  }

}


/* =========================================
   RESTORE SESSION
========================================= */

function restoreSession() {

  try {

    const savedUser =
      sessionStorage.getItem("setufin_user");

    if (savedUser) {

      currentUser =
        JSON.parse(savedUser);

      showPaymentPage();

      return true;

    }

  } catch (error) {

    console.error(
      "Session restore error:",
      error
    );

  }

  return false;

}


/* =========================================
   CLOSE MODAL WHEN CLICKING OUTSIDE
========================================= */

document.addEventListener(
  "click",
  function (event) {

    if (
      event.target.classList.contains("modal")
    ) {

      event.target.classList.add("hidden");

    }

  }
);
