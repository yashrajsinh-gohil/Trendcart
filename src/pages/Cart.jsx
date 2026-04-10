import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useCart } from "../hooks/useCart";
import api from "../utils/api";
import Todo from "../components/Todo";

const Cart = () => {
  const { cart, removeFromCart, incrementQty, decrementQty, subtotal, total, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [toast, setToast] = React.useState("");
  const [toastType, setToastType] = React.useState("success");

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      setToastType("danger");
      setToast("Please login to place an order!");
      navigate("/login");
      return;
    }

    try {
      const orderPayload = {
        products: cart.map((item) => ({
          product: item._id || item.id,
          quantity: item.qty,
        })),
      };

      await api.orders.create(orderPayload);
      clearCart();
      setToastType("success");
      setToast("Order placed successfully!");
      navigate("/profile");
    } catch (error) {
      setToastType("danger");
      setToast(error.message || "Failed to place order");
    }
  };

  if (cart.length === 0) {
    return (
      <div className="container py-5 text-center">
        <div className="card border-0 shadow-sm p-5 rounded-4">
          <h2 className="fw-bold">Your cart is empty!</h2>
          <p className="text-muted">Explore our latest products and add them to your cart.</p>
          <Link to="/products" className="btn btn-primary px-5 py-2 fw-bold rounded-pill mt-3">
            Shop Now
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="container py-4">
        <h2 className="fw-bold mb-4">Shopping Cart</h2>
        <div className="row g-4">
          {/* Cart Items List */}
          <div className="col-lg-8">
            <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
              {cart.map((item) => (
                <div key={item._id || item.id} className="p-3 border-bottom d-flex align-items-center gap-3 bg-white">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="rounded" 
                    style={{ width: "100px", height: "100px", objectFit: "cover" }} 
                  />
                  <div className="flex-grow-1">
                    <h5 className="fw-bold mb-1">{item.name}</h5>
                    <p className="text-muted small mb-2">
                      Category: {item.category?.name || (typeof item.category === "string" ? item.category : "Uncategorized")}
                    </p>
                    <button 
                      className="btn btn-sm text-danger p-0 fw-bold" 
                      onClick={() => removeFromCart(item._id || item.id)}
                    >
                      REMOVE
                    </button>
                  </div>
                  <div className="text-center">
                    <div className="btn-group shadow-sm rounded mb-2">
                      <button className="btn btn-light btn-sm px-3" onClick={() => decrementQty(item._id || item.id)}>-</button>
                      <span className="btn btn-white btn-sm px-3 disabled opacity-100 fw-bold">{item.qty}</span>
                      <button className="btn btn-light btn-sm px-3" onClick={() => incrementQty(item._id || item.id)}>+</button>
                    </div>
                    <div className="fw-bold">₹{item.price * item.qty}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Price Summary Sidebar */}
          <div className="col-lg-4">
            <div className="card border-0 shadow-sm rounded-4 p-4 sticky-top" style={{ top: "100px" }}>
              <h5 className="fw-bold text-muted mb-4 border-bottom pb-2">PRICE DETAILS</h5>
              <div className="d-flex justify-content-between mb-3">
                <span>Price ({cart.length} items)</span>
                <span>₹{subtotal}</span>
              </div>
              <div className="d-flex justify-content-between mb-3">
                <span>Delivery Charges</span>
                <span className="text-success fw-bold">FREE</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between mb-4 fs-4 fw-bold">
                <span>Total Amount</span>
                <span className="text-primary">₹{total.toFixed(2)}</span>
              </div>
              <button 
                className="btn btn-warning w-100 fw-bold py-3 fs-5 rounded-3 shadow-sm transition-all" 
                style={{ color: "var(--accent)" }}
                onClick={handleCheckout}
              >
                PLACE ORDER
              </button>
            </div>
          </div>
        </div>
      </div>
      <Todo message={toast} type={toastType} onClose={() => setToast("")} />
    </>
  );
};

export default Cart;