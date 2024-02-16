import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

function ClassesByCategory() {
  const { categoryId } = useParams();
  const [classes, setClasses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [categoryName, setCategoryName] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const categoryResponse = await fetch(
          `http://localhost:5010/category/${categoryId}`
        );
        if (!categoryResponse.ok) throw new Error("Failed to fetch category");
        const categoryData = await categoryResponse.json();
        setCategoryName(categoryData.data.category); // Adjust based on your API response structure

        // Fetch classes by category
        const classesResponse = await fetch(
          `http://localhost:5010/category/by-category/${categoryId}`
        );
        if (!classesResponse.ok) throw new Error("Failed to fetch classes");
        const classesData = await classesResponse.json();
        setClasses(classesData.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [categoryId]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>{categoryName ? `${categoryName} Classes` : "Classes"}</h2>
      {classes.map((classItem) => (
        <div key={classItem._id}>
          <h3>{classItem.title}</h3>
        </div>
      ))}
    </div>
  );
}

export default ClassesByCategory;
