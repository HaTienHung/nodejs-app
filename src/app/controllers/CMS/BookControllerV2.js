import { ROLE_NAME } from "../../../constants/role.js";
import Book from "../../models/Book.js";
import User from "../../models/User.js";
import { BookPolicy } from "../../../policies/book.policy.js";
import { applyQuery } from "../../../helpers/applyQuery.helper.js";
import streamUpload from "../../../helpers/cloudinaryUpload.helper.js";

class BookControllerV2 {
  // [GET] /api/cms/books
  async index(req, res) {
    try {
      let books;

      const user = await User.findOne({ _id: req.user.id }).populate(
        "publisher"
      );

      if (user.publisher?.name === ROLE_NAME.PUBLISHER) {
        books = await applyQuery(
          Book.find({ publisher_id: user.publisher?.id }),
          req.query,
          {
            searchFields: ["title", "description"],
            filterFields: [
              "status",
              "category_id",
              "publisher_id",
              "author_id",
              { field: "price", between: ["min_price", "max_price"] },
            ],
            sortableFields: ["createdAt", "price", "title"],
          }
        );
      } else {
        books = await applyQuery(Book.findWithDeleted(), req.query, {
          searchFields: ["title", "description"],
          filterFields: [
            "status",
            "category_id",
            "publisher_id",
            "author_id",
            "price",
            { field: "price", between: ["min_price", "max_price"] },
          ],
          sortableFields: ["createdAt", "price", "title"],
        });
      }
      return res.json(books);
    } catch (err) {
      res.json("Failed");
    }
  }
  // [POST] /api/cms/books/store
  async store(req, res) {
    try {
      const data = req.validated;
      const user = await User.findOne({ _id: req.user.id });

      if (user.role?.name === ROLE_NAME.PUBLISHER) {
        data.publisher_id = user.publisher?.id;
      }

      let image_url = "";
      let image_public_id = "";

      if (req.file) {
        const result = await streamUpload(req.file.buffer, "books");
        image_url = result.secure_url;
        image_public_id = result.public_id;
      }

      data.image_url = image_url;
      data.image_public_id = image_public_id;
      data.price = parseFloat(req.body.price);
      const book = new Book(data);
      console.log(book);

      // Gọi save() để trigger hook
      await book.save();

      return res.status(201).json({
        message: "Tạo sách thành công",
        data: book,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        message: "Tạo sách thất bại",
      });
    }
  }
  // [PUT] /api/cms/books/update/:id
  async update(req, res) {
    try {
      const { id } = req.params;
      const user = await User.findById(req.user.id).populate("role publisher");
      if (!user) {
        return res.status(404).json({ message: "Không tìm người dùng" });
      }
      console.log(user);

      // Lấy sách cần sửa
      const book = await Book.findById(id);
      if (!book) {
        return res.status(404).json({ message: "Không tìm thấy sách" });
      }

      // Nếu là publisher thì chỉ được sửa sách của mình
      if (!BookPolicy.canUpdate(user, book)) {
        return res
          .status(403)
          .json({ message: "Bạn không có quyền sửa sách này" });
      }
      // Cập nhật các trường cho phép
      Object.assign(book, req.validated);

      // Gọi save() để trigger hook pre('save') nếu có
      await book.save();

      return res.status(200).json({
        message: "Cập nhật sách thành công",
        data: book,
      });
    } catch (err) {
      console.error("[ERROR] Update Book:", err);
      return res.status(500).json({
        message: "Cập nhật sách thất bại",
        error: err.message,
      });
    }
  }
  // [DELETE] /api/cms/books/soft-delete
  async softDeleteByIds(req, res) {
    const { ids } = req.body;
    const user = await User.findById(req.user.id).populate("role publisher");
    if (!user) {
      return res.status(404).json({ message: "Không tìm người dùng" });
    }
    const books = await Book.find({ _id: { $in: ids } });
    if (!BookPolicy.canDelete(user, books)) {
      return res
        .status(403)
        .json({ message: "Bạn không có quyền xoá sách của NXB khác !!!" });
    }
    await Promise.all(books.map((book) => book.delete()));
    return res.status(200).json("Xoá mềm thành công !!!");
  }

  // [DELETE] /api/cms/books/force-delete
  async forceDelete(req, res) {
    const { ids } = req.body;
    const user = await User.findById(req.user.id).populate("role publisher");
    if (!user) {
      return res.status(404).json({ message: "Không tìm người dùng" });
    }
    const books = await Book.find({ _id: { $in: ids } });
    if (!BookPolicy.canDelete(user, books)) {
      return res
        .status(403)
        .json({ message: "Bạn không có quyền xoá sách của NXB khác !!!" });
    }
    await Promise.all(books.map((book) => book.deleteOne()));
    return res.status(200).json("Xoá thành công !!!");
  }

  // [DELETE] /api/cms/books/soft-delete
  async restoreByIds(req, res) {
    const { ids } = req.body;
    const user = await User.findById(req.user.id).populate("role publisher");
    if (!user) {
      return res.status(404).json({ message: "Không tìm người dùng" });
    }
    const books = await Book.findWithDeleted({
      _id: { $in: ids },
      deleted: true,
    });

    if (books.length === 0) {
      return res.status(404).json({
        message: "Chưa có sách nào bị xoá",
      });
    }

    if (!BookPolicy.canDelete(user, books)) {
      return res
        .status(403)
        .json({ message: "Bạn không có quyền xoá sách của NXB khác !!!" });
    }
    await Promise.all(books.map((book) => book.restore()));
    return res.status(200).json("Khôi phục thành công !!!");
  }
}
export default new BookControllerV2();
