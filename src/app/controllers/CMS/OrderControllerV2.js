import { sendUserNotification } from "../../../helpers/sendNotification.helper.js";
import Order from "../../models/Order.js";

class OrderControllerV2 {
  // [GET] /api/cms/orders/all
  async index(req, res) {
    const orders = await Order.find({});
    res.status(200).json(orders);
  }
  // [GET] /api/cms/orders/update/:id
  async updateStatus(req, res) {
    const _id = req.params.id;
    const order = await Order.findById(_id);
    console.log(order.user_id);

    order.status = req.body.status;

    (async () => {
      try {
        await sendUserNotification(
          order.user_id,
          `Trạng thái đơn hàng ${order._id} đã được cập nhật`,
          "..."
        );
      } catch (e) {
        console.error(e);
      }
    })();

    order.save();

    res.status(200).json({
      message: "Cập nhật đơn hàng thành công !",
      data: order,
    });
  }
}
export default new OrderControllerV2();
