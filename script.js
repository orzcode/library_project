let library = [];
let libraryDiv = document.querySelector('#library');

////////////////////////////////////////////////////////////
const ACCESS = "github_pat_11AQ5WB5Y07d4zqin16RYv_";
const TOKEN = "cRato9Mi5aBLugbBNQ1dD0Oem8LD8e1BqGZw5kBqe90UHNTBZYD4Jb7FFiN";
const ACCESSTOKEN = ACCESS + TOKEN;
//Note to anyone reading:
//actually using a Github Secret is far, FAR more difficult than it needs to be
//I spent literally several hours trying half a dozen fixes and methods and none of them worked
//Since this is not a sensitive or critical app and nothing can be lost, I decided to say
//a great big "Fuck this" and use the API key in the above way.
////////////////////////////////////////////////////////////
function Series(title, complete, link, image) {
	this.title = title;
	this.complete = complete;
	this.link = link;
	this.image = image;
}
///////////////////
async function getContentFromGist() {
	const gistId = '5030015d1b6612eed934612108b3e63f';
	const filename = 'library.txt';
	const token = ACCESSTOKEN;

	const response = await fetch(`https://api.github.com/gists/${gistId}`, {
	  headers: {
		Authorization: `token ${token}`
	  }
	});
	const data = await response.json();
	const file = data.files[filename];
	if (file) {
	  const content = JSON.parse(file.content);
	  return content;
	} else {
	  console.error(`File ${filename} not found in Gist ${gistId}`);
	  return null;
	}
  }

  async function myFunction() {
	const content = await getContentFromGist();
	renderCards(content);
	// Use the content value here
  }

  myFunction();
///////////////////

///////////////////
// let sampleSeries1 = {
// 	"title": "Twin Peaks wrong",
// 	"complete": true,
// 	"link": 'https://en.wikipedia.org/wiki/The_Expanse_(TV_series)',
// 	"image": 'https://static.tvmaze.com/uploads/images/medium_portrait/0/2142.jpg',
//    }
// library.push(sampleSeries1);

// let sampleSeries2 = {
// 	"title": "Wrong peaks wrong",
// 	"complete": true,
// 	"link": 'https://en.wikipedia.org/wiki/The_Expanse_(TV_series)',
// 	"image": 'https://static.tvmaze.com/uploads/images/medium_portrait/0/2142.jpg',
//    }
// library.push(sampleSeries2);
// ////////////////////
// library.push(new Series("Mr Inbetween", true, undefined, undefined));
// library.push(new Series("Mr Inbetween", true, undefined, undefined));
// library.push(new Series("Mr Inbetween", true, undefined, undefined));
// library.push(new Series("Mr Curious Man Doing Curious Things and He Takes Up Three Lines", true, undefined, undefined));
////////////////////
////////////Actually runs the card-creation function, and then appends that card to the page
function renderCards(givenLibrary) {	
	givenLibrary.forEach(ObjFromArray => {	  
		//Note that 'card' here is different in scope!! And is therefore separate. Confusing huh
		const card = createCard(ObjFromArray);
		//passing it the object to 'construct' a card from
		card.setAttribute('data-complete', ObjFromArray.complete);
		//IF 'complete' is true, it highlights the card
		libraryDiv.appendChild(card);
	});	
  }

// renderCards(content);

