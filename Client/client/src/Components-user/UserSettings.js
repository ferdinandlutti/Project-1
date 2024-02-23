import React, { useState, useEffect } from "react";
import axios from "axios";
import { URL } from "../config";
import { useNavigate, NavLink, Outlet } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function UserSettings() {
  const [userData, setUserData] = useState({
    email: "",
    name: "",
    surname: "",
    profilePicture: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserDetails();
  }, []);

  const fetchUserDetails = async () => {
    try {
      const token = localStorage.getItem("token");
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.userId;
      const response = await axios.get(`${URL}/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(response.status);
      if (response.status === 200) {
        setUserData({
          email: response.data.email,
          name: response.data.name,
          surname: response.data.surname,
          profilePicture: response.data.profilePicture || "",
        });
      }
    } catch (error) {
      console.error("Failed to fetch user details", error);
    }
  };
  const openCloudinaryUploadWidget = () => {
    window.cloudinary.openUploadWidget(
      {
        cloudName: process.env.REACT_APP_CLOUD_NAME,
        uploadPreset: process.env.REACT_APP_UPLOAD_PRESET,
        tags: ["userProfile"],
      },
      (error, result) => {
        if (!error && result && result.event === "success") {
          setUserData({
            ...userData,
            profilePicture: result.info.secure_url,
          });
        }
      }
    );
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevUserData) => ({
      ...prevUserData,
      [name]: value,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const decodedToken = jwtDecode(token);
    const userId = decodedToken.userId;
    try {
      const response = await axios.put(`${URL}/user/${userId}`, userData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.ok) {
        alert("User details updated successfully");
        // Optionally navigate the user to a different page
        navigate("/user/profile");
      } else {
        alert("Failed to update user details");
      }
    } catch (error) {
      console.error("Error updating user details:", error);
      alert("Error updating user details");
    }
  };
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
        <h2>User Settings</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Email (readonly):</label>
            <input type="email" value={userData.email} readOnly />
          </div>
          <div>
            <label>Name:</label>
            <input
              type="text"
              name="name"
              value={userData.name}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Surname:</label>
            <input
              type="text"
              name="surname"
              value={userData.surname}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Profile Picture:</label>
            {userData.profilePicture && (
              <img
                src={userData.profilePicture}
                alt="Profile"
                style={{ width: "100px", height: "100px" }}
              />
            )}
            <button type="button" onClick={openCloudinaryUploadWidget}>
              Upload Profile Picture
            </button>
          </div>
          {/* Display profile picture and upload widget if needed */}
          <button type="submit">Save Changes</button>
        </form>
      </div>
    </div>
  );
}

export default UserSettings;
