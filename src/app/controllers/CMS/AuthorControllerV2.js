import { applyQuery } from "../../../helpers/applyQuery.helper.js";
import Author from "../../models/Author.js";

class AuthorControllerV2 {
  // [GET] /api/cms/authors
  async index(req, res) {
    try {
      const authors = await applyQuery(
        Author.find({}).select("-_id"),
        req.query,
        {
          searchFields: ["name", "email"],
          sortableFields: ["createdAt", "name"],
        }
      );
      res.json(authors);
    } catch (err) {
      console.error(" Lỗi truy vấn Mongoose:", err);
      res.status(500).json({ message: "Lỗi truy vấn", error: err.message });
    }
  }
  // [POST] /api/cms/authors/store
  async store(req, res) {
    try {
      const author = new Author(req.validated);

      await author.save();

      return res.status(201).json({
        message: "Tạo tác giả thành công",
        data: author,
      });
    } catch (err) {
      console.error(" Lỗi truy vấn Mongoose:", err);
      res.status(500).json({ message: "Lỗi truy vấn", error: err.message });
    }
  }
  // [PUT] /api/cms/authors/update/:id
  async update(req, res) {
    try {
      const author = await Author.findById(req.params.id);
      if (!author)
        return res.status(404).json({ message: "Không tìm thấy NXB" });

      Object.assign(author, req.validated);

      await author.save();

      return res.status(201).json({
        message: "Cập nhật nhà xuất bản thành công",
        data: author,
      });
    } catch (err) {
      console.error(" Lỗi truy vấn Mongoose:", err);
      res.status(500).json({ message: "Lỗi truy vấn", error: err.message });
    }
  }
  // [DELETE] /api/cms/authors/soft-delete
  async softDeleteByIds(req, res) {
    const { ids } = req.body;

    const authors = await Author.find({ _id: { $in: ids } });

    await Promise.all(authors.map((author) => author.delete()));

    return res.status(200).json("Xoá mềm tác giả thành công !!!");
  }

  // [DELETE] /api/cms/authors/force-delete
  async forceDelete(req, res) {
    const { ids } = req.body;

    const authors = await Author.find({ _id: { $in: ids } });

    await Promise.all(authors.map((author) => author.deleteOne()));
    return res.status(200).json("Xoá tác giả thành công !!!");
  }

  // [DELETE] /api/cms/authors/soft-delete
  async restoreByIds(req, res) {
    const { ids } = req.body;

    const authors = await Author.findWithDeleted({
      _id: { $in: ids },
      deleted: true,
    });

    if (authors.length === 0) {
      return res.status(404).json({
        message: "Chưa có tác giả nào bị xoá",
      });
    }

    await Promise.all(authors.map((author) => author.restore()));
    return res.status(200).json("Khôi phục thành công !!!");
  }
}
export default new AuthorControllerV2();
