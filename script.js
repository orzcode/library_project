let library = [];
let libraryDiv = document.querySelector('#library');
///////////////////
function Series(title, complete, link, image) {
	this.title = title;
	this.complete = complete;
	this.link = link;
	this.image = image;
}
///////////////////
let sampleSeries1 = {
	"title": "Twin Peaks wrong",
	"complete": true,
	"link": 'https://en.wikipedia.org/wiki/The_Expanse_(TV_series)',
	"image": 'https://static.tvmaze.com/uploads/images/medium_portrait/0/2142.jpg',
   }
library.push(sampleSeries1);

let sampleSeries2 = {
	"title": "Wrong peaks wrong",
	"complete": true,
	"link": 'https://en.wikipedia.org/wiki/The_Expanse_(TV_series)',
	"image": 'https://static.tvmaze.com/uploads/images/medium_portrait/0/2142.jpg',
   }
library.push(sampleSeries2);
////////////////////
library.push(new Series("Mr Inbetween", true, undefined, undefined));
library.push(new Series("Mr Inbetween", true, undefined, undefined));
library.push(new Series("Mr Inbetween", true, undefined, undefined));
library.push(new Series("Mr Curious Man Doing Curious Things", true, undefined, undefined));
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
renderCards(library);
///////
////////Creates a card based on array object, but doesn't append tp page yet////////////
//In other words, even though this is a long function, it's all just creating the card structure
//
//Note that 'card' here is different in scope!! And is therefore separate. Confusing huh
function createCard(obj) {
	const card = document.createElement('div');
	card.className = 'card';
	
	//INSERT CODE HERE TO INSERT THIS.IMAGE INTO BANNER SECTION OF CARD?

	const titleP = document.createElement('p');
	const titleStrong = document.createElement('strong');
	titleStrong.textContent = obj.title;
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
	linkStrong.textContent = 'Link: ';
	linkP.appendChild(linkStrong);
	linkP.appendChild(document.createTextNode(obj.link ? 'Yes' : 'No'));
	
	card.appendChild(linkP);
	
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
// })//WORKS...


  getWikiLink("the expanse").then(wikiLink => {
	console.log(wikiLink);
  });//WORKS BEAUTIFULLY

