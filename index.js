import setColors from "./colors.js";
setColors();
////////////////////////////////////////////////////////
export { authCheck };
////////////////////////////////////////////////////////
import { auth, uiConfig, ui, UserLibrary } from "./firebasestuff.js";
/////////////////////////////////////////////////////////
let library = [];
const libraryDiv = document.querySelector("#library");
/////////////////////////////////////////////////////////
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

function toggle(theObj) {
  let card = event.target.closest(".card");

  // scale down and fade out the card
  card.style.opacity = 0;
  card.style.transform = "scale(0.1)";

  setTimeout(function () {
    if (theObj.complete === "Ongoing") {
      theObj.complete = "Complete";
    } else {
      theObj.complete = "Ongoing";
    }

    // update the visual text on the card
    card.setAttribute("data-complete", theObj.complete);
    card.querySelector("p p").textContent = theObj.complete;

    // scale up and fade in the card
    card.style.opacity = 1;
    card.style.transform = "scale(1)";
    sendLibrary();
    //(sendLibrary must be IN the timeout func for it to run on time)
    //as you can see, this updates the object in the session-based Library[]; prior to sending
  }, 300); // wait 300ms (the duration of the transition) before changing the card's state and position
}
window.Series = Series;
////////////////////////////////////////////////////////////
//Reconstructs a Series array from raw string data - to use, call this onto a new var
function reSeries(unconstructedArray) {
  if (unconstructedArray) {
    return unconstructedArray.map(
      ({ title, complete, link, image }) =>
        new Series(title, complete, link, image)
    );
  } else return;
}
///////////////////
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
/////////////////////////////////////////////////////////////////////////////////
export function modalOpenTasks() {
  scrollTo(0, 0);
  document.querySelector("form").reset();
  document.querySelector("#formDialog").showModal();
  document.querySelector("#formImg").src = "./cloudNew.svg";

  document.querySelector("#formDialog h2").innerHTML = "Add a series";
  document.querySelector("#formDialog a").style.pointerEvents = "none";

  document.querySelector("#linkImg").style.display = "none";

  document.querySelector("#filmingComplete").style.opacity = "0.3";
  document.querySelector("#no").disabled = true;
  document.querySelector("#yes").disabled = true;
  document.querySelector("#yes").style.cursor = "not-allowed";
  document.querySelector("#no").style.cursor = "not-allowed";

  document.querySelector("#saveSeries").disabled = true;
  document.body.style.overflowY = "hidden";

  setTimeout(function () {
    document.getElementById("seriesName").focus();
  }, 100);
  //Sets focus to input field on modal load - needs a timeout for some reason
}
window.modalOpenTasks = modalOpenTasks;

export function closeModal() {
  document.querySelector("#formDialog").close();
}
window.closeModal = closeModal;
/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////
//-----------------------------------------------------------------------------//
async function sendLibrary() {
  const data = JSON.stringify(library);

  if (data != []) {
    localStorage.setItem("localContent", data);
    //set a localStorage item called "localContent", set it as a stringified library[]
    //I.E: takes whatever is in the session-based Library[] and saves/sends
    UserLibrary.updateUserLibrary(data);
    //also updates firebase Library
  } else return;
}

async function getLibrary() {
  let firebaseData = await UserLibrary.getUserLibrary();

  let localData = localStorage.getItem("localContent");

  // Parse and convert data to array of objects
  const rematerialize = (data) => {
    data = JSON.parse(data);
    data = reSeries(data);
    // Add to library
    data.forEach((ObjFromArray) => {
      library.push(ObjFromArray);
    });
  };

  if (firebaseData !== null && firebaseData !== undefined && !(firebaseData instanceof Error)) {
    // If Firebase Library has data, use it
    rematerialize(firebaseData);
  } else if (localData !== null && localData != undefined) {
    // If Firebase Library doesn't have data but localStorage does, use localStorage data
    rematerialize(localData);
  } else {
    // If neither Firebase Library nor localStorage have data, return
    return;
  }
}
//-----------------------------------------------------------------------------//

//This function runs when you click 'Query'
/////////////////////
export function queryData() {
  document.querySelector("#formDialog h2").style.visibility = "hidden";
  document.querySelector("#linkImg").style.display = "none";

  document.querySelector("#filmingComplete").style.opacity = "0.3";
  document.querySelector("#no").disabled = true;
  document.querySelector("#yes").disabled = true;
  document.querySelector("#yes").style.cursor = "not-allowed";
  document.querySelector("#no").style.cursor = "not-allowed";

  document.querySelector("#saveSeries").disabled = true;

  document.querySelector("#formImg").src = "./ripple.svg";

  const searchTerm = document.querySelector("#seriesName").value;
  document.querySelector("#seriesName").value = "";

  getDataFromTVMaze(searchTerm)
    .then((data) => {
      if (data)
        console.log("API Fetch complete: " + [data.name, data.url, data.image]);

      document.querySelector("#formDialog h2").innerHTML = data.name;
      document.querySelector("#formDialog h2").style.visibility = "visible";
      document.querySelector("#title").href = data.url;

      document.querySelector("#link").href = data.url;
      document.querySelector("#linkImg").style.display = "block";
      document.querySelector("#formDialog a").style.pointerEvents = "auto";

      document.querySelector("#filmingComplete").style.opacity = "1";
      document.querySelector("#no").disabled = false;
      document.querySelector("#yes").disabled = false;
      document.querySelector("#yes").style.cursor = "pointer";
      document.querySelector("#no").style.cursor = "pointer";

      document.querySelector("#saveSeries").disabled = false;
      document.querySelector("#formImg").src = data.image;
    })
    .catch((error) => {
      console.error(error);

      document.querySelector("#formDialog h2").style.visibility = "visible";
      document.querySelector("#formDialog h2").innerHTML = `${error.message}`;

      document.querySelector("#linkImg").style.display = "none";

      document.querySelector("#saveSeries").disabled = true;
      document.querySelector("#formImg").src = "./cloudError.svg";
    });
}
window.queryData = queryData;
////////////////////
//Checks if library is empty, displays default image if so//
function emptyChecker() {
  if (library.length === 0) {
    displaySwitch("joePie");
    return true;
  } else displaySwitch("library");
  return false;
}
//emptyChecker();
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
///////
////////Creates a card based on array object, but doesn't append to page yet////////////
//In other words, even though this is a long function, it's all just creating the card structure
//
//Note that 'card' here is different in scope!! And is therefore separate. Confusing huh

//This function gets called from something else (renderCards)
function createCard(obj) {
  const card = document.createElement("div");
  card.className = "card";

  const banner = document.createElement("img");
  banner.src = obj.image;
  banner.alt = "Thumbnail";

  card.appendChild(banner);

  const completeP = document.createElement("p");
  completeP.classList.add("card1stRowText");
  const completeStrong = document.createElement("strong");
  completeStrong.textContent = "Filming: ";
  completeP.appendChild(completeStrong);

  const completeToggle = document.createElement("p");
  completeToggle.textContent = obj.complete;
  completeToggle.style.display = "inline";
  completeP.appendChild(completeToggle);

  //Toggles the 'Ongoing/Complete' status (see main function)
  //as you can see, this sends the SPECIFIC card to the function - brilliant.
  completeToggle.addEventListener("click", function () {
    toggle(obj);
  });

  card.appendChild(completeP);

  const linkP = document.createElement("p");
  linkP.classList.add("card2ndRowText");
  const linkStrong = document.createElement("strong");
  const linkA = document.createElement("a");
  linkA.textContent = "Link";
  linkA.href = obj.link;
  linkP.appendChild(linkStrong);
  linkStrong.appendChild(linkA);
  let linkSvg = document.createElement("img");
  linkSvg.src = "./link.svg";
  linkA.appendChild(linkSvg);

  card.appendChild(linkP);

  const removeStrong = document.createElement("strong");
  const removeEm = document.createElement("em");
  removeEm.textContent = "Remove?";

  //REMOVAL BUTTON
  removeEm.addEventListener("click", confirmRM, true);
  function confirmRM() {
    const card = this.closest(".card");

    //actual stuff that happens on 2nd click is in this bit
    if (removeEm.dataset.clicked === "true") {
      this.closest(".card").style.opacity = 0;
      setTimeout(() => {
        card.remove();
      }, 400);
      removeFromLibrary(obj.title);
      return;
    }
    //actual stuff that happens on 2nd click is in this bit

    removeEm.dataset.clicked = "true";
    removeEm.textContent = "Confirm remove?";

    setTimeout(() => {
      removeEm.dataset.clicked = "false";
      removeEm.textContent = "Remove?";
    }, 3000);
  }

  function removeFromLibrary(objTitle) {
    const index = library.findIndex((obj) => obj.title === objTitle);
    if (index !== -1) {
      library.splice(index, 1);
      sendLibrary();
      emptyChecker();
    }
    //finds the right object in the array (based on title) and removes from Library natively
    //then runs the sendLibrary function to remove from remote
    //naturally if this was the last item, it'd need to check for an empty library too
  }
  ////////////////
  linkP.appendChild(removeStrong);
  removeStrong.appendChild(removeEm);

  linkP.appendChild(removeStrong);

  return card;
}
//------------------------------------------------------------------------------//
/////////DATA FETCHER/////////////
async function getDataFromTVMaze(searchTerm) {
  const searchUrl = `https://api.tvmaze.com/singlesearch/shows?q=${searchTerm}`;
  try {
    const response = await fetch(searchUrl);
    if (!response.ok) {
      throw new Error(`No result for "${searchTerm}"`);
    }
    const data = await response.json();
    const name = data.name;
    const url = data.url;
    const image = data.image.medium;
    if (!name || !url || !image) {
      throw new Error(`No result for "${searchTerm}"`);
    }
    return { name, url, image };
  } catch (error) {
    throw new Error(`${error.message}`);
  }
}
//--------------------------------------------------------//
