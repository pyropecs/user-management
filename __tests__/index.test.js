require("@testing-library/jest-dom");
const fs = require("fs");
const path = require("path");
const { getByText } = require("@testing-library/dom");

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
  test("to check the all form elements are present in the user creation", () => {
    const title = getByText(document.body, /Create User/);
    expect(title).toBeInTheDocument();
    const userName = document.querySelector("#username-input");
    const userNameError = document.querySelector("#username-error")
    expect(userNameError).toBeInTheDocument()
    expect(userNameError.classList.contains("hide")).toBe(true)
    expect(userName).toBeInTheDocument();
    expect(userName).toHaveAttribute("type", "text");
    expect(userName).toHaveAttribute("title", "user name");
    expect(userName).toHaveAttribute("placeholder", "Username");
    expect(userName.required).toBe(true)
    
    const emailField = document.querySelector("#email-input");
    const emailError = document.querySelector("#email-error")
    expect(emailError).toBeInTheDocument()
    expect(emailError.classList.contains("hide")).toBe(true)
    expect(emailField).toBeInTheDocument();
    expect(emailField).toHaveAttribute("type", "email");
    expect(emailField).toHaveAttribute("placeholder", "Email");
    expect(emailField).toHaveAttribute("title", "Email");
    expect(emailField.required).toBe(true)
    const firstNameField = document.querySelector("#firstname-input");
    const firstNameError = document.querySelector("#firstname-error")
    expect(firstNameError.classList.contains("hide")).toBe(true)
    expect(firstNameError).toBeInTheDocument()
    expect(firstNameField).toBeInTheDocument();
    expect(firstNameField).toHaveAttribute("type", "text");
    expect(firstNameField).toHaveAttribute("placeholder", "First name");
    expect(firstNameField).toHaveAttribute("title", "First name");
    expect(firstNameField.required).toBe(true)
    const lastNameField = document.querySelector("#lastname-input");
    const lastNameError = document.querySelector("#lastname-error")
    expect(lastNameError.classList.contains("hide")).toBe(true)
    expect(lastNameError).toBeInTheDocument()
    expect(lastNameField).toBeInTheDocument();
    expect(lastNameField).toHaveAttribute("type", "text");
    expect(lastNameField).toHaveAttribute("placeholder", "Last name");
    expect(lastNameField).toHaveAttribute("title", "Last name");
    expect(lastNameField.required).toBe(true)
    const addUser = getByText(document.body, /Add User/);
    expect(addUser).toHaveAttribute("type", "submit");
  });
  test("input valdiation those form elements",()=>{


    addUser.click()
    
    
  })
});
