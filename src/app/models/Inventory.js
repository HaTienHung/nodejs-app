import mongoose from "mongoose";

const Schema = mongoose.Schema;

const inventorySchema = new Schema({
  book_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Book",
    required: true,
  },
  currentStock: Number,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model("Inventory", inventorySchema);
