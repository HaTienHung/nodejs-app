import Book from "../../models/Book.js";
import Category from "../../models/Category.js";
import cacheWrapper from "../../../helpers/cacheWrapper.helper.js";

class BookController {
  // [GET] api/app/books/collection
  async index(req, res) {
    try {
      const books = await applyQuery(Book.find(), req.query, {
        searchFields: ["title", "description"],
        filterFields: [
          "status",
          "category_id",
          "publisher_id",
          "author_id",
          "price",
          { field: "price", between: ["min_price", "max_price"] },
        ],
        sortableFields: [
          "createdAt",
          "price",
          "title",
          "averageRating",
          "ratingCount",
        ],
      });
      return res.status(200).json(books);
    } catch (error) {
      return res.status(500), json("Failed");
    }
  }
  // [GET] api/app/books/:slug
  async show(req, res) {
    try {
      const slug = req.params.slug;
      const cacheKey = `book:detail:${slug}`;

      const book = await cacheWrapper(cacheKey, 86400, () =>
        Book.findOne({ slug })
      );

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
      const slug = req.params.slug;
      const cacheKey = `books:by-category:${slug}`;

      // Lấy dữ liệu từ Redis (hoặc fallback gọi DB)
      const data = await cacheWrapper(cacheKey, 600, async () => {
        const category = await Category.findOne({ slug });
        if (!category) return null;

        const books = await Book.find({ category_id: category._id });
        return books;
      });

      if (!data || data.length === 0) {
        return res.status(404).json({
          message: "Không tìm thấy sách thuộc danh mục",
        });
      }

      return res.status(200).json(data);
    } catch (error) {
      console.error("Lỗi khi lấy sách theo danh mục:", error);
      return res.status(500).json({ message: "Lỗi server" });
    }
  }
}
export default new BookController();
