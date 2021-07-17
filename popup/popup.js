// select btnAddSelect button and add onclick listener
const btnAddSelect = document.getElementById("btnAddSelect");

btnAddSelect.onclick = () => {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(
      tabs[0].id,
      { action: "addButtons" },
      function (data) {
        console.log("select : ", data);
      }
    );
  });
};

// select btnGetUsers button and add onclick listener
const btnGetUsers = document.getElementById("btnGetUsers");

btnGetUsers.onclick = () => {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(
      tabs[0].id,
      { action: "getUsers" },
      function (data) {
        populateTable(data.candidates);
      }
    );
  });
};

const populateTable = (users) => {
  const usersTable = document.getElementById("tbUsers");
  usersTable.innerHTML = "<tr><td>Name</td><td>Action</td></tr>";

  for (let i = 0; i < users.length; i++) {
    const user = users[i];
    console.log(user);
    const tempTR = document.createElement("tr");
    tempTR.innerHTML = `<td>${user.userName}</td><td><a href="${user.userHref}" target="_blank">OPEN</a></td>`;
    usersTable.appendChild(tempTR);
  }
};

// chrome.storage.local.get("count", function (data) {
//   if (typeof data.count == "undefined") {
//     // That's kind of bad
//   } else {
//     console.log(data);
//   }
// });
