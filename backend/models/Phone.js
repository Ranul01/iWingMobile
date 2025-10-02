const mongoose = require("mongoose");

const phoneSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Phone name is required"],
      trim: true,
      maxlength: [100, "Phone name cannot exceed 100 characters"],
    },
    brand: {
      type: String,
      required: [true, "Brand is required"],
      trim: true,
      maxlength: [50, "Brand name cannot exceed 50 characters"],
    },
    model: {
      type: String,
      required: [true, "Model is required"],
      trim: true,
      maxlength: [50, "Model name cannot exceed 50 characters"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    originalPrice: {
      type: Number,
      min: [0, "Original price cannot be negative"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      maxlength: [1000, "Description cannot exceed 1000 characters"],
    },
    specifications: {
      display: {
        size: String,
        resolution: String,
        type: String,
      },
      processor: String,
      ram: String,
      storage: String,
      camera: {
        rear: String,
        front: String,
      },
      battery: String,
      os: String,
      connectivity: [String],
      colors: [String],
      dimensions: String,
      weight: String,
    },
    images: [
      {
        url: {
          type: String,
          required: true,
        },
        alt: String,
        isPrimary: {
          type: Boolean,
          default: false,
        },
      },
    ],
    category: {
      type: String,
      required: true,
      enum: ["smartphone", "feature-phone", "tablet"],
      default: "smartphone",
    },
    inStock: {
      type: Boolean,
      default: true,
    },
    stockQuantity: {
      type: Number,
      default: 0,
      min: [0, "Stock quantity cannot be negative"],
    },
    featured: {
      type: Boolean,
      default: false,
    },
    rating: {
      average: {
        type: Number,
        default: 0,
        min: [0, "Rating cannot be negative"],
        max: [5, "Rating cannot exceed 5"],
      },
      count: {
        type: Number,
        default: 0,
        min: [0, "Rating count cannot be negative"],
      },
    },
    tags: [String],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Index for search and filtering
phoneSchema.index({
  name: "text",
  brand: "text",
  model: "text",
  description: "text",
});
phoneSchema.index({ brand: 1, category: 1 });
phoneSchema.index({ price: 1 });
phoneSchema.index({ featured: -1, createdAt: -1 });

// Virtual for discount percentage
phoneSchema.virtual("discountPercentage").get(function () {
  if (this.originalPrice && this.originalPrice > this.price) {
    return Math.round(
      ((this.originalPrice - this.price) / this.originalPrice) * 100
    );
  }
  return 0;
});

// Virtual for primary image
phoneSchema.virtual("primaryImage").get(function () {
  const primary = this.images.find((img) => img.isPrimary);
  return primary || this.images[0] || null;
});

module.exports = mongoose.model("Phone", phoneSchema);
