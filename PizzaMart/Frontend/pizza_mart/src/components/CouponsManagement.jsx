
import React, { useEffect, useState } from "react";
import adminApi from "../admin/adminApi";
import './CouponsManagement.css'

const initialForm = {
  code: "",
  discount_type: "PERCENTAGE",
  discount_value: "",
  minimum_value: "0",
  max_discount: "",
  start_date: "",
  expiry_date: "",
  usage_limit: "",
  is_active: true,
};

const CouponManagement = () => {
  const [coupons, setCoupons] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // GET ALL COUPONS
  const fetchCoupons = async () => {
    try {
      const response = await adminApi.get("coupons/");
      const data = response.data;

      setCoupons(Array.isArray(data) ? data : data.results || []);
      setError("");
    } catch (err) {
      setError(
        err.response?.data?.detail || "Unable to load coupons."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  // INPUT CHANGE
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((old) => ({
      ...old,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // OPEN CREATE FORM
  const openCreateForm = () => {
    setEditingId(null);
    setForm(initialForm);
    setError("");
    setShowForm(true);
  };

  // OPEN EDIT FORM
  const openEditForm = (coupon) => {
    setEditingId(coupon.id);

    setForm({
      code: coupon.code || "",
      discount_type: coupon.discount_type || "PERCENTAGE",
      discount_value: coupon.discount_value ?? "",
      minimum_value: coupon.minimum_value ?? "0",
      max_discount: coupon.max_discount ?? "",
      start_date: coupon.start_date
        ? coupon.start_date.slice(0, 16)
        : "",
      expiry_date: coupon.expiry_date
        ? coupon.expiry_date.slice(0, 16)
        : "",
      usage_limit: coupon.usage_limit ?? "",
      is_active: coupon.is_active ?? true,
    });

    setError("");
    setShowForm(true);
  };

  // CREATE / UPDATE COUPON
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    const payload = {
      ...form,
      code: form.code.trim().toUpperCase(),
      discount_value: Number(form.discount_value),
      minimum_value: Number(form.minimum_value || 0),
      max_discount:
        form.max_discount === "" ? null : Number(form.max_discount),
      usage_limit:
        form.usage_limit === "" ? null : Number(form.usage_limit),
    };

    try {
      if (editingId) {
        await adminApi.patch(`coupons/${editingId}/`, payload);
      } else {
        await adminApi.post("coupons/", payload);
      }

      setShowForm(false);
      setEditingId(null);
      setForm(initialForm);

      await fetchCoupons();
    } catch (err) {
      const data = err.response?.data;

      setError(
        typeof data === "object"
          ? Object.entries(data)
              .map(([key, value]) =>
                `${key}: ${Array.isArray(value) ? value.join(", ") : value}`
              )
              .join(" | ")
          : "Unable to save coupon."
      );
    } finally {
      setSaving(false);
    }
  };

  // ACTIVATE / DEACTIVATE
  const toggleCoupon = async (coupon) => {
    try {
      await adminApi.patch(`coupons/${coupon.id}/`, {
        is_active: !coupon.is_active,
      });

      await fetchCoupons();
    } catch (err) {
      alert(
        err.response?.data?.detail || "Unable to update coupon status."
      );
    }
  };

  // DELETE COUPON
  const deleteCoupon = async (coupon) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete coupon ${coupon.code}?`
    );

    if (!confirmed) return;

    try {
      await adminApi.delete(`coupons/${coupon.id}/`);
      setCoupons((old) =>
        old.filter((item) => item.id !== coupon.id)
      );
    } catch (err) {
      alert(
        err.response?.data?.detail || "Unable to delete coupon."
      );
    }
  };

  const filteredCoupons = coupons.filter((coupon) =>
    coupon.code?.toLowerCase().includes(search.toLowerCase())
  );

  const activeCount = coupons.filter(
    (coupon) => coupon.is_active
  ).length;

  const inactiveCount = coupons.length - activeCount;

  const formatDate = (value) => {
    if (!value) return "-";
    return new Date(value).toLocaleDateString("en-IN");
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-danger" />
        <p className="text-muted mt-3">Loading coupons...</p>
      </div>
    );
  }

  return (
    <div className="coupon-management">

      {/* PAGE HEADER */}
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <h2 className="fw-bold mb-1">Coupons & Offers</h2>
          <p className="text-muted mb-0">
            Create and manage PizzaMart discount coupons.
          </p>
        </div>

        <button
          className="btn btn-danger"
          onClick={openCreateForm}
        >
          <i className="bi bi-plus-lg me-2" />
          Create Coupon
        </button>
      </div>

      {error && !showForm && (
        <div className="alert alert-danger">{error}</div>
      )}

      {/* STATISTICS */}
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="card coupon-stat-card">
            <div className="card-body">
              <span className="text-muted">Total Coupons</span>
              <h3>{coupons.length}</h3>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card coupon-stat-card">
            <div className="card-body">
              <span className="text-muted">Active Coupons</span>
              <h3 className="text-success">{activeCount}</h3>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card coupon-stat-card">
            <div className="card-body">
              <span className="text-muted">Inactive Coupons</span>
              <h3 className="text-danger">{inactiveCount}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* CREATE / EDIT FORM */}
      {showForm && (
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-header bg-white d-flex justify-content-between align-items-center py-3">
            <h5 className="mb-0 fw-bold">
              {editingId ? "Edit Coupon" : "Create New Coupon"}
            </h5>

            <button
              className="btn-close"
              onClick={() => {
                setShowForm(false);
                setError("");
              }}
            />
          </div>

          <div className="card-body">
            {error && (
              <div className="alert alert-danger">{error}</div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="row g-3">

                <div className="col-md-6">
                  <label className="form-label">Coupon Code *</label>
                  <input
                    className="form-control text-uppercase"
                    name="code"
                    value={form.code}
                    onChange={handleChange}
                    placeholder="Example: PIZZA20"
                    required
                    maxLength={30}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">Discount Type *</label>
                  <select
                    className="form-select"
                    name="discount_type"
                    value={form.discount_type}
                    onChange={handleChange}
                  
                  >
                    <option value="">Select Discount Type</option>
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (₹)</option>
                  </select>
                </div>

                <div className="col-md-6">
                  <label className="form-label">
                    Discount Value *
                  </label>
                  <input
                    className="form-control"
                    type="number"
                    name="discount_value"
                    value={form.discount_value}
                    onChange={handleChange}
                    min="0.01"
                    step="0.01"
                   
                  />
                  <small className="text-muted">
                    {form.discount_type === "PERCENTAGE"
                      ? "Enter percentage, for example 20."
                      : "Enter fixed discount amount in rupees."}
                  </small>
                </div>

                <div className="col-md-6">
                  <label className="form-label">
                    Minimum Order Amount (₹)
                  </label>
                  <input
                    className="form-control"
                    type="number"
                    name="minimum_value"
                    value={form.minimum_value}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">
                    Maximum Discount (₹)
                  </label>
                  <input
                    className="form-control"
                    type="number"
                    name="max_discount"
                    value={form.max_discount}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    placeholder="Optional"
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">
                    Usage Limit
                  </label>
                  <input
                    className="form-control"
                    type="number"
                    name="usage_limit"
                    value={form.usage_limit}
                    onChange={handleChange}
                    min="1"
                    placeholder="Leave empty for unlimited"
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">Valid From *</label>
                  <input
                    className="form-control"
                    type="datetime-local"
                    name="start_date"
                    value={form.start_date}
                    onChange={handleChange}
                    
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">Valid Until *</label>
                  <input
                    className="form-control"
                    type="datetime-local"
                    name="expiry_date"
                    value={form.expiry_date}
                    onChange={handleChange}
                    
                  />
                </div>

                <div className="col-12">
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      name="is_active"
                      id="couponActive"
                      checked={form.is_active}
                      onChange={handleChange}
                    />
                    <label
                      className="form-check-label"
                      htmlFor="couponActive"
                    >
                      Activate this coupon
                    </label>
                  </div>
                </div>

              </div>

              <div className="d-flex gap-2 mt-4">
                <button
                  type="submit"
                  className="btn btn-danger"
                  disabled={saving}
                >
                  {saving
                    ? "Saving..."
                    : editingId
                    ? "Update Coupon"
                    : "Create Coupon"}
                </button>

                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => {
                    setShowForm(false);
                    setError("");
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* COUPON TABLE */}
      <div className="card border-0 shadow-sm">
        <div className="card-body">
          <div className="d-flex flex-wrap justify-content-between gap-3 mb-3">
            <h5 className="fw-bold mb-0">All Coupons</h5>

            <div className="d-flex gap-2">
              <input
                className="form-control"
                placeholder="Search coupon..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              <button
                className="btn btn-outline-danger"
                onClick={fetchCoupons}
                title="Refresh"
              >
                <i className="bi bi-arrow-clockwise" />
              </button>
            </div>
          </div>

          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th>Coupon</th>
                  <th>Discount</th>
                  <th>Minimum Order</th>
                  <th>Valid Until</th>
                  <th>Usage Limit</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredCoupons.length > 0 ? (
                  filteredCoupons.map((coupon) => (
                    <tr key={coupon.id}>
                      <td>
                        <strong>{coupon.code}</strong>
                      </td>

                      <td>
                        {coupon.discount_type === "PERCENTAGE"
                          ? `${coupon.discount_value}%`
                          : formatCurrency(coupon.discount_value)}
                      </td>

                      <td>
                        {formatCurrency(coupon.minimum_value)}
                      </td>

                      <td>{formatDate(coupon.expiry_date)}</td>

                      <td>{coupon.usage_limit ?? "Unlimited"}</td>

                      <td>
                        <span
                          className={`badge ${
                            coupon.is_active
                              ? "bg-success"
                              : "bg-secondary"
                          }`}
                        >
                          {coupon.is_active ? "Active" : "Inactive"}
                        </span>
                      </td>

                      <td>
                        <div className="d-flex gap-2">
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => openEditForm(coupon)}
                            title="Edit coupon"
                          >
                            <i className="bi bi-pencil-square" />
                          </button>

                          <button
                            className={`btn btn-sm ${
                              coupon.is_active
                                ? "btn-outline-warning"
                                : "btn-outline-success"
                            }`}
                            onClick={() => toggleCoupon(coupon)}
                            title="Activate or deactivate"
                          >
                            <i className={`bi ${
                              coupon.is_active
                                ? "bi-toggle-on"
                                : "bi-toggle-off"
                            }`} />
                          </button>

                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => deleteCoupon(coupon)}
                            title="Delete coupon"
                          >
                            <i className="bi bi-trash" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="7"
                      className="text-center text-muted py-5"
                    >
                      No coupons found. Create your first coupon!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

const formatCurrency = (amount) =>
  `₹${Number(amount || 0).toLocaleString("en-IN")}`;

export default CouponManagement;
