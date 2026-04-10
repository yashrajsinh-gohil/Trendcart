import React, { createContext, useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";

export const CartContext = createContext();

const GST_RATES = [0.05, 0.12, 0.18];

const readStoredCart = (storageKey) => {
  const storedCart = localStorage.getItem(storageKey);

  if (!storedCart) {
    return [];
  }

  try {
    const parsedCart = JSON.parse(storedCart);
    return Array.isArray(parsedCart) ? parsedCart : [];
  } catch {
    localStorage.removeItem(storageKey);
    return [];
  }
};

const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState([]);

  const getProductId = (product) => product._id || product.id;
  const cartStorageKey = `cart_${user?._id || user?.id || user?.email || "guest"}`;

  useEffect(() => {
    setCart(readStoredCart(cartStorageKey));
  }, [cartStorageKey]);

  useEffect(() => {
    localStorage.setItem(cartStorageKey, JSON.stringify(cart));
  }, [cart, cartStorageKey]);

  const addToCart = (product) => {
    setCart((prev) => {
      const productId = getProductId(product);
      const exists = prev.find((item) => getProductId(item) === productId);
      if (exists) {
        return prev.map((item) =>
          getProductId(item) === productId
            ? { ...item, qty: item.qty + 1 }
            : item
        );
      } else {
        return [...prev, { ...product, qty: 1 }];
      }
    });
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => getProductId(item) !== id));
  };

  const incrementQty = (id) => {
    setCart((prev) =>
      prev.map((item) =>
        getProductId(item) === id ? { ...item, qty: item.qty + 1 } : item
      )
    );
  };

  const decrementQty = (id) => {
    setCart((prev) =>
      prev.map((item) =>
        getProductId(item) === id && item.qty > 1
          ? { ...item, qty: item.qty - 1 }
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  const gst = GST_RATES.map((rate) => ({
    rate,
    amount: subtotal * rate
  }));

  const total = subtotal + gst.reduce((sum, g) => sum + g.amount, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        incrementQty,
        decrementQty,
        clearCart,
        subtotal,
        gst,
        total
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
