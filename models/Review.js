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

reviewSchema.statics.calculateProductStats = async function (productId) {
  const result = await this.aggregate([
    { $match: { product: productId } },
    {
      $group: {
        _id: '$product', // we can go with null, when our data is simple and associated with the only one product!
        avgRating: { $avg: '$rating' },
        numOfReviews: { $sum: 1 },
      },
    },
  ]);
  
  try {
    await this.model('Product').findByIdAndUpdate(productId, {
      avgRating: +result[0]?.avgRating.toFixed(1) || 0,
      numOfReviews: result[0]?.numOfReviews || 0,
    });
  } catch (error) {
    console.log(error);
  }
};

// we use 'post' hook so we are assured that the saving/deleting was successful
reviewSchema.post('save', async function () {
  await this.constructor.calculateProductStats(this.product);
});

reviewSchema.post('deleteOne', { document: true }, async function () {
  await this.constructor.calculateProductStats(this.product);
});

module.exports = model('Review', reviewSchema);
