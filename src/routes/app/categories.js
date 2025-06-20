import express from "express";
import CategoryController from "../../app/controllers/APP/CategoryController.js";

const router = express.Router();

router.get("/", CategoryController.index);

export default router;
