// src/models/Role.js
import mongoose from "mongoose";
import slugify from "slugify";

const publisherSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  slug: {
    type: String,
    unique: true,
  },
  bio: {
    type: String,
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
  inactive_at: {
    type: Date,
    default: null,
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
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
