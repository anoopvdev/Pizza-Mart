import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Logout.css";

const Logout = () => {
  const navigate = useNavigate();
  const {clearCart} = useState()
  const handleLogout = () => {
    // Remove JWT tokens from localStorage
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");

    // Remove any saved user login details, if your app uses this key
    localStorage.removeItem("user");

    // Redirect to login page
    navigate("/login", { replace: true });
  };

  return (
    <div className="logout-page">
      <div className="logout-card shadow">
        <div className="logout-icon">
          <i className="bi bi-box-arrow-right"></i>
        </div>

        <h2 className="fw-bold mt-3">Are you leaving?</h2>

        <p className="text-muted mt-3">
          Are you sure you want to log out of your PizzaMart account?
        </p>

        <div className="d-flex flex-column gap-3 mt-4">
          <button
            type="button"
            className="btn btn-danger logout-btn"
            onClick={handleLogout}
          >
            <i className="bi bi-box-arrow-right me-2"></i>
            Yes, Logout
          </button>

          <Link to="/home" className="btn btn-outline-secondary cancel-btn">
            Cancel
          </Link>
        </div>

        <p className="small text-muted mt-4 mb-0">
          Thank you for choosing PizzaMart!
        </p>
      </div>
    </div>
  );
};

export default Logout;