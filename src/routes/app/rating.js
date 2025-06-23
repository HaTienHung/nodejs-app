import express from "express";
import validate from "../../validators/validate.js";
import autoPickValidated from "../../validators/autoPickValidated.js";
import { verifyAccessToken } from "../../app/middleware/authenticate.js";
import { roleMiddleware } from "../../app/middleware/role.js";
import { ROLE_NAME } from "../../constants/role.js";
import {
  ratingValidator,
  bookIdValidator,
} from "../../validators/rating.validator.js";
import RatingController from "../../app/controllers/APP/RatingController.js";

const router = express.Router();

router.post(
  "/",
  verifyAccessToken,
  roleMiddleware(`${ROLE_NAME.USER}`),
  ratingValidator,
  bookIdValidator,
  validate,
  autoPickValidated(),
  RatingController.addOrUpdateRating
);

export default router;
