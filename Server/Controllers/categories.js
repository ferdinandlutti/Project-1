const categories = require("../Schemas/categories");

const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({});
    res.json({ ok: true, data: categories });
  } catch (error) {
    res
      .status(500)
      .json({ ok: false, message: "Error fetching categories", error });
  }
};

module.exports = {
  getCategories,
};
