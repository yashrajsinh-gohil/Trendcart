import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const { login, error, setError } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const redirectPath = await login(email, password);
    if (redirectPath) {
      navigate(redirectPath);
    }
  };

  return (
        <div className="d-flex align-items-center justify-content-center min-vh-100" 
          style={{ background: "#fff" }}>
      
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-5">
            
            {/* Login Card */}
            <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
              <div className="row g-0">
                <div className="card-body p-5 bg-white">
                  
                  {/* Brand Branding */}
                  <div className="text-center mb-4">
                    <h2 className="fw-bold mb-1" style={{ color: "var(--accent)" }}>
                      Trend<span className="text-dark">Cart</span>
                    </h2>
                    <p className="text-muted small text-uppercase fw-bold ls-1">Welcome Back</p>
                  </div>

                  <form onSubmit={handleSubmit}>
                    {/* Email Field with Icon-like styling */}
                    <div className="mb-3">
                      <label className="form-label small fw-bold text-muted">EMAIL ADDRESS</label>
                      <input
                        type="email"
                        className="form-control form-control-lg border-2 shadow-none rounded-3"
                        placeholder="name@example.com"
                        value={email}
                        onChange={(e) => { setEmail(e.target.value); setError(""); }}
                        required
                        style={{ fontSize: '0.95rem' }}
                      />
                    </div>

                    {/* Password Field */}
                    <div className="mb-4">
                      <div className="d-flex justify-content-between">
                        <label className="form-label small fw-bold text-muted">PASSWORD</label>                      </div>
                      <input
                        type="password"
                        className="form-control form-control-lg border-2 shadow-none rounded-3"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => { setPassword(e.target.value); setError(""); }}
                        required
                      />
                    </div>

                    {/* Error Feedback */}
                    {error && (
                      <div className="alert alert-danger py-2 border-0 small fw-bold text-center mb-4 animate__animated animate__shakeX">
                        {error}
                      </div>
                    )}

                    {/* Login Button */}
                    <button className="btn btn-warning w-100 fw-bold py-3 rounded-3 shadow-sm mb-4 transition-all hover-lift"
                            style={{ color: "var(--accent)", fontSize: "1.1rem" }}>
                      LOGIN TO ACCOUNT
                    </button>

                    {/* Footer Links */}
                    <div className="text-center">
                      <span className="text-muted small">New to TrendCart? </span>
                      <Link to="/register" className="small fw-bold text-decoration-none" style={{ color: "var(--accent)" }}>
                        Create an account
                      </Link>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;