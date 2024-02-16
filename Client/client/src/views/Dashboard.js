import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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
    const token = localStorage.getItem("token");
    try {
      const response = await fetch("http://localhost:5010/class/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(classData),
      });
      const data = await response.json();
      if (data.ok) {
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
    <div className="secret_page">
      <h1>This is the dashboard page for {props.user.email}</h1>
      <h2>You can access here only after verify the token</h2>
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
  );
};

export default Dashboard;
