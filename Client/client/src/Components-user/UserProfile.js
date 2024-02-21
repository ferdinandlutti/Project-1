import React, { useState } from "react";
import axios from "axios";
import { URL } from "../config";
import { useNavigate, NavLink, Outlet } from "react-router-dom";

import("../views/dashboard.css");

const UserProfile = () => {
  return (
    <div className="dashboard">
      <div className="sidebar">
        <NavLink
          to="/user/profile"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          Home
        </NavLink>
        <NavLink
          to="/user/bookings"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          Bookings
        </NavLink>
        <NavLink
          to="/user/settings"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          Settings
        </NavLink>
      </div>
    </div>
  );
};

export default UserProfile;
