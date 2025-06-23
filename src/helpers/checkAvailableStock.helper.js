import Inventory from "../app/models/Inventory.js";

const checkAvailableStock = async (book_id, quantity) => {
  const inventory = await Inventory.findOne({ book_id }).select("currentStock");

  if (!inventory) {
    throw new Error("Không tìm thấy thông tin tồn kho cho sản phẩm.");
  }

  if (quantity > inventory.currentStock) {
    throw new Error(
      `Không thể đặt hàng. Số lượng còn lại: ${inventory.currentStock}`
    );
  }

  return true;
};

export default checkAvailableStock;
