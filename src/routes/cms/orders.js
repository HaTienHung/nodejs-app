import { roleMiddleware } from "../../app/middleware/role.js";
import { ROLE_NAME } from "../../constants/role.js";
import OrderControllerV2 from "../../app/controllers/CMS/OrderControllerV2.js";
import { updateOrderStatusValidator } from "../../validators/order.validator.js";
import express from "express";
import validate from "../../validators/validate.js";
import autoPickValidated from "../../validators/autoPickValidated.js";
import { verifyAccessToken } from "../../app/middleware/authenticate.js";
const router = express.Router();

router.get(
  "/all",
  verifyAccessToken,
  roleMiddleware(`${ROLE_NAME.ADMIN}`),
  OrderControllerV2.index
);

router.put(
  "/update/:id",
  verifyAccessToken,
  roleMiddleware(`${ROLE_NAME.ADMIN}`),
  updateOrderStatusValidator,
  validate,
  autoPickValidated(),
  OrderControllerV2.updateStatus
);

export default router;
