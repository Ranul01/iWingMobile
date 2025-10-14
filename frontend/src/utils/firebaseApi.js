import { db } from "../config/firebase";
import {
  collection,
  getDocs,
  getDoc,
  doc,
  query,
  where,
  orderBy,
  limit,
  addDoc,
  updateDoc,
} from "firebase/firestore";

// Fetch all phones with filters
export const getPhones = async (filters = {}) => {
  try {
    const phonesRef = collection(db, "phones");
    let q = query(phonesRef);

    // Apply filters
    if (filters.brand) {
      q = query(q, where("brand", "==", filters.brand));
    }

    if (filters.category) {
      q = query(q, where("category", "==", filters.category));
    }

    if (filters.featured !== undefined) {
      q = query(q, where("featured", "==", filters.featured));
    }

    if (filters.inStock !== undefined) {
      q = query(q, where("inStock", "==", filters.inStock));
    }

    // Apply sorting
    const sortField = filters.sortBy || "createdAt";
    const sortDirection = filters.sortOrder === "asc" ? "asc" : "desc";
    q = query(q, orderBy(sortField, sortDirection));

    // Apply limit
    if (filters.limit) {
      q = query(q, limit(filters.limit));
    }

    const snapshot = await getDocs(q);
    const phones = snapshot.docs.map((doc) => ({
      id: doc.id,
      _id: doc.id,
      ...doc.data(),
      createdAt:
        doc.data().createdAt?.toDate?.()?.toISOString() ||
        new Date().toISOString(),
    }));

    return { data: phones, total: phones.length };
  } catch (error) {
    console.error("Error fetching phones:", error);
    throw error;
  }
};

// Fetch single phone by ID
export const getPhoneById = async (id) => {
  try {
    const phoneDoc = await getDoc(doc(db, "phones", id));
    if (phoneDoc.exists()) {
      return {
        id: phoneDoc.id,
        _id: phoneDoc.id,
        ...phoneDoc.data(),
        createdAt:
          phoneDoc.data().createdAt?.toDate?.()?.toISOString() ||
          new Date().toISOString(),
      };
    }
    throw new Error("Phone not found");
  } catch (error) {
    console.error("Error fetching phone:", error);
    throw error;
  }
};

// Fetch featured phones - SIMPLIFIED to avoid index
export const getFeaturedPhones = async (limitCount = 8) => {
  try {
    const phonesRef = collection(db, "phones");
    // Remove compound query - just use featured filter
    const q = query(
      phonesRef,
      where("featured", "==", true),
      limit(limitCount)
    );

    const snapshot = await getDocs(q);
    // Filter isActive and sort in memory
    const phones = snapshot.docs
      .map((doc) => ({
        id: doc.id,
        _id: doc.id,
        ...doc.data(),
        createdAt:
          doc.data().createdAt?.toDate?.()?.toISOString() ||
          new Date().toISOString(),
      }))
      .filter((phone) => phone.isActive !== false) // Filter out inactive
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Sort by date

    return { data: phones };
  } catch (error) {
    console.error("Error fetching featured phones:", error);
    return { data: [] };
  }
};

// Get unique brands
export const getBrands = async () => {
  try {
    const phonesRef = collection(db, "phones");
    const snapshot = await getDocs(phonesRef);
    const brands = [...new Set(snapshot.docs.map((doc) => doc.data().brand))];
    return brands.filter(Boolean).sort((a, b) => {
      // Example: sort by length, then alphabetically if lengths are equal
      if (a.length !== b.length) {
        return a.length - b.length;
      }
      return a.localeCompare(b);
    });
  } catch (error) {
    console.error("Error fetching brands:", error);
    return [];
  }
};

