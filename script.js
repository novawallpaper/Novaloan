/* =========================================================
   HEARTLY - COMPLETE JAVASCRIPT
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


/* =========================================================
   QUESTIONS
   ========================================================= */

const profileQuestions = [

  {
    id: "name",

    title: "What's your name?",

    subtitle:
      "Tell us what you'd like people to call you.",

    type: "text",

    placeholder:
      "Enter your name"
  },


  {
    id: "gender",

    title: "What's your gender?",

    subtitle:
      "Choose the option that best describes you.",

    type: "options",

    options: [
      "Male",
      "Female"
    ]
  },


  {
    id: "lookingFor",

    title: "Who are you looking for?",

    subtitle:
      "Choose who you'd like to meet.",

    type: "options",

    options: [
      "Male",
      "Female"
    ]
  },


  {
    id: "city",

    title: "Where are you from?",

    subtitle:
      "Your city helps us show relevant profiles.",

    type: "text",

    placeholder:
      "Enter your city"
  },


  {
    id: "bio",

    title: "Tell us about yourself",

    subtitle:
      "Write something interesting about you.",

    type: "textarea",

    placeholder:
      "A little about me..."
  }

];


/* =========================================================
   HELPERS
   ========================================================= */

function $(id) {

  return document.getElementById(id);

}


function showToast(
  message,
  type = ""
) {

  const toast = $("toast");

  if (!toast) {

    console.log(message);

    return;
  }


  toast.textContent = message;

  toast.className =
    "toast show";


  if (type) {

    toast.classList.add(type);

  }


  clearTimeout(
    window.toastTimer
  );


  window.toastTimer =
    setTimeout(() => {

      toast.classList.remove(
        "show"
      );

    }, 3000);
}


/* =========================================================
   SCREEN
   ========================================================= */

function showScreen(
  screenId
) {

  document
    .querySelectorAll(
      ".screen-content"
    )
    .forEach(screen => {

      screen.classList.remove(
        "active"
      );

    });


  const screen =
    $(screenId);


  if (screen) {

    screen.classList.add(
      "active"
    );

  }

}


/* =========================================================
   REAL GOOGLE LOGIN
   ========================================================= */

/*
   IMPORTANT:

   This does NOT create a fake Google button.

   google.accounts.id.renderButton()
   creates the official Google Sign-In button.
*/


function initializeGoogleLogin() {

  if (googleInitialized) {

    return;
  }


  const setupGoogle = () => {

    if (
      !window.google ||
      !window.google.accounts ||
      !window.google.accounts.id
    ) {

      console.error(
        "Google Identity Services not loaded."
      );

      return;
    }


    const container =
      $("google-signin");


    if (!container) {

      console.error(
        "Missing #google-signin"
      );

      return;
    }


    try {

      /*
         Google initialization
      */

      google.accounts.id.initialize({

        client_id:
          GOOGLE_CLIENT_ID,

        callback:
          handleGoogleCredential,

        auto_select:
          false,

        cancel_on_tap_outside:
          true

      });


      /*
         Clear anything old.
      */

      container.innerHTML = "";


      /*
         REAL GOOGLE BUTTON
      */

      google.accounts.id.renderButton(

        container,

        {

          type:
            "standard",

          theme:
            "outline",

          size:
            "large",

          text:
            "signin_with",

          shape:
            "rectangular",

          logo_alignment:
            "left",

          width:
            360

        }

      );


      googleInitialized =
        true;


      console.log(
        "Official Google button loaded."
      );


    } catch (error) {

      console.error(
        "Google initialization failed:",
        error
      );

    }

  };


  /*
     Google library already loaded
  */

  if (
    window.google &&
    window.google.accounts &&
    window.google.accounts.id
  ) {

    setupGoogle();

    return;
  }


  /*
     Google library is still loading.
  */

  window.onGoogleLibraryLoad =
    setupGoogle;


  /*
     Additional safety check for
     async/defer loading.
  */

  let attempts = 0;


  const timer =
    setInterval(() => {

      attempts++;


      if (
        window.google &&
        window.google.accounts &&
        window.google.accounts.id
      ) {

        clearInterval(timer);

        setupGoogle();

      }


      if (attempts >= 50) {

        clearInterval(timer);

        if (!googleInitialized) {

          console.error(
            "Google library did not load."
          );

        }

      }

    }, 200);

}


/* =========================================================
   GOOGLE CREDENTIAL
   ========================================================= */

