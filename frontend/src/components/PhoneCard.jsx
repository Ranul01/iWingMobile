import React from "react";
import { useCart } from "../context/CartContex";

const PhoneCard = ({ phone }) => {
  const { addItem, isItemInCart } = useCart();

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const handleAddToCart = () => {
    addItem({
      id: phone._id,
      name: phone.name,
      brand: phone.brand,
      price: phone.price,
      images: phone.images || [],
      type: "phone",
    });
  };

  const primaryImage =
    phone.images?.find((img) => img.isPrimary) || phone.images?.[0];

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      {/* Image Container */}
      <div className="relative aspect-square bg-gray-100 overflow-hidden">
        {primaryImage ? (
          <img
            src={primaryImage.url}
            alt={phone.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <svg
              className="w-16 h-16"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}

        {/* Badge for featured items */}
        {phone.featured && (
          <div className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded text-xs font-semibold">
            Featured
          </div>
        )}

        {/* Discount badge */}
        {phone.originalPrice && phone.originalPrice > phone.price && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold">
            {Math.round(
              ((phone.originalPrice - phone.price) / phone.originalPrice) * 100
            )}
            % OFF
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Brand */}
        <p className="text-sm text-gray-500 mb-1">{phone.brand}</p>

        {/* Name */}
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
          {phone.name}
        </h3>

        {/* Price */}
        <div className="flex items-center space-x-2 mb-3">
          <span className="text-lg font-bold text-blue-600">
            {formatPrice(phone.price)}
          </span>
          {phone.originalPrice && phone.originalPrice > phone.price && (
            <span className="text-sm text-gray-500 line-through">
              {formatPrice(phone.originalPrice)}
            </span>
          )}
        </div>

        {/* Key Specs */}
        {phone.specifications && (
          <div className="text-xs text-gray-600 mb-3">
            {phone.specifications.display?.size && (
              <span className="inline-block bg-gray-100 rounded px-2 py-1 mr-1 mb-1">
                {phone.specifications.display.size}
              </span>
            )}
            {phone.specifications.ram && (
              <span className="inline-block bg-gray-100 rounded px-2 py-1 mr-1 mb-1">
                {phone.specifications.ram} RAM
              </span>
            )}
            {phone.specifications.storage && (
              <span className="inline-block bg-gray-100 rounded px-2 py-1 mr-1 mb-1">
                {phone.specifications.storage}
              </span>
            )}
          </div>
        )}

        {/* Stock Status */}
        <div className="flex items-center justify-between mb-3">
          <span
            className={`text-xs px-2 py-1 rounded-full ${
              phone.inStock
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {phone.inStock ? "In Stock" : "Out of Stock"}
          </span>

          {/* Rating */}
          {phone.rating && phone.rating.average > 0 && (
            <div className="flex items-center">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(phone.rating.average)
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
                ({phone.rating.count})
              </span>
            </div>
          )}
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={!phone.inStock}
          className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
            phone.inStock
              ? isItemInCart(phone._id)
                ? "bg-green-600 text-white"
                : "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          {!phone.inStock
            ? "Out of Stock"
            : isItemInCart(phone._id)
            ? "Added to Cart"
            : "Add to Cart"}
        </button>
      </div>
    </div>
  );
};

export default PhoneCard;
