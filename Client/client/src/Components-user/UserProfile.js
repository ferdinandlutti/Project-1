import React, { useEffect, useState } from "react";
import axios from "axios";
import { URL } from "../config";
import { useNavigate, NavLink, Outlet } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

import("../Components-Instructor/dashboard.css");

const UserProfile = () => {
  const [userInfo, setUserInfo] = useState({
    name: "",
    surname: "",
    upcomingBookingsCount: 0,
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const decodedToken = jwtDecode(token);
      const userId = decodedToken.userId;

      try {
        const userDetailsResponse = await axios.get(`${URL}/user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (userDetailsResponse.data.ok) {
          setUserInfo((prevInfo) => ({
            ...prevInfo,
            name: userDetailsResponse.data.details.name,
            surname: userDetailsResponse.data.details.surname,
          }));
        }

        // Fetch user bookings
        const userBookingsResponse = await axios.get(
          `${URL}/booking/byuser/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (userBookingsResponse.data.ok) {
          // Filter for upcoming bookings
          const upcomingBookings = userBookingsResponse.data.bookings.filter(
            (booking) => new Date(booking.date) > new Date()
          );
          setUserInfo((prevInfo) => ({
            ...prevInfo,
            upcomingBookingsCount: upcomingBookings.length,
          }));
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [navigate]);

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
      <div className="content">
        <h2>User Profile</h2>
        <p>Name: {userInfo.name}</p>
        <p>Surname: {userInfo.surname}</p>
        <p>Upcoming Bookings: {userInfo.upcomingBookingsCount}</p>
      </div>
      <Outlet />
    </div>
  );
};

export default UserProfile;
