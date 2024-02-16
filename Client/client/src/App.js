import "./App.css";
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Navbar from "./Components/Navbar";
import Home from "./views/Home";
import Register from "./views/Register";
import Login from "./views/Login";
import Dashboard from "./views/Dashboard";
import { URL } from "./config";
import * as jose from "jose";
import ClassesByCategory from "./Components/ClassesByCategory";
import CreateClass from "./Components/CreateClass";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(JSON.parse(localStorage.getItem("token")));

  useEffect(() => {
    const verify_token = async () => {
      try {
        console.log("Verifying token:", token); // Log the token being verified

        if (!token) {
          setIsLoggedIn(false);
        } else {
          axios.defaults.headers.common["Authorization"] = token;
          const response = await axios.post(`${URL}/user/verify_token`);
          return response.data.ok ? login(token) : logout();
        }
      } catch (error) {
        console.log(error);
      }
    };
    verify_token();
  }, [token]);

  const login = (token) => {
    let decodedToken = jose.decodeJwt(token);
    console.log(decodedToken);
    // composing a user object based on what data we included in our token (login controller - jwt.sign() first argument)
    let user = {
      email: decodedToken.userEmail,
      type: decodedToken.userType, // Access 'userType' from the decoded token
    };
    localStorage.setItem("token", JSON.stringify(token));
    setIsLoggedIn(true);
    setUser(user);
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
        <Route path="/instructor" element={<Dashboard />}>
          <Route path="classes" element={<CreateClass />} />
        </Route>

        <Route
          path="/login"
          element={
            isLoggedIn ? (
              <Navigate
                to={user?.type === "instructor" ? "/secret-page" : "/"}
              />
            ) : (
              <Login login={login} />
            )
          }
        />
        <Route
          path="/register"
          element={
            !isLoggedIn ? (
              <Register login={login} />
            ) : (
              <Navigate
                to={user?.type === "instructor" ? "/secret-page" : "/"}
              />
            )
          }
        />

        <Route
          path="/secret-page"
          element={
            isLoggedIn && user?.type === "instructor" ? (
              <Dashboard logout={logout} user={user} />
            ) : (
              <Navigate to="/" />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
