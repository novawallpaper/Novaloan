/* =========================================================
   LUMA DATING APP
   Frontend-only version
========================================================= */


/* =========================================================
   CONFIG
========================================================= */

const GOOGLE_CLIENT_ID =
  "452456583028-1l86bibq60ggkl3o1h5j88sed7v04eof.apps.googleusercontent.com";

const PAYMENT_LINK =
  "https://rzp.io/rzp/EDfHHkBO";

const STORAGE_USER =
  "dating_google_user";

const STORAGE_PROFILE =
  "dating_profile";


/* =========================================================
   STATE
========================================================= */

let currentUser = null;
let currentQuestion = 0;

let profileAnswers = {
  name: "",
  gender: "",
  lookingFor: "",
  city: "",
  bio: ""
};

let ageVerified = false;

let currentDiscoveryIndex = 0;


/* =========================================================
   QUESTIONS
========================================================= */

const questions = [

  {
    key: "name",

    title: "What's your name?",

    eyebrow: "Let's get to know you",

    description:
      "This is how people will see you on LUMA.",

    icon:
      '<i class="fa-regular fa-user"></i>',

    type: "text",

    placeholder: "Enter your first name"
  },

  {
    key: "gender",

    title: "How do you identify?",

    eyebrow: "A little about you",

    description:
      "Choose the option that feels right for you.",

    icon:
      '<i class="fa-solid fa-person"></i>',

    type: "options",

    options: [
      "Male",
      "Female"
    ]
  },

  {
    key: "lookingFor",

    title: "Who are you looking for?",

    eyebrow: "Your preference",

    description:
      "Tell us who you'd like to meet.",

    icon:
      '<i class="fa-regular fa-heart"></i>',

    type: "options",

    options: [
      "Male",
      "Female"
    ]
  },

  {
    key: "city",

    title: "Where are you based?",

    eyebrow: "Your area",

    description:
      "We'll use this to make discovery more relevant.",

    icon:
      '<i class="fa-solid fa-location-dot"></i>',

    type: "text",

    placeholder: "e.g. Delhi"
  },

  {
    key: "bio",

    title: "Tell us about yourself.",

    eyebrow: "Your introduction",

    description:
      "A few words can make the first hello much easier.",

    icon:
      '<i class="fa-regular fa-comment-dots"></i>',

    type: "textarea",

    placeholder:
      "What are you into? What makes you smile?"
  }

];


/* =========================================================
   DEMO DISCOVERY PROFILES
========================================================= */

const discoveryProfiles = [

  {
    name: "Aanya",
    age: 21,
    city: "Delhi",
    initials: "A",
    colorClass: "one",
    bio:
      "Coffee, late-night conversations and finding new places around the city.",
    tag: "New here"
  },

  {
    name: "Riya",
    age: 22,
    city: "Delhi",
    initials: "R",
    colorClass: "two",
    bio:
      "Music lover, weekend explorer and always looking for a good food spot.",
    tag: "Popular"
  },

  {
    name: "Sara",
    age: 20,
    city: "Delhi",
    initials: "S",
    colorClass: "three",
    bio:
      "Books, sunsets and spontaneous plans. Say hi if you're curious.",
    tag: "Online now"
  },

  {
    name: "Meera",
    age: 23,
    city: "Delhi",
    initials: "M",
    colorClass: "four",
    bio:
      "Creative soul who believes the best conversations happen unexpectedly.",
    tag: "Recommended"
  }

];


/* =========================================================
   INITIALIZE
========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    initializeGoogleLogin();

    loadSavedProfile();

    renderDatingProfiles();

  }
);


/* =========================================================
   SCREEN MANAGEMENT
========================================================= */

function showScreen(screenId) {

  document
    .querySelectorAll(".screen-content")
    .forEach(screen => {

      screen.classList.remove("active");

    });

  const target =
    document.getElementById(screenId);

  if (target) {

    target.classList.add("active");

    window.scrollTo({
      top: 0,
      behavior: "instant"
    });

  }

}


