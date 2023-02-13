let library = [];
let libraryDiv = document.querySelector('#library');

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
function Series(title, seasons, complete, viewed) {
	this.title = title;
	this.seasons = seasons;
	this.complete = complete;
	this.viewed = viewed;
}
///////////////
let newSeries = new Series();
library.push(newSeries);
//////////////
library.push(new Series("Mr Inbetween", 3, true, false));


console.log(library);
console.log(Series);
///////////////
function propagateSeries(){
	for(let i = 0; i < library.length; i++){
		//library[i].title//
		let newCard = libraryDiv.createElement("div");
		newCard.classList.add("card");
		let newCardTitle = newCard.createElement("p");
		newCardTitle.createElement("strong")
		console.log("fuck");
		//figure out if you really need multiple variables for each P and Strong???
	}
}


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
	seasonsP.appendChild(document.createTextNode(obj.seasons));
	
	card.appendChild(seasonsP);
	
	const completeP = document.createElement('p');
	const completeStrong = document.createElement('strong');
	completeStrong.textContent = 'Complete? ';
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
  function renderCards(library) {	
	library.forEach(series => {	  
		//Note that 'card' here is different in scope!! And is therefore separate. Confusing huh
		const card = createCard(series);
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