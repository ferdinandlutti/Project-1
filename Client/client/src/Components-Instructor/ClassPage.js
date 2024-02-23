import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

function InstructorClassPage() {
  const [classDetails, setClassDetails] = useState(null);
  const { classId } = useParams();
  const [categoryName, setCategoryName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClassDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `http://localhost:5010/class/${classId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(response.data);
        setClassDetails(response.data);
        setCategoryName(response.data.category_id.category);
      } catch (error) {
        console.error("Failed to fetch class details:", error);
      }
    };
    fetchClassDetails();
  }, [classId]);

  const handleDeleteClass = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5010/class/delete/${classId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert("Class deleted successfully");
      navigate("/instructor/dashboard");
    } catch (error) {
      console.error("Error deleting the class:", error);
      alert("Error deleting the class");
    }
  };

  const handleEditClass = () => {
    navigate(`/instructor/class/edit/${classId}`);
  };

  if (!classDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{classDetails.title}</h1>
      <img
        src={classDetails.selectedImage}
        alt={classDetails.title}
        style={{
          width: "50%",
          maxHeight: "400px",
          objectFit: "cover",
        }}
      />
      <p>
        <strong>Category:</strong> {categoryName}
      </p>

      <p>
        <strong>Description:</strong> {classDetails.description}
      </p>
      <div>
        <img
          src={classDetails.instructorProfilePicture}
          alt="Profile"
          style={{ width: 100, height: 100, borderRadius: "50%" }}
        />
      </div>
      <p>
        <strong>Instructor:</strong> {classDetails.instructorId.name}{" "}
        {classDetails.instructorId.surname}
      </p>
      <p>
        <strong>Location:</strong> {classDetails.location}
      </p>
      <p>
        <strong>Date:</strong>{" "}
        {new Date(classDetails.date).toLocaleDateString()}
      </p>
      <p>
        <strong>Time:</strong> {classDetails.time}
      </p>
      <p>
        <strong>Duration:</strong> {classDetails.duration} minutes
      </p>
      <p>
        <strong>Capacity:</strong> {classDetails.capacity}
      </p>
      <p>
        <strong>Price:</strong> ${classDetails.price}
      </p>
      <button onClick={handleEditClass}>Edit Class</button>
      <button onClick={handleDeleteClass} style={{ marginLeft: "10px" }}>
        Delete Class
      </button>
    </div>
  );
}

export default InstructorClassPage;
