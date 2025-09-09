import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "username is required"],
      unique: true,
      trim: true,
      minlength: [3, "Username should have atleast 3 characters"],
      maxlength: [20, "Username can have maximum of 20 characters"],
      match: [
        /^[a-zA-Z0-9_]+$/,
        "Username must contain only letters and numbers and underscore",
      ],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      validate: [validator.isEmail, "Email is invalid"],
      unique: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: [5, "Password should have minimum 5 characters"],
    },
    role: {
      type: String,
      enum: ["User", "Admin"],
      default: "User",
    },
    tokenVersion: {
      type: String,
      default: 0,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

const User = mongoose.model("User", userSchema);

export default User;
