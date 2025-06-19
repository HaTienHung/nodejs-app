// src/models/Role.js
import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
});

categorySchema.pre("save", async function (next) {
  if (!this.isModified("name")) return next();
  this.slug = slugify(this.title, {
    lower: true, // lowercase slug
    strict: true, // remove special chars
  });
  next();
});

export default mongoose.model("Category", categorySchema);
