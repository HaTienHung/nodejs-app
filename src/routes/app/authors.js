import express from "express";
import AuthorController from "../../app/controllers/APP/AuthorController.js";

const router = express.Router();

router.get("/", AuthorController.index);

export default router;
