////////////////////////////////////////////////////////
export { authCheck }
////////////////////////////////////////////////////////
import { auth, uiConfig, ui } from "./firebasestuff.js";
import { doc } from "firebase/firestore";
/////////////////////////////////////////////////////////
const signOutButton = document.querySelector("#signOut")
signOutButton.addEventListener("click", signOut );

const core = document.querySelector("#coreContainer");

let library = [];

const libraryDiv = document.querySelector("#library");
/////////////////////////////////////////////////////////
// Loader needed in all 3 cases:
// Pageload into a signed-out state
// Pageload into a signed-in state
// Pageload into a redirect
/////////////////////////////////////////////////////////


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

  displaySwitch("auth")
  // Start FirebaseUI
   ui.start("#firebaseui-auth-container", uiConfig)
    //also, authCheck() gets run BY firebaseUI upon success

  displaySwitch("loader")
  // Switches to loader while loading/checking user auth...
    //...which then re-displays as appropriate (see below)
} else {
  // Not a redirect, proceed with auth check
  authCheck();
}


// Check Auth State - I.E - decide to show login or not show login
async function authCheck() {
  // Wait for the auth check
  const user = await new Promise(resolve => {
    auth.onAuthStateChanged(resolve);
  });

  if (user) {
    // User is signed in
    console.log("Checked: User is signed in:", user.email);

    //"Add a show" header is hidden initially
    //this loads it upon user sign-in
    document.querySelector("#header2").style.display = "flex";

    getLibrary();

    if(!emptyChecker()){
      //if library isn't empty, then:
    displaySwitch("library")
    renderCards(library)
    }

    signOutButton.style.display = "inline-flex"
    //and show the sign out button
  } else {
    // User is signed out
    console.log("Checked: User is signed out");

    displaySwitch("auth")
    ui.start('#firebaseui-auth-container', uiConfig);
  }
}

/////////////////////////////////////////////////////////
function signOut() {
  auth.signOut();
  signOutButton.style.display = "none";

  location.reload()
  //refreshes page
}
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
    //sendLib must be IN the timeout func for it to run on time
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
export function submissionTasks() {
  const obj = formSubmission();
  const card = createCard(obj);
  card.setAttribute("data-complete", obj.complete);
  //IF 'complete' is true, it highlights the card

  displaySwitch("library")

  renderCards(library)

  libraryDiv.appendChild(card);

  closeModal();

  library.push(obj);
  sendLibrary();
}
window.submissionTasks = submissionTasks;
/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////
export function modalOpenTasks() {
  
  scrollTo(0, 0);
  document.querySelector("form").reset();
  document.querySelector("#formDialog").showModal();
  document.querySelector("#formImg").src = "./cloudNew.svg"

  document.querySelector("#formDialog h2").innerHTML = "Add a series";
  document.querySelector("#formDialog a").style.pointerEvents = "none";

  document.querySelector("#linkImg").style.display = "none";

  document.querySelector("#filmingComplete").style.opacity = "0.3";
  document.querySelector("#no").disabled = true;
  document.querySelector("#yes").disabled = true;
  document.querySelector("#yes").style.cursor = "not-allowed";
  document.querySelector("#no").style.cursor = "not-allowed";

  document.querySelector("#saveSeries").disabled = true;
  // document.body.style.position = "sticky";
  document.body.style.overflowY = "hidden";

  // if (screen.orientation.type === "landscape-primary") {
  //   document.body.style.paddingRight = "15px";
  //   document.querySelector("#header").style.width = "calc(100% + 15px)";
  //   document.querySelector("#header").style.paddingRight = "15px";
  // }

  setTimeout(function () {
    document.getElementById("seriesName").focus();
  }, 100);
  //Sets focus to input field on modal load - needs a timeout for some reason
}
window.modalOpenTasks = modalOpenTasks;
//--this is some wacky shit, and on mobile, it seems to move to the LEFT
//"fixed" this with viewport size checking.

