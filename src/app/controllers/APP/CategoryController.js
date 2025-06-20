import Category from "../../models/Category.js";

class CategoryController {
  // [GET] /api/app/categories
  async index(req, res) {
    try {
      const categories = await Category.find({}).select("-_id");
      return res.json(categories);
    } catch (err) {
      res.json("Failed");
    }
  }
}
export default new CategoryController();
