import React, { useEffect, useState } from "react";
import { useNavigate, NavLink, Outlet } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

import("./dashboard.css");

const Dashboard = (props) => {
  const [instructorClasses, setInstructorClasses] = useState([]);
  const [instructorProfile, setInstructorProfile] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    fetchInstructorClasses();
    fetchInstructorProfile();
  }, []);

  const fetchInstructorClasses = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in to view this page");
      navigate("/login");
      return;
    }

    const decodedToken = jwtDecode(token);
    const instructorId = decodedToken.userId;

    try {
      const response = await axios.get(
        `http://localhost:5010/class/byinstructor/${instructorId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.ok) {
        setInstructorClasses(response.data.data);
      } else {
        alert("Failed to fetch classes");
      }
    } catch (error) {
      console.error("Error fetching classes:", error);
      alert("Error fetching classes");
    }
  };

  const fetchInstructorProfile = async () => {
    const token = localStorage.getItem("token");
    const decodedToken = jwtDecode(token);
    const instructorId = decodedToken.userId;

    try {
      const response = await axios.get(
        `http://localhost:5010/instructor/${instructorId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.ok) {
        setInstructorProfile(response.data.profile);
      }
    } catch (error) {
      console.error("Failed to fetch instructor profile:", error);
    }
  };

  return (
    <div className="dashboard">
      <div className="sidebar">
        <NavLink
          to="/instructor/dashboard"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          Home
        </NavLink>
        <NavLink
          to="/instructor/classes"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          Classes
        </NavLink>
        <NavLink
          to="/instructor/profile"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          Profile
        </NavLink>
      </div>
      <div className="content">
        <h2>My Classes</h2>
        {instructorClasses.length > 0 ? (
          instructorClasses.map((classItem) => (
            <div key={classItem._id}>
              <h3>{classItem.title}</h3>
              <p>{classItem.description}</p>
              <p>{classItem.attendees}</p>
            </div>
          ))
        ) : (
          <p>No classes found.</p>
        )}
      </div>
      <Outlet /> {/* React Router v6 Outlet for nested routes */}
    </div>
  );
};

export default Dashboard;
