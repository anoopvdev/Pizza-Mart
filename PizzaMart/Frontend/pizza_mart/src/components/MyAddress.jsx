
import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "https://pizza-mart-mu8r.onrender.com/api/user/auth/addresses/";

const emptyForm = {
  full_name: "",
  phone: "",
  address_line: "",
  city: "",
  state: "",
  pincode: "",
  address_type: "Home",
  is_default: false,
};

const MyAddresses = () => {
  const [addresses, setAddresses] = useState([]);
  const [formData, setFormData] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const token = localStorage.getItem("access");

  const getConfig = () => ({
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  // Fetch all saved addresses
  const fetchAddresses = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(API_URL, getConfig());

      setAddresses(
        Array.isArray(response.data)
          ? response.data
          : response.data.results || []
      );
    } catch (err) {
      setError(
        err.response?.data?.detail ||
        "Unable to load your addresses."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Open add form
  const handleAdd = () => {
    setEditingId(null);
    setFormData(emptyForm);
    setError("");
    setSuccess("");
    setShowForm(true);
  };

  // Open edit form
  const handleEdit = (address) => {
    setEditingId(address.id);

    setFormData({
      full_name: address.full_name || "",
      phone: address.phone || "",
      address_line: address.address-line || "",
      city: address.city || "",
      state: address.state || "",
      pincode: address.pincode || "",
      address_type: address.address_type || "Home",
      is_default: address.is_default || false,
    });

    setError("");
    setSuccess("");
    setShowForm(true);
  };

  // Add or update address
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      if (editingId) {
        await axios.patch(
          `${API_URL}${editingId}/`,
          formData,
          getConfig()
        );

        setSuccess("Address updated successfully!");
      } else {
        await axios.post(API_URL, formData, getConfig());

        setSuccess("Address added successfully!");
      }

      setShowForm(false);
      setFormData(emptyForm);
      setEditingId(null);

      await fetchAddresses();
    } catch (err) {
      const data = err.response?.data;

      if (data && typeof data === "object") {
        const messages = Object.entries(data)
          .map(([field, messages]) =>
            `${field}: ${
              Array.isArray(messages) ? messages.join(", ") : messages
            }`
          )
          .join(" | ");

        setError(messages || "Unable to save address.");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setSaving(false);
    }
  };

  // Delete address
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this address?"
    );

    if (!confirmDelete) return;

    try {
      setError("");
      await axios.delete(`${API_URL}${id}/`, getConfig());

      setSuccess("Address deleted successfully!");
      await fetchAddresses();
    } catch (err) {
      setError(
        err.response?.data?.detail ||
        "Unable to delete address."
      );
    }
  };

  // Set default address
  const handleMakeDefault = async (id) => {
    try {
      setError("");
      await axios.post(
        `${API_URL}${id}/make-default/`,
        {},
        getConfig()
      );

      setSuccess("Default address updated!");
      await fetchAddresses();
    } catch (err) {
      setError(
        err.response?.data?.detail ||
        "Unable to update default address."
      );
    }
  };
  console.log(formData);
  return (
    <div className="container py-5">

      {/* Page Header */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-2">My Addresses</h2>
          <p className="text-muted mb-0">
            Manage your delivery addresses for PizzaMart orders.
          </p>
        </div>

        <button
          className="btn btn-danger mt-3 mt-md-0"
          onClick={handleAdd}
        >
          <i className="bi bi-plus-lg me-2"></i>
          Add New Address
        </button>
      </div>

      {/* Messages */}
      {success && (
        <div className="alert alert-success alert-dismissible">
          {success}
          <button
            type="button"
            className="btn-close"
            onClick={() => setSuccess("")}
          ></button>
        </div>
      )}

      {error && (
        <div className="alert alert-danger alert-dismissible">
          {error}
          <button
            type="button"
            className="btn-close"
            onClick={() => setError("")}
          ></button>
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-danger"></div>
          <p className="mt-3 text-muted">Loading addresses...</p>
        </div>
      ) : (
        <>
          {/* Address List */}
          {addresses.length === 0 ? (
            <div className="text-center bg-light rounded-4 p-5">
              <i className="bi bi-geo-alt display-3 text-danger"></i>
              <h4 className="fw-bold mt-3">No saved addresses</h4>
              <p className="text-muted">
                Add your delivery address to order your favourite pizzas.
              </p>
              <button
                className="btn btn-danger"
                onClick={handleAdd}
              >
                Add Your First Address
              </button>
            </div>
          ) : (
            <div className="row g-4">
              {addresses.map((item) => (
                <div className="col-md-6 col-lg-4" key={item.id}>
                  <div
                    className={`card h-100 shadow-sm rounded-4 ${
                      item.is_default
                        ? "border-danger border-2"
                        : "border-0"
                    }`}
                  >
                    <div className="card-body p-4">

                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <span className="badge bg-light text-dark border px-3 py-2">
                          <i className="bi bi-geo-alt me-1"></i>
                          {item.address_type}
                        </span>

                        {item.is_default && (
                          <span className="badge bg-success">
                            <i className="bi bi-check-circle me-1"></i>
                            Default
                          </span>
                        )}
                      </div>

                      <h5 className="fw-bold mb-2">
                        {item.full_name}
                      </h5>

                      <p className="text-muted mb-2">
                        <i className="bi bi-telephone me-2"></i>
                        {item.phone}
                      </p>

                      <p className="text-secondary mb-3">
                        <i className="bi bi-house-door me-2"></i>
                        {item.address_line}
                        <br />
                        {item.city}, {item.state}
                        <br />
                        PIN: {item.pincode}
                      </p>

                      <hr />

                      <div className="d-flex flex-wrap gap-2">
                        <button
                          className="btn btn-outline-primary btn-sm"
                          onClick={() => handleEdit(item)}
                        >
                          <i className="bi bi-pencil me-1"></i>
                          Edit
                        </button>

                        <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => handleDelete(item.id)}
                        >
                          <i className="bi bi-trash me-1"></i>
                          Delete
                        </button>

                        {!item.is_default && (
                          <button
                            className="btn btn-outline-success btn-sm"
                            onClick={() => handleMakeDefault(item.id)}
                          >
                            Set Default
                          </button>
                        )}
                      </div>

                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Add / Edit Address Form */}
      {showForm && (
        <div
          className="modal d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.55)" }}
        >
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border-0 rounded-4">

              <div className="modal-header">
                <h5 className="modal-title fw-bold">
                  {editingId ? "Edit Address" : "Add New Address"}
                </h5>

                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowForm(false)}
                ></button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="modal-body p-4">

                  <div className="row g-3">

                    <div className="col-md-6">
                      <label className="form-label fw-semibold">
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="full_name"
                        className="form-control"
                        placeholder="Enter your name"
                        value={formData.full_name}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        className="form-control"
                        placeholder="Enter phone number"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label fw-semibold">
                        Full Address
                      </label>
                      <textarea
                        name="address"
                        className="form-control"
                        rows="3"
                        placeholder="House name, street, landmark..."
                        value={formData.address_line}
                        onChange={(e)=>setFormData({
                            ...formData,address_line:e.target.value
                        })}
                        required
                      ></textarea>
                    </div>

                    <div className="col-md-4">
                      <label className="form-label fw-semibold">
                        City
                      </label>
                      <input
                        type="text"
                        name="city"
                        className="form-control"
                        value={formData.city}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="col-md-4">
                      <label className="form-label fw-semibold">
                        State
                      </label>
                      <input
                        type="text"
                        name="state"
                        className="form-control"
                        value={formData.state}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="col-md-4">
                      <label className="form-label fw-semibold">
                        PIN Code
                      </label>
                      <input
                        type="text"
                        name="pincode"
                        className="form-control"
                        maxLength="10"
                        value={formData.pincode}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold">
                        Address Type
                      </label>
                      <select
                        name="address_type"
                        className="form-select"
                        value={formData.address_type}
                        onChange={handleChange}
                      >
                        <option value="Home">Home</option>
                        <option value="Work">Work</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div className="col-md-6 d-flex align-items-end">
                      <div className="form-check mb-2">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          name="is_default"
                          id="isDefault"
                          checked={formData.is_default}
                          onChange={handleChange}
                        />
                        <label
                          className="form-check-label fw-semibold"
                          htmlFor="isDefault"
                        >
                          Set as default delivery address
                        </label>
                      </div>
                    </div>

                  </div>
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-light"
                    onClick={() => setShowForm(false)}
                    disabled={saving}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="btn btn-danger px-4"
                    disabled={saving}
                  >
                    {saving ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Saving...
                      </>
                    ) : (
                      editingId ? "Update Address" : "Save Address"
                    )}
                  </button>
                </div>
              </form>

            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default MyAddresses;
