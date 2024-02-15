import React, { useState } from "react";
import axios from "axios";
import { URL } from "../config";
import { useNavigate } from "react-router-dom";

const Register = (props) => {
  const [form, setValues] = useState({
    email: "",
    password: "",
    password2: "",
    instructor: false,
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      setValues({ ...form, [name]: e.target.checked });
    } else {
      setValues({ ...form, [name]: value });
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log(`${URL}/user/register`); // Check this URL is correct

      const response = await axios.post(`${URL}/user/register`, {
        email: form.email,
        password: form.password,
        password2: form.password2,
        instructor: form.instructor, // Send the flag to the backend
      });
      console.log(response);
      setMessage(response.data.message);
      if (response.data.ok) {
        setTimeout(() => {
          props.login(response.data.token, response.data.user);
          navigate("/secret-page");
        }, 2000);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <form
      onSubmit={handleSubmit}
      onChange={handleChange}
      className="form_container"
    >
      <label>Email</label>
      <input
        type="email"
        name="email"
        value={form.email}
        onChange={handleChange}
      />

      <label>Password</label>
      <input name="password" value={form.password} onChange={handleChange} />

      <label>Repeat password</label>
      <input name="password2" value={form.password2} onChange={handleChange} />
      <label>Register as instructor</label>
      <input type="checkbox" name="instructor" onChange={handleChange} />
      <button type="submit">register</button>
      <div className="message">
        <h4>{message}</h4>
      </div>
    </form>
  );
};
export default Register;
