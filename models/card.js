import { Schema, model } from "mongoose";

const { ObjectId } = Schema.Types;

const CardSchema = new Schema({
  name: {
    type: String,
    required: true,
    minlength: [2, "длина поля должна быть от 2 до 30 символов"],
    maxlength: [30, "длина поля должна быть от 2 до 30 символов"],
  },

  link: {
    type: String,
    required: true,
  },

  owner: {
    type: ObjectId,
    ref: "user",
    required: true,
  },

  likes: [
    {
      type: ObjectId,
      ref: "user",
      default: [],
    },
  ],

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default model("card", CardSchema);
