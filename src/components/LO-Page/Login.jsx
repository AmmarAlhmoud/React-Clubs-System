import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { useSelector, useDispatch } from "react-redux";
import { uiActions } from "../../store/ui-slice.js";
import { useTranslation } from "react-i18next";
import {
  setTheme,
  setLang,
  toggleTheme,
  toggleLang,
} from "../../store/theme-slice.js";
import { motion } from "framer-motion";

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
import TR_LANG_ICON from "../../assets/icons/Layout/tr_lang_icon.png";
import EN_LANG_ICON from "../../assets/icons/Layout/en_lang_icon.png";
import LIGHT_MODE_ICON from "../../assets/icons/Layout/light_mode_icon.png";
import DARK_MODE_ICON from "../../assets/icons/Layout/dark_mode_icon.png";

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

  const { i18n } = useTranslation();

  // 1. On first load, check if a theme is already in localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const savedLang = localStorage.getItem("i18nextLng");

    if (savedTheme) {
      dispatch(setTheme(savedTheme)); // apply saved theme
    }
    if (savedLang) {
      dispatch(setLang(savedLang)); // apply saved lang
    }
  }, [dispatch]);

  // 2. Whenever the theme in state changes, persist it to localStorage
  const mode = useSelector((state) => state.theme.mode);
  const lang = useSelector((state) => state.theme.lang);
  useEffect(() => {
    localStorage.setItem("theme", mode);
    // will set a cutome data- to the body for styling ex: :global(body[data-theme='light'])
    document.body.dataset.theme = mode;
  }, [mode]);

  useEffect(() => {
    i18n.changeLanguage(lang);
    localStorage.setItem("i18nextLng", lang);
  }, [lang, i18n]);

  const changeThemeHandler = () => {
    // switches between dark and light
    dispatch(toggleTheme());
  };
  const changeLangHandler = () => {
    // switches between dark and light
    dispatch(toggleLang());
  };

  return (
    <main className={styles.main}>
      <h2>{t("login.title")}</h2>
      <motion.img
        title={`${"change theme to " + (mode === "dark" ? "light" : "dark")}`}
        whileHover={{ scale: 1.1, cursor: "pointer" }}
        transition={{ type: "spring", stiffness: 200 }}
        className={styles.modeIcon}
        src={mode === "dark" ? LIGHT_MODE_ICON : DARK_MODE_ICON}
        alt="dark mode icon switcher"
        onClick={changeThemeHandler}
      />
      <motion.img
        title={`${
          "change language to " + (lang === "en" ? "turkish" : "english")
        }`}
        whileHover={{ scale: 1.1, cursor: "pointer" }}
        transition={{ type: "spring", stiffness: 200 }}
        className={styles.langIcon}
        src={lang === "en" ? TR_LANG_ICON : EN_LANG_ICON}
        alt="language icon switcher"
        onClick={changeLangHandler}
      />
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
