import { supabase } from "../config/supabase";

// Phones
export const getPhones = async (filters = {}) => {
  let query = supabase.from("phones").select("*");

  if (filters.brand) query = query.eq("brand", filters.brand);
  if (filters.category) query = query.eq("category", filters.category);
  if (filters.featured !== undefined) query = query.eq("featured", filters.featured);
  if (filters.inStock !== undefined) query = query.eq("inStock", filters.inStock); // changed to camelCase

  // Sorting
  const sortField = filters.sortBy || "created_at"; // <-- keep created_at if column exists
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
    .eq("isActive", true) // changed to camelCase
    .order("created_at", { ascending: false })
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
    .eq("isActive", true) // changed to camelCase
    .order("created_at", { ascending: false })
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

// --- Reviews (match current Supabase schema: phoneId, userName, userEmail, created_at, updated_at) ---

export const getReviewsForPhone = async (phoneId) => {
  try {
    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .eq("phoneId", phoneId) // use camelCase column present in your table
      .eq("status", "approved")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return (data || []).map((r) => ({
      id: r.id,
      title: r.title ?? null,
      rating: r.rating,
      comment: r.comment,
      status: r.status,
      type: r.type,
      createdAt: r.created_at ?? r.createdAt,
      updatedAt: r.updated_at ?? r.updatedAt,
      userName: r.userName ?? r.user_name ?? null,
      userEmail: r.userEmail ?? r.user_email ?? null,
      phoneId: r.phoneId ?? r.phone_id ?? null,
      phoneName: r.phoneName ?? null,
      accessoryId: r.accessory_id ?? r.accessoryId ?? null,
    }));
  } catch (err) {
    console.error("getReviewsForPhone error:", err);
    return [];
  }
};

export const getReviewsForAccessory = async (accessoryId) => {
  try {
    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .eq("accessory_id", accessoryId) // accessory_id remains uuid in your table
      .eq("status", "approved")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return (data || []).map((r) => ({
      id: r.id,
      title: r.title ?? null,
      rating: r.rating,
      comment: r.comment,
      status: r.status,
      type: r.type,
      createdAt: r.created_at ?? r.createdAt,
      updatedAt: r.updated_at ?? r.updatedAt,
      userName: r.userName ?? r.user_name ?? null,
      userEmail: r.userEmail ?? r.user_email ?? null,
      accessoryId: r.accessory_id ?? r.accessoryId ?? null,
      phoneId: r.phoneId ?? r.phone_id ?? null,
      phoneName: r.phoneName ?? null,
    }));
  } catch (err) {
    console.error("getReviewsForAccessory error:", err);
    return [];
  }
};

export const submitReview = async (reviewData) => {
  // preserve title (DB has title column per your screenshot) and use columns matching your table
  const payload = {
    status: "pending",
    type: "phone",
    created_at: new Date().toISOString(), // column exists
    updated_at: new Date().toISOString(),
    rating: reviewData.rating,
    title: reviewData.title || null,
    comment: reviewData.comment || null,
    userName: reviewData.userName || null,
    userEmail: reviewData.userEmail || null,
    phoneId: reviewData.phoneId ?? null,
    phoneName: reviewData.phoneName ?? null,
  };

  const { error } = await supabase.from("reviews").insert([payload]);
  if (error) {
    console.error("submitReview error:", error);
    throw error;
  }
  return true;
};

export const submitAccessoryReview = async (reviewData) => {
  const payload = {
    status: "pending",
    type: "accessory",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    rating: reviewData.rating,
    title: reviewData.title || null,
    comment: reviewData.comment || null,
    userName: reviewData.userName || null,
    userEmail: reviewData.userEmail || null,
    accessory_id: reviewData.accessoryId ?? null,
  };

  const { error } = await supabase.from("reviews").insert([payload]);
  if (error) {
    console.error("submitAccessoryReview error:", error);
    throw error;
  }
  return true;
};

export const hasUserReviewed = async (productId, userEmail, type = "phone") => {
  const field = type === "phone" ? "phoneId" : "accessory_id";
  try {
    const { data, error } = await supabase
      .from("reviews")
      .select("id")
      .eq(field, productId)
      .eq("userEmail", userEmail) // userEmail column exists in your table
      .limit(1);

    if (error) throw error;
    return !!(data && data.length);
  } catch (err) {
    console.error("hasUserReviewed error:", err);
    return false;
  }
};

export const hasUserReviewedAccessory = async (accessoryId, userEmail) =>
  hasUserReviewed(accessoryId, userEmail, "accessory");

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
