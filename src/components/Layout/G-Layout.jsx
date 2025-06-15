import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  checkAuthAdUserType,
  checkAuthClUserType,
  checkAuthStUserType,
  displayAuthUserType,
  displayAuthUserName,
} from "../../util/auth.js";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation, Trans } from "react-i18next";
import { changeLanguage } from "i18next";
import { motion } from "framer-motion";
import { toggleTheme, toggleLang } from "../../store/theme-slice.js";

import User_Ic from "../../assets/icons/Layout/user.png";
import HomeSvg from "../Svgs/HomeSvg";
import DashboardSvg from "../Svgs/DashboardSvg";
import RequestsSvg from "../Svgs/RequestsSvg";
import ClubsListSvg from "../Svgs/ClubsListSvg";
import CreateClubSvg from "../Svgs/CreateClubSvg";
import LogoutSvg from "../Svgs/LogoutSvg";
import RequestPostSvg from "../Svgs/RequestPostSvg";
import Club_M_Ic from "../../assets/icons/EventsList/club_manager_logo.png";
import TR_LANG_ICON from "../../assets/icons/Layout/tr_lang_icon.png";
import EN_LANG_ICON from "../../assets/icons/Layout/en_lang_icon.png";
import LIGHT_MODE_ICON from "../../assets/icons/Layout/light_mode_icon.png";
import DARK_MODE_ICON from "../../assets/icons/Layout/dark_mode_icon.png";

import styles from "./G-Layout.module.css";
import EventsListSvg from "../Svgs/EventsListSvg";

