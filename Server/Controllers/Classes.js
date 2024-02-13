const Classes = require("../Schemas/classes");

// show all classes
const allClasses = async (req, res) => {
  try {
    const classes = await Classes.find({}); // Find all documents in the Categories collection
    res.send({
      ok: true,
      data: classes,
    });
  } catch (error) {
    console.log(error);
  }
};
// Add a class
const addClass = async (req, res) => {
  try {
    const {
      instructorId,
      category_id,
      title,
      description,
      location,
      date,
      time,
      duration,
      capacity,
      price,
    } = req.body;

    const newClass = await Classes.create({
      instructorId,
      category_id,
      title,
      description,
      location,
      date,
      time,
      duration,
      capacity,
      price,
    });
    res.send({
      ok: true,
      data: newClass,
    });
  } catch (error) {
    console.log(error);
    res.send({
      ok: false,
      message: "Failed to add class",
    });
  }
};
// Get the specific class
const getClassById = async (req, res) => {
  try {
    const classId = req.params.id;
    const classDetails = await Classes.findById(classId)
      .populate("category_id")
      .populate("instructorId");

    if (!classDetails) {
      return res.send({ message: "Class not found" });
    }
    res.json(classDetails);
  } catch (error) {
    console.error("Error fetching class details:", error);
    res.send({ message: "Error fetching class details" });
  }
};
const updateClass = async (req, res) => {
  const classId = req.params.id;
  const updateData = req.body; // Data to update the class with

  try {
    // Find the class by ID and update it with the new data
    // { new: true } option returns the updated document
    const updatedClass = await Classes.findByIdAndUpdate(classId, updateData, {
      new: true,
    })
      .populate("category_id")
      .populate("instructorId");
  } catch (error) {}
};
module.exports = {
  allClasses,
  addClass,
  getClassById,
  updateClass,
};
