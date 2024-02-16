import React, { useEffect, useState } from "react";
import { useNavigate, NavLink, Outlet } from "react-router-dom";
import axios from "axios";
import("./dashboard.css");

const Dashboard = (props) => {
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
        const response = await fetch(
          "http://localhost:5010/category/allcategories"
        );
        const data = await response.json();
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
    const token = JSON.parse(localStorage.getItem("token"));
    try {
      const response = await axios.post(
        "http://localhost:5010/class/add",
        classData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(classData),
        }
      );
      console.log(response);
      if (response.data.ok) {
        alert("Class created successfully");
      } else {
        alert("Failed to create class");
      }
    } catch (error) {
      console.error("Error creating class:", error);
      alert("Error creating class");
    }
  };
  return (
    <div className="dashboard">
      <div className="sidebar">
        <NavLink
          to="/instructor/home"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          Home
        </NavLink>
        <NavLink
          to="classes"
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
  );
};

export default Dashboard;
