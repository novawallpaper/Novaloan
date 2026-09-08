/* =========================================================
   DATING APP - COMPLETE SCRIPT
   Google Login + Age Verification + Profile Questions
   + Razorpay Payment Link
   ========================================================= */


/* =========================================================
   CONFIG
   ========================================================= */

const GOOGLE_CLIENT_ID =
  "452456583028-1l86bibq60ggkl3o1h5j88sed7v04eof.apps.googleusercontent.com";

const RAZORPAY_PAYMENT_LINK =
  "https://rzp.io/rzp/EDfHHkBO";

const PROFILE_PRICE = 45;


/* =========================================================
   APP STATE
   ========================================================= */

let currentUser = null;

let currentQuestion = 0;

let profileAnswers = {};

let ageVerified = false;

let googleInitialized = false;

let googleInitializing = false;


/* =========================================================
   QUESTIONS
   ========================================================= */

const profileQuestions = [
  {
    id: "name",
    title: "What's your name?",
    subtitle: "Tell us what you'd like people to call you.",
    type: "text",
    placeholder: "Enter your name"
  },

  {
    id: "gender",
    title: "What's your gender?",
    subtitle: "Choose the option that best describes you.",
    type: "options",
    options: [
      "Male",
      "Female"
    ]
  },

  {
    id: "lookingFor",
    title: "Who are you looking for?",
    subtitle: "Choose who you'd like to meet.",
    type: "options",
    options: [
      "Male",
      "Female"
    ]
  },

  {
    id: "city",
    title: "Where are you from?",
    subtitle: "Your city helps us show relevant profiles.",
    type: "text",
    placeholder: "Enter your city"
  },

  {
    id: "bio",
    title: "Tell us about yourself",
    subtitle: "Write something interesting about you.",
    type: "textarea",
    placeholder: "A little about me..."
  }
];


/* =========================================================
   DOM HELPERS
   ========================================================= */

function getElement(...ids) {
  for (const id of ids) {
    const element = document.getElementById(id);

    if (element) {
      return element;
    }
  }

  return null;
}


function showToast(message, type = "normal") {
  const toast = getElement("toast");

  if (!toast) {
    console.log(message);
    return;
  }

  toast.textContent = message;

  toast.className = "toast";

  if (type === "success") {
    toast.classList.add("success");
  }

  if (type === "error") {
    toast.classList.add("error");
  }

  toast.classList.add("show");

  clearTimeout(window.__toastTimer);

  window.__toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}


/* =========================================================
   SCREEN MANAGEMENT
   ========================================================= */

function showScreen(screenId) {
  const screens = document.querySelectorAll(".screen-content");

  screens.forEach(screen => {
    screen.classList.remove("active");
  });

  const target = document.getElementById(screenId);

  if (target) {
    target.classList.add("active");
  }
}


/* =========================================================
   GOOGLE LOGIN
   ========================================================= */

/*
   Google library is loaded asynchronously.

   We therefore don't immediately assume that
   window.google exists.
*/

