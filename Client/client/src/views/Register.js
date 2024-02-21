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
    const { name, value, type, checked } = e.target;
    setValues({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log(`${URL}/user/register`);

      const response = await axios.post(`${URL}/user/register`, {
        email: form.email,
        password: form.password,
        password2: form.password2,
        instructor: form.instructor,
      });
      setMessage(response.data.message);
      localStorage.setItem("token", response.data.token);
      if (form.instructor) {
        navigate("/instructor/details", { state: { email: form.email } });
      } else {
        if (response.data.ok) {
          setTimeout(() => {
            props.login(response.data.token, response.data.user);
            navigate("/");
          }, 2000);
        }
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
