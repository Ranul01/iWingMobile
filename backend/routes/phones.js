const express = require("express");
const { body, validationResult } = require("express-validator");
const Phone = require("../models/Phone");
const {
  authenticateToken,
  requireAdmin,
  optionalAuth,
} = require("../middleware/auth");

const router = express.Router();

// Validation middleware
const phoneValidation = [
  body("name").trim().notEmpty().withMessage("Phone name is required"),
  body("brand").trim().notEmpty().withMessage("Brand is required"),
  body("model").trim().notEmpty().withMessage("Model is required"),
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

// GET /api/phones - Get all phones with filtering and pagination
router.get("/", optionalAuth, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      brand,
      category,
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
    const phones = await Phone.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .select("-__v");

    const total = await Phone.countDocuments(filter);

    res.json({
      success: true,
      data: phones,
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
      message: "Error fetching phones",
      error: error.message,
    });
  }
});

// GET /api/phones/:id - Get single phone by ID
router.get("/:id", async (req, res) => {
  try {
    const phone = await Phone.findById(req.params.id).select("-__v");

    if (!phone || !phone.isActive) {
      return res.status(404).json({
        success: false,
        message: "Phone not found",
      });
    }

    res.json({
      success: true,
      data: phone,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid phone ID",
      });
    }
    res.status(500).json({
      success: false,
      message: "Error fetching phone",
      error: error.message,
    });
  }
});

// POST /api/phones - Create new phone (Admin only)
router.post(
  "/",
  authenticateToken,
  requireAdmin,
  phoneValidation,
  handleValidationErrors,
  async (req, res) => {
    try {
      const phone = new Phone(req.body);
      await phone.save();

      res.status(201).json({
        success: true,
        message: "Phone created successfully",
        data: phone,
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
        message: "Error creating phone",
        error: error.message,
      });
    }
  }
);

// PUT /api/phones/:id - Update phone (Admin only)
router.put(
  "/:id",
  authenticateToken,
  requireAdmin,
  phoneValidation,
  handleValidationErrors,
  async (req, res) => {
    try {
      const phone = await Phone.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });

      if (!phone) {
        return res.status(404).json({
          success: false,
          message: "Phone not found",
        });
      }

      res.json({
        success: true,
        message: "Phone updated successfully",
        data: phone,
      });
    } catch (error) {
      if (error.name === "CastError") {
        return res.status(400).json({
          success: false,
          message: "Invalid phone ID",
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
        message: "Error updating phone",
        error: error.message,
      });
    }
  }
);

// DELETE /api/phones/:id - Delete phone (Admin only) - Soft delete
router.delete("/:id", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const phone = await Phone.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!phone) {
      return res.status(404).json({
        success: false,
        message: "Phone not found",
      });
    }

    res.json({
      success: true,
      message: "Phone deleted successfully",
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid phone ID",
      });
    }
    res.status(500).json({
      success: false,
      message: "Error deleting phone",
      error: error.message,
    });
  }
});

// GET /api/phones/featured - Get featured phones
router.get("/featured/list", async (req, res) => {
  try {
    const { limit = 6 } = req.query;

    const phones = await Phone.find({
      featured: true,
      isActive: true,
      inStock: true,
    })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .select("-__v");

    res.json({
      success: true,
      data: phones,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching featured phones",
      error: error.message,
    });
  }
});

module.exports = router;
