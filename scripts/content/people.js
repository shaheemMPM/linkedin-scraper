// sending a message to background page to show page action
chrome.runtime.sendMessage({ todo: "showPageAction" });

const getUserData = () => {
  const userPathName = window.location.pathname;
  const userId = userPathName.split("/sales/people/")[1].split(",")[0];

  const currentPositionDD = document.getElementsByClassName(
    "profile-topcard__current-positions"
  )[0];
  const currentPositionDiv = currentPositionDD.children[0].children[0];

  let companyId = currentPositionDiv.children[0].href;
  companyId = companyId.split("/sales/company/")[1];

  const currentPositionNode = currentPositionDiv.getElementsByClassName(
    "profile-topcard__summary-position-title"
  )[0];
  const currentPosition = currentPositionNode.innerText;

  const companyName = currentPositionNode.nextElementSibling.innerText;

  return { userId, companyId, companyName, currentPosition };
};

// response to getUserData request in popup page
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action == "getUserData") {
    const userData = getUserData();
    sendResponse({ userData });
  }
});

const counterDiv = document.createElement("div");
counterDiv.style =
  "z-index: 10000;position: fixed;top: 30px;left: 30px;background: antiquewhite;padding: 20px;border-radius: 15px;box-shadow: 10px 10px 9px -2px rgb(187 181 181 / 74%);";
counterDiv.innerHTML =
  '<button class="btn" id="btnPopupCopy">COPY PROFILE URL</button>';
document.body.appendChild(counterDiv);

document.getElementById("btnPopupCopy").addEventListener("click", () => {
  document.querySelectorAll('[data-control-name="copy_linkedin"]')[0].click();
});
