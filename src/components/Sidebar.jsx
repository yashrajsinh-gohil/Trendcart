import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const SIDEBAR_BG = "#0A1A2F";
const TREND_BLUE = "#2874f0";

const links = [
  { to: "/admin/dashboard", label: "Dashboard", icon: "bi bi-speedometer2" },
  { to: "/admin/products", label: "Products", icon: "bi bi-box-seam" },
  { to: "/admin/inventory", label: "Inventory", icon: "bi bi-archive" },
  { to: "/admin/categories", label: "Categories", icon: "bi bi-tags" },
  { to: "/admin/sales", label: "Sales Report", icon: "bi bi-bar-chart" }
];

export default function Sidebar() {
  const { logout } = useAuth();
  const location = useLocation();

  return (
    <aside
      className="d-flex flex-column justify-content-between align-items-start p-3 vh-100 shadow"
      style={{ background: SIDEBAR_BG, minWidth: 220 }}
    >
      <div className="w-100">
        <h3 className="text-white fw-bold mb-4" style={{ letterSpacing: 1 }}>
          TrendCart
        </h3>
        <nav className="nav flex-column w-100 gap-1">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `nav-link d-flex align-items-center px-3 py-2 rounded fw-medium text-white gap-2 ${
                  isActive || location.pathname === link.to
                    ? "active-link"
                    : ""
                }`
              }
              style={({ isActive }) =>
                isActive || location.pathname === link.to
                  ? { background: TREND_BLUE, color: "#fff" }
                  : { color: "#b0bed9" }
              }
              end
            >
              <i className={link.icon}></i>
              {link.label}
            </NavLink>
          ))}
        </nav>
      </div>
      <button
        className="btn btn-outline-light w-100 mt-4"
        onClick={logout}
        style={{ borderColor: "#22304a" }}
      >
        <i className="bi bi-box-arrow-right me-2"></i> Logout
      </button>
    </aside>
  );
}
