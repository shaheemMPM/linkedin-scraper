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

const candidates = [];

const selectUserHandler = (event) => {
  const selectedUserLI = event.target.parentElement;

  let userPagePath = selectedUserLI.getAttribute("data-scroll-into-view");
  userPagePath = userPagePath.split("Profile:(")[1];
  userPagePath = userPagePath.substring(0, userPagePath.length - 1);
  userPagePath = `https://www.linkedin.com/sales/people/${userPagePath}`;

  try {
    let userName = selectedUserLI.lastElementChild.getElementsByClassName(
      "result-lockup__name"
    )[0].innerText;

    let tempData = {
      userPagePath,
      userName,
    };
    candidates.push(tempData);
    console.log(candidates);
  } catch (error) {
    swal("Invalid", "Cannot get user data", "error");
  }
};

// document.getElementsByClassName('btn-select-user')[0].parentElement.lastElementChild.getElementsByClassName(
