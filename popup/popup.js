// select btnAddSelect button and add onclick listener
const btnAddSelect = document.getElementById("btnAddSelect");

btnAddSelect.onclick = () => {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(
      tabs[0].id,
      { action: "addButtons" },
      function (data) {
        console.log("popup", data);
      }
    );
  });
};

// chrome.storage.local.get("count", function (data) {
//   if (typeof data.count == "undefined") {
//     // That's kind of bad
//   } else {
//     console.log(data);
//   }
// });
