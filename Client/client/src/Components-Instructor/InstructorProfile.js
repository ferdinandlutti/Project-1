import React, { useState, useEffect } from "react";
import axios from "axios";
import { URL } from "../config";
import { useNavigate, NavLink, Outlet } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const InstructorProfile = () => {
  const [profileData, setProfileData] = useState({
    bio: "",
    location: "",
    email: "",
    profilePicture: null,
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchInstructorDetails();
  }, []);

  const fetchInstructorDetails = async () => {
    try {
      const token = localStorage.getItem("token");
      const decodedToken = jwtDecode(token);
      const instructorId = decodedToken.userId;
      const response = await axios.get(`${URL}/instructor/${instructorId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(response);
      if (response.data.ok) {
        setProfileData({
          bio: response.data.profile.bio,
          location: response.data.profile.location,
          email: response.data.profile.email,
          profilePicture: response.data.profile.profilePicture,
        });
      }
    } catch (error) {
      console.error("Failed to fetch instructor details", error);
    }
  };

  const handleFileChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.files[0] });
  };

  const handleChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    debugger;
    e.preventDefault();
    // let formData = new FormData();
    // formData.append("bio", profileData.bio);
    // formData.append("location", profileData.location);
    // if (profileData.profilePicture) {
    //   formData.append("profilePicture", profileData.profilePicture);
    // }
    // console.log(profileData);
    try {
      const token = localStorage.getItem("token");
      const decodedToken = jwtDecode(token);
      const instructorId = decodedToken.userId;
      const res = await axios.put(
        `${URL}/instructor/${instructorId}`,
        profileData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Profile updated successfully");
      navigate("/instructor/dashboard"); // Redirect as needed
    } catch (error) {
      console.error("Error updating profile", error);
      alert("Failed to update profile");
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
      <Outlet /> {/* React Router v6 Outlet for nested routes */}
      <div>
        <h2>Edit Your Profile</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Email (readonly):</label>
            <input type="email" value={profileData.email} readOnly />
          </div>
          <div>
            <label>Bio:</label>
            <textarea
              name="bio"
              value={profileData.bio}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Location:</label>
            <input
              type="text"
              name="location"
              value={profileData.location}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Profile Picture:</label>
            <input
              type="file"
              name="profilePicture"
              onChange={handleFileChange}
            />
            {profileData.profilePicture && (
              <div>
                <img
                  src={profileData.profilePicture}
                  alt="Profile"
                  style={{ width: "100px", height: "100px" }}
                />
              </div>
            )}
          </div>
          <button type="submit">Update Profile</button>
        </form>
      </div>
    </div>
  );
};

export default InstructorProfile;
