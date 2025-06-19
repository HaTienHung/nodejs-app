import mongoose from "mongoose";

function connect() {
  try {
    mongoose
      .connect(process.env.DATABASE_URL)
      .then(() => console.log(process.env.DATABASE_URL));
  } catch (error) {
    console.log("Failed");
  }
}

export default { connect };
