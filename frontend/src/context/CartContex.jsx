import React, { createContext, useContext, useReducer, useEffect } from "react";
import PropTypes from "prop-types";

const CartContext = createContext();

// Cart reducer
const cartReducer = (state, action) => {
  switch (action.type) {
    case "ADD_ITEM": {
      const existingItem = state.items.find(
        (item) => item.id === action.payload.id
      );

      if (existingItem) {
        // Update quantity if item already exists
        const updatedItems = state.items.map((item) =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
        return {
          ...state,
          items: updatedItems,
        };
      } else {
        // Add new item
        return {
          ...state,
          items: [...state.items, { ...action.payload, quantity: 1 }],
        };
      }
    }

    case "REMOVE_ITEM": {
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload),
      };
    }

    case "UPDATE_QUANTITY": {
      const updatedItems = state.items.map((item) =>
        item.id === action.payload.id
          ? { ...item, quantity: action.payload.quantity }
          : item
      );
      return {
        ...state,
        items: updatedItems,
      };
    }

    case "CLEAR_CART": {
      return {
        ...state,
        items: [],
      };
    }

    case "LOAD_CART": {
      return {
        ...state,
        items: action.payload || [],
      };
    }

    default:
      return state;
  }
};

// Initial state
const initialState = {
  items: [],
};

// Cart provider component
export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Load cart from localStorage on component mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("iwing_cart");
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        dispatch({ type: "LOAD_CART", payload: parsedCart });
      }
    } catch (error) {
      console.error("Error loading cart from localStorage:", error);
      // If there's an error, clear the corrupted data
      localStorage.removeItem("iwing_cart");
    }
  }, []);

  // Save cart to localStorage whenever cart items change
  useEffect(() => {
    try {
      localStorage.setItem("iwing_cart", JSON.stringify(state.items));
    } catch (error) {
      console.error("Error saving cart to localStorage:", error);
    }
  }, [state.items]);

  // Calculate totals
  const total = state.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const itemCount = state.items.reduce(
    (count, item) => count + item.quantity,
    0
  );

  // Action creators
  const addItem = React.useCallback(
    (item) => {
      dispatch({ type: "ADD_ITEM", payload: item });
    },
    [dispatch]
  );

  const removeItem = React.useCallback(
    (id) => {
      dispatch({ type: "REMOVE_ITEM", payload: id });
    },
    [dispatch]
  );

  const updateQuantity = React.useCallback(
    (id, quantity) => {
      if (quantity <= 0) {
        removeItem(id);
      } else {
        dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } });
      }
    },
    [dispatch, removeItem]
  );

  const clearCart = React.useCallback(() => {
    dispatch({ type: "CLEAR_CART" });
  }, [dispatch]);

  // Check if item is in cart
  const isItemInCart = React.useCallback(
    (id) => {
      return state.items.some((item) => item.id === id);
    },
    [state.items]
  );

  // Get item from cart
  const getCartItem = React.useCallback(
    (id) => {
      return state.items.find((item) => item.id === id);
    },
    [state.items]
  );

  const value = React.useMemo(
    () => ({
      items: state.items,
      total,
      itemCount,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      isItemInCart,
      getCartItem,
    }),
    [
      state.items,
      total,
      itemCount,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      isItemInCart,
      getCartItem,
    ]
  );
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

CartProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

// Custom hook to use cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export default CartContext;
