import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { URL } from "../config";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import "./user.css";
import { useStripe } from "@stripe/react-stripe-js";

const ClassPage = (props) => {
  const [classDetails, setClassDetails] = useState(null);
  const { classId } = useParams();
  const [categoryName, setCategoryName] = useState("");
  const navigate = useNavigate();
  const stripe = useStripe();

  useEffect(() => {
    const fetchClassDetails = async () => {
      try {
        const response = await axios.get(`${URL}/class/${classId}`);
        setClassDetails(response.data);
        console.log(response.data);

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
      // debugger;
      // const token = localStorage.getItem("token");
      // if (!token) {
      //   alert("You need to be signed in to book a class.");
      //   navigate("/login");
      //   return;
      // }
      // const decodedToken = jwtDecode(token);
      // const userId = decodedToken.userId;
      // const bookingData = {
      //   classId: classId,
      //   userId: userId,
      // };

      const sessionResponse = await axios.post(
        `${URL}/payment/create-checkout-session`,
        {
          classId: classId,

          title: classDetails.title,
          description: classDetails.description,
          price: classDetails.price,
        }
        // {
        //   headers: {
        //     Authorization: `Bearer ${token}`,
        //   },
        // }
      );
      if (sessionResponse.data.ok) {
        localStorage.setItem(
          "sessionId",

          JSON.stringify(sessionResponse.data.sessionId)
        );
        // 9. If server returned ok after making a session we run redirect() and pass id of the session to the actual checkout / payment form
        redirect(sessionResponse.data.sessionId);
      } else {
        navigate("/payment/error");
      }
    } catch (error) {
      navigate("/payment/error");
    }
  };

  const redirect = (sessionId) => {
    debugger;
    // 10. This redirects to checkout.stripe.com and if charge/payment was successful send user to success url defined in create_checkout_session in the controller (which in our case renders payment_success.js)
    stripe
      .redirectToCheckout({
        // Make the id field from the Checkout Session creation API response
        // available to this file, so you can provide it as parameter here
        // instead of the {{CHECKOUT_SESSION_ID}} placeholder.
        sessionId: sessionId,
      })
      .then(function (result) {
        console.log(result);
        // If `redirectToCheckout` fails due to a browser or network
        // error, display the localized error message to your customer
        // using `result.error.message`.
      });
  };
  //     const response = await axios.post(
  //       "http://localhost:5010/booking/create",
  //       bookingData,
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //           // Include authorization header if your API requires it
  //           Authorization: `Bearer ${JSON.parse(token)}`,
  //         },
  //       }
  //     );
  //     console.log(response);
  //     if (response.data.ok) {
  //       alert("Booking successful!");
  //       navigate("/user/bookings");
  //     } else {
  //       alert("Failed to book the class");
  //     }
  //   } catch (error) {
  //     console.error("Error booking the class:", error);
  //     alert("Error booking the class");
  //   }
  // };

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
};

export default ClassPage;
