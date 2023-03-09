let library = [];
let libraryDiv = document.querySelector("#library");
////////////////////////////////////////////////////

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
//GIST
// const gistId = "5030015d1b6612eed934612108b3e63f";
// const filename = "library.txt";
// const ACCESSTOKEN = atob(
//   "Z2l0aHViX3BhdF8xMUFRNVdCNVkwN2Q0enFpbjE2Ull2X2NSYXRvOU1pNWFCTHVnYkJOUTFkRDBPZW04TEQ4ZTFCcUdadzVrQnFlOTBVSE5UQlpZRDRKYjdGRmlO"
// );
//Note to anyone reading:
//actually using a Github Secret is far, FAR more difficult than it needs to be
//I spent literally several hours trying half a dozen fixes and methods and none of them worked
//Since this is not a sensitive or critical app and nothing can be lost, I decided to say
//a great big "Fuck this" and simply use an encoded API key in the above way.
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
// async function getContentFromGist() {
//   const response = await fetch(`https://api.github.com/gists/${gistId}`, {
//     headers: {
//       Authorization: `token ${ACCESSTOKEN}`,
//     },
//   });
//   const data = await response.json();
//   const file = data.files[filename];
//   if (file) {
//     const content = JSON.parse(file.content);
//     return content;
//   } else {
//     console.error(`File ${filename} not found in Gist ${gistId}`);
//     return null;
//   }
// }

// async function gulpAndRender() {
//   const content = await getContentFromGist();
//   renderCards(content);
//   //console.log(content);
// }
///////////////////

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

////////////////////
library.push(
  new Series(
    "Mr Inbetween",
    true,
    "https://en.wikipedia.org/wiki/The_Expanse_(TV_series)",
    "https://static.tvmaze.com/uploads/images/medium_portrait/0/2142.jpg"
  )
);
library.push(
  new Series(
    "Mr Test",
    false,
    "https://en.wikipedia.org/wiki/The_Expanse_(TV_series)",
    "https://static.tvmaze.com/uploads/images/medium_portrait/0/2142.jpg"
  )
);
library.push(
  new Series(
    "Mr Truetest",
    true,
    "https://en.wikipedia.org/wiki/The_Expanse_(TV_series)",
    "https://static.tvmaze.com/uploads/images/medium_portrait/0/2142.jpg"
  )
);
library.push(
  new Series(
    "Mr Curious Man Doing Curious Things",
    false,
    "https://en.wikipedia.org/wiki/The_Expanse_(TV_series)",
    "https://static.tvmaze.com/uploads/images/medium_portrait/0/2142.jpg"
  )
);
////////////////////
//clean this up?
function submissionTasks() {
  const obj = Series.formSubmission();
  const card = createCard(obj);
  card.setAttribute("data-complete", obj.complete);
  //IF 'complete' is true, it highlights the card
  libraryDiv.appendChild(card);

  document.querySelector("dialog").close();

  library.push(obj);
  sendLibrary();
}
////////////////////
function sendLibrary() {
  localStorage.setItem("localContent", JSON.stringify(library));
  //set a localStorage item called "localContent", set it as a stringified library[]
}
function getLibrary() {
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
}

