import React, { createContext, useContext, useReducer, useEffect } from "react";

// Initial cart state
const initialState = {
  items: [],
  total: 0,
  itemCount: 0,
};

// Cart action types
const CartActionTypes = {
  ADD_ITEM: "ADD_ITEM",
  REMOVE_ITEM: "REMOVE_ITEM",
  UPDATE_QUANTITY: "UPDATE_QUANTITY",
  CLEAR_CART: "CLEAR_CART",
  LOAD_CART: "LOAD_CART",
};

// Cart reducer function
const cartReducer = (state, action) => {
  switch (action.type) {
    case CartActionTypes.ADD_ITEM: {
      const existingItem = state.items.find(
        (item) => item.id === action.payload.id
      );

      let updatedItems;
      if (existingItem) {
        updatedItems = state.items.map((item) =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        updatedItems = [...state.items, { ...action.payload, quantity: 1 }];
      }

      const newTotal = updatedItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
      const newItemCount = updatedItems.reduce(
        (sum, item) => sum + item.quantity,
        0
      );

      return {
        ...state,
        items: updatedItems,
        total: newTotal,
        itemCount: newItemCount,
      };
    }

    case CartActionTypes.REMOVE_ITEM: {
      const updatedItems = state.items.filter(
        (item) => item.id !== action.payload
      );
      const newTotal = updatedItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
      const newItemCount = updatedItems.reduce(
        (sum, item) => sum + item.quantity,
        0
      );

      return {
        ...state,
        items: updatedItems,
        total: newTotal,
        itemCount: newItemCount,
      };
    }

    case CartActionTypes.UPDATE_QUANTITY: {
      const { id, quantity } = action.payload;

      if (quantity <= 0) {
        return cartReducer(state, {
          type: CartActionTypes.REMOVE_ITEM,
          payload: id,
        });
      }

      const updatedItems = state.items.map((item) =>
        item.id === id ? { ...item, quantity } : item
      );

      const newTotal = updatedItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
      const newItemCount = updatedItems.reduce(
        (sum, item) => sum + item.quantity,
        0
      );

      return {
        ...state,
        items: updatedItems,
        total: newTotal,
        itemCount: newItemCount,
      };
    }

    case CartActionTypes.CLEAR_CART:
      return initialState;

    case CartActionTypes.LOAD_CART:
      return action.payload;

    default:
      return state;
  }
};

// Create Cart Context
const CartContext = createContext();

// Cart Provider Component
export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Load cart from localStorage on component mount
  useEffect(() => {
    const savedCart = localStorage.getItem("iwingmobile-cart");
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        dispatch({ type: CartActionTypes.LOAD_CART, payload: parsedCart });
      } catch (error) {
        console.error("Error loading cart from localStorage:", error);
      }
    }
  }, []);

  // Save cart to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem("iwingmobile-cart", JSON.stringify(state));
  }, [state]);

  // Cart actions
  const addItem = (item) => {
    dispatch({ type: CartActionTypes.ADD_ITEM, payload: item });
  };

  const removeItem = (id) => {
    dispatch({ type: CartActionTypes.REMOVE_ITEM, payload: id });
  };

  const updateQuantity = (id, quantity) => {
    dispatch({
      type: CartActionTypes.UPDATE_QUANTITY,
      payload: { id, quantity },
    });
  };

  const clearCart = () => {
    dispatch({ type: CartActionTypes.CLEAR_CART });
  };

  const getItemQuantity = (id) => {
    const item = state.items.find((item) => item.id === id);
    return item ? item.quantity : 0;
  };

  const isItemInCart = (id) => {
    return state.items.some((item) => item.id === id);
  };

  const value = {
    ...state,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getItemQuantity,
    isItemInCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

// Custom hook to use Cart Context
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export default CartContext;
