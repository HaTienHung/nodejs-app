import Category from "../../models/Category.js";
import cacheWrapper from "../../../helpers/cacheWrapper.helper.js";

class CategoryController {
  // [GET] /api/app/categories
  async index(req, res) {
    try {
      const data = await cacheWrapper("categories:all", 86400, () =>
        Category.find({}).select("-_id")
      );
      return res.json(data);
    } catch (err) {
      res.status(500).json({
        message: "Không thể lấy danh sách danh mục",
        error: err.message, // hoặc err.toString()
      });
    }
  }
}
export default new CategoryController();
