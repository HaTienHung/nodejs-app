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
import { roleMiddleware } from "../../app/middleware/role.middleware.js";
import { ROLE_NAME } from "../../constants/role.js";
import BookControllerV2 from "../../app/controllers/CMS/BookControllerV2.js";

const router = express.Router();

router.get(
  "/",
  verifyAccessToken,
  roleMiddleware(`${ROLE_NAME.ADMIN}|${ROLE_NAME.PUBLISHER}`),
  BookControllerV2.index
);

export default router;
