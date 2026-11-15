
import React, { useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

const PasswordChange = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [confirm_password, setConfirmPassword] = useState("");

  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState("");

  const email = location.state?.email || "";
  const reset_token = location.state?.reset_token || "";

  const validatePassword = () => {
    const newErrors = {};

    if (!newPassword.trim()) {
      newErrors.newPassword = "Password is required";
    } else if (newPassword.length < 8) {
      newErrors.newPassword = "Password must be at least 8 characters";
    } else if (!/[A-Z]/.test(newPassword)) {
      newErrors.newPassword = "Add at least one uppercase letter";
    } else if (!/[a-z]/.test(newPassword)) {
      newErrors.newPassword = "Add at least one lowercase letter";
    } else if (!/\d/.test(newPassword)) {
      newErrors.newPassword = "Add at least one number";
    } else if (!/[^A-Za-z0-9]/.test(newPassword)) {
      newErrors.newPassword = "Add at least one special character";
    }

    if (!confirm_password) {
      newErrors.confirm_password = "Please confirm your password";
    } else if (newPassword !== confirm_password) {
      newErrors.confirm_password = "Passwords do not match";
    }

    setError(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();

    setMessage("");
    setError({});
    setSuccess(false);

    if (!email || !reset_token) {
      setMessage("Email or reset token is missing. Please verify OTP again.");
      return;
    }

    if (!validatePassword()) {
      return;
    }

    setLoading(true);

    // IMPORTANT: Backend field names must match exactly.
    const requestData = {
      email: email,
      reset_token: reset_token,
      new_password: newPassword,
      confirm_password: confirm_password,
    };

    console.log("RESET REQUEST DATA:", {
      email: email,
      reset_token: reset_token ? "Present" : "Missing",
      new_password: newPassword ? "Present" : "Missing",
      confirm_password: confirm_password ? "Present" : "Missing",
    });

    try {
      const response = await axios.post(
        "https://pizza-mart-mu8r.onrender.com/api/user/auth/reset-password/",
        requestData
      );

      setMessage(
        response.data.message || "Password changed successfully"
      );

      setSuccess(true);
      setNewPassword("");
      setConfirmPassword("");

      setTimeout(() => {
        navigate("/login");
      }, 2000);

    } catch (err) {
      console.log("RESET API ERROR:", err.response?.data);

      const data = err.response?.data;

      if (data?.new_password) {
        setError({ newPassword: data.new_password.join(" ") });
      } else if (data?.confirm_password) {
        setError({
          confirm_password: data.confirm_password.join(" "),
        });
      } else {
        setMessage(
          data?.error ||
          data?.detail ||
          "Password change failed. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="Password-background">
        <div className="card passsword-card shadow-lg p-3 bg-dark bg-opacity-75 text-white rounded">

          <h2>Create a New Password</h2>

          <strong className="text-center mb-3">
            Remember your password
          </strong>

          <form onSubmit={handleSubmit}>

            <div className="mb-3">
              <label className="form-label m-1">
                New Password
              </label>

              <input
                type="password"
                className="form-control"
                value={newPassword}
                onChange={(ev) => setNewPassword(ev.target.value)}
                placeholder="Enter a strong password"
              />

              {error.newPassword && (
                <p className="text-danger">
                  {error.newPassword}
                </p>
              )}
            </div>

            <div className="mb-3">
              <label className="form-label">
                Confirm Password
              </label>

              <input
                type="password"
                className="form-control"
                value={confirm_password}
                onChange={(ev) => setConfirmPassword(ev.target.value)}
                placeholder="Re-enter the password"
              />

              {error.confirm_password && (
                <p className="text-danger">
                  {error.confirm_password}
                </p>
              )}
            </div>

            {message && (
              <div
                className={`alert ${
                  success ? "alert-success" : "alert-danger"
                }`}
                role="alert"
              >
                {message}
              </div>
            )}

            <button
              type="submit"
              className="btn btn-danger w-100 d-flex justify-content-center mb-3"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Password"}
            </button>

          </form>
        </div>
      </div>
    </>
  );
};

export default PasswordChange;
