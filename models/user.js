import { Schema, model } from "mongoose";

const UserSchema = new Schema({
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

export default model("user", UserSchema);
