import getDataFromTVMaze from "./APIdataFetch";

/////////////////////////////////////////////////////////////////////////////////
function modalOpenTasks() {
  scrollTo(0, 0);
  document.querySelector("form").reset();
  document.querySelector("#formDialog").showModal();
  document.querySelector("#formImg").src = "./cloudNew.svg";

  document.querySelector("#formDialog h2").innerHTML = "Add a series";
  document.querySelector("#formDialog a").style.pointerEvents = "none";

  document.querySelector("#linkImg").style.display = "none";

  document.querySelector("#filmingComplete").style.opacity = "0.3";
  document.querySelector("#no").disabled = true;
  document.querySelector("#yes").disabled = true;
  document.querySelector("#yes").style.cursor = "not-allowed";
  document.querySelector("#no").style.cursor = "not-allowed";

  document.querySelector("#saveSeries").disabled = true;
  document.body.style.overflowY = "hidden";

  setTimeout(function () {
    document.getElementById("seriesName").focus();
  }, 100);
  //Sets focus to input field on modal load - needs a timeout for some reason
}

function closeModal() {
  document.querySelector("#formDialog").close();
}

/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////

//This function runs when you click 'Query'
/////////////////////
function queryData() {
  document.querySelector("#formDialog h2").style.visibility = "hidden";
  document.querySelector("#linkImg").style.display = "none";

  document.querySelector("#filmingComplete").style.opacity = "0.3";
  document.querySelector("#no").disabled = true;
  document.querySelector("#yes").disabled = true;
  document.querySelector("#yes").style.cursor = "not-allowed";
  document.querySelector("#no").style.cursor = "not-allowed";

  document.querySelector("#saveSeries").disabled = true;

  document.querySelector("#formImg").src = "./ripple.svg";

  const searchTerm = document.querySelector("#seriesName").value;
  document.querySelector("#seriesName").value = "";

  getDataFromTVMaze(searchTerm)
    .then((data) => {
      if (data)
        console.log("API Fetch complete: " + [data.name, data.url, data.image]);

      document.querySelector("#formDialog h2").innerHTML = data.name;
      document.querySelector("#formDialog h2").style.visibility = "visible";
      document.querySelector("#title").href = data.url;

      document.querySelector("#link").href = data.url;
      document.querySelector("#linkImg").style.display = "block";
      document.querySelector("#formDialog a").style.pointerEvents = "auto";

      document.querySelector("#filmingComplete").style.opacity = "1";
      document.querySelector("#no").disabled = false;
      document.querySelector("#yes").disabled = false;
      document.querySelector("#yes").style.cursor = "pointer";
      document.querySelector("#no").style.cursor = "pointer";

      document.querySelector("#saveSeries").disabled = false;
      document.querySelector("#formImg").src = data.image;
    })
    .catch((error) => {
      console.error(error);

      document.querySelector("#formDialog h2").style.visibility = "visible";
      document.querySelector("#formDialog h2").innerHTML = `${error.message}`;

      document.querySelector("#linkImg").style.display = "none";

      document.querySelector("#saveSeries").disabled = true;
      document.querySelector("#formImg").src = "./cloudError.svg";
    });
}

export { modalOpenTasks, closeModal, queryData };

window.modalOpenTasks = modalOpenTasks;
window.closeModal = closeModal;
window.queryData = queryData;
