import express from "express";
import validate from "../../validators/validate.js";
import autoPickValidated from "../../validators/autoPickValidated.js";
import { verifyAccessToken } from "../../app/middleware/authenticate.js";
import { roleMiddleware } from "../../app/middleware/role.js";
import { ROLE_NAME } from "../../constants/role.js";
import CategoryControllerV2 from "../../app/controllers/CMS/CategoryControllerV2.js";
import {
  categoryIdValidator,
  createCategoryValidator,
  updateCategoryValidator,
} from "../../validators/category.validator.js";

const router = express.Router();

router.put(
  "/update/:id",
  verifyAccessToken,
  roleMiddleware(`${ROLE_NAME.ADMIN}`),
  updateCategoryValidator,
  validate,
  autoPickValidated(),
  CategoryControllerV2.update
);

router.get(
  "/",
  verifyAccessToken,
  roleMiddleware(`${ROLE_NAME.ADMIN}`),
  CategoryControllerV2.index
);

router.post(
  "/store",
  verifyAccessToken,
  roleMiddleware(`${ROLE_NAME.ADMIN}`),
  createCategoryValidator,
  validate,
  autoPickValidated(),
  CategoryControllerV2.store
);

router.delete(
  "/soft-delete",
  verifyAccessToken,
  roleMiddleware(`${ROLE_NAME.ADMIN}`),
  categoryIdValidator,
  validate,
  autoPickValidated(),
  CategoryControllerV2.softDeleteByIds
);

router.delete(
  "/force-delete",
  verifyAccessToken,
  roleMiddleware(`${ROLE_NAME.ADMIN}`),
  categoryIdValidator,
  validate,
  autoPickValidated(),
  CategoryControllerV2.forceDelete
);

router.post(
  "/restore",
  verifyAccessToken,
  roleMiddleware(`${ROLE_NAME.ADMIN}`),
  categoryIdValidator,
  validate,
  autoPickValidated(),
  CategoryControllerV2.restoreByIds
);

export default router;