/* =========================================================
   GOOGLE LOGIN
========================================================= */

function initializeGoogleLogin() {

  if (
    !window.google ||
    !google.accounts ||
    !google.accounts.id
  ) {

    return;

  }

  try {

    google.accounts.id.initialize({

      client_id: GOOGLE_CLIENT_ID,

      callback:
        handleGoogleCredential,

      auto_select: false,

      cancel_on_tap_outside: true

    });

  } catch (error) {

    console.error(
      "Google initialization failed:",
      error
    );

  }

}


function handleFallbackGoogleClick() {

  if (
    window.google &&
    google.accounts &&
    google.accounts.id
  ) {

    google.accounts.id.prompt();

    return;

  }

  showToast(
    "Google login is still loading. Please try again."
  );

}


function handleGoogleCredential(response) {

  if (
    !response ||
    !response.credential
  ) {

    showToast(
      "Google login failed."
    );

    return;

  }

  try {

    const user =
      parseJwt(response.credential);

    currentUser = {

      googleId:
        user.sub || "",

      email:
        user.email || "",

      name:
        user.name ||
        user.given_name ||
        "User",

      picture:
        user.picture || ""

    };

    localStorage.setItem(
      STORAGE_USER,
      JSON.stringify(currentUser)
    );

    startProfileFlow();

  } catch (error) {

    console.error(error);

    showToast(
      "Unable to read Google account."
    );

  }

}


/* =========================================================
   JWT PARSER
========================================================= */

function parseJwt(token) {

  const base64Url =
    token.split(".")[1];

  const base64 =
    base64Url
      .replace(/-/g, "+")
      .replace(/_/g, "/");

  const jsonPayload =
    decodeURIComponent(
      atob(base64)
        .split("")
        .map(
          character =>
            "%" +
            (
              "00" +
              character
                .charCodeAt(0)
                .toString(16)
            ).slice(-2)
        )
        .join("")
    );

  return JSON.parse(jsonPayload);

}


/* =========================================================
   PROFILE FLOW
========================================================= */

function startProfileFlow() {

  const savedProfile =
    getSavedProfile();

  if (
    savedProfile &&
    currentUser &&
    savedProfile.email === currentUser.email
  ) {

    profileAnswers =
      savedProfile.answers || profileAnswers;

    ageVerified =
      true;

    openDatingHome();

    return;

  }

  showScreen("age-screen");

}


/* =========================================================
   AGE VERIFICATION
========================================================= */

function verifyAge() {

  const input =
    document.getElementById("dob-input");

  if (!input || !input.value) {

    showToast(
      "Please select your date of birth."
    );

    return;

  }

  const birthDate =
    new Date(input.value);

  if (
    Number.isNaN(
      birthDate.getTime()
    )
  ) {

    showToast(
      "Please enter a valid date."
    );

    return;

  }

  const today =
    new Date();

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
      today.getDate() <
      birthDate.getDate()
    )
  ) {

    age--;

  }

  if (age < 18) {

    showToast(
      "You must be 18 or older to use LUMA."
    );

    return;

  }

  ageVerified = true;

  currentQuestion = 0;

  renderQuestion();

  showScreen(
    "questions-screen"
  );

}


/* =========================================================
   QUESTION RENDERING
========================================================= */

