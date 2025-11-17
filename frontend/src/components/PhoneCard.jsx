import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { FaStar, FaWhatsapp } from "react-icons/fa";

const PhoneCard = ({ phone }) => {
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

  // Format condition for display
  const formatCondition = (condition) => {
    if (!condition) return "";
    return condition
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // Get condition badge color
  const getConditionBadgeColor = (condition) => {
    switch (condition) {
      case "brand-new":
        return "bg-green-100 text-green-800 border-green-200";
      case "refurbished":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "used-excellent":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "used-good":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "used-fair":
        return "bg-orange-100 text-orange-800 border-orange-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Handle buy now - redirect to WhatsApp
  const handleBuyNow = (e) => {
    e.preventDefault(); // Prevent any default behavior
    e.stopPropagation(); // Stop event bubbling

    // Create WhatsApp message with phone details
    const message = `Hi, I'm interested in buying ${phone.name} (${phone.brand}) - $${phone.price}`;
    const whatsappUrl = `https://wa.me/94707075121?text=${encodeURIComponent(
      message
    )}`;

    // Open WhatsApp in a new tab
    window.open(whatsappUrl, "_blank");
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
          {/* Condition Badge */}
          {phone.condition && phone.condition !== "brand-new" && (
            <span className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-sm text-gray-800 px-2 py-1 rounded-md text-xs font-medium border">
              {formatCondition(phone.condition)}
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

        <div className="flex items-center justify-between mb-2">
          <p className="text-sm text-gray-600">{phone.brand}</p>
          {/* Condition Badge in Content Area */}
          {phone.condition && (
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium border ${getConditionBadgeColor(
                phone.condition
              )}`}
            >
              {formatCondition(phone.condition)}
            </span>
          )}
        </div>

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

        {/* <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-2xl font-bold text-gray-900">
              ${phone.price}
            </span>
            {phone.originalPrice && phone.originalPrice > phone.price && (
              <span className="ml-2 text-sm text-gray-500 line-through">
                ${phone.originalPrice}
              </span>
            )}
          </div>
        </div> */}

        <button
          onClick={handleBuyNow}
          className={`w-full py-2 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center ${
            phone.inStock !== false
              ? "bg-yellow-400 text-black hover:bg-yellow-500"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
          disabled={phone.inStock === false}
        >
          <FaWhatsapp className="mr-2" />
          {phone.inStock !== false ? "Buy Now" : "Out of Stock"}
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
    condition: PropTypes.string, // Add condition to PropTypes
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

// import React from "react";
// import PropTypes from "prop-types";
// import { Link } from "react-router-dom";
// import { FaStar, FaShoppingCart } from "react-icons/fa";
// import { useCart } from "../context/CartContex"; // Import cart context

// const PhoneCard = ({ phone }) => {
//   const { addItem } = useCart(); // Get addItem function from cart context

//   // Safely extract rating value
//   const ratingValue =
//     typeof phone.rating === "number"
//       ? phone.rating
//       : phone.rating?.average || 0;

//   const discount = phone.originalPrice
//     ? Math.round(
//         ((phone.originalPrice - phone.price) / phone.originalPrice) * 100
//       )
//     : 0;

//   // Format condition for display
//   const formatCondition = (condition) => {
//     if (!condition) return "";
//     return condition
//       .split("-")
//       .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
//       .join(" ");
//   };

//   // Get condition badge color
//   const getConditionBadgeColor = (condition) => {
//     switch (condition) {
//       case "brand-new":
//         return "bg-green-100 text-green-800 border-green-200";
//       case "refurbished":
//         return "bg-blue-100 text-blue-800 border-blue-200";
//       case "used-excellent":
//         return "bg-emerald-100 text-emerald-800 border-emerald-200";
//       case "used-good":
//         return "bg-yellow-100 text-yellow-800 border-yellow-200";
//       case "used-fair":
//         return "bg-orange-100 text-orange-800 border-orange-200";
//       default:
//         return "bg-gray-100 text-gray-800 border-gray-200";
//     }
//   };

//   // Handle add to cart
//   const handleAddToCart = (e) => {
//     e.preventDefault(); // Prevent any default behavior
//     e.stopPropagation(); // Stop event bubbling

//     // Prepare phone data for cart
//     const cartItem = {
//       id: phone.id || phone._id,
//       name: phone.name,
//       brand: phone.brand,
//       price: phone.price,
//       originalPrice: phone.originalPrice,
//       image: phone.image || phone.images?.[0]?.url,
//       images: phone.images || [],
//       condition: phone.condition, // Include condition in cart
//       inStock: phone.inStock !== false, // Default to true if not specified
//     };

//     addItem(cartItem);

//     // Optional: Show success feedback
//     // You can add a toast notification here
//     console.log("Added to cart:", cartItem);
//   };

//   return (
//     <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
//       <Link to={`/phones/${phone.id || phone._id}`}>
//         <div className="relative">
//           <img
//             src={
//               phone.image || phone.images?.[0]?.url || "/placeholder-phone.jpg"
//             }
//             alt={phone.name}
//             className="w-full h-64 object-cover"
//             onError={(e) => {
//               e.target.src = "/placeholder-phone.jpg";
//             }}
//           />
//           {discount > 0 && (
//             <span className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-md text-sm font-bold">
//               -{discount}%
//             </span>
//           )}
//           {phone.featured && (
//             <span className="absolute top-2 left-2 bg-blue-600 text-white px-2 py-1 rounded-md text-xs font-semibold">
//               Featured
//             </span>
//           )}
//           {/* Condition Badge */}
//           {phone.condition && phone.condition !== "brand-new" && (
//             <span className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-sm text-gray-800 px-2 py-1 rounded-md text-xs font-medium border">
//               {formatCondition(phone.condition)}
//             </span>
//           )}
//           {!phone.inStock && (
//             <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
//               <span className="text-white text-lg font-bold">Out of Stock</span>
//             </div>
//           )}
//         </div>
//       </Link>

//       <div className="p-4">
//         <Link to={`/phones/${phone.id || phone._id}`}>
//           <h3 className="text-lg font-semibold text-gray-800 hover:text-blue-600 transition-colors mb-2">
//             {phone.name}
//           </h3>
//         </Link>

//         <div className="flex items-center justify-between mb-2">
//           <p className="text-sm text-gray-600">{phone.brand}</p>
//           {/* Condition Badge in Content Area */}
//           {phone.condition && (
//             <span
//               className={`px-2 py-1 rounded-full text-xs font-medium border ${getConditionBadgeColor(
//                 phone.condition
//               )}`}
//             >
//               {formatCondition(phone.condition)}
//             </span>
//           )}
//         </div>

//         <div className="flex items-center mb-3">
//           <div className="flex items-center text-yellow-400">
//             <FaStar />
//             <span className="ml-1 text-sm text-gray-700">
//               {ratingValue.toFixed(1)}
//             </span>
//           </div>
//           {phone.rating?.count > 0 && (
//             <span className="ml-2 text-xs text-gray-500">
//               ({phone.rating.count} reviews)
//             </span>
//           )}
//         </div>

//         <div className="flex items-center justify-between mb-4">
//           <div>
//             <span className="text-2xl font-bold text-gray-900">
//               ${phone.price}
//             </span>
//             {phone.originalPrice && phone.originalPrice > phone.price && (
//               <span className="ml-2 text-sm text-gray-500 line-through">
//                 ${phone.originalPrice}
//               </span>
//             )}
//           </div>
//         </div>

//         <button
//           onClick={handleAddToCart}
//           className={`w-full py-2 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center ${
//             phone.inStock !== false
//               ? "bg-yellow-400 text-black hover:bg-yellow-500"
//               : "bg-gray-300 text-gray-500 cursor-not-allowed"
//           }`}
//           disabled={phone.inStock === false}
//         >
//           <FaShoppingCart className="mr-2" />
//           {phone.inStock !== false ? "Add to Cart" : "Out of Stock"}
//         </button>
//       </div>
//     </div>
//   );
// };

// PhoneCard.propTypes = {
//   phone: PropTypes.shape({
//     id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
//     _id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
//     name: PropTypes.string.isRequired,
//     brand: PropTypes.string,
//     price: PropTypes.number.isRequired,
//     originalPrice: PropTypes.number,
//     condition: PropTypes.string, // Add condition to PropTypes
//     image: PropTypes.string,
//     images: PropTypes.arrayOf(
//       PropTypes.shape({
//         url: PropTypes.string,
//       })
//     ),
//     rating: PropTypes.oneOfType([
//       PropTypes.number,
//       PropTypes.shape({
//         average: PropTypes.number,
//         count: PropTypes.number,
//       }),
//     ]),
//     featured: PropTypes.bool,
//     inStock: PropTypes.bool,
//   }).isRequired,
// };

// export default PhoneCard;
