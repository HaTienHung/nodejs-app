import mongoose from "mongoose";
import slugify from "slugify";
import mongooseDelete from "mongoose-delete";

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
  this.slug = slugify(this.name, {
    lower: true, // lowercase slug
    strict: true, // remove special chars
  });
  next();
});

authorSchema.plugin(mongooseDelete, {
  deletedAt: true,
  overrideMethods: "all",
});

export default mongoose.model("Author", authorSchema);
