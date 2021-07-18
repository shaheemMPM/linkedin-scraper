const saveUsers = (users) => {
  chrome.storage.sync.set({ users: users });
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

const readUsers = () => {
  chrome.storage.sync.get(["users"], function (data) {
    if (!!data.users) {
      populateTable(data.users);
    } else {
      return;
    }
  });
};

readUsers();

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
        saveUsers(data.candidates);
        populateTable(data.candidates);
      }
    );
  });
};

// select btnClearTable button and add onclick listener
const btnClearTable = document.getElementById("btnClearTable");

btnClearTable.onclick = () => {
  chrome.storage.sync.set({ users: [] });
  const usersTable = document.getElementById("tbUsers");
  usersTable.innerHTML = "";
};
