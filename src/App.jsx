import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthProvider from "./contexts/AuthContext";
import CartProvider from "./contexts/CartContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./routes/ProtectedRoute";
import AdminRoute from "./routes/AdminRoute";

// Pages
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Register from "./pages/Register";

// Admin Pages
import AdminDashboard from "./admin/pages/AdminDashboard";
import AdminProducts from "./admin/pages/AdminProducts";
import AdminCategories from "./admin/pages/AdminCategories";
import AdminInventory from "./admin/pages/AdminInventory";
import AdminSales from "./admin/pages/AdminSales";

const App = () => (
	<AuthProvider>
		<CartProvider>
			<BrowserRouter>
				<Navbar />
				<div className="min-h-screen bg-gray-100">
					<Routes>
						{/* Public */}
						<Route path="/" element={<Home />} />
						<Route path="/login" element={<Login />} />
						<Route path="/register" element={<Register />} />

						{/* User */}
						<Route path="/products" element={<Products />} />
						<Route path="/product/:id" element={<ProductDetails />} />
						<Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
						<Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

						{/* Admin */}
						<Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
						<Route path="/admin/products" element={<AdminRoute><AdminProducts /></AdminRoute>} />
						<Route path="/admin/categories" element={<AdminRoute><AdminCategories /></AdminRoute>} />
						<Route path="/admin/inventory" element={<AdminRoute><AdminInventory /></AdminRoute>} />
						<Route path="/admin/sales" element={<AdminRoute><AdminSales /></AdminRoute>} />
					</Routes>
				</div>
				<Footer />
			</BrowserRouter>
		</CartProvider>
	</AuthProvider>
);

export default App;
