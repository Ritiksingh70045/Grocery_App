import mongoose, { Schema } from 'mongoose';

const orderSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'user',
    },
    items: [
      {
        product: {
          type: Schema.Types.ObjectId,
          required: true,
          ref: 'product',
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
    amount: {
      type: Number,
      required: true,
    },
    address: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'address',
    },
    status: {
      type: String,
      default: 'Order Placed',
    },
    paymentType: {
      type: String,
      required: true,
    },
    isPaid: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { timestamps: true }
);

const Order = mongoose.models.order || mongoose.model('order', orderSchema);  // Ensure model is only created once , use of models to check if the model already exists and also help in hot reloading during development . What is hot reloading ? => It is a feature that allows developers to see the changes they make in their code without having to refresh the entire application. This is particularly useful in development environments, as it speeds up the development process by allowing developers to see the effects of their changes immediately.

export default Order;
