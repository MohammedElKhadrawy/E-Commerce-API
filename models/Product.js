const { Schema, model } = require('mongoose');

const Review = require('./Review');

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default: '/uploads/example.jpeg',
    },
    category: {
      type: String,
      enum: {
        values: ['office', 'kitchen', 'bedroom'],
        message: '{VALUE} is not supported',
      },
      required: true,
    },
    company: {
      type: String,
      enum: {
        values: ['ikea', 'liddy', 'marcos'],
        message: '{VALUE} is not supported',
      },
      required: true,
    },
    colors: {
      type: [String],
      // required: true,
      default: ['#222'],
    },
    featured: {
      type: Boolean,
      default: false,
    },
    freeShipping: {
      type: Boolean,
      default: false,
    },
    inventory: {
      type: Number,
      // required: true,
      default: 15,
    },
    avgRating: {
      type: Number,
      default: 0,
    },
    numOfReviews: {
      type: Number,
      default: 0,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
    // these are essential for the virtual to work!
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  }
);

productSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'product', // watch the letter-case!!
  justOne: false, // because we want a list!
  // match: { rating: 5 }, // This is optional because it's hardcoded
});

// we reach out to Review model and delete reviews associated with the product
// before it gets deleted so a pre-deleteOne hook
productSchema.pre('deleteOne', { document: true }, async function () {
  await Review.deleteMany({ product: this._id });
});
// we can't use this approach now that we set document: true, 'this' refers to the document not the schema/model anymore
// await this.model('Review').deleteMany({ product: this._id });

module.exports = model('Product', productSchema);
