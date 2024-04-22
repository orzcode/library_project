import cloudNew from './cloudNew.svg';
import link from './link.svg';

export default `
<svg
type="button"
onclick="closeModal()"
fill="#000000"
width="256px"
height="256px"
viewBox="0 0 52 52"
data-name="Layer 1"
id="Layer_1"
xmlns="http://www.w3.org/2000/svg"
>
<g id="closePopup" stroke-width="0" />
<g
  id="closePopup"
  stroke-linecap="round"
  stroke-linejoin="round"
  stroke="#CCCCCC"
  stroke-width="0.10400000000000001"
/>
<g id="closePopup">
  <path
	d="M28.94,26,51.39,3.55A2.08,2.08,0,0,0,48.45.61L26,23.06,3.55.61A2.08,2.08,0,0,0,.61,3.55L23.06,26,.61,48.45A2.08,2.08,0,0,0,2.08,52a2.05,2.05,0,0,0,1.47-.61L26,28.94,48.45,51.39a2.08,2.08,0,0,0,2.94-2.94Z"
  />
</g>
</svg>
<img id="formImg" src="${cloudNew}" alt="upload new series data" />
<div id="titleAndLink">
<a id="title" href="www.TVMaze.com" rel="noopener" target="_blank"
  ><h2>Add a series</h2></a
>
<a id="link" href="www.TVMaze.com" rel="noopener" target="_blank"
  ><img id="linkImg" src="${link}" alt="link to TV Maze for this show"
/></a>
</div>
<form onsubmit="window.queryData();return false">
<!-- or event.preventDefault() -->

<div>
  <input
	type="text"
	id="seriesName"
	minlength="1"
	placeholder="Enter Series Name"
	title="Enter a series name"
	required
  />
</div>

<div id="filmingComplete">
  <div><legend for="filmingComplete">Filming complete?</legend></div>

  <div id="radioButtons">
	<div>
	  <label for="yes">Yes</label>
	  <input
		type="radio"
		id="yes"
		name="filmingComplete"
		value="Complete"
	  />
	</div>
	<div>
	  <label for="no">No</label>
	  <input
		type="radio"
		id="no"
		name="filmingComplete"
		value="Ongoing"
	  />
	</div>
  </div>
</div>

<div id="formButtons">
  <button
	id="confirmBtn"
	class="btnForm btn-secondary"
	type="submit"
	value="Query"
  >
	Query
  </button>
  <button
	id="saveSeries"
	class="btnForm btn-primary"
	type="button"
	onclick="submissionTasks()"
	value="Submit"
  >
	Save
  </button>
  <button
	id="cancelFormButton"
	class="btnForm btn-secondary"
	type="button"
	onclick="closeModal()"
  >
	Close
  </button>
</div>
<!-- 'Query' is the 'Submit' button so that enter key defaults to it. -->
</form>
`