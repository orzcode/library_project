import firebase from "firebase/compat/app";
import * as firebaseui from "firebaseui";
import "firebaseui/dist/firebaseui.css";

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCgWOsD40-y422erIMNultdmSBmcP5c_VY",
  authDomain: "tv-series-library.firebaseapp.com",
  databaseURL: "https://tv-series-library-default-rtdb.firebaseio.com",
  projectId: "tv-series-library",
  storageBucket: "tv-series-library.appspot.com",
  messagingSenderId: "371898195484",
  appId: "1:371898195484:web:6d181e6ccf75b8410ec9d9",
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);
const db = getFirestore(app);

const uiConfig = {
  signInOptions: [
    {
      provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
      signInMethod: firebase.auth.EmailAuthProvider.EMAIL_LINK_SIGN_IN_METHOD,
      requireDisplayName: false,
      forceSameDevice: false,
    },
  ],
  callbacks: {
    signInSuccessWithAuthResult: function (authResult, redirectUrl) {
      // User successfully signed in.
      // Return type determines whether we continue the redirect automatically
      // or whether we leave that to developer to handle.
      return true;
    },
    uiShown: function () {
      // The widget is rendered.
      // Hide the loader.
      document.getElementById("loader").style.display = "none";
    },
  },
  // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
  signInFlow: "popup",
  signInSuccessUrl: "<url-to-redirect-to-on-success>",
};

// Check for pending redirect
if (firebaseui.auth.AuthUI.getInstance() && firebaseui.auth.AuthUI.getInstance().isPendingRedirect()) {
  firebaseui.auth.AuthUI.getInstance().start('#firebaseui-auth-container', uiConfig);
} else {
  // Initialize the FirebaseUI Widget using Firebase.
  const ui = new firebaseui.auth.AuthUI(auth);
  // The start method will wait until the DOM is loaded.
  ui.start("#firebaseui-auth-container", uiConfig);
}

export { auth, database, db, uiConfig };