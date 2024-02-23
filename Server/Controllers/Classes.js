const Classes = require("../Schemas/classes");
const User = require("../Schemas/Users");

// show all classes
const allClasses = async (req, res) => {
  try {
    const classes = await Classes.find({});
    res.send({
      ok: true,
      data: classes,
    });
  } catch (error) {
    console.log(error);
  }
};
// Get recent classes (3)
const getRecentClasses = async (req, res) => {
  try {
    const classes = await Classes.find({}).sort({ createdAt: -1 }).limit(3);
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
    const instructorId = req.userId;

    const {
      category_id,
      title,
      description,
      location,
      date,
      time,
      duration,
      capacity,
      price,
      selectedImage,
      name,
      surname,
      instructorProfilePicture,
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
      selectedImage,
      name,
      surname,
      instructorProfilePicture,
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

const getInstructorClasses = async (req, res) => {
  try {
    const instructorId = req.params.id; // or req.params.id if you're getting the ID from the route parameter
    console.log(instructorId);
    const instructorClasses = await Classes.find({ instructorId }).populate(
      "category_id"
    ); // Assuming you want to include details of the category

    if (!instructorClasses || instructorClasses.length === 0) {
      return res.json({
        ok: true,
        message: "No classes found for this instructor.",
        data: [],
      });
    }

    res.json({ ok: true, data: instructorClasses });
  } catch (error) {
    console.error("Error fetching instructor classes:", error);
    res
      .status(500)
      .json({ ok: false, message: "Error fetching instructor classes" });
  }
};

// update class
const updateClass = async (req, res) => {
  const classId = req.params.id;
  const updateData = req.body;
  console.log(classId);
  try {
    const updatedClass = await Classes.findByIdAndUpdate(classId, updateData, {
      new: true,
    })
      .populate("category_id")
      .populate("instructorId");
    if (!updatedClass) {
      return res.send({ ok: false, message: "Class not found" });
    }
    res.send({ ok: true, data: updatedClass });
  } catch (error) {
    res
      .status(500)
      .send({ ok: false, message: "Error updating class details" });
  }
};
const deleteClass = async (req, res) => {
  const classId = req.params.id;
  try {
    const deletedClass = await Classes.findByIdAndDelete(classId);

    if (!deletedClass) {
      return res.send({ ok: false, message: "Class not found" });
    }

    res.send({ ok: true, message: "Class deleted successfully" });
  } catch (error) {
    console.error("Error deleting class:", error);
    res.send({ ok: false, message: "Error deleting class" });
  }
};
module.exports = {
  allClasses,
  addClass,
  getClassById,
  updateClass,
  deleteClass,
  getRecentClasses,
  getInstructorClasses,
};
