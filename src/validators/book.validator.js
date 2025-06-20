import { body } from "express-validator";
import Book from "../app/models/Book.js";

export const createBookValidator = [
  body("title")
    .notEmpty()
    .withMessage("Tiêu đề sách là bắt buộc")
    .isLength({ min: 3 })
    .withMessage("Tiêu đề sách phải có ít nhất 3 ký tự"),

  body("description")
    .notEmpty()
    .withMessage("Mô tả sách là bắt buộc")
    .isLength({ min: 10 })
    .withMessage("Mô tả sách phải có ít nhất 10 ký tự"),

  body("price")
    .notEmpty()
    .withMessage("Giá sách là bắt buộc")
    .isFloat({ min: 0 })
    .withMessage("Giá sách phải là số không âm"),

  body("status")
    .optional()
    .isIn(["draft", "published", "archived"])
    .withMessage("Trạng thái sách không hợp lệ"),

  body("publisher_id")
    .notEmpty()
    .withMessage("Nhà xuất bản là bắt buộc")
    .isMongoId()
    .withMessage("ID nhà xuất bản không hợp lệ"),

  body("author_id")
    .notEmpty()
    .withMessage("Tác giả là bắt buộc")
    .isMongoId()
    .withMessage("ID tác giả không hợp lệ"),

  body("category_id")
    .notEmpty()
    .withMessage("Danh mục là bắt buộc")
    .isMongoId()
    .withMessage("ID danh mục không hợp lệ"),
];
export const updateBookValidator = [
  body("title")
    .optional()
    .isLength({ min: 3 })
    .withMessage("Tiêu đề phải có ít nhất 3 ký tự"),

  body("description")
    .optional()
    .isLength({ min: 10 })
    .withMessage("Mô tả phải có ít nhất 10 ký tự"),

  body("price")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Giá phải là số không âm"),

  body("status")
    .optional()
    .isIn(["draft", "published", "archived"])
    .withMessage("Trạng thái không hợp lệ"),

  body("publisher_id")
    .optional()
    .isMongoId()
    .withMessage("ID nhà xuất bản không hợp lệ"),

  body("author_id")
    .optional()
    .isMongoId()
    .withMessage("ID tác giả không hợp lệ"),

  body("category_id")
    .optional()
    .isMongoId()
    .withMessage("ID danh mục không hợp lệ"),
];

export const bookIdValidator = [
  body("ids")
    .notEmpty()
    .withMessage("ids là bắt buộc")
    .bail()
    .custom(async (ids) => {
      const books = await Book.findWithDeleted({ _id: { $in: ids } });
      if (books.length !== ids.length) {
        throw new Error("Không tồn tại book dựa trên ID");
      }
      return true;
    }),
];
