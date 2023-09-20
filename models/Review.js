const { Schema, model } = require('mongoose');

const reviewSchema = new Schema(
  {
    rating: {
      type: Number,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

// this is called a compound index that ties 2 fields/properties together
// - marking each of them separately as unique won't work -
reviewSchema.index({ product: 1, user: 1 }, { unique: true });

module.exports = model('Review', reviewSchema);
