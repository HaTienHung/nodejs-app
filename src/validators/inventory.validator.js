import { body } from "express-validator";
import Book from "../app/models/Book.js";

export const importValidator = [
  body("book_id").notEmpty().withMessage("Id của sách không được để trống"),
  body("quantity")
    .notEmpty()
    .withMessage("Số lượng là bắt buộc")
    .isInt({ min: 1, max: 999 })
    .withMessage("Số lượng phải là số từ 1 đến 999"),
];

export const exportValidator = [
  body("book_id").notEmpty().withMessage("Id của sách không được để trống"),
  body("quantity")
    .notEmpty()
    .withMessage("Số lượng là bắt buộc")
    .isInt({ min: 1, max: 1000 })
    .withMessage("Số lượng phải là số từ 1 đến 100"),
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
