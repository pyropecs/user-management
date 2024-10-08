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
// group management page variables
const groupNameInput = document.querySelector("#groupname-input");
const groupNameError = document.querySelector("#groupname-error");
const groupSubmitForm = document.querySelector("#group-submit-form");
const userListModal = document.querySelector("#group-users-form");
const multiUserSelect = document.querySelector("#multi-user-select");
const groupMembers = document.querySelector("#group-users-list");
//role management page variables

const createRoleBtn = document.querySelector("#create-role-btn-id");
const roleForm = document.querySelector("#role-form");
const roleSubmitForm = document.querySelector("#role-submit-form");
const roleInput = document.querySelector("#rolename-input");
const roleDescriptionInput = document.querySelector("#role-description-input");
const roleUsersForm = document.querySelector("#role-users-form");
const roleGroupForm = document.querySelector("#role-groups-form");
const viewAssigneesModal = document.querySelector("#role-assignees");
multiUserSelect.addEventListener("click", showCheckboxes);
toggleBtnId.addEventListener("click", toggleNav);
window.addEventListener("DOMContentLoaded", renderUsers);
window.addEventListener("DOMContentLoaded", renderGroups);
window.addEventListener("DOMContentLoaded", renderRoles);
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
createRoleBtn.addEventListener("click", () => {
  roleForm.classList.remove("hide");
});
userName.addEventListener("input", () => {
  userNameError.textContent = "";
});

