import React, { useState, useEffect, useMemo } from "react";
import PhoneCard from "../components/PhoneCard";
import { getPhones, getBrands } from "../utils/api";

const Phones = () => {
  const [phones, setPhones] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filters, setFilters] = useState({
    page: 1,
    limit: 12,
    search: "",
    category: "",
    minPrice: "",
    maxPrice: "",
    sortBy: "created_at", // <-- change to snake_case
    sortOrder: "desc",
  });

  // Fetch phones from Firebase
  useEffect(() => {
    const fetchPhones = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch phones with sorting
        const response = await getPhones({
          sortBy: filters.sortBy,
          sortOrder: filters.sortOrder,
        });

        setPhones(response.data || []);
      } catch (err) {
        console.error("Error fetching phones:", err);
        setError("Failed to load phones. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchPhones();
  }, [filters.sortBy, filters.sortOrder]);

  // Fetch available brands
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const brandsList = await getBrands();
        setBrands(brandsList);
      } catch (err) {
        console.error("Error fetching brands:", err);
      }
    };

    fetchBrands();
  }, []);

  // Client-side filtering for search
  const filteredPhones = useMemo(() => {
    let result = [...phones];

    // Search filter
    if (filters.search.trim()) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(
        (phone) =>
          phone.name?.toLowerCase().includes(searchLower) ||
          phone.brand?.toLowerCase().includes(searchLower) ||
          phone.model?.toLowerCase().includes(searchLower)
      );
    }

    return result;
  }, [phones, filters.search]);

  // Pagination
  const totalItems = filteredPhones.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / filters.limit));
  const currentPage = Math.min(filters.page, totalPages);
  const startIndex = (currentPage - 1) * filters.limit;
  const paginatedPhones = filteredPhones.slice(
    startIndex,
    startIndex + filters.limit
  );

  const handleFilterChange = (newFilters) => {
    setFilters((prev) => {
      const next = { ...prev, ...newFilters };
      // Reset to page 1 if not just changing page
      const isPageChange =
        Object.keys(newFilters).length === 1 && "page" in newFilters;
      if (!isPageChange) {
        next.page = 1;
      }
      return next;
    });
  };

  const handleResetFilters = () => {
    setFilters({
      page: 1,
      limit: 12,
      search: "",
      category: "",
      minPrice: "",
      maxPrice: "",
      sortBy: "created_at", // <-- change to snake_case
      sortOrder: "desc",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-24 w-24 border-b-4 border-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading phones...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">⚠️</div>
          <p className="text-gray-800 font-semibold mb-2">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Mobile Phones
          </h1>
          <p className="text-gray-600">
            Discover our latest collection of smartphones
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 bg-white p-6 rounded-lg shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <input
              type="text"
              placeholder="Search phones..."
              value={filters.search}
              onChange={(e) => handleFilterChange({ search: e.target.value })}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />

            {/* Sort By */}
            <select
              value={filters.sortBy}
              onChange={(e) => handleFilterChange({ sortBy: e.target.value })}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="createdAt">Newest First</option>
              <option value="price">Price</option>
              <option value="name">Name</option>
              <option value="rating.average">Rating</option>
            </select>

            {/* Sort Order */}
            <select
              value={filters.sortOrder}
              onChange={(e) =>
                handleFilterChange({ sortOrder: e.target.value })
              }
              className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="desc">High to Low</option>
              <option value="asc">Low to High</option>
            </select>
          </div>

          {/* Reset Filters */}
          {filters.search && (
            <div className="mt-4">
              <button
                onClick={handleResetFilters}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-gray-600">
            Showing {startIndex + 1}-
            {Math.min(startIndex + filters.limit, totalItems)} of {totalItems}{" "}
            phones
          </p>
          {phones.length === 0 && (
            <p className="text-amber-600">
              No phones added yet. Add phones from admin panel.
            </p>
          )}
        </div>

        {/* Phone Grid */}
        {paginatedPhones.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {paginatedPhones.map((phone) => (
              <PhoneCard
                key={phone.id || phone._id}
                phone={{
                  ...phone,
                  image: phone.images?.[0]?.url || phone.image,
                  images: phone.images || [],
                }}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg">
            <p className="text-gray-500 text-lg mb-2">No phones found</p>
            <p className="text-gray-400">
              {filters.search
                ? "Try adjusting your filters"
                : "Add phones from the admin panel to display them here"}
            </p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-2">
            <button
              onClick={() =>
                handleFilterChange({ page: Math.max(1, currentPage - 1) })
              }
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-lg bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
              const pageNum = i + 1;
              return (
                <button
                  key={pageNum}
                  onClick={() => handleFilterChange({ page: pageNum })}
                  className={`px-4 py-2 rounded-lg ${
                    currentPage === pageNum
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            {totalPages > 5 && (
              <>
                <span className="px-2">...</span>
                <button
                  onClick={() => handleFilterChange({ page: totalPages })}
                  className={`px-4 py-2 rounded-lg ${
                    currentPage === totalPages
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {totalPages}
                </button>
              </>
            )}

            <button
              onClick={() =>
                handleFilterChange({
                  page: Math.min(totalPages, currentPage + 1),
                })
              }
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-lg bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Phones;
