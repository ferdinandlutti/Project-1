import "./App.css";
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Navbar from "./Components-Instructor/Navbar";
import Home from "./views/Home";
import Register from "./views/Register";
import Login from "./views/Login";
import Dashboard from "./Components-Instructor/InstructorDashboard";
import { URL } from "./config";
import * as jose from "jose";
import ClassesByCategory from "./Components-Instructor/ClassesByCategory";
import CreateClass from "./Components-Instructor/CreateClass";
import InstructorDetails from "./Components-Instructor/instructorDetails";
import InstructorProfile from "./Components-Instructor/InstructorProfile";
import UserProfile from "./Components-user/UserProfile";
import UserBookings from "./Components-user/UserBookings";
import UserSettings from "./Components-user/UserSettings";
import ClassPage from "./Components-user/ClassPage";
import InstructorClasses from "./Components-Instructor/instructorClasses";
import InstructorClassPage from "./Components-Instructor/ClassPage";
import InstructorEditClassPage from "./Components-Instructor/InstructorEditClassPage";
import PreviousClasses from "./Components-Instructor/PreviousClasses";
import UpcomingClasses from "./Components-Instructor/UpcomingClasses";
import PaymentSuccess from "./containers/payment_success";
import PaymentError from "./containers/payment_error";
import Stripe from "./containers/stripe-page";
import ErrorPage from "./containers/Errorpage";
import { jwtDecode } from "jwt-decode";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.log("No token found, not logged in.");
        setIsLoggedIn(false);
        return;
      }

      try {
        // Ensure the token is sent in the correct format
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        const response = await axios.post(`${URL}/user/verify_token`);

        if (response.data.ok) {
          login(token); // Proceed with login if token verification is successful
        } else {
          logout(); // Logout if token is invalid or verification fails
        }
      } catch (error) {
        console.error("Error verifying token:", error);
        logout();
      }
    };

    verifyToken();
  }, []);

  const login = (token) => {
    // Decode the token to get user details without verifying the signature
    const decodedToken = jwtDecode(token);
    console.log("Decoded token:", decodedToken);

    const userData = {
      email: decodedToken.userEmail,
      type: decodedToken.userType,
    };

    // Store the raw token for future API requests
    localStorage.setItem("token", token);
    setIsLoggedIn(true);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
  };

  return (
    <Router>
      <Navbar isLoggedIn={isLoggedIn} userType={user?.type} logout={logout} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/category/by-category/:categoryId"
          element={<ClassesByCategory />}
        />
        <Route path="/class/:classId" element={<Stripe />} />
        <Route path="/instructor/dashboard" element={<Dashboard />}></Route>
        <Route path="/instructor/classes" element={<CreateClass />} />
        <Route path="/instructor/profile" element={<InstructorProfile />} />
        <Route
          path="/instructor/classes/myclasses"
          element={<InstructorClasses />}
        />
        <Route
          path="/instructor/classes/previousclasses"
          element={<PreviousClasses />}
        />
        <Route
          path="/instructor/classes/upcomingclasses"
          element={<UpcomingClasses />}
        />

        <Route
          path="/instructor/class/:classId"
          element={<InstructorClassPage />}
        />
        <Route
          path="/instructor/class/edit/:classId"
          element={<InstructorEditClassPage />}
        />

        <Route
          path="/login"
          element={
            isLoggedIn ? (
              <Navigate
                to={user?.type === "instructor" ? "/instructor/dashboard" : "/"}
              />
            ) : (
              <Login login={login} />
            )
          }
        />
        <Route path="/instructor/details" element={<InstructorDetails />} />

        <Route path="/user/bookings" element={<UserBookings />} />
        <Route path="/user/profile" element={<UserProfile />} />
        <Route path="/user/settings" element={<UserSettings />} />

        <Route path="/payment/stripe" element={<Stripe />} />
        <Route path="/payment/success" element={<PaymentSuccess />} />
        <Route path="/booking/cancel" element={<PaymentError />} />
        <Route
          path="/register"
          element={
            !isLoggedIn ? (
              <Register login={login} />
            ) : (
              <Navigate
                to={user?.type === "instructor" ? "/instructor/dashboard" : "/"}
              />
            )
          }
        />

        <Route
          path="/instructor/dashboard"
          element={
            isLoggedIn && user?.type === "instructor" ? (
              <Dashboard logout={logout} user={user} />
            ) : (
              <Navigate to="/" />
            )
          }
        />

        <Route path="/*" element={<ErrorPage />} />
      </Routes>
    </Router>
  );
}

export default App;