function renderQuestion() {

  const question =
    questions[currentQuestion];

  if (!question) {

    showPaymentScreen();

    return;

  }

  const title =
    document.getElementById(
      "question-title"
    );

  const description =
    document.getElementById(
      "question-description"
    );

  const eyebrow =
    document.getElementById(
      "question-eyebrow"
    );

  const icon =
    document.getElementById(
      "question-icon"
    );

  const content =
    document.getElementById(
      "question-content"
    );

  const counter =
    document.getElementById(
      "question-counter"
    );

  const progress =
    document.getElementById(
      "question-progress"
    );

  title.textContent =
    question.title;

  description.textContent =
    question.description;

  eyebrow.textContent =
    question.eyebrow;

  icon.innerHTML =
    question.icon;

  counter.textContent =
    `${String(currentQuestion + 1).padStart(2, "0")} / ${String(questions.length).padStart(2, "0")}`;

  progress.style.width =
    `${((currentQuestion + 1) / questions.length) * 100}%`;


  if (question.type === "text") {

    content.innerHTML = `

      <label class="field-label">
        ${escapeHtml(question.key === "city" ? "Your city" : "Your name")}
      </label>

      <input
        id="question-input"
        class="question-input"
        type="text"
        placeholder="${escapeHtml(question.placeholder)}"
        value="${escapeHtml(profileAnswers[question.key] || "")}"
        autocomplete="off"
      />

    `;

  }


  if (question.type === "textarea") {

    content.innerHTML = `

      <textarea
        id="question-input"
        class="question-input"
        placeholder="${escapeHtml(question.placeholder)}"
        maxlength="300"
      >${escapeHtml(profileAnswers[question.key] || "")}</textarea>

    `;

  }


  if (question.type === "options") {

    const selected =
      profileAnswers[question.key];

    content.innerHTML = `

      <div class="option-grid">

        ${question.options.map(option => `

          <button
            type="button"
            class="option-btn ${
              selected === option
                ? "selected"
                : ""
            }"
            onclick="selectOption('${escapeAttribute(option)}')"
          >
            ${escapeHtml(option)}
          </button>

        `).join("")}

      </div>

    `;

  }

}


/* =========================================================
   OPTION SELECT
========================================================= */

function selectOption(value) {

  const question =
    questions[currentQuestion];

  profileAnswers[
    question.key
  ] = value;

  renderQuestion();

}


/* =========================================================
   NEXT QUESTION
========================================================= */

function nextQuestion() {

  const question =
    questions[currentQuestion];

  if (
    question.type === "text" ||
    question.type === "textarea"
  ) {

    const input =
      document.getElementById(
        "question-input"
      );

    const value =
      input
        ? input.value.trim()
        : "";

    if (!value) {

      showToast(
        "Please answer this question."
      );

      input?.focus();

      return;

    }

    profileAnswers[
      question.key
    ] = value;

  }

  if (
    question.type === "options" &&
    !profileAnswers[question.key]
  ) {

    showToast(
      "Please choose an option."
    );

    return;

  }


  if (
    currentQuestion <
    questions.length - 1
  ) {

    currentQuestion++;

    renderQuestion();

    return;

  }


  showPaymentScreen();

}


/* =========================================================
   PREVIOUS QUESTION
========================================================= */

function previousQuestion() {

  if (currentQuestion <= 0) {

    showScreen("age-screen");

    return;

  }

  currentQuestion--;

  renderQuestion();

}


/* =========================================================
   PAYMENT SCREEN
========================================================= */

function showPaymentScreen() {

  showScreen(
    "payment-screen"
  );

}


/* =========================================================
   RAZORPAY PAYMENT LINK
========================================================= */

function startPayment() {

  window.open(
    PAYMENT_LINK,
    "_blank",
    "noopener,noreferrer"
  );

  showToast(
    "Razorpay payment page opened."
  );

}


/* =========================================================
   PAYMENT COMPLETE
========================================================= */

function confirmPaymentCompleted() {

  const confirmed =
    window.confirm(
      "Have you completed the ₹45 Razorpay payment?"
    );

  if (!confirmed) {

    return;

  }

  /*
    IMPORTANT:
    This frontend-only version cannot securely verify
    the Razorpay transaction.

    We store the status as self_reported rather than
    pretending it was server-verified.
  */

  createDatingProfile();

}


/* =========================================================
   CREATE PROFILE
========================================================= */

function createDatingProfile() {

  if (!currentUser) {

    showToast(
      "Please login again."
    );

    showScreen("login-gate");

    return;

  }

  const profile = {

    email:
      currentUser.email,

    googleId:
      currentUser.googleId,

    name:
      profileAnswers.name,

    picture:
      currentUser.picture || "",

    answers:
      { ...profileAnswers },

    ageVerified:
      true,

    paymentStatus:
      "self_reported",

    paymentVerified:
      false,

    createdAt:
      new Date().toISOString()

  };


  localStorage.setItem(
    STORAGE_PROFILE,
    JSON.stringify(profile)
  );


  showScreen(
    "profile-created-screen"
  );

}


