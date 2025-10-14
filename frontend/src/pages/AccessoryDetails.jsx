import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaStar, FaShoppingCart, FaArrowLeft, FaHeart } from "react-icons/fa";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useCart } from "../context/CartContex";
import {
  getAccessoryById,
  getReviewsForAccessory,
  submitAccessoryReview,
  hasUserReviewedAccessory,
} from "../utils/firebaseApi";
import Navbar from "../components/Navbar";
import ReviewForm from "../components/ReviewForm";
import ReviewsList from "../components/ReviewsList";

gsap.registerPlugin(ScrollTrigger);

const AccessoryDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem, isItemInCart } = useCart();

  const [accessory, setAccessory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");

  // Review states
  const [reviews, setReviews] = useState([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [userHasReviewed, setUserHasReviewed] = useState(false);

  // Refs for animations
  const containerRef = useRef(null);
  const imageRef = useRef(null);
  const contentRef = useRef(null);
  const specsRef = useRef(null);

  const fetchReviews = useCallback(async (accessoryId) => {
    setReviewsLoading(true);
    try {
      const reviewsData = await getReviewsForAccessory(accessoryId);
      setReviews(reviewsData);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setReviewsLoading(false);
    }
  }, []);

  const fetchAccessoryDetails = useCallback(
    async (accessoryId) => {
      try {
        const accessoryData = await getAccessoryById(accessoryId);
        setAccessory(accessoryData);

        if (accessoryData.colors?.length > 0) {
          setSelectedColor(accessoryData.colors[0]);
        }

        // Fetch reviews
        await fetchReviews(accessoryId);
      } catch (error) {
        console.error("Error fetching accessory details:", error);
        setAccessory(null);
      } finally {
        setLoading(false);
      }
    },
    [fetchReviews]
  );

  const handleSubmitReview = async (reviewData) => {
    try {
      // Add accessoryId instead of phoneId
      const accessoryReviewData = {
        ...reviewData,
        accessoryId: id,
        accessoryName: accessory.name,
      };

      // Remove phoneId and phoneName if they exist
      delete accessoryReviewData.phoneId;
      delete accessoryReviewData.phoneName;

      await submitAccessoryReview(accessoryReviewData);

      // Check if user has reviewed after submission
      const hasReviewed = await hasUserReviewedAccessory(
        id,
        reviewData.userEmail
      );
      setUserHasReviewed(hasReviewed);

      // Refresh reviews (though new review won't show until approved)
      await fetchReviews(id);
    } catch (error) {
      console.error("Error submitting review:", error);
      throw error;
    }
  };

  const handleWriteReview = async () => {
    // For demo purposes, we'll just show the form
    // In a real app, you'd check if user is logged in
    setShowReviewForm(true);
  };

  useEffect(() => {
    fetchAccessoryDetails(id);
  }, [id, fetchAccessoryDetails]);

  useEffect(() => {
    if (!loading && accessory) {
      const ctx = gsap.context(() => {
        // Animate container entrance
        gsap.fromTo(
          containerRef.current,
          { opacity: 0, y: 50 },
          { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
        );

        // Animate image gallery
        gsap.fromTo(
          imageRef.current,
          { opacity: 0, x: -50 },
          { opacity: 1, x: 0, duration: 0.8, delay: 0.2, ease: "power2.out" }
        );

        // Animate content
        gsap.fromTo(
          contentRef.current,
          { opacity: 0, x: 50 },
          { opacity: 1, x: 0, duration: 0.8, delay: 0.3, ease: "power2.out" }
        );

        // Animate specifications
        if (specsRef.current) {
          gsap.fromTo(
            specsRef.current,
            { opacity: 0, y: 30 },
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              delay: 0.5,
              ease: "power2.out",
              scrollTrigger: {
                trigger: specsRef.current,
                start: "top 80%",
                toggleActions: "play none none reverse",
              },
            }
          );
        }
      }, containerRef);

      return () => ctx.revert();
    }
  }, [loading, accessory]);

  // Calculate average rating from reviews
  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : 0;

  const formatCondition = (condition) => {
    if (!condition) return "";
    return condition
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

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

  const formatCategory = (category) => {
    if (!category) return "";
    return category
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const handleAddToCart = () => {
    if (!accessory.inStock || isItemInCart(accessory.id)) return;

    const cartItem = {
      id: accessory.id,
      name: accessory.name,
      brand: accessory.brand,
      price: accessory.price,
      originalPrice: accessory.originalPrice,
      image:
        accessory.images?.[selectedImage]?.url || accessory.images?.[0]?.url,
      images: accessory.images,
      condition: accessory.condition,
      selectedColor,
      quantity,
      inStock: accessory.inStock,
      category: accessory.category,
      type: "accessory",
    };

    addItem(cartItem);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-neutral-950 to-neutral-900 text-white">
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-yellow-400"></div>
        </div>
      </div>
    );
  }

  if (!accessory) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-neutral-950 to-neutral-900 text-white">
        <Navbar />
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Accessory not found</h2>
            <button
              onClick={() => navigate("/accessories")}
              className="bg-yellow-400 text-black px-6 py-2 rounded-lg font-semibold hover:bg-yellow-500 transition-colors"
            >
              Back to Accessories
            </button>
          </div>
        </div>
      </div>
    );
  }

  const discount = accessory.originalPrice
    ? Math.round(
        ((accessory.originalPrice - accessory.price) /
          accessory.originalPrice) *
          100
      )
    : 0;

  const isInCart = isItemInCart(accessory.id);

  // Extracted button label logic
  let addToCartLabel = "Add to Cart";
  if (!accessory.inStock) {
    addToCartLabel = "Out of Stock";
  } else if (isInCart) {
    addToCartLabel = "Added to Cart";
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-neutral-950 to-neutral-900 text-white">
      {/* Background Effects */}
      <div className="pointer-events-none absolute inset-0 opacity-30 [background:radial-gradient(circle_at_25%_15%,rgba(234,179,8,0.14),transparent_60%)]" />

      <div
        ref={containerRef}
        className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10"
      >
        {/* Back Button */}
        <button
          onClick={() => navigate("/accessories")}
          className="group flex items-center gap-2 mb-8 text-yellow-400 hover:text-yellow-300 transition-colors"
        >
          <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
          <span>Back to Accessories</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Image Gallery */}
          <div ref={imageRef} className="space-y-4">
            {/* Main Image */}
            <div className="relative bg-neutral-900/50 rounded-2xl overflow-hidden border border-neutral-800">
              <img
                src={
                  accessory.images?.[selectedImage]?.url ||
                  accessory.images?.[0]?.url
                }
                alt={accessory.images?.[selectedImage]?.alt || accessory.name}
                className="w-full h-96 lg:h-[500px] object-cover"
                onError={(e) => {
                  e.target.src = "/placeholder-accessory.jpg";
                }}
              />

              {/* Badges on Image */}
              {discount > 0 && (
                <span className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-lg text-sm font-bold">
                  -{discount}%
                </span>
              )}
              {accessory.featured && (
                <span className="absolute top-4 left-4 bg-yellow-400 text-black px-3 py-1 rounded-lg text-sm font-bold">
                  Featured
                </span>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {accessory.images && accessory.images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {accessory.images.map((image, index) => (
                  <button
                    key={image.url}
                    onClick={() => setSelectedImage(index)}
                    className={`relative bg-neutral-900/50 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === index
                        ? "border-yellow-400 shadow-lg shadow-yellow-400/20"
                        : "border-neutral-700 hover:border-neutral-600"
                    }`}
                  >
                    <img
                      src={image.url}
                      alt={image.alt || `${accessory.name} ${index + 1}`}
                      className="w-full h-20 object-cover"
                      onError={(e) => {
                        e.target.src = "/placeholder-accessory.jpg";
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div ref={contentRef} className="space-y-6">
            {/* Header */}
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-yellow-400 text-sm font-medium">
                  {formatCategory(accessory.category)}
                </span>
                {accessory.brand && (
                  <span className="text-gray-400 text-sm font-medium">
                    {accessory.brand}
                  </span>
                )}
                {accessory.condition && (
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium border ${getConditionBadgeColor(
                      accessory.condition
                    )}`}
                  >
                    {formatCondition(accessory.condition)}
                  </span>
                )}
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                {accessory.name}
              </h1>

              {/* Rating */}
              {reviews.length > 0 && (
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <FaStar
                        key={`star-${i}-${accessory.id}`}
                        className={
                          i < Math.floor(averageRating)
                            ? "text-yellow-400"
                            : "text-gray-600"
                        }
                      />
                    ))}
                    <span className="ml-2 text-white">
                      {averageRating.toFixed(1)}
                    </span>
                  </div>
                  <span className="text-gray-400">
                    ({reviews.length} review{reviews.length !== 1 ? "s" : ""})
                  </span>
                </div>
              )}
            </div>

            {/* Price */}
            <div className="flex items-center gap-4">
              <span className="text-3xl lg:text-4xl font-bold text-yellow-400">
                ${accessory.price}
              </span>
              {accessory.originalPrice &&
                accessory.originalPrice > accessory.price && (
                  <span className="text-xl text-gray-500 line-through">
                    ${accessory.originalPrice}
                  </span>
                )}
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-3">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  accessory.inStock
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {accessory.inStock ? "In Stock" : "Out of Stock"}
              </span>
              {accessory.stockQuantity && accessory.inStock && (
                <span className="text-gray-400 text-sm">
                  {accessory.stockQuantity} units available
                </span>
              )}
            </div>

            {/* Color Selection */}
            {accessory.colors && accessory.colors.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-3">Color</h3>
                <div className="flex flex-wrap gap-2">
                  {accessory.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 rounded-lg border transition-all ${
                        selectedColor === color
                          ? "border-yellow-400 bg-yellow-400/10 text-yellow-400"
                          : "border-neutral-700 text-gray-300 hover:border-neutral-600"
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Key Features */}
            {accessory.features && accessory.features.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-3">Key Features</h3>
                <div className="flex flex-wrap gap-2">
                  {accessory.features.map((feature) => (
                    <span
                      key={feature}
                      className="px-3 py-1 bg-neutral-800 rounded-full text-sm text-gray-300"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity & Actions */}
            <div className="flex items-center gap-4 pt-4">
              <div className="flex items-center gap-2">
                <label
                  htmlFor="quantity-select"
                  className="text-sm font-medium"
                >
                  Qty:
                </label>
                <select
                  id="quantity-select"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-white"
                  disabled={!accessory.inStock}
                >
                  {[...Array(Math.min(accessory.stockQuantity || 10, 10))].map(
                    (_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1}
                      </option>
                    )
                  )}
                </select>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={!accessory.inStock || isInCart}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-colors ${
                  !accessory.inStock || isInCart
                    ? "bg-neutral-800 text-gray-500 cursor-not-allowed"
                    : "bg-yellow-400 text-black hover:bg-yellow-500"
                }`}
              >
                <FaShoppingCart />
                {addToCartLabel}
              </button>

              <button className="p-3 border border-neutral-700 rounded-lg text-gray-400 hover:text-yellow-400 hover:border-yellow-400 transition-colors">
                <FaHeart />
              </button>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div
          ref={specsRef}
          className="bg-neutral-900/50 rounded-2xl border border-neutral-800 overflow-hidden"
        >
          {/* Tab Headers */}
          <div className="flex border-b border-neutral-800">
            {["description", "specifications", "reviews"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                  activeTab === tab
                    ? "text-yellow-400 border-b-2 border-yellow-400 bg-neutral-800/50"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                {tab === "reviews" && reviews.length > 0 && (
                  <span className="ml-1">({reviews.length})</span>
                )}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === "description" && (
              <div className="prose prose-invert max-w-none">
                <p className="text-gray-300 leading-relaxed">
                  {accessory.description}
                </p>
              </div>
            )}

            {activeTab === "specifications" && accessory.specifications && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {Object.entries(accessory.specifications).map(
                  ([category, specs]) => (
                    <div key={category}>
                      <h3 className="text-lg font-semibold text-yellow-400 mb-4 capitalize">
                        {category}
                      </h3>
                      <div className="space-y-2">
                        {Object.entries(specs).map(([key, value]) => (
                          <div
                            key={key}
                            className="flex justify-between py-2 border-b border-neutral-800 last:border-b-0"
                          >
                            <span className="text-gray-400 capitalize">
                              {key.replace(/([A-Z])/g, " $1").trim()}:
                            </span>
                            <span className="text-white font-medium">
                              {value}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                )}
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="space-y-6">
                {/* Write Review Button */}
                {!showReviewForm && !userHasReviewed && (
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-white">
                      Customer Reviews
                    </h3>
                    <button
                      onClick={handleWriteReview}
                      className="bg-yellow-400 text-black px-4 py-2 rounded-lg font-semibold hover:bg-yellow-500 transition-colors"
                    >
                      Write a Review
                    </button>
                  </div>
                )}

                {userHasReviewed && (
                  <div className="bg-blue-900/20 border border-blue-800 rounded-lg p-4">
                    <p className="text-blue-300">
                      Thank you for your review! It's currently pending approval
                      and will be visible once approved by our team.
                    </p>
                  </div>
                )}

                {/* Review Form */}
                {showReviewForm && (
                  <ReviewForm
                    phoneId={accessory.id} // Using phoneId prop for compatibility
                    phoneName={accessory.name} // Using phoneName prop for compatibility
                    onSubmitReview={handleSubmitReview}
                    onCancel={() => setShowReviewForm(false)}
                  />
                )}

                {/* Reviews List */}
                {reviewsLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-yellow-400 mx-auto"></div>
                  </div>
                ) : (
                  <ReviewsList reviews={reviews} />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccessoryDetails;
