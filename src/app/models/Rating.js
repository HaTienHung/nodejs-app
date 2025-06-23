import mongoose from "mongoose";
import slugify from "slugify";
import mongooseDelete from "mongoose-delete";

const Schema = mongoose.Schema;

const ratingSchema = new Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: null,
  },
  book_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Book",
    required: null,
  },
  rating: { type: Number, min: 1, max: 5, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model("Rating", ratingSchema);