// Fetch accessories
export const getAccessories = async (filters = {}) => {
  try {
    const accessoriesRef = collection(db, "accessories");
    let q = query(accessoriesRef);

    if (filters.category) {
      q = query(q, where("category", "==", filters.category));
    }

    if (filters.featured !== undefined) {
      q = query(q, where("featured", "==", filters.featured));
    }

    const sortField = filters.sortBy || "createdAt";
    const sortDirection = filters.sortOrder === "asc" ? "asc" : "desc";
    q = query(q, orderBy(sortField, sortDirection));

    if (filters.limit) {
      q = query(q, limit(filters.limit));
    }

    const snapshot = await getDocs(q);
    const accessories = snapshot.docs.map((doc) => ({
      id: doc.id,
      _id: doc.id,
      ...doc.data(),
      createdAt:
        doc.data().createdAt?.toDate?.()?.toISOString() ||
        new Date().toISOString(),
    }));

    return { data: accessories };
  } catch (error) {
    console.error("Error fetching accessories:", error);
    throw error;
  }
};

// Fetch single accessory by ID
export const getAccessoryById = async (id) => {
  try {
    const accessoryDoc = await getDoc(doc(db, "accessories", id));
    if (accessoryDoc.exists()) {
      return {
        id: accessoryDoc.id,
        _id: accessoryDoc.id,
        ...accessoryDoc.data(),
        createdAt:
          accessoryDoc.data().createdAt?.toDate?.()?.toISOString() ||
          new Date().toISOString(),
      };
    }
    throw new Error("Accessory not found");
  } catch (error) {
    console.error("Error fetching accessory:", error);
    throw error;
  }
};

// Fetch featured accessories - SIMPLIFIED to avoid index
export const getFeaturedAccessories = async (limitCount = 8) => {
  try {
    const accessoriesRef = collection(db, "accessories");
    // Remove compound query - just use featured filter
    const q = query(
      accessoriesRef,
      where("featured", "==", true),
      limit(limitCount)
    );

    const snapshot = await getDocs(q);
    // Filter isActive and sort in memory
    const accessories = snapshot.docs
      .map((doc) => ({
        id: doc.id,
        _id: doc.id,
        ...doc.data(),
        createdAt:
          doc.data().createdAt?.toDate?.()?.toISOString() ||
          new Date().toISOString(),
      }))
      .filter((acc) => acc.isActive !== false) // Filter out inactive
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Sort by date

    return { data: accessories };
  } catch (error) {
    console.error("Error fetching featured accessories:", error);
    return { data: [] };
  }
};

// Get accessory categories
export const getAccessoryCategories = async () => {
  try {
    const accessoriesRef = collection(db, "accessories");
    const snapshot = await getDocs(accessoriesRef);

    // Extract unique categories
    const categories = [
      ...new Set(snapshot.docs.map((doc) => doc.data().category)),
    ];

    // Return formatted categories
    return categories
      .filter(Boolean)
      .sort((a, b) => {
        // Example: sort by length, then alphabetically if lengths are equal
        if (a.length !== b.length) {
          return a.length - b.length;
        }
        return a.localeCompare(b);
      })
      .map((category) => ({
        value: category,
        label: category
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" "),
      }));
  } catch (error) {
    console.error("Error fetching accessory categories:", error);
    return [];
  }
};

// Reviews API functions - SIMPLIFIED to avoid composite index requirement
export const getReviewsForPhone = async (phoneId) => {
  try {
    const reviewsRef = collection(db, "reviews");
    // Simplified query - only filter by phoneId first
    const q = query(reviewsRef, where("phoneId", "==", phoneId));

    const snapshot = await getDocs(q);
    const reviews = snapshot.docs
      .map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt:
          doc.data().createdAt?.toDate?.()?.toISOString() ||
          new Date().toISOString(),
      }))
      // Filter approved reviews in memory and sort by date
      .filter((review) => review.status === "approved")
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return reviews;
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return [];
  }
};

