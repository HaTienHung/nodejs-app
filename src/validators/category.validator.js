import { body } from "express-validator";
import Category from "../app/models/Category.js";

export const createCategoryValidator = [
  body("name")
    .notEmpty()
    .withMessage("Tên danh mục là bắt buộc")
    .isLength({ min: 3 })
    .withMessage("Tên danh mục phải có ít nhất 3 ký tự"),
];
export const updateCategoryValidator = [
  body("name")
    .optional()
    .isLength({ min: 3 })
    .withMessage("Tiêu đề phải có ít nhất 3 ký tự"),

  body("slug")
    .notEmpty()
    .isLength({ min: 3 })
    .withMessage("Slug phải có ít nhất 3 ký tự"),
];

export const categoryIdValidator = [
  body("ids")
    .notEmpty()
    .withMessage("ids là bắt buộc")
    .bail()
    .custom(async (ids) => {
      const categories = await Category.findWithDeleted({ _id: { $in: ids } });
      if (categories.length !== ids.length) {
        throw new Error("Không tồn tại danh mục dựa trên ID");
      }
      return true;
    }),
];
