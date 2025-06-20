import Publisher from "../../models/Publisher.js";
import { applyQuery } from "../../../helpers/applyQuery.helper.js";

class PublisherController {
  // [GET] /api/app/publishers
  async index(req, res) {
    try {
      const publishers = await applyQuery(
        Publisher.find({}).select("-_id"),
        req.query,
        {
          searchFields: ["name", "email", "address"],
          sortableFields: ["createdAt", "name"],
        }
      );
      res.json(publishers);
    } catch (err) {
      console.error(" Lỗi truy vấn Mongoose:", err);
      res.status(500).json({ message: "Lỗi truy vấn", error: err.message });
    }
  }
  // [POST] /api/app/publishers/store
  async store(req, res) {
    try {
      const publisher = new Publisher(req.validated);

      await publisher.save();

      return res.status(201).json({
        message: "Tạo nhà xuất bản thành công",
        data: publisher,
      });
    } catch (err) {
      console.error(" Lỗi truy vấn Mongoose:", err);
      res.status(500).json({ message: "Lỗi truy vấn", error: err.message });
    }
  }
  // [PUT] /api/app/publishers/update/:id
  async update(req, res) {
    try {
      const publisher = await Publisher.findById(req.params.id);
      if (!publisher)
        return res.status(404).json({ message: "Không tìm thấy NXB" });

      Object.assign(publisher, req.validated);

      await publisher.save();

      return res.status(201).json({
        message: "Cập nhật nhà xuất bản thành công",
        data: publisher,
      });
    } catch (err) {
      console.error(" Lỗi truy vấn Mongoose:", err);
      res.status(500).json({ message: "Lỗi truy vấn", error: err.message });
    }
  }
  // [POST] /api/cms/publishers/:id/disable
  async disablePublisher(req, res) {
    try {
      const publisher = await Publisher.findById(req.params.id);
      if (!publisher)
        return res.status(404).json({ message: "Không tìm thấy NXB" });

      publisher.inactive_at = new Date();

      await publisher.save();

      return res.status(201).json({
        message: "Đã huỷ kích hoạt NXB thành công",
      });
    } catch (err) {
      console.error(" Lỗi truy vấn Mongoose:", err);
      res.status(500).json({ message: "Lỗi truy vấn", error: err.message });
    }
  }
  // [POST] /api/cms/publishers/:id/enable
  async enalbePublisher(req, res) {
    try {
      const publisher = await Publisher.findById(req.params.id);
      if (!publisher)
        return res.status(404).json({ message: "Không tìm thấy NXB" });

      publisher.inactive_at = null;

      await publisher.save();

      return res.status(201).json({
        message: "Kích hoạt NXB thành công",
      });
    } catch (err) {
      console.error(" Lỗi truy vấn Mongoose:", err);
      res.status(500).json({ message: "Lỗi truy vấn", error: err.message });
    }
  }
}
export default new PublisherController();
