/* =========================================================
   VIVRA DATING APP
   Frontend Version
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

let paymentStarted = false;

let paymentCompletedFlag = false;


/* =========================================================
   QUESTIONS
========================================================= */

const questions = [

  {
    id: "name",
    title: "What's your name?",
    subtitle: "This is how other people will see you.",
    type: "text",
    placeholder: "Enter your first name"
  },

  {
    id: "gender",
    title: "How do you identify?",
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
    subtitle: "Tell us who you'd like to meet.",
    type: "options",
    options: [
      "Male",
      "Female"
    ]
  },

  {
    id: "city",
    title: "Where do you live?",
    subtitle: "Your city helps us show relevant people.",
    type: "text",
    placeholder: "Enter your city"
  },

  {
    id: "bio",
    title: "Tell us about yourself.",
    subtitle: "A short introduction makes your profile feel more personal.",
    type: "textarea",
    placeholder: "Write something about yourself..."
  }
];


/* =========================================================
   DOM HELPERS
========================================================= */

function get(id) {
  return document.getElementById(id);
}


/* =========================================================
   SCREEN MANAGEMENT
========================================================= */

function showScreen(id) {

  document.querySelectorAll(".screen-content").forEach(screen => {
    screen.classList.remove("active");
  });

  const target = get(id);

  if (target) {
    target.classList.add("active");
  }

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}


/* =========================================================
   TOAST
========================================================= */

let toastTimer = null;

function showToast(message) {

  const toast = get("toast");
  const text = get("toast-message");

  if (!toast || !text) return;

  text.textContent = message;

  toast.classList.add("show");

  clearTimeout(toastTimer);

  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2800);
}


/* =========================================================
   GOOGLE LOGIN
========================================================= */

function initializeGoogleLogin() {

  const setup = () => {

    if (
      !window.google ||
      !window.google.accounts ||
      !window.google.accounts.id
    ) {
      return false;
    }

    const container = get("google-signin");

    if (!container) {
      return false;
    }


    /* Prevent duplicate rendering */

    if (container.dataset.initialized === "true") {
      return true;
    }


    try {

      window.google.accounts.id.initialize({

        client_id: GOOGLE_CLIENT_ID,

        callback: handleGoogleCredential,

        auto_select: false,

        cancel_on_tap_outside: true

      });


      container.innerHTML = "";


      window.google.accounts.id.renderButton(
        container,
        {
          type: "standard",
          theme: "outline",
          size: "large",
          text: "signin_with",
          shape: "rectangular",
          logo_alignment: "left",
          width: Math.min(
            400,
            Math.max(
              280,
              container.clientWidth || 360
            )
          )
        }
      );


      container.dataset.initialized = "true";

      return true;

    } catch (error) {

      console.error(
        "Google initialization error:",
        error
      );

      showToast(
        "Google login could not be loaded."
      );

      return false;
    }
  };


  if (setup()) {
    return;
  }


  /* Google script may still be loading */

  window.onGoogleLibraryLoad = setup;


  let attempts = 0;

  const interval = setInterval(() => {

    attempts++;

    if (setup() || attempts > 40) {
      clearInterval(interval);
    }

  }, 250);
}


/* =========================================================
   GOOGLE CALLBACK
========================================================= */

function handleGoogleCredential(response) {

  if (
    !response ||
    !response.credential
  ) {

    showToast(
      "Google login failed. Please try again."
    );

    return;
  }


  try {

    const user = parseJwt(
      response.credential
    );


    if (!user || !user.sub) {
      throw new Error(
        "Invalid Google credential."
      );
    }


    currentUser = {

      id: user.sub,

      email: user.email || "",

      name:
        user.name ||
        user.given_name ||
        "User",

      picture:
        user.picture ||
        ""

    };


    localStorage.setItem(
      "dating_google_user",
      JSON.stringify(currentUser)
    );


    showToast(
      `Welcome, ${currentUser.name}`
    );


    startProfileFlow();

  } catch (error) {

    console.error(
      "Google credential error:",
      error
    );

    showToast(
      "Unable to sign in with Google."
    );
  }
}


/* =========================================================
   JWT PARSER
========================================================= */

function parseJwt(token) {

  const parts = token.split(".");

  if (parts.length !== 3) {
    throw new Error("Invalid JWT");
  }


  const base64Url = parts[1];

  const base64 = base64Url
    .replace(/-/g, "+")
    .replace(/_/g, "/");


  const jsonPayload = decodeURIComponent(

    atob(base64)
      .split("")
      .map(
        char =>
          "%" +
          (
            "00" +
            char.charCodeAt(0).toString(16)
          ).slice(-2)
      )
      .join("")

  );


  return JSON.parse(jsonPayload);
}


