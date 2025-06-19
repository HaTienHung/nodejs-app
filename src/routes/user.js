import express from "express";
import UserController from "../app/controllers/UserController.js";
import validate from "../validators/validate.js";
import autoPickValidated from "../validators/autoPickValidated.js";
import { createUserValidator } from "../validators/user.validator.js";
import validateObjectId from "../app/middleware/validateObjectId.js";
import User from "../app/models/User.js";

const router = express.Router();

router.post(
  "/store",
  createUserValidator,
  validate,
  autoPickValidated(),
  UserController.store
);

router.get("/", UserController.index);

router.put("/update/:id", validateObjectId(User), UserController.update);

router.delete("/delete/:id", validateObjectId(User), UserController.delete);

router.post("/restore/:id", validateObjectId(User), UserController.restore);

export default router;
