import mongoose from "mongoose";
import User from "../models/user.model.js";
const connectDb = async () => {
  const URI = process.env.MONGODB_URI;

  try {
    const conn = await mongoose.connect(URI);
    console.log("db connected successfully ", mongoose.connection.name);

    await User.init();
  } catch (error) {
    console.log("Error connecting to the db", error);
  }
};

export default connectDb;
