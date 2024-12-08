import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { useSelector, useDispatch } from "react-redux";
import { uiActions } from "../../store/ui-slice.js";

import styles from "./Login.module.css";
import Input from "../UI/Input";
import Button from "../UI/Button";
import PopupError from "./PopupError";
import Modal from "../UI/Modal";
import useInput from "../../hooks/use-input.js";
import BarLoader from "../UI/BarLoader";
import Icon from "../UI/Icon.jsx";
import User_icon from "../../assets/icons/LO/user.png";
import Lock_icon from "../../assets/icons/LO/lock.png";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState({});

  // form Handling states
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const isToggled = useSelector((state) => state.ui.toggleModal);

  // Test Cases for Email
  const testCasesForEmail = {
    "Enter a valid email address.": (value) =>
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    "Email must contain the @ symbol.": (value) => value.includes("@"),
    "Spaces are not allowed in the email address. Remove any spaces.": (
      value
    ) => !/\s/.test(value) || "",
    // Specific test cases for the desired email formats with initials in subdomain
    "Valid email format for Admin - name.surname@Ad.uskudar.com": (value) =>
      /^[a-zA-Z]+(\.[a-zA-Z]+)*@\bAd\b\.uskudar\.com$/.test(value),
    "Valid email format for Club Manager - name.surname@Cl.uskudar.com": (
      value
    ) => /^[a-zA-Z]+(\.[a-zA-Z]+)*@\bCl\b\.uskudar\.com$/.test(value),
    "Valid email format for Student - name.surname@St.uskudar.com": (value) =>
      /^[a-zA-Z]+(\.[a-zA-Z]+)*@\bSt\b\.uskudar\.com$/.test(value),
  };

  // test Cases For Password
  const testCasesForPassword = {
    "Password field cannot be left blank.": (value) => value.length !== 0,
    "Password must be at least 8 characters long.": (value) =>
      value.length >= 8,
    "Spaces are not allowed in the password. Remove any spaces.": (value) =>
      !/\s/.test(value),
  };

  // form Validation
  const {
    value: enterdEmail,
    isValid: enterdEmailIsValid,
    hasError: enterdEmailHasError,
    testCases: emailTestCases,
    valueChangeHandler: emailChangeHandler,
    valueBlurHandler: emailBlurHandler,
    reset: emailReset,
  } = useInput(testCasesForEmail, "Email");

  const {
    value: enterdPassword,
    isValid: enterdPasswordIsValid,
    hasError: enterdPasswordHasError,
    testCases: passwordTestCases,
    valueChangeHandler: passwordChangeHandler,
    valueBlurHandler: passwordBlurHandler,
    reset: passwordReset,
  } = useInput(testCasesForPassword, "Password");

  const loginHandler = async (event) => {
    event.preventDefault();

    if (enterdEmailIsValid && enterdPasswordIsValid) {
      try {
        setError({});
        setLoading(true);
        await login(enterdEmail, enterdPassword);

        // to set the user type and navigate to the correct user page
        localStorage.setItem("userType", emailTestCases.userType);

        navigate("/clubs-list");
        // reset the form
        emailReset();
        passwordReset();
      } catch (error) {
        setError(error);
        dispatch(uiActions.toggleModal(true));
        console.log(error);
      }
      setLoading(false);
    } else {
      setError({
        name: "Invalid Input",
        code: "check your input",
      });
      dispatch(uiActions.toggleModal(true));
      return;
    }
  };

  if (error["name"] === "FirebaseError") {
    setError({
      name: "Invalid Credentials",
      code: "Double-check your email and password.",
    });
  }

  return (
    <main className={styles.main}>
      <h2>Login your account</h2>
      {error && isToggled && (
        <Modal
          err={{
            type: "error",
            title: error["name"],
            message: error["code"],
          }}
        />
      )}
      <form onSubmit={loginHandler} className={styles.form}>
        <Input
          input={{
            id: "email",
            name: "email",
            type: "text",
            placeholder: "Email",
            value: enterdEmail,
            onChange: emailChangeHandler,
            onBlur: emailBlurHandler,
          }}
        >
          <Icon
            className={styles["input-icon"]}
            src={User_icon}
            alt="user icon"
          />
        </Input>
        <Input
          input={{
            id: "password",
            name: "password",
            type: "password",
            placeholder: "Password",
            value: enterdPassword,
            onChange: passwordChangeHandler,
            onBlur: passwordBlurHandler,
          }}
        >
          <Icon
            className={styles["input-icon"]}
            src={Lock_icon}
            alt="lock icon"
          />
        </Input>
        <div className={styles["form-actions"]}>
          {loading && (
            <div className={styles["bar-container"]}>
              <BarLoader />
            </div>
          )}
          {!loading && (
            <Button id="click-login" type="submit" className={styles.button}>
              Login
            </Button>
          )}
        </div>
        <ul
          className={styles["errors-ul"]}
          style={{
            height:
              enterdEmailHasError || enterdPasswordHasError ? "104px" : "104px",
          }}
        >
          {enterdEmailHasError &&
            emailTestCases.testItems.map((item) => (
              <PopupError key={item.testCase} message={item.testCase} />
            ))}
          {enterdPasswordHasError &&
            passwordTestCases.testItems.map((item) => (
              <PopupError key={item.testCase} message={item.testCase} />
            ))}
        </ul>
      </form>
      <p className={styles["form-action-footer"]}>
        <Link id="nav-page-return-home" to="/">
          Return Home
        </Link>
      </p>
    </main>
  );
};

export default Login;
