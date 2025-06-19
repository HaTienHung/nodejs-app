import { ROLE_NAME } from "../../../constants/role.js";
import getTokenFromHeader from "../../../helpers/auth.helper.js";
import Book from "../../models/Book.js";
import User from "../../models/User.js";
import Publisher from "../../models/Publisher.js";
import jwt from "jsonwebtoken";

class BookControllerV2 {
  // [GET] /api/cms/books
  async index(req, res) {
    try {
      const token = getTokenFromHeader(req, res);
      if (!token) return;

      const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

      let books;

      const user = await User.findOne({ _id: payload.id }).populate(
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
