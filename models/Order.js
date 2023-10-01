const { Schema, model } = require('mongoose');

const singleOrderItemSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  color: {
    type: String,
  },
  price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  product: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
});

const orderSchema = new Schema(
  {
    tax: {
      type: Number,
      required: true,
    },
    shippingFee: {
      type: Number,
      required: true,
    },
    subtotal: {
      type: Number,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
    orderItems: [singleOrderItemSchema],
    status: {
      type: String,
      enum: ['pending', 'failed', 'paid', 'delivered', 'canceled'],
      default: 'pending',
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    clientSecret: {
      type: String,
      required: true,
    },
    paymentIntentId: {
      type: String,
    },
  },
  { timestamps: true }
);

orderSchema.post('save', async function () {
  // if (this.isModified('orderItems')) {
  // this runs only when we update using order.save() [patch request]
  // }
  for (const item of this.orderItems) {
    const orderedProduct = await this.model('Product').findById(item.product);
    orderedProduct.inventory -= item.quantity;
    if (orderedProduct.inventory === 0) {
      orderedProduct.status = 'Out of Stock';
    }
    await orderedProduct.save();
  }
});

module.exports = model('Order', orderSchema);
