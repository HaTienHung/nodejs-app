import { body } from "express-validator";

export const createOrderValidator = [
  body("items")
    .notEmpty()
    .withMessage("Danh sách sản phẩm không được để trống")
    .isArray()
    .withMessage("Danh sách sản phẩm phải là mảng"),

  body("shippingAddress")
    .notEmpty()
    .withMessage("Địa chỉ giao hàng không được để trống"),

  body("paymentMethod")
    .notEmpty()
    .withMessage("Phương thức thanh toán không được bỏ trống"),
];
