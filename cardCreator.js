import { library, sendLibrary, emptyChecker } from ".";
export default
//This function gets called from something else (renderCards)

////////Creates a card based on array object, but doesn't append to page yet////////////
//In other words, even though this is a long function, it's all just creating the card structure
//
//Note that 'card' here is different in scope!! And is therefore separate. Confusing huh
function createCard(obj) {
	const card = document.createElement("div");
	card.className = "card";
  
	const banner = document.createElement("img");
	banner.src = obj.image;
	banner.alt = "Thumbnail";
  
	card.appendChild(banner);
  
	const completeP = document.createElement("p");
	completeP.classList.add("card1stRowText");
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
	linkP.classList.add("card2ndRowText");
	const linkStrong = document.createElement("strong");
	const linkA = document.createElement("a");
	linkA.textContent = "Link";
	linkA.href = obj.link;
	linkP.appendChild(linkStrong);
	linkStrong.appendChild(linkA);
	let linkSvg = document.createElement("img");
	linkSvg.src = "./link.svg";
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
	  //naturally if this was the last item, it'd need to check for an empty library too
	}
	////////////////
	linkP.appendChild(removeStrong);
	removeStrong.appendChild(removeEm);
  
	linkP.appendChild(removeStrong);
  
	return card;
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
	  //(sendLibrary must be IN the timeout func for it to run on time)
	  //as you can see, this updates the object in the session-based Library[]; prior to sending
	}, 300); // wait 300ms (the duration of the transition) before changing the card's state and position
  }
  //------------------------------------------------------------------------------//