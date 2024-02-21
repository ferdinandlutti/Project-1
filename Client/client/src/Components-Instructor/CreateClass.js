import React, { useEffect, useState } from "react";
import { useNavigate, NavLink, Outlet } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

import("../App.css");
import("../views/dashboard.css");

const CreateClass = (props) => {
  const [classData, setClassData] = useState({
    title: "",
    description: "",
    location: "",
    date: "",
    time: "",
    duration: "",
    capacity: "",
    price: "",
  });
  const [categories, setCategories] = useState([]);

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
    fetchCategories();
  }, []);

  let navigate = useNavigate();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setClassData({
      ...classData,
      [name]: value,
    });
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
      debugger;
      const response = await axios.post(
        "http://localhost:5010/class/add",
        dataToSend,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${JSON.parse(token)}`,
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
  return (
    <div className="secret_page">
      <div className="dashboard">
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
        </div>
        <div className="content">
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
    </div>
  );
};

export default CreateClass;
