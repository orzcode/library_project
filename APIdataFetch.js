export default
/////////DATA FETCHER/////////////
async function getDataFromTVMaze(searchTerm) {
	const searchUrl = `https://api.tvmaze.com/singlesearch/shows?q=${searchTerm}`;
	try {
	  const response = await fetch(searchUrl);
	  if (!response.ok) {
		throw new Error(`No result for "${searchTerm}"`);
	  }
	  const data = await response.json();
	  const name = data.name;
	  const url = data.url;
	  const image = data.image.medium;
	  if (!name || !url || !image) {
		throw new Error(`No result for "${searchTerm}"`);
	  }
	  return { name, url, image };
	} catch (error) {
	  throw new Error(`${error.message}`);
	}
  }
  //--------------------------------------------------------//