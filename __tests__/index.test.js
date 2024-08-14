require("@testing-library/jest-dom");
const fs = require("fs");
const path = require("path");
const {
  getByText,

  waitFor,
  getByAltText,
  prettyDOM,
  queryByText,
  fireEvent,
  getByPlaceholderText,
  getByRole,
} = require("@testing-library/dom");
const { userEvent } = require("@testing-library/user-event");
const { Chance } = require("chance");
const chance = new Chance();
beforeEach(() => {
  const html = fs.readFileSync(
    path.resolve(__dirname, "../index.html"),
    "utf8"
  );
  document.documentElement.innerHTML = html.toString();
  require("../index.js");
  jest.resetModules();

  const mockLocalStorage = (() => {
    let store = {};
    return {
      getItem: (key) => store[key] || null,
      setItem: (key, value) => (store[key] = value.toString()),
      clear: () => (store = {}),
      removeItem: (key) => delete store[key],
    };
  })();
  Object.defineProperty(window, "localStorage", {
    value: mockLocalStorage,
  });
  localStorage.clear();
});

afterEach(() => {
  localStorage.clear();
});
describe("creation of user", () => {
  test("to check the title is present in the create user page", () => {
    const title = getByText(document.body, /Create User/);
    expect(title).toBeInTheDocument();
  });
  test(" to check that username is present in the document and its attributes", () => {
    const userName = document.querySelector("#username-input");
    expect(userName).toBeInTheDocument();

    expect(userName).toHaveAttribute("type", "text");
    expect(userName).toHaveAttribute("title", "user name");
    expect(userName).toHaveAttribute("placeholder", "Username");
  });

  test("to check that username error component is present and its attributes", () => {
    const userNameError = document.querySelector("#username-error");
    expect(userNameError).toBeInTheDocument();
    expect(userNameError.classList.contains("hide")).toBe(true);
  });

  test("email field is present in the page and its attributes", () => {
    const emailField = document.querySelector("#email-input");
    expect(emailField).toBeInTheDocument();
    expect(emailField).toHaveAttribute("type", "text");
    expect(emailField).toHaveAttribute("placeholder", "Email");
    expect(emailField).toHaveAttribute("title", "Email");
  });

  test("email error is present in the page", () => {
    const emailError = document.querySelector("#email-error");
    expect(emailError).toBeInTheDocument();
    expect(emailError.classList.contains("hide")).toBe(true);
  });

  test("first name field should be present in the form and its attributes", () => {
    const firstNameField = document.querySelector("#firstname-input");
    expect(firstNameField).toBeInTheDocument();
    expect(firstNameField).toHaveAttribute("type", "text");
    expect(firstNameField).toHaveAttribute("placeholder", "First name");
    expect(firstNameField).toHaveAttribute("title", "First name");
  });

  test("first name field error should be present in the form and hide initally", () => {
    const firstNameError = document.querySelector("#firstname-error");
    expect(firstNameError.classList.contains("hide")).toBe(true);
    expect(firstNameError).toBeInTheDocument();
  });

  test("last name field should be present in the form and hide it initally", () => {
    const lastNameField = document.querySelector("#lastname-input");
    expect(lastNameField).toBeInTheDocument();
    expect(lastNameField).toHaveAttribute("type", "text");
    expect(lastNameField).toHaveAttribute("placeholder", "Last name");
    expect(lastNameField).toHaveAttribute("title", "Last name");
  });

  test("last name field error should be present in the form and hide it intially", () => {
    const lastNameError = document.querySelector("#lastname-error");
    expect(lastNameError.classList.contains("hide")).toBe(true);
    expect(lastNameError).toBeInTheDocument();
  });

  test("to check button is present in the form element and type is submit", () => {
    const addUser = getByText(document.body, /Add User/);
    expect(addUser).toHaveAttribute("type", "submit");
  });

  test("testing that when clicking the button when no username input is there and giving the error message", () => {
    const addUser = getByText(document.body, /Add User/);

    addUser.click();
    const userNameError = document.querySelector("#username-error");
    expect(userNameError.textContent).toBe("User name is required");
  });

  test("testing that when clcking the add button when no email input is there and giving the error message", () => {
    const addUser = getByText(document.body, /Add User/);

    addUser.click();

    const emailError = document.querySelector("#email-error");
    expect(emailError.textContent).toBe("Email is required");
  });

  test("testing that when clcking the add button when no first name input is there and giving the error message", () => {
    const addUser = getByText(document.body, /Add User/);

    addUser.click();
    const firstNameError = document.querySelector("#firstname-error");
    expect(firstNameError.textContent).toBe("First name is required");
  });
  test("testing that when clcking the add button when no last name input is there and giving the error message", () => {
    const addUser = getByText(document.body, /Add User/);

    addUser.click();
    const lastNameError = document.querySelector("#lastname-error");
    expect(lastNameError.textContent).toBe("Last name is required");
  });
  test("submitting username field with only symbols", () => {
    const userName = document.querySelector("#username-input");
    const userNameError = document.querySelector("#username-error");
    userName.value = chance.string({
      symbols: true,
      alpha: false,
      numeric: false,
    });

    const addUser = getByText(document.body, /Add User/);
    addUser.click();
    expect(userNameError.textContent).toBe("Username should be alphanumeric");
    expect(userNameError.classList.contains("hide")).toBeFalsy();
  });

  test("submitting user name with valid inputs", () => {
    const userName = document.querySelector("#username-input");
    const userNameError = document.querySelector("#username-error");
    userName.value = chance.string({
      symbols: false,
      alpha: true,
      numeric: true,
    });
    const addUser = getByText(document.body, /Add User/);
    addUser.click();
    expect(userNameError.textContent).toBe("");
  });

  test("testing email with valid inputs", () => {
    const email = document.querySelector("#email-input");
    const emailError = document.querySelector("#email-error");
    email.value = chance.email();
    const addUser = getByText(document.body, /Add User/);
    addUser.click();
    expect(emailError.textContent).toBe("");
  });
  test("testing email with invalid inputs", () => {
    const email = document.querySelector("#email-input");
    const emailError = document.querySelector("#email-error");
    email.value = chance.string({ symbols: true });
    const addUser = getByText(document.body, /Add User/);
    addUser.click();
    expect(emailError.textContent).toBe("Invalid Email");
  });

  test("testing firstname with invalid inputs", () => {
    const firstName = document.querySelector("#firstname-input");
    const firstNameError = document.querySelector("#firstname-error");
    firstName.value = chance.string({
      symbols: true,
      alpha: false,
      numeric: false,
    });
    const addUser = getByText(document.body, /Add User/);
    addUser.click();
    expect(firstNameError.textContent).toBe(
      "first name should contain only alphabets"
    );
  });

  test("testing firstname with valid inputs", () => {
    const firstName = document.querySelector("#firstname-input");
    const firstNameError = document.querySelector("#firstname-error");
    firstName.value = chance.string({
      symbols: false,
      alpha: true,
      numeric: false,
    });
    const addUser = getByText(document.body, /Add User/);
    addUser.click();
    expect(firstNameError.textContent).toBe("");
  });

  test("testing lastname with invalid inputs", () => {
    const lastName = document.querySelector("#lastname-input");
    const lastNameError = document.querySelector("#lastname-error");
    lastName.value = chance.string({
      symbols: true,
      alpha: false,
      numeric: false,
    });
    const addUser = getByText(document.body, /Add User/);
    addUser.click();
    expect(lastNameError.textContent).toBe(
      "last name should contain only alphabets"
    );
  });

  test("testing firstname with invalid inputs", () => {
    const lastName = document.querySelector("#lastname-input");
    const lastNameError = document.querySelector("#lastname-error");
    lastName.value = chance.string({
      symbols: false,
      alpha: true,
      numeric: false,
    });
    const addUser = getByText(document.body, /Add User/);
    addUser.click();
    expect(lastNameError.textContent).toBe("");
  });
  test("when typing username input the error message should be gone", async () => {
    const userName = document.querySelector("#username-input");
    const userNameError = document.querySelector("#username-error");
    const userNameValue = chance.string({
      symbols: true,
      numeric: true,
      alpha: true,
    });
    userName.value = userNameValue;
    const addUser = getByText(document.body, /Add User/);
    addUser.click();
    const newValidUsername = chance.string({
      symbols: false,
      numeric: false,
      alpha: true,
    });
    await userEvent.type(userName, newValidUsername);
    await waitFor(() => {
      expect(userNameError.textContent).toBe("");
    });
  });

  test("when typing email input the error message should be gone", async () => {
    const email = document.querySelector("#email-input");
    const emailError = document.querySelector("#email-error");
    const emailValue = chance.string({
      symbols: true,
      numeric: true,
      alpha: true,
    });
    email.value = emailValue;
    const addUser = getByText(document.body, /Add User/);
    addUser.click();
    const newValidEmail = chance.email();
    await userEvent.type(email, newValidEmail);
    await waitFor(() => {
      expect(emailError.textContent).toBe("");
    });
  });
  test("when typing first name input the error message should be gone", async () => {
    const firstName = document.querySelector("#firstname-input");
    const firstNameError = document.querySelector("#firstname-error");
    const firstNameValue = chance.string({
      symbols: true,
      numeric: true,
      alpha: true,
    });
    firstName.value = firstNameValue;
    const addUser = getByText(document.body, /Add User/);
    addUser.click();
    const newValidfirstName = chance.string({
      symbols: false,
      numeric: false,
      alpha: true,
    });
    await userEvent.type(firstName, newValidfirstName);
    await waitFor(() => {
      expect(firstNameError.textContent).toBe("");
    });
  });
  test("when typing last name input the error message should be gone", async () => {
    const lastName = document.querySelector("#lastname-input");
    const lastNameError = document.querySelector("#lastname-error");
    const lastNameValue = chance.string({
      symbols: true,
      numeric: true,
      alpha: true,
    });
    lastName.value = lastNameValue;
    const addUser = getByText(document.body, /Add User/);
    addUser.click();
    const newValidlastName = chance.string({
      symbols: false,
      numeric: false,
      alpha: true,
    });
    await userEvent.type(lastName, newValidlastName);
    await waitFor(() => {
      expect(lastNameError.textContent).toBe("");
    });
  });

  test("the user should be created and added to the local storage with valid inputs", () => {
    const lastName = document.querySelector("#lastname-input");
    const lastNameValue = chance.string({
      symbols: false,
      alpha: true,
      numeric: false,
    });
    lastName.value = lastNameValue;
    const firstName = document.querySelector("#firstname-input");
    const firstNameValue = chance.string({
      symbols: false,
      alpha: true,
      numeric: false,
    });
    firstName.value = firstNameValue;
    const email = document.querySelector("#email-input");
    const emailValue = chance.email();
    email.value = emailValue;
    const userName = document.querySelector("#username-input");
    const userNameValue = chance.string({
      symbols: false,
      alpha: true,
      numeric: true,
    });
    userName.value = userNameValue;
    const addUser = getByText(document.body, /Add User/);
    addUser.click();
    expect(JSON.parse(localStorage.getItem("users"))).toStrictEqual([
      {
        id: 0,
        username: userNameValue,
        email: emailValue,
        firstname: firstNameValue,
        lastname: lastNameValue,
      },
    ]);
  });
  test("it should give error that when we type existing user even its valid inputs",()=>{
    const lastName = document.querySelector("#lastname-input");
    const lastNameValue = chance.string({
      symbols: false,
      alpha: true,
      numeric: false,
    });
    lastName.value = lastNameValue;
    const firstName = document.querySelector("#firstname-input");
    const firstNameValue = chance.string({
      symbols: false,
      alpha: true,
      numeric: false,
    });
    firstName.value = firstNameValue;
    const email = document.querySelector("#email-input");
    const emailValue = chance.email();
    email.value = emailValue;
    const userName = document.querySelector("#username-input");
    const userNameValue = chance.string({
      symbols: false,
      alpha: true,
      numeric: true,
    });
    userName.value = userNameValue;
    const addUser = getByText(document.body, /Add User/);
    addUser.click();
    email.value = emailValue
    userName.value = userNameValue
    addUser.click()
    const emailError = document.querySelector("#email-error");
    const userNameError = document.querySelector("#username-error");
    expect(emailError.textContent).toBe("Email Already Exists")
    expect(userNameError.textContent).toBe("Username Already Exists")
  })

  test("invalid inputs should added in local storage when trying to add with invalid inputs", () => {
    const lastName = document.querySelector("#lastname-input");

    const lastNameValue = chance.string({
      symbols: true,
      alpha: false,
      numeric: false,
    });
    lastName.value = lastNameValue;
    const firstName = document.querySelector("#firstname-input");
    const firstNameValue = chance.string({
      symbols: true,
      alpha: true,
      numeric: false,
    });
    firstName.value = firstNameValue;
    const email = document.querySelector("#email-input");
    const emailValue = chance.string();
    email.value = emailValue;
    const userName = document.querySelector("#username-input");
    const userNameValue = chance.string({
      symbols: true,
      alpha: true,
      numeric: true,
    });
    userName.value = userNameValue;
    const addUser = getByText(document.body, /Add User/);
    addUser.click();

    expect(localStorage.getItem("users")).toBeNull();
  });
});

