const saveUsers = (users) => {
  chrome.storage.sync.set({ users: users });
};

const populateTable = (users) => {
  const usersTable = document.getElementById("tbUsers");
  usersTable.innerHTML = `
    <tr id="headLine">
      <th>Name</th>
      <th>Current Position</th>
      <th>Company Name</th>
      <th>User Profile</th>
      <th>Actions</th>
    </tr>
  `;

  for (let i = 0; i < users.length; i++) {
    const user = users[i];
    const tempTR = document.createElement("tr");
    tempTR.id = user.userId;

    if (user.level === 0) {
      tempTR.innerHTML = `
        <td>${user.userName}</td>
        <td></td>
        <td></td>
        <td></td>
        <td>
          <a href="${user.userHref}" target="_blank">OPEN USER</a>
        </td>`;
    } else if (user.level === 1 && !!user.profileUrl) {
      tempTR.innerHTML = `
        <td>${user.userName}</td>
        <td>${user.currentPosition}</td>
        <td class="cname-${user.companyId}">${user.companyName}</td>
        <td>${user.profileUrl}</td>
        <td>
          <a href="https://www.linkedin.com/sales/company/${user.companyId}" target="_blank">OPEN COMPANY</a>
        </td>`;
    } else if (user.level === 1) {
      tempTR.innerHTML = `
        <td>${user.userName}</td>
        <td>${user.currentPosition}</td>
        <td id="cid-${user.companyId}">${user.companyName}</td>
        <td>
          <input type="text" placeholder="profile url"/>
          <button id="btnpro-${user.userId}" class="btn-add-profile">ADD</button>
        </td>
        <td>
          <a href="https://www.linkedin.com/sales/company/${user.companyId}" target="_blank">OPEN COMPANY</a>
        </td>`;
    }
    usersTable.appendChild(tempTR);
  }

  const btnAddProfile = document.getElementsByClassName("btn-add-profile");
  for (let j = 0; j < btnAddProfile.length; j++) {
    btnAddProfile[j].addEventListener("click", addUserProfile, false);
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

const updateUsersData = (user) => {
  const { userId, companyId, currentPosition, companyName } = user;

  chrome.storage.sync.get(["users"], function (data) {
    if (!!data.users) {
      let users = data.users;

      const currentUserIndex = users.findIndex(
        (temp) => temp.userId === userId
      );

      let currentUser = users[currentUserIndex];
      currentUser = {
        ...currentUser,
        companyId,
        currentPosition,
        companyName,
        level: 1,
      };

      users[currentUserIndex] = currentUser;

      populateTable(users);
      saveUsers(users);
    }
    return;
  });
};

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

// select btnGetUserData button and add onclick listener
const btnGetUserData = document.getElementById("btnGetUserData");

btnGetUserData.onclick = () => {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(
      tabs[0].id,
      { action: "getUserData" },
      function (data) {
        updateUsersData(data.userData);
      }
    );
  });
};

const addUserProfile = (event) => {
  const currentButton = event.target;

  const inputValue = currentButton.parentElement.children[0].value;

  const currentUserId = currentButton.id.split("btnpro-")[1];

  chrome.storage.sync.get(["users"], function (data) {
    if (!!data.users) {
      let users = data.users;

      const currentUserIndex = users.findIndex(
        (temp) => temp.userId === currentUserId
      );

      let currentUser = users[currentUserIndex];
      currentUser = {
        ...currentUser,
        profileUrl: inputValue,
      };

      users[currentUserIndex] = currentUser;

      populateTable(users);
      saveUsers(users);
    }
    return;
  });
};
