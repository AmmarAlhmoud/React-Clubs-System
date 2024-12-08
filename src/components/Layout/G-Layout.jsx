import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  checkAuthAdUserType,
  checkAuthClUserType,
  checkAuthStUserType,
  displayAuthUserType,
  displayAuthUserName,
} from "../../util/auth.js";

import User_Ic from "../../assets/icons/Layout/user.png";
import HomeSvg from "../Svgs/HomeSvg";
import DashboardSvg from "../Svgs/DashboardSvg";
import RequestsSvg from "../Svgs/RequestsSvg";
import ClubsListSvg from "../Svgs/ClubsListSvg";
import CreateClubSvg from "../Svgs/CreateClubSvg";
import LogoutSvg from "../Svgs/LogoutSvg";
import RequestPostSvg from "../Svgs/RequestPostSvg";
import Club_M_Ic from "../../assets/icons/EventsList/club_manager_logo.png";

import styles from "./G-Layout.module.css";
import EventsListSvg from "../Svgs/EventsListSvg";

const G_Layout = (props) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const displayedUserType = displayAuthUserType();
  const displayedUserName = displayAuthUserName();

  const logoutHandler = () => {
    logout();
    navigate("/login");
  };

  return (
    <main className={styles["main-container"]}>
      <aside
        className={`${styles.aside} ${
          checkAuthStUserType() ? styles.asideSt : ""
        }`}
      >
        <div className={styles["user-profile"]}>
          <img
            src={checkAuthClUserType() ? Club_M_Ic : User_Ic}
            alt="User Image"
            className={styles.img}
          />
          <p className={styles["user-name"]}>{displayedUserName}</p>
          <p className={styles.role}>{displayedUserType}</p>
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
                  <p>Home</p>
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
                  <p>My Club</p>
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
                <p>Dashboard</p>
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
                <p>Events List</p>
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
                  <p>Requests</p>
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
                  <p>Request Event</p>
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
                <div className={styles["aside-nav-item"]}>
                  <RequestPostSvg />
                  <p>Request Post</p>
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
                <p>Clubs List</p>
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
                  <p>Create Club</p>
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
                  <p>Edit My Club</p>
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
          <p>Logout</p>
        </div>
      </aside>
      <main className={styles["content-container"]}>{props.children}</main>
    </main>
  );
};

export default G_Layout;