describe("to check that sidebar every requirements satisfies it", () => {
  test("to check the title of the sidebar is present", () => {
    const menuTitle = getByText(document.body, /Menu/);
    expect(menuTitle).toBeInTheDocument();
  });

  test("to check that user management button is present", () => {
    const userManagement = getByText(document.body, /User management/);
    expect(userManagement).toBeInTheDocument();
  });

  test("to check that group management button is present", () => {
    const groupManagement = getByText(document.body, /Group management/);
    expect(groupManagement).toBeInTheDocument();
  });

  test("to check that group management button is present", () => {
    const roleManagement = getByText(document.body, /Role management/);
    expect(roleManagement).toBeInTheDocument();
  });
  test("to check that hamburger icon is present", () => {
    const hamburgerMenu = getByAltText(document.body, /menu bar/);
    expect(hamburgerMenu).toBeInTheDocument();
  });
  test("to check that user management icon is present", () => {
    const userManagement = getByAltText(document.body, /user management/);
    expect(userManagement).toBeInTheDocument();
  });
  test("to check that role management icon is present", () => {
    const roleManagement = getByAltText(document.body, /role management/);
    expect(roleManagement).toBeInTheDocument();
  });
  test("to check that group management icon is present", () => {
    const groupManagement = getByAltText(document.body, /group management/);
    expect(groupManagement).toBeInTheDocument();
  });
});

