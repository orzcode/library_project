let library = [];
let libraryDiv = document.querySelector('#library');
let newSeries = new Series();
///////////////////
function Series(title, seasons, complete, viewed) {
	this.title = title;
	this.seasons = seasons;
	this.complete = complete;
	this.viewed = viewed;
}
///////////////////
let sampleSeries1 = {
	"title": "The Wire",
	"seasons": 6,
	"complete": true,
	"viewed": true,
   }
library.push(sampleSeries1);

let sampleSeries2 = {
	"title": "Walking Dead",
	"seasons": 11,
	"complete": true,
	"viewed": true,
   }
library.push(sampleSeries2);
////////////////////
library.push(new Series("Mr Inbetween", 3, true, false));
library.push(new Series("Mr Inbetween", 3, true, false));
library.push(new Series("Mr Inbetween", 3, true, false));
library.push(new Series("Mr Inbetween", 3, true, false));
////////////////////
// const library = [
// 	new Series('Series 1', '10 seasons', 'Yes', 'No'),
// 	new Series('Series 2', '5 seasons', 'No', 'Yes'),
// 	new Series('Series 3', '3 seasons', 'Yes', 'Yes')
//   ];
////////////////////

///////////////

//////////////

///////////////

////////Creates a card based on array object, but doesn't append tp page yet////////////
//Note that 'card' here is different in scope!! And is therefore separate. Confusing huh
function createCard(obj) {
	const card = document.createElement('div');
	card.className = 'card';
	
	const titleP = document.createElement('p');
	const titleStrong = document.createElement('strong');
	titleStrong.textContent = obj.title;
	titleP.appendChild(titleStrong);
	
	card.appendChild(titleP);
	
	const seasonsP = document.createElement('p');
	const seasonsStrong = document.createElement('strong');
	seasonsStrong.textContent = 'Seasons: ';
	seasonsP.appendChild(seasonsStrong);
	// seasonsP.appendChild(document.createTextNode(obj.seasons));
	let apiSeasons = getSeasonsFromWikipedia(obj.title).then(seasons => {
		return seasons;
	  });
	seasonsP.appendChild(document.createTextNode(apiSeasons));
	
	card.appendChild(seasonsP);
	
	const completeP = document.createElement('p');
	const completeStrong = document.createElement('strong');
	completeStrong.textContent = 'Complete: ';
	completeP.appendChild(completeStrong);
	completeP.appendChild(document.createTextNode(obj.complete ? 'Yes' : 'No'));
	
	card.appendChild(completeP);
	
	const viewedP = document.createElement('p');
	const viewedStrong = document.createElement('strong');
	viewedStrong.textContent = 'Viewed? ';
	viewedP.appendChild(viewedStrong);
	viewedP.appendChild(document.createTextNode(obj.viewed ? 'Yes' : 'No'));
	
	card.appendChild(viewedP);
	
	return card;
  }
///////////////////////


////////////Actually runs the card-creation function, and then appends that card to the page
  function renderCards(givenLibrary) {	
	givenLibrary.forEach(ObjFromArray => {	  
		//Note that 'card' here is different in scope!! And is therefore separate. Confusing huh
		const card = createCard(ObjFromArray);
		card.setAttribute('data-complete', ObjFromArray.complete);
		libraryDiv.appendChild(card);	  
	});	
  }
renderCards(library);
///////


//------------------------------------------------------------------------------//



//Wikipedia function? NOT TESTED YET//
async function getWikipediaArticle(input) {
	const encodedInput = encodeURIComponent(input);
	const url = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodedInput}&format=json`;
	
	const response = await fetch(url);
	const data = await response.json();
	
	const pageId = Object.keys(data.query.pages)[0];
	if (pageId === '-1') {
	  return null;
	}
	
	return `https://en.wikipedia.org/?curid=${pageId}`;
  }
//Wikipedia function? NOT TESTED YET//
//--OR--//
function getWikipediaLink(input) {
	const encodedInput = encodeURIComponent(input);
	return `https://en.wikipedia.org/wiki/${encodedInput}`;
  }
//--Should work--//
//EVEN BETTER://////////
async function getWikiLink(term) {
	const apiUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${term}&format=json`;
	const response = await fetch(apiUrl);
	const data = await response.json();
	const firstResult = data.query.search[0];
	const pageId = firstResult.pageid;
	const link = `https://en.wikipedia.org/?curid=${pageId}`;
	return link;
  }
//--------------------------------------------------//
//-------------------------------------------------//
async function getSeasonsFromWikipedia(show) {
	const url = `https://en.wikipedia.org/w/api.php?action=query&titles=${show}&prop=revisions&rvprop=content&format=json`;
	const response = await fetch(url);
	const data = await response.json();
	const pages = data.query.pages;
	const page = Object.values(pages)[0];
	const content = page.revisions[0]['*'];
	const regex = /Seasons?[\s\S]*?(\d+)/i;
	const match = content.match(regex);
	return match ? parseInt(match[1]) : 0;
  }
  
//   getSeasonsFromWikipedia('The Simpsons').then(seasons => {
// 	return seasons;
//   });
//------------------------------------------------------//
//BOTH  //
async function getInfoFromWikipedia(searchTerm) {
	const url = `https://corsproxy.io/?https://en.wikipedia.org/w/api.php?action=query&titles=${searchTerm}&prop=revisions&rvprop=content|pageimages&format=json&pithumbsize=500`;
	const response = await fetch(url);
	const data = await response.json();
	const pages = data.query.pages;
	const page = Object.values(pages)[0];
	const content = page.revisions[0]['*'];
	const image = page.thumbnail ? page.thumbnail.source : null;
	const regex = /Seasons?[\s\S]*?(\d+)/i;
	const match = content.match(regex);
	const seasons = match ? parseInt(match[1]) : 0;
	return { seasons, image };
  }

  getInfoFromWikipedia('The Simpsons').then(info => {
	console.log(`The show has ${info.seasons} seasons.`);
	console.log(`The main image is ${info.image}.`);
  });
