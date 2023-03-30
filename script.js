let library = [];
let libraryDiv = document.querySelector("#library");
////////////////////////////////////////////////////
document.querySelector('#colors').addEventListener("click", function () {
  document.documentElement.style.setProperty('--header', 'var(--header5)');
  document.documentElement.style.setProperty('--main', 'var(--main5)');
  document.documentElement.style.setProperty('--highlighted', 'var(--highlighted5)');
})
///////////////////
//FIREBASE
// import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
// import { getAuth } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js";
// import {
//   getDatabase,
//   ref,
//   onValue,
//   child,
//   get,
//   push,
//   update,
//   set,
//   increment,
//   runTransaction,
// } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-database.js";
// const firebaseConfig = {
//   apiKey: "AIzaSyCgWOsD40-y422erIMNultdmSBmcP5c_VY",
//   authDomain: "tv-series-library.firebaseapp.com",
//   databaseURL: "https://tv-series-library-default-rtdb.firebaseio.com",
//   projectId: "tv-series-library",
//   storageBucket: "tv-series-library.appspot.com",
//   messagingSenderId: "371898195484",
//   appId: "1:371898195484:web:6d181e6ccf75b8410ec9d9",
// };

// const app = initializeApp(firebaseConfig);
// const auth = getAuth(app);
// const database = getDatabase(app);

//FIREBASE
///////////////////

////////////////////
//Series constructor function//
export function Series(title, complete, link, image) {
  this.title = title;
  this.complete = complete;
  this.link = link;
  this.image = image;
}
Series.formSubmission = function () {
  return new Series(
    document.querySelector("dialog h2").innerHTML,
    document.querySelector('input[name="filmingComplete"]:checked').value,
    document.querySelector("dialog a").href,
    document.querySelector("#formImg").src
  );
};
Series.toggle = function (theObj) {
  var card = event.target.closest(".card");

  // scale down and fade out the card
  card.style.opacity = 0;
  card.style.transform = "scale(0.1)";

  setTimeout(function() {
    if (theObj.complete === "Ongoing") {
      theObj.complete = "Complete";
    } else {
      theObj.complete = "Ongoing";
    }

    // update the visual text on the card
    card.setAttribute("data-complete", theObj.complete);
    card.querySelector("p p").textContent = theObj.complete;

    // shift the card's position by changing its order
    // if (theObj.complete === "Complete") {
    //   card.style.order = 1;
    // } else {
    //   card.style.order = 2;
    // }
    //Seems unneccessary

    // scale up and fade in the card
    card.style.opacity = 1;
    card.style.transform = "scale(1)";
  }, 300); // wait 300ms (the duration of the transition) before changing the card's state and position
  sendLibrary();
};
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
//clean this up?
export function submissionTasks() {
  const obj = Series.formSubmission();
  const card = createCard(obj);
  card.setAttribute("data-complete", obj.complete);
  //IF 'complete' is true, it highlights the card
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
  document.querySelector("dialog").showModal();
  document.querySelector("#formImg").src = "cloudNew.svg";

  document.querySelector("dialog h2").innerHTML = "Add a series";
  document.querySelector("dialog a").style.pointerEvents = "none";

  document.querySelector("#linkImg").style.display = "none";

  document.querySelector("#filmingComplete").style.opacity = "0.3";
  document.querySelector("#no").disabled = true;
  document.querySelector("#yes").disabled = true;
  document.querySelector("#yes").style.cursor = "not-allowed";
  document.querySelector("#no").style.cursor = "not-allowed";

  document.querySelector("#saveSeries").disabled = true;
  // document.body.style.position = "sticky";
  document.body.style.overflowY = "hidden";

  if (screen.orientation.type === "landscape-primary") {
    document.body.style.paddingRight = "15px";
    document.querySelector("#header").style.width = "calc(100% + 15px)";
    document.querySelector("#header").style.paddingRight = "15px";
  }
}
window.modalOpenTasks = modalOpenTasks;
//--this is some wacky shit, and on mobile, it seems to move to the LEFT
//"fixed" this with viewport size checking.

export function closeModal() {
  // document.body.style.removeProperty('position');
  document.body.style.overflowY = "visible";
  // document.body.style.position = "";

  if (screen.orientation.type === "landscape-primary") {
    document.body.style.paddingRight = "";
    document.querySelector("#header").style.width = "100%";
    document.querySelector("#header").style.paddingRight = "";
    document.querySelector("#library").style.paddingLeft = "";
  }
  document.querySelector("dialog").close();
}
window.closeModal = closeModal;
/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////
//-----------------------------------------------------------------------------//
function sendLibrary() {
  localStorage.setItem("localContent", JSON.stringify(library));
  //set a localStorage item called "localContent", set it as a stringified library[]
  emptyChecker()
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
getLibrary();
renderCards(library);
////////////////////

//This function runs when you click 'Query'
/////////////////////
export function queryData() {
  document.querySelector("dialog h2").style.visibility = "hidden";
  document.querySelector("#linkImg").style.display = "none";

  document.querySelector("#filmingComplete").style.opacity = "0.3";
  document.querySelector("#no").disabled = true;
  document.querySelector("#yes").disabled = true;
  document.querySelector("#yes").style.cursor = "not-allowed";
  document.querySelector("#no").style.cursor = "not-allowed";

  document.querySelector("#saveSeries").disabled = true;

  document.querySelector("#formImg").src = "ripple.svg";

  const searchTerm = document.querySelector("#seriesName").value;
  document.querySelector("#seriesName").value = "";

  getDataFromTVMaze(searchTerm)
    .then((data) => {
      if (data)
        console.log("API Fetch complete: " + [data.name, data.url, data.image]);

      document.querySelector("dialog h2").innerHTML = data.name;
      document.querySelector("dialog h2").style.visibility = "visible";
      document.querySelector("#title").href = data.url;

      document.querySelector("#link").href = data.url;
      document.querySelector("#linkImg").style.display = "block";
      document.querySelector("dialog a").style.pointerEvents = "auto";

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

      document.querySelector("dialog h2").style.visibility = "visible";
      document.querySelector("dialog h2").innerHTML = `${error.message}`;

      document.querySelector("#linkImg").style.display = "none";

      document.querySelector("#saveSeries").disabled = true;
      document.querySelector("#formImg").src = "cloudError.svg";
    });
}
window.queryData = queryData;
////////////////////

////////////////////
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

  // const titleP = document.createElement("p");
  // const titleStrong = document.createElement("strong");
  // titleStrong.textContent = obj.title;
  // titleStrong.className = "title";
  // titleP.appendChild(titleStrong);

  // card.appendChild(titleP);

  const completeP = document.createElement("p");
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
    Series.toggle(obj);
  });

  card.appendChild(completeP);

  const linkP = document.createElement("p");
  const linkStrong = document.createElement("strong");
  const linkA = document.createElement("a");
  linkA.textContent = "Link";
  linkA.href = obj.link;
  linkP.appendChild(linkStrong);
  linkStrong.appendChild(linkA);
  let linkSvg = document.createElement("img");
  linkSvg.src = "link.svg";
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
//Checks if library is empty, displays default image if so//
function emptyChecker(){
  if (library.length === 0) {
  document.querySelector('#joePie').style.display = 'flex';
} else document.querySelector('#joePie').style.display = 'none'
}
emptyChecker()