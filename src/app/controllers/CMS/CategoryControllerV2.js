import Category from "../../models/Category.js";

class CategoryControllerV2 {
  // [GET] /api/cms/categories
  async index(req, res) {
    try {
      const categories = await applyQuery(Category.find(), req.query, {
        searchFields: ["name"],
        sortableFields: ["createdAt", "name"],
      });
      return res.json(categories);
    } catch (err) {
      res.json("Failed");
    }
  }
  // [POST] /api/cms/categories/store
  async store(req, res) {
    try {
      const category = new Category(req.validated);
      // console.log(book);

      // Gọi save() để trigger hook
      await category.save();

      return res.status(201).json({
        message: "Tạo danh mục thành công",
        data: category,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        message: "Tạo sách thất bại",
      });
    }
  }
  // [PUT] /api/cms/categories/update/:id
  async update(req, res) {
    try {
      const { id } = req.params;
      // Lấy sách cần sửa
      const category = await Category.findById(id);
      if (!category) {
        return res.status(404).json({ message: "Không tìm thấy danh mục" });
      }

      Object.assign(category, req.validated);

      // Gọi save() để trigger hook pre('save') nếu có
      await category.save();

      return res.status(200).json({
        message: "Cập nhật danh mục thành công",
        data: category,
      });
    } catch (err) {
      // console.error("[ERROR] Update Book:", err);
      return res.status(500).json({
        message: "Cập nhật danh mục thất bại",
        error: err.message,
      });
    }
  }
  // [DELETE] /api/cms/categories/soft-delete
  async softDeleteByIds(req, res) {
    const { ids } = req.body;
    const categories = await Category.find({ _id: { $in: ids } });

    await Promise.all(categories.map((category) => category.delete()));
    return res.status(200).json("Xoá mềm thành công !!!");
  }

  // [DELETE] /api/cms/categories/force-delete
  async forceDelete(req, res) {
    const { ids } = req.body;
    const categories = await Category.find({ _id: { $in: ids } });
    await Promise.all(categories.map((category) => category.deleteOne()));
    return res.status(200).json("Xoá thành công !!!");
  }

  // [DELETE] /api/cms/categories/soft-delete
  async restoreByIds(req, res) {
    const { ids } = req.body;

    const categories = await Category.findWithDeleted({
      _id: { $in: ids },
      deleted: true,
    });

    if (categories.length === 0) {
      return res.status(404).json({
        message: "Chưa có sách nào bị xoá",
      });
    }

    await Promise.all(categories.map((category) => category.restore()));
    return res.status(200).json("Khôi phục thành công !!!");
  }
}
export default new CategoryControllerV2();
