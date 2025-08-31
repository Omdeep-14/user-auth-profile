import dotenv from "dotenv";
dotenv.config();
import app from "./src/app.js";
import connectDb from "./src/config/db.js";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDb();
    console.log("Db connected to server succesfully");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.log("problem starting server", error);
    process.exit(1);
  }
};

startServer();