describe("the user management", () => {
  test("the title should be present in the user management tab", () => {
    const userManagementTitle = getByText(
      document.body,
      /User Management System/
    );
    expect(userManagementTitle).toBeInTheDocument();
  });

  test("the create user button should be present in the user management tab", () => {
    const addUserBtn = document.querySelector("#create-btn-id");
    expect(addUserBtn.textContent).toBe("New User");
    expect(addUserBtn).not.toBeNull();
  });
  test("without clicking new button the modal shpuld be hidden", () => {
    const modalWrap = document.querySelector(".wrap");
    expect(modalWrap.classList.contains("hide")).toBeTruthy();
  });

  test("when clicking new user button the modal should be displayed", () => {
    const newUserBtn = document.querySelector("#create-btn-id");
    newUserBtn.click();
    const modalWrap = document.querySelector(".wrap");
    expect(modalWrap.classList.contains("hide")).toBeFalsy();
  });
  test("to test that user management table having the necessary columns", () => {
    const userTable = document.querySelector(".user-table");
    const userId = getByText(userTable, /User Id/);
    expect(userId).toBeInTheDocument();
    const userName = getByText(userTable, /Username/);
    expect(userName).toBeInTheDocument();
    const email = getByText(userTable, /Email/);
    expect(email).toBeInTheDocument();
    const firstName = getByText(userTable, /First Name/);
    expect(firstName).toBeInTheDocument();
    const lastName = getByText(userTable, /Last Name/);
    expect(lastName).toBeInTheDocument();
  });

  function createUser(userDetails) {
    const lastName = document.querySelector("#lastname-input");

    const lastNameValue = userDetails.lastName;
    lastName.value = lastNameValue;
    const firstName = document.querySelector("#firstname-input");
    const firstNameValue = userDetails.firstName;
    firstName.value = firstNameValue;
    const email = document.querySelector("#email-input");
    const emailValue = userDetails.email;
    email.value = emailValue;
    const userName = document.querySelector("#username-input");
    const userNameValue = userDetails.username;
    userName.value = userNameValue;
    const addUser = getByText(document.body, /Add User/);
    addUser.click();
  }
  test("to test that adding user with valid inputs will added to the local storage and success message will be displayed", () => {
    const userDetails = {
      lastName: chance.string({ symbols: false, numeric: false, alpha: true }),
      firstName: chance.string({ symbols: false, numeric: false, alpha: true }),
      email: chance.email(),
      username: chance.string({ symbols: false, numeric: true, alpha: true }),
    };
    createUser(userDetails);
    expect(JSON.parse(localStorage.getItem("users"))).toStrictEqual([
      {
        id: 0,
        username: userDetails.username,
        email: userDetails.email,
        firstname: userDetails.firstName,
        lastname: userDetails.lastName,
      },
    ]);
    const successMsg = getByText(document.body, /User Added Successfully/);
    expect(successMsg.classList.contains("hide")).toBeFalsy();
  });

  test("to test that created task is rendered in the table", () => {
    const userDetails = {
      lastName: chance.string({ symbols: false, numeric: false, alpha: true }),
      firstName: chance.string({ symbols: false, numeric: false, alpha: true }),
      email: chance.email(),
      username: chance.string({ symbols: false, numeric: true, alpha: true }),
    };
    createUser(userDetails);
    const userTable = document.querySelector("#user-table-id");

    const lastName = getByText(userTable, userDetails.lastName);
    expect(lastName).toBeInTheDocument();
    const firstName = getByText(userTable, userDetails.firstName);
    expect(firstName).toBeInTheDocument();
    const email = getByText(userTable, userDetails.email);
    expect(email).toBeInTheDocument();
    const userName = getByText(userTable, userDetails.username);
    expect(userName).toBeInTheDocument();
    const editBtn = getByText(userTable, /Edit/);
    expect(editBtn).toBeInTheDocument();
    const deleteBtn = getByText(userTable, /Delete/);
    expect(deleteBtn).toBeInTheDocument();
    const tableRow = lastName.parentElement;
    expect(tableRow).toHaveAttribute("id", "0");
  });
  test("to check that clicking delete button actually delete the selected user", () => {
    const userDetails = {
      lastName: chance.string({ symbols: false, numeric: false, alpha: true }),
      firstName: chance.string({ symbols: false, numeric: false, alpha: true }),
      email: chance.email(),
      username: chance.string({ symbols: false, numeric: true, alpha: true }),
    };
    createUser(userDetails);
    const userTable = document.querySelector("#user-table-id");
    let lastName = getByText(userTable, userDetails.lastName);
    const tableRow = lastName.parentElement;
    const deleteBtn = getByText(tableRow, /Delete/);
    expect(tableRow.getAttribute("id")).toBe("0");
    expect(deleteBtn).toBeInTheDocument();
    fireEvent.click(deleteBtn);
    lastName = queryByText(userTable, userDetails.lastName);
    expect(lastName).toBeNull();
  });
});

