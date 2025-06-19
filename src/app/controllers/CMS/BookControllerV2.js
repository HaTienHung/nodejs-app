import { ROLE_NAME } from "../../../constants/role.js";
import verifyTokenFromHeader from "../../../helpers/auth.helper.js";
import Book from "../../models/Book.js";
import User from "../../models/User.js";
import Publisher from "../../models/Publisher.js";
import jwt from "jsonwebtoken";
import { TYPE } from "../../../constants/verifyType.js";

class BookControllerV2 {
  // [GET] /api/cms/books
  async index(req, res) {
    try {
      let books;

      const user = await User.findOne({ _id: req.user.id }).populate(
        "publisher"
      );

      if (user.publisher?.name === ROLE_NAME.PUBLISHER) {
        books = await Book.find({ publisher_id: user.publisher?.id });
      } else {
        books = await Book.findWithDeleted({});
      }
      return res.json(books);
    } catch (err) {
      res.json("Failed");
    }
  }
  // [GET] /api/cms/books
  async store(req, res) {
    try {
      let books;

      const user = await User.findOne({ _id: req.user.id }).populate(
        "publisher"
      );

      if (user.publisher?.name === ROLE_NAME.PUBLISHER) {
        books = await Book.find({ publisher_id: user.publisher?.id });
      } else {
        books = await Book.findWithDeleted({});
      }
      return res.json(books);
    } catch (err) {
      res.json("Failed");
    }
  }
}
export default new BookControllerV2();
