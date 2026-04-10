import React, { useEffect, useState } from "react";
import Todo from "../../components/Todo";
import Sidebar from "../../components/Sidebar";
import api from "../../utils/api";

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [toast, setToast] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [loading, setLoading] = useState(true);

  const loadCategories = async () => {
    const response = await api.categories.getAll();
    setCategories(response.data || []);
  };

  useEffect(() => {
    const initialize = async () => {
      try {
        await loadCategories();
      } catch (error) {
        setToast(error.message || "Failed to load categories");
      } finally {
        setLoading(false);
      }
    };

    initialize();
  }, []);

  const handleAddCategory = async (e) => {
    e.preventDefault();
    const trimmed = newCategory.trim();
    if (!trimmed) {
      setToast("Category name cannot be empty!");
      return;
    }
    if (categories.map((c) => c.name.toLowerCase()).includes(trimmed.toLowerCase())) {
      setToast("This category already exists!");
      return;
    }

    try {
      await api.categories.create({ name: trimmed });
      await loadCategories();
      setNewCategory("");
      setToast("Category added successfully!");
    } catch (error) {
      setToast(error.message || "Failed to add category");
    }
  };

  const handleDelete = async (category) => {
    if (window.confirm(`Are you sure you want to delete "${category.name}"?`)) {
      try {
        await api.categories.remove(category._id);
        await loadCategories();
        setToast("Category deleted!");
      } catch (error) {
        setToast(error.message || "Failed to delete category");
      }
    }
  };

  return (
    <div className="d-flex min-vh-100 bg-light">
      <Sidebar />
      <main className="flex-grow-1 p-4 overflow-auto">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold mb-0">Category Management</h2>
        </div>
        {/* Add Category Form */}
        <div className="card border-0 shadow-sm rounded-4 mb-4 p-4">
          <form onSubmit={handleAddCategory} className="d-flex gap-3 align-items-end">
            <div className="flex-grow-1">
              <label className="form-label fw-bold text-muted small">NEW CATEGORY NAME</label>
              <input 
                type="text" 
                className="form-control" 
                placeholder="e.g., Beverages" 
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary px-4 fw-bold">
              + Add Category
            </button>
          </form>
        </div>
        {/* Categories Table */}
        <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
          <table className="table table-hover align-middle mb-0 bg-white">
            <thead className="table-light">
              <tr>
                <th className="px-4 py-3">Category Name</th>
                <th className="py-3 text-end px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.length === 0 ? (
                <tr>
                  <td colSpan={2} className="text-center text-muted py-4">{loading ? "Loading categories..." : "No categories found."}</td>
                </tr>
              ) : (
                categories.map((cat) => (
                  <tr key={cat._id}>
                    <td className="px-4 fw-bold text-dark">{cat.name}</td>
                    <td className="text-end px-4">
                      <button 
                        className="btn btn-sm btn-outline-danger" 
                        onClick={() => handleDelete(cat)}
                      >
                        Delete
                      </button>
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
