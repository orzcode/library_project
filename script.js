let library = [];
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
///////////////
function propagateSeries(){
	for(let i = 0; i < library.length; i++){
		console.log(library[i].title);
	}
}