/* =========================================================
   OPEN DATING HOME
========================================================= */

function openDatingHome() {

  renderDatingProfiles();

  showScreen(
    "dating-home"
  );

}


function showDatingHome() {

  showScreen(
    "dating-home"
  );

}


/* =========================================================
   DISCOVERY PROFILES
========================================================= */

function renderDatingProfiles() {

  const feed =
    document.getElementById(
      "profile-feed"
    );

  if (!feed) {

    return;

  }

  if (
    currentDiscoveryIndex >=
    discoveryProfiles.length
  ) {

    currentDiscoveryIndex = 0;

  }

  const profile =
    discoveryProfiles[
      currentDiscoveryIndex
    ];


  feed.innerHTML = `

    <article class="discovery-card">

      <div class="profile-photo ${profile.colorClass}">

        <span class="profile-tag">
          ${escapeHtml(profile.tag)}
        </span>

        <div class="profile-avatar">
          ${escapeHtml(profile.initials)}
        </div>

        <div class="profile-gradient"></div>

        <div class="profile-info">

          <h3 class="profile-name">

            ${escapeHtml(profile.name)},
            ${profile.age}

            <span class="verified-badge">
              <i class="fa-solid fa-check"></i>
            </span>

          </h3>

          <div class="profile-meta">

            <span>
              <i class="fa-solid fa-location-dot"></i>
              ${escapeHtml(profile.city)}
            </span>

            <span>
              <i class="fa-solid fa-circle"></i>
              Active recently
            </span>

          </div>

          <p class="profile-bio">
            ${escapeHtml(profile.bio)}
          </p>

        </div>

      </div>

    </article>

  `;

}


/* =========================================================
   DISCOVERY ACTIONS
========================================================= */

function handleDiscoveryAction(action) {

  const profile =
    discoveryProfiles[
      currentDiscoveryIndex
    ];

  if (!profile) {

    return;

  }

  if (action === "like") {

    showToast(
      `You liked ${profile.name} ❤️`
    );

  }

  if (action === "super") {

    showToast(
      `Super liked ${profile.name} ⭐`
    );

  }

  if (action === "pass") {

    showToast(
      `Passed on ${profile.name}`
    );

  }


  currentDiscoveryIndex++;

  renderDatingProfiles();

}


/* =========================================================
   MY PROFILE
========================================================= */

function showMyProfile() {

  const profile =
    getSavedProfile();

  if (!profile) {

    showToast(
      "Your profile isn't ready yet."
    );

    return;

  }

  renderMyProfile(
    profile
  );

  showScreen(
    "my-profile-screen"
  );

}


function renderMyProfile(profile) {

  const hero =
    document.getElementById(
      "my-profile-hero"
    );

  const details =
    document.getElementById(
      "my-profile-details"
    );

  if (!hero || !details) {

    return;

  }


  const name =
    profile.answers?.name ||
    profile.name ||
    "You";

  const gender =
    profile.answers?.gender ||
    "Not specified";

  const lookingFor =
    profile.answers?.lookingFor ||
    "Not specified";

  const city =
    profile.answers?.city ||
    "Not specified";

  const bio =
    profile.answers?.bio ||
    "No bio added yet.";


  const initial =
    name
      .charAt(0)
      .toUpperCase();


  hero.innerHTML = `

    <div class="my-avatar">
      ${escapeHtml(initial)}
    </div>

    <div>

      <h2>
        ${escapeHtml(name)}
      </h2>

      <p>
        <i class="fa-solid fa-location-dot"></i>
        ${escapeHtml(city)}
      </p>

    </div>

  `;


  details.innerHTML = `

    <div class="detail-card">

      <small>About me</small>

      <p>
        ${escapeHtml(bio)}
      </p>

    </div>


    <div class="detail-card">

      <small>Gender</small>

      <strong>
        ${escapeHtml(gender)}
      </strong>

    </div>


    <div class="detail-card">

      <small>Looking for</small>

      <strong>
        ${escapeHtml(lookingFor)}
      </strong>

    </div>


    <div class="detail-card">

      <small>Profile status</small>

      <strong>
        <i
          class="fa-solid fa-circle-check"
          style="color:#1e4934"
        ></i>
        Active
      </strong>

    </div>

  `;

}


