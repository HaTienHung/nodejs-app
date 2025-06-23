import { ORDER_STATUS } from "../../../constants/status.js";
import Order from "../../models/Order.js";
import Import from "../../models/Import.js";
import Inventory from "../../models/Inventory.js";
import OrderItem from "../../models/OrderItem.js";

class OrderController {
  async cancelOrder(req, res) {
    try {
      const orderId = req.params.id;
      const userId = req.user.id;

      const order = await Order.findOne({ _id: orderId, user_id: userId });

      if (!order) {
        return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
      }

      if (![ORDER_STATUS.PENDING].includes(order.status)) {
        return res.status(400).json({
          message: "Chỉ có thể huỷ đơn hàng khi đang chờ xử lý hoặc xử lý",
        });
      }

      // 1. Cập nhật trạng thái đơn hàng
      order.status = ORDER_STATUS.CANCELLED;
      await order.save();

      // 2. Lấy các OrderItem liên quan
      const orderItems = await OrderItem.find({ order_id: order._id });
      

      // 3. Hoàn lại tồn kho
      const tasks = orderItems.map((item) => {
        return Promise.all([
          Import.create({ book_id: item.book_id, quantity: item.quantity }),
          Inventory.findOneAndUpdate(
            { book_id: item.book_id },
            { $inc: { currentStock: item.quantity } }
          ),
        ]);
      });

      await Promise.all(tasks);

      res.json({
        message: "Huỷ đơn hàng và hoàn kho thành công",
        order,
      });
    } catch (err) {
      res.status(500).json({
        message: "Không thể huỷ đơn hàng",
        error: err.message,
      });
    }
  }
}

export default new OrderController();
