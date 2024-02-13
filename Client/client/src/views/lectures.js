import { useEffect, useState } from "react";
import axios from "axios";

function lectures() {
  const [lecture, setLecture] = useState(null);

  const fetchlectures = async () => {
    try {
      let classes = await axios.get(
        "http://localhost:4000/category/categories"
      );
      console.log(cats.data.data);
      setClasses(cats.data.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchClasses();
  }, []);

  return (
    <div>
      {Classes ? (
        Classes.map((cat) => (
          <div>
            <p>{cat.Classes}</p>
          </div>
        ))
      ) : (
        <h1>no categories</h1>
      )}
    </div>
  );
}

export default Categories;
