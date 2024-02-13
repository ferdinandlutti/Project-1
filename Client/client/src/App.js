import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./Components/Navbar";
import Home from "./views/Home";
import AddClass from "./views/AddLecture";
import Categories from "./views/lectures";

function App() {
  return (
    <div className="App">
      <Router>
        <Navbar />
        <Routes>
          {/* // Routes with components to render */}
          <Route path="/" element={<Home />} />
          <Route path="/add_class" element={<AddClass />} />
          <Route path="/display_classes" element={<Categories />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
