import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar"; // Make sure this path is correct!
import api from "../../utils/api";

const STAT_BG = ["#2874f0", "#ffd700", "#0A1A2F", "#f44336"];

function getTodayRevenue(orders) {
  const today = new Date().toLocaleDateString("en-IN");
  return orders
    .filter((o) => new Date(o.createdAt).toLocaleDateString("en-IN") === today)
    .reduce((sum, o) => sum + (Number(o.totalAmount || o.total) || 0), 0)
    .toFixed(2);
}

function getActiveOrders(orders) {
  return orders.filter((o) => ["pending", "confirmed", "processing", "shipped"].includes(o.status)).length;
}

function getLowStock(products) {
  return products.filter((p) => p.stock < 10).length;
}

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingOrderId, setUpdatingOrderId] = useState(null);

  const loadDashboard = async () => {
    try {
      const [ordersResponse, productsResponse] = await Promise.all([
        api.orders.getAll(),
        api.products.getAll(),
      ]);

      setOrders(ordersResponse.data || []);
      setProducts(productsResponse.data || []);
    } catch (error) {
      console.error("Failed to load dashboard:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const handleMarkAsDelivered = async (orderId) => {
    try {
      setUpdatingOrderId(orderId);
      await api.orders.updateStatus(orderId, "delivered");
      await loadDashboard();
    } catch (error) {
      console.error("Failed to update order status:", error.message);
    } finally {
      setUpdatingOrderId(null);
    }
  };

  return (
    <div className="d-flex min-vh-100 bg-light">
      
      {/* 1. The Sidebar on the left */}
      <Sidebar />
      
      {/* 2. The Main Content on the right */}
      <main className="flex-grow-1 p-4 overflow-auto">
        <h2 className="fw-bold mb-4">Admin Dashboard</h2>
        {loading && <div className="alert alert-info">Loading dashboard...</div>}
        
        {/* Stat Cards */}
        <div className="row g-4 mb-4">
          <div className="col-md-3">
            <div className="card shadow-sm border-0 h-100" style={{ background: STAT_BG[0], color: '#fff' }}>
              <div className="card-body">
                <h6 className="mb-1 text-white-50 fw-bold">Today's Revenue</h6>
                <h3 className="fw-bold mb-0">₹{getTodayRevenue(orders)}</h3>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card shadow-sm border-0 h-100" style={{ background: STAT_BG[1], color: '#0A1A2F' }}>
              <div className="card-body">
                <h6 className="mb-1 text-dark-50 fw-bold">Active Orders</h6>
                <h3 className="fw-bold mb-0">{getActiveOrders(orders)}</h3>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card shadow-sm border-0 h-100" style={{ background: STAT_BG[2], color: '#fff' }}>
              <div className="card-body">
                <h6 className="mb-1 text-white-50 fw-bold">Total Products</h6>
                <h3 className="fw-bold mb-0">{products.length}</h3>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card shadow-sm border-0 h-100" style={{ background: STAT_BG[3], color: '#fff' }}>
              <div className="card-body">
                <h6 className="mb-1 text-white-50 fw-bold">Low Stock Alerts</h6>
                <h3 className="fw-bold mb-0">{getLowStock(products)}</h3>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Sales Table */}
        <div className="card border-0 shadow-sm rounded-4 overflow-hidden mt-2">
          <div className="card-header bg-white fw-bold fs-5 py-3 border-bottom">Recent Sales</div>
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0 bg-white">
              <thead className="table-light">
                <tr>
                  <th className="px-4 py-3">Date</th>
                  <th className="py-3">Order ID</th>
                  <th className="py-3">Customer ID</th>
                  <th className="py-3">Total</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 5).map((o) => (
                  <tr key={o._id || o.id}>
                    <td className="px-4">{o.createdAt ? new Date(o.createdAt).toLocaleDateString("en-IN") : "-"}</td>
                    <td><span className="text-muted small fw-bold">{o._id || o.id}</span></td>
                    <td className="fw-medium text-dark">{o.user?.email || "-"}</td>
                    <td className="fw-bold" style={{ color: "var(--accent)" }}>₹{o.totalAmount || o.total}</td>
                    <td className="px-4">
                      <span className={`badge ${
                        o.status === "delivered"
                          ? "bg-success"
                          : o.status === "confirmed"
                          ? "bg-primary"
                          : "bg-secondary"
                      }`}>
                        {o.status || "pending"}
                      </span>
                    </td>
                    <td className="px-4">
                      {o.status !== "delivered" && (
                        <button
                          className="btn btn-sm btn-outline-success"
                          onClick={() => handleMarkAsDelivered(o._id || o.id)}
                          disabled={updatingOrderId === (o._id || o.id)}
                        >
                          {updatingOrderId === (o._id || o.id) ? "Updating..." : "Mark as Delivered"}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {orders.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center text-muted py-5">No sales yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;