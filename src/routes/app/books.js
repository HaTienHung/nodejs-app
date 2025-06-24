import express from "express";
import BookController from "../../app/controllers/APP/BookController.js";

const router = express.Router();

router.get("/collection/:slug", BookController.show);

router.get("/category/:slug", BookController.listBookByCategorySlug);

router.get("/", BookController.index);

export default router;
