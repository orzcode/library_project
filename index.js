import setColors from "./colors.js";
setColors();
import { sendLibrary, getLibrary } from "./importExport.js";
import { modalOpenTasks, closeModal, queryData } from "./modalQuery.js"
import createCard from "./cardCreator.js";
////////////////////////////////////////////////////////
import { auth, uiConfig, ui, UserLibrary } from "./firebasestuff.js";
/////////////////////////////////////////////////////////
let library = [];
const libraryDiv = document.querySelector("#library");
/////////////////////////////////////////////////////////
export {authCheck, sendLibrary, emptyChecker, library}
////////////////////////////////////////////////////////
// Loader needed in all 3 cases:
// Pageload into a signed-out state
// Pageload into a signed-in state
// Pageload into a redirect
/////////////////////////////////////////////////////////

// Session-based Library[] is the go-between, from which cards are rendered, everything saved etc.
// A pure array of objects; structured Series data.

// localstorage.localContent and/or firebase are the remote 'saved' versions
// which are encoded as a string - must be decoded back to Series array first
// Which is why the library[] exists - that's where it gets put.

// I.E: upon first sign-in or any change (card create, toggle, delete)
// the remote is GET or SENT to pull/push (with encoding/decoding applied too)

//////////////////////////////////////////////
//---------- INITIAL STARTUP FLOW ----------//
//////////////////////////////////////////////

// REQUIRED FOR FIREBASE UI UPON A SIGN-IN REDIRECT
// AUTH DIV MUST BE PRESENT
//
// Runs on page load in order to check if a redirect from Auth provider
if (ui.isPendingRedirect()) {
  //If they ARE loading from a redirect:
  //Loader already shown natively on pageload
  //append Auth & start UI - hide Auth - (run Auth Check)

  console.log("'pending redirect' triggered");

  displaySwitch("auth");
  // Start FirebaseUI
  ui.start("#firebaseui-auth-container", uiConfig);
  //also, authCheck() gets run BY firebaseUI upon success

  displaySwitch("loader");
  // Switches to loader while loading/checking user auth...
  //...which then re-displays as appropriate (see below)
} else {
  // Not a redirect, proceed with auth check
  authCheck();
}

// Check Auth State - I.E - decide to show login or not show login
async function authCheck() {
  // Wait for the auth check
  const user = await new Promise((resolve) => {
    auth.onAuthStateChanged(resolve);
  });

  if (user) {
    // User is signed in
    console.log("authCheck(): User is signed in:", user.email, user.uid);

    UserLibrary.setUserId(user.uid);
    //sets this user's ID for automatic library get/save operations

    await initialEntry()
    //Initial load-up of library/exiting welcome screen

    signOutButton.style.display = "inline-flex";
    //and show the sign out button
  } else {
    // User is signed out
    console.log("Checked: User is signed out");

    displaySwitch("auth");
    ui.start("#firebaseui-auth-container", uiConfig);
  }
}
/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
const signOutButton = document.querySelector("#signOut");
signOutButton.addEventListener("click", function() {
  signInOut("out");
});
const signInButton = document.querySelector("#signIn");
signInButton.addEventListener("click", function() {
  signInOut("in");
});

document
  .querySelector(".authBtnsDiv")
  .appendChild(document.querySelector("#demoMode"));
document.querySelector("#demoMode").addEventListener("click", demoButton);

async function demoButton() {
  await initialEntry()
  signInButton.style.display = "inline-flex";
  //show the sign-in button
}

async function initialEntry() {
  await getLibrary().then(() => {
    //"Add a show" header is hidden initially
    //this loads it upon user sign-in
    //could change to 'opacity' so it jars less?
    document.querySelector("#header2").style.display = "flex";

    if (!emptyChecker()) {
      //if library isn't empty, then:
      displaySwitch("library");
      renderCards(library);
    }
  });
}
function signInOut(type) {
  switch (type) {
    case "out":
      auth.signOut();
      signOutButton.style.display = "none";
      break;
    case "in":
      signInButton.style.display = "none";
      break;
  }
  location.reload();
  //refreshes page
}
/////////////////////////////////////////////////////////





/////////////////////////////////////////////////////////
//Series constructor function//
export class Series {
  constructor(title, complete, link, image) {
    this.title = title;
    this.complete = complete;
    this.link = link;
    this.image = image;
  }
}

function formSubmission() {
  return new Series(
    document.querySelector("#formDialog h2").innerHTML,
    document.querySelector('input[name="filmingComplete"]:checked').value,
    document.querySelector("#formDialog a").href,
    document.querySelector("#formImg").src
  );
}

window.Series = Series;
////////////////////////////////////////////////////////////

// Runs when hitting 'Save' from the dialog screen
export function submissionTasks() {
  const obj = formSubmission();
  const card = createCard(obj);
  card.setAttribute("data-complete", obj.complete);
  //IF 'complete' is true, it highlights the card

  library.push(obj);

  displaySwitch("library");

  libraryDiv.appendChild(card);
  //adds/renders a single card visually; local session-based Library[] & saved version below

  closeModal();

  sendLibrary();
  //updates/saves to remote (localstorage or DB)
}
window.submissionTasks = submissionTasks;
/////////////////////////////////////////////////////////////////////////////////

////////////////////
//Checks if library is empty, displays default image if so//
function emptyChecker() {
  if (library.length === 0) {
    displaySwitch("joePie");
    return true;
  } else displaySwitch("library");
  return false;
}
////////////////////////////////////////////////////////////
function displaySwitch(mode) {
  document.querySelector("#joePie").style.display = "none";
  document.querySelector("#welcome").style.display = "none";
  document.querySelector("#loader").style.display = "none";
  document.querySelector("#library").style.display = "none";

  switch (mode) {
    case "joePie":
      document.querySelector("#joePie").style.display = "flex";
      break;
    case "auth":
      document.querySelector("#welcome").style.display = "flex";
      break;
    case "loader":
      document.querySelector("#loader").style.display = "block";
      break;
    case "library":
      document.querySelector("#library").style.display = "grid";
      break;
  }
}
////////////////////////////////////////////////////////////
// Actually runs the card-creation function, and then appends that card to the page
// Renders based on the session-based Library[]
function renderCards(givenLibrary) {
  if (givenLibrary) {
    givenLibrary.forEach((ObjFromArray) => {
      //Note that 'card' here is different in scope!! And is therefore separate. Confusing huh
      const card = createCard(ObjFromArray);
      //passing it the object to 'construct' a card from
      card.setAttribute("data-complete", ObjFromArray.complete);
      //IF 'complete' is true, it highlights the card
      libraryDiv.appendChild(card);
      //dont be confused - it's appending EVERY child (of the session-based Library[])
    });
  } else return;
}
//////