import { Link } from "react-router-dom";

const ProductCard = ({ product, onAddToCart }) => {
  const productId = product._id || product.id;
  const categoryName =
    product.category?.name ||
    (typeof product.category === "string" ? product.category : "Uncategorized");

  // Fallback for missing images
  const handleImageError = (e) => {
    e.target.src = "https://placehold.co/400x400?text=No+Image";
  };

  return (
    <div className="card h-100 border-0 shadow-sm product-card-hover p-3 rounded-4">
      <Link to={`/product/${productId}`} className="text-decoration-none">
        <div className="text-center mb-3 overflow-hidden rounded-3 bg-light" style={{ height: "160px" }}>
          <img 
            src={product.image} 
            alt={product.name} 
            onError={handleImageError}
            style={{ width: "100%", height: "100%", objectFit: "contain" }}
            className="transition"
          />
        </div>
      </Link>
      <div className="card-body p-0 d-flex flex-column text-center">
        <h6 className="fw-bold mb-1 text-dark text-truncate">{product.name}</h6>
        <small className="text-muted mb-2">{categoryName}</small>
        <div className="mt-auto">
          <p className="fs-5 fw-bold mb-2" style={{ color: "var(--accent)" }}>₹{product.price}</p>
          <div className="d-grid gap-2">
            <button 
              className="btn btn-primary fw-bold rounded-3 py-2" 
              onClick={() => onAddToCart(product)}
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;