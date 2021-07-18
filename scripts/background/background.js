// show popup on getting message from content script
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  let background = chrome.extension.getBackgroundPage();
  background.console.log("request", request);
  if (request.todo == "showPageAction") {
    //retrieve all the tabs and specifies options
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.pageAction.show(tabs[0].id);
    });
  }
});
