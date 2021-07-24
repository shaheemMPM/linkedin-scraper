const saveUsers = (users) => {
  chrome.storage.sync.set({ users: users });
};

chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  const currentSite = tabs[0].url;
  if (currentSite.includes("https://www.linkedin.com/sales/search")) {
    document.getElementById("btnAddSelect").style.display = "block";
    document.getElementById("btnGetUsers").style.display = "block";
  } else if (currentSite.includes("https://www.linkedin.com/sales/people")) {
    document.getElementById("btnGetUserData").style.display = "block";
  } else if (currentSite.includes("https://www.linkedin.com/sales/company")) {
    document.getElementById("btnGetCompanyData").style.display = "block";
  }
});

const getFirstName = (name) => {
  let nameList = name.split(" ");
  return nameList.shift();
};

const getLastName = (name) => {
  let nameList = name.split(" ");
  nameList.shift();
  return nameList.join(" ");
};

const populateTable = (users) => {
  const usersTable = document.getElementById("tbUsers");
  usersTable.innerHTML = `
    <tr id="headLine">
      <th>First name</th>
      <th>lastName</th>
      <th>jobTitle</th>
      <th>jobTitleLevel</th>
      <th>jobTitleDepartment</th>
      <th>companyName</th>
      <th>emailAddress</th>
      <th>streetAddress</th>
      <th>street address 2</th>
      <th>city</th>
      <th>state</th>
      <th>zipcode</th>
      <th>country</th>
      <th>phoneNumber</th>
      <th>direct</th>
      <th>industryType</th>
      <th>employeeSize</th>
      <th>revenueSize</th>
      <th>jobTitleLink</th>
      <th>companyLink</th>
      <th>Actions</th>
    </tr>
  `;

  for (let i = 0; i < users.length; i++) {
    const user = users[i];
    const tempTR = document.createElement("tr");
    tempTR.id = user.userId;

    if (user.level === 0) {
      tempTR.innerHTML = `
        <td>${getFirstName(user.userName)}</td>
        <td>${getLastName(user.userName)}</td>
        <td></td>
        <td></td>
        <td></td>
        <td>${user.companyName || ""}</td>
        <td></td>
        <td>${user.companyAddress || ""}</td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td>${user.noEmployees || ""}</td>
        <td></td>
        <td></td>
        <td>${user.companyProfile || ""}</td>
        <td>
          <a href="${user.userHref}" target="_blank">OPEN USER</a>
        </td>`;
    } else if (user.level === 1 && !!user.profileUrl) {
      tempTR.innerHTML = `
        <td>${getFirstName(user.userName)}</td>
        <td>${getLastName(user.userName)}</td>
        <td>${user.currentPosition}</td>
        <td></td>
        <td></td>
        <td>${user.companyName || ""}</td>
        <td></td>
        <td>${user.companyAddress || ""}</td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td>${user.noEmployees || ""}</td>
        <td></td>
        <td>${user.profileUrl}</td>
        <td>${user.companyProfile || ""}</td>
        <td>
          <a href="https://www.linkedin.com/sales/company/${
            user.companyId
          }" target="_blank">OPEN COMPANY</a>
        </td>`;
    } else if (user.level === 1) {
      tempTR.innerHTML = `
        <td>${getFirstName(user.userName)}</td>
        <td>${getLastName(user.userName)}</td>
        <td>${user.currentPosition}</td>
        <td></td>
        <td></td>
        <td>${user.companyName || ""}</td>
        <td></td>
        <td>${user.companyAddress || ""}</td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td>${user.noEmployees || ""}</td>
        <td></td>
        <td>
          <input type="text" placeholder="profile url"/>
          <button id="btnpro-${
            user.userId
          }" class="btn-add-profile">ADD</button>
        </td>
        <td>${user.companyProfile || ""}</td>
        <td>
          <a href="https://www.linkedin.com/sales/company/${
            user.companyId
          }" target="_blank">OPEN COMPANY</a>
        </td>`;
    } else if (user.level === 2 && !!user.companyProfile) {
      tempTR.innerHTML = `
        <td>${getFirstName(user.userName)}</td>
        <td>${getLastName(user.userName)}</td>
        <td>${user.currentPosition}</td>
        <td></td>
        <td></td>
        <td>${user.companyName}</td>
        <td></td>
        <td>${user.companyAddress}</td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td>${user.noEmployees}</td>
        <td></td>
        <td></td>
        <td>${user.companyProfile}</td>
        <td></td>`;
    } else if (user.level === 2) {
      tempTR.innerHTML = `
        <td>${getFirstName(user.userName)}</td>
        <td>${getLastName(user.userName)}</td>
        <td>${user.currentPosition}</td>
        <td></td>
        <td></td>
        <td>${user.companyName}</td>
        <td></td>
        <td>${user.companyAddress}</td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td>${user.noEmployees}</td>
        <td></td>
        <td></td>
        <td>
          <input type="text" placeholder="company url"/>
          <button id="btncompany-${
            user.companyId
          }" class="btn-add-company">ADD</button>
        </td>
        <td></td>`;
    }
    usersTable.appendChild(tempTR);
  }

  const btnAddProfile = document.getElementsByClassName("btn-add-profile");
  for (let j = 0; j < btnAddProfile.length; j++) {
    btnAddProfile[j].addEventListener("click", addUserProfile, false);
  }

  const btnAddCompany = document.getElementsByClassName("btn-add-company");
  for (let j = 0; j < btnAddCompany.length; j++) {
    btnAddCompany[j].addEventListener("click", addCompanyUrl, false);
  }
};