/* =========================================================
   EDIT PROFILE
========================================================= */

function editProfile() {

  showToast(
    "Profile editing is coming soon."
  );

}


/* =========================================================
   LOGOUT
========================================================= */

function logoutUser() {

  const confirmed =
    window.confirm(
      "Are you sure you want to sign out?"
    );

  if (!confirmed) {

    return;

  }

  localStorage.removeItem(
    STORAGE_USER
  );

  localStorage.removeItem(
    STORAGE_PROFILE
  );

  currentUser = null;

  profileAnswers = {
    name: "",
    gender: "",
    lookingFor: "",
    city: "",
    bio: ""
  };

  ageVerified = false;

  currentQuestion = 0;

  if (
    window.google &&
    google.accounts &&
    google.accounts.id
  ) {

    try {

      google.accounts.id.disableAutoSelect();

    } catch (error) {

      console.warn(error);

    }

  }

  showScreen(
    "login-gate"
  );

}


/* =========================================================
   LOAD SAVED PROFILE
========================================================= */

function loadSavedProfile() {

  try {

    const savedUser =
      localStorage.getItem(
        STORAGE_USER
      );

    if (savedUser) {

      currentUser =
        JSON.parse(savedUser);

    }

  } catch (error) {

    console.error(
      "User load failed:",
      error
    );

  }


  const profile =
    getSavedProfile();

  if (
    profile &&
    currentUser &&
    profile.email === currentUser.email
  ) {

    profileAnswers =
      profile.answers || profileAnswers;

    ageVerified =
      true;

  }

}


/* =========================================================
   GET PROFILE
========================================================= */

function getSavedProfile() {

  try {

    const raw =
      localStorage.getItem(
        STORAGE_PROFILE
      );

    if (!raw) {

      return null;

    }

    return JSON.parse(raw);

  } catch (error) {

    console.error(
      "Profile load failed:",
      error
    );

    return null;

  }

}


/* =========================================================
   TOAST
========================================================= */

let toastTimer = null;

function showToast(message) {

  const toast =
    document.getElementById(
      "toast"
    );

  const toastMessage =
    document.getElementById(
      "toast-message"
    );

  if (!toast || !toastMessage) {

    return;

  }

  toastMessage.textContent =
    message;

  toast.classList.add(
    "show"
  );

  clearTimeout(
    toastTimer
  );

  toastTimer =
    setTimeout(
      () => {

        toast.classList.remove(
          "show"
        );

      },
      2600
    );

}


/* =========================================================
   HTML ESCAPING
========================================================= */

function escapeHtml(value) {

  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

}


function escapeAttribute(value) {

  return String(value ?? "")
    .replace(/\\/g, "\\\\")
    .replace(/'/g, "\\'");
}


/* =========================================================
   GLOBAL FUNCTIONS
========================================================= */

window.handleFallbackGoogleClick =
  handleFallbackGoogleClick;

window.verifyAge =
  verifyAge;

window.nextQuestion =
  nextQuestion;

window.previousQuestion =
  previousQuestion;

window.selectOption =
  selectOption;

window.startPayment =
  startPayment;

window.confirmPaymentCompleted =
  confirmPaymentCompleted;

window.openDatingHome =
  openDatingHome;

window.showDatingHome =
  showDatingHome;

window.showMyProfile =
  showMyProfile;

window.handleDiscoveryAction =
  handleDiscoveryAction;

window.editProfile =
  editProfile;

window.logoutUser =
  logoutUser;

window.showToast =
  showToast;
