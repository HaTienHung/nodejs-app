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
import BookController from "../../app/controllers/APP/BookController.js";

const router = express.Router();

router.get("/collection/:slug", BookController.show);

router.get("/category/:slug", BookController.listBookByCategorySlug);

router.get("/", BookController.index);

export default router;
