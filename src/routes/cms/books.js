import express from "express";
import validate from "../../validators/validate.js";
import autoPickValidated from "../../validators/autoPickValidated.js";
import {
  loginValidator,
  changePasswordValidator,
} from "../../validators/auth.validator.js";
import {
  verifyAccessToken,
  verifyRefreshToken,
} from "../../app/middleware/authenticate.js";
import AuthControllerV2 from "../../app/controllers/CMS/AuthControllerV2.js";
import { roleMiddleware } from "../../app/middleware/role.js";
import { ROLE_NAME } from "../../constants/role.js";
import BookControllerV2 from "../../app/controllers/CMS/BookControllerV2.js";
import {
  createBookValidator,
  bookIdValidator,
  updateBookValidator,
} from "../../validators/book.validator.js";
import upload from "../../app/middleware/uploadMemory.js";

const router = express.Router();

router.put(
  "/update/:id",
  verifyAccessToken,
  roleMiddleware(`${ROLE_NAME.ADMIN}|${ROLE_NAME.PUBLISHER}`),
  upload.single("image"),
  updateBookValidator,
  validate,
  autoPickValidated(),
  BookControllerV2.update
);

router.get(
  "/",
  verifyAccessToken,
  roleMiddleware(`${ROLE_NAME.ADMIN}|${ROLE_NAME.PUBLISHER}`),
  BookControllerV2.index
);

router.post(
  "/store",
  verifyAccessToken,
  roleMiddleware(`${ROLE_NAME.ADMIN}|${ROLE_NAME.PUBLISHER}`),
  upload.single("image"),
  createBookValidator,
  validate,
  autoPickValidated(),
  BookControllerV2.store
);

router.delete(
  "/soft-delete",
  verifyAccessToken,
  roleMiddleware(`${ROLE_NAME.ADMIN}|${ROLE_NAME.PUBLISHER}`),
  bookIdValidator,
  validate,
  autoPickValidated(),
  BookControllerV2.softDeleteByIds
);

router.delete(
  "/force-delete",
  verifyAccessToken,
  roleMiddleware(`${ROLE_NAME.ADMIN}|${ROLE_NAME.PUBLISHER}`),
  bookIdValidator,
  validate,
  autoPickValidated(),
  BookControllerV2.forceDelete
);

router.post(
  "/restore",
  verifyAccessToken,
  roleMiddleware(`${ROLE_NAME.ADMIN}|${ROLE_NAME.PUBLISHER}`),
  bookIdValidator,
  validate,
  autoPickValidated(),
  BookControllerV2.restoreByIds
);

export default router;