const readUsers = () => {
  chrome.storage.sync.get(["users"], (data) => {
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

  chrome.storage.sync.get(["users"], (data) => {
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

const updateCompanyData = (company) => {
  const { companyId, companyAddress, noEmployees } = company;

  chrome.storage.sync.get(["users"], (data) => {
    if (!!data.users) {
      let users = data.users;

      for (let i = 0; i < users.length; i++) {
        let user = users[i];
        if (user.companyId === companyId) {
          user.companyAddress = companyAddress;
          user.noEmployees = noEmployees;
          user.level = 2;
          users[i] = user;
        }
      }

      populateTable(users);
      saveUsers(users);
    }
    return;
  });
};

// select btnAddSelect button and add onclick listener
const btnAddSelect = document.getElementById("btnAddSelect");

btnAddSelect.onclick = () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { action: "addButtons" }, (data) => {
      console.log("select : ", data);
    });
  });
};

// select btnGetUsers button and add onclick listener
const btnGetUsers = document.getElementById("btnGetUsers");

btnGetUsers.onclick = () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { action: "getUsers" }, (data) => {
      saveUsers(data.candidates);
      populateTable(data.candidates);
    });
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
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { action: "getUserData" }, (data) => {
      updateUsersData(data.userData);
    });
  });
};

// select btnGetCompanyData button and add onclick listener
const btnGetCompanyData = document.getElementById("btnGetCompanyData");

btnGetCompanyData.onclick = () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(
      tabs[0].id,
      { action: "getCompanyData" },
      (data) => {
        updateCompanyData(data.companyData);
      }
    );
  });
};

const addUserProfile = (event) => {
  const currentButton = event.target;

  const inputValue = currentButton.parentElement.children[0].value;

  const currentUserId = currentButton.id.split("btnpro-")[1];

  chrome.storage.sync.get(["users"], (data) => {
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

const addCompanyUrl = (event) => {
  const currentButton = event.target;

  const inputValue = currentButton.parentElement.children[0].value;

  const currentCompanyId = currentButton.id.split("btncompany-")[1];

  chrome.storage.sync.get(["users"], (data) => {
    if (!!data.users) {
      let users = data.users;

      for (let i = 0; i < users.length; i++) {
        let user = users[i];
        if (user.companyId === currentCompanyId) {
          user.companyProfile = inputValue;
          users[i] = user;
        }
      }

      populateTable(users);
      saveUsers(users);
    }
    return;
  });
};