describe("user edit functionality", () => {
  function createUser(userDetails) {
    const lastName = document.querySelector("#lastname-input");

    const lastNameValue = userDetails.lastName;
    lastName.value = lastNameValue;
    const firstName = document.querySelector("#firstname-input");
    const firstNameValue = userDetails.firstName;
    firstName.value = firstNameValue;
    const email = document.querySelector("#email-input");
    const emailValue = userDetails.email;
    email.value = emailValue;
    const userName = document.querySelector("#username-input");
    const userNameValue = userDetails.username;
    userName.value = userNameValue;
    const addUser = getByText(document.body, /Add User/);
    addUser.click();
  }
  const userDetails = {
    lastName: chance.string({ symbols: false, numeric: false, alpha: true }),
    firstName: chance.string({ symbols: false, numeric: false, alpha: true }),
    email: chance.email(),
    username: chance.string({ symbols: false, numeric: true, alpha: true }),
  };
  beforeEach(() => {
    createUser(userDetails);
  });

  test("to test that clicking edit button should open the modal", () => {
    const userTable = document.querySelector("#user-table-id");
    let email = getByText(userTable, userDetails.lastName);
    const tableRow = email.parentElement;
    const editBtn = getByText(tableRow, /Edit/);
    expect(editBtn.disabled).toBeFalsy();

    fireEvent.click(editBtn);
    const modalWrap = document.querySelector(".wrap");
    expect(modalWrap.classList.contains("hide")).toBeFalsy();
  });

  test("to check that clicking edit button will pop up the modal", () => {
    const userTable = document.querySelector("#user-table-id");
    let email = getByText(userTable, userDetails.lastName);
    const tableRow = email.parentElement;
    const editBtn = getByText(tableRow, /Edit/);
    expect(editBtn.disabled).toBeFalsy();
    fireEvent.click(editBtn);
    const modalWrap = document.querySelector(".wrap");
    expect(modalWrap.classList.contains("hide")).toBeFalsy();
    const userTitle = document.querySelector("#user-title-id");
    expect(userTitle.textContent).toBe("Edit User");
    const submitBtn = document.querySelector("#submit-btn");
    expect(submitBtn.textContent).toBe("Edit User");
    expect(modalWrap).toHaveAttribute("isEdit", "true");
    expect(modalWrap).toHaveAttribute("editIndex", "0");
  });
  test("to check that click edit will have the current inputs in the edit form", () => {
    const userTable = document.querySelector("#user-table-id");
    let email = getByText(userTable, userDetails.lastName);
    const tableRow = email.parentElement;
    const editBtn = getByText(tableRow, /Edit/);
    expect(editBtn.disabled).toBeFalsy();
    fireEvent.click(editBtn);
    const lastNameValue = document.querySelector("#lastname-input").value;
    const firstNameValue = document.querySelector("#firstname-input").value;
    const emailValue = document.querySelector("#email-input").value;
    const userNameValue = document.querySelector("#username-input").value;
    expect(lastNameValue).toBe(userDetails.lastName);
    expect(firstNameValue).toBe(userDetails.firstName);
    expect(emailValue).toBe(userDetails.email);
    expect(userNameValue).toBe(userDetails.username);
  });

  test("to check that after submit the edit form it should be updated in the local storage also display in the document", () => {
    const userTable = document.querySelector("#user-table-id");
    let email = getByText(userTable, userDetails.lastName);
    const tableRow = email.parentElement;
    const editBtn = getByText(tableRow, /Edit/);
    expect(editBtn.disabled).toBeFalsy();
    fireEvent.click(editBtn);
    const oldItem = JSON.parse(localStorage.getItem("users"))[0];
    const newUserDetails = {
      lastName: chance.string({ symbols: false, numeric: false, alpha: true }),
      firstName: chance.string({ symbols: false, numeric: false, alpha: true }),
      email: chance.email(),
      username: chance.string({ symbols: false, numeric: true, alpha: true }),
    };
    document.querySelector("#lastname-input").value = newUserDetails.lastName;
    document.querySelector("#firstname-input").value = newUserDetails.firstName;
    document.querySelector("#email-input").value = newUserDetails.email;
    document.querySelector("#username-input").value = newUserDetails.username;
    let editUser = document.querySelector("#submit-btn");
    fireEvent.click(editUser);
    editUser = document.querySelector("#submit-btn");
    expect(editUser.textContent).toBe("Add User");
    const userTitle = document.querySelector("#user-title-id");
    expect(userTitle.textContent).toBe("Create User");
    const newItem = JSON.parse(localStorage.getItem("users"))[0];
    expect(oldItem).not.toStrictEqual(newItem);
    expect(newItem.lastname).toBe(newUserDetails.lastName);
    expect(queryByText(document.body, newUserDetails.lastName)).not.toBeNull();
    expect(queryByText(document.body, newUserDetails.firstName)).not.toBeNull();
    expect(queryByText(document.body, newUserDetails.username)).not.toBeNull();
    expect(queryByText(document.body, newUserDetails.email)).not.toBeNull();
    expect(queryByText(document.body, oldItem.lastname)).toBeNull();
    expect(queryByText(document.body, oldItem.firstname)).toBeNull();
    expect(queryByText(document.body, oldItem.username)).toBeNull();
    expect(queryByText(document.body, oldItem.email)).toBeNull();
  });
});

describe("sidebar functioanlity", () => {
  test("to check that clicking group management from user management should show the group management tab", () => {
    const groupManagementBtn = document.querySelector("#group-management-btn");
    groupManagementBtn.click();
    const userManagementPage = document.querySelector("#user-management-page");
    expect(userManagementPage.classList.contains("hide")).toBeTruthy();
    const groupManagementPage = document.querySelector(
      "#group-management-page"
    );
    expect(groupManagementPage.classList.contains("hide")).toBeFalsy();
  });
});

describe("group managment ", () => {
  test("to check that all elements are displayed in the group management", () => {
    const groupManagementTitle = getByText(
      document.body,
      /Group Management System/
    );
    const groupManagementPage = document.querySelector(
      "#group-management-page"
    );
    expect(groupManagementTitle).toBeInTheDocument();
    const newGroupBtn = document.querySelector("#create-group-btn-id");
    expect(newGroupBtn.disabled).toBeFalsy();
    expect(newGroupBtn.textContent).toBe("New Group");
    expect(newGroupBtn).not.toBeNull();
    const groupTableId = getByText(groupManagementPage, /Group Id/);
    expect(groupTableId).toBeInTheDocument();
    const groupTableName = getByText(groupManagementPage, /Group Name/);
    expect(groupTableName).toBeInTheDocument();
    const groupTableActions = getByText(groupManagementPage, /Actions/);
    expect(groupTableActions).toBeInTheDocument();
  });
  test("to check that clicking new group button should open the modal", () => {
    const newGroupBtn = document.querySelector("#create-group-btn-id");

    fireEvent(newGroupBtn, new Event("click"));

    const modalWrap = document.querySelector("#group-form");
    expect(modalWrap.classList.contains("hide")).toBeFalsy();
  });

  test("to check that create Group contains necessary components in it", () => {
    const groupForm = document.querySelector("#group-form");
    const createGroupTitle = getByText(groupForm, /Create Group/);
    expect(createGroupTitle).toBeInTheDocument();
    const inputform = getByPlaceholderText(groupForm, /Group Name/);
    expect(inputform).toBeInTheDocument();
    const createGroupBtn = document.querySelector("#submit-group-btn");
    expect(createGroupBtn.disabled).toBeFalsy();
    expect(createGroupBtn).toBeInTheDocument();
  });
  test("the group should be created when valid input is entered", () => {
    const validGroupName = chance.string({
      symbols: false,
      numeric: true,
      alpha: true,
    });
    const inputform = document.querySelector("#groupname-input");
    inputform.value = validGroupName;
    const createGroupBtn = document.querySelector("#submit-group-btn");
    const groupNameError = document.querySelector("#groupname-error");
    expect(groupNameError.textContent).toBe("");
    fireEvent.click(createGroupBtn);
    expect(
      queryByText(document.body, /Group Created Successfully/)
    ).not.toBeNull();
    const item = JSON.parse(localStorage.getItem("groups"));
    expect(groupNameError.textContent).toBe("");
    expect(item[0].groupname).toBe(validGroupName);
    const groupName = getByText(document.body, validGroupName);
    expect(groupName).toBeInTheDocument();
  });
  test("the error should be displayed when invalid group name is entered", () => {
    const invalidGroupName = "";
    const inputform = document.querySelector("#groupname-input");
    inputform.value = invalidGroupName;
    const createGroupBtn = document.querySelector("#submit-group-btn");
    const groupNameError = document.querySelector("#groupname-error");
    expect(groupNameError.textContent).toBe("");
    fireEvent.click(createGroupBtn);
    expect(groupNameError.textContent).toBe("Group name is required");
  });
  test("to check that clicking delete button from one group should delete the entire group", () => {
    const validGroupName = chance.string({
      symbols: false,
      numeric: true,
      alpha: true,
    });
    const inputform = document.querySelector("#groupname-input");
    inputform.value = validGroupName;
    const createGroupBtn = document.querySelector("#submit-group-btn");
    fireEvent.click(createGroupBtn);
    const groupName = getByText(document.body, validGroupName);
    const tableRow = groupName.parentElement.parentElement;
    const deleteBtn = getByText(tableRow, /delete/);
    expect(queryByText(document.body, validGroupName)).not.toBeNull();
    fireEvent(deleteBtn, new Event("click"));
    expect(queryByText(document.body, validGroupName)).toBeNull();
  });
});

