import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { URL } from "../config";
import { jwtDecode } from "jwt-decode";

const PaymentSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const getSessionData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("You need to be signed in to verify payment.");
        return navigate("/login");
      }
      // 11. Now when payment was successful we need to get back to Stripe to know what was paid for and who is the customer
      try {
        // 12. we get the session id from the localStorage
        const sessionId = JSON.parse(localStorage.getItem("sessionId"));
        // 13. And send request to checkout_session controller to get info from Stripe by session ID
        const response = await axios.get(
          `http://localhost:4242/payment/checkout-session?sessionId=${sessionId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        // Then removing session id from localStorage
        localStorage.removeItem("sessionId");
        // 18. response from the server will contain data for the customer and the session with the order's info
        console.log("== response ==>", response);
        // 19. So from here we continue with whatever action is needed to be done after successful payment

        //if you need the products list in this page, you can find them in : response.data.session.display_items or in response.data.session.line_items depends on the version of API you are using
      } catch (error) {
        //handle the error here, in case of network error
        debugger;
      }
    };
    getSessionData();
  }, [navigate]);
  const createBooking = async (classId, token) => {
    const decodedToken = jwtDecode(token);
    const userId = decodedToken.userId;
    const bookingData = { classId, userId };
    try {
      const bookingResponse = await axios.post(
        `${URL}/booking/create`,
        bookingData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(bookingResponse);
      if (bookingResponse.data.ok) {
        alert("Booking successful!");
        navigate("/user/bookings");
      } else {
        alert("Failed to create booking");
        navigate("/payment/error");
      }
    } catch (error) {
      console.error("Error creating booking:", error);
      navigate("/payment/error");
    }
  };

  return (
    <div className="message_container">
      <div style={{ border: "2px solid  #35BFDE" }} className="message_box">
        <div className="message_box_left">
          <img
            alt="smile_icon"
            className="image"
            src={
              "https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Mr._Smiley_Face.svg/800px-Mr._Smiley_Face.svg.png"
            }
          />
        </div>
        <div style={{ color: "#35BFDE" }} className="message_box_right">
          Payment Successfull
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
