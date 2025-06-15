import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { useSelector, useDispatch } from "react-redux";
import { uiActions } from "../../store/ui-slice.js";
import { useTranslation } from "react-i18next";

import styles from "./Login.module.css";
import Input from "../UI/Input";
import Button from "../UI/Button";
import PopupError from "./PopupError";
import Modal from "../UI/Modal";
import useInput, {
  testCasesForEmailKeys,
  testCasesForPasswordKeys,
} from "../../hooks/use-input.js";
import BarLoader from "../UI/BarLoader";
import Icon from "../UI/Icon.jsx";
import User_icon from "../../assets/icons/LO/user.png";
import Lock_icon from "../../assets/icons/LO/lock.png";

const Login = () => {
  const { t } = useTranslation();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const isToggled = useSelector((state) => state.ui.toggleModal);

  // Email input validation using translation-key test cases
  const {
    value: enterdEmail,
    isValid: enterdEmailIsValid,
    hasError: enterdEmailHasError,
    testResults: emailTestResults,
    valueChangeHandler: emailChangeHandler,
    valueBlurHandler: emailBlurHandler,
    reset: emailReset,
  } = useInput(testCasesForEmailKeys, "Email");

  // Password input validation
  const {
    value: enterdPassword,
    isValid: enterdPasswordIsValid,
    hasError: enterdPasswordHasError,
    testResults: passwordTestResults,
    valueChangeHandler: passwordChangeHandler,
    valueBlurHandler: passwordBlurHandler,
    reset: passwordReset,
  } = useInput(testCasesForPasswordKeys, "Password");

  const loginHandler = async (event) => {
    event.preventDefault();

    if (enterdEmailIsValid && enterdPasswordIsValid) {
      try {
        setError({});
        setLoading(true);
        await login(enterdEmail, enterdPassword);

        // store detected userType
        localStorage.setItem("userType", emailTestResults.userType);

        navigate("/clubs-list");
        emailReset();
        passwordReset();
      } catch (err) {
        setError(err);
        dispatch(uiActions.toggleModal(true));
      } finally {
        setLoading(false);
      }
    } else {
      setError({
        name: t("login.invalid-input"),
        code: t("login.check-input"),
      });
      dispatch(uiActions.toggleModal(true));
    }
  };

  // Map Firebase errors to UI
  if (error.name === "FirebaseError") {
    setError({
      name: t("login.invalid-cred"),
      code: t("login.double-check"),
    });
  }

  return (
    <main className={styles.main}>
      <h2>{t("login.title")}</h2>
      {error && isToggled && (
        <Modal
          err={{
            type: "error",
            title: error.name,
            message: error.code,
          }}
        />
      )}
      <form onSubmit={loginHandler} className={styles.form}>
        <Input
          input={{
            id: "email",
            name: "email",
            type: "text",
            placeholder: t("login.email"),
            value: enterdEmail,
            onChange: emailChangeHandler,
            onBlur: emailBlurHandler,
          }}
        >
          <Icon
            src={User_icon}
            alt="user icon"
            className={styles["input-icon"]}
          />
        </Input>

        <Input
          input={{
            id: "password",
            name: "password",
            type: "password",
            placeholder: t("login.password"),
            value: enterdPassword,
            onChange: passwordChangeHandler,
            onBlur: passwordBlurHandler,
          }}
        >
          <Icon
            src={Lock_icon}
            alt="lock icon"
            className={styles["input-icon"]}
          />
        </Input>

        <div className={styles["form-actions"]}>
          {loading ? (
            <div className={styles["bar-container"]}>
              <BarLoader />
            </div>
          ) : (
            <Button id="click-login" type="submit" className={styles.button}>
              {t("login.enter")}
            </Button>
          )}
        </div>

        <ul className={styles["errors-ul"]} style={{ height: "104px" }}>
          {enterdEmailHasError &&
            emailTestResults.testItems.map((item) => (
              <PopupError
                key={item.key}
                message={t(`login.test-cases.${item.key}`)}
              />
            ))}

          {enterdPasswordHasError &&
            passwordTestResults.testItems.map((item) => (
              <PopupError
                key={item.key}
                message={t(`login.test-cases.${item.key}`)}
              />
            ))}
        </ul>
      </form>

      <p className={styles["form-action-footer"]}>
        <Link to="/">{t("login.return-home")}</Link>
      </p>
    </main>
  );
};

export default Login;
