import { supabase } from "../config/supabase";

// Phones
export const getPhones = async (filters = {}) => {
  let query = supabase.from("phones").select("*");

  if (filters.brand) query = query.eq("brand", filters.brand);
  if (filters.category) query = query.eq("category", filters.category);
  if (filters.featured !== undefined) query = query.eq("featured", filters.featured);
  if (filters.inStock !== undefined) query = query.eq("in_stock", filters.inStock);

  // Sorting
  const sortField = filters.sortBy || "created_at"; // <-- snake_case
  const sortOrder = filters.sortOrder === "asc" ? { ascending: true } : { ascending: false };
  query = query.order(sortField, sortOrder);

  // Limit
  if (filters.limit) query = query.limit(filters.limit);

  const { data, error } = await query;
  if (error) throw error;
  return { data, total: data.length };
};

export const getPhoneById = async (id) => {
  const { data, error } = await supabase.from("phones").select("*").eq("id", id).single();
  if (error) throw error;
  return data;
};

export const getFeaturedPhones = async (limitCount = 8) => {
  const { data, error } = await supabase
    .from("phones")
    .select("*")
    .eq("featured", true)
    .eq("isActive", true) // <-- camelCase
    .order("created_at", { ascending: false }) // <-- snake_case
    .limit(limitCount);
  if (error) throw error;
  return { data };
};

export const getBrands = async () => {
  const { data, error } = await supabase.from("phones").select("brand");
  if (error) throw error;
  const brands = [...new Set(data.map((item) => item.brand))].filter(Boolean);
  return brands.sort((a, b) => a.localeCompare(b));
};

// Accessories
export const getAccessories = async (filters = {}) => {
  let query = supabase.from("accessories").select("*");
  if (filters.category) query = query.eq("category", filters.category);
  if (filters.featured !== undefined) query = query.eq("featured", filters.featured);

  const sortField = filters.sortBy || "created_at"; // <-- snake_case
  const sortOrder = filters.sortOrder === "asc" ? { ascending: true } : { ascending: false };
  query = query.order(sortField, sortOrder);

  if (filters.limit) query = query.limit(filters.limit);

  const { data, error } = await query;
  if (error) throw error;
  return { data };
};

export const getAccessoryById = async (id) => {
  const { data, error } = await supabase.from("accessories").select("*").eq("id", id).single();
  if (error) throw error;
  return data;
};

export const getFeaturedAccessories = async (limitCount = 8) => {
  const { data, error } = await supabase
    .from("accessories")
    .select("*")
    .eq("featured", true)
    .eq("isActive", true) // <-- camelCase
    .order("created_at", { ascending: false }) // <-- snake_case
    .limit(limitCount);
  if (error) throw error;
  return { data };
};

export const getAccessoryCategories = async () => {
  const { data, error } = await supabase.from("accessories").select("category");
  if (error) throw error;
  const categories = [...new Set(data.map((item) => item.category))].filter(Boolean);
  return categories.map((category) => ({
    value: category,
    label: category
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" "),
  }));
};

// Search
export const searchPhones = async (query, filters = {}) => {
  let { data, error } = await supabase
    .from("phones")
    .select("*")
    .ilike("name", `%${query}%`);
  if (error) throw error;
  return data;
};

export const searchAccessories = async (query, filters = {}) => {
  let { data, error } = await supabase
    .from("accessories")
    .select("*")
    .ilike("name", `%${query}%`);
  if (error) throw error;
  return data;
};

// Auth token management (optional, for Supabase Auth)
export const setAuthToken = (token) => {
  localStorage.setItem("token", token);
};

export const removeAuthToken = () => {
  localStorage.removeItem("token");
};

export const getAuthToken = () => {
  return localStorage.getItem("token");
};

// Reviews API functions for Accessories (Supabase version)
export const getReviewsForAccessory = async (accessoryId) => {
  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .eq("accessoryId", accessoryId)
    .eq("status", "approved")
    .order("createdAt", { ascending: false });
  if (error) throw error;
  return data || [];
};

export const submitAccessoryReview = async (reviewData) => {
  const { error } = await supabase
    .from("reviews")
    .insert([
      {
        ...reviewData,
        status: "pending", // Admin needs to approve
        type: "accessory",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ]);
  if (error) throw error;
  return true;
};

export const hasUserReviewedAccessory = async (accessoryId, userEmail) => {
  const { data, error } = await supabase
    .from("reviews")
    .select("id")
    .eq("accessoryId", accessoryId)
    .eq("userEmail", userEmail);
  if (error) throw error;
  return data && data.length > 0;
};

// Reviews API functions for Phones (Supabase version)
export const getReviewsForPhone = async (phoneId) => {
  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .eq("phoneId", phoneId)
    .eq("status", "approved")
    .order("createdAt", { ascending: false });
  if (error) throw error;
  return data || [];
};

export const submitReview = async (reviewData) => {
  const { error } = await supabase
    .from("reviews")
    .insert([
      {
        ...reviewData,
        status: "pending", // Admin needs to approve
        type: "phone",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ]);
  if (error) throw error;
  return true;
};

export const hasUserReviewed = async (phoneId, userEmail) => {
  const { data, error } = await supabase
    .from("reviews")
    .select("id")
    .eq("phoneId", phoneId)
    .eq("userEmail", userEmail);
  if (error) throw error;
  return data && data.length > 0;
};

const api = {
  getPhones,
  getPhoneById,
  getFeaturedPhones,
  getBrands,
  getAccessories,
  getAccessoryById,
  getFeaturedAccessories,
  getAccessoryCategories,
  searchPhones,
  searchAccessories,
  setAuthToken,
  removeAuthToken,
  getAuthToken,
  getReviewsForAccessory,
  submitAccessoryReview,
  hasUserReviewedAccessory,
  getReviewsForPhone,
  submitReview,
  hasUserReviewed,
};

export default api;
