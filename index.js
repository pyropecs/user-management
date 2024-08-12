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
const createGroupBtn = document.querySelector("#create-group-btn-id");
const groupForm = document.querySelector("#group-form");
const groupManagementBtn = document.querySelector("#group-management-btn");
const userManagementBtn = document.querySelector("#user-management-btn");
const roleManagementBtn = document.querySelector("#role-management-btn");
const userManagementPage = document.querySelector("#user-management-page");
const groupManagementPage = document.querySelector("#group-management-page");
const roleManagementPage = document.querySelector("#role-management-page");
const successMsg = document.querySelector("#show-success-id");
const userTitle = document.querySelector("#user-title-id");
toggleBtnId.addEventListener("click", toggleNav);
window.addEventListener("DOMContentLoaded", renderUsers);
userManagementBtn.addEventListener("click", () => {
  userManagementPage.classList.remove("hide");
  groupManagementPage.classList.add("hide");
  roleManagementPage.classList.add("hide");
});
groupManagementBtn.addEventListener("click", () => {
  userManagementPage.classList.add("hide");
  groupManagementPage.classList.remove("hide");
  roleManagementPage.classList.add("hide");
});
roleManagementBtn.addEventListener("click", () => {
  userManagementPage.classList.add("hide");
  groupManagementPage.classList.add("hide");
  roleManagementPage.classList.remove("hide");
});

createGroupBtn.addEventListener("click", () => {
  groupForm.classList.remove("hide");
});

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
window.addEventListener("mouseup", (event) => {
  const formContainer = document.querySelector("#create-group-form-container");

  if (!formContainer.contains(event.target)) {
    groupForm.classList.add("hide");
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
  const isEdit = modalWrap.getAttribute("isEdit");

  if (isEdit === "true") {
    submitEditForm(isValid, inputValues);
  } else {
    createSubmitForm(isValid, inputValues);
  }
});

function submitEditForm(isValid, inputValues) {
  const editIndex = modalWrap.getAttribute("editIndex");
  if (isValid) {
    const updatedUser = {
      user_id: Number(editIndex),
      username: inputValues.userNameValue,
      email: inputValues.emailValue,
      firstname: inputValues.firstNameValue,
      lastname: inputValues.lastNameValue,
    };
    updateTodotoLocalStorage(updatedUser, "users");
    showSuccess();
    renderUsers();
    userName.value = "";
    email.value = "";
    firstName.value = "";
    lastName.value = "";
    modalWrap.removeAttribute("isEdit");
    modalWrap.removeAttribute("editIndex");
    modalWrap.classList.add("hide");
    userTitle.textContent = "Create User";
    submitButton.textContent = "Add User";
  }
}

function createSubmitForm(isValid, inputValues) {
  if (isValid) {
    saveToLocalStorage("users", {
      user_id: numberOfItemsLocalStorage("users"),
      username: inputValues.userNameValue,
      email: inputValues.emailValue,
      firstname: inputValues.firstNameValue,
      lastname: inputValues.lastNameValue,
    });
    showSuccess();
    renderUsers();
    userName.value = "";
    email.value = "";
    firstName.value = "";
    lastName.value = "";
  }
}

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
<td> <button class="edit-btn"  >Edit</button> <button class="delete-btn"  >Delete</button> </td> 
`;
  const deleteBtn = tableRow.querySelector(".delete-btn");
  const editBtn = tableRow.querySelector(".edit-btn");
  deleteBtn.addEventListener("click", deleteUser);
  editBtn.addEventListener("click", editUser);
  return tableRow;
}

function editUser(event) {
  const target = event.target;
  const userRow = target.parentElement.parentElement;
  const userId = userRow.getAttribute("user_id");
  modalWrap.classList.remove("hide");
  modalWrap.setAttribute("editIndex", userId);
  modalWrap.setAttribute("isEdit", "true");
  userTitle.textContent = "Edit User";
  submitButton.textContent = "Edit User";
  try {
    const item = getItemFromLocalStorageUsingIndex(userId, "users");
    userName.value = item.username;
    lastName.value = item.lastname;
    firstName.value = item.firstname;
    email.value = item.email;
  } catch (err) {
    console.error(err.message);
  }
}

function deleteUser(event) {
  const target = event.target;

  const tableRow = target.parentElement.parentElement;
  const userId = tableRow.getAttribute("user_id");

  removeUserFromLocalStorage(userId);
  renderUsers();
}

function getItemFromLocalStorageUsingIndex(index, key) {
  const items = getFromLocalStorage(key);

  const isTaskExist = checkItemExist(items, Number(index));
  if (isTaskExist) {
    const [item] = items.filter((item) => item.user_id === Number(index));
    return item;
  } else {
    throw new Error("the given task didnt exist");
  }
}
function checkItemExist(items, index) {
  const number = items.findIndex((item) => index === item.user_id);

  if (number >= 0) {
    return true;
  } else {
    return false;
  }
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

  localStorage.removeItem("users");
  localStorage.setItem("users", JSON.stringify(newUsers));
}
function updateTodotoLocalStorage(item, key) {
  const items = JSON.parse(localStorage.getItem(key));
  try {
    const updatedItems = updateItem(items, item);
    localStorage.removeItem(key);
    localStorage.setItem(key, JSON.stringify(updatedItems));
  } catch (error) {
    throw new Error(error.message);
  }
}
function updateItem(items, item) {
  const isTaskExist = checkItemExist(items, Number(item.user_id));
  if (isTaskExist) {
    const newItems = items.map((renderItem) => {
      if (renderItem.user_id === Number(item.user_id)) {
        renderItem.username = item.username;
        renderItem.lastname = item.lastname;
        renderItem.firstname = item.firstname;
        renderItem.email = item.email;
      }
      return renderItem;
    });
    return newItems;
  } else {
    throw new Error("the given task doesnt exist");
  }
}

function showSuccess() {
  successMsg.classList.remove("hide");

  setTimeout(() => {
    successMsg.classList.add("hide");
  }, 3000);
}
