import { body } from "express-validator";

export const loginValidator = [
  body("email").isEmail().withMessage("Email không hợp lệ"),
  body("password").notEmpty().withMessage("Mật khẩu là bắt buộc"),
];

export const changePasswordValidator = [
  body("oldPassword").notEmpty().withMessage("Mật khẩu cũ là bắt buộc"),
  body("newPassword").notEmpty().withMessage("Mật khẩu mới là bắt buộc"),
  body("confirmPassword")
    .notEmpty()
    .withMessage("Xác nhận mật khẩu là bắt buộc"),
];

export const registerValidator = [
  body("name")
    .notEmpty()
    .withMessage("Tên là bắt buộc")
    .isLength({ min: 2 })
    .withMessage("Tên phải có ít nhất 2 ký tự"),

  body("email")
    .notEmpty()
    .withMessage("Email là bắt buộc")
    .isEmail()
    .withMessage("Email phải hợp lệ"),

  body("phone_number")
    .notEmpty()
    .withMessage("Số điện thoại là bắt buộc")
    .matches(/^(0|\+84)[0-9]{9}$/)
    .withMessage("Số điện thoại phải hợp lệ"),

  body("password")
    .notEmpty()
    .withMessage("Mật khẩu là bắt buộc")
    .isLength({ min: 6 })
    .withMessage("Mật khẩu phải có ít nhất 6 ký tự"),

  body("age")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Tuổi phải là số không âm"),

  body("address")
    .optional()
    .isString()
    .withMessage("Địa chỉ phải là chuỗi")
    .isLength({ min: 5 })
    .withMessage("Địa chỉ phải có ít nhất 5 ký tự"),
];
