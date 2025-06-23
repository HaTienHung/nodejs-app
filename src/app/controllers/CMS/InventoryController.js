import mongoose from "mongoose";
import Book from "../../models/Book.js";
import User from "../../models/User.js";
import { BookPolicy } from "../../../policies/book.policy.js";
import { ImportPolicy } from "../../../policies/import.policy.js";
import Import from "../../models/Import.js";
import Export from "../../models/Export.js";
import Inventory from "../../models/Inventory.js";
import { ROLE_NAME } from "../../../constants/role.js";

class InventoryController {
  // [POST] /api/cms/inventories/import
  async import(req, res) {
    try {
      const user = await User.findById(req.user.id).populate("publisher role");

      const book = await Book.findById(req.body.book_id);

      if (!ImportPolicy.canImport(user, book)) {
        throw new Error("Bạn không có quyền thêm sách thuộc về NXB khác !!!");
      }

      // Tạo bản ghi nhập
      const importRecord = await Import.create(req.body);

      // Cập nhật tồn kho
      await Inventory.findOneAndUpdate(
        { book_id: req.body.book_id },
        { $inc: { currentStock: req.body.quantity } },
        { new: true, upsert: true }
      );

      res.status(201).json({
        message: "Thêm vào kho thành công",
        data: importRecord,
      });
    } catch (err) {
      res.status(500).json({
        message: err.message || "Import thất bại",
      });
    }
  }

  // [POST] /api/cms/inventories/export
  async export(req, res) {
    try {
      const user = await User.findById(req.user.id).populate("publisher role");
      const book = await Book.findById(req.body.book_id);

      if (!ImportPolicy.canImport(user, book)) {
        throw new Error("Bạn không có quyền xuất sách thuộc về NXB khác !!!");
      }

      const inventory = await Inventory.findOne({
        book_id: req.body.book_id,
      });

      if (!inventory || inventory.currentStock < req.body.quantity) {
        throw new Error("Không đủ tồn kho để xuất");
      }

      // Ghi lại bản ghi xuất kho
      const exportRecord = await Export.create(req.body);

      // Giảm tồn kho
      await Inventory.findOneAndUpdate(
        { book_id: req.body.book_id },
        { $inc: { currentStock: -req.body.quantity } },
        { new: true }
      );

      res.status(201).json({
        message: "Xuất kho thành công",
        data: exportRecord,
      });
    } catch (err) {
      res.status(500).json({ message: err.message || "Xuất kho thất bại" });
    }
  }

  // [PUT] /api/cms/books/inventories/stock-report
  async getStockReport(req, res) {
    try {
      const user = await User.findById({ _id: req.user.id }).populate(
        "publisher role"
      );
      let stockReport;
      if (user.role?.name === ROLE_NAME.PUBLISHER) {
        const books = await Book.find({
          publisher_id: user.publisher._id,
        })
          .select("_id")
          .lean();
        const bookIds = books.map((book) => book._id);

        stockReport = await Inventory.find({ book_id: { $in: bookIds } });
      }
      stockReport = await Inventory.find();
      res.json({ message: "Báo cáo tồn kho", data: stockReport });
    } catch (err) {
      console.error("Lỗi khi lấy dữ liệu:", err);
      return res.status(500).json({
        message: "Lỗi từ server",
        error: err.message,
      });
    }
  }

  // [GET] /api/cms/inventories/show/:id
  async getInventoryHistory(req, res) {
    try {
      const { id } = req.params;
      const user = await User.findById({ _id: req.user.id }).populate(
        "publisher role"
      );
      if (!user) {
        return res.status(404).json({ message: "Không tìm người dùng" });
      }
      const [imports, exports] = await Promise.all([
        Import.find({ book_id: id }).lean(),
        Export.find({ book_id: id }).lean(),
      ]);
      const history = [
        ...imports.map((item) => ({ ...item, type: "import" })),
        ...exports.map((item) => ({ ...item, type: "export" })),
      ];

      history.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      return res.json({
        message: "Lịch sử nhập/xuất",
        data: history,
      });
    } catch (error) {
      res.status(500).json("Lỗi từ server");
    }
  }

  // [DELETE] /api/cms/books/force-delete
  async forceDelete(req, res) {
    const { ids } = req.body;
    const user = await User.findById(req.user.id).populate("role publisher");
    if (!user) {
      return res.status(404).json({ message: "Không tìm người dùng" });
    }
    const books = await Book.find({ _id: { $in: ids } });
    if (!BookPolicy.canDelete(user, books)) {
      return res
        .status(403)
        .json({ message: "Bạn không có quyền xoá sách của NXB khác !!!" });
    }
    await Promise.all(books.map((book) => book.deleteOne()));
    return res.status(200).json("Xoá thành công !!!");
  }

  // [DELETE] /api/cms/books/soft-delete
  async restoreByIds(req, res) {
    const { ids } = req.body;
    const user = await User.findById(req.user.id).populate("role publisher");
    if (!user) {
      return res.status(404).json({ message: "Không tìm người dùng" });
    }
    const books = await Book.findWithDeleted({
      _id: { $in: ids },
      deleted: true,
    });

    if (books.length === 0) {
      return res.status(404).json({
        message: "Chưa có sách nào bị xoá",
      });
    }

    if (!BookPolicy.canDelete(user, books)) {
      return res
        .status(403)
        .json({ message: "Bạn không có quyền xoá sách của NXB khác !!!" });
    }
    await Promise.all(books.map((book) => book.restore()));
    return res.status(200).json("Khôi phục thành công !!!");
  }
}
export default new InventoryController();
