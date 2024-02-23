import React, { useState, useEffect } from "react";
import axios from "axios";
import { URL } from "../config";
import { useNavigate, NavLink, Outlet } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function UserBookings() {
  const [bookings, setBookings] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You need to be signed in to view bookings.");
        navigate("/login");
        return;
      }
      const decoded = jwtDecode(token);
      const userId = decoded.userId;

      try {
        const response = await axios.get(`${URL}/booking/by_user/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(response.data.data);
        if (response.data.ok) {
          setBookings(response.data.data);
          console.log(response.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch bookings:", error);
      }
    };
    fetchBookings();
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
        <h2>My Bookings</h2>
        {bookings.length > 0 ? (
          bookings.map((booking) => (
            <div key={booking._id}>
              <h3>{booking.classId.title}</h3>
              {booking.classId.selectedImage && (
                <img
                  src={booking.classId.selectedImage}
                  alt={booking.classId.title}
                  style={{
                    width: "50%",
                    maxHeight: "300px",
                    objectFit: "cover",
                  }}
                />
              )}{" "}
              <p>Date: {new Date(booking.classId.date).toLocaleDateString()}</p>
              <p>Time: {booking.classId.time}</p>
              {/* Add more details as needed */}
            </div>
          ))
        ) : (
          <p>No bookings found.</p>
        )}
      </div>
    </div>
  );
}
export default UserBookings;
