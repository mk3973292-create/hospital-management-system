import axios from "axios";
import React, { useContext, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Context } from "../Context/AppContext";

const Login = () => {
  const { isAuthenticated, setIsAuthenticated } = useContext(Context);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "/api/v1/user/login",
        { email, password, role: "Patient" },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      toast.success(response.data.message);
      setIsAuthenticated(true);
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  if (isAuthenticated) {
    return <Navigate to={"/"} />;
  }

  return (
    <section className="section" style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div className="container" style={{ maxWidth: "500px" }}>
        <div className="glass-card" style={{ padding: "40px", background: "white" }}>
          <h2 className="section-title" style={{ fontSize: "2rem", marginBottom: "8px" }}>Sign In</h2>
          <p className="section-subtitle" style={{ marginBottom: "32px" }}>Access your patient portal.</p>

          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="form-input" placeholder="user@example.com" />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="form-input" placeholder="Password" />
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "16px", marginBottom: "32px" }}>
              <span style={{ fontSize: "0.9rem", color: "var(--text-light)" }}>Don't have an account?</span>
              <Link to="/register" style={{ color: "var(--primary-color)", fontWeight: "500", textDecoration: "underline" }}>Register Now</Link>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: "100%", padding: "14px" }}>Log In</button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Login;
