import React from "react";
import { FaStar } from "react-icons/fa";

const ReviewsList = ({ reviews }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (reviews.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-400">
          No reviews yet. Be the first to review this phone!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <div
          key={review.id}
          className="bg-neutral-800/50 rounded-lg p-6 border border-neutral-700"
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div>
              <h4 className="font-semibold text-white mb-1">{review.title}</h4>
              <div className="flex items-center gap-2 mb-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      className={
                        i < review.rating
                          ? "text-yellow-400 w-4 h-4"
                          : "text-gray-600 w-4 h-4"
                      }
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-400">
                  {review.rating} out of 5 stars
                </span>
              </div>
            </div>
            <span className="text-sm text-gray-500">
              {formatDate(review.createdAt)}
            </span>
          </div>

          {/* Review Content */}
          <p className="text-gray-300 leading-relaxed mb-3">{review.comment}</p>

          {/* Reviewer Info */}
          <div className="flex items-center justify-between pt-3 border-t border-neutral-700">
            <span className="text-sm text-gray-400">By {review.userName}</span>
            {review.status === "approved" && (
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                Verified Review
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReviewsList;
