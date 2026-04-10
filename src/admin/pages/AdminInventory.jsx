import React, { useEffect, useState } from "react";
import Todo from "../../components/Todo";
import Sidebar from "../../components/Sidebar";
import api from "../../utils/api";

export default function AdminInventory() {
  const [products, setProducts] = useState([]);
  const [toast, setToast] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await api.products.getAll();
        setProducts(response.data || []);
      } catch (error) {
        setToast(error.message || "Failed to load inventory");
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const adjustStock = async (id, stockValue) => {
    try {
      const response = await api.products.update(id, {
        stock: stockValue,
      });

      setProducts((prev) => prev.map((p) => (p._id === id ? response.data : p)));
      setToast("Stock updated!");
    } catch (error) {
      setToast(error.message || "Failed to update stock");
    }
  };

  return (
    <div className="d-flex min-vh-100 bg-light">
      <Sidebar />
      <main className="flex-grow-1 p-4 overflow-auto">
        <h2 className="fw-bold mb-4">Inventory & Stock Control</h2>
        <div className="card border-0 shadow-sm rounded-4 overflow-auto">
          <table className="table table-hover align-middle mb-0">
            <thead className="bg-dark text-white">
              <tr className="small text-uppercase ls-1">
                <th>Name</th>
                <th>Stock</th>
                <th className="text-center">Adjust</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center text-muted py-4">
                    {loading ? "Loading inventory..." : "No products found."}
                  </td>
                </tr>
              ) : (
                products.map((p) => (
                  <tr key={p._id}>
                    <td className="fw-bold">{p.name}</td>
                    <td>
                      <span className={`fs-5 fw-bold ${p.stock < 10 ? "text-danger" : "text-dark"}`}>
                        {p.stock} units
                      </span>
                    </td>
                    <td className="text-center">
                      <input
                        type="number"
                        min="0"
                        className="form-control text-center fw-bold"
                        style={{ width: "90px", display: "inline-block" }}
                        value={p.stock}
                        onChange={(e) => {
                          const value = Math.max(0, parseInt(e.target.value) || 0);
                          adjustStock(p._id, value);
                        }}
                        aria-label={`Set stock for ${p.name}`}
                      />
                    </td>
                    <td>
                      {p.stock < 10 ? (
                        <span className="badge bg-danger p-2 px-3 fw-bold shadow-sm">
                          Low Stock
                        </span>
                      ) : (
                        <span className="badge bg-success p-2 px-3 fw-bold">Available</span>
                      )}
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
