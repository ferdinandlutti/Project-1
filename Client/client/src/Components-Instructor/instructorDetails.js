import React, { useState } from "react";
import axios from "axios";
import { URL } from "../config";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const InstructorDetails = () => {
  const [details, setDetails] = useState({
    bio: "",
    location: "",
    imageUrl: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDetails({ ...details, [name]: value });
  };
  const openCloudinaryWidget = () => {
    console.log(process.env.REACT_APP_CLOUD_NAME);
    console.log(process.env.REACT_APP_UPLOAD_PRESET);
    window.cloudinary.openUploadWidget(
      {
        cloudName: process.env.REACT_APP_CLOUD_NAME,
        uploadPreset: process.env.REACT_APP_UPLOAD_PRESET,
        tags: ["instructor"],
      },
      (error, result) => {
        if (!error && result && result.event === "success") {
          setDetails({ ...details, imageUrl: result.info.secure_url });
        }
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in to perform this action.");
      navigate("/login");
      return;
    }
    const decodedToken = jwtDecode(token);
    const userId = decodedToken.userId;
    const requestBody = {
      ...details,
      userId,
      profilePicture: details.imageUrl,
    };
    try {
      const response = await axios.post(
        `${URL}/instructor/details`,
        requestBody,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response);
      if (response.data.ok) {
        alert("Instructor details created successfully");
        navigate("/instructor/dashboard");
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
        <button type="button" onClick={openCloudinaryWidget}>
          Upload Profile Picture
        </button>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default InstructorDetails;
