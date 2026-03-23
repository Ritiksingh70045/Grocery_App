import mongoose, { Schema } from 'mongoose';

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    cartItems: {               // key is product_id and value corresponding to that key is quantity of that product in the cart 
      type: Object,
      default: {},
    },
    orders: [
      {
        type: Schema.Types.ObjectId,
        ref: 'order',
      },
    ],
  },
  { minimize: false }
);

const User = mongoose.model('user', userSchema);
export default User;
