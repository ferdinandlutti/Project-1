import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import backgroundImage from "../images/New-b-image.jpg";
import axios from "axios";

import "../App.css";

function Home() {
  const [categories, setCategories] = useState([]);
  const [recentClasses, setRecentClasses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
    fetchRecentClasses();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5010/category/allcategories"
      );
      setCategories(response.data.data);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };
  const fetchRecentClasses = async () => {
    try {
      const response = await axios.get("http://localhost:5010/class/recent");
      setRecentClasses(response.data.data);
    } catch (error) {
      console.error("Failed to fetch recent classes:", error);
    }
  };

  const handleCategoryClick = (categoryId) => {
    navigate(`/category/by-category/${categoryId}`);
  };

  const handleClassClick = (classId) => {
    navigate(`/class/${classId}`);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredCategories = categories.filter((category) =>
    category.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const backgroundStyle = {
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: "cover",
    backgroundPosition: "center center",
    height: "600px", // Ensure it covers the full view height
    width: "100%",
    display: "flex", // Using Flexbox to center content
    justifyContent: "center", // Horizontally center
    alignItems: "center", // Vertically center
    position: "relative", // Needed for absolute positioning of children if necessary
  };

  return (
    <div>
      <div style={{ ...backgroundStyle }}>
        <div style={{ textAlign: "center" }}>
          {" "}
          {/* Ensures content is centered */}
          <input
            type="text"
            placeholder="Search for categories..."
            className="searchInput"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <div className="allcategories" style={{ marginTop: "20px" }}>
            {filteredCategories.map((category) => (
              <div
                className="categoryItem"
                key={category._id}
                onClick={() => handleCategoryClick(category._id)}
              >
                {category.category}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="contentWrapper">
        <h2>Recently Added Classesd</h2>
        <div className="recentClasses">
          {recentClasses.map((classItem) => (
            <div
              className="classItem"
              key={classItem._id}
              onClick={() => handleClassClick(classItem._id)}
            >
              <p>{classItem.category}</p>
              <h3>{classItem.title}</h3>
              {classItem.selectedImage && (
                <img
                  src={classItem.selectedImage}
                  alt={classItem.title}
                  style={{
                    width: "100%",
                    maxHeight: "200px",
                    objectFit: "cover",
                  }}
                />
              )}{" "}
              <p>{classItem.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;
