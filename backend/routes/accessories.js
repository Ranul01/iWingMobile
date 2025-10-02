const express = require("express");
const { body, validationResult } = require("express-validator");
const Accessory = require("../models/Accessory");
const {
  authenticateToken,
  requireAdmin,
  optionalAuth,
} = require("../middleware/auth");

const router = express.Router();

// Validation middleware
const accessoryValidation = [
  body("name").trim().notEmpty().withMessage("Accessory name is required"),
  body("brand").trim().notEmpty().withMessage("Brand is required"),
  body("category")
    .isIn([
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
    ])
    .withMessage("Invalid category"),
  body("price")
    .isNumeric()
    .withMessage("Price must be a number")
    .isFloat({ min: 0 })
    .withMessage("Price cannot be negative"),
  body("description").trim().notEmpty().withMessage("Description is required"),
];

// Helper function to handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation errors",
      errors: errors.array(),
    });
  }
  next();
};

// GET /api/accessories - Get all accessories with filtering and pagination
router.get("/", optionalAuth, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      brand,
      category,
      subcategory,
      minPrice,
      maxPrice,
      featured,
      inStock,
      search,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    // Build filter object
    const filter = { isActive: true };

    if (brand) filter.brand = new RegExp(brand, "i");
    if (category) filter.category = category;
    if (subcategory) filter.subcategory = new RegExp(subcategory, "i");
    if (featured !== undefined) filter.featured = featured === "true";
    if (inStock !== undefined) filter.inStock = inStock === "true";

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }

    if (search) {
      filter.$text = { $search: search };
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === "asc" ? 1 : -1;

    // Execute query with pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const accessories = await Accessory.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .populate("compatiblePhones", "name brand model")
      .select("-__v");

    const total = await Accessory.countDocuments(filter);

    res.json({
      success: true,
      data: accessories,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalItems: total,
        itemsPerPage: parseInt(limit),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching accessories",
      error: error.message,
    });
  }
});

// GET /api/accessories/:id - Get single accessory by ID
router.get("/:id", async (req, res) => {
  try {
    const accessory = await Accessory.findById(req.params.id)
      .populate("compatiblePhones", "name brand model")
      .select("-__v");

    if (!accessory || !accessory.isActive) {
      return res.status(404).json({
        success: false,
        message: "Accessory not found",
      });
    }

    res.json({
      success: true,
      data: accessory,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid accessory ID",
      });
    }
    res.status(500).json({
      success: false,
      message: "Error fetching accessory",
      error: error.message,
    });
  }
});

// POST /api/accessories - Create new accessory (Admin only)
router.post(
  "/",
  authenticateToken,
  requireAdmin,
  accessoryValidation,
  handleValidationErrors,
  async (req, res) => {
    try {
      const accessory = new Accessory(req.body);
      await accessory.save();

      res.status(201).json({
        success: true,
        message: "Accessory created successfully",
        data: accessory,
      });
    } catch (error) {
      if (error.name === "ValidationError") {
        return res.status(400).json({
          success: false,
          message: "Validation error",
          errors: Object.values(error.errors).map((err) => ({
            field: err.path,
            message: err.message,
          })),
        });
      }
      res.status(500).json({
        success: false,
        message: "Error creating accessory",
        error: error.message,
      });
    }
  }
);

// PUT /api/accessories/:id - Update accessory (Admin only)
router.put(
  "/:id",
  authenticateToken,
  requireAdmin,
  accessoryValidation,
  handleValidationErrors,
  async (req, res) => {
    try {
      const accessory = await Accessory.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );

      if (!accessory) {
        return res.status(404).json({
          success: false,
          message: "Accessory not found",
        });
      }

      res.json({
        success: true,
        message: "Accessory updated successfully",
        data: accessory,
      });
    } catch (error) {
      if (error.name === "CastError") {
        return res.status(400).json({
          success: false,
          message: "Invalid accessory ID",
        });
      }
      if (error.name === "ValidationError") {
        return res.status(400).json({
          success: false,
          message: "Validation error",
          errors: Object.values(error.errors).map((err) => ({
            field: err.path,
            message: err.message,
          })),
        });
      }
      res.status(500).json({
        success: false,
        message: "Error updating accessory",
        error: error.message,
      });
    }
  }
);

// DELETE /api/accessories/:id - Delete accessory (Admin only) - Soft delete
router.delete("/:id", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const accessory = await Accessory.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!accessory) {
      return res.status(404).json({
        success: false,
        message: "Accessory not found",
      });
    }

    res.json({
      success: true,
      message: "Accessory deleted successfully",
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid accessory ID",
      });
    }
    res.status(500).json({
      success: false,
      message: "Error deleting accessory",
      error: error.message,
    });
  }
});

// GET /api/accessories/featured - Get featured accessories
router.get("/featured/list", async (req, res) => {
  try {
    const { limit = 6 } = req.query;

    const accessories = await Accessory.find({
      featured: true,
      isActive: true,
      inStock: true,
    })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .populate("compatiblePhones", "name brand model")
      .select("-__v");

    res.json({
      success: true,
      data: accessories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching featured accessories",
      error: error.message,
    });
  }
});

// GET /api/accessories/categories - Get all categories
router.get("/categories/list", async (req, res) => {
  try {
    const categories = await Accessory.distinct("category", { isActive: true });

    res.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching categories",
      error: error.message,
    });
  }
});

module.exports = router;
