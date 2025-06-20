import express from "express";
import validate from "../../validators/validate.js";
import autoPickValidated from "../../validators/autoPickValidated.js";
import {
  changePasswordValidator,
  loginValidator,
  registerValidator,
} from "../../validators/auth.validator.js";
import AuthController from "../../app/controllers/APP/AuthController.js";
import {
  verifyAccessToken,
  verifyRefreshToken,
} from "../../app/middleware/authenticate.js";
import { roleMiddleware } from "../../app/middleware/role.js";
import { ROLE_NAME } from "../../constants/role.js";

const router = express.Router();

router.post(
  "/login",
  loginValidator,
  validate,
  autoPickValidated(),
  AuthController.login
);

router.get(
  "/me",
  verifyAccessToken,
  roleMiddleware(ROLE_NAME.USER),
  AuthController.me
);

router.post(
  "/refresh-token",
  verifyRefreshToken,
  roleMiddleware(ROLE_NAME.USER),
  AuthController.refreshToken
);

router.post(
  "/register",
  registerValidator,
  validate,
  autoPickValidated(),
  AuthController.register
);

router.post(
  "/change-password",
  verifyAccessToken,
  roleMiddleware(ROLE_NAME.USER),
  changePasswordValidator,
  validate,
  autoPickValidated(),
  AuthController.register
);

export default router;
