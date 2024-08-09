require("@testing-library/jest-dom");
const fs = require("fs");
const path = require("path");
const {
  getByText,
  prettyDOM,
  waitFor,
  getByAltText,
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
    // expect(userName.required).toBe(true);
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
    // expect(emailField.required).toBe(true);
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
    // expect(firstNameField.required).toBe(true);
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
    // expect(lastNameField.required).toBe(true);
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
        user_id: 0,
        username: userNameValue,
        email: emailValue,
        firstname: firstNameValue,
        lastname: lastNameValue,
      },
    ]);
  });

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

describe("creation of sidebar", () => {
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

});
