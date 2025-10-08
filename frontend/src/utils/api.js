import {
  getPhones as getFirebasePhones,
  getFeaturedPhones as getFirebaseFeaturedPhones,
  getPhoneById as getFirebasePhoneById,
  getBrands as getFirebaseBrands,
  getAccessories as getFirebaseAccessories,
  getFeaturedAccessories as getFirebaseFeaturedAccessories,
  getAccessoryCategories as getFirebaseAccessoryCategories, // Add this
} from "./firebaseApi";

// Export Firebase functions directly
export const getPhones = getFirebasePhones;
export const getFeaturedPhones = getFirebaseFeaturedPhones;
export const getPhoneById = getFirebasePhoneById;
export const getPhone = getFirebasePhoneById; // Alias for compatibility
export const getBrands = getFirebaseBrands;
export const getAccessories = getFirebaseAccessories;
export const getFeaturedAccessories = getFirebaseFeaturedAccessories;
export const getAccessoryCategories = getFirebaseAccessoryCategories; // Add this

// Search methods using Firebase functions
export const searchPhones = async (query, filters = {}) => {
  const result = await getFirebasePhones({ ...filters, search: query });
  return result;
};

export const searchAccessories = async (query, filters = {}) => {
  const result = await getFirebaseAccessories({ ...filters, search: query });
  return result;
};

// Auth token management (keep for future use with Firebase Auth)
export const setAuthToken = (token) => {
  localStorage.setItem("token", token);
};

export const removeAuthToken = () => {
  localStorage.removeItem("token");
};

export const getAuthToken = () => {
  return localStorage.getItem("token");
};

// Default export object for convenience
const api = {
  getPhones,
  getPhone,
  getPhoneById,
  getFeaturedPhones,
  getBrands,
  getAccessories,
  getFeaturedAccessories,
  getAccessoryCategories,
  searchPhones,
  searchAccessories,
  setAuthToken,
  removeAuthToken,
  getAuthToken,
};

export default api;