function initializeGoogleLogin() {

  if (googleInitialized || googleInitializing) {
    return;
  }

  googleInitializing = true;

  const setupGoogle = () => {

    if (
      !window.google ||
      !window.google.accounts ||
      !window.google.accounts.id
    ) {
      console.error("Google Identity Services is not available.");

      googleInitializing = false;

      const container = getElement(
        "google-signin",
        "google-signin-btn"
      );

      if (container) {
        container.innerHTML = `
          <div style="
            padding:14px;
            border:1px solid #e5e7eb;
            border-radius:12px;
            background:#fff;
            color:#666;
            font-size:14px;
            text-align:center;
          ">
            Google Login is loading...<br>
            <small>Please refresh the page.</small>
          </div>
        `;
      }

      return;
    }


    const googleButton = getElement(
      "google-signin",
      "google-signin-btn"
    );


    if (!googleButton) {

      console.error(
        "Google button container not found. Expected #google-signin"
      );

      googleInitializing = false;

      return;
    }


    try {

      /*
         Google initialize should normally be called once.
      */

      google.accounts.id.initialize({

        client_id: GOOGLE_CLIENT_ID,

        callback: handleGoogleCredential,

        auto_select: false,

        cancel_on_tap_outside: true

      });


      /*
         Clear old button if any.
      */

      googleButton.innerHTML = "";


      /*
         Render REAL Google button.
      */

      google.accounts.id.renderButton(

        googleButton,

        {
          type: "standard",

          theme: "outline",

          size: "large",

          text: "signin_with",

          shape: "rectangular",

          logo_alignment: "left",

          width: 360

        }

      );


      googleInitialized = true;

      googleInitializing = false;

      console.log(
        "Google Sign-In initialized successfully."
      );

    } catch (error) {

      googleInitializing = false;

      console.error(
        "Google initialization error:",
        error
      );

      showToast(
        "Google Login initialize nahi ho paya.",
        "error"
      );
    }
  };


  /*
     If Google library already loaded.
  */

  if (
    window.google &&
    window.google.accounts &&
    window.google.accounts.id
  ) {

    setupGoogle();

  } else {

    /*
       Google officially provides this callback
       when the library finishes loading.
    */

    window.onGoogleLibraryLoad = setupGoogle;

    /*
       Extra fallback.
    */

    let attempts = 0;

    const checkGoogle = setInterval(() => {

      attempts++;

      if (
        window.google &&
        window.google.accounts &&
        window.google.accounts.id
      ) {

        clearInterval(checkGoogle);

        setupGoogle();

      }

      if (attempts >= 50) {

        clearInterval(checkGoogle);

        if (!googleInitialized) {

          console.error(
            "Google library failed to load."
          );

          googleInitializing = false;
        }

      }

    }, 200);
  }
}


/* =========================================================
   GOOGLE CREDENTIAL HANDLER
   ========================================================= */

function handleGoogleCredential(response) {

  try {

    if (
      !response ||
      !response.credential
    ) {

      showToast(
        "Google login failed. Please try again.",
        "error"
      );

      return;
    }


    const user = parseJwt(
      response.credential
    );


    if (
      !user ||
      !user.email
    ) {

      showToast(
        "Google account information read nahi ho saki.",
        "error"
      );

      return;
    }


    currentUser = {

      id: user.sub,

      email: user.email,

      name: user.name || "User",

      picture: user.picture || "",

      givenName:
        user.given_name || "",

      familyName:
        user.family_name || ""

    };


    /*
       Save Google user locally.
    */

    localStorage.setItem(
      "dating_google_user",
      JSON.stringify(currentUser)
    );


    showToast(
      "Google login successful!",
      "success"
    );


    setTimeout(() => {

      startProfileFlow();

    }, 400);


  } catch (error) {

    console.error(
      "Google credential error:",
      error
    );

    showToast(
      "Google login failed.",
      "error"
    );
  }
}


/* =========================================================
   JWT PARSER
   ========================================================= */

function parseJwt(token) {

  try {

    const parts = token.split(".");

    if (parts.length !== 3) {
      return null;
    }


    const base64Url = parts[1];

    const base64 = base64Url
      .replace(/-/g, "+")
      .replace(/_/g, "/");


    const padded =
      base64 +
      "=".repeat(
        (4 - (base64.length % 4)) % 4
      );


    const binary = atob(padded);


    const bytes = new Uint8Array(
      binary.length
    );


    for (
      let i = 0;
      i < binary.length;
      i++
    ) {

      bytes[i] = binary.charCodeAt(i);

    }


    const decoder =
      new TextDecoder("utf-8");


    const jsonPayload =
      decoder.decode(bytes);


    return JSON.parse(jsonPayload);

  } catch (error) {

    console.error(
      "JWT parse error:",
      error
    );

    return null;
  }
}


/* =========================================================
   START PROFILE FLOW
   ========================================================= */

