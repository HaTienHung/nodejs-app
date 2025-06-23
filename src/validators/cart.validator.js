import { body } from "express-validator";
import Book from "../app/models/Book.js";
import mongoose from "mongoose";

export const addToCartValidator = [
  body("book_id").notEmpty().withMessage("Id của sách không được để trống"),
  body("quantity")
    .notEmpty()
    .withMessage("Số lượng là bắt buộc")
    .isInt({ min: 1 })
    .withMessage("Số lượng ít nhất là 1"),
];
export const updateCartValidator = [
  body("quantity")
    .notEmpty()
    .withMessage("Số lượng là bắt buộc")
    .isInt({ min: 1 })
    .withMessage("Số lượng ít nhất là 1"),
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

export const removeCartValidator = [
  body("ids")
    .notEmpty()
    .withMessage("ids là bắt buộc")
    .isArray({ min: 1, max: 50 }) // Giới hạn max 50 items
    .withMessage("ids phải là array từ 1-50 phần tử")
    .custom((ids) => {
      // Chỉ validate format, business logic để controller handle
      const invalidIds = ids.filter(
        (id) => !mongoose.Types.ObjectId.isValid(id)
      );
      if (invalidIds.length > 0) {
        throw new Error(`ID không hợp lệ: ${invalidIds.join(", ")}`);
      }
      return true;
    }),
];
