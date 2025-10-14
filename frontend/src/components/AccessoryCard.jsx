import React from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContex";

const AccessoryCard = ({ accessory }) => {
  const navigate = useNavigate();
  const { addItem, isItemInCart } = useCart();

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const handleCardClick = () => {
    // Navigate to accessory details page
    navigate(`/accessories/${accessory._id || accessory.id}`);
  };

  const handleAddToCart = (e) => {
    // Prevent card click when clicking the button
    e.stopPropagation();

    // Don't add if already in cart or out of stock
    if (!accessory.inStock || isItemInCart(accessory._id)) {
      return;
    }

    addItem({
      id: accessory._id,
      name: accessory.name,
      brand: accessory.brand,
      price: accessory.price,
      image: accessory.images?.[0]?.url,
      images: accessory.images || [],
      type: "accessory",
      category: accessory.category,
      inStock: accessory.inStock,
    });
  };

  const primaryImage =
    accessory.images?.find((img) => img.isPrimary) || accessory.images?.[0];

  const getCategoryIcon = (category) => {
    const icons = {
      case: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
        />
      ),
      charger: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 10V3L4 14h7v7l9-11h-7z"
        />
      ),
      earphone: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728m-5.657-2.829a3 3 0 010-4.242m1.414-1.414a7 7 0 010 9.899"
        />
      ),
      headphone: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728m-5.657-2.829a3 3 0 010-4.242m1.414-1.414a7 7 0 010 9.899"
        />
      ),
      powerbank: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
        />
      ),
      speaker: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M6.343 6.343a8 8 0 000 11.314m11.314-11.314a8 8 0 000 11.314"
        />
      ),
      default: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
        />
      ),
    };
    return icons[category] || icons.default;
  };

  const formatCategoryName = (category) => {
    return category
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // Determine button state
  const isInCart = isItemInCart(accessory._id);
  const isOutOfStock = !accessory.inStock;

  let buttonLabel, buttonClass;

  if (isOutOfStock) {
    buttonLabel = "Out of Stock";
    buttonClass =
      "w-full py-2 px-4 rounded-lg font-medium bg-gray-300 text-gray-500 cursor-not-allowed";
  } else if (isInCart) {
    buttonLabel = "✓ Added to Cart";
    buttonClass =
      "w-full py-2 px-4 rounded-lg font-medium bg-green-600 text-white cursor-default";
  } else {
    buttonLabel = "Add to Cart";
    buttonClass =
      "w-full py-2 px-4 rounded-lg font-medium bg-purple-600 text-white hover:bg-purple-700 transition-colors";
  }

  return (
    <div
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden cursor-pointer text-left w-full"
      onClick={handleCardClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleCardClick();
        }
      }}
      role="button"
      tabIndex={0}
    >
      {/* Image Container */}
      <div className="relative aspect-square bg-gray-100 overflow-hidden">
        {primaryImage ? (
          <img
            src={primaryImage.url}
            alt={accessory.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.target.src =
                "https://via.placeholder.com/300x300?text=No+Image";
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <svg
              className="w-16 h-16"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {getCategoryIcon(accessory.category)}
            </svg>
          </div>
        )}

        {/* Badges */}
        {accessory.featured && (
          <div className="absolute top-2 left-2 bg-purple-500 text-white px-2 py-1 rounded text-xs font-semibold">
            Featured
          </div>
        )}

        {accessory.originalPrice &&
          accessory.originalPrice > accessory.price && (
            <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold">
              {Math.round(
                ((accessory.originalPrice - accessory.price) /
                  accessory.originalPrice) *
                  100
              )}
              % OFF
            </div>
          )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Category & Brand */}
        <div className="flex items-center justify-between mb-1">
          <p className="text-xs text-purple-600 font-medium">
            {formatCategoryName(accessory.category)}
          </p>
          <p className="text-xs text-gray-500">{accessory.brand}</p>
        </div>

        {/* Name */}
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
          {accessory.name}
        </h3>

        {/* Price */}
        <div className="flex items-center space-x-2 mb-3">
          <span className="text-lg font-bold text-purple-600">
            {formatPrice(accessory.price)}
          </span>
          {accessory.originalPrice &&
            accessory.originalPrice > accessory.price && (
              <span className="text-sm text-gray-500 line-through">
                {formatPrice(accessory.originalPrice)}
              </span>
            )}
        </div>

        {/* Key Features */}
        {accessory.specifications && (
          <div className="text-xs text-gray-600 mb-3">
            {accessory.specifications.material && (
              <span className="inline-block bg-gray-100 rounded px-2 py-1 mr-1 mb-1">
                {accessory.specifications.material}
              </span>
            )}
            {accessory.specifications.color && (
              <span className="inline-block bg-gray-100 rounded px-2 py-1 mr-1 mb-1">
                {accessory.specifications.color}
              </span>
            )}
            {accessory.specifications.warranty && (
              <span className="inline-block bg-gray-100 rounded px-2 py-1 mr-1 mb-1">
                {accessory.specifications.warranty}
              </span>
            )}
          </div>
        )}

        {/* Stock Status & Rating */}
        <div className="flex items-center justify-between mb-3">
          <span
            className={`text-xs px-2 py-1 rounded-full ${
              accessory.inStock
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {accessory.inStock ? "In Stock" : "Out of Stock"}
          </span>

          {/* Rating */}
          {accessory.rating && accessory.rating.average > 0 && (
            <div className="flex items-center">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={`${accessory._id}-star-${i}`}
                    className={`w-4 h-4 ${
                      i < Math.floor(accessory.rating.average)
                        ? "fill-current"
                        : "fill-gray-300"
                    }`}
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-xs text-gray-600 ml-1">
                ({accessory.rating.count})
              </span>
            </div>
          )}
        </div>

        {/* Compatibility */}
        {accessory.specifications?.compatibility && (
          <div className="mb-3">
            <span className="inline-block bg-blue-100 text-blue-800 rounded px-2 py-1 text-xs">
              Compatible: {accessory.specifications.compatibility}
            </span>
          </div>
        )}

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock || isInCart}
          className={buttonClass}
        >
          {buttonLabel}
        </button>
      </div>
    </div>
  );
};

AccessoryCard.propTypes = {
  accessory: PropTypes.object.isRequired,
};

export default AccessoryCard;
