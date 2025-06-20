import { body } from "express-validator";
import Publisher from "../app/models/Publisher.js";

export const createPublisherValidator = [
  body("name")
    .notEmpty()
    .withMessage("Tên nhà xuất bản là bắt buộc")
    .isLength({ min: 3 })
    .withMessage("Tên nhà xuất bản phải có ít nhất 3 ký tự"),

  body("email")
    .notEmpty()
    .withMessage("Email là bắt buộc")
    .isEmail()
    .withMessage("Email không hợp lệ"),

  body("address")
    .notEmpty()
    .withMessage("Địa chỉ là bắt buộc")
    .isLength({ min: 10 })
    .withMessage("Địa chỉ phải chứa ít nhất 10 kí tự"),

  body("phone_number")
    .notEmpty()
    .withMessage("Số điện thoại là bắt buộc")
    .isLength({ max: 10 })
    .withMessage("Số điện thoại không được vượt quá 10 kí tự"),

  body("bio").optional(),
];

export const updatePublisherValidator = [
  body("name")
    .optional()
    .isLength({ min: 3 })
    .withMessage("Tên nhà xuất bản phải có ít nhất 3 ký tự"),

  body("email").optional().isEmail().withMessage("Email không hợp lệ"),

  body("address")
    .optional()
    .isLength({ min: 10 })
    .withMessage("Địa chỉ phải chứa ít nhất 10 kí tự"),

  body("phone_number")
    .optional()
    .isLength({ max: 10 })
    .withMessage("Số điện thoại không được vượt quá 10 kí tự"),

  body("bio").optional(),
];

// export const publisherIdValidator = [
//   body("ids")
//     .notEmpty()
//     .withMessage("ids là bắt buộc")
//     .bail()
//     .custom(async (ids) => {
//       const publishers = await Publisher.find({ _id: { $in: ids } });
//       if (publishers.length !== ids.length) {
//         throw new Error("Không tồn tại publisher dựa trên ID");
//       }
//       return true;
//     }),
// ];
