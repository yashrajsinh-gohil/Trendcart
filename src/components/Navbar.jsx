import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useCart } from "../hooks/useCart";

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();
  const displayName = user
    ? `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.name || "User"
    : "User";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark sticky-top shadow-sm py-2" 
         style={{ zIndex: 1050, backgroundColor: "var(--accent)" }}>
      <div className="container">
        <Link className="navbar-brand fw-bold fs-3" to="/">
          Trend<span style={{ color: "var(--warning-yellow)" }}>Cart</span>
        </Link>

        <button className="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          {/* Search Bar Space */}
          <div className="mx-auto w-50 d-none d-lg-block"></div>

          <ul className="navbar-nav ms-auto align-items-center gap-2">
            <li className="nav-item">
              <Link to="/products" className="nav-link fw-bold text-white">Shop</Link>
            </li>
            
            {isAuthenticated ? (
              <div className="nav-item dropdown">
                {/* Ensure data-bs-toggle is present for Bootstrap's JS */}
                <button 
                  className="btn fw-bold dropdown-toggle text-dark border-0" 
                  style={{ backgroundColor: "var(--warning-yellow)" }} 
                  id="userDropdown"
                  data-bs-toggle="dropdown" 
                  aria-expanded="false"
                >
                  {displayName.split(" ")[0]}
                </button>
                
                {/* Added 'dropdown-menu-end' to prevent it from going off-screen */}
                <ul className="dropdown-menu dropdown-menu-end shadow border-0 mt-2 py-2" 
                    aria-labelledby="userDropdown"
                    style={{ minWidth: '160px', zIndex: 1100 }}>
                  
                  {user?.role === 'admin' && (
                    <>
                      <li><Link className="dropdown-item fw-bold text-primary" to="/admin/dashboard">Admin Dashboard</Link></li>
                      <li><hr className="dropdown-divider" /></li>
                    </>
                  )}
                  
                  <li><Link className="dropdown-item" to="/profile">My Profile</Link></li>
                  <li>
                    <button className="dropdown-item text-danger fw-medium" onClick={handleLogout}>
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <Link to="/login" className="btn btn-light px-4 fw-bold text-primary">Login</Link>
            )}

            {/* Cart Link */}
            <Link to="/cart" className="nav-link position-relative ms-lg-3">
              <svg width="24" height="24" fill="white" viewBox="0 0 16 16">
                <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l1.313 7h8.17l1.313-7H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
              </svg>
              {cart.length > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger border border-white">
                  {cart.length}
                </span>
              )}
            </Link>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;