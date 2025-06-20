import express from "express";
import validate from "../../validators/validate.js";
import autoPickValidated from "../../validators/autoPickValidated.js";
import { verifyAccessToken } from "../../app/middleware/authenticate.js";
import { roleMiddleware } from "../../app/middleware/role.js";
import { ROLE_NAME } from "../../constants/role.js";
import AuthorControllerV2 from "../../app/controllers/CMS/AuthorControllerV2.js";
import {
  authorIdValidator,
  createAuthorValidator,
  updateAuthorValidator,
} from "../../validators/author.validator.js";

const router = express.Router();

router.put(
  "/update/:id",
  verifyAccessToken,
  roleMiddleware(`${ROLE_NAME.ADMIN}`),
  updateAuthorValidator,
  validate,
  autoPickValidated(),
  AuthorControllerV2.update
);

router.get(
  "/",
  verifyAccessToken,
  roleMiddleware(`${ROLE_NAME.ADMIN}`),
  AuthorControllerV2.index
);

router.post(
  "/store",
  verifyAccessToken,
  roleMiddleware(`${ROLE_NAME.ADMIN}`),
  createAuthorValidator,
  validate,
  autoPickValidated(),
  AuthorControllerV2.store
);

router.delete(
  "/soft-delete",
  verifyAccessToken,
  roleMiddleware(`${ROLE_NAME.ADMIN}|${ROLE_NAME.PUBLISHER}`),
  authorIdValidator,
  validate,
  autoPickValidated(),
  AuthorControllerV2.softDeleteByIds
);

router.delete(
  "/force-delete",
  verifyAccessToken,
  roleMiddleware(`${ROLE_NAME.ADMIN}|${ROLE_NAME.PUBLISHER}`),
  authorIdValidator,
  validate,
  autoPickValidated(),
  AuthorControllerV2.forceDelete
);

router.post(
  "/restore",
  verifyAccessToken,
  roleMiddleware(`${ROLE_NAME.ADMIN}|${ROLE_NAME.PUBLISHER}`),
  authorIdValidator,
  validate,
  autoPickValidated(),
  AuthorControllerV2.restoreByIds
);

export default router;
