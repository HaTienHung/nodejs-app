import { body } from "express-validator";
import Author from "../app/models/Author.js";

export const createAuthorValidator = [
  body("name")
    .notEmpty()
    .withMessage("Tên tác giả là bắt buộc")
    .isLength({ min: 3 })
    .withMessage("Tên tác giả phải có ít nhất 3 ký tự"),

  body("bio").optional(),

  body("dob").optional(),
];

export const updateAuthorValidator = [
  body("name")
    .optional()
    .isLength({ min: 3 })
    .withMessage("Tên tác giả phải có ít nhất 3 ký tự"),

  body("bio").optional(),

  body("dob").optional(),
];

export const authorIdValidator = [
  body("ids")
    .notEmpty()
    .withMessage("ids là bắt buộc")
    .bail()
    .custom(async (ids) => {
      const authors = await Author.findWithDeleted({ _id: { $in: ids } });
      if (authors.length !== ids.length) {
        throw new Error("Không tồn tại author dựa trên ID");
      }
      return true;
    }),
];
