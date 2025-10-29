import React, { useState, useEffect } from "react";
import AccessoryCard from "../components/AccessoryCard";
import { getAccessories, getAccessoryCategories } from "../utils/api";

const Accessories = () => {
  const [accessories, setAccessories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    page: 1,
    limit: 12,
    search: "",
    brand: "",
    category: "",
    minPrice: "",
    maxPrice: "",
    sortBy: "created_at", // <-- use snake_case for Supabase
    sortOrder: "desc",
  });
  const [pagination, setPagination] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [accessoriesResponse, categoriesResponse] = await Promise.all([
          getAccessories(filters),
          getAccessoryCategories(),
        ]);
        setAccessories(accessoriesResponse.data || []);
        setPagination(accessoriesResponse.pagination || {});
        setCategories(categoriesResponse.data || []);
      } catch (error) {
        console.error("Error fetching accessories:", error);
        setError("Failed to load accessories");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filters]);

  const handleFilterChange = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }));
  };

  const formatCategoryName = (category) => {
    return category
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Mobile Accessories
          </h1>
          <p className="text-gray-600">
            Complete your mobile experience with our premium accessories
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 bg-white p-6 rounded-lg shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="Search accessories..."
              value={filters.search}
              onChange={(e) => handleFilterChange({ search: e.target.value })}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange({ category: e.target.value })}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {formatCategoryName(category)}
                </option>
              ))}
            </select>
            <select
              value={filters.sortBy}
              onChange={(e) => handleFilterChange({ sortBy: e.target.value })}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="created_at">Newest First</option>
              <option value="price">Price: Low to High</option>
              <option value="name">Name: A to Z</option>
              <option value="rating_average">Highest Rated</option>
            </select>
            <select
              value={filters.sortOrder}
              onChange={(e) =>
                handleFilterChange({ sortOrder: e.target.value })
              }
              className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="desc">Descending</option>
              <option value="asc">Ascending</option>
            </select>
          </div>
        </div>

        {error ? (
          <div className="text-center py-8">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
            <button
              onClick={() => window.location.reload()}
              className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : (
          <>
            {/* Results */}
            <div className="mb-6">
              <p className="text-gray-600">
                {pagination.totalItems
                  ? `Showing ${accessories.length} of ${pagination.totalItems} accessories`
                  : "No accessories found"}
              </p>
            </div>

            {/* Accessories Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {accessories.length > 0 ? (
                accessories.map((accessory) => (
                  <AccessoryCard key={accessory.id || accessory._id} accessory={accessory} />
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-500 text-lg">
                    No accessories found matching your criteria
                  </p>
                </div>
              )}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center space-x-2">
                {[...Array(pagination.totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => handleFilterChange({ page: i + 1 })}
                    className={`px-4 py-2 rounded-lg ${
                      pagination.currentPage === i + 1
                        ? "bg-purple-600 text-white"
                        : "bg-white text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Accessories;
