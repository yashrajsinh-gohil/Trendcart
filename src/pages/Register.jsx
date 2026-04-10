import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const { register, error, setError } = useAuth();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await register({ firstName, lastName, email, password });
    if (success) {
      navigate("/");
    }
  };

  return (
        <div className="d-flex align-items-center justify-content-center min-vh-100 py-5" 
          style={{ background: "#fff" }}>
      
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-10 col-xl-8">
            
            <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
              <div className="row g-0">
                
                {/* Left Side: Welcome & Highlights (Visible on large screens only) */}
                 <div className="col-lg-5 d-none d-lg-flex flex-column justify-content-center align-items-center p-5 text-dark text-center" 
                    style={{ backgroundColor: "#f5f7fa", borderRight: "1px solid #eee" }}>
                  <h2 className="fw-bold mb-2 text-primary w-100" style={{ fontSize: "2.2rem" }}>Welcome to Trend<span className="text-dark">Cart</span></h2>
                  <h4 className="fw-semibold mb-4 text-secondary w-100" style={{ fontSize: "1.3rem" }}>Happy to see you!</h4>
                </div>

                {/* Right Side: Register Form */}
                <div className="col-lg-7 bg-white p-5">
                  <div className="mb-4">
                    <h3 className="fw-bold text-dark mb-1">Create Account</h3>
                    <p className="text-muted small">create your trendcart account.</p>
                  </div>

                  <form onSubmit={handleSubmit}>
                    <div className="row g-3 mb-3">
                      <div className="col-6">
                        <label className="form-label small fw-bold text-muted text-uppercase ls-1">First Name</label>
                        <input
                          type="text"
                          className="form-control form-control-lg border-2 shadow-none rounded-3"
                          placeholder="Rahul"
                          value={firstName}
                          onChange={(e) => { setFirstName(e.target.value); setError(""); }}
                          required
                        />
                      </div>
                      <div className="col-6">
                        <label className="form-label small fw-bold text-muted text-uppercase ls-1">Last Name</label>
                        <input
                          type="text"
                          className="form-control form-control-lg border-2 shadow-none rounded-3"
                          placeholder="Sharma"
                          value={lastName}
                          onChange={(e) => { setLastName(e.target.value); setError(""); }}
                          required
                        />
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="form-label small fw-bold text-muted text-uppercase ls-1">Email Address</label>
                      <input
                        type="email"
                        className="form-control form-control-lg border-2 shadow-none rounded-3"
                        placeholder="rahul@example.com"
                        value={email}
                        onChange={(e) => { setEmail(e.target.value); setError(""); }}
                        required
                      />
                    </div>

                    <div className="mb-4">
                      <label className="form-label small fw-bold text-muted text-uppercase ls-1">Password</label>
                      <input
                        type="password"
                        className="form-control form-control-lg border-2 shadow-none rounded-3"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => { setPassword(e.target.value); setError(""); }}
                        required
                      />
                    </div>

                    {error && (
                      <div className="alert alert-danger py-2 border-0 small fw-bold text-center mb-4">
                        {error}
                      </div>
                    )}

                    <button className="btn btn-warning w-100 fw-bold py-3 rounded-3 shadow-sm mb-4 hover-lift"
                            style={{ color: "var(--accent)", fontSize: "1.1rem" }}>
                      REGISTER NOW
                    </button>

                    <div className="text-center">
                      <span className="text-muted small">Already have an account? </span>
                      <Link to="/login" className="small fw-bold text-decoration-none" style={{ color: "var(--accent)" }}>
                        Login Here
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

export default Register;