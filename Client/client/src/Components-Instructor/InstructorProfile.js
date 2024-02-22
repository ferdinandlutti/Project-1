import React, { useState, useEffect } from "react";
import axios from "axios";
import { URL } from "../config";
import { useNavigate, NavLink, Outlet, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const InstructorProfile = () => {
  const [profileData, setProfileData] = useState({
    bio: "",
    location: "",
    email: "",
    profilePicture: "",
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData({ ...profileData, [name]: e.target.value });
  };

  const openCloudinaryUploadWidget = () => {
    window.cloudinary.openUploadWidget(
      {
        cloudName: process.env.REACT_APP_CLOUD_NAME,
        uploadPreset: process.env.REACT_APP_UPLOAD_PRESET,
        tags: ["instructorProfile"],
      },
      (error, result) => {
        if (!error && result && result.event === "success") {
          setProfileData({
            ...profileData,
            profilePicture: result.info.secure_url,
          });
        }
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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
  console.log(profileData);

  const [isClassesDropdownVisible, setIsClassesDropdownVisible] =
    useState(false);
  const location = useLocation();

  const toggleClassesDropdown = () => {
    setIsClassesDropdownVisible(!isClassesDropdownVisible);
  };

  const isClassesSection = location.pathname.startsWith("/instructor/classes");

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
            isClassesDropdownVisible || isClassesSection ? "show" : ""
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
            <button type="button" onClick={openCloudinaryUploadWidget}>
              Upload Profile Picture
            </button>

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
