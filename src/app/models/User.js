import mongoose from "mongoose";
import mongooseDelete from "mongoose-delete";
import { ROLE_ID } from "../../constants/role.js";
import bcrypt from "bcrypt";

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: String,
  age: Number,
  phone_number: {
    type: String,
    unique: true,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    select: false,
  },
  address: String,
  role: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Role",
    required: true,
    default: ROLE_ID.USER,
  },
  publisher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Publisher",
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next(); // chỉ hash nếu password thay đổi
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.plugin(mongooseDelete, {
  deletedAt: true,
  overrideMethods: "all",
});

export default mongoose.model("User", userSchema);
