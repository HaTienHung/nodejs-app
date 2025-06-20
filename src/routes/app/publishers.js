import express from "express";
import PublisherController from "../../app/controllers/APP/PublisherController.js";

const router = express.Router();

router.get("/", PublisherController.index);

export default router;
