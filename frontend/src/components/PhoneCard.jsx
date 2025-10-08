import React from "react";
import { Link } from "react-router-dom";

const PhoneCard = ({ phone }) => {
  // Robust image selection with fallback
  const imgSrc =
    phone.image ||
    (Array.isArray(phone.images) && phone.images.length > 0
      ? phone.images[0]
      : "/logo192.png");

  return (
    <Link
      to={`/phones/${phone._id}`}
      className="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
    >
      <div className="relative h-64 bg-gray-100 overflow-hidden">
        <img
          src={imgSrc}
          alt={phone.name}
          className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
          onError={(e) => {
            e.currentTarget.src = "/logo192.png";
          }}
        />
        {phone.featured && (
          <span className="absolute top-2 left-2 bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded">
            Featured
          </span>
        )}
        {!phone.inStock && (
          <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
            Out of Stock
          </span>
        )}
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {phone.name}
        </h3>

        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl font-bold text-blue-600">
            ${phone.price.toLocaleString()}
          </span>
          {phone.originalPrice && phone.originalPrice > phone.price && (
            <span className="text-sm text-gray-500 line-through">
              ${phone.originalPrice.toLocaleString()}
            </span>
          )}
        </div>

        {phone.rating && (
          <div className="flex items-center gap-1 mb-2">
            <span className="text-yellow-400">★</span>
            <span className="text-sm text-gray-600">
              {phone.rating.toFixed(1)}
            </span>
          </div>
        )}

        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {phone.description || phone.brand}
        </p>

        <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium">
          View Details
        </button>
      </div>
    </Link>
  );
};

export default PhoneCard;
