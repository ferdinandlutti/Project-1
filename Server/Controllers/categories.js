const Category = require("../Schemas/categories");
const Classes = require("../Schemas/classes");

const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find({});
    res.json({ ok: true, data: categories });
  } catch (error) {
    res
      .status(500)
      .json({ ok: false, message: "Error fetching categories", error });
  }
};
const getClassesByCategory = async (req, res) => {
  const { categoryId } = req.params;
  try {
    const classes = await Classes.find({ category_id: categoryId }).populate(
      "category_id"
    );
    res.json({ ok: true, data: classes });
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: "Error fetching classes by category",
      error,
    });
  }
};
const getCategory = async (req, res) => {
  const { categoryId } = req.params;
  try {
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ ok: false, message: "Category not found" });
    }
    res.json({ ok: true, data: category });
  } catch (error) {
    res
      .status(500)
      .json({ ok: false, message: "Error fetching category", error });
  }
};
const addCategory = async (req, res) => {
  const { category } = req.body; // Assuming your category has these fields

  // Basic validation to check if the required fields are provided
  if (!category) {
    return res.status(400).json({ ok: false, message: "Category is required" });
  }

  try {
    // Check if the category already exists to avoid duplicates
    const existingCategory = await Category.findOne({ category: category });
    if (existingCategory) {
      return res
        .status(409)
        .json({ ok: false, message: "Category already exists" });
    }

    // Create a new category document and save it to the database
    const newCategory = new Category({
      category,
    });

    await newCategory.save();

    // Respond with the created category
    res.status(201).json({ ok: true, data: newCategory });
  } catch (error) {
    res
      .status(500)
      .json({ ok: false, message: "Error adding category", error });
  }
};
module.exports = {
  getAllCategories,
  getClassesByCategory,
  getCategory,
  addCategory,
};
