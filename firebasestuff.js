import { authCheck } from "./index.js";

import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import * as firebaseui from "firebaseui";
import "firebaseui/dist/firebaseui.css";

import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  initializeFirestore,
  getFirestore,
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { normalize } from "uri-js";

//import { getDatabase } from "firebase/database";
////////////////////////////////////////////////////////////
// var admin = require("firebase-admin");

// var serviceAccount = require("path/to/serviceAccountKey.json");

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   databaseURL: "https://tv-series-library-default-rtdb.firebaseio.com"
// });
//////////////////////////////////////////////////////
const firebaseConfig = {
  apiKey: "AIzaSyCgWOsD40-y422erIMNultdmSBmcP5c_VY",
  authDomain: "tv-series-library.web.app",
  databaseURL: "https://tv-series-library-default-rtdb.firebaseio.com",
  projectId: "tv-series-library",
  storageBucket: "tv-series-library.appspot.com",
  messagingSenderId: "371898195484",
  appId: "1:371898195484:web:6d181e6ccf75b8410ec9d9",
};

// Initialize Firebase app
// modular - newer
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
//const db = initializeFirestore(app, { experimentalAutoDetectLongPolling: true });

//const database = getDatabase(app); <-- realtime db, not firestore

//compat - older
// const app = firebase.initializeApp(firebaseConfig);
// const auth = firebase.auth(app);
// const db = firebase.firestore(app);

const uiConfig = {
  signInOptions: [
    {
      // Google provider must be enabled in Firebase Console to support one-tap
      // sign-up.
      provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      // Required to enable ID token credentials for this provider.
      // This can be obtained from the Credentials page of the Google APIs
      // console. Use the same OAuth client ID used for the Google provider
      // configured with GCIP or Firebase Auth.
      clientId:
        "371898195484-h9u5t427qjv10ei0bpopseu1qhlkrg15.apps.googleusercontent.com",
    },
    {
      provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
      signInMethod: firebase.auth.EmailAuthProvider.EMAIL_LINK_SIGN_IN_METHOD,
      requireDisplayName: false,
      forceSameDevice: false,
    },
  ],

  // Required to enable one-tap sign-up credential helper.
  //credentialHelper: firebaseui.auth.CredentialHelper.GOOGLE_YOLO,

  callbacks: {
    signInSuccessWithAuthResult: function (authResult, redirectUrl) {
      // TRIGGERS UPON SUCCESSFUL -INITIAL- SIGN-IN VIA THE UI
      //
      // If it returns true, then after signing in, user will be redirected to the URL that is specified
      // by signInSuccessUrl. When it returns false, the user will stay on the same page.
      console.log("Firebase Sign-in: ", authResult.user.email, authResult.user.uid);

      checkUserExists(authResult.user.uid)

      authCheck();
      return false;
    },
    signInFailure: function (error) {
      // Some unrecoverable error occurred during sign-in.
      // Return a promise when error handling is completed and FirebaseUI
      // will reset, clearing any UI. This commonly occurs for error code
      // 'firebaseui/anonymous-upgrade-merge-conflict' when merge conflict
      // occurs. Check below for more details on this.
      return handleUIError(error);
    },
    uiShown: function () {
      // The widget is rendered.
      // Hide the loader.
      console.log("Firebase triggered  ('uiShown' callback)");
      //document.getElementById("loader").style.display = "none";
    },
  },
  // Default is redirect; popup may give a CORS error
  //signInFlow: "popup",
  signInSuccessUrl: "https://tv-series-library.web.app/",
  autoUpgradeAnonymousUsers: false,
  // Terms of service url.
  //tosUrl: '/',
  // // Privacy policy url.
  //privacyPolicyUrl: '/',
};

// Initialize the FirebaseUI Widget using Firebase. AUTH DIV MUST BE PRESENT, BUT CAN BE UN-DISPLAYED
const ui = new firebaseui.auth.AuthUI(auth);
// Start by executing:
//ui.start("#firebaseui-auth-container", uiConfig);

////////////////////////////////////////////////////////

const createUserLibrary = async (userId) => {
  //ONLY CALL THIS IF THE USER LIBRARY IS NON-EXISTENT
  await setDoc(doc(db, "users", userId), {
    libraryJSONString: null,
  });
  console.log("User Library JSON string field created!");
};

const updateUserLibrary = async (userId, data) => {
  await updateDoc(doc(db, "users", userId), {
    libraryJSONString: data,
    timestamp: serverTimestamp(),
  });
  console.log("User Library JSON string updated!");
};

// document.querySelector("#test").addEventListener("click", () => {
//   const userId = "wcQtEPBFJJN9hpRYyc02AFwNfNv1"; // Replace with the actual user ID
//   updateUserLibrary(userId, "CUNT");
// });

////////////////////////////////////////////////////////
const checkUserExists = async (userId) => {
  // Checks to see if the given userID has a library ("document") already
  // If yes - do nothing.
  // If no - creates an empty one to be used later.

  const userRef = doc(db, "users", userId);

  const userDocSnapshot = await getDoc(userRef);

  const data = userDocSnapshot.data();

  // Check if the user / document exists
  if (userDocSnapshot.exists() && data.libraryJSONString != null) {
    console.log("User exists! Document data:");
    console.log(data);
    //if yes, does nothing. It exists, it will get called upon later
  } 
  else {
    if (!userDocSnapshot.exists()) {
      console.log("No such user!");
      //if no, then create uid.libraryJson and init as null
      //this takes place WITHIN the else - a double check measure
      await createUserLibrary(userId);
    } else console.log("User exists and library is still null - ready to use");
  }
};

// Example usage:
// document.querySelector("#test2").addEventListener("click", () => {
//   const userId = "wcQtEPBFJJN9hpRYyc02AFwNfNv3"; // Replace with the actual user ID
//   checkUserExists(userId);
// });
////////////////////////////////////////////////////////

export { auth, uiConfig, ui, checkUserLibrary };

// https://github.com/firebase/firebaseui-web