describe("add users functionality to a group", () => {
  const validGroupName = chance.string();

  function createUser(userDetails) {
    const lastName = document.querySelector("#lastname-input");
    const userForm = document.querySelector("#user-form");
    const lastNameValue = userDetails.lastName;
    lastName.value = lastNameValue;
    const firstName = document.querySelector("#firstname-input");
    const firstNameValue = userDetails.firstName;
    firstName.value = firstNameValue;
    const email = document.querySelector("#email-input");
    const emailValue = userDetails.email;
    email.value = emailValue;
    const userName = document.querySelector("#username-input");
    const userNameValue = userDetails.username;
    userName.value = userNameValue;
    const addUser = getByText(userForm, /Add User/);
    addUser.click();
  }
  beforeEach(() => {
    const inputform = document.querySelector("#groupname-input");
    inputform.value = validGroupName;
    const createGroupBtn = document.querySelector("#submit-group-btn");
    fireEvent.click(createGroupBtn);
  });
  test("by clicking add/remove users it should open a new modal and it should close by clicking outside of the modal", () => {
    const userListModal = document.querySelector("#group-users-form");
    expect(userListModal).toBeInTheDocument();
    const groupName = getByText(document.body, validGroupName);
    const tableRow = groupName.parentElement.parentElement;
    const addUser = getByText(tableRow, /Add Users\/Remove Users/);
    expect(addUser).toBeInTheDocument();
    expect(userListModal.classList.contains("hide")).toBeTruthy();
    fireEvent.click(addUser);
    expect(userListModal.classList.contains("hide")).toBeFalsy();
  });

  test("to check that form elements are present in the modal", () => {
    const multiUserSelect = document.querySelector("#multi-user-select");
    expect(multiUserSelect).toBeInTheDocument();
  });

  test("to check that list of registered users shown in the drop down", () => {
    const users = [];
    const numberOfUsers = 5;
    for (let i = 0; i < numberOfUsers; i++) {
      const userDetails = {
        lastName: chance.string({
          symbols: false,
          numeric: false,
          alpha: true,
        }),
        firstName: chance.string({
          symbols: false,
          numeric: false,
          alpha: true,
        }),
        email: chance.email(),
        username: chance.string({ symbols: false, numeric: true, alpha: true }),
      };

      createUser(userDetails);
      users.push(userDetails.username);
    }
    const groupName = getByText(document.body, validGroupName);
    const tableRow = groupName.parentElement.parentElement;
    const addUser = getByText(tableRow, /Add Users\/Remove Users/);
    expect(addUser).toBeInTheDocument();
    fireEvent.click(addUser);
    const checkboxes = document.querySelector("#user-checkboxes");
    const user = getByText(checkboxes, users[0]);
    expect(user).toBeInTheDocument();
  });

  test("to check that list of users should be added in the particular group  ", () => {
    const users = [];
    const numberOfUsers = 3;
    for (let i = 0; i < numberOfUsers; i++) {
      const userDetails = {
        lastName: chance.string({
          symbols: false,
          numeric: false,
          alpha: true,
        }),
        firstName: chance.string({
          symbols: false,
          numeric: false,
          alpha: true,
        }),
        email: chance.email(),
        username: chance.string({ symbols: false, numeric: true, alpha: true }),
      };

      createUser(userDetails);
      users.push(userDetails.username);
    }

    const groupName = getByText(document.body, validGroupName);
    const tableRow = groupName.parentElement.parentElement;
    const addUser = getByText(tableRow, /Add Users\/Remove Users/);
    fireEvent.click(addUser);
    const checkboxes = document.querySelector("#user-checkboxes");
    const user = getByText(checkboxes, users[1]);
    const userAddBtn = document.querySelector("#user-add-btn");
    expect(userAddBtn).toBeInTheDocument();
    fireEvent.click(user);
    fireEvent.click(userAddBtn);

    expect(JSON.parse(localStorage.getItem("groups"))).toStrictEqual([
      {
        id: 0,
        groupname: validGroupName,
        users: ["1"],
      },
    ]);
    expect(
      queryByText(document.body, /Members in group is Updated Successfully/)
    ).not.toBeNull();
    const userListModal = document.querySelector("#group-users-form");
    expect(userListModal.classList.contains("hide")).toBeTruthy();
  });

  describe("to test existing members in that group", () => {
    const users = [];
    let checkboxes = document.querySelector("#user-checkboxes");

    const numberOfUsers = 3;
    beforeEach(() => {
      for (let i = 0; i < numberOfUsers; i++) {
        const userDetails = {
          lastName: chance.string({
            symbols: false,
            numeric: false,
            alpha: true,
          }),
          firstName: chance.string({
            symbols: false,
            numeric: false,
            alpha: true,
          }),
          email: chance.email(),
          username: chance.string({
            symbols: false,
            numeric: true,
            alpha: true,
          }),
        };

        createUser(userDetails);
        users.push(userDetails.username);
      }

      const groupName = getByText(document.body, validGroupName);
      const tableRow = groupName.parentElement.parentElement;
      const addUser = getByText(tableRow, /Add Users\/Remove Users/);
      fireEvent.click(addUser);
      checkboxes = document.querySelector("#user-checkboxes");
      const user = getByText(checkboxes, users[1]);
      const userAddBtn = document.querySelector("#user-add-btn");
      let updatedUser = getByText(checkboxes, users[1]);
      let userCheckbox = updatedUser.querySelector("input");
      expect(userCheckbox.checked).toBe(false);
      fireEvent.click(user);
      fireEvent.click(userAddBtn);
      expect(userCheckbox.checked).toBe(true);
    });
    test("the list of users should checked in the checkbox who are already is member in that", () => {
      updatedUser = getByText(checkboxes, users[1]);
      userCheckbox = updatedUser.querySelector("input");
      const user = getByText(checkboxes, users[0]);
      const notMemberCheckbox = user.querySelector("input");

      expect(userCheckbox.checked).toBe(true);
      expect(notMemberCheckbox.checked).toBe(false);
    });
  });
  test("view members is button is clickable and open the modal", () => {
    const groupName = getByText(document.body, validGroupName);
    const tableRow = groupName.parentElement.parentElement;
    const addUser = getByText(tableRow, /View members/);
    expect(addUser).toBeInTheDocument();
    fireEvent.click(addUser);
    const groupMembers = document.querySelector("#group-users-list");
    expect(groupMembers.classList.contains("hide")).toBeFalsy();
  });
  describe("to check view members that are already added", () => {
    const users = [];
    const numberOfUsers = 3;
    beforeEach(() => {
      for (let i = 0; i < numberOfUsers; i++) {
        const userDetails = {
          lastName: chance.string({
            symbols: false,
            numeric: false,
            alpha: true,
          }),
          firstName: chance.string({
            symbols: false,
            numeric: false,
            alpha: true,
          }),
          email: chance.email(),
          username: chance.string({
            symbols: false,
            numeric: true,
            alpha: true,
          }),
        };

        createUser(userDetails);
        users.push(userDetails.username);
      }

      const groupName = getByText(document.body, validGroupName);
      const tableRow = groupName.parentElement.parentElement;
      const addUser = getByText(tableRow, /Add Users\/Remove Users/);
      fireEvent.click(addUser);
      const checkboxes = document.querySelector("#user-checkboxes");
      const user = getByText(checkboxes, users[1]);
      const userAddBtn = document.querySelector("#user-add-btn");
      let updatedUser = getByText(checkboxes, users[1]);
      let userCheckbox = updatedUser.querySelector("input");
      expect(userCheckbox.checked).toBe(false);
      fireEvent.click(user);
      fireEvent.click(userAddBtn);
      expect(userCheckbox.checked).toBe(true);
    });

    test("view members should be displayed which are already added in the respective group", () => {
      const groupName = getByText(document.body, validGroupName);
      const tableRow = groupName.parentElement.parentElement;
      const viewMembers = getByText(tableRow, /View members/);
      fireEvent.click(viewMembers);
      const groupMembers = document.querySelector("#group-users-list");
      const member = getByText(groupMembers, users[1]);
      expect(member).toBeInTheDocument();
    });
  });
});

