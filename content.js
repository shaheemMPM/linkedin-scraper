// sending a message to background page to show page action
chrome.runtime.sendMessage({ todo: "showPageAction" });

// response to addButtons request in popup page
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action == "addButtons") {
    addSelectUserButtons();
    sendResponse({ status: "success" });
  }
});

const delay = (second) => new Promise((res) => setTimeout(res, second * 1000));

const addSelectUserButtons = () => {
  let usersUL = document.getElementsByClassName(
    "search-results__result-list"
  )[0];
  let usersLiItems = usersUL.children;
  for (let i = 0; i < usersLiItems.length; i++) {
    let userLI = usersLiItems[i];
    let userLiInnerHTML = userLI.innerHTML;
    let selectUserBtn = '<button class="btn-select-user">Select user</button>';
    userLI.innerHTML = selectUserBtn + userLiInnerHTML;
  }
};
