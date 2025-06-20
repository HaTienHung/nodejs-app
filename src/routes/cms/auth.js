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

const router = express.Router();

router.post(
  "/login",
  loginValidator,
  validate,
  autoPickValidated(),
  AuthControllerV2.login
);

router.get(
  "/me",
  verifyAccessToken,
  roleMiddleware(`${ROLE_NAME.ADMIN}|${ROLE_NAME.PUBLISHER}`),
  AuthControllerV2.me
);

router.post(
  "/refresh-token",
  verifyRefreshToken,
  roleMiddleware(`${ROLE_NAME.ADMIN}|${ROLE_NAME.PUBLISHER}`),
  AuthControllerV2.refreshToken
);

router.post(
  "/change-password",
  verifyAccessToken,
  roleMiddleware(`${ROLE_NAME.ADMIN}|${ROLE_NAME.PUBLISHER}`),
  changePasswordValidator,
  validate,
  autoPickValidated(),
  AuthControllerV2.changePassword
);

router.get(
  "/user-list",
  verifyAccessToken,
  roleMiddleware(ROLE_NAME.ADMIN, ROLE_NAME.PUBLISHER),
  AuthControllerV2.index
);

export default router;
