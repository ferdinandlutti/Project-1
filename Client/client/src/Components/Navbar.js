import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

const Navbar = ({ isLoggedIn, userType, logout }) => {
  const navigate = useNavigate();

  return (
    <div className="navbar">
      <NavLink
        to={"/"}
        style={({ isActive }) =>
          isActive ? linkStyles.activeLink : linkStyles.defaultLink
        }
      >
        Home
      </NavLink>

      {!isLoggedIn && (
        <>
          <NavLink
            to="/register"
            style={({ isActive }) =>
              isActive ? linkStyles.activeLink : linkStyles.defaultLink
            }
          >
            Register
          </NavLink>
          <NavLink
            to="/login"
            style={({ isActive }) =>
              isActive ? linkStyles.activeLink : linkStyles.defaultLink
            }
          >
            Login
          </NavLink>
        </>
      )}
      {isLoggedIn && userType === "instructor" && (
        <NavLink
          to="/instructor"
          style={({ isActive }) =>
            isActive ? linkStyles.activeLink : linkStyles.defaultLink
          }
        >
          Secret
        </NavLink>
      )}
      {isLoggedIn && (
        <button
          onClick={() => {
            logout();
            navigate("/"); // Navigate to home page after logout
          }}
          style={linkStyles.defaultLink} // Apply your link styles here
        >
          Logout
        </button>
      )}
    </div>
  );
};

export default Navbar;

const linkStyles = {
  activeLink: {
    color: "gray",
  },
  defaultLink: {
    textDecoration: "none",
    color: "white",
  },
};
