import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useClerk, useUser } from "@clerk/clerk-react";
import { empJsContextObj } from "../../contexts/empJsContext";
import "./Header.css"; // Import the CSS file for styling

function Header() {
  const { signOut } = useClerk();
  const { isSignedIn, user, isLoaded } = useUser();
  const { currentJs, setCurrentJs } = useContext(empJsContextObj);
  const navigate = useNavigate();

  async function handleSignout() {
    await signOut();
    setCurrentJs(null);
    navigate("/");
  }

  return (
    <header className="header bg-primary text-white shadow border-0">
      <nav className="navbar navbar-expand-lg navbar-dark container-fluid">
        <a className="navbar-brand fw-bold" href="/">
          Job Finder
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center">
            {!isSignedIn ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link active" to="/">
                    Home
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link active" to="/signin">
                    Sign In
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link active" to="/signup">
                    Sign Up
                  </Link>
                </li>
              </>
            ) : (
              <div className="d-flex align-items-center user-section text-white ">
                <div className="user-profile">
                  <img
                    src={user.imageUrl}
                    width="40px"
                    className="rounded-circle"
                    alt="Profile"
                    aria-label="User Profile Picture"
                  />
                  <p className="role text-white">{currentJs.role}</p>
                </div>
                <p className="mb-0 user-name me-3 text-white">{user.firstName}</p>
                <button
                  className="btn btn-danger signout-btn ms-auto"
                  onClick={handleSignout}
                  aria-label="Sign out"
                >
                  Signout
                </button>
              </div>
            )}
          </ul>
        </div>
      </nav>
    </header>
  );
}

export default Header;
