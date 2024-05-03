export {sendLibrary, getLibrary}
import { UserLibrary } from "./firebasestuff";
import { library, Series } from ".";
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