groupNameInput.addEventListener("input", () => {
  groupNameError.textContent = "";
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
window.addEventListener("mouseup", (event) => {
  const multiuserSelect = document.querySelector("#multi-user-select");

  if (!multiuserSelect.contains(event.target)) {
    userListModal.classList.add("hide");
  }
});
window.addEventListener("mouseup", (event) => {
  const multiuserSelect = document.querySelector("#group-users-list-modal");

  if (!multiuserSelect.contains(event.target)) {
    groupMembers.classList.add("hide");
  }
});
window.addEventListener("mouseup", (event) => {
  const roleSubmitForm = document.querySelector("#role-submit-form");

  if (!roleSubmitForm.contains(event.target)) {
    roleForm.classList.add("hide");
  }
});
window.addEventListener("mouseup", (event) => {
  const roleSubmitForm = document.querySelector("#multi-user-select-role");

  if (!roleSubmitForm.contains(event.target)) {
    roleUsersForm.classList.add("hide");
  }
});

window.addEventListener("mouseup", (event) => {
  const roleSubmitForm = document.querySelector("#multi-group-select-role");

  if (!roleSubmitForm.contains(event.target)) {
    roleGroupForm.classList.add("hide");
  }
});

window.addEventListener("mouseup", (event) => {
  const viewAssigneesContainer = document.querySelector("#view-assignees-id");

  if (!viewAssigneesContainer.contains(event.target)) {
    viewAssigneesModal.classList.add("hide");
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
      id: Number(editIndex),
      username: inputValues.userNameValue,
      email: inputValues.emailValue,
      firstname: inputValues.firstNameValue,
      lastname: inputValues.lastNameValue,
    };
    updateTodotoLocalStorage(updatedUser, "users");
    showSuccess("User Edited successfully");
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
      id: getIndexFromLocalStorage("users"),
      username: inputValues.userNameValue,
      email: inputValues.emailValue,
      firstname: inputValues.firstNameValue,
      lastname: inputValues.lastNameValue,
    });
    showSuccess("User Added Successfully");
    renderUsers();
    userName.value = "";
    email.value = "";
    firstName.value = "";
    lastName.value = "";
    modalWrap.classList.add("hide");
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
  if(checkPropertyValueExists("email",emailValue,"users")){
    emailError.textContent = "Email Already Exists";
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
  if(checkPropertyValueExists("username",userNameValue,"users")){
    userNameError.textContent = "Username Already Exists";
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
  let items = JSON.parse(localStorage.getItem(key));
  if (items === null) {
    items = [object];
  } else {
    items.push(object);
  }
  const usersJSON = JSON.stringify(items);
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

function getIndexFromLocalStorage(key) {
  let users = JSON.parse(localStorage.getItem(key));
  if (users === null || users.length === 0) {
    return 0;
  } else {
    const lastIndex = users[users.length - 1].id;
    return lastIndex + 1;
  }
}
function toggleNav() {
  const sidebar = document.getElementById("mySidebar");

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
  const { id, username, firstname, lastname, email } = user;
  const tableRow = document.createElement("tr");
  tableRow.classList.add("user-table-row");
  tableRow.setAttribute("id", `${id}`);
  tableRow.innerHTML = `
<td>${String(id)}</td>
<td>${username}</td>
<td>${firstname}</td>
<td>${lastname}</td>
<td>${email}</td>
<td> <button class="edit-btn button"  >Edit</button> <button class="delete-btn button red"  >Delete</button> </td> 
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
  const userId = userRow.getAttribute("id");
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
  const userId = tableRow.getAttribute("id");

  removeUserFromLocalStorage(userId, "users");
  renderUsers();
}

function getItemFromLocalStorageUsingIndex(index, key) {
  const items = getFromLocalStorage(key);

  const isTaskExist = checkItemExist(items, Number(index));
  if (isTaskExist) {
    const [item] = items.filter((item) => item.id === Number(index));
    return item;
  } else {
    throw new Error("the given item didnt exist");
  }
}
function checkItemExist(items, index) {
  const number = items.findIndex((item) => index === item.id);

  if (number >= 0) {
    return true;
  } else {
    return false;
  }
}

function removeUserFromLocalStorage(deleteItem, key) {
  const items = getFromLocalStorage(key);
  const filteredItems = items.filter((item) => item.id !== Number(deleteItem));
  localStorage.removeItem(key);
  localStorage.setItem(key, JSON.stringify(filteredItems));
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
  const isTaskExist = checkItemExist(items, Number(item.id));
  if (isTaskExist) {
    const newItems = items.map((renderItem) => {
      if (renderItem.id === Number(item.id)) {
        for (const key in item) {
          if (item.hasOwnProperty(key)) {
            renderItem[key] = item[key];
          }
        }
      }
      return renderItem;
    });
    return newItems;
  } else {
    throw new Error("the given task doesnt exist");
  }
}

function showSuccess(message) {
  successMsg.classList.remove("hide");
  const successMessage = document.querySelector("#show-success-id span");
  successMessage.textContent = message;
  setTimeout(() => {
    successMsg.classList.add("hide");
  }, 3000);
}

groupSubmitForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const value = groupNameInput.value;
  const isValid = validateGroupName(value);
  if (isValid) {
    const group = {
      id: getIndexFromLocalStorage("groups"),
      groupname: value,
      users: [],
    };
    saveToLocalStorage("groups", group);
    showSuccess("Group Created Successfully");
    renderGroups();
    groupForm.classList.add("hide");
  }
});

function validateGroupName(groupName) {
  if (groupName === "") {
    groupNameError.textContent = "Group name is required";
    addError(groupNameError);
    return false;
  }

  if(checkPropertyValueExists("groupname",groupName,"groups")){
    groupNameError.textContent = "Group name is Already exists";
    addError(groupNameError);
    return false;
  }
  return true;
}

function renderGroups() {
  const groups = getFromLocalStorage("groups");

  const groupTableBody = document.querySelector("#group-table-body");
  groupTableBody.innerHTML = "";
  groups.forEach((group) => {
    const tableRow = createTableGroupRow(group);

    groupTableBody.append(tableRow);
  });
}

function createTableGroupRow(group) {
  const { id, groupname } = group;
  const tableRow = document.createElement("tr");
  tableRow.classList.add("user-table-row");
  tableRow.setAttribute("id", `${id}`);
  tableRow.innerHTML = `
<td>${String(id)}</td>
<td>${groupname}</td>

<td> <div class="btn-group-container">  <button class="add-user button" id="add-group-users" >Add Users/Remove Users</button><button class="view-user button"  >View members</button> <button class="delete-group-btn button"  >delete group</button>  </div> </td> 
`;
  const deleteBtn = tableRow.querySelector(".delete-group-btn");
  const addUsersAndRemoveUsersBtn = tableRow.querySelector("#add-group-users");
  const viewMemBtn = tableRow.querySelector(".view-user");
  viewMemBtn.addEventListener("click", () => {
    viewMembers(id);
  });
  deleteBtn.addEventListener("click", deleteGroup);
  addUsersAndRemoveUsersBtn.addEventListener(
    "click",
    addAndRemoveUsersFromGroup
  );
  return tableRow;
}

function viewMembers(groupId) {
  groupMembers.classList.remove("hide");
  const group = getItemFromLocalStorageUsingIndex(groupId, "groups");
  const members = group.users;

  const usernames = members.map((member) => {
    const memberDetails = getItemFromLocalStorageUsingIndex(member, "users");

    return memberDetails.username;
  });
  renderMembers(usernames);
}

function renderMembers(usernames) {
  const groupMembersModal = document.querySelector("#group-users-list-modal");
  groupMembersModal.innerHTML = "";
  const userName = document.createElement("div");
  userName.classList.add("user-name-container");
  usernames.forEach((username) => {
    const paratag = document.createElement("p");
    paratag.classList.add("member");
    paratag.textContent = username;
    userName.append(paratag);
  });

  groupMembersModal.append(userName);
}

function deleteGroup(event) {
  const target = event.target;

  const tableRow = target.parentElement.parentElement.parentElement;
  const groupId = tableRow.getAttribute("id");
  console.log(groupId);
  removeUserFromLocalStorage(groupId, "groups");
  renderGroups();
}
function addAndRemoveUsersFromGroup(event) {
  userListModal.classList.remove("hide");
  const target = event.target;
  const tableRow = target.parentElement.parentElement.parentElement;
  const groupId = tableRow.getAttribute("id");
  userListModal.setAttribute("group-id", groupId);
  const checkBoxContainer = document.querySelector("#user-checkboxes");
  renderCheckboxes(checkBoxContainer, groupId, "groups");
}

multiUserSelect.addEventListener("submit", (e) => {
  e.preventDefault();
  const checkboxes = Array.from(document.querySelectorAll(".checkbox"));
  const checkedCheckboxes = checkboxes.filter((checkbox) => {
    return checkbox.checked === true;
  });
  const userIndex = checkedCheckboxes.map((checkedCheckbox) => {
    const id = checkedCheckbox.getAttribute("id");
    return id;
  });

  const groupId = userListModal.getAttribute("group-id");
  const group = getItemFromLocalStorageUsingIndex(groupId, "groups");
  const updatedGroup = {
    ...group,
    users: userIndex,
  };
  updateTodotoLocalStorage(updatedGroup, "groups");
  showSuccess("Members in group is Updated Successfully");
  userListModal.classList.add("hide");
});
const multiGroupSelect = document.querySelector("#multi-group-select-role");
multiGroupSelect.addEventListener("submit", (e) => {
  e.preventDefault();
  const checkboxes = Array.from(document.querySelectorAll(".checkbox"));
  const checkedCheckboxes = checkboxes.filter((checkbox) => {
    return checkbox.checked === true;
  });
  const groupIndex = checkedCheckboxes.map((checkedCheckbox) => {
    const id = checkedCheckbox.getAttribute("id");
    return id;
  });
  const roleId = roleGroupForm.getAttribute("role-id");
  const group = getItemFromLocalStorageUsingIndex(roleId, "roles");
  const updatedRole = {
    ...group,
    groups: groupIndex,
  };
  updateTodotoLocalStorage(updatedRole, "roles");
  showSuccess("Groups in Role is Updated Successfully");
  roleGroupForm.classList.add("hide");
});

function renderCheckboxes(checkBoxContainer, id, key) {
  checkBoxContainer.innerHTML = "";
  const users = getFromLocalStorage("users");
  users.forEach((user) => {
    const label = document.createElement("label");
    label.classList.add("checkbox");

    const isAlreadyMember = checkUserisAlreadyAMember(id, String(user.id), key);

    label.innerHTML = `<input type="checkbox" ${
      isAlreadyMember ? "checked" : ""
    }  class="checkbox" id=${user.id} />${user.username}</label>`;
    checkBoxContainer.append(label);
  });
}

function showCheckboxes(e) {
  e.stopPropagation();

  const checkboxes = document.querySelector("#user-checkboxes");
  checkboxes.style.display = "flex";
}
function checkUserisAlreadyAMember(groupId, userId, key) {
  const group = getItemFromLocalStorageUsingIndex(groupId, key);
  const members = group.users;
  console.log(group, userId);
  return members.includes(userId);
}

roleSubmitForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const roleInputValue = roleInput.value;
  const roledescriptionValue = roleDescriptionInput.value;

  const isRoleValid = validateRoleName(roleInputValue);
  const isDescriptionValid = validateDescription(roledescriptionValue);
  if (isRoleValid && isDescriptionValid) {
    const role = {
      id: getIndexFromLocalStorage("roles"),
      rolename: roleInputValue,
      description: roledescriptionValue,
      users: [],
    };
    saveToLocalStorage("roles", role);
    showSuccess("Role Created Successfully");
    renderRoles();
    roleForm.classList.add("hide");
  }
});

const multiUserSelectRole = document.querySelector("#multi-user-select-role");
multiUserSelectRole.addEventListener("submit", (e) => {
  e.preventDefault();
  const checkboxes = Array.from(document.querySelectorAll(".checkbox"));
  const checkedCheckboxes = checkboxes.filter((checkbox) => {
    return checkbox.checked === true;
  });
  const userIndex = checkedCheckboxes.map((checkedCheckbox) => {
    const id = checkedCheckbox.getAttribute("id");
    return id;
  });

  const roleId = roleUsersForm.getAttribute("role-id");
  const role = getItemFromLocalStorageUsingIndex(roleId, "roles");
  const updatedRole = {
    ...role,
    users: userIndex,
  };
  updateTodotoLocalStorage(updatedRole, "roles");
  showSuccess("Members in role is Updated Successfully");
  roleUsersForm.classList.add("hide");
});

function validateRoleName(roleInputValue) {
  const roleNameError = document.querySelector("#role-error");
  if (roleInputValue === "") {
    roleNameError.textContent = "Role name is required";
    addError(roleNameError);
    return false;
  }
  if(checkPropertyValueExists("rolename",roleInputValue,"roles")){
    roleNameError.textContent = "Role name Already Exists";
    addError(roleNameError);
    return false;
  }
  return true;
}

function validateDescription(descriptionValue) {
  const roleDescriptionError = document.querySelector(
    "#role-description-error"
  );
  if (descriptionValue === "") {
    roleDescriptionError.textContent = "Role description is required";
    addError(roleDescriptionError);
    return false;
  }
  return true;
}

function renderRoles() {
  const roles = getFromLocalStorage("roles");

  const roleTableBody = document.querySelector("#role-table-body");
  roleTableBody.innerHTML = "";
  roles.forEach((role) => {
    const tableRow = createTableRoleRow(role);

    roleTableBody.append(tableRow);
  });
}
function createTableRoleRow(role) {
  const { id, description, rolename } = role;
  const tableRow = document.createElement("tr");
  tableRow.classList.add("user-table-row");
  tableRow.setAttribute("id", `${id}`);
  tableRow.innerHTML = `
<td>${String(id)}</td>
<td id="role-name">${rolename}</td>
<td><button id="role-assignees-btn" class="button">View Assignees</button> </td>
<td>${description}</td>

<td> <div class="btn-group-container">  <button class="add-user button" id="add-role-users" >Add Role to Users</button><button class="view-user button" id="add-role-group"  >Add Role to Groups</button>  </div> </td> 
`;
  // const deleteBtn = tableRow.querySelector(".delete-group-btn");
  const addUsersToRoleBtn = tableRow.querySelector("#add-role-users");
  const addGroupsToRoleBtn = tableRow.querySelector("#add-role-group");
  const viewAssigneesBtn = tableRow.querySelector("#role-assignees-btn");

  addUsersToRoleBtn.addEventListener("click", addUsersToRole);
  addGroupsToRoleBtn.addEventListener("click", addGroupsToRole);
  viewAssigneesBtn.addEventListener("click", () => {
    viewAssignees(id);
  });
  return tableRow;
}

function addUsersToRole(event) {
  roleUsersForm.classList.remove("hide");
  const target = event.target;
  const tableRow = target.parentElement.parentElement.parentElement;
  const roleId = tableRow.getAttribute("id");
  userListModal.setAttribute("role-id", roleId);
  const roleCheckBoxes = document.querySelector("#role-checkboxes");
  renderCheckboxes(roleCheckBoxes, roleId, "roles");
}

function viewAssignees(roleId) {
  viewAssigneesModal.classList.remove("hide");
  groupMembers.classList.remove("hide");
  const role = getItemFromLocalStorageUsingIndex(roleId, "roles");
  const members = role.users;
  const groups = role.groups;
  const usernames = members.map((member) => {
    const memberDetails = getItemFromLocalStorageUsingIndex(member, "users");

    return memberDetails.username;
  });
  const groupNames = members.map((member) => {
    const memberDetails = getItemFromLocalStorageUsingIndex(member, "groups");

    return memberDetails.groupname;
  });
  renderRoleMembers(usernames);
  renderRoleGroups(groupNames)
}

function renderRoleMembers(usernames) {
  const groupMembersModal = document.querySelector("#users-list");
  groupMembersModal.innerHTML = "";
  const userName = document.createElement("div");
  userName.classList.add("user-name-container");
  usernames.forEach((username) => {
    const paratag = document.createElement("p");
    paratag.classList.add("member");
    paratag.textContent = username;
    userName.append(paratag);
  });

  groupMembersModal.append(userName);
}
function renderRoleGroups(groupnames) {
  const groupMembersModal = document.querySelector("#groups-list");
  groupMembersModal.innerHTML = "";
  const groupName = document.createElement("div");
  groupName.classList.add("group-name-container");
  groupnames.forEach((groupname) => {
    const paratag = document.createElement("p");
    paratag.classList.add("member");
    paratag.textContent = groupname;
    groupName.append(paratag);
  });

  groupMembersModal.append(groupName);
}

function addGroupsToRole(event) {
  roleGroupForm.classList.remove("hide");
  const target = event.target;
  const tableRow = target.parentElement.parentElement.parentElement;
  const roleId = tableRow.getAttribute("id");
  roleGroupForm.setAttribute("role-id", roleId);
  const roleCheckBoxes = document.querySelector("#role-group-checkboxes");
  renderGroupCheckboxes(roleCheckBoxes, roleId, "roles");
}

function renderGroupCheckboxes(checkBoxContainer, id, key) {
  checkBoxContainer.innerHTML = "";
  const groups = getFromLocalStorage("groups");
  groups.forEach((group) => {
    const label = document.createElement("label");
    label.classList.add("checkbox");

    const isAlreadyMember = checkUserisAlreadyAMember(
      id,
      String(group.id),
      key
    );

    label.innerHTML = `<input type="checkbox" ${
      isAlreadyMember ? "checked" : ""
    }  class="checkbox" id=${group.id} />${group.groupname}</label>`;
    checkBoxContainer.append(label);
  });
}

const searchInput = document.querySelector("#search-role");
searchInput.addEventListener("input", () => {
  const searchTerm = searchInput.value;

  const items = document.querySelectorAll("#role-name");

  items.forEach((item) => {
    const text = item.textContent;

    const tableRow = item.parentElement;
    if (text.includes(searchTerm)) {
      tableRow.classList.remove("hide");
    } else {
      tableRow.classList.add("hide");
    }
  });
});

function checkPropertyValueExists(property, value,key) {

  const usersJson = localStorage.getItem(key);
  
 
  if (usersJson) {
      try {
          const usersArray = JSON.parse(usersJson);

        
          for (const user of usersArray) {
              if (user[property] === value) {
                  return true; 
              }
          }
      } catch (e) {
          console.error('Error parsing JSON from localStorage:', e);
      }
  }
  
  return false; 
}