function startProfileFlow() {

  if (!currentUser) {

    loadSavedProfile();

  }


  if (!currentUser) {

    showScreen("login-gate");

    return;
  }


  const savedProfile =
    getSavedProfile();


  /*
     Existing profile.
  */

  if (
    savedProfile &&
    savedProfile.email === currentUser.email
  ) {

    profileAnswers =
      savedProfile.answers || {};

    ageVerified =
      savedProfile.ageVerified === true;


    if (
      savedProfile.paymentVerified === true ||
      savedProfile.paymentStatus === "paid"
    ) {

      showDatingHome();

      return;
    }
  }


  /*
     New profile.
  */

  showScreen("age-screen");
}


/* =========================================================
   AGE VERIFICATION
   ========================================================= */

function verifyAge() {

  const dobInput = getElement(
    "dob",
    "date-of-birth",
    "birth-date"
  );


  if (!dobInput) {

    showToast(
      "Date of birth field nahi mila.",
      "error"
    );

    return;
  }


  const dob = new Date(
    dobInput.value
  );


  if (
    !dobInput.value ||
    isNaN(dob.getTime())
  ) {

    showToast(
      "Please apni date of birth select karo.",
      "error"
    );

    return;
  }


  const today = new Date();


  let age =
    today.getFullYear() -
    dob.getFullYear();


  const monthDifference =
    today.getMonth() -
    dob.getMonth();


  if (
    monthDifference < 0 ||
    (
      monthDifference === 0 &&
      today.getDate() < dob.getDate()
    )
  ) {

    age--;

  }


  if (age < 18) {

    showToast(
      "Dating app use karne ke liye 18+ hona zaroori hai.",
      "error"
    );

    return;
  }


  ageVerified = true;


  profileAnswers.dob =
    dobInput.value;


  showToast(
    "Age verified.",
    "success"
  );


  setTimeout(() => {

    currentQuestion = 0;

    renderQuestion();

    showScreen("questions-screen");

  }, 500);
}


/* =========================================================
   QUESTIONS
   ========================================================= */

function renderQuestion() {

  const question =
    profileQuestions[currentQuestion];


  if (!question) {

    showPaymentScreen();

    return;
  }


  const titleElement =
    getElement(
      "question-title",
      "question-text",
      "question-heading"
    );


  const subtitleElement =
    getElement(
      "question-subtitle",
      "question-description"
    );


  const container =
    getElement(
      "question-container",
      "question-content",
      "options-container"
    );


  const numberElement =
    getElement(
      "question-number",
      "question-count"
    );


  const progress =
    getElement(
      "progress-fill",
      "question-progress"
    );


  const nextButton =
    getElement(
      "next-btn",
      "question-next-btn"
    );


  if (titleElement) {

    titleElement.textContent =
      question.title;
  }


  if (subtitleElement) {

    subtitleElement.textContent =
      question.subtitle || "";
  }


  if (numberElement) {

    numberElement.textContent =
      `${currentQuestion + 1} / ${profileQuestions.length}`;
  }


  if (progress) {

    const percentage =
      (
        (currentQuestion + 1) /
        profileQuestions.length
      ) * 100;


    progress.style.width =
      `${percentage}%`;
  }


  if (!container) {

    console.error(
      "Question container not found."
    );

    return;
  }


  container.innerHTML = "";


  /*
     TEXT INPUT
  */

  if (question.type === "text") {

    const input =
      document.createElement("input");


    input.type = "text";

    input.className =
      "profile-input";

    input.placeholder =
      question.placeholder || "";

    input.value =
      profileAnswers[question.id] || "";


    input.autocomplete =
      "off";


    input.addEventListener(
      "input",
      () => {

        profileAnswers[question.id] =
          input.value.trim();

      }
    );


    container.appendChild(input);


    setTimeout(() => {

      input.focus();

    }, 100);
  }


  /*
     TEXTAREA
  */

  else if (
    question.type === "textarea"
  ) {

    const textarea =
      document.createElement("textarea");


    textarea.className =
      "profile-textarea";

    textarea.placeholder =
      question.placeholder || "";

    textarea.rows = 5;

    textarea.value =
      profileAnswers[question.id] || "";


    textarea.addEventListener(
      "input",
      () => {

        profileAnswers[question.id] =
          textarea.value.trim();

      }
    );


    container.appendChild(
      textarea
    );


    setTimeout(() => {

      textarea.focus();

    }, 100);
  }


  /*
     OPTIONS
  */

  else if (
    question.type === "options"
  ) {

    const optionsWrapper =
      document.createElement("div");


    optionsWrapper.className =
      "profile-options";


    question.options.forEach(
      option => {

        const button =
          document.createElement("button");


        button.type =
          "button";


        button.className =
          "profile-option";


        button.textContent =
          option;


        if (
          profileAnswers[
            question.id
          ] === option
        ) {

          button.classList.add(
            "selected"
          );
        }


        button.addEventListener(
          "click",
          () => {

            selectOption(
              question.id,
              option
            );

            renderQuestion();

          }
        );


        optionsWrapper.appendChild(
          button
        );

      }
    );


    container.appendChild(
      optionsWrapper
    );
  }


  /*
     Update next button state.
  */

  if (nextButton) {

    nextButton.disabled =
      !hasCurrentAnswer();
  }
}


