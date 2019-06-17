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

function decode(str) {
    if (!str) { return str; }

    var mapping = {
        'r': 'a',
        'O': 'a',
        'x': 'b',
        'L': 'b',
        'G': 'c',
        'I': 'C',
        'w': 'd',
        'v': 'd',
        'f': 'e',
        'P': 'E',
        'B': 'F',
        'H': 'f',
        'U': 'g',
        'k': 'G',
        'F': 'h',
        'n': 'H',
        'T': 'i',
        'D': 'i',
        'u': 'k',
        'd': 'l',
        'a': 'L',
        'h': 'm',
        'A': 'M',
        'X': 'n',
        'W': 'o',
        'c': 'O',
        'o': 'P',
        'S': 'p',
        'M': 'q',
        'l': 'r',
        's': 'r',
        'j': 'S',
        'C': 's',
        'Y': 't',
        'y': 't',
        'R': 'u',
        'V': 'u',
        'K': 'v',
        'Q': 'W',
        'm': 'x',
        'Z': 'y',
        'i': 'z',
    };

    var decoded = '';

    str.split('').forEach(function (char) {
      if (mapping[char] ) {
        decoded += mapping[char];
      } else {
        decoded += char;
      }
    });

    return decoded;
}

function compare(a, b) {
  const genreA = decode(a.name).toUpperCase();
  const genreB = decode(b.name).toUpperCase();

  let comparison = 0;

  if (genreA > genreB) {
    comparison = 1;
  } else if (genreA < genreB) {
    comparison = -1;
  }
  return comparison;
}

function removeLoader() {
  var loadingContainer = document.querySelector('.loading-container');

  document.body.removeChild(loadingContainer);
}

function showErrorView() {
  document.querySelector(".error").classList.remove("hidden");
}

function showDataView(data) {
  document.querySelector('.download').addEventListener('click', function () {
    saveJson(data, "linkedin-" + (new Date().getTime()) + ".json");
    return false;
  });

  data.Metadata.ext.sort(compare).forEach(function (e) {
    var li = document.createElement("li");

    if (e.path && e.path[0]) {
      // Append a link to the webstore description.
      var extensionId = e.path[0].split("/")[0];

      var link = document.createElement("a");
      link.innerText = decode(e.name);
      link.target = "_blank";
      link.href = "https://chrome.google.com/webstore/detail/" + extensionId;

      li.appendChild(link);
    } else {
      // No extension ID is know, simply append the name.
      li.innerText = decode(e.name);
    }

    document.querySelector("ul").appendChild(li);
  });

  document.querySelector(".actions").classList.remove("hidden");
  document.querySelector(".data").classList.remove("hidden");
  document.querySelector(".divider").classList.remove("hidden");
  document.querySelector(".callout").classList.remove("hidden");
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