describe("role management", () => {
  test("to check that from user management button clicking role management button will go to the role management page", () => {
    const roleManagementBtn = document.querySelector("#role-management-btn");
    roleManagementBtn.click();
    const userManagementPage = document.querySelector("#user-management-page");
    expect(userManagementPage.classList.contains("hide")).toBeTruthy();
    const roleManagementPage = document.querySelector("#role-management-page");
    expect(roleManagementPage.classList.contains("hide")).toBeFalsy();
  });

  test("to check that all elements are present in this role management page", () => {
    const roleManagementPage = document.querySelector("#role-management-page");
    const roleManagementTitle = getByText(
      roleManagementPage,
      /Role Management System/
    );
    expect(roleManagementTitle).toBeInTheDocument();
    const newRoleButton = getByRole(roleManagementPage, "button");
    expect(newRoleButton.textContent).toBe("New Role");
    const roleTableId = getByText(roleManagementPage, /Role Id/);
    expect(roleTableId).toBeInTheDocument();
    const roleTableName = getByText(roleManagementPage, /Role Name/);
    expect(roleTableName).toBeInTheDocument();
    const roleTableDescriptions = getByText(roleManagementPage, /Description/);
    expect(roleTableDescriptions).toBeInTheDocument();
    const roleTableActions = getByText(roleManagementPage, /Actions/);
    expect(roleTableActions).toBeInTheDocument();
    const roleTableAssignees = getByText(roleManagementPage, /Assignees/);
    expect(roleTableAssignees).toBeInTheDocument();
  });
  test("to check that clicking new role button should open the modal", () => {
    const newGroupBtn = document.querySelector("#create-role-btn-id");

    fireEvent(newGroupBtn, new Event("click"));

    const modalRoleWrap = document.querySelector("#role-form");
    expect(modalRoleWrap.classList.contains("hide")).toBeFalsy();
  });

  test("to check that role Group contains necessary components in it", () => {
    const roleForm = document.querySelector("#role-form");
    const createRoleTitle = getByText(roleForm, /Create Role/);
    expect(createRoleTitle).toBeInTheDocument();
    const roleInput = getByPlaceholderText(roleForm, /Enter Role/);
    expect(roleInput).toBeInTheDocument();
    const roleDescription = getByPlaceholderText(roleForm, /Enter Description/);
    expect(roleDescription).toBeInTheDocument();
    const createRoleBtn = document.querySelector("#submit-role-btn");
    expect(createRoleBtn.disabled).toBeFalsy();
    expect(createRoleBtn).toBeInTheDocument();
  });

  test("the role should be created when valid input is entered", () => {
    const validRoleName = chance.string({
      symbols: false,
      numeric: true,
      alpha: true,
    });
    const validRoleDescription = chance.string();
    const roleInput = document.querySelector("#rolename-input");
    roleInput.value = validRoleName;
    const roleDescriptionInput = document.querySelector(
      "#role-description-input"
    );
    roleDescriptionInput.value = validRoleDescription;
    const createRoleBtn = document.querySelector("#submit-role-btn");
    const roleNameError = document.querySelector("#role-error");
    const roleDescriptionError = document.querySelector(
      "#role-description-error"
    );
    expect(roleNameError.textContent).toBe("");
    expect(roleDescriptionError.textContent).toBe("");
    fireEvent.click(createRoleBtn);
    expect(
      queryByText(document.body, /Role Created Successfully/)
    ).not.toBeNull();
    const item = JSON.parse(localStorage.getItem("roles"));

    expect(roleNameError.textContent).toBe("");
    expect(item[0].rolename).toBe(validRoleName);
    expect(item[0].description).toBe(validRoleDescription);
    const roleName = getByText(document.body, validRoleName);

    expect(roleName).toBeInTheDocument();
    const tableRow = roleName.parentElement;
    expect(getByText(tableRow, /Add Role to Users/)).toBeInTheDocument();
    expect(getByText(tableRow, /Add Role to Groups/)).toBeInTheDocument();
  });

  test("the error should be displayed when invalid group name is entered", () => {
    const invalidRoleName = "";
    const inputform = document.querySelector("#rolename-input");
    inputform.value = invalidRoleName;
    const createRoleBtn = document.querySelector("#submit-role-btn");
    const roleNameError = document.querySelector("#role-error");

    const roleDescriptionError = document.querySelector(
      "#role-description-error"
    );
    expect(roleNameError.textContent).toBe("");
    fireEvent.click(createRoleBtn);
    expect(roleNameError.textContent).toBe("Role name is required");
    expect(roleDescriptionError.textContent).toBe(
      "Role description is required"
    );
  });
  describe("to test the search functionality ", () => {
    const roles = [];
    function createRoles(validRoleName, validRoleDescription) {
      const roleInput = document.querySelector("#rolename-input");
      roleInput.value = validRoleName;
      const roleDescriptionInput = document.querySelector(
        "#role-description-input"
      );
      roleDescriptionInput.value = validRoleDescription;
      const createRoleBtn = document.querySelector("#submit-role-btn");
      const roleNameError = document.querySelector("#role-error");
      const roleDescriptionError = document.querySelector(
        "#role-description-error"
      );
      expect(roleNameError.textContent).toBe("");
      expect(roleDescriptionError.textContent).toBe("");
      fireEvent.click(createRoleBtn);
    }
    beforeEach(() => {
      for (let i = 0; i < 5; i++) {
        const validRoleName = chance.string({
          alpha: true,
          numeric: false,
          symbols: false,
        });
        const validRoleDescription = chance.string();
        createRoles(validRoleName, validRoleDescription); //creating 5 roles
        roles.push(validRoleName);
      }
    });
    test("to test that search filter displays the roles that only contain filter input", async () => {
      const searchRole = document.querySelector("#search-role");
      const roleTableBody = document.querySelector("#role-table-body");
      await userEvent.type(searchRole, roles[0]);
      await waitFor(() => {
        const rolesTags = roleTableBody.querySelectorAll("#role-name");
        rolesTags.forEach((roleTag, index) => {
          if (index === 0) {
            expect(
              roleTag.parentElement.classList.contains("hide")
            ).toBeFalsy();
          } else {
            expect(
              roleTag.parentElement.classList.contains("hide")
            ).toBeTruthy();
          }
        });
      });
    });
  });
});

