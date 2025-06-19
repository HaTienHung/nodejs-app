import mongoose from "mongoose";
import mongooseDelete from "mongoose-delete";
import slugify from "slugify";
import { STATUS } from "../../constants/status.js";

const Schema = mongoose.Schema;

const bookSchema = new Schema({
  title: String,
  description: String,
  price: Number,
  status: {
    type: String,
    default: STATUS.DRAFT,
  },
  publisher_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Publisher",
    required: true,
  },
  author_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Author",
    required: true,
  },
  category_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  published_at: { type: Date, default: Date.now },
  delete_at: { type: Date, default: Date.now },
});

bookSchema.pre("save", async function (next) {
  if (!this.isModified("title")) return next();
  this.slug = slugify(this.title, {
    lower: true, // lowercase slug
    strict: true, // remove special chars
  });
  next();
});

bookSchema.plugin(mongooseDelete, {
  deletedAt: true,
  overrideMethods: "all",
});

export default mongoose.model("Book", bookSchema);
