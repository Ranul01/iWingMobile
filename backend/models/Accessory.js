const mongoose = require("mongoose");

const accessorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Accessory name is required"],
      trim: true,
      maxlength: [100, "Accessory name cannot exceed 100 characters"],
    },
    brand: {
      type: String,
      required: [true, "Brand is required"],
      trim: true,
      maxlength: [50, "Brand name cannot exceed 50 characters"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: [
        "case",
        "screen-protector",
        "charger",
        "cable",
        "earphone",
        "headphone",
        "speaker",
        "powerbank",
        "car-accessory",
        "stand",
        "other",
      ],
    },
    subcategory: {
      type: String,
      trim: true,
      maxlength: [50, "Subcategory cannot exceed 50 characters"],
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
      material: String,
      color: String,
      dimensions: String,
      weight: String,
      compatibility: [String], // Compatible phone models
      features: [String],
      warranty: String,
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
    compatiblePhones: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Phone",
      },
    ],
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
accessorySchema.index({ name: "text", brand: "text", description: "text" });
accessorySchema.index({ category: 1, subcategory: 1 });
accessorySchema.index({ brand: 1, category: 1 });
accessorySchema.index({ price: 1 });
accessorySchema.index({ featured: -1, createdAt: -1 });

// Virtual for discount percentage
accessorySchema.virtual("discountPercentage").get(function () {
  if (this.originalPrice && this.originalPrice > this.price) {
    return Math.round(
      ((this.originalPrice - this.price) / this.originalPrice) * 100
    );
  }
  return 0;
});

// Virtual for primary image
accessorySchema.virtual("primaryImage").get(function () {
  const primary = this.images.find((img) => img.isPrimary);
  return primary || this.images[0] || null;
});

module.exports = mongoose.model("Accessory", accessorySchema);
