// src/models/Role.js
import mongoose from "mongoose";

const publisherSchema = new mongoose.Schema({
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
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone_number: {
    type: String,
    required: true,
    unique: true,
  },
  address: {
    type: String,
    required: true,
    unique: true,
  },
});

publisherSchema.pre("save", async function (next) {
  if (!this.isModified("name")) return next();
  this.slug = slugify(this.name, {
    lower: true, // lowercase slug
    strict: true, // remove special chars
  });
  next();
});

export default mongoose.model("Publisher", publisherSchema);