const G_Layout = (props) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const { logout } = useAuth();
  const navigate = useNavigate();
  const displayedUserType = displayAuthUserType();
  const displayedUserName = displayAuthUserName();
  const mode = useSelector((state) => state.theme.mode);
  const lang = useSelector((state) => state.theme.lang);

  const logoutHandler = () => {
    logout();
    navigate("/login");
  };

  const changeThemeHandler = () => {
    // switches between dark and light
    dispatch(toggleTheme());
  };
  const changeLangHandler = () => {
    // switches between dark and light
    dispatch(toggleLang());
  };

  return (
    <main className={styles["main-container"]}>
      <aside
        className={`${styles.aside} ${
          checkAuthStUserType() ? styles.asideSt : ""
        }`}
      >
        <motion.img
          title={`${"change theme to " + (mode === "dark" ? "light" : "dark")}`}
          whileHover={{ scale: props.scale || 1.1, cursor: "pointer" }}
          transition={{ type: "spring", stiffness: props.stiffness || 200 }}
          className={styles.modeIcon}
          src={mode === "dark" ? LIGHT_MODE_ICON : DARK_MODE_ICON}
          alt="dark mode icon switcher"
          onClick={changeThemeHandler}
        />
        <motion.img
          title={`${
            "change language to " + (lang === "en" ? "turkish" : "english")
          }`}
          whileHover={{ scale: props.scale || 1.1, cursor: "pointer" }}
          transition={{ type: "spring", stiffness: props.stiffness || 200 }}
          className={styles.langIcon}
          src={lang === "en" ? TR_LANG_ICON : EN_LANG_ICON}
          alt="language icon switcher"
          onClick={changeLangHandler}
        />
        <div className={styles["user-profile"]}>
          {!checkAuthClUserType() && (
            <img
              src={checkAuthClUserType() ? Club_M_Ic : User_Ic}
              alt="User Image"
              className={styles.img}
            />
          )}
          {checkAuthClUserType() && (
            <img src={Club_M_Ic} alt="User Image" className={styles.imgMG} />
          )}
          <p className={styles["user-name"]}>{displayedUserName}</p>
          <p className={styles.role}>{t(`g-layout.${displayedUserType}`)}</p>
        </div>
        <ul className={styles["aside-nav-list"]}>
          {checkAuthAdUserType() && (
            <li>
              <NavLink
                id="aside-nav-home"
                to="/"
                className={({ isActive }) => {
                  isActive ? styles.active : undefined;
                }}
              >
                <div className={styles["aside-nav-item"]}>
                  <HomeSvg
                    className={({ isActive }) => {
                      isActive ? styles.active : undefined;
                    }}
                  />
                  <p>{t("g-layout.home")}</p>
                </div>
              </NavLink>
            </li>
          )}
          {checkAuthClUserType() && (
            <li>
              <NavLink
                id="aside-nav-my-club"
                to="/my-club"
                className={({ isActive }) =>
                  isActive ? styles.active : undefined
                }
              >
                <div className={styles["aside-nav-item"]}>
                  <HomeSvg />
                  <p>{t("g-layout.my-club")}</p>
                </div>
              </NavLink>
            </li>
          )}
          <li>
            <NavLink
              id="aside-nav-dashboard"
              to="/dashboard"
              className={({ isActive }) =>
                isActive ? styles.active : undefined
              }
            >
              <div className={styles["aside-nav-item"]}>
                <DashboardSvg />
                <p>{t("g-layout.dashboard")}</p>
              </div>
            </NavLink>
          </li>
          <li>
            <NavLink
              id="aside-nav-events-list"
              to="/events-list"
              className={({ isActive }) =>
                isActive ? styles.active : undefined
              }
            >
              <div className={styles["aside-nav-item"]}>
                <EventsListSvg />
                <p>{t("g-layout.events-list")}</p>
              </div>
            </NavLink>
          </li>
          {checkAuthAdUserType() && (
            <li>
              <NavLink
                id="aside-nav-requests"
                to="/requests/event-request"
                className={({ isActive }) =>
                  isActive || window.location.pathname.startsWith("/requests/")
                    ? styles.active
                    : undefined
                }
              >
                <div className={styles["aside-nav-item"]}>
                  <RequestsSvg />
                  <p>{t("g-layout.requests")}</p>
                </div>
              </NavLink>
            </li>
          )}
          {checkAuthClUserType() && (
            <li>
              <NavLink
                id="aside-nav-request-event"
                to="/request-event"
                className={({ isActive }) =>
                  isActive ? styles.active : undefined
                }
              >
                <div className={styles["aside-nav-item"]}>
                  <RequestsSvg />
                  <p>{t("g-layout.request-event")}</p>
                </div>
              </NavLink>
            </li>
          )}
          {checkAuthClUserType() && (
            <li>
              <NavLink
                id="aside-nav-request-post"
                to="/request-post"
                className={({ isActive }) =>
                  isActive ? styles.active : undefined
                }
              >
                <div
                  className={`${styles["aside-nav-item"]} ${styles["aside-nav-item-ann"]}`}
                >
                  <RequestPostSvg />
                  <p>
                    <Trans
                      i18nKey="g-layout.request-post"
                      components={[<br key="br" />]}
                    />
                  </p>
                </div>
              </NavLink>
            </li>
          )}
          <li>
            <NavLink
              id="aside-nav-clubs-list"
              to="/clubs-list"
              className={({ isActive }) =>
                isActive ? styles.active : undefined
              }
            >
              <div className={styles["aside-nav-item"]}>
                <ClubsListSvg />
                <p>{t("g-layout.clubs-list")}</p>
              </div>
            </NavLink>
          </li>
          {checkAuthAdUserType() && (
            <li>
              <NavLink
                id="aside-nav-create-club"
                to="/create-club"
                className={({ isActive }) =>
                  isActive ? styles.active : undefined
                }
              >
                <div className={styles["aside-nav-item"]}>
                  <CreateClubSvg />
                  <p>{t("g-layout.create-club")}</p>
                </div>
              </NavLink>
            </li>
          )}
          {checkAuthClUserType() && (
            <li>
              <NavLink
                id="aside-nav-edit-my-club"
                to="/edit-my-club"
                className={({ isActive }) =>
                  isActive ? styles.active : undefined
                }
              >
                <div className={styles["aside-nav-item"]}>
                  <CreateClubSvg />
                  <p>{t("g-layout.edit-my-club")}</p>
                </div>
              </NavLink>
            </li>
          )}
        </ul>
        <div
          onClick={logoutHandler}
          className={`${styles.logout} ${
            checkAuthStUserType() ? styles.logoutSt : ""
          }`}
        >
          <LogoutSvg />
          <p>{t("g-layout.logout")}</p>
        </div>
      </aside>
      <main className={styles["content-container"]}>{props.children}</main>
    </main>
  );
};

export default G_Layout;
