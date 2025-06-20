import Author from "../../models/Author.js";

class AuthorController {
  // [GET] /api/app/authors
  async index(req, res) {
    try {
      const authors = await Author.find({}).select("name bio dob -_id");
      res.json(authors);
    } catch (err) {
      console.error("Lỗi truy vấn Mongoose:", err);
      res.status(500).json({ message: "Lỗi truy vấn", error: err.message });
    }
  }
}
export default new AuthorController();
