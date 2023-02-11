let library = [];
///////////////////
let sampleBook1 = {
	"title": "Dune",
	"author": "Frank Herbert",
	"pages": 300,
	"genre": "Sci-fi",
	"comments": "Exciting and fun"
   }
library.push(sampleBook1);

let sampleBook2 = {
	"title": "Dune Messiah",
	"author": "Frank Herbert",
	"pages": 250,
	"genre": "Sci-fi",
	"comments": "More political than the first"
   }
library.push(sampleBook2);
////////////////////


function Book(title, author, pages, genre, comments) {
	this.title = title;
	this.author = author;
	this.pages = pages;
	this.genre = genre;
	this.comments = comments;
}

///////////////
library.push(new Book("The Bible", "God", "1000", "Fantasy", "Boring"));


console.log(library);
///////////////
function propagateBooks(){
	for(let i = 0; i < library.length; i++){
		console.log(library[i].title);
	}
}
propagateBooks();