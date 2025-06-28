import mongoose from "mongoose";

function connect() {
  try {
    mongoose
      .connect(process.env.DATABASE_URL_DOCKER)
      .then(() => console.log(process.env.DATABASE_URL_DOCKER));
  } catch (error) {
    console.log("Failed");
  }
}

export default { connect };
