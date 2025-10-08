import React, { useState, useEffect, useMemo } from "react";
import PhoneCard from "../components/PhoneCard";
import promax from "../images/17_Pro_Max.jpg";
import pro15 from "../images/17_pro.jpg";

// Set to true later when backend/Firebase is ready
const USE_API = false;

const Phones = () => {
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    page: 1,
    limit: 12,
    search: "",
    brand: "",
    category: "",
    minPrice: "",
    maxPrice: "",
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  // Local sample data
  const sampleIphones = useMemo(
    () => [
      {
        _id: "sample-iphone-15-pro-max",
        name: "iPhone 15 Pro Max",
        brand: "Apple",
        price: 1199,
        originalPrice: 1299,
        featured: true,
        inStock: true,
        rating: 4.9,
        images: [promax],
        // image: promax,
        createdAt: "2024-09-20",
      },
      {
        _id: "sample-iphone-15-pro",
        name: "iPhone 15 Pro",
        brand: "Apple",
        price: 999,
        originalPrice: 1099,
        featured: true,
        inStock: true,
        rating: 4.8,
        images: [pro15],
        // image: pro15,
        createdAt: "2024-09-20",
      },
      {
        _id: "sample-iphone-15-plus",
        name: "iPhone 15 Plus",
        brand: "Apple",
        price: 899,
        originalPrice: 949,
        featured: true,
        inStock: true,
        rating: 4.7,
        images: [
          "https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-15-plus-pink",
        ],
        // image:
        //   "https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-15-plus-pink",
        createdAt: "2024-09-10",
      },
      {
        _id: "sample-iphone-15",
        name: "iPhone 15",
        brand: "Apple",
        price: 799,
        originalPrice: 849,
        featured: true,
        inStock: true,
        rating: 4.7,
        images: [
          "https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-15-blue",
        ],
        image:
          "https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-15-blue",
        createdAt: "2024-09-10",
      },
    ],
    []
  );

  // Simulate initial load
  useEffect(() => {
    let t = setTimeout(() => setLoading(false), 200);
    return () => clearTimeout(t);
  }, []);

  // Local filtered + sorted list
  const processed = useMemo(() => {
    let list = [...sampleIphones];

    // Search
    if (filters.search.trim()) {
      const q = filters.search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.brand || "").toLowerCase().includes(q)
      );
    }

    // Brand filter
    if (filters.brand) {
      list = list.filter((p) => p.brand === filters.brand);
    }

    // Price filters
    if (filters.minPrice) {
      list = list.filter((p) => p.price >= Number(filters.minPrice));
    }
    if (filters.maxPrice) {
      list = list.filter((p) => p.price <= Number(filters.maxPrice));
    }

    // Sort
    const dir = filters.sortOrder === "asc" ? 1 : -1;
    list.sort((a, b) => {
      switch (filters.sortBy) {
        case "price":
          return (a.price - b.price) * dir;
        case "name":
          return a.name.localeCompare(b.name) * dir;
        case "rating.average":
          return ((a.rating || 0) - (b.rating || 0)) * dir;
        case "createdAt":
        default:
          return (
            (new Date(a.createdAt || 0) - new Date(b.createdAt || 0)) * dir
          );
      }
    });

    return list;
  }, [sampleIphones, filters]);

  // Pagination
  const totalItems = processed.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / filters.limit));
  const currentPage = Math.min(filters.page, totalPages);
  const start = (currentPage - 1) * filters.limit;
  const pageItems = processed.slice(start, start + filters.limit);

  const handleFilterChange = (newFilters) => {
    setFilters((prev) => {
      const next = { ...prev, ...newFilters };
      // Reset page only if search/brand/sort changed (not when clicking page)
      const pageChangingOnly =
        Object.keys(newFilters).length === 1 && "page" in newFilters;
      if (!pageChangingOnly) next.page = 1;
      return next;
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <output className="animate-spin rounded-full h-24 w-24 border-b-4 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Mobile Phones
          </h1>
          <p className="text-gray-600">
            {USE_API
              ? "Discover the latest smartphones"
              : "Showing sample iPhones (add backend to replace)"}
          </p>
        </div>

        <div className="mb-8 bg-white p-6 rounded-lg shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="Search phones..."
              value={filters.search}
              onChange={(e) => handleFilterChange({ search: e.target.value })}
              className="md:col-span-2 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
<<<<<<< Updated upstream

=======
            <select
              value={filters.brand}
              onChange={(e) => handleFilterChange({ brand: e.target.value })}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Brands</option>
              <option value="Apple">Apple</option>
            </select>
>>>>>>> Stashed changes
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

            <select
              value={filters.sortOrder}
              onChange={(e) =>
                handleFilterChange({ sortOrder: e.target.value })
              }
              className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="desc">Descending</option>
              <option value="asc">Ascending</option>
            </select>
          </div>
        </div>

        <div className="mb-6">
          <p className="text-gray-600">
            Showing {pageItems.length} of {totalItems} sample phones
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {pageItems.map((phone) => {
            const img =
              phone.image ||
              (Array.isArray(phone.images) ? phone.images[0] : undefined);
            return (
              <PhoneCard
                key={phone._id}
                phone={{
                  ...phone,
                  image: img,
                  images: phone.images || [img],
                }}
              />
            );
          })}
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center space-x-2">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i + 1}
                onClick={() => handleFilterChange({ page: i + 1 })}
                className={`px-4 py-2 rounded-lg ${
                  currentPage === i + 1
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Phones;
