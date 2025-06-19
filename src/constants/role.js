import mongoose from "mongoose";

export const ROLE_ID = {
  USER: new mongoose.Types.ObjectId("685281466651c949a405424d"),
  PUBLISHER: new mongoose.Types.ObjectId("685281466651c949a285110d"),
  ADMIN: new mongoose.Types.ObjectId("685281466651c949a285474d"),
};

export const ROLE_NAME = {
  USER: "user",
  PUBLISHER: "publisher",
  ADMIN: "admin",
};
