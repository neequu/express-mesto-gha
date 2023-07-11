import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: [2, "длина поля должна быть от 2 до 30 символов"],
    maxlength: [30, "длина поля должна быть от 2 до 30 символов"],
  },
  about: {
    type: String,
    required: true,
    minlength: [2, "длина поля должна быть от 2 до 30 символов"],
    maxlength: [30, "длина поля должна быть от 2 до 30 символов"],
  },
  avatar: {
    type: String,
    required: true,
  },
});

export default mongoose.model("User", UserSchema);
