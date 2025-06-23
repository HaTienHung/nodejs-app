import mongoose from "mongoose";
import mongooseDelete from "mongoose-delete";
import slugify from "slugify";
import { BOOK_STATUS } from "../../constants/status.js";

const Schema = mongoose.Schema;

const bookSchema = new Schema({
  title: String,
  description: String,
  price: Number,
  status: {
    type: String,
    enum: Object.values(BOOK_STATUS),
    default: BOOK_STATUS.DRAFT,
  },
  slug: {
    type: String,
    require: true,
  },
  publisher_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Publisher",
    required: null,
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
  image_url: String,
  image_public_id: String,
  averageRating: { type: Number, default: 0 },
  ratingCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  published_at: { type: Date, default: Date.now },
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