/* =========================================================
   START PROFILE FLOW
========================================================= */

function startProfileFlow() {

  const savedProfile =
    getSavedProfile();


  if (
    savedProfile &&
    currentUser &&
    savedProfile.email === currentUser.email &&
    savedProfile.paymentVerified === true
  ) {

    profileAnswers =
      savedProfile.answers || {};

    showDatingHome();

    return;
  }


  ageVerified = false;

  currentQuestion = 0;

  profileAnswers = {};


  showScreen("age-screen");
}


/* =========================================================
   AGE VERIFICATION
========================================================= */

function verifyAge() {

  const dobInput = get("dob");

  if (!dobInput) return;


  const dob = dobInput.value;

  if (!dob) {

    showToast(
      "Please select your date of birth."
    );

    return;
  }


  const birthDate =
    new Date(dob + "T00:00:00");


  if (Number.isNaN(
    birthDate.getTime()
  )) {

    showToast(
      "Please enter a valid date."
    );

    return;
  }


  const today = new Date();


  let age =
    today.getFullYear() -
    birthDate.getFullYear();


  const monthDifference =
    today.getMonth() -
    birthDate.getMonth();


  if (
    monthDifference < 0 ||
    (
      monthDifference === 0 &&
      today.getDate() < birthDate.getDate()
    )
  ) {
    age--;
  }


  if (age < 18) {

    showToast(
      "You must be 18 or older to use Vivra."
    );

    return;
  }


  ageVerified = true;


  currentQuestion = 0;

  profileAnswers = {};


  renderQuestion();

  showScreen("questions-screen");
}


/* =========================================================
   RENDER QUESTION
========================================================= */

