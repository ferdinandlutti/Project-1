import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import backgroundImage from "../images/background.jpg";
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
      const response = await fetch(
        "http://localhost:5010/category/allcategories"
      );
      const data = await response.json();
      console.log(data); // Log the entire response
      setCategories(data.data); // Assuming your backend returns categories in a `data` field
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };
  const fetchRecentClasses = async () => {
    try {
      const response = await fetch("http://localhost:5010/class/recent");
      const data = await response.json();
      setRecentClasses(data.data);
    } catch (error) {
      console.error("Failed to fetch recent classes:", error);
    }
  };

  const handleCategoryClick = (categoryId) => {
    navigate(`/category/by-category/${categoryId}`);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredCategories = categories.filter((category) =>
    category.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const backgroundStyle = {
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: "contain",
    backgroundPosition: "center center",
    height: "600px",
    width: "100%",
  };

  return (
    <div>
      <div className="backgroundWrapper" style={backgroundStyle}>
        <input
          type="text"
          placeholder="Search for categories..."
          className="searchInput"
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <div className="allcategories">
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
      <div className="contentWrapper">
        <h2>Recently Added Classes</h2>
        <div className="recentClasses">
          {recentClasses.map((classItem) => (
            <div className="classItem" key={classItem._id}>
              <p>{classItem.category}</p>
              <h3>{classItem.title}</h3>
              <p>{classItem.description}</p>
              {/* Display more details as needed */}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;
