import React, { useEffect, useState } from "react";
import Todo from "../../components/Todo";
import Sidebar from "../../components/Sidebar";
import api from "../../utils/api";

export default function AdminSales() {
  const [orders, setOrders] = useState([]);
  const [toast, setToast] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSales = async () => {
      try {
        const response = await api.orders.getAll();
        setOrders(response.data || []);
      } catch (error) {
        setToast(error.message || "Failed to load sales");
      } finally {
        setLoading(false);
      }
    };

    loadSales();
  }, []);

  return (
    <div className="d-flex min-vh-100 bg-light">
      <Sidebar />
      <main className="flex-grow-1 p-4 overflow-auto">
        <h2 className="fw-bold mb-4">Sales Report</h2>
        <div className="card border-0 shadow-sm rounded-4 overflow-auto">
          <table className="table table-hover align-middle mb-0">
            <thead className="bg-dark text-white">
              <tr className="small text-uppercase ls-1">
                <th>Date</th>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Total</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center text-muted py-4">
                    {loading ? "Loading sales..." : "No sales found."}
                  </td>
                </tr>
              ) : (
                orders.map((o) => (
                  <tr key={o._id || o.id}>
                    <td>{o.createdAt ? new Date(o.createdAt).toLocaleDateString("en-IN") : "-"}</td>
                    <td>{o._id || o.id}</td>
                    <td>{o.user?.email || "-"}</td>
                    <td>₹{o.totalAmount || o.total}</td>
                    <td>
                      <span className={`badge ${o.status === "delivered" ? "bg-success" : "bg-secondary"}`}>
                        {o.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <Todo message={toast} onClose={() => setToast("")} />
      </main>
    </div>
  );
}
