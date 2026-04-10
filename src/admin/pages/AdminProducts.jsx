import React, { useEffect, useState } from "react";
import Todo from "../../components/Todo";
import Sidebar from "../../components/Sidebar";
import api from "../../utils/api";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [toast, setToast] = useState("");
  const [loading, setLoading] = useState(true);
  
  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    id: "", name: "", price: "", category: "", stock: "", image: "", description: "", expiry: ""
  });

  const loadProducts = async () => {
    const response = await api.products.getAll();
    setProducts(response.data || []);
  };

  const loadCategories = async () => {
    const response = await api.categories.getAll();
    setCategories(response.data || []);
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([loadProducts(), loadCategories()]);
      } catch (error) {
        setToast(error.message || "Failed to load admin data");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Open Modal for Add/Edit
  const openModal = (product = null) => {
    if (product) {
      setFormData({
        id: product._id,
        name: product.name || "",
        price: product.price || "",
        category: product.category?._id || product.category || "",
        stock: product.stock || "",
        image: product.image || "",
        description: product.description || "",
        expiry: product.expiry || "",
      });
      setIsEditing(true);
    } else {
      setFormData({ 
        id: "",
        name: "", 
        price: "", 
        category: categories[0]?._id || "",
        stock: "", 
        image: "", 
        description: "",
        expiry: new Date().toISOString().split('T')[0] // Default to today
      });
      setIsEditing(false);
    }
    setShowModal(true);
  };

  // Handle Form Submission
  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.category) {
      return setToast("Name, Price, and Category are required!");
    }

    const payload = {
      name: formData.name,
      description: formData.description || "No description provided",
      price: Number(formData.price),
      category: formData.category,
      image: formData.image,
      stock: Number(formData.stock),
      expiry: formData.expiry || null,
      discount: 0,
    };

    try {
      if (isEditing) {
        await api.products.update(formData.id, payload);
        await loadProducts();
        setToast("Product updated successfully!");
      } else {
        await api.products.create(payload);
        await loadProducts();
        setToast("New product added!");
      }

      setShowModal(false);
    } catch (error) {
      setToast(error.message || "Failed to save product");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await api.products.remove(id);
        await loadProducts();
        setToast("Product deleted!");
      } catch (error) {
        setToast(error.message || "Failed to delete product");
      }
    }
  };

  return (
    <div className="d-flex min-vh-100 bg-light">
      <Sidebar />
      <main className="flex-grow-1 p-4 overflow-auto position-relative">
        
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold mb-0">Product Management</h2>
          <button className="btn btn-primary fw-bold px-4" onClick={() => openModal()}>
            + Add Product
          </button>
        </div>

        {/* Products Table */}
        <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0 bg-white">
              <thead className="table-light">
                <tr>
                  <th className="px-4 py-3">Image</th>
                  <th className="py-3">Name</th>
                  <th className="py-3">Category</th>
                  <th className="py-3">Price</th>
                  <th className="py-3">Stock</th>
                  <th className="py-3">Expiry</th>
                  <th className="py-3 text-end px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center text-muted py-5">{loading ? "Loading products..." : "No products available."}</td>
                  </tr>
                ) : (
                  products.map((p) => (
                    <tr key={p._id}>
                      <td className="px-4">
                        <img src={p.image || "https://placehold.co/100x100?text=No+Image"} alt={p.name} 
                             style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "8px" }} />
                      </td>
                      <td className="fw-bold">{p.name}</td>
                      <td><span className="badge bg-light text-dark border">{p.category?.name || p.category}</span></td>
                      <td className="fw-bold text-primary">₹{p.price}</td>
                      <td>{p.stock} units</td>
                      <td className="small text-muted">{p.expiry || "N/A"}</td>
                      <td className="text-end px-4">
                        <button className="btn btn-sm btn-outline-primary me-2" onClick={() => openModal(p)}>Edit</button>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(p._id)}>Delete</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add/Edit Modal */}
        {showModal && (
          <div className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center" 
               style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1050 }}>
            <div className="card border-0 shadow-lg rounded-4 p-4" style={{ width: "90%", maxWidth: "500px", maxHeight: "90vh", overflowY: "auto" }}>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h4 className="fw-bold mb-0">{isEditing ? "Edit Product" : "Add New Product"}</h4>
                <button className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              
              <form onSubmit={handleSave}>
                <div className="mb-3">
                  <label className="form-label small fw-bold text-muted">Product Name</label>
                  <input type="text" className="form-control" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
                </div>
                
                <div className="row mb-3">
                  <div className="col-6">
                    <label className="form-label small fw-bold text-muted">Price (₹)</label>
                    <input type="number" className="form-control" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} required min="0" />
                  </div>
                  <div className="col-6">
                    <label className="form-label small fw-bold text-muted">Stock</label>
                    <input type="number" className="form-control" value={formData.stock} onChange={(e) => setFormData({...formData, stock: e.target.value})} required min="0" />
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col-6">
                    <label className="form-label small fw-bold text-muted">Category</label>
                    <select className="form-select" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} required>
                      <option value="" disabled>Select</option>
                      {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div className="col-6">
                    <label className="form-label small fw-bold text-muted">Expiry Date</label>
                    <input type="date" className="form-control" value={formData.expiry} onChange={(e) => setFormData({...formData, expiry: e.target.value})} />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label small fw-bold text-muted">Image URL</label>
                  <input type="url" className="form-control" value={formData.image} onChange={(e) => setFormData({...formData, image: e.target.value})} placeholder="https://..." />
                </div>

                <div className="mb-4">
                  <label className="form-label small fw-bold text-muted">Description</label>
                  <textarea className="form-control" rows="2" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})}></textarea>
                </div>

                <div className="d-flex gap-2 justify-content-end">
                  <button type="button" className="btn btn-light fw-bold" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary fw-bold">Save Product</button>
                </div>
              </form>
            </div>
          </div>
        )}

        <Todo message={toast} onClose={() => setToast("")} />
      </main>
    </div>
  );
}