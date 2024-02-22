import React, { useEffect, useState } from "react";
import { useNavigate, NavLink, Outlet } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { URL } from "../config";

import("./dashboard.css");

const Dashboard = () => {
  const [instructorInfo, setInstructorInfo] = useState({
    name: "",
    location: "",
    profilePicture: "",
    upcomingClassesCount: 0,
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchInstructorDetails = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const decodedToken = jwtDecode(token);
      const instructorId = decodedToken.userId;

      try {
        const profileResponse = await axios.get(
          `${URL}/instructor/${instructorId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const classesResponse = await axios.get(
          `${URL}/class/byinstructor/${instructorId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (profileResponse.data.ok && classesResponse.data.ok) {
          const upcomingClasses = classesResponse.data.data.filter((cls) => {
            console.log("Comparing:", new Date(cls.date), "to", new Date());
            return new Date(cls.date) > new Date();
          });
          setInstructorInfo({
            name: profileResponse.data.profile.name || "Instructor",
            location: profileResponse.data.profile.location,
            profilePicture: profileResponse.data.profile.profilePicture,
            upcomingClassesCount: upcomingClasses.length,
          });
        }
      } catch (error) {
        console.error("Failed to fetch instructor details:", error);
      }
    };

    fetchInstructorDetails();
  }, [navigate]);
  const [isClassesDropdownVisible, setIsClassesDropdownVisible] =
    useState(false);
  const toggleClassesDropdown = () => {
    setIsClassesDropdownVisible(!isClassesDropdownVisible);
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
        <div onClick={toggleClassesDropdown} className="dropdown-toggle">
          Classes
        </div>
        <div
          className={`dropdown-content ${
            isClassesDropdownVisible ? "show" : ""
          }`}
        >
          <NavLink
            to="/instructor/classes"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Create Class
          </NavLink>
          <NavLink
            to="/instructor/classes/myclasses"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            My Classes
          </NavLink>
          <NavLink
            to="/instructor/classes/previousclasses"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Previous Classes
          </NavLink>
          <NavLink
            to="/instructor/classes/upcomingclasses"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Upcoming Classes
          </NavLink>
        </div>

        <NavLink
          to="/instructor/profile"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          Profile
        </NavLink>
      </div>
      <div className="content">
        <div className="instructor-info">
          <img
            src={instructorInfo.profilePicture}
            alt="Instructor"
            style={{ width: 100, height: 100, borderRadius: "50%" }}
          />
          <h2>{instructorInfo.name}</h2>
          <p>Location: {instructorInfo.location}</p>
          <p>Upcoming Classes: {instructorInfo.upcomingClassesCount}</p>
        </div>
        <Outlet />
      </div>
    </div>
  );
};
export default Dashboard;
