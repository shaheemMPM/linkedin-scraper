// sending a message to background page to show page action
chrome.runtime.sendMessage({ todo: "showPageAction" });

const candidates = [];

// response to addButtons request in popup page
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action == "addButtons") {
    addSelectUserButtons();
    sendResponse({ status: "success" });
  }
});

// response to getUsers request in popup page
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action == "getUsers") {
    sendResponse({ candidates });
  }
});

const addSelectUserButtons = () => {
  const usersUL = document.getElementsByClassName(
    "search-results__result-list"
  )[0];

  const usersLiItems = usersUL.children;

  for (let i = 0; i < usersLiItems.length; i++) {
    const userLI = usersLiItems[i];
    const userLiInnerHTML = userLI.innerHTML;
    const selectUserBtn =
      '<button class="btn-select-user">Select user</button>';
    userLI.innerHTML = selectUserBtn + userLiInnerHTML;
  }

  // find all select user buttons and add onclick
  const selectUserButtons = document.getElementsByClassName("btn-select-user");
  for (let i = 0; i < selectUserButtons.length; i++) {
    const btnSelectUser = selectUserButtons[i];
    btnSelectUser.onclick = selectUserHandler;
  }
};

const selectUserHandler = (event) => {
  event.target.style.backgroundColor = "#144b7d";
  event.target.innerText = "SELECTED";
  event.target.disabled = true;

  const selectedUserLI = event.target.parentElement;

  let userHref = selectedUserLI.getElementsByClassName(
    "result-lockup__name"
  )[0];
  userHref = userHref.getElementsByTagName("a")[0];
  userHref = userHref.href;

  const userId = userHref.split("/sales/people/")[1].split(",")[0];

  try {
    let userName = selectedUserLI.getElementsByClassName(
      "result-lockup__name"
    )[0].innerText;

    let tempData = {
      userId,
      userHref,
      userName,
      level: 0,
    };
    candidates.push(tempData);
    if (candidates.length === 1) {
      createCounter();
    } else {
      incrementCounter();
    }
  } catch (error) {
    console.log(error);
    swal("Invalid", "Cannot get user data", "error");
  }
};

const createCounter = () => {
  const counterDiv = document.createElement("div");
  counterDiv.style =
    "z-index: 10000;position: fixed;top: 30px;left: 30px;background: antiquewhite;padding: 20px;border-radius: 15px;box-shadow: 10px 10px 9px -2px rgb(187 181 181 / 74%);";
  counterDiv.innerHTML =
    '<h6 style="text-align:center;">Selected Users</h6><h1 id="tfCounter" style="text-align:center;">1</h1></div>';
  document.body.appendChild(counterDiv);
};

const incrementCounter = () => {
  const counterField = document.getElementById("tfCounter");
  let count = Number(counterField.innerText) + 1;
  counterField.innerText = String(count);
};

// document.getElementsByClassName('btn-select-user')[0].parentElement.lastElementChild.getElementsByClassName(
