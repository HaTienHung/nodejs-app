import { body } from "express-validator";
import { ORDER_STATUS } from "../constants/status.js";

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

export const updateOrderStatusValidator = [
  body("status")
    .notEmpty()
    .withMessage("Trạng thái là bắt buộc")
    .isIn(Object.values(ORDER_STATUS))
    .withMessage(
      `Trạng thái phải là một trong: ${Object.values(ORDER_STATUS).join(", ")}`
    ),
];