function handleGoogleCredential(
  response
) {

  try {

    if (
      !response ||
      !response.credential
    ) {

      showToast(
        "Google login failed.",
        "error"
      );

      return;
    }


    const user =
      parseJwt(
        response.credential
      );


    if (
      !user ||
      !user.email
    ) {

      showToast(
        "Google account information unavailable.",
        "error"
      );

      return;
    }


    /*
       Logged-in Google user
    */

    currentUser = {

      id:
        user.sub,

      email:
        user.email,

      name:
        user.name ||
        "User",

      picture:
        user.picture ||
        ""

    };


    /*
       Save login
    */

    localStorage.setItem(

      "dating_google_user",

      JSON.stringify(
        currentUser
      )

    );


    showToast(
      "Google login successful!",
      "success"
    );


    setTimeout(() => {

      startProfileFlow();

    }, 300);


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
   JWT
   ========================================================= */

function parseJwt(
  token
) {

  try {

    const parts =
      token.split(".");


    if (
      parts.length !== 3
    ) {

      return null;

    }


    const base64Url =
      parts[1];


    const base64 =
      base64Url
        .replace(
          /-/g,
          "+"
        )
        .replace(
          /_/g,
          "/"
        );


    const padded =
      base64 +
      "=".repeat(
        (
          4 -
          (
            base64.length % 4
          )
        ) % 4
      );


    const jsonPayload =
      decodeURIComponent(

        atob(padded)

          .split("")

          .map(
            character => {

              return (
                "%" +
                (
                  "00" +
                  character
                    .charCodeAt(0)
                    .toString(16)
                ).slice(-2)
              );

            }
          )

          .join("")

      );


    return JSON.parse(
      jsonPayload
    );


  } catch (error) {

    console.error(
      "JWT parse error:",
      error
    );

    return null;

  }

}


/* =========================================================
   START PROFILE
   ========================================================= */

function startProfileFlow() {

  if (!currentUser) {

    loadSavedProfile();

  }


  if (!currentUser) {

    showScreen(
      "login-gate"
    );

    return;
  }


  const savedProfile =
    getSavedProfile();


  /*
     Existing paid profile
  */

  if (
    savedProfile &&
    savedProfile.email ===
      currentUser.email &&
    savedProfile.paymentVerified === true
  ) {

    profileAnswers =
      savedProfile.answers ||
      {};

    ageVerified =
      savedProfile.ageVerified ===
      true;


    showDatingHome();

    return;
  }


  /*
     New profile
  */

  showScreen(
    "age-screen"
  );

}


/* =========================================================
   AGE
   ========================================================= */

function verifyAge() {

  const input =
    $("dob");


  if (
    !input ||
    !input.value
  ) {

    showToast(
      "Please select your date of birth.",
      "error"
    );

    return;
  }


  const dob =
    new Date(
      input.value
    );


  if (
    isNaN(
      dob.getTime()
    )
  ) {

    showToast(
      "Invalid date.",
      "error"
    );

    return;
  }


  const today =
    new Date();


  let age =
    today.getFullYear() -
    dob.getFullYear();


  const month =
    today.getMonth() -
    dob.getMonth();


  if (
    month < 0 ||
    (
      month === 0 &&
      today.getDate() <
        dob.getDate()
    )
  ) {

    age--;

  }


  if (age < 18) {

    showToast(
      "You must be 18 or older.",
      "error"
    );

    return;
  }


  ageVerified =
    true;


  profileAnswers.dob =
    input.value;


  currentQuestion =
    0;


  renderQuestion();


  showScreen(
    "questions-screen"
  );

}


/* =========================================================
   QUESTIONS
   ========================================================= */

function renderQuestion() {

  const question =
    profileQuestions[
      currentQuestion
    ];


  if (!question) {

    showPaymentScreen();

    return;
  }


  $("question-number")
    .textContent =
    `${currentQuestion + 1} / ${profileQuestions.length}`;


  $("progress-fill")
    .style.width =
    `${
      (
        (
          currentQuestion + 1
        ) /
        profileQuestions.length
      ) * 100
    }%`;


  $("question-title")
    .textContent =
    question.title;


  $("question-subtitle")
    .textContent =
    question.subtitle;


  const container =
    $("question-container");


  container.innerHTML = "";


  /*
     TEXT
  */

  if (
    question.type ===
    "text"
  ) {

    const input =
      document.createElement(
        "input"
      );


    input.type =
      "text";


    input.className =
      "profile-input";


    input.placeholder =
      question.placeholder;


    input.value =
      profileAnswers[
        question.id
      ] ||
      "";


    input.addEventListener(
      "input",
      () => {

        profileAnswers[
          question.id
        ] =
          input.value.trim();

      }
    );


    container.appendChild(
      input
    );


    setTimeout(
      () => input.focus(),
      100
    );

  }


  /*
     TEXTAREA
  */

  else if (
    question.type ===
    "textarea"
  ) {

    const textarea =
      document.createElement(
        "textarea"
      );


    textarea.className =
      "profile-textarea";


    textarea.placeholder =
      question.placeholder;


    textarea.value =
      profileAnswers[
        question.id
      ] ||
      "";


    textarea.addEventListener(
      "input",
      () => {

        profileAnswers[
          question.id
        ] =
          textarea.value.trim();

      }
    );


    container.appendChild(
      textarea
    );


    setTimeout(
      () => textarea.focus(),
      100
    );

  }


  /*
     OPTIONS
  */

  else if (
    question.type ===
    "options"
  ) {

    const wrapper =
      document.createElement(
        "div"
      );


    wrapper.className =
      "profile-options";


    question.options.forEach(
      option => {

        const button =
          document.createElement(
            "button"
          );


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

            profileAnswers[
              question.id
            ] =
              option;


            renderQuestion();

          }
        );


        wrapper.appendChild(
          button
        );

      }
    );


    container.appendChild(
      wrapper
    );

  }

}


