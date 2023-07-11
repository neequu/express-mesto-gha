import mongoose from "mongoose";

const { ObjectId } = mongoose.Schema.Types;

const CardSchema = new mongoose.Schema({
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
    required: true,
    ref: "user",
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

export default mongoose.model("Card", CardSchema);
