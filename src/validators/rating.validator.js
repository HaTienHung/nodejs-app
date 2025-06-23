import { body } from "express-validator";
import Book from "../app/models/Book.js";

export const ratingValidator = [
  body("book_id").notEmpty().withMessage("Id của sách không được để trống"),
  body("rating")
    .notEmpty()
    .withMessage("Mật khẩu là bắt buộc")
    .isInt({ min: 1, max: 5 })
    .withMessage("Rating phải là số từ 1 đến 5"),
];

export const bookIdValidator = [
  body("book_id")
    .notEmpty()
    .withMessage("id là bắt buộc")
    .bail()
    .custom(async (id) => {
      const book = await Book.find({ _id: id });
      if (!book) {
        throw new Error("Không tồn tại book dựa trên ID");
      }
      return true;
    }),
];
