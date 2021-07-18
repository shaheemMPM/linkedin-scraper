// sending a message to background page to show page action
chrome.runtime.sendMessage({ todo: "showPageAction" });

const getCompanyData = () => {
  document
    .querySelectorAll('[data-control-name="read_more_description"]')[0]
    .click();

  const companyAddress = document.getElementsByClassName(
    "company-details-panel-headquarters"
  )[0].innerText;

  document.querySelectorAll("[data-test-panel-close-btn]")[0].click();

  return { companyAddress };
};

// response to getCompanyData request in popup page
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action == "getCompanyData") {
    const companyData = getCompanyData();
    sendResponse({ companyData });
  }
});

// document.getElementsByClassName("company-details-panel-headquarters")[0]
// read_more_description
