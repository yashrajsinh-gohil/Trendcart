import { useEffect, useState } from "react";
import CategoryCard from "../components/CategoryCard";
import ProductCard from "../components/ProductCard";
import { useCart } from "../hooks/useCart";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import Todo from "../components/Todo";

const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState("");
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        const [categoriesResponse, productsResponse] = await Promise.all([
          api.categories.getAll(),
          api.products.getAll(),
        ]);

        setCategories((categoriesResponse.data || []).map((cat) => cat.name));
        setProducts(productsResponse.data || []);
      } catch (error) {
        setToast(error.message || "Failed to load home data");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Trending products, filtered by selected category
  let trending = products.slice(0, 6);
  if (selectedCategory) {
    trending = products
      .filter((p) => (p.category?.name || p.category) === selectedCategory)
      .slice(0, 6);
  }

  const handleAddToCart = (product) => {
    if (!isAuthenticated) {
      navigate("/login");
    } else {
      addToCart(product);
    }
  };

  return (
  <div className="container py-4">
    {loading && <p className="text-muted">Loading products...</p>}
    {/* Categories Section */}
    <section className="mb-5">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h2 className="fw-bold h4 mb-0" style={{ color: "var(--text-h)" }}>
          Shop by Category
        </h2>
        {selectedCategory && (
          <button 
            className="btn btn-sm btn-outline-primary rounded-pill px-3"
            onClick={() => setSelectedCategory("")}
          >
            View All
          </button>
        )}
      </div>
      
      {/* Responsive Grid for Categories: 2 on mobile, 4 on tablet, 6 on desktop */}
      <div className="row row-cols-2 row-cols-sm-3 row-cols-md-4 row-cols-lg-6 g-3">
        {categories.map((cat) => (
          <div className="col" key={cat}>
            <CategoryCard 
              category={cat} 
              onSelect={setSelectedCategory} 
              isActive={selectedCategory === cat} 
            />
          </div>
        ))}
      </div>
    </section>

    {/* Trending Products Section */}
    <section>
      <div className="d-flex align-items-center mb-3">
        <h2 className="fw-bold h4 mb-0" style={{ color: "var(--text-h)" }}>
          Trending Products
          {selectedCategory && (
            <span className="text-primary ms-2 fs-5">in {selectedCategory}</span>
          )}
        </h2>
      </div>

      {/* Responsive Grid for Products: 1 on mobile, 2 on tablet, 4 on desktop */}
      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
        {trending.length > 0 ? (
          trending.map((product) => (
            <div className="col" key={product._id || product.id}>
              <ProductCard 
                product={product} 
                onAddToCart={handleAddToCart} 
              />
            </div>
          ))
        ) : (
          <div className="col-12 text-center py-5">
            <p className="text-muted fs-5">No products found in this category.</p>
            <button className="btn btn-primary" onClick={() => setSelectedCategory("")}>
              Back to All Products
            </button>
          </div>
        )}
      </div>
    </section>
    <Todo message={toast} type="danger" onClose={() => setToast("")} />
  </div>
);  
};

export default Home;
