// API Configuration
const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5000/api";

// API utility class for making HTTP requests
class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Helper method to get auth headers
  getAuthHeaders() {
    const token = localStorage.getItem("token");
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  // Generic request method
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: this.getAuthHeaders(),
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || `HTTP error! status: ${response.status}`
        );
      }

      return data;
    } catch (error) {
      console.error("API request failed:", error);
      throw error;
    }
  }

  // GET request
  async get(endpoint, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    return this.request(url);
  }

  // POST request
  async post(endpoint, data) {
    return this.request(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  // PUT request
  async put(endpoint, data) {
    return this.request(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  // DELETE request
  async delete(endpoint) {
    return this.request(endpoint, {
      method: "DELETE",
    });
  }

  // Health check
  async healthCheck() {
    return this.get("/health");
  }

  // Phone API methods
  async getPhones(params = {}) {
    return this.get("/phones", params);
  }

  async getPhone(id) {
    return this.get(`/phones/${id}`);
  }

  async getFeaturedPhones(limit = 6) {
    return this.get("/phones/featured/list", { limit });
  }

  async createPhone(phoneData) {
    return this.post("/phones", phoneData);
  }

  async updatePhone(id, phoneData) {
    return this.put(`/phones/${id}`, phoneData);
  }

  async deletePhone(id) {
    return this.delete(`/phones/${id}`);
  }

  // Accessory API methods
  async getAccessories(params = {}) {
    return this.get("/accessories", params);
  }

  async getAccessory(id) {
    return this.get(`/accessories/${id}`);
  }

  async getFeaturedAccessories(limit = 6) {
    return this.get("/accessories/featured/list", { limit });
  }

  async getAccessoryCategories() {
    return this.get("/accessories/categories/list");
  }

  async createAccessory(accessoryData) {
    return this.post("/accessories", accessoryData);
  }

  async updateAccessory(id, accessoryData) {
    return this.put(`/accessories/${id}`, accessoryData);
  }

  async deleteAccessory(id) {
    return this.delete(`/accessories/${id}`);
  }

  // Search methods
  async searchPhones(query, filters = {}) {
    return this.get("/phones", { search: query, ...filters });
  }

  async searchAccessories(query, filters = {}) {
    return this.get("/accessories", { search: query, ...filters });
  }

  // Authentication methods (for future use)
  setAuthToken(token) {
    localStorage.setItem("token", token);
  }

  removeAuthToken() {
    localStorage.removeItem("token");
  }

  getAuthToken() {
    return localStorage.getItem("token");
  }
}

// Create and export a singleton instance
const apiService = new ApiService();

export default apiService;

// Export individual methods for convenience
export const {
  healthCheck,
  getPhones,
  getPhone,
  getFeaturedPhones,
  createPhone,
  updatePhone,
  deletePhone,
  getAccessories,
  getAccessory,
  getFeaturedAccessories,
  getAccessoryCategories,
  createAccessory,
  updateAccessory,
  deleteAccessory,
  searchPhones,
  searchAccessories,
  setAuthToken,
  removeAuthToken,
  getAuthToken,
} = apiService;