//The Magic//
getLibrary();
renderCards(library);
////////////////////
//This function runs when you click 'Query'
/////////////////////
export function queryData() {
  document.querySelector("dialog a").style.visibility = "hidden";
  document.querySelector("#filmingComplete").style.visibility = "hidden";
  document.querySelector("#saveSeries").style.visibility = "hidden";

  document.querySelector("#formImg").src = "spinner.svg";

  const searchTerm = document.querySelector("#seriesName").value;
  const url = `https://api.tvmaze.com/singlesearch/shows?q=${encodeURIComponent(
    searchTerm
  )}`;

  Promise.all([
    getPosterImageFromTVMaze(document.querySelector("#seriesName").value).then(
      (mainImage) => {
        document.querySelector("#formImg").src = mainImage;
      }
    ),

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        document.querySelector("dialog h2").innerHTML = data.name;
      })
      .catch((error) => {
        console.error(error);
        document.querySelector("dialog h2").innerHTML = "Error searching";
      }),

    getWikiLink(searchTerm).then((link) => {
      document.querySelector("dialog a").href = link;
    }),
  ])
    .then(() => {
      // All three parts of the queryData function have completed
      console.log("All parts of the queryData function have completed");
      document.querySelector("#filmingComplete").style.visibility = "visible";
      document.querySelector("#saveSeries").style.visibility = "visible";
      document.querySelector("dialog a").style.visibility = "visible";
    })
    .catch((error) => {
      console.error(error);
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

  const titleP = document.createElement("p");
  const titleStrong = document.createElement("strong");
  titleStrong.textContent = obj.title;
  titleStrong.className = "title";
  titleP.appendChild(titleStrong);

  card.appendChild(titleP);

  const completeP = document.createElement("p");
  const completeStrong = document.createElement("strong");
  completeStrong.textContent = "Complete: ";
  completeP.appendChild(completeStrong);
  completeP.appendChild(document.createTextNode(obj.complete ? "Yes" : "No"));

  card.appendChild(completeP);

  const linkP = document.createElement("p");
  const linkStrong = document.createElement("strong");
  const linkA = document.createElement("a");
  linkA.textContent = "Link";
  linkA.href = obj.link;
  linkP.appendChild(linkStrong);
  linkStrong.appendChild(linkA);
  linkA.after(" • ");

  card.appendChild(linkP);

  const removeStrong = document.createElement("strong");
  const removeEm = document.createElement("em");
  removeEm.textContent = "Remove?";
  linkP.appendChild(removeStrong);
  removeStrong.appendChild(removeEm);
  //NEED TO TURN THIS INTO A BUTTON
  //DECIDE HOW THIS SHOULD FLOW

  linkP.appendChild(removeStrong);

  return card;
}
//------------------------------------------------------------------------------//
function modalOpenTasks() {
  document.querySelector("form").reset();
  document.querySelector("dialog").showModal();
  document.querySelector("#formImg").src = "addMedia.svg";
  document.querySelector("dialog h2").innerHTML = "Add a series";
  document.querySelector("dialog a").href =
    "https://en.wikipedia.org/wiki/Main_Page";
  document.querySelector("dialog a").style.visibility = "hidden";
  document.querySelector("#filmingComplete").style.visibility = "hidden";
  document.querySelector("#saveSeries").style.visibility = "hidden";
}
window.modalOpenTasks = modalOpenTasks;
////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////
/////////WIKI LINK FETCHER/////////////
////////////////////////////////////////
async function getWikiLink(term) {
  const apiUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${term}&format=json&origin=*`;
  const response = await fetch(apiUrl);
  const data = await response.json();
  const firstResult = data.query.search[0];
  const pageId = firstResult.pageid;
  const link = `https://en.wikipedia.org/?curid=${pageId}`;
  return link;
}
//--------------------------------------------------//
////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////
/////////IMAGE FETCHER/////////////
////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////
async function getMainImageFromTVMaze(searchTerm) {
  const searchUrl = `https://api.tvmaze.com/search/shows?q=${searchTerm}`;
  let searchResults;
  try {
    const searchResponse = await fetch(searchUrl);
    if (!searchResponse.ok) {
      throw new Error(
        `Error fetching search results: ${searchResponse.status}`
      );
    }
    searchResults = await searchResponse.json();
  } catch (error) {
    console.error(error);
    return "errorImage.png"; // replace with path to your default image
  }

  const bestMatch = searchResults[0]?.show;
  if (!bestMatch) {
    console.error("No search results found");
    return "errorImage.png"; // replace with path to your default image
  }

  const id = bestMatch.id;
  const showUrl = `https://api.tvmaze.com/shows/${id}/images`;
  let imagesData;
  try {
    const showResponse = await fetch(showUrl);
    if (!showResponse.ok) {
      throw new Error(`Error fetching show data: ${showResponse.status}`);
    }
    imagesData = await showResponse.json();
  } catch (error) {
    console.error(error);
    return "errorImage.png"; // replace with path to your default image
  }

  let smallestBannerImage = "errorImage.png"; // replace with path to your default image
  let smallestBannerImageSize = Infinity;
  let smallestGeneralImage = "errorImage.png"; // replace with path to your default image
  let smallestGeneralImageSize = Infinity;

  imagesData.forEach((image) => {
    const { width, height, url } = image.resolutions?.original || {};
    if (width && height && url) {
      if (image.type === "banner") {
        const imageSize = width * height;
        if (imageSize < smallestBannerImageSize) {
          if (imageSize < 10000) {
            smallestBannerImage = url;
            smallestBannerImageSize = imageSize;
          } else {
            smallestBannerImage = image.resolutions.medium.url;
            smallestBannerImageSize =
              image.resolutions.medium.width * image.resolutions.medium.height;
          }
        }
      } else if (image.type === "poster" || image.type === "background") {
        const imageSize = width * height;
        if (imageSize < smallestGeneralImageSize) {
          if (imageSize < 10000) {
            smallestGeneralImage = url;
            smallestGeneralImageSize = imageSize;
          } else {
            smallestGeneralImage = image.resolutions.medium.url;
            smallestGeneralImageSize =
              image.resolutions.medium.width * image.resolutions.medium.height;
          }
        }
      }
    }
  });

  if (smallestBannerImage !== "errorImage.png") {
    return smallestBannerImage;
  }
  return smallestGeneralImage;
}
////////////////////////////////////////////////////////////////////////////////////////////
//used only for modal dialog//
///////////////
async function getPosterImageFromTVMaze(searchTerm) {
  const searchUrl = `https://api.tvmaze.com/search/shows?q=${searchTerm}`;
  let searchResults;
  try {
    const searchResponse = await fetch(searchUrl);
    if (!searchResponse.ok) {
      throw new Error(
        `Error fetching search results: ${searchResponse.status}`
      );
    }
    searchResults = await searchResponse.json();
  } catch (error) {
    console.error(error);
    return "errorImage.png";
  }

  const bestMatch = searchResults[0]?.show;
  if (!bestMatch) {
    console.error("No search results found");
    return "errorImage.png";
  }

  const id = bestMatch.id;
  const imagesUrl = `https://api.tvmaze.com/shows/${id}/images`;
  let smallestImage = "errorImage.png";
  let smallestImageSize = Infinity;

  try {
    const imagesResponse = await fetch(imagesUrl);
    if (!imagesResponse.ok) {
      throw new Error(`Error fetching images: ${imagesResponse.status}`);
    }
    const imagesData = await imagesResponse.json();
    imagesData.forEach((image) => {
      const { width, height, url } = image.resolutions?.original || {};
      if (width && height && url && image.type === "poster") {
        const imageSize = width * height;
        if (imageSize < smallestImageSize) {
          if (imageSize < 10000) {
            smallestImage = url;
            smallestImageSize = imageSize;
          } else {
            smallestImage = image.resolutions.medium.url;
            smallestImageSize =
              image.resolutions.medium.width * image.resolutions.medium.height;
          }
        }
      }
    });
  } catch (error) {
    console.error(error);
    smallestImage = "errorImage.png"; // replace with path to your default image
  }

  return smallestImage;
}

//////////////////////
////////////////////////////////////////////////////////////////////////////////////////////

// getMainImageFromTVMaze("twin peaks").then(mainImage =>{
// 	document.body.style.backgroundImage = `url(${mainImage})`;
// })//WORKS...BUT NEED TO TEST ON LIVE PAGE BUTTON OR SOMETHING

// //WORKS BEAUTIFULLY_ SHOULD TEST LIVE TOO
