import mongoose, { Schema } from 'mongoose';
const sellerSchema = new Schema(
  {
    sellerName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    products: [
      {
        type: Schema.Types.ObjectId,
        ref: 'product',
      },
    ],
    orders: [
      {
        type: Schema.Types.ObjectId,
        ref: 'order', 
      },
    ],
  },
  { timestamps: true } 
);

const Seller = mongoose.models.seller || mongoose.model('seller', sellerSchema);
export default Seller;
