import { useContext } from "react";
import { CartContext } from "../contexts/CartContext";

// 1. Hook for accessing Cart Context
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

// 2. Helper to save orders to LocalStorage
export const saveOrder = (order) => {
  try {
    const existingOrders = JSON.parse(localStorage.getItem("trendcart_orders")) || [];
    existingOrders.push(order);
    localStorage.setItem("trendcart_orders", JSON.stringify(existingOrders));
  } catch (error) {
    console.error("Error saving order to localStorage", error);
  }
};

// 3. Helper to retrieve orders for a specific user
export const getOrders = (userId) => {
  const allOrders = JSON.parse(localStorage.getItem("trendcart_orders")) || [];
  return allOrders.filter((order) => order.userId === userId);
};