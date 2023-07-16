import { Schema, model } from 'mongoose';

const { ObjectId } = Schema.Types;

const CardSchema = new Schema({
  name: {
    type: String,
    required: true,
    minlength: [2, 'length of this field should be 2-30 symbols'],
    maxlength: [30, 'length of this field should be 2-30 symbols'],
  },

  link: {
    type: String,
    required: true,
    validate: {
      validator: (url) => /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_+.~#?&/=]*)$/.test(url),
    },
  },

  owner: {
    type: ObjectId,
    ref: 'user',
    required: true,
  },

  likes: [
    {
      type: ObjectId,
      ref: 'user',
      default: [],
    },
  ],

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default model('card', CardSchema);
