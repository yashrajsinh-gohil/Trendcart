import React, { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import OrderCard from "../components/OrderCard";
import api from "../utils/api";
import Todo from "../components/Todo";

const Profile = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [toast, setToast] = useState("");
  const [toastType, setToastType] = useState("success");

  const loadOrders = async () => {
    const response = await api.orders.getMine();
    setOrders(response.data || []);
  };

  useEffect(() => {
    const initialize = async () => {
      if (!user) return;

      try {
        await loadOrders();
      } catch (error) {
        setToastType("danger");
        setToast(error.message || "Failed to fetch user orders");
      }
    };

    initialize();
  }, [user]);

  const clearOrders = async () => {
    try {
      const cancellable = (orders || []).filter((order) => order.status === "pending");
      await Promise.all(cancellable.map((order) => api.orders.cancel(order._id)));
      await loadOrders();
      setToastType("success");
      setToast("Pending orders cancelled");
    } catch (error) {
      setToastType("danger");
      setToast(error.message || "Failed to cancel orders");
    }
  };

  if (!user) return <div className="container py-5 text-center">Loading...</div>;

  return (
    <div className="container py-5">
      <div className="row g-4">
        
        {/* Left Column: User Info Card */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
            <div className="card-body text-center p-5" style={{ background: "linear-gradient(to bottom, #f8f9fa, #ffffff)" }}>
              {/* Avatar Circle */}
              <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3 shadow" 
                   style={{ width: "80px", height: "80px", fontSize: "2rem", fontWeight: "bold" }}>
                {(user.firstName || user.name || "U").charAt(0)}
              </div>
              <h4 className="fw-bold mb-1">{`${user.firstName || ""} ${user.lastName || ""}`.trim() || user.name}</h4>
              <p className="text-muted small mb-3">{user.email}</p>
              <span className="badge rounded-pill bg-success-subtle text-success border border-success-subtle px-3 py-2">
                {user?.role === "admin" ? "Admin" : "User"}
              </span>
              <button className="btn btn-danger mt-4 w-100" onClick={clearOrders}>
                Clear My Orders
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Order History */}
        <div className="col-lg-8">
          <div className="d-flex align-items-center justify-content-between mb-4">
            <h3 className="fw-bold mb-0">My Orders</h3>
            <span className="text-muted fw-bold small">{orders.length} Orders Total</span>
          </div>

          {orders.length > 0 ? (
            <div className="order-list">
              {orders.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map((order) => (
                <OrderCard key={order._id} order={order} />
              ))}
            </div>
          ) : (
            <div className="card border-0 shadow-sm rounded-4 p-5 text-center bg-white">
              <div className="mb-3">
                <svg width="64" height="64" fill="#dee2e6" viewBox="0 0 16 16">
                  <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4H4.25a.75.75 0 0 0-.75.75v6.5c0 .414.336.75.75.75h7.5a.75.75 0 0 0 .75-.75v-6.5a.75.75 0 0 0-.75-.75H11z"/>
                </svg>
              </div>
              <h5 className="fw-bold">No orders found</h5>
              <p className="text-muted">Looks like you haven't ordered anything yet.</p>
              <a href="/products" className="btn btn-primary fw-bold px-4 rounded-pill">Start Shopping</a>
            </div>
          )}
        </div>

      </div>
      <Todo message={toast} type={toastType} onClose={() => setToast("")} />
    </div>
  );
};

export default Profile;