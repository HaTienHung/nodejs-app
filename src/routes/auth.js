import express from "express";
import UserController from "../app/controllers/UserController.js";
import validate from "../validators/validate.js";
import autoPickValidated from "../validators/autoPickValidated.js";
import { loginValidator } from "../validators/login.validator.js";
import AuthController from "../app/controllers/AuthController.js";
import {
  verifyAccessToken,
  verifyRefreshToken,
} from "../app/middleware/authenticate.js";

const router = express.Router();

router.post(
  "/login",
  loginValidator,
  validate,
  autoPickValidated(),
  AuthController.login
);

// router.post("/refresh-token", verifyRefreshToken, AuthController.refreshToken);

export default router;
