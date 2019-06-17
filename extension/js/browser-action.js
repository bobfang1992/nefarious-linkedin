//
// Code snippet taken and modified from Stackoverflow:
//  https://stackoverflow.com/questions/11849562/how-to-save-the-output-of-a-console-logobject-to-a-file
//
function saveJson(data, filename) {
  if (!data) {
    console.error("Console.save: No data");
    return;
  }

  if (!filename) {
    filename = "console.json";
  }

  if (typeof data === "object") {
    data = JSON.stringify(data, undefined, 2)
  }

  var blob = new Blob([data], { type: "text/json" }),
    e    = document.createEvent("MouseEvents"),
    a    = document.createElement("a")

  a.download = filename
  a.href = window.URL.createObjectURL(blob)
  a.dataset.downloadurl =  ["text/json", a.download, a.href].join(":")
  e.initMouseEvent("click", true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
  a.dispatchEvent(e)
}

function removeLoader() {
  var loadingContainer = document.querySelector('.loading-container');

  document.body.removeChild(loadingContainer);
}

function showErrorView() {
  document.querySelector(".error").classList.remove("hidden");
}

function showDataView(data) {
  document.querySelector(".actions").classList.remove("hidden");

  document.querySelector('.download').addEventListener('click', function () {
    saveJson(data, "linkedin-" + (new Date().getTime()) + ".json");
    return false;
  });

  document.querySelector(".data").classList.remove("hidden");
}

window.onload = function () {
  chrome.tabs.create({
    active: false,
    url: 'https://www.linkedin.com/'
  }, function (tab) {
    chrome.tabs.executeScript(tab.id, {
      code: 'localStorage.getItem("C_C_M");'
    }, function (r) {
      chrome.tabs.remove(tab.id);

      removeLoader();

      if (!r || ![0]) {
        showErrorView();
        return;
      }

      var localFile = JSON.parse(atob(r[0]));

      showDataView(localFile);
    });
  });
};
