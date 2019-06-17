window.onload = function () {
  chrome.tabs.create({
    active: false,
    url: 'https://www.linkedin.com/'
  }, function (tab) {
    chrome.tabs.executeScript(tab.id, {
      code: 'localStorage.getItem("C_C_M");'
    }, function (r) {
      chrome.tabs.remove(tab.id);

      if (!r || ![0]) {
        // TODO: Show not found for some reason.
        return;
      }

      var localFile = JSON.parse(atob(r[0]));

      console.log(localFile);
    });
  });
};
