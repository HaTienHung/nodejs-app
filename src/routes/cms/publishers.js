import express from "express";
import validate from "../../validators/validate.js";
import autoPickValidated from "../../validators/autoPickValidated.js";
import { verifyAccessToken } from "../../app/middleware/authenticate.js";
import { roleMiddleware } from "../../app/middleware/role.js";
import { ROLE_NAME } from "../../constants/role.js";
import PublisherControllerV2 from "../../app/controllers/CMS/PublisherControllerV2.js";
import {
  // publisherIdValidator,
  createPublisherValidator,
  updatePublisherValidator,
} from "../../validators/publisher.validator.js";

const router = express.Router();

router.put(
  "/update/:id",
  verifyAccessToken,
  roleMiddleware(`${ROLE_NAME.ADMIN}`),
  updatePublisherValidator,
  validate,
  autoPickValidated(),
  PublisherControllerV2.update
);

router.get(
  "/",
  verifyAccessToken,
  roleMiddleware(`${ROLE_NAME.ADMIN}`),
  PublisherControllerV2.index
);

router.post(
  "/store",
  verifyAccessToken,
  roleMiddleware(`${ROLE_NAME.ADMIN}`),
  createPublisherValidator,
  validate,
  autoPickValidated(),
  PublisherControllerV2.store
);

router.put(
  "/:id/disable",
  verifyAccessToken,
  roleMiddleware(`${ROLE_NAME.ADMIN}`),
  validate,
  autoPickValidated(),
  PublisherControllerV2.disablePublisher
);

router.put(
  "/:id/enable",
  verifyAccessToken,
  roleMiddleware(`${ROLE_NAME.ADMIN}`),
  validate,
  autoPickValidated(),
  PublisherControllerV2.enalbePublisher
);

export default router;
