import express from "express";
import validate from "../../validators/validate.js";
import autoPickValidated from "../../validators/autoPickValidated.js";
import { verifyAccessToken } from "../../app/middleware/authenticate.js";
import { roleMiddleware } from "../../app/middleware/role.js";
import { ROLE_NAME } from "../../constants/role.js";
import {
  exportValidator,
  importValidator,
} from "../../validators/inventory.validator.js";
import InventoryController from "../../app/controllers/CMS/InventoryController.js";
import checkAvailableStock from "../../helpers/checkAvailableStock.helper.js";

const router = express.Router();

router.get(
  "/show/:id",
  verifyAccessToken,
  roleMiddleware(`${ROLE_NAME.ADMIN}|${ROLE_NAME.PUBLISHER}`),
  InventoryController.getInventoryHistory
);

router.post(
  "/import",
  verifyAccessToken,
  roleMiddleware(`${ROLE_NAME.ADMIN}|${ROLE_NAME.PUBLISHER}`),
  importValidator,
  validate,
  autoPickValidated(),
  InventoryController.import
);

router.post(
  "/export",
  verifyAccessToken,
  roleMiddleware(`${ROLE_NAME.ADMIN}|${ROLE_NAME.PUBLISHER}`),
  exportValidator,
  validate,
  autoPickValidated(),
  InventoryController.export
);

router.get(
  "/stock-report",
  verifyAccessToken,
  roleMiddleware(`${ROLE_NAME.ADMIN}|${ROLE_NAME.PUBLISHER}`),
  InventoryController.getStockReport
);

router.get("/test-stock/:bookId", async (req, res) => {
  try {
    const book_id = req.params.bookId;
    const stock = await checkAvailableStock(book_id);

    if (!stock) {
      return res.status(404).json({ message: "Không tìm thấy tồn kho" });
    }

    return res.json({
      message: "Tồn kho hiện tại",
      stock,
    });
  } catch (err) {
    return res.status(500).json({ message: "Lỗi server", error: err.message });
  }
});

export default router;