export const submitReview = async (reviewData) => {
  try {
    const reviewsRef = collection(db, "reviews");
    const newReview = {
      ...reviewData,
      status: "pending", // Admin needs to approve
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const docRef = await addDoc(reviewsRef, newReview);
    return { id: docRef.id, ...newReview };
  } catch (error) {
    console.error("Error submitting review:", error);
    throw error;
  }
};

// Check if user has already reviewed this phone - SIMPLIFIED
export const hasUserReviewed = async (phoneId, userEmail) => {
  try {
    const reviewsRef = collection(db, "reviews");
    // Simple query with just phoneId
    const q = query(reviewsRef, where("phoneId", "==", phoneId));

    const snapshot = await getDocs(q);
    // Check in memory if user has reviewed
    const userReview = snapshot.docs.find(
      (doc) => doc.data().userEmail === userEmail
    );

    return !!userReview;
  } catch (error) {
    console.error("Error checking user review:", error);
    return false;
  }
};

// Alternative: Get all reviews for admin approval (for your admin panel)
export const getAllPendingReviews = async () => {
  try {
    const reviewsRef = collection(db, "reviews");
    const q = query(reviewsRef);

    const snapshot = await getDocs(q);
    const reviews = snapshot.docs
      .map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt:
          doc.data().createdAt?.toDate?.()?.toISOString() ||
          new Date().toISOString(),
      }))
      // Filter pending reviews in memory
      .filter((review) => review.status === "pending")
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return reviews;
  } catch (error) {
    console.error("Error fetching pending reviews:", error);
    return [];
  }
};

// Get all approved reviews (for admin panel to see approved ones)
export const getAllApprovedReviews = async () => {
  try {
    const reviewsRef = collection(db, "reviews");
    const q = query(reviewsRef);

    const snapshot = await getDocs(q);
    const reviews = snapshot.docs
      .map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt:
          doc.data().createdAt?.toDate?.()?.toISOString() ||
          new Date().toISOString(),
      }))
      // Filter approved reviews in memory
      .filter((review) => review.status === "approved")
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return reviews;
  } catch (error) {
    console.error("Error fetching approved reviews:", error);
    return [];
  }
};

// Update review status (for admin approval/rejection)
export const updateReviewStatus = async (reviewId, status) => {
  try {
    const reviewRef = doc(db, "reviews", reviewId);
    await updateDoc(reviewRef, {
      status: status, // "approved" or "rejected"
      updatedAt: new Date(),
    });
    return true;
  } catch (error) {
    console.error("Error updating review status:", error);
    throw error;
  }
};

// Reviews API functions for Accessories
export const getReviewsForAccessory = async (accessoryId) => {
  try {
    const reviewsRef = collection(db, "reviews");
    // Simplified query - only filter by accessoryId first
    const q = query(reviewsRef, where("accessoryId", "==", accessoryId));

    const snapshot = await getDocs(q);
    const reviews = snapshot.docs
      .map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt:
          doc.data().createdAt?.toDate?.()?.toISOString() ||
          new Date().toISOString(),
      }))
      // Filter approved reviews in memory and sort by date
      .filter((review) => review.status === "approved")
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return reviews;
  } catch (error) {
    console.error("Error fetching accessory reviews:", error);
    return [];
  }
};

export const submitAccessoryReview = async (reviewData) => {
  try {
    const reviewsRef = collection(db, "reviews");
    const newReview = {
      ...reviewData,
      status: "pending", // Admin needs to approve
      type: "accessory", // To distinguish from phone reviews
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const docRef = await addDoc(reviewsRef, newReview);
    return { id: docRef.id, ...newReview };
  } catch (error) {
    console.error("Error submitting accessory review:", error);
    throw error;
  }
};

// Check if user has already reviewed this accessory
export const hasUserReviewedAccessory = async (accessoryId, userEmail) => {
  try {
    const reviewsRef = collection(db, "reviews");
    const q = query(reviewsRef, where("accessoryId", "==", accessoryId));

    const snapshot = await getDocs(q);
    // Check in memory if user has reviewed
    const userReview = snapshot.docs.find(
      (doc) => doc.data().userEmail === userEmail
    );

    return !!userReview;
  } catch (error) {
    console.error("Error checking user accessory review:", error);
    return false;
  }
};