///////
////////Creates a card based on array object, but doesn't append tp page yet////////////
//In other words, even though this is a long function, it's all just creating the card structure
//
//Note that 'card' here is different in scope!! And is therefore separate. Confusing huh
//This function gets called from something else (renderCards)
function createCard(obj) {
	const card = document.createElement('div');
	card.className = 'card';
	
	const banner = document.createElement('img');
	banner.src = obj.image;
	banner.alt = "Thumbnail";
	
	card.appendChild(banner);

	const titleP = document.createElement('p');
	const titleStrong = document.createElement('strong');
	titleStrong.textContent = obj.title;
	titleStrong.className = 'title';
	titleP.appendChild(titleStrong);
	
	card.appendChild(titleP);
	
	const completeP = document.createElement('p');
	const completeStrong = document.createElement('strong');
	completeStrong.textContent = 'Complete: ';
	completeP.appendChild(completeStrong);
	completeP.appendChild(document.createTextNode(obj.complete ? 'Yes' : 'No'));
	
	card.appendChild(completeP);
	
	const linkP = document.createElement('p');
	const linkStrong = document.createElement('strong');
	const linkA = document.createElement('a');
	linkA.textContent = 'Link';
	linkA.href = obj.link;
	linkP.appendChild(linkStrong);
	linkStrong.appendChild(linkA);
	//FIX THIS TO LOOK LIKE HTML EXAMPLE
	
	card.appendChild(linkP);
	
	const removeP = document.createElement('p');
	const removeStrong = document.createElement('strong');
	const removeEm = document.createElement('em');
	removeEm.textContent = 'Remove?';
	removeP.appendChild(removeStrong);
	removeStrong.appendChild(removeEm);
	//NEED TO TURN THIS INTO A BUTTON
	//DECIDE HOW THIS SHOULD FLOW
	
	card.appendChild(removeP);

	return card;
  }
//------------------------------------------------------------------------------//

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
		throw new Error(`Error fetching search results: ${searchResponse.status}`);
	  }
	  searchResults = await searchResponse.json();
	} catch (error) {
	  console.error(error);
	  return 'errorImage.png'; // replace with path to your default image
	}
  
	const bestMatch = searchResults[0]?.show;
	if (!bestMatch) {
	  console.error('No search results found');
	  return 'errorImage.png'; // replace with path to your default image
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
	  return 'errorImage.png'; // replace with path to your default image
	}
  
	let smallestBannerImage = 'errorImage.png'; // replace with path to your default image
	let smallestBannerImageSize = Infinity;
	let smallestGeneralImage = 'errorImage.png'; // replace with path to your default image
	let smallestGeneralImageSize = Infinity;
  
	imagesData.forEach(image => {
	  const { width, height, url } = image.resolutions?.original || {};
	  if (width && height && url) {
		if (image.type === 'banner') {
		  const imageSize = width * height;
		  if (imageSize < smallestBannerImageSize) {
			if (imageSize < 10000) {
			  smallestBannerImage = url;
			  smallestBannerImageSize = imageSize;
			} else {
			  smallestBannerImage = image.resolutions.medium.url;
			  smallestBannerImageSize = image.resolutions.medium.width * image.resolutions.medium.height;
			}
		  }
		} else if (image.type === 'poster' || image.type === 'background') {
		  const imageSize = width * height;
		  if (imageSize < smallestGeneralImageSize) {
			if (imageSize < 10000) {
			  smallestGeneralImage = url;
			  smallestGeneralImageSize = imageSize;
			} else {
			  smallestGeneralImage = image.resolutions.medium.url;
			  smallestGeneralImageSize = image.resolutions.medium.width * image.resolutions.medium.height;
			}
		  }
		}
	  }
	});
  
	if (smallestBannerImage !== 'errorImage.png') {
	  return smallestBannerImage;
	}
	return smallestGeneralImage;
  }
////////////////////////////////////////////////////////////////////////////////////////////
/////////IMAGE FETCHER/////////////
////////////////////////////////////////////////////////////////////////////////////////////

// getMainImageFromTVMaze("twin peaks").then(mainImage =>{
// 	document.body.style.backgroundImage = `url(${mainImage})`;
// })//WORKS...BUT NEED TO TEST ON LIVE PAGE BUTTON OR SOMETHING


//   getWikiLink("the expanse").then(wikiLink => {
// 	console.log(wikiLink);
//   });//WORKS BEAUTIFULLY_ SHOULD TEST LIVE TOO