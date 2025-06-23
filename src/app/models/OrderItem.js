import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  order_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
    required: true,
  },
  book_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Book",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true, // giá tại thời điểm đặt
  },
  subtotal: {
    type: Number,
    required: true,
  },
});

export default mongoose.model("OrderItem", orderItemSchema);
