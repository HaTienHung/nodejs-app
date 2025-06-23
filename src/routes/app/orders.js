import express from "express";
import { verifyAccessToken } from "../../app/middleware/authenticate.js";
import { roleMiddleware } from "../../app/middleware/role.js";
import { ROLE_NAME } from "../../constants/role.js";
import OrderController from "../../app/controllers/APP/OrderController.js";

const router = express.Router();

router.put(
  "/:id/cancel",
  verifyAccessToken,
  roleMiddleware(`${ROLE_NAME.USER}`),
  OrderController.cancelOrder
);

export default router;
