import React, { useState } from "react";
import { FaStar } from "react-icons/fa";

const ReviewForm = ({ phoneId, phoneName, onSubmitReview, onCancel }) => {
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!rating || !title || !comment || !userName || !userEmail) {
      alert("Please fill in all fields");
      return;
    }

    if (rating < 1 || rating > 5) {
      alert("Please select a rating");
      return;
    }

    setIsSubmitting(true);

    try {
      const reviewData = {
        phoneId,
        phoneName,
        rating,
        title: title.trim(),
        comment: comment.trim(),
        userName: userName.trim(),
        userEmail: userEmail.trim().toLowerCase(),
      };

      await onSubmitReview(reviewData);

      // Reset form
      setRating(0);
      setTitle("");
      setComment("");
      setUserName("");
      setUserEmail("");

      alert(
        "Review submitted successfully! It will be visible after admin approval."
      );
      onCancel();
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("Failed to submit review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-neutral-900/50 rounded-2xl border border-neutral-800 p-6">
      <h3 className="text-xl font-semibold text-white mb-6">Write a Review</h3>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Rating */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Rating *
          </label>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                className="text-2xl transition-colors"
              >
                <FaStar
                  className={
                    star <= (hoveredRating || rating)
                      ? "text-yellow-400"
                      : "text-gray-600"
                  }
                />
              </button>
            ))}
            <span className="ml-2 text-gray-400">
              {rating > 0 && `${rating} star${rating > 1 ? "s" : ""}`}
            </span>
          </div>
        </div>

        {/* User Name */}
        <div>
          <label
            htmlFor="userName"
            className="block text-sm font-medium text-gray-300 mb-2"
          >
            Your Name *
          </label>
          <input
            type="text"
            id="userName"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            placeholder="Enter your name"
            required
          />
        </div>

        {/* User Email */}
        <div>
          <label
            htmlFor="userEmail"
            className="block text-sm font-medium text-gray-300 mb-2"
          >
            Your Email *
          </label>
          <input
            type="email"
            id="userEmail"
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}
            className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            placeholder="Enter your email"
            required
          />
        </div>

        {/* Review Title */}
        <div>
          <label
            htmlFor="reviewTitle"
            className="block text-sm font-medium text-gray-300 mb-2"
          >
            Review Title *
          </label>
          <input
            type="text"
            id="reviewTitle"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            placeholder="Summarize your review"
            maxLength={100}
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            {title.length}/100 characters
          </p>
        </div>

        {/* Review Comment */}
        <div>
          <label
            htmlFor="reviewComment"
            className="block text-sm font-medium text-gray-300 mb-2"
          >
            Your Review *
          </label>
          <textarea
            id="reviewComment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 resize-none"
            placeholder="Share your experience with this phone..."
            maxLength={500}
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            {comment.length}/500 characters
          </p>
        </div>

        {/* Buttons */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-colors ${
              isSubmitting
                ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                : "bg-yellow-400 text-black hover:bg-yellow-500"
            }`}
          >
            {isSubmitting ? "Submitting..." : "Submit Review"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-3 px-6 rounded-lg font-semibold bg-neutral-800 text-gray-300 hover:bg-neutral-700 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReviewForm;
