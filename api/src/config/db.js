import mongoose from "mongoose";
const connectDb = async () => {
  const URI = process.env.MONGODB_URI;

  try {
    const conn = await mongoose.connect(URI);
    console.Console("db connected successfully ", conn.connection.name);
  } catch (error) {
    console.log("Error connecting to the db", error);
  }
};

export default connectDb;
