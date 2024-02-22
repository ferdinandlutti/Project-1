import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { URL } from "../config";

function InstructorEditClassPage() {
  const { classId } = useParams();
  const navigate = useNavigate();
  const [classDetails, setClassDetails] = useState({
    title: "",
    description: "",
    category_id: "",
    location: "",
    date: "",
    time: "",
    duration: "",
    capacity: "",
    price: "",
  });
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchClassDetails = async () => {
      try {
        const response = await axios.get(`${URL}/class/${classId}`);
        setClassDetails(response.data);
        console.log(response);
        const categoriesResponse = await axios.get(
          `${URL}/category/allcategories`
        );
        setCategories(categoriesResponse.data);
        console.log(categoriesResponse.data);
      } catch (error) {
        console.error("Failed to fetch class details", error);
      }
    };

    fetchClassDetails();
  }, [classId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setClassDetails((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${URL}/class/edit/${classId}`, classDetails);
      alert("Class updated successfully");
      navigate("/instructor/dashboard");
    } catch (error) {
      console.error("Error updating class", error);
      alert("Failed to update class");
    }
  };

  return (
    <div>
      <h1>Edit Class</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          value={classDetails.title}
          onChange={handleChange}
          placeholder="Title"
          required
        />
        <textarea
          name="description"
          value={classDetails.description}
          onChange={handleChange}
          placeholder="Description"
          required
        />
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
}

export default InstructorEditClassPage;
