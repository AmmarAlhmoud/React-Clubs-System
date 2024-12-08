import "./Navbar.css"; // Import CSS file for styling
import Uni_logo from "../../assets/uni_logo.png";
import { Link } from "react-router-dom";
import { getAuthUserId } from "../../util/auth";
import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
  const user = getAuthUserId();
  const { logout } = useAuth();

  const logoutHandler = () => {
    logout();
  };

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <div className="navbar-left">
          <img
            src={Uni_logo}
            alt="Uskudar University Logo"
            className="navbar-logo"
          />
          <span className="green navbar-text">Uskudar</span>
          <ul className="navbar-links">
            <li>
              <Link to="/dashboard">Dashboard</Link>
            </li>
            <li>
              <Link to="/events-list">Events</Link>
            </li>
            <li>
              <Link to="/clubs-list">Clubs</Link>
            </li>
            <li>
              <a href="#contact-us">About</a>
            </li>
            <li>
              <a href="#contact-us">Help</a>
            </li>
          </ul>
        </div>
        <div className="navbar-right">
          {/* <input type="text" placeholder="Search" className="search-input" /> */}
          {/* Login Button */}
          {user === null && (
            <Link to="/login">
              <button className="navbar-button">Login</button>
            </Link>
          )}
          {user !== null && (
            <p>
              <button onClick={logoutHandler} className="navbar-button">
                logout
              </button>
            </p>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
