import Publisher from "../../models/Publisher.js";

class PublisherController {
  // [GET] /api/app/publisher
  async index(req, res) {
    try {
      const publishers = await Publisher.find({}).select(
        "name phone_number bio address email -_id"
      );
      res.json(publishers);
    } catch (err) {
      console.error(" Lỗi truy vấn Mongoose:", err);
      res.status(500).json({ message: "Lỗi truy vấn", error: err.message });
    }
  }
}
export default new PublisherController();