function renderQuestion() {

  const question =
    questions[currentQuestion];


  if (!question) {
    showPaymentScreen();
    return;
  }


  const questionNumber =
    get("question-number");

  const title =
    get("question-title");

  const subtitle =
    get("question-subtitle");

  const container =
    get("question-container");

  const nextButton =
    get("next-btn");

  const progress =
    get("progress-fill");


  if (
    !questionNumber ||
    !title ||
    !subtitle ||
    !container
  ) {
    return;
  }


  const totalSteps =
    questions.length + 1;


  const step =
    currentQuestion + 2;


  questionNumber.textContent =
    `STEP ${String(step).padStart(2, "0")} / ${String(totalSteps).padStart(2, "0")}`;


  title.textContent =
    question.title;


  subtitle.textContent =
    question.subtitle;


  container.innerHTML = "";


  /* =====================================================
     TEXT INPUT
  ====================================================== */

  if (
    question.type === "text"
  ) {

    const input =
      document.createElement("input");


    input.type = "text";

    input.className =
      "question-input";

    input.placeholder =
      question.placeholder || "";

    input.autocomplete =
      "off";

    input.value =
      profileAnswers[question.id] || "";


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


  /* =====================================================
     TEXTAREA
  ====================================================== */

  else if (
    question.type === "textarea"
  ) {

    const textarea =
      document.createElement("textarea");


    textarea.className =
      "question-input";


    textarea.placeholder =
      question.placeholder || "";


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


  /* =====================================================
     OPTIONS
  ====================================================== */

  else if (
    question.type === "options"
  ) {

    const grid =
      document.createElement("div");


    grid.className =
      "option-grid";


    question.options.forEach(option => {

      const button =
        document.createElement("button");


      button.type = "button";

      button.className =
        "option-btn";


      button.textContent =
        option;


      if (
        profileAnswers[question.id] === option
      ) {
        button.classList.add(
          "selected"
        );
      }


      button.addEventListener(
        "click",
        () => {

          profileAnswers[question.id] =
            option;


          grid
            .querySelectorAll(
              ".option-btn"
            )
            .forEach(btn => {
              btn.classList.remove(
                "selected"
              );
            });


          button.classList.add(
            "selected"
          );

        }
      );


      grid.appendChild(button);

    });


    container.appendChild(grid);
  }


  if (nextButton) {

    nextButton.innerHTML =
      currentQuestion === questions.length - 1
        ? `Continue <i class="fa-solid fa-arrow-right"></i>`
        : `Continue <i class="fa-solid fa-arrow-right"></i>`;

  }


  if (progress) {

    const percent =
      (
        (currentQuestion + 2) /
        totalSteps
      ) * 100;


    progress.style.width =
      `${Math.min(100, percent)}%`;
  }
}


/* =========================================================
   NEXT QUESTION
========================================================= */

function nextQuestion() {

  const question =
    questions[currentQuestion];


  if (!question) {
    showPaymentScreen();
    return;
  }


  const answer =
    profileAnswers[question.id];


  if (
    !answer ||
    String(answer).trim() === ""
  ) {

    showToast(
      "Please complete this step."
    );

    return;
  }


  currentQuestion++;


  if (
    currentQuestion >= questions.length
  ) {

    showPaymentScreen();

    return;
  }


  renderQuestion();
}


/* =========================================================
   PREVIOUS QUESTION
========================================================= */

function previousQuestion() {

  if (
    get("questions-screen")?.classList.contains("active")
  ) {

    if (currentQuestion > 0) {

      currentQuestion--;

      renderQuestion();

      return;
    }


    showScreen("age-screen");

    return;
  }


  if (
    get("payment-screen")?.classList.contains("active")
  ) {

    currentQuestion =
      questions.length - 1;

    renderQuestion();

    showScreen("questions-screen");

    return;
  }


  goBackToLogin();
}


/* =========================================================
   BACK TO LOGIN
========================================================= */

function goBackToLogin() {

  showScreen("login-gate");
}


/* =========================================================
   PAYMENT SCREEN
========================================================= */

function showPaymentScreen() {

  const price =
    get("payment-price");


  if (price) {
    price.textContent =
      `₹${PROFILE_PRICE}`;
  }


  paymentStarted = false;


  showScreen("payment-screen");
}


/* =========================================================
   START RAZORPAY PAYMENT
========================================================= */

function startPayment() {

  if (!currentUser) {

    showToast(
      "Please sign in first."
    );

    showScreen("login-gate");

    return;
  }


  if (!ageVerified) {

    showToast(
      "Please complete age verification."
    );

    return;
  }


  if (
    !profileAnswers.name ||
    !profileAnswers.gender ||
    !profileAnswers.lookingFor ||
    !profileAnswers.city ||
    !profileAnswers.bio
  ) {

    showToast(
      "Please complete your profile first."
    );

    currentQuestion =
      questions.length - 1;

    renderQuestion();

    showScreen("questions-screen");

    return;
  }


  paymentStarted = true;


  saveDraftProfile();


  /*
    Existing Razorpay Payment Link.

    Payment Link is opened directly.
  */

  window.location.href =
    RAZORPAY_PAYMENT_LINK;
}


/* =========================================================
   PAYMENT COMPLETED BUTTON
========================================================= */

function paymentCompleted() {

  /*
    IMPORTANT:

    This button is only a frontend continuation
    for your current GitHub Pages version.

    It does NOT cryptographically verify a Razorpay
    payment.

    For real production payment verification,
    use Razorpay webhook/server verification.
  */


  if (!paymentStarted) {

    showToast(
      "Please complete the payment first."
    );

    return;
  }


  paymentCompletedFlag = true;


  createDatingProfile({
    verified: true
  });
}


/* =========================================================
   CREATE PROFILE
========================================================= */

function createDatingProfile(
  paymentData = {}
) {

  if (!currentUser) {

    showScreen("login-gate");

    return;
  }


  const profile = {

    id: currentUser.id,

    email: currentUser.email,

    googleName: currentUser.name,

    googlePicture: currentUser.picture,

    answers: {
      ...profileAnswers
    },

    paymentVerified:
      paymentData.verified === true,

    createdAt:
      new Date().toISOString()

  };


  localStorage.setItem(
    "dating_profile",
    JSON.stringify(profile)
  );


  showScreen(
    "profile-created-screen"
  );
}


/* =========================================================
   SAVE DRAFT
========================================================= */

function saveDraftProfile() {

  if (!currentUser) {
    return;
  }


  const draft = {

    id: currentUser.id,

    email: currentUser.email,

    googleName: currentUser.name,

    googlePicture: currentUser.picture,

    answers: {
      ...profileAnswers
    },

    paymentVerified: false,

    draft: true,

    updatedAt:
      new Date().toISOString()

  };


  localStorage.setItem(
    "dating_profile",
    JSON.stringify(draft)
  );
}


/* =========================================================
   GET SAVED PROFILE
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


/* =========================================================
   LOAD SAVED PROFILE
========================================================= */

function loadSavedProfile() {

  try {

    const user =
      localStorage.getItem(
        "dating_google_user"
      );


    if (user) {

      currentUser =
        JSON.parse(user);

    }

  } catch (error) {

    console.error(
      "Saved user error:",
      error
    );

    currentUser = null;
  }
}


/* =========================================================
   DATING HOME
========================================================= */

function showDatingHome() {

  if (!currentUser) {

    showScreen("login-gate");

    return;
  }


  const profile =
    getSavedProfile();


  if (
    !profile ||
    profile.paymentVerified !== true
  ) {

    showToast(
      "Please finish creating your profile."
    );

    startProfileFlow();

    return;
  }


  showScreen("dating-home");


  renderDatingProfiles();
}


/* =========================================================
   RENDER DISCOVERY
========================================================= */

function renderDatingProfiles() {

  const container =
    get("dating-profiles");


  if (!container) {
    return;
  }


  /*
    Frontend-only version.

    There are no real other-user profiles yet because
    those need a database/backend.

    This shows an attractive empty state instead of
    pretending fake people are real.
  */

  container.innerHTML = `

    <div class="empty-state">

      <i class="fa-solid fa-heart"></i>

      <h3>
        Your discovery starts here
      </h3>

      <p>
        Your profile is ready.
        Once other verified members join Vivra,
        you'll be able to discover people here.
      </p>

    </div>

  `;
}


/* =========================================================
   LIKE
========================================================= */

function likeProfile() {

  showToast(
    "Like feature will be available when profiles are connected."
  );
}


/* =========================================================
   PASS
========================================================= */

function passProfile() {

  showToast(
    "No profiles to pass yet."
  );
}


/* =========================================================
   SUPER LIKE
========================================================= */

function superLikeProfile() {

  showToast(
    "Super Like will be available when profiles are connected."
  );
}


/* =========================================================
   MATCHES
========================================================= */

function showMatches() {

  showToast(
    "Your matches will appear here."
  );
}


/* =========================================================
   MESSAGES
========================================================= */

function showMessages() {

  showToast(
    "Your messages will appear here."
  );
}


/* =========================================================
   MY PROFILE
========================================================= */

function showMyProfile() {

  const profile =
    getSavedProfile();


  if (!profile) {

    showToast(
      "Profile not found."
    );

    return;
  }


  const answers =
    profile.answers || {};


  const name =
    answers.name ||
    currentUser?.name ||
    "User";


  const city =
    answers.city ||
    "City not added";


  const bio =
    answers.bio ||
    "No bio added yet.";


  const lookingFor =
    answers.lookingFor ||
    "Not specified";


  const email =
    profile.email ||
    currentUser?.email ||
    "—";


  const nameElement =
    get("my-profile-name");


  const cityElement =
    get("my-profile-city");


  const bioElement =
    get("my-profile-bio");


  const lookingElement =
    get("my-profile-looking");


  const emailElement =
    get("my-profile-email");


  const avatarElement =
    get("my-profile-avatar");


  if (nameElement) {
    nameElement.textContent =
      name;
  }


  if (cityElement) {
    cityElement.textContent =
      city;
  }


  if (bioElement) {
    bioElement.textContent =
      bio;
  }


  if (lookingElement) {
    lookingElement.textContent =
      lookingFor;
  }


  if (emailElement) {
    emailElement.textContent =
      email;
  }


  if (avatarElement) {

    avatarElement.textContent =
      getInitials(name);

  }


  showScreen(
    "my-profile-screen"
  );
}


/* =========================================================
   INITIALS
========================================================= */

function getInitials(name) {

  if (!name) {
    return "U";
  }


  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map(word =>
      word.charAt(0).toUpperCase()
    )
    .join("");
}


/* =========================================================
   LOGOUT
========================================================= */

function logout() {

  try {

    if (
      window.google &&
      window.google.accounts &&
      window.google.accounts.id
    ) {

      window.google.accounts.id.disableAutoSelect();

    }

  } catch (error) {

    console.warn(
      "Google logout warning:",
      error
    );
  }


  currentUser = null;

  ageVerified = false;

  currentQuestion = 0;

  profileAnswers = {};

  paymentStarted = false;

  paymentCompletedFlag = false;


  localStorage.removeItem(
    "dating_google_user"
  );

  localStorage.removeItem(
    "dating_profile"
  );


  showScreen("login-gate");


  showToast(
    "You have been logged out."
  );
}


/* =========================================================
   INITIALIZATION
========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    loadSavedProfile();

    initializeGoogleLogin();


    /*
      If user already has a valid locally saved
      profile, don't automatically jump into the app.

      They can sign in again with Google.
    */

    showScreen("login-gate");

  }
);


/* =========================================================
   GLOBAL FUNCTIONS
========================================================= */

window.verifyAge =
  verifyAge;

window.nextQuestion =
  nextQuestion;

window.previousQuestion =
  previousQuestion;

window.startPayment =
  startPayment;

window.paymentCompleted =
  paymentCompleted;

window.showDatingHome =
  showDatingHome;

window.showMyProfile =
  showMyProfile;

window.showMatches =
  showMatches;

window.showMessages =
  showMessages;

window.likeProfile =
  likeProfile;

window.passProfile =
  passProfile;

window.superLikeProfile =
  superLikeProfile;

window.logout =
  logout;

window.goBackToLogin =
  goBackToLogin;
