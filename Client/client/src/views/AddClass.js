import React from "react";
import { useState } from "react";
import axios from "axios";

function AddClass() {
  const [lecture, setLecture] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let response = await axios.post("http://localhost:4000/category/add", {
        category: category,
      });
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input onChange={(e) => setLecture(e.target.value)} />
        <button type="submit">Add Class</button>
      </form>
      <p>{category}</p>
    </div>
  );
}

export default AddClass;
