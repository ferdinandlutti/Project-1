import React from "react";
import { NavLink } from "react-router-dom";

const Navbar = ({ isLoggedIn }) => {
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

      {isLoggedIn === false && (
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

      <NavLink
        to="/secret-page"
        style={({ isActive }) =>
          isActive ? linkStyles.activeLink : linkStyles.defaultLink
        }
      >
        Secret
      </NavLink>
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
