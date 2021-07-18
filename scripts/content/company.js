// sending a message to background page to show page action
chrome.runtime.sendMessage({ todo: "showPageAction" });

const getCompanyData = () => {
  const companyPathName = window.location.pathname;
  const companyId = companyPathName.split("/sales/company/")[1];

  let companyAddress = "NA";

  try {
    document
      .querySelectorAll('[data-control-name="read_more_description"]')[0]
      .click();

    companyAddress = document.getElementsByClassName(
      "company-details-panel-headquarters"
    )[0].innerText;

    document.querySelectorAll("[data-test-panel-close-btn]")[0].click();
  } catch (error) {
    console.log(error);
    swal("", "Unable to get company address", "error");
  }

  let noEmployees = document
    .getElementsByClassName("account-top-card__lockup")[0]
    .getElementsByClassName("artdeco-entity-lockup__subtitle")[0]
    .innerText.split(" ");
  let employeesIndex = noEmployees.indexOf("employees") - 1;
  noEmployees = noEmployees[employeesIndex];

  // 2345 Yale St, Palo Alto, California 94306, United States
  // Trivandrum , kerala , India
  // 2940 Mallory Circle, Suite 101, Celebration, Orlando, FL 34747, United States

  return { companyId, companyAddress, noEmployees };
};

// response to getCompanyData request in popup page
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action == "getCompanyData") {
    const companyData = getCompanyData();
    sendResponse({ companyData });
  }
});
