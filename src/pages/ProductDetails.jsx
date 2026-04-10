import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useCart } from "../hooks/useCart";
import { useAuth } from "../hooks/useAuth";
import api from "../utils/api";
import Todo from "../components/Todo";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState("");
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const response = await api.products.getById(id);
        setProduct(response.data);
      } catch (error) {
        setToast(error.message || "Failed to load product");
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  if (loading) return <div className="max-w-2xl mx-auto py-8">Loading product...</div>;

  if (!product) return <div className="max-w-2xl mx-auto py-8">Product not found.</div>;

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      navigate("/login");
    } else {
      addToCart(product);
    }
  };

  const categoryName =
    product?.category?.name ||
    (typeof product?.category === "string" ? product.category : "Uncategorized");

  return (
    <>
      <div className="product-details-container">
          <div className="product-details-grid">
            <div className="product-details-image">
              <img
                src={product.image}
                alt={product.name}
              />
            </div>
            <div className="product-details-info">
              <h2>{product.name}</h2>
              <span className="product-category">{categoryName}</span>
              <p className="product-description">{product.description}</p>
              <span className="product-price">₹{product.price}</span>
              <button
                className="add-to-cart-btn"
                onClick={handleAddToCart}
              >
                Add to Cart
              </button>
            </div>
          </div>
          <Link to="/">
            <button className="back-to-home-btn">Back to Home</button>
          </Link>
      </div>
      <Todo message={toast} type="danger" onClose={() => setToast("")} />
    </>
  );
};

export default ProductDetails;
