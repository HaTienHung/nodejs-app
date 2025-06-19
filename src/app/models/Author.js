import mongoose from "mongoose";
import slugify from "slugify";

const Schema = mongoose.Schema;

const authorSchema = new Schema({
  name: String,
  bio: String,
  dob: Date,
  slug: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

authorSchema.pre("save", async function (next) {
  if (!this.isModified("name")) return next();
  this.slug = slugify(this.title, {
    lower: true, // lowercase slug
    strict: true, // remove special chars
  });
  next();
});

export default mongoose.model("Book", authorSchema);