/* =========================================================
   NEXT
   ========================================================= */

function nextQuestion() {

  const question =
    profileQuestions[
      currentQuestion
    ];


  const input =
    document.querySelector(
      "#question-container input, #question-container textarea"
    );


  if (input) {

    profileAnswers[
      question.id
    ] =
      input.value.trim();

  }


  const answer =
    profileAnswers[
      question.id
    ];


  if (
    !answer ||
    !String(answer).trim()
  ) {

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
   PAYMENT SCREEN
   ========================================================= */

function showPaymentScreen() {

  $("payment-price")
    .textContent =
    PROFILE_PRICE;


  showScreen(
    "payment-screen"
  );

}


/* =========================================================
   RAZORPAY PAYMENT
   ========================================================= */

function startPayment() {

  if (!currentUser) {

    showScreen(
      "login-gate"
    );

    return;
  }


  if (!ageVerified) {

    showScreen(
      "age-screen"
    );

    return;
  }


  /*
     Save profile draft before
     opening Razorpay.
  */

  const draft = {

    email:
      currentUser.email,

    name:
      currentUser.name,

    picture:
      currentUser.picture,

    answers:
      profileAnswers,

    ageVerified:
      true,

    paymentStatus:
      "pending",

    amount:
      PROFILE_PRICE,

    savedAt:
      new Date().toISOString()

  };


  localStorage.setItem(

    "dating_profile_draft",

    JSON.stringify(
      draft
    )

  );


  /*
     Open your Razorpay Payment Link.
  */

  window.location.href =
    RAZORPAY_PAYMENT_LINK;

}


/* =========================================================
   PROFILE
   ========================================================= */

function createDatingProfile(
  paymentData = {}
) {

  if (!currentUser) {

    return;
  }


  const profile = {

    id:
      currentUser.id,

    email:
      currentUser.email,

    name:
      profileAnswers.name ||
      currentUser.name,

    picture:
      currentUser.picture,

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

    createdAt:
      new Date().toISOString()

  };


  localStorage.setItem(

    "dating_profile",

    JSON.stringify(
      profile
    )

  );


  localStorage.removeItem(
    "dating_profile_draft"
  );


  showScreen(
    "profile-created-screen"
  );

}


/* =========================================================
   SAVED PROFILE
   ========================================================= */

function getSavedProfile() {

  try {

    const saved =
      localStorage.getItem(
        "dating_profile"
      );


    if (!saved) {

      return null;

    }


    return JSON.parse(
      saved
    );


  } catch (error) {

    console.error(
      error
    );

    return null;

  }

}


/* =========================================================
   LOAD SAVED LOGIN
   ========================================================= */

function loadSavedProfile() {

  try {

    const user =
      localStorage.getItem(
        "dating_google_user"
      );


    if (user) {

      currentUser =
        JSON.parse(
          user
        );

    }


    const profile =
      getSavedProfile();


    if (
      profile &&
      profile.answers
    ) {

      profileAnswers =
        profile.answers;

    }


    if (
      profile &&
      profile.ageVerified
    ) {

      ageVerified =
        true;

    }

  } catch (error) {

    console.error(
      "Saved data error:",
      error
    );

  }

}


/* =========================================================
   HOME
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
   PROFILE CARD
   ========================================================= */

function renderDatingProfiles() {

  const container =
    $("dating-profiles");


  if (!container) {

    return;

  }


  const profile =
    getSavedProfile();


  if (!profile) {

    container.innerHTML = `

      <div class="dating-profile-card">

        <div class="dating-profile-info">

          <h3>
            Create your profile
          </h3>

          <p class="profile-bio">
            Complete your profile to start.
          </p>

        </div>

      </div>

    `;

    return;

  }


  const answers =
    profile.answers ||
    {};


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
    "Looking to meet someone interesting.";


  const picture =
    profile.picture ||
    "https://www.gravatar.com/avatar/?d=mp";


  container.innerHTML = `

    <article
      class="dating-profile-card"
    >

      <div
        class="dating-profile-image"
      >

        <img
          src="${escapeHtml(picture)}"
          alt="${escapeHtml(name)}"
        >

      </div>


      <div
        class="dating-profile-info"
      >

        <h3>
          ${escapeHtml(name)}
        </h3>


        <p class="profile-city">

          <i
            class="fa-solid fa-location-dot"
          ></i>

          ${escapeHtml(city)}

        </p>


        ${
          gender
            ? `
              <span class="profile-gender">
                ${escapeHtml(gender)}
              </span>
            `
            : ""
        }


        <p class="profile-bio">
          ${escapeHtml(bio)}
        </p>

      </div>

    </article>

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
    profile.answers ||
    {};


  $("my-profile-name")
    .textContent =
    answers.name ||
    profile.name ||
    "User";


  $("my-profile-city")
    .textContent =
    answers.city ||
    "";


  $("my-profile-bio")
    .textContent =
    answers.bio ||
    "";


  $("my-profile-image")
    .src =
    profile.picture ||
    "https://www.gravatar.com/avatar/?d=mp";

}


/* =========================================================
   LOGOUT
   ========================================================= */

function logout() {

  currentUser =
    null;

  currentQuestion =
    0;

  profileAnswers =
    {};

  ageVerified =
    false;


  localStorage.removeItem(
    "dating_google_user"
  );


  localStorage.removeItem(
    "dating_profile"
  );


  localStorage.removeItem(
    "dating_profile_draft"
  );


  /*
     Google session auto-select disable.
  */

  try {

    if (
      window.google &&
      google.accounts &&
      google.accounts.id
    ) {

      google.accounts.id
        .disableAutoSelect();

    }

  } catch (error) {

    console.log(error);

  }


  showScreen(
    "login-gate"
  );

}


/* =========================================================
   ESCAPE HTML
   ========================================================= */

function escapeHtml(
  value
) {

  return String(
    value ?? ""
  )

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
   INIT
   ========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    /*
       Load saved login
    */

    loadSavedProfile();


    /*
       Start REAL Google Login
    */

    initializeGoogleLogin();


    /*
       Initial screen
    */

    if (
      currentUser
    ) {

      const profile =
        getSavedProfile();


      if (
        profile &&
        profile.email ===
          currentUser.email &&
        profile.paymentVerified ===
          true
      ) {

        showDatingHome();

      } else {

        showScreen(
          "login-gate"
        );

      }

    } else {

      showScreen(
        "login-gate"
      );

    }

  }
);


/* =========================================================
   GLOBAL FUNCTIONS
   ========================================================= */

window.initializeGoogleLogin =
  initializeGoogleLogin;

window.handleGoogleCredential =
  handleGoogleCredential;

window.verifyAge =
  verifyAge;

window.nextQuestion =
  nextQuestion;

window.selectOption =
  function(id, value) {

    profileAnswers[id] =
      value;

    renderQuestion();

  };

window.startPayment =
  startPayment;

window.openDatingHome =
  openDatingHome;

window.showDatingHome =
  showDatingHome;

window.showMyProfile =
  showMyProfile;

window.logout =
  logout;

window.createDatingProfile =
  createDatingProfile;

window.showScreen =
  showScreen;


/* =========================================================
   END
   ========================================================= */