describe("add role to multiple users", () => {
  const role = {
    name: chance.string({ numeric: false, alpha: true, numeric: false }),
    description: chance.string({ numeric: false, alpha: true, numeric: true }),
  };
  const users = [];
  const numberOfUsers = 5;
  function createUser(userDetails) {
    const lastName = document.querySelector("#lastname-input");
    const userForm = document.querySelector("#user-form");
    const lastNameValue = userDetails.lastName;
    lastName.value = lastNameValue;
    const firstName = document.querySelector("#firstname-input");
    const firstNameValue = userDetails.firstName;
    firstName.value = firstNameValue;
    const email = document.querySelector("#email-input");
    const emailValue = userDetails.email;
    email.value = emailValue;
    const userName = document.querySelector("#username-input");
    const userNameValue = userDetails.username;
    userName.value = userNameValue;
    const addUser = getByText(userForm, /Add User/);
    addUser.click();
  }
  function createRoles(validRoleName, validRoleDescription) {
    const roleInput = document.querySelector("#rolename-input");
    roleInput.value = validRoleName;
    const roleDescriptionInput = document.querySelector(
      "#role-description-input"
    );
    roleDescriptionInput.value = validRoleDescription;
    const createRoleBtn = document.querySelector("#submit-role-btn");
    const roleNameError = document.querySelector("#role-error");
    const roleDescriptionError = document.querySelector(
      "#role-description-error"
    );
    expect(roleNameError.textContent).toBe("");
    expect(roleDescriptionError.textContent).toBe("");
    fireEvent.click(createRoleBtn);
  }
  beforeEach(() => {
    createRoles(role.name, role.description);
  });

  test("the new users should be added to the a particular role", () => {
    const userListModal = document.querySelector("#role-users-form");
    expect(userListModal).toBeInTheDocument();
    const roleName = getByText(document.body, role.name);
    const tableRow = roleName.parentElement;
    const addUser = getByText(tableRow, /Add Role to Users/);
    expect(addUser).toBeInTheDocument();
    expect(userListModal.classList.contains("hide")).toBeTruthy();
    fireEvent.click(addUser);
    expect(userListModal.classList.contains("hide")).toBeFalsy();
  });

  test("to check that list of registered users shown in the drop down", () => {
    const users = [];
    const numberOfUsers = 5;
    for (let i = 0; i < numberOfUsers; i++) {
      const userDetails = {
        lastName: chance.string({
          symbols: false,
          numeric: false,
          alpha: true,
        }),
        firstName: chance.string({
          symbols: false,
          numeric: false,
          alpha: true,
        }),
        email: chance.email(),
        username: chance.string({ symbols: false, numeric: true, alpha: true }),
      };

      createUser(userDetails);
      users.push(userDetails.username);
    }
    const roleName = getByText(document.body, role.name);
    const tableRow = roleName.parentElement.parentElement;
    const addUser = getByText(tableRow, /Add Role to Users/);
    expect(addUser).toBeInTheDocument();
    fireEvent.click(addUser);
    const checkboxes = document.querySelector("#role-checkboxes");
    const user = getByText(checkboxes, users[0]);
    expect(user).toBeInTheDocument();
  });

  test("to check that list of users should be added in the particular role  ", () => {
    const numberOfUsers = 3;
    for (let i = 0; i < numberOfUsers; i++) {
      const userDetails = {
        lastName: chance.string({
          symbols: false,
          numeric: false,
          alpha: true,
        }),
        firstName: chance.string({
          symbols: false,
          numeric: false,
          alpha: true,
        }),
        email: chance.email(),
        username: chance.string({ symbols: false, numeric: true, alpha: true }),
      };

      createUser(userDetails);
      users.push(userDetails.username);
    }

    const roleName = getByText(document.body, role.name);
    const tableRow = roleName.parentElement.parentElement;
    const addUser = getByText(tableRow, /Add Role to Users/);
    fireEvent.click(addUser);
    const checkboxes = document.querySelector("#role-checkboxes");

    const user = getByText(checkboxes, users[0]);
    const userAddBtn = document.querySelector("#user-role-add-btn");
    expect(userAddBtn).toBeInTheDocument();
    fireEvent.click(user);
    fireEvent.click(userAddBtn);

    expect(JSON.parse(localStorage.getItem("roles"))).toStrictEqual([
      {
        id: 0,
        rolename: role.name,
        description: role.description,
        users: ["0"],
      },
    ]);
    expect(
      queryByText(document.body, /Members in role is Updated Successfully/)
    ).not.toBeNull();
    const roleUsersForm = document.querySelector("#role-users-form");
    expect(roleUsersForm.classList.contains("hide")).toBeTruthy();
  });
});