/* =========================================================
   OPTION SELECTION
   ========================================================= */

function selectOption(
  questionId,
  value
) {

  profileAnswers[
    questionId
  ] = value;


  showToast(
    "Selected",
    "success"
  );
}


/* =========================================================
   NEXT QUESTION
   ========================================================= */

function nextQuestion() {

  const question =
    profileQuestions[currentQuestion];


  if (!question) {
    return;
  }


  /*
     Save current input.
  */

  const container =
    getElement(
      "question-container",
      "question-content",
      "options-container"
    );


  if (container) {

    const input =
      container.querySelector(
        "input, textarea"
      );


    if (input) {

      profileAnswers[
        question.id
      ] =
        input.value.trim();

    }
  }


  if (!hasCurrentAnswer()) {

    showToast(
      "Please answer this question.",
      "error"
    );

    return;
  }


  currentQuestion++;


  if (
    currentQuestion >=
    profileQuestions.length
  ) {

    showPaymentScreen();

    return;
  }


  renderQuestion();
}


/* =========================================================
   CURRENT ANSWER VALIDATION
   ========================================================= */

function hasCurrentAnswer() {

  const question =
    profileQuestions[currentQuestion];


  if (!question) {
    return true;
  }


  const answer =
    profileAnswers[
      question.id
    ];


  return Boolean(
    answer &&
    String(answer).trim()
  );
}


/* =========================================================
   PAYMENT SCREEN
   ========================================================= */

function showPaymentScreen() {

  showScreen(
    "payment-screen"
  );


  const priceElement =
    getElement(
      "payment-price",
      "price"
    );


  if (priceElement) {

    priceElement.textContent =
      `₹${PROFILE_PRICE}`;
  }
}


/* =========================================================
   RAZORPAY PAYMENT LINK
   ========================================================= */

/*
   This uses Razorpay Payment Link.

   No Razorpay checkout key is required here.

   IMPORTANT:
   Frontend-only site cannot securely verify payment.
*/

function startPayment() {

  if (!currentUser) {

    showToast(
      "Please login first.",
      "error"
    );

    showScreen("login-gate");

    return;
  }


  if (!ageVerified) {

    showToast(
      "Age verification required.",
      "error"
    );

    showScreen("age-screen");

    return;
  }


  /*
     Save profile draft before leaving site.
  */

  const draftProfile = {

    email:
      currentUser.email,

    name:
      currentUser.name,

    picture:
      currentUser.picture,

    answers:
      profileAnswers,

    ageVerified:
      ageVerified,

    paymentStarted:
      true,

    paymentStatus:
      "pending",

    paymentAmount:
      PROFILE_PRICE,

    updatedAt:
      new Date().toISOString()

  };


  localStorage.setItem(
    "dating_profile_draft",
    JSON.stringify(
      draftProfile
    )
  );


  localStorage.setItem(
    "dating_payment_started",
    "true"
  );


  showToast(
    "Payment page opening...",
    "success"
  );


  /*
     Open Razorpay Payment Link.
  */

  setTimeout(() => {

    window.location.href =
      RAZORPAY_PAYMENT_LINK;

  }, 500);
}


/* =========================================================
   COMPLETE LOCAL PROFILE
   ========================================================= */

