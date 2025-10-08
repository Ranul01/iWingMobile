import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { FaStar, FaShoppingCart } from "react-icons/fa";
import { useCart } from "../context/CartContex"; // Import cart context

const PhoneCard = ({ phone }) => {
  const { addItem } = useCart(); // Get addItem function from cart context

  // Safely extract rating value
  const ratingValue =
    typeof phone.rating === "number"
      ? phone.rating
      : phone.rating?.average || 0;

  const discount = phone.originalPrice
    ? Math.round(
        ((phone.originalPrice - phone.price) / phone.originalPrice) * 100
      )
    : 0;

  // Handle add to cart
  const handleAddToCart = (e) => {
    e.preventDefault(); // Prevent any default behavior
    e.stopPropagation(); // Stop event bubbling

    // Prepare phone data for cart
    const cartItem = {
      id: phone.id || phone._id,
      name: phone.name,
      brand: phone.brand,
      price: phone.price,
      originalPrice: phone.originalPrice,
      image: phone.image || phone.images?.[0]?.url,
      images: phone.images || [],
      inStock: phone.inStock !== false, // Default to true if not specified
    };

    addItem(cartItem);

    // Optional: Show success feedback
    // You can add a toast notification here
    console.log("Added to cart:", cartItem);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <Link to={`/phones/${phone.id || phone._id}`}>
        <div className="relative">
          <img
            src={
              phone.image || phone.images?.[0]?.url || "/placeholder-phone.jpg"
            }
            alt={phone.name}
            className="w-full h-64 object-cover"
            onError={(e) => {
              e.target.src = "/placeholder-phone.jpg";
            }}
          />
          {discount > 0 && (
            <span className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-md text-sm font-bold">
              -{discount}%
            </span>
          )}
          {phone.featured && (
            <span className="absolute top-2 left-2 bg-blue-600 text-white px-2 py-1 rounded-md text-xs font-semibold">
              Featured
            </span>
          )}
          {!phone.inStock && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <span className="text-white text-lg font-bold">Out of Stock</span>
            </div>
          )}
        </div>
      </Link>

      <div className="p-4">
        <Link to={`/phones/${phone.id || phone._id}`}>
          <h3 className="text-lg font-semibold text-gray-800 hover:text-blue-600 transition-colors mb-2">
            {phone.name}
          </h3>
        </Link>

        <p className="text-sm text-gray-600 mb-2">{phone.brand}</p>

        <div className="flex items-center mb-3">
          <div className="flex items-center text-yellow-400">
            <FaStar />
            <span className="ml-1 text-sm text-gray-700">
              {ratingValue.toFixed(1)}
            </span>
          </div>
          {phone.rating?.count > 0 && (
            <span className="ml-2 text-xs text-gray-500">
              ({phone.rating.count} reviews)
            </span>
          )}
        </div>

        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-2xl font-bold text-blue-600">
              ${phone.price}
            </span>
            {phone.originalPrice && phone.originalPrice > phone.price && (
              <span className="ml-2 text-sm text-gray-500 line-through">
                ${phone.originalPrice}
              </span>
            )}
          </div>
        </div>

        <button
          onClick={handleAddToCart}
          className={`w-full py-2 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center ${
            phone.inStock !== false
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
          disabled={phone.inStock === false}
        >
          <FaShoppingCart className="mr-2" />
          {phone.inStock !== false ? "Add to Cart" : "Out of Stock"}
        </button>
      </div>
    </div>
  );
};

PhoneCard.propTypes = {
  phone: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    _id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    name: PropTypes.string.isRequired,
    brand: PropTypes.string,
    price: PropTypes.number.isRequired,
    originalPrice: PropTypes.number,
    image: PropTypes.string,
    images: PropTypes.arrayOf(
      PropTypes.shape({
        url: PropTypes.string,
      })
    ),
    rating: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.shape({
        average: PropTypes.number,
        count: PropTypes.number,
      }),
    ]),
    featured: PropTypes.bool,
    inStock: PropTypes.bool,
  }).isRequired,
};

export default PhoneCard;
