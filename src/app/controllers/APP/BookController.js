import Book from "../../models/Book.js";
import Category from "../../models/Category.js";
import User from "../../models/User.js";
import Publisher from "../../models/Publisher.js";

class BookController {
  // [GET] api/app/books/collection
  async index(req, res) {
    try {
      const books = await Book.find({});
      return res.status(200).json(books);
    } catch (error) {
      return res.status(500), json("Failed");
    }
  }
  // [GET] api/app/books/:slug
  async show(req, res) {
    try {
      const book = await Book.findOne({ slug: req.params.slug });
      if (!book) {
        return res.status(404).json({ message: "Không tìm thấy sách" });
      }
      return res.status(200).json(book);
    } catch (error) {
      console.error("Lỗi khi lấy sách:", error);
      return res.status(500).json({ message: "Lỗi server" });
    }
  }
  // [GET] api/app/books/category/:slug
  async listBookByCategorySlug(req, res) {
    try {
      const category = await Category.findOne({ slug: req.params.slug });
      const books = await Book.findOne({ category_id: category.id });
      if (!books) {
        return res
          .status(404)
          .json({ message: "Không tìm thấy sách thuộc danh mục " });
      }
      return res.status(200).json(books);
    } catch (error) {
      console.error("Lỗi khi lấy sách:", error);
      return res.status(500).json({ message: "Lỗi server" });
    }
  }
}
export default new BookController();
