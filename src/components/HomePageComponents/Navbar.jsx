import styles from "./Navbar.module.css";
import Uni_logo from "../../assets/uni_logo.png";
import { Link } from "react-router-dom";
import { getAuthUserId } from "../../util/auth";
import { useAuth } from "../../context/AuthContext";
import { useTranslation } from "react-i18next";
import LanguageSelector from "../Layout/LanguageSelector";

const Navbar = () => {
  const user = getAuthUserId();
  const { logout } = useAuth();
  const { t } = useTranslation();

  const logoutHandler = () => {
    logout();
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarContent}>
        <div className={styles.navbarLeft}>
          <img
            src={Uni_logo}
            alt="Uskudar University Logo"
            className={styles.navbarLogo}
          />
          <span className={`${styles.green} ${styles.navbarText}`}>
            {t("home.nav.uni")}
          </span>
          <ul className={styles.navbarLinks}>
            {user && (
              <>
                <li>
                  <Link to="/dashboard">{t("home.nav.dashboard")}</Link>
                </li>
                <li>
                  <Link to="/clubs-list">{t("home.nav.clubs")}</Link>
                </li>
                <li>
                  <Link to="/events-list">{t("home.nav.events")}</Link>
                </li>
              </>
            )}

            {!user && (
              <>
                <li>
                  <a href="#home-clubs-list">{t("home.nav.clubs")}</a>
                </li>
                <li>
                  <a href="#home-events-list">{t("home.nav.events")}</a>
                </li>
              </>
            )}

            <li>
              <a href="#contact-us">{t("home.nav.about")}</a>
            </li>
            <li>
              <a href="#contact-us">{t("home.nav.help")}</a>
            </li>
          </ul>
        </div>

        <div className={styles.navbarRight}>
          {/* <input
            type="text"
            placeholder="Search"
            className={styles.searchInput}
          /> */}
          <LanguageSelector />
          {user === null && (
            <Link to="/login">
              <button className={styles.navbarButton}>
                {t("home.nav.login")}
              </button>
            </Link>
          )}

          {user !== null && (
            <p>
              <button onClick={logoutHandler} className={styles.navbarButton}>
                {t("home.nav.logout")}
              </button>
            </p>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
