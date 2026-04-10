import { useState, useEffect } from "react";
import ProductCard from "../components/ProductCard";
import { useCart } from "../hooks/useCart";
import { useAuth } from "../hooks/useAuth";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../utils/api";
import Todo from "../components/Todo";

const Products = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  // State Management
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [sort, setSort] = useState("");
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        const [productsResponse, categoriesResponse] = await Promise.all([
          api.products.getAll(),
          api.categories.getAll(),
        ]);

        setProducts(productsResponse.data || []);
        setCategories((categoriesResponse.data || []).map((cat) => cat.name));
      } catch (error) {
        setToast(error.message || "Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Sync state with URL parameters (Search & Category)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setSearch(params.get("search") || "");
    setFilter(params.get("category") || "");
  }, [location.search]);

  const handleAddToCart = (product) => {
    if (!isAuthenticated) {
      navigate("/login");
    } else {
      addToCart(product);
    }
  };

  // Filter & Sort Logic
  let filtered = products.filter(
    (p) =>
      (!filter || (p.category?.name || p.category) === filter) &&
      (!search || p.name.toLowerCase().includes(search.toLowerCase()))
  );

  if (sort === "price-asc") filtered = [...filtered].sort((a, b) => a.price - b.price);
  if (sort === "price-desc") filtered = [...filtered].sort((a, b) => b.price - a.price);

  return (
    <div className="container py-5">
      {/* Header Section */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
        <h2 className="fw-bold mb-0">
          {filter ? `${filter}` : "All Products"}
          <span className="text-muted fs-6 fw-normal ms-2">({filtered.length} items)</span>
        </h2>
        
        {/* Sort Dropdown */}
        <div className="d-flex align-items-center">
          <label className="text-nowrap me-2 fw-bold text-muted small">SORT BY:</label>
          <select
            className="form-select form-select-sm border-0 shadow-sm fw-bold"
            style={{ width: "200px", cursor: "pointer" }}
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="">Relevance</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      <div className="row g-4">
        {/* Sidebar Filter Panel */}
        <div className="col-lg-3">
          <div className="card border-0 shadow-sm rounded-4 p-4 sticky-top" style={{ top: "90px" }}>
            <h6 className="fw-bold mb-3 text-uppercase ls-1">Filters</h6>
            
            {/* Search Input inside Filter Bar */}
            <div className="mb-4">
              <label className="form-label small fw-bold text-muted">Search</label>
              <div className="input-group">
                <input
                  type="text"
                  className="form-control border-end-0 shadow-none"
                  placeholder="Keyword..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <span className="input-group-text bg-white border-start-0 text-muted">
                  <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/></svg>
                </span>
              </div>
            </div>

            {/* Category Filter */}
            <div className="mb-4">
              <label className="form-label small fw-bold text-muted">Category</label>
              <select
                className="form-select shadow-none border-2"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Reset Button */}
            <button 
              className="btn btn-outline-secondary w-100 btn-sm fw-bold"
              onClick={() => {setSearch(""); setFilter(""); setSort(""); navigate("/products")}}
            >
              Clear All Filters
            </button>
          </div>
        </div>

        {/* Product Listing Grid */}
        <div className="col-lg-9">
          {loading && <p className="text-muted">Loading products...</p>}
          {filtered.length > 0 ? (
            <div className="row row-cols-1 row-cols-sm-2 row-cols-xl-3 g-4">
              {filtered.map((product) => (
                <div className="col" key={product._id || product.id}>
                  <ProductCard product={product} onAddToCart={handleAddToCart} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-5">
              <img src="https://cdni.iconscout.com/illustration/premium/thumb/no-product-found-8260150-6644480.png" alt="No products" style={{width: '200px'}} />
              <h4 className="mt-4 fw-bold">No results found</h4>
              <p className="text-muted">Try adjusting your search or category filters.</p>
            </div>
          )}
        </div>
      </div>
      <Todo message={toast} type="danger" onClose={() => setToast("")} />
    </div>
  );
};

export default Products;