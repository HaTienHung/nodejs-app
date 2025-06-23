import express from "express";
import validate from "../../validators/validate.js";
import autoPickValidated from "../../validators/autoPickValidated.js";
import { verifyAccessToken } from "../../app/middleware/authenticate.js";
import { roleMiddleware } from "../../app/middleware/role.js";
import {
  addToCartValidator,
  bookIdValidator,
  removeCartValidator,
  updateCartValidator,
} from "../../validators/cart.validator.js";
import { ROLE_NAME } from "../../constants/role.js";
import CartController from "../../app/controllers/APP/CartController.js";

const router = express.Router();

router.post(
  "/add-to-cart",
  verifyAccessToken,
  roleMiddleware(`${ROLE_NAME.USER}`),
  addToCartValidator,
  bookIdValidator,
  validate,
  autoPickValidated(),
  CartController.addToCart
);

router.post(
  "/remove-items",
  verifyAccessToken,
  roleMiddleware(`${ROLE_NAME.USER}`),
  removeCartValidator,
  validate,
  autoPickValidated(),
  CartController.removeCartItems
);

router.put(
  "/:id/update-item",
  verifyAccessToken,
  roleMiddleware(`${ROLE_NAME.USER}`),
  updateCartValidator,
  validate,
  autoPickValidated(),
  CartController.updateCartItem
);

router.get(
  "/",
  verifyAccessToken,
  roleMiddleware(`${ROLE_NAME.USER}`),
  CartController.show
);

router.post(
  "/check-out",
  verifyAccessToken,
  roleMiddleware(`${ROLE_NAME.USER}`),
  CartController.checkout
);

export default router;
