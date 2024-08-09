const createForm = document.querySelector("#submit-form");
const userName = document.querySelector("#username-input");
const userNameError = document.querySelector("#username-error");
const email = document.querySelector("#email-input");
const emailError = document.querySelector("#email-error");
const firstName = document.querySelector("#firstname-input");
const firstNameError = document.querySelector("#firstname-error");
const lastName = document.querySelector("#lastname-input");
const lastNameError = document.querySelector("#lastname-error");
const submitButton = document.querySelector("#submit-btn");
const toggleBtnId = document.querySelector("#toggle-btn-id");
const addUserBtn = document.querySelector("#create-btn-id");
const modalWrap = document.querySelector(".wrap");
toggleBtnId.addEventListener("click", toggleNav);
window.addEventListener("DOMContentLoaded", renderUsers);
userName.addEventListener("input", () => {
  userNameError.textContent = "";
});

email.addEventListener("input", () => {
  emailError.textContent = "";
});
firstName.addEventListener("input", () => {
  firstNameError.textContent = "";
});
lastName.addEventListener("input", () => {
  lastNameError.textContent = "";
});
addUserBtn.addEventListener("click", () => {
  if (modalWrap.classList.contains("hide")) {
    modalWrap.classList.remove("hide");
  } else modalWrap.classList.add("hide");
});
window.addEventListener("mouseup", (event) => {
  const formContainer = document.querySelector(".create-form-container");

  if (!formContainer.contains(event.target)) {
    modalWrap.classList.add("hide");
  }
});
createForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const userNameValue = userName.value;
  const emailValue = email.value;
  const firstNameValue = firstName.value;
  const lastNameValue = lastName.value;
  const inputValues = {
    userNameValue,
    emailValue,
    firstNameValue,
    lastNameValue,
  };
  const isValid = validateInputs(inputValues);
  console.log(isValid);
  if (isValid) {
    saveToLocalStorage("users", {
      user_id: numberOfItemsLocalStorage("users"),
      username: userNameValue,
      email: emailValue,
      firstname: firstNameValue,
      lastname: lastNameValue,
    });
    renderUsers();
    userName.value = "";
    email.value = "";
    firstName.value = "";
    lastName.value = "";
  }
});

function validateInputs({
  userNameValue,
  emailValue,
  firstNameValue,
  lastNameValue,
}) {
  let isValidEmail, isValidUserName, isValidFirstName, isValidLastName;

  isValidUserName = validateUserName(userNameValue);
  isValidEmail = validateEmail(emailValue);
  isValidFirstName = validateFirstName(firstNameValue);
  isValidLastName = validateLastName(lastNameValue);

  return isValidUserName && isValidEmail && isValidFirstName && isValidLastName;
}
function validateEmail(emailValue) {
  if (emailValue === "") {
    emailError.textContent = "Email is required";
    addError(emailError);
    return false;
  }
  const emailPattern =
    /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
  if (!emailValue.match(emailPattern)) {
    emailError.textContent = "Invalid Email";
    addError(emailError);
    return false;
  }
  return true;
}

function validateFirstName(firstNameValue) {
  if (firstNameValue === "") {
    firstNameError.textContent = "First name is required";
    addError(firstNameError);
    return false;
  }
  const firstnamePattern = /^[A-Za-z]+$/;
  if (!firstNameValue.match(firstnamePattern)) {
    firstNameError.textContent = "first name should contain only alphabets";
    addError(firstNameError);
    return false;
  }
  return true;
}

function validateLastName(lastNameValue) {
  if (lastNameValue === "") {
    lastNameError.textContent = "Last name is required";
    addError(lastNameError);
    return false;
  }
  const lastnamePattern = /^[A-Za-z]+$/;
  if (!lastNameValue.match(lastnamePattern)) {
    lastNameError.textContent = "last name should contain only alphabets";
    addError(lastNameError);
    return false;
  }
  return true;
}

function validateUserName(userNameValue) {
  if (userNameValue === "") {
    userNameError.textContent = "User name is required";
    addError(userNameError);
    return false;
  }
  const regex = /^[a-zA-Z0-9]+$/;
  if (!userNameValue.match(regex)) {
    userNameError.textContent = "Username should be alphanumeric";
    addError(userNameError);
    return false;
  }
  return true;
}

function addError(container) {
  if (container.classList.contains("hide")) {
    container.classList.remove("hide");
  }
}

function saveToLocalStorage(key, object) {
  let users = JSON.parse(localStorage.getItem(key));
  if (users === null) {
    users = [object];
  } else {
    users.push(object);
  }
  const usersJSON = JSON.stringify(users);
  localStorage.setItem(key, usersJSON);
}
function getFromLocalStorage(key) {
  const value = JSON.parse(localStorage.getItem(key));
  if (value === null) {
    return [];
  } else {
    return value;
  }
}

function numberOfItemsLocalStorage(key) {
  let users = JSON.parse(localStorage.getItem(key));
  if (users === null) {
    return 0;
  } else {
    return users.length;
  }
}
function toggleNav() {
  const sidebar = document.getElementById("mySidebar");
  const main = document.getElementById("main");
  sidebar.classList.toggle("closed");
  if (window.innerWidth <= 768) {
    sidebar.classList.toggle("open");
  }
}

function renderUsers() {
  const users = getFromLocalStorage("users");

  const tableBody = document.querySelector("#table-body");
  tableBody.innerHTML = "";
  users.forEach((user) => {
    const tableRow = createTableRow(user);

    tableBody.append(tableRow);
  });
}

function createTableRow(user) {
  const { user_id, username, firstname, lastname, email } = user;
  const tableRow = document.createElement("tr");
  tableRow.classList.add("user-table-row");
  tableRow.setAttribute("user_id", `${user_id}`);
  tableRow.innerHTML = `
<td>${String(user_id)}</td>
<td>${username}</td>
<td>${firstname}</td>
<td>${lastname}</td>
<td>${email}</td>
<td> <button class="edit-btn" onClick="editUser()" >Edit</button> <button class="delete-btn" onClick="deleteUser(event)">Delete</button> </td> 
`;
  return tableRow;
}

function deleteUser(event) {
  const target = event.target;

  const tableRow = target.parentElement.parentElement;
  const userId = tableRow.getAttribute("user_id");
  console.log("usere", userId);
  removeUserFromLocalStorage(userId);
  renderUsers();
}

function removeUserFromLocalStorage(deleteUser) {
  const users = getFromLocalStorage("users");
  const filteredUsers = users.filter(
    (user) => user.user_id !== Number(deleteUser)
  );

  const newUsers = filteredUsers.map((user, index) => {
    return {
      ...user,
      user_id: index,
    };
  });
  console.log(newUsers);
  localStorage.removeItem("users");
  localStorage.setItem("users", JSON.stringify(newUsers));
}
