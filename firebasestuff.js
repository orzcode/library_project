import { handleAuthStateChange } from "./index.js";
import firebase from "firebase/compat/app";
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import * as firebaseui from "firebaseui";
import "firebaseui/dist/firebaseui.css";

import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { initializeFirestore, getFirestore, collection, doc, getDoc, setDoc, addDoc } from "firebase/firestore";

//import { getDatabase } from "firebase/database";
////////////////////////////////////////////////////////////

const core = document.querySelector("#coreContainer");
import libraryHtml from './libraryHtml.js'
import authHtml from './authHtml.js'
import loaderHtml from './loaderHtml.js'
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

//const database = getDatabase(app); <-- realtime db, not firestore
//const db = initializeFirestore(app, { experimentalAutoDetectLongPolling: true });

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
      clientId: "371898195484-h9u5t427qjv10ei0bpopseu1qhlkrg15.apps.googleusercontent.com",
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
      // User successfully signed in.
      // Return type determines whether we continue the redirect automatically
      // If it returns true, then after signing in, user will be redirected to the URL that is specified 
      // by signInSuccessUrl. When it returns false, the user will stay on the same page.
      console.log ("signInSuccess: ", authResult)
      return false;
    },
    signInFailure: function(error) {
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
      console.log("Firebase triggered ('uiShown' callback)")
      //document.getElementById("loader").style.display = "none";
      //instead, i can change this to replace loader with auth?
    },
  },
  // Default is redirect; popup may give a CORS error
  //signInFlow: "redirect",
  signInSuccessUrl: 'https://tv-series-library.web.app/',
  autoUpgradeAnonymousUsers: false,
    // Terms of service url.
     //tosUrl: '/',
    // // Privacy policy url.
     //privacyPolicyUrl: '/',
};

// Initialize the FirebaseUI Widget using Firebase.
const ui = new firebaseui.auth.AuthUI(auth);
//ui.start("#firebaseui-auth-container", uiConfig);

// Is there an email link sign-in?
//When redirecting back from Identity Providers like Google and Facebook
// or email link sign-in, start() method needs to be called to finish the sign-in flow
// if (ui.isPendingRedirect()) {
//   core.innerHTML = authHtml;
//   ui.start('#firebaseui-auth-container', uiConfig);
//   //put loader here?
//   //or dont use authstate?
//   console.log("'pending redirect' thing triggered")
// } else {
//   //core.innerHTML = authHtml;
//   //ui.start('#firebaseui-auth-container', uiConfig);
// }














////////////////////////////////////////////////////////

// Add a new document in collection "cities"
// const setFireStore = await setDoc(doc(db, "cities", "LA"), {
//   name: "Los Angeles",
//   state: "CA",
//   country: "USA"
// });

// //or maybe

// const addFireSTore = await addDoc(collection(db, "cities"), {
//   name: "Tokyo",
//   country: "Japan"
// });
// console.log("Document written with ID: ", docRef.id);

////////////////////////////////////////////////////////

// const docRef = doc(db, "cities", "SF");
// const docSnap = await getDoc(docRef);

// if (docSnap.exists()) {
//   console.log("Document data:", docSnap.data());
// } else {
//   // docSnap.data() will be undefined in this case
//   console.log("No such document!");
// }

////////////////////////////////////////////////////////


export { auth, uiConfig, ui };

// https://github.com/firebase/firebaseui-web