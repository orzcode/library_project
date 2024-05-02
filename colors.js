//--------------------------------------------------------//
export default setColors
// Define an array of color schemes
const colorSchemes = [
	{
	  header: "#22334B",
	  main: "#2e2b2d",
	  highlighted: "34, 51, 75",
	},
	{
	  header: "#36221f",
	  main: "#6e5c5c",
	  highlighted: "54, 34, 31",
	},
	{
	  header: "#771c11",
	  main: "#342321",
	  highlighted: "119, 28, 17",
	},
  ];
  
  let currentSchemeIndex = parseInt(localStorage.getItem("currentSchemeIndex"));
  
  if (isNaN(currentSchemeIndex)) {
	currentSchemeIndex = 0;
  }
  
  // Set the initial color scheme on page load
  function setColors() {
	if (currentSchemeIndex !== undefined) {
	  let currentScheme = colorSchemes[currentSchemeIndex];
	  document.documentElement.style.setProperty(
		"--header",
		currentScheme.header
	  );
	  document.documentElement.style.setProperty("--main", currentScheme.main);
	  document.documentElement.style.setProperty(
		"--highlighted",
		currentScheme.highlighted
	  );
	}
  }
  setColors();
  
  // Update the color scheme on button click
  document.querySelector("#colors").addEventListener("click", function () {
	currentSchemeIndex = (currentSchemeIndex + 1) % colorSchemes.length;
	setColors();
	localStorage.setItem("currentSchemeIndex", currentSchemeIndex);
  });
  //--------------------------------------------------------//