export function closeModal() {
  // document.body.style.removeProperty('position');
  //document.body.style.overflowY = "visible";
  // document.body.style.position = "";

  // if (screen.orientation.type === "landscape-primary") {
  //   document.body.style.paddingRight = "";
  //   document.querySelector("#header").style.width = "100%";
  //   document.querySelector("#header").style.paddingRight = "";
  //   document.querySelector("#coreContainer").style.paddingLeft = "";
  // }
  document.querySelector("#formDialog").close();
}
window.closeModal = closeModal;
/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////
//-----------------------------------------------------------------------------//
function sendLibrary() {
  localStorage.setItem("localContent", JSON.stringify(library));
  //set a localStorage item called "localContent", set it as a stringified library[]
  //emptyChecker();
  //moved to card remove
}
function getLibrary() {
  if (localStorage.getItem("localContent") !== null) {
    let data = localStorage.getItem("localContent");
    //get localStorage item "localContent" (which is a string)
    data = JSON.parse(data);
    //parses (de-strings) library
    //IMPORTANTLY, still needs to be MAPPED to a proper array of objects using 'reSeries':
    data = reSeries(data);
    //NOTE: called "data", but it's effectively the library[]
    data.forEach((ObjFromArray) => {
      library.push(ObjFromArray);
    });
    //runs through each obj in the pulled data and pushes to library[] (cant just push whole thing)
  } else return;
}
//-----------------------------------------------------------------------------//
//////////////////////////////////////////////////////////////////////////////////
//The Magic//
//Since adding welcome screen, this probably shouldn't run at startup//
getLibrary();
//renderCards(library);
////////////////////

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
  console.log("Empty checker triggered")
  if (library.length === 0) {
    //document.querySelector("div#coreContainer").innerHTML = joePieHtml;

    //document.querySelector("#joePie").style.display = "flex";
    displaySwitch("joePie")
    return true
   } else displaySwitch("library")
  return false
}
//emptyChecker();
////////////////////
function displaySwitch(mode) {
  document.querySelector("#joePie").style.display = "none";
  document.querySelector("#welcome").style.display = "none";
  document.querySelector("#loader").style.display = "none";
  document.querySelector("#library").style.display = "none";
  switch(mode) {
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

////////////Actually runs the card-creation function, and then appends that card to the page
function renderCards(givenLibrary) {
  if (givenLibrary) {
    givenLibrary.forEach((ObjFromArray) => {
      //Note that 'card' here is different in scope!! And is therefore separate. Confusing huh
      const card = createCard(ObjFromArray);
      //passing it the object to 'construct' a card from
      card.setAttribute("data-complete", ObjFromArray.complete);
      //IF 'complete' is true, it highlights the card
      libraryDiv.appendChild(card);
    });
  } else return;
}
///////
////////Creates a card based on array object, but doesn't append tp page yet////////////
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
  completeP.classList.add("card1stRowText")
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
  linkP.classList.add("card2ndRowText")
  const linkStrong = document.createElement("strong");
  const linkA = document.createElement("a");
  linkA.textContent = "Link";
  linkA.href = obj.link;
  linkP.appendChild(linkStrong);
  linkStrong.appendChild(linkA);
  let linkSvg = document.createElement("img");
  linkSvg.src = "./link.svg"
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
      // throw new Error(`API error: ${response.status}`);
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

//--------------------------------------------------------//
// Define an array of color schemes
const colorSchemes = [
  {
    header: "#22334B",
    main: "#2e2b2d",
    highlighted: "34, 51, 75",
  },
  {
    header: "#36221f",
    main: "#6e5c5c",
    highlighted: "54, 34, 31",
  },
  {
    header: "#771c11",
    main: "#342321",
    highlighted: "119, 28, 17",
  },
];

let currentSchemeIndex = parseInt(localStorage.getItem("currentSchemeIndex"));

if (isNaN(currentSchemeIndex)) {
  currentSchemeIndex = 0;
}

// Set the initial color scheme on page load
function setColors() {
  if (currentSchemeIndex !== undefined) {
    let currentScheme = colorSchemes[currentSchemeIndex];
    document.documentElement.style.setProperty(
      "--header",
      currentScheme.header
    );
    document.documentElement.style.setProperty("--main", currentScheme.main);
    document.documentElement.style.setProperty(
      "--highlighted",
      currentScheme.highlighted
    );
  }
}
setColors();

// Update the color scheme on button click
document.querySelector("#colors").addEventListener("click", function () {
  currentSchemeIndex = (currentSchemeIndex + 1) % colorSchemes.length;
  setColors();
  localStorage.setItem("currentSchemeIndex", currentSchemeIndex);
});
//--------------------------------------------------------//