/*
   This function can be used after payment return.

   Since this is frontend-only, this is NOT secure
   payment verification.
*/

function createDatingProfile(
  paymentData = {}
) {

  if (!currentUser) {

    showToast(
      "Please login first.",
      "error"
    );

    return;
  }


  const profile = {

    id:
      currentUser.id,

    email:
      currentUser.email,

    name:
      profileAnswers.name ||
      currentUser.name ||
      "User",

    picture:
      currentUser.picture ||
      "",

    answers:
      {
        ...profileAnswers
      },

    ageVerified:
      ageVerified,

    paymentVerified:
      paymentData.verified === true,

    paymentStatus:
      paymentData.status ||
      "pending",

    paymentId:
      paymentData.paymentId ||
      "",

    paymentAmount:
      PROFILE_PRICE,

    createdAt:
      new Date().toISOString(),

    updatedAt:
      new Date().toISOString()

  };


  localStorage.setItem(
    "dating_profile",
    JSON.stringify(profile)
  );


  localStorage.removeItem(
    "dating_profile_draft"
  );


  showScreen(
    "profile-created-screen"
  );


  showToast(
    "Profile saved successfully!",
    "success"
  );
}


/* =========================================================
   LOAD SAVED PROFILE
   ========================================================= */

function getSavedProfile() {

  try {

    const data =
      localStorage.getItem(
        "dating_profile"
      );


    if (!data) {
      return null;
    }


    return JSON.parse(data);

  } catch (error) {

    console.error(
      "Profile read error:",
      error
    );

    return null;
  }
}


function loadSavedProfile() {

  try {

    const googleUser =
      localStorage.getItem(
        "dating_google_user"
      );


    if (googleUser) {

      currentUser =
        JSON.parse(
          googleUser
        );

    }


    const savedProfile =
      getSavedProfile();


    if (
      savedProfile &&
      savedProfile.answers
    ) {

      profileAnswers =
        savedProfile.answers;

    }


    if (
      savedProfile &&
      savedProfile.ageVerified
    ) {

      ageVerified =
        true;

    }

  } catch (error) {

    console.error(
      "Saved profile loading error:",
      error
    );

  }
}


/* =========================================================
   DATING HOME
   ========================================================= */

function openDatingHome() {

  showDatingHome();
}


function showDatingHome() {

  showScreen(
    "dating-home"
  );


  renderDatingProfiles();
}


/* =========================================================
   RENDER DATING PROFILE
   ========================================================= */

function renderDatingProfiles() {

  const container =
    getElement(
      "dating-profiles",
      "profiles-container",
      "profile-list"
    );


  if (!container) {
    return;
  }


  const profile =
    getSavedProfile();


  if (!profile) {

    container.innerHTML = `
      <div class="empty-state">
        <h3>No profile yet</h3>
        <p>Create your profile to get started.</p>
      </div>
    `;

    return;
  }


  const answers =
    profile.answers || {};


  const name =
    answers.name ||
    profile.name ||
    "User";


  const city =
    answers.city ||
    "India";


  const gender =
    answers.gender ||
    "";


  const bio =
    answers.bio ||
    "New here. Looking to meet someone interesting.";


  const picture =
    profile.picture ||
    "https://www.gravatar.com/avatar/?d=mp";


  container.innerHTML = `

    <div class="dating-profile-card">

      <div class="dating-profile-image">

        <img
          src="${escapeHtml(picture)}"
          alt="${escapeHtml(name)}"
        >

      </div>

      <div class="dating-profile-info">

        <h3>
          ${escapeHtml(name)}
        </h3>

        <p class="profile-city">
          <i class="fa-solid fa-location-dot"></i>
          ${escapeHtml(city)}
        </p>

        ${
          gender
            ? `<span class="profile-gender">
                ${escapeHtml(gender)}
              </span>`
            : ""
        }

        <p class="profile-bio">
          ${escapeHtml(bio)}
        </p>

      </div>

    </div>

  `;
}


/* =========================================================
   MY PROFILE
   ========================================================= */

