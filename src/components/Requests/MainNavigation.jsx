/* eslint-disable react/prop-types */
import { NavLink } from "react-router-dom";

import styles from "./MainNavigation.module.css";
import { useTranslation } from "react-i18next";

function MainNavigation({ children }) {
  const { t } = useTranslation();

  return (
    <>
      <nav className={styles["main-req-nav"]}>
        <article>
          <section>
            <NavLink
              id="nav-event-request"
              to="event-request"
              onClick={() => {}}
              className={({ isActive }) =>
                isActive ? styles.active : undefined
              }
            >
              <div className={styles["nav-req-item"]}>
                <span>{t("requests.main-nav.event-req")}</span>
              </div>
            </NavLink>
            <NavLink
              id="nav-club-post-request"
              to="club-post-request"
              onClick={() => {}}
              className={({ isActive }) =>
                isActive ? styles.active : undefined
              }
            >
              <div className={styles["nav-req-item"]}>
                <span>{t("requests.main-nav.club-post-req")}</span>
              </div>
            </NavLink>
            <NavLink
              id="nav-club-edit-request"
              to="club-edit-request"
              onClick={() => {}}
              className={({ isActive }) =>
                isActive ? styles.active : undefined
              }
            >
              <div className={styles["nav-req-item"]}>
                <span>{t("requests.main-nav.club-edit-req")}</span>
              </div>
            </NavLink>
          </section>
          <section>
            <NavLink
              id="nav-event-edit-request"
              to="event-edit-request"
              onClick={() => {}}
              className={({ isActive }) =>
                isActive ? styles.active : undefined
              }
            >
              <div
                className={`${styles["nav-req-item"]} ${styles["nav-req-item-edit"]}`}
              >
                <span>{t("requests.main-nav.event-edit-req")}</span>
              </div>
            </NavLink>
            <NavLink
              id="nav-post-edit-request"
              to="post-edit-request"
              onClick={() => {}}
              className={({ isActive }) =>
                isActive ? styles.active : undefined
              }
            >
              <div className={styles["nav-req-item"]}>
                <span>{t("requests.main-nav.post-edit-req")}</span>
              </div>
            </NavLink>
          </section>
        </article>
      </nav>
      <div className={`${styles["main-req-content"]}`}>{children}</div>
    </>
  );
}

export default MainNavigation;
