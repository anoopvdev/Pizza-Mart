
import React, { useEffect, useState } from "react";
import adminApi from "../admin/adminApi";
import "./CategoryManagement.css";

const initialForm = {
  name: "",
  description: "",
  image: null,
  is_active: true,
};

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [preview, setPreview] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [currentPage , setCurrentPage] = useState(1)
  const itemPerPage = 8 ;
  // GET ALL CATEGORIES
  const fetchCategories = async () => {
    try {
      const response = await adminApi.get("categories/");
      const data = response.data;

      setCategories(Array.isArray(data) ? data : data.results || []);
      setError("");
    } catch (err) {
      setError(
        err.response?.data?.detail || "Unable to load categories."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // INPUT CHANGE
  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;

    setForm((old) => ({
      ...old,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // IMAGE CHANGE
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image.");
      e.target.value = "";
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setError("Image size must be less than 2 MB.");
      e.target.value = "";
      return;
    }

    setForm((old) => ({ ...old, image: file }));
    setPreview(URL.createObjectURL(file));
    setError("");
  };

  // OPEN ADD FORM
  const openCreateForm = () => {
    setEditingId(null);
    setForm(initialForm);
    setPreview("");
    setError("");
    setShowForm(true);
  };

  // OPEN EDIT FORM
  const openEditForm = (category) => {
    setEditingId(category.id);

    setForm({
      name: category.name || "",
      description: category.description || "",
      image: null,
      is_active: category.is_active ?? true,
    });

    setPreview(category.image || "");
    setError("");
    setShowForm(true);
  };

  // CREATE / UPDATE CATEGORY
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    const payload = new FormData();
    payload.append("name", form.name.trim());
    payload.append("description", form.description.trim());
    payload.append("is_active", form.is_active);

    if (form.image) {
      payload.append("image", form.image);
    }

    try {
      if (editingId) {
        await adminApi.patch(
          `categories/${editingId}/`,
          payload
        );
      } else {
        await adminApi.post("categories/", payload);
      }

      closeForm();
      await fetchCategories();
    } catch (err) {
      const data = err.response?.data;

      setError(
        typeof data === "object"
          ? Object.entries(data)
              .map(([key, value]) =>
                `${key}: ${Array.isArray(value) ? value.join(", ") : value}`
              )
              .join(" | ")
          : "Unable to save category."
      );
    } finally {
      setSaving(false);
    }
  };

  // CLOSE FORM
  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(initialForm);
    setPreview("");
    setError("");
  };

  // ACTIVATE / DEACTIVATE
  const toggleCategory = async (category) => {
    try {
      const payload = new FormData();
      payload.append("is_active", !category.is_active);

      await adminApi.patch(
        `categories/${category.id}/`,
        payload
      );

      await fetchCategories();
    } catch (err) {
      setError(
        err.response?.data?.detail || "Unable to update category."
      );
    }
  };

  // DELETE CATEGORY
  const deleteCategory = async (category) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${category.name}"?`
    );

    if (!confirmed) return;

    try {
      await adminApi.delete(`categories/${category.id}/`);
      setCategories((old) =>
        old.filter((item) => item.id !== category.id)
      );
    } catch (err) {
      setError(
        err.response?.data?.detail ||
        "Unable to delete category. It may be linked to existing pizzas."
      );
    }
  };

  const filteredCategories = categories.filter((category) =>
    category.name?.toLowerCase().includes(search.toLowerCase())
  );

  const activeCount = categories.filter(
    (category) => category.is_active
  ).length;

  const inactiveCount = categories.length - activeCount;

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-danger" />
        <p className="text-muted mt-3">Loading categories...</p>
      </div>
    );
  }

  return (
    <div className="category-management">

      {/* HEADER */}
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <h2 className="fw-bold mb-1">Category Management</h2>
          <p className="text-muted mb-0">
            Organize your PizzaMart products into categories.
          </p>
        </div>

        <button className="btn btn-danger" onClick={openCreateForm}>
          <i className="bi bi-plus-lg me-2" />
          Add Category
        </button>
      </div>

      {error && !showForm && (
        <div className="alert alert-danger">{error}</div>
      )}

      {/* STATISTICS */}
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="card category-stat-card">
            <div className="card-body">
              <span className="text-muted">Total Categories</span>
              <h3>{categories.length}</h3>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card category-stat-card">
            <div className="card-body">
              <span className="text-muted">Active Categories</span>
              <h3 className="text-success">{activeCount}</h3>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card category-stat-card">
            <div className="card-body">
              <span className="text-muted">Inactive Categories</span>
              <h3 className="text-danger">{inactiveCount}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* ADD / EDIT FORM */}
      {showForm && (
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-header bg-white d-flex justify-content-between align-items-center py-3">
            <h5 className="fw-bold mb-0">
              {editingId ? "Edit Category" : "Add New Category"}
            </h5>

            <button
              className="btn-close"
              type="button"
              onClick={closeForm}
            />
          </div>

          <div className="card-body">
            {error && (
              <div className="alert alert-danger">{error}</div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="row g-3">

                <div className="col-md-6">
                  <label className="form-label">
                    Category Name *
                  </label>

                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Example: Veg Pizza"
                    maxLength={100}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">
                    Category Image
                  </label>

                  <input
                    type="file"
                    className="form-control"
                    accept="image/*"
                    onChange={handleImageChange}
                  />

                  <small className="text-muted">
                    Image format only, maximum 2 MB.
                  </small>
                </div>

                <div className="col-12">
                  <label className="form-label">
                    Description
                  </label>

                  <textarea
                    className="form-control"
                    name="description"
                    rows="3"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Describe this pizza category..."
                  />
                </div>

                {preview && (
                  <div className="col-12">
                    <label className="form-label d-block">
                      Image Preview
                    </label>

                    <img
                      src={preview}
                      alt="Category preview"
                      className="category-image-preview"
                    />
                  </div>
                )}

                <div className="col-12">
                  <div className="form-check form-switch">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="categoryActive"
                      name="is_active"
                      checked={form.is_active}
                      onChange={handleChange}
                    />

                    <label
                      className="form-check-label"
                      htmlFor="categoryActive"
                    >
                      Active Category
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
                    ? "Update Category"
                    : "Save Category"}
                </button>

                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={closeForm}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CATEGORY LIST */}
      <div className="card border-0 shadow-sm">
        <div className="card-body">

          <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-3">
            <h5 className="fw-bold mb-0">All Categories</h5>

            <div className="d-flex gap-2">
              <input
                type="search"
                className="form-control"
                placeholder="Search category..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              <button
                className="btn btn-outline-danger"
                onClick={fetchCategories}
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
                  <th>Image</th>
                  <th>Category Name</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredCategories.length > 0 ? (
                  filteredCategories.map((category) => (
                    <tr key={category.id}>
                      <td>
                        {category.image ? (
                          <img
                            src={category.image}
                            alt={category.name}
                            className="category-table-image"
                          />
                        ) : (
                          <div className="category-table-placeholder">
                            <i className="bi bi-image" />
                          </div>
                        )}
                      </td>

                      <td>
                        <strong>{category.name}</strong>
                      </td>

                      <td className="category-description">
                        {category.description || "-"}
                      </td>

                      <td>
                        <span
                          className={`badge ${
                            category.is_active
                              ? "bg-success"
                              : "bg-secondary"
                          }`}
                        >
                          {category.is_active ? "Active" : "Inactive"}
                        </span>
                      </td>

                      <td>
                        <div className="d-flex gap-2">
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => openEditForm(category)}
                            title="Edit"
                          >
                            <i className="bi bi-pencil-square" />
                          </button>

                          <button
                            className="btn btn-sm btn-outline-warning"
                            onClick={() => toggleCategory(category)}
                            title="Activate / Deactivate"
                          >
                            <i className="bi bi-toggle-on" />
                          </button>

                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => deleteCategory(category)}
                            title="Delete"
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
                      colSpan="5"
                      className="text-center text-muted py-5"
                    >
                      No categories found. Add your first pizza category!
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

export default CategoryManagement;

