import mongoose from "mongoose";

const Schema = mongoose.Schema;

const exportSchema = new Schema({
  book_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Book",
    required: true,
  },
  quantity: Number,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model("Export", exportSchema);
