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

      {!isLoggedIn ? (
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
      ) : (
        <>
          {userType === "instructor" ? (
            <NavLink
              to="/instructor/dashboard"
              style={({ isActive }) =>
                isActive ? linkStyles.activeLink : linkStyles.defaultLink
              }
            >
              Dashboard
            </NavLink>
          ) : (
            <NavLink
              to="/user/profile" // Adjust this path to where your user dashboard is located
              style={({ isActive }) =>
                isActive ? linkStyles.activeLink : linkStyles.defaultLink
              }
            >
              My Profile
            </NavLink>
          )}
          <button
            onClick={() => {
              logout();
              navigate("/"); // Navigate to home page after logout
            }}
            style={linkStyles.defaultLink} // Apply your link styles here
          >
            Logout
          </button>
        </>
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
const buttonStyles = {
  background: "none",
  border: "none",
  textDecoration: "underline",
  color: "white",
  cursor: "pointer",
};