function showMyProfile() {

  showScreen(
    "my-profile-screen"
  );


  const profile =
    getSavedProfile();


  if (!profile) {
    return;
  }


  const answers =
    profile.answers || {};


  const nameElement =
    getElement(
      "my-profile-name",
      "profile-name"
    );


  const cityElement =
    getElement(
      "my-profile-city",
      "profile-city"
    );


  const bioElement =
    getElement(
      "my-profile-bio",
      "profile-bio"
    );


  const imageElement =
    getElement(
      "my-profile-image",
      "profile-image"
    );


  if (nameElement) {

    nameElement.textContent =
      answers.name ||
      profile.name ||
      "User";

  }


  if (cityElement) {

    cityElement.textContent =
      answers.city ||
      "";

  }


  if (bioElement) {

    bioElement.textContent =
      answers.bio ||
      "";

  }


  if (imageElement) {

    imageElement.src =
      profile.picture ||
      "https://www.gravatar.com/avatar/?d=mp";

  }
}


/* =========================================================
   LOGOUT
   ========================================================= */

function logout() {

  currentUser = null;

  profileAnswers = {};

  ageVerified = false;

  currentQuestion = 0;


  localStorage.removeItem(
    "dating_google_user"
  );


  localStorage.removeItem(
    "dating_profile"
  );


  localStorage.removeItem(
    "dating_profile_draft"
  );


  localStorage.removeItem(
    "dating_payment_started"
  );


  /*
     Tell Google that the user is signed out.
  */

  try {

    if (
      window.google &&
      google.accounts &&
      google.accounts.id
    ) {

      google.accounts.id.disableAutoSelect();

    }

  } catch (error) {

    console.log(
      "Google logout cleanup:",
      error
    );
  }


  showToast(
    "Logged out successfully.",
    "success"
  );


  setTimeout(() => {

    showScreen(
      "login-gate"
    );

  }, 500);
}


/* =========================================================
   HTML ESCAPE
   ========================================================= */

function escapeHtml(value) {

  if (
    value === null ||
    value === undefined
  ) {

    return "";

  }


  return String(value)

    .replace(
      /&/g,
      "&amp;"
    )

    .replace(
      /</g,
      "&lt;"
    )

    .replace(
      />/g,
      "&gt;"
    )

    .replace(
      /"/g,
      "&quot;"
    )

    .replace(
      /'/g,
      "&#039;"
    );
}


/* =========================================================
   PAYMENT RETURN HANDLER
   ========================================================= */

/*
   If Razorpay Payment Link is configured with a callback URL,
   Razorpay can return the customer to your GitHub Pages site.

   This detects common callback parameters.

   NOTE:
   This does NOT cryptographically verify payment.
*/

function handlePaymentReturn() {

  const params =
    new URLSearchParams(
      window.location.search
    );


  const paymentId =
    params.get(
      "razorpay_payment_id"
    );


  const paymentLinkId =
    params.get(
      "razorpay_payment_link_id"
    );


  const paymentStatus =
    params.get(
      "razorpay_payment_link_status"
    );


  if (
    paymentId ||
    paymentLinkId ||
    paymentStatus
  ) {

    const savedUser =
      localStorage.getItem(
        "dating_google_user"
      );


    if (savedUser) {

      try {

        currentUser =
          JSON.parse(
            savedUser
          );

      } catch (error) {

        console.error(error);

      }
    }


    if (currentUser) {

      /*
         Local completion only.
      */

      createDatingProfile({

        verified:
          false,

        status:
          paymentStatus ||
          "payment-returned",

        paymentId:
          paymentId ||
          paymentLinkId ||
          ""

      });

    }


    /*
       Remove query parameters.
    */

    try {

      window.history.replaceState(
        {},
        document.title,
        window.location.pathname
      );

    } catch (error) {

      console.log(error);

    }
  }
}


/* =========================================================
   FALLBACK GOOGLE CLICK
   ========================================================= */

function handleFallbackGoogleClick() {

  /*
     If a manually created fallback button exists,
     try to trigger Google's One Tap.

     The actual rendered Google button remains the
     primary login method.
  */

  try {

    if (
      window.google &&
     
