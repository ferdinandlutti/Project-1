import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import "./user.css";

function ClassPage() {
  const [classDetails, setClassDetails] = useState(null);
  const { classId } = useParams();
  const [categoryName, setCategoryName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClassDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5010/class/${classId}`
        );
        setClassDetails(response.data);
        console.log(response);

        // const categoryResponse = await axios.get(
        //   `http://localhost:5010/category/${response.data.data.category_id._id}`
        // );

        setCategoryName(response.data.category_id.category);
      } catch (error) {
        console.error("Failed to fetch class details:", error);
      }
    };
    fetchClassDetails();
  }, [classId]);

  const handleBookClass = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You need to be signed in to book a class.");
        navigate("/login");
        return;
      }
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.userId;
      const bookingData = {
        classId: classId,
        userId: userId,
      };
      const response = await axios.post(
        "http://localhost:5010/booking/create",
        bookingData,
        {
          headers: {
            "Content-Type": "application/json",
            // Include authorization header if your API requires it
            Authorization: `Bearer ${JSON.parse(token)}`,
          },
        }
      );
      console.log(response);
      if (response.data.ok) {
        alert("Booking successful!");
        navigate("/user/bookings");
      } else {
        alert("Failed to book the class");
      }
    } catch (error) {
      console.error("Error booking the class:", error);
      alert("Error booking the class");
    }
  };

  if (!classDetails) {
    return <div>Loading...</div>;
  }
  return (
    <div className="class-details">
      <h1>{classDetails.title}</h1>
      <p>
        <strong>Category:</strong> {categoryName}
      </p>
      {classDetails.selectedImage && (
        <img
          src={classDetails.selectedImage}
          alt={classDetails.title}
          style={{
            width: "50%",
            maxHeight: "400px",
            objectFit: "cover",
          }}
        />
      )}{" "}
      <p></p>
      <p>
        <strong>Description:</strong> {classDetails.description}
      </p>
      <div className="instructor-info">
        <img
          src={classDetails.instructorProfilePicture}
          alt="Profile"
          style={{ width: 100, height: 100, borderRadius: "50%" }}
        />
        <p>
          <strong>Instructor:</strong> {classDetails.instructorId.name}{" "}
          {classDetails.instructorId.surname}
        </p>
      </div>
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
      <button onClick={handleBookClass}>Book Class</button>
    </div>
  );
}

export default ClassPage;
