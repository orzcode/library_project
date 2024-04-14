import firebase from "firebase/compat/app";
import * as firebaseui from "firebaseui";
import "firebaseui/dist/firebaseui.css";

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
//import { getDatabase } from "firebase/database";
import { initializeFirestore, getFirestore, collection, doc, getDoc, setDoc, addDoc } from "firebase/firestore";

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
//const database = getDatabase(app);
const db = getFirestore(app);
//const db = initializeFirestore(app, { experimentalAutoDetectLongPolling: true });

const uiConfig = {
  signInOptions: [
    {
      // Google provider must be enabled in Firebase Console to support one-tap
      // sign-up.
      provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      credentialHelper: firebaseui.auth.CredentialHelper.GOOGLE_YOLO,
      // Required to enable ID token credentials for this provider.
      // This can be obtained from the Credentials page of the Google APIs
      // console. Use the same OAuth client ID used for the Google provider
      // configured with GCIP or Firebase Auth.
      clientId: "371898195484-h9u5t427qjv10ei0bpopseu1qhlkrg15.apps.googleusercontent.com"
	},
	{
	  provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
      signInMethod: firebase.auth.EmailAuthProvider.EMAIL_LINK_SIGN_IN_METHOD,
      requireDisplayName: false,
      forceSameDevice: false,
    },
  ],
  // Required to enable one-tap sign-up credential helper.
  credentialHelper: firebaseui.auth.CredentialHelper.GOOGLE_YOLO,
  callbacks: {
    signInSuccessWithAuthResult: function (authResult, redirectUrl) {
      // User successfully signed in.
      // Return type determines whether we continue the redirect automatically
      // or whether we leave that to developer to handle.
      console.log("Firebase 'signInSuccessWithAuthResult' callback")
      return true;
    },
    uiShown: function () {
      // The widget is rendered.
      // Hide the loader.
      console.log("Firebase 'uiShown' callback")
      document.getElementById("loader").style.display = "none";
    },
  },
  // Default is redirect; popup may give a CORS error
  signInFlow: "redirect",
  signInSuccessUrl: '/',
  autoUpgradeAnonymousUsers: false,
    // Terms of service url.
    // tosUrl: '/',
    // // Privacy policy url.
    // privacyPolicyUrl: '/',
};

// Initialize the FirebaseUI Widget using Firebase.
const ui = new firebaseui.auth.AuthUI(auth);

// Is there an email link sign-in?
if (ui.isPendingRedirect()) {
  ui.start('#firebaseui-auth-container', uiConfig);
}

// Check for pending redirect
if (
  firebaseui.auth.AuthUI.getInstance() &&
  firebaseui.auth.AuthUI.getInstance().isPendingRedirect()
) {
  firebaseui.auth.AuthUI.getInstance().start(
    "#firebaseui-auth-container",
    uiConfig
  );
} else {  
  // The start method will wait until the DOM is loaded.
  ui.start("#firebaseui-auth-container", uiConfig);
}



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


export { auth, uiConfig };

// https://github.com/firebase/firebaseui-web