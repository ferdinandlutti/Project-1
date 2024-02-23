import React, { useEffect, useState } from "react";
import { useNavigate, NavLink, Outlet, useLocation } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { URL } from "../config";

import image1 from "../images/image-1.jpg";
import image2 from "../images/image-2.jpg";
import image3 from "../images/image-3.jpg";
import image4 from "../images/image-4.jpg";
import image5 from "../images/image-5.jpg";
import image6 from "../images/image-6.jpg";
import image7 from "../images/image-7.jpg";
import image8 from "../images/image-8.jpg";
import image9 from "../images/image-9.jpg";

import("./dashboard.css");

const CreateClass = (props) => {
  const predefinedImages = [
    image1,
    image2,
    image3,
    image4,
    image5,
    image6,
    image7,
    image8,
    image9,
    2,
  ];

  const [classData, setClassData] = useState({
    title: "",
    description: "",
    location: "",
    date: "",
    time: "",
    duration: "",
    capacity: "",
    price: "",
    selectedImage: "",
    name: "",
    surname: "",
    instructorProfilePicture: "",
  });
  const [categories, setCategories] = useState([]);
  const [showImageSelection, setShowImageSelection] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5010/category/allcategories"
        );
        const data = response.data;
        if (data.ok) {
          setCategories(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    const fetchInstructorDetails = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      const decodedToken = jwtDecode(token);
      try {
        const response = await axios.get(
          `${URL}/instructor/${decodedToken.userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log(response.data);
        if (response.data.ok) {
          setClassData((prevData) => ({
            ...prevData,
            name: response.data.profile.name,
            surname: response.data.profile.surname,
            instructorProfilePicture: response.data.profile.profilePicture, // Assuming this is how your response provides the profile picture
          }));
        }
      } catch (error) {
        console.error("Failed to fetch instructor details:", error);
      }
    };
    fetchCategories();
    fetchInstructorDetails();
  }, []);

  let navigate = useNavigate();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setClassData({
      ...classData,
      [name]: value,
    });
  };
  const selectImage = (image) => {
    setClassData({ ...classData, selectedImage: image });
    setShowImageSelection(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const decodedToken = jwtDecode(token);
    const instructorId = decodedToken.userId;
    const dataToSend = {
      ...classData,
      instructorId: instructorId,
    };
    try {
      const response = await axios.post(
        "http://localhost:5010/class/add",
        dataToSend,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(classData);
      console.log(response);
      if (response.data.ok) {
        alert("Class created successfully");
        setClassData({
          title: "",
          description: "",
          location: "",
          date: "",
          time: "",
          duration: "",
          capacity: "",
          price: "",
          selectedImage: "",
          name: "",
          surname: "",
          instructorProfilePicture: "",
        });

        navigate("/instructor/dashboard");
      } else {
        alert("Failed to create class");
      }
    } catch (error) {
      console.error("Error creating class:", error);
      alert("Error creating class");
    }
  };
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
      <div className="content">
        <button onClick={() => setShowImageSelection(!showImageSelection)}>
          Select Class Image
        </button>

        {showImageSelection && (
          <div className="imageSelection">
            {predefinedImages.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Select ${index}`}
                className={`imageOption ${
                  classData.selectedImage === image ? "selected" : ""
                }`}
                onClick={() => selectImage(image)}
              />
            ))}
          </div>
        )}

        {classData.selectedImage && (
          <div className="selectedImagePreview">
            <img src={classData.selectedImage} alt="Selected" />
          </div>
        )}
        <form onSubmit={handleSubmit} className="createClassForm">
          <select
            name="category_id"
            value={classData.category_id}
            onChange={handleChange}
            required
            className="formSelect"
          >
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.category}
              </option>
            ))}
          </select>

          <input
            type="text"
            name="title"
            value={classData.title}
            onChange={handleChange}
            placeholder="Title"
            required
            className="formInput"
          />

          <textarea
            name="description"
            value={classData.description}
            onChange={handleChange}
            placeholder="Description"
            required
            className="formTextarea"
          />

          <input
            type="text"
            name="location"
            value={classData.location}
            onChange={handleChange}
            placeholder="Location"
            required
            className="formInput"
          />

          <input
            type="date"
            name="date"
            value={classData.date}
            onChange={handleChange}
            required
            className="formInput"
          />

          <input
            type="time"
            name="time"
            value={classData.time}
            onChange={handleChange}
            required
            className="formInput"
          />

          <input
            type="number"
            name="duration"
            value={classData.duration}
            onChange={handleChange}
            placeholder="Duration (in minutes)"
            required
            className="formInput"
          />

          <input
            type="number"
            name="capacity"
            value={classData.capacity}
            onChange={handleChange}
            placeholder="Capacity"
            required
            className="formInput"
          />

          <input
            type="number"
            name="price"
            value={classData.price}
            onChange={handleChange}
            placeholder="Price"
            required
            className="formInput"
          />

          <button type="submit" className="formButton">
            Create Class
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateClass;