describe("add role to multiple groups", () => {
  const role = {
    name: chance.string({ numeric: false, alpha: true, numeric: false }),
    description: chance.string({ numeric: false, alpha: true, numeric: true }),
  };

  function createGroups(groupDetails) {
    const inputform = document.querySelector("#groupname-input");
    inputform.value = groupDetails;
    const createGroupBtn = document.querySelector("#submit-group-btn");
    fireEvent.click(createGroupBtn);
  }
  function createRoles(validRoleName, validRoleDescription) {
    const roleInput = document.querySelector("#rolename-input");
    roleInput.value = validRoleName;
    const roleDescriptionInput = document.querySelector(
      "#role-description-input"
    );
    roleDescriptionInput.value = validRoleDescription;
    const createRoleBtn = document.querySelector("#submit-role-btn");
    const roleNameError = document.querySelector("#role-error");
    const roleDescriptionError = document.querySelector(
      "#role-description-error"
    );
    expect(roleNameError.textContent).toBe("");
    expect(roleDescriptionError.textContent).toBe("");
    fireEvent.click(createRoleBtn);
  }
  beforeEach(() => {
    createRoles(role.name, role.description);
  });

  test("the new users should be added to the a particular role", () => {
    const roleGroupModal = document.querySelector("#role-groups-form");
    expect(roleGroupModal).toBeInTheDocument();
    const roleName = getByText(document.body, role.name);
    const tableRow = roleName.parentElement;
    const addUser = getByText(tableRow, /Add Role to Groups/);
    expect(addUser).toBeInTheDocument();
    expect(roleGroupModal.classList.contains("hide")).toBeTruthy();
    fireEvent.click(addUser);
    expect(roleGroupModal.classList.contains("hide")).toBeFalsy();
  });

  test("to check that list of registered groups shown in the drop down", () => {
    const groups = [];
    const numberOfGroups = 5;
    for (let i = 0; i < numberOfGroups; i++) {
      const groupDetails = {
        groupname: chance.string({
          symbols: false,
          numeric: false,
          alpha: true,
        }),
      };

      createGroups(groupDetails.groupname);
      groups.push(groupDetails.groupname);
    }
    const roleName = getByText(document.body, role.name);
    const tableRow = roleName.parentElement.parentElement;
    const addUser = getByText(tableRow, /Add Role to Groups/);
    expect(addUser).toBeInTheDocument();
    fireEvent.click(addUser);
    const checkboxes = document.querySelector("#role-group-checkboxes");
    const user = getByText(checkboxes, groups[0]);
    expect(user).toBeInTheDocument();
  });

  test("to check that list of groups should be added in the particular role  ", () => {
    const groups = [];
    const numberOfGroups = 3;
    for (let i = 0; i < numberOfGroups; i++) {
      const groupDetails = {
        groupname: chance.string(),
      };

      createGroups(groupDetails.groupname);
      groups.push(groupDetails.groupname);
    }

    const roleName = getByText(document.body, role.name);
    const tableRow = roleName.parentElement.parentElement;
    const addGroup = getByText(tableRow, /Add Role to Groups/);
    fireEvent.click(addGroup);
    const checkboxes = document.querySelector("#role-group-checkboxes");

    const group = getByText(checkboxes, groups[0]);
    const groupAddBtn = document.querySelector("#group-role-add-btn");
    expect(groupAddBtn).toBeInTheDocument();
    fireEvent.click(group);
    fireEvent.click(groupAddBtn);

    expect(JSON.parse(localStorage.getItem("roles"))).toStrictEqual([
      {
        id: 0,
        rolename: role.name,
        description: role.description,
        users: [],
        groups: ["0"],
      },
    ]);
    expect(
      queryByText(document.body, /Groups in Role is Updated Successfully/)
    ).not.toBeNull();
    const roleUsersForm = document.querySelector("#role-users-form");
    expect(roleUsersForm.classList.contains("hide")).toBeTruthy();
  });

  describe("the role should have the assignee button to display the users and groups assoiciated with that role", () => {
    const users = []
    const numberOfUsers = 5;
    const groups = [];
    const numberOfGroups = 3;
    function createUser(userDetails) {
      const lastName = document.querySelector("#lastname-input");
      const userForm = document.querySelector("#user-form");
      const lastNameValue = userDetails.lastName;
      lastName.value = lastNameValue;
      const firstName = document.querySelector("#firstname-input");
      const firstNameValue = userDetails.firstName;
      firstName.value = firstNameValue;
      const email = document.querySelector("#email-input");
      const emailValue = userDetails.email;
      email.value = emailValue;
      const userName = document.querySelector("#username-input");
      const userNameValue = userDetails.username;
      userName.value = userNameValue;
      const addUser = getByText(userForm, /Add User/);
      addUser.click();
    }
    beforeEach(() => {
  
        const groupDetails = {
          groupname: chance.string(),
        };
        groups.push(groupDetails.groupname);
        createGroups(groupDetails.groupname);
       
      
      const roleName = getByText(document.body, role.name);
      const tableRow = roleName.parentElement.parentElement;
      const addGroup = getByText(tableRow, /Add Role to Groups/);
      fireEvent.click(addGroup);
      const checkboxes = document.querySelector("#role-group-checkboxes");
      const group = getByText(checkboxes, groups[0]);
     group.checked = true
      const groupAddBtn = document.querySelector("#group-role-add-btn");
      
      fireEvent.click(groupAddBtn);
   
        const userDetails = {
          lastName: chance.string({
            symbols: false,
            numeric: false,
            alpha: true,
          }),
          firstName: chance.string({
            symbols: false,
            numeric: false,
            alpha: true,
          }),
          email: chance.email(),
          username: chance.string({
            symbols: false,
            numeric: true,
            alpha: true,
          }),
        };
        createUser(userDetails);
        users.push(userDetails.username);

      const addUser = getByText(tableRow, /Add Role to Users/);
      fireEvent.click(addUser);
      const checkUsersboxes = document.querySelector("#role-checkboxes");
      const user = getByText(checkUsersboxes, users[0]);
      const userAddBtn = document.querySelector("#user-role-add-btn");
      user.checked = true
      fireEvent.click(userAddBtn);
    });
  
    test("the assignee button for the particular role should be displayed a modal and have necessary elements in it", () => {
      const roleName = getByText(document.body, role.name);
      const tableRow = roleName.parentElement.parentElement;
      const roleAssigneesBtn = tableRow.querySelector("#role-assignees-btn");
      expect(roleAssigneesBtn.textContent).toBe("View Assignees");
      expect(roleAssigneesBtn).toBeInTheDocument();
      fireEvent(roleAssigneesBtn, new Event("click"));

      const modalRoleWrap = document.querySelector("#role-assignees");
      expect(modalRoleWrap.classList.contains("hide")).toBeFalsy();
      expect(getByText(modalRoleWrap,/Assignees/)).toBeInTheDocument();
      expect(getByText(modalRoleWrap,/Users/)).toBeInTheDocument();
      expect(getByText(modalRoleWrap,/Groups/)).toBeInTheDocument();
      console.log(localStorage.getItem("roles"))
expect(getByText(modalRoleWrap,users[0])).toBeInTheDocument();
expect(getByText(modalRoleWrap,groups[0])).toBeInTheDocument();

    });


  });
});
