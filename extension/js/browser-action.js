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

//
// Code snippet taken and modified from Stackoverflow:
//  https://stackoverflow.com/questions/14964035/how-to-export-javascript-array-info-to-csv-on-client-side
//
function exportToCsv(filename, rows) {
  var processRow = function (row) {
    var finalVal = '';
    for (var j = 0; j < row.length; j++) {
      var innerValue = row[j] === null ? '' : row[j].toString();
      if (row[j] instanceof Date) {
        innerValue = row[j].toLocaleString();
      };
      var result = innerValue.replace(/"/g, '""');
        if (result.search(/("|,|\n)/g) >= 0)
          result = '"' + result + '"';
          if (j > 0)
          finalVal += ',';
          finalVal += result;
        }
    return finalVal + '\n';
  };

  var csvFile = '';
  for (var i = 0; i < rows.length; i++) {
    csvFile += processRow(rows[i]);
  }

  var blob = new Blob([csvFile], { type: 'text/csv;charset=utf-8;' });
  if (navigator.msSaveBlob) { // IE 10+
    navigator.msSaveBlob(blob, filename);
  } else {
    var link = document.createElement("a");
    if (link.download !== undefined) { // feature detection
      // Browsers that support HTML5 download attribute
      var url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
}

function exportCsv(data) {
  var filename = "linkedin-" + (new Date().getTime()) + ".csv";
  var rows = [ ["extension_name", "webstore_link"] ];

  data.Metadata.ext.sort(compare).forEach(function (e) {
    var link = "";

    if (e.path && e.path[0]) {
      var extensionId = e.path[0].split("/")[0];
      link = "https://chrome.google.com/webstore/detail/" + extensionId;
    }

    rows.push([
      decode(e.name),
      link,
    ]);
  });

  exportToCsv(filename, rows);
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
  document.querySelector(".download").addEventListener('click', function () {
    saveJson(data, "linkedin-" + (new Date().getTime()) + ".json");
    return false;
  });

  document.querySelector(".export").addEventListener("click", function () {
    exportCsv(data);
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
