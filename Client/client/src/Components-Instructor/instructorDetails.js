import React, { useState } from "react";
import axios from "axios";
import { URL } from "../config";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const InstructorDetails = () => {
  const [details, setDetails] = useState({
    bio: "",
    location: "",
    profilePicture: null,
  });
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setDetails({ ...details, profilePicture: e.target.files[0] });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDetails({ ...details, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("bio", details.bio);
    formData.append("location", details.location);
    if (details.profilePicture) {
      formData.append("profilePicture", details.profilePicture);
    }
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in to perform this action.");
      return;
    }
    const decodedToken = jwtDecode(token);
    const userId = decodedToken.userId;

    // Add the userId to formData if your backend expects it
    formData.append("userId", userId);

    try {
      const response = await axios.post(`${URL}/instructor/details`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.ok) {
        alert("Instructor details created successfully");
        navigate("/instructor/dashboard"); // Or any other page you want to navigate to
      } else {
        alert("Failed to create instructor details");
      }
    } catch (error) {
      console.error("Error creating instructor details:", error);
      alert("Error creating instructor details");
    }
  };

  return (
    <div>
      <h2>Complete Your Instructor Profile</h2>
      <form onSubmit={handleSubmit}>
        {/* Form inputs remain the same */}
        <label htmlFor="bio">Bio:</label>
        <textarea
          id="bio"
          name="bio"
          value={details.bio}
          onChange={handleChange}
          required
        />

        <label htmlFor="location">Location:</label>
        <input
          id="location"
          name="location"
          type="text"
          value={details.location}
          onChange={handleChange}
          required
        />

        <label htmlFor="profilePicture">Profile Picture:</label>
        <input
          id="profilePicture"
          name="profilePicture"
          type="file"
          onChange={handleFileChange}
        />

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default InstructorDetails;
