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
module.exports = {
  getAllCategories,
  getClassesByCategory,
  getCategory,
};
