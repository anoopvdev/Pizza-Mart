
import React, { useEffect, useState, useRef } from "react";
import adminApi from "../admin/adminApi";
import api from "../axios";
import './ProductManagement.css'
const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [categoriesList, setCategoriesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [search,setSearch] = useState("")
  const [editingProduct, setEditingProduct] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  const fileInputRef = useRef(null);

  const initialForm = {
    name: "",
    description: "",
    price: "",
    category: "",
    image: null,
  };

  const [form, setForm] = useState(initialForm);

  // Image URL
 const getImageUrl = (image) => {
  if (!image) return null;

  if (image.startsWith("http://") || image.startsWith("https://")) {
    return image;
  }

  return image.startsWith("/") ? image : `/${image}`;
};

  // Fetch products
  const fetchProducts = async () => {
    try {
      const response = await adminApi.get("products/");

      const list =
        response.data?.results ||
        response.data?.products ||
        response.data;

      setProducts(Array.isArray(list) ? list : []);
      setError("");
    } catch (err) {
      console.error(err.response?.data || err.message);
      setError(
        err.response?.data?.detail ||
        "Unable to load products."
      );
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const response = await adminApi.get("categories/");

      const list = response.data?.results || response.data;

      if (Array.isArray(list)) {
        setCategoriesList(list);
      }
    } catch (err) {
      console.log("Category API unavailable");
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  // Handle form changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    setForm((old) => ({
      ...old,
      [name]: files ? files[0] : value,
    }));
  };

  // Reset form
  const resetForm = () => {
    setForm(initialForm);
    setEditingProduct(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Add or Edit Product
  const saveProduct = async (e) => {
    e.preventDefault();

    setSaving(true);
    setError("");

    try {
      const formData = new FormData();

      formData.append("name", form.name);
      formData.append("description", form.description);
      formData.append("price", form.price);
      formData.append("category", form.category);

      // Only send image when a new image is selected
      if (form.image) {
        formData.append("image", form.image);
      }

      // New products are active by default
      if (!editingProduct) {
        formData.append("is_available", true);
      }

      if (editingProduct) {
        // Update existing product
        await adminApi.patch(
          `products/${editingProduct.id}/`,
          formData
        );

        alert("Product updated successfully!");
      } else {
        // Create new product
        await adminApi.post("products/", formData);

        alert("Product added successfully!");
      }

      resetForm();
      setShowForm(false);

      await fetchProducts();

    } catch (err) {
      console.error(
        "Product save error:",
        err.response?.data || err.message
      );

      const data = err.response?.data;

      setError(
        typeof data === "object" && data !== null
          ? Object.entries(data)
              .map(([key, value]) =>
                `${key}: ${
                  Array.isArray(value)
                    ? value.join(", ")
                    : value
                }`
              )
              .join(" | ")
          : "Unable to save product."
      );
    } finally {
      setSaving(false);
    }
  };
  const filteredPizzas = products.filter((pizza)=>
  pizza.name?.toLowerCase().includes(search.toLowerCase()));
  // Edit Product
  const editProduct = (product) => {
    setEditingProduct(product);

    setForm({
      name: product.name || "",
      description: product.description || "",
      price: product.price || "",
      category:
        product.category?.id ??
        product.category ??
        "",
      image: null,
    });

    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Active / Deactive Product
  const toggleProductStatus = async (product) => {
    const currentStatus = product.is_active ?? true;
    const newStatus = !currentStatus;

    const action = newStatus ? "activate" : "deactivate";

    if (
      !window.confirm(
        `Are you sure you want to ${action} ${product.name}?`
      )
    ) {
      return;
    }

    setUpdatingId(product.id);

    try {
      await adminApi.patch(
        `products/${product.id}/`,
        {
          is_active: newStatus,
        }
      );

      setProducts((old) =>
        old.map((item) =>
          item.id === product.id
            ? { ...item, is_active: newStatus }
            : item
        )
      );

      alert(
        newStatus
          ? "Product activated successfully!"
          : "Product deactivated successfully!"
      );

    } catch (err) {
      console.error(
        "Status update error:",
        err.response?.data || err.message
      );

      alert(
        err.response?.data?.detail ||
        "Unable to update product status."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  // Delete Product
  const deleteProduct = async (product) => {
    if (
      !window.confirm(
        `Are you sure you want to delete ${product.name}?`
      )
    ) {
      return;
    }

    try {
      await adminApi.delete(`products/${product.id}/`);

      setProducts((old) =>
        old.filter((item) => item.id !== product.id)
      );

      alert("Product deleted successfully!");

    } catch (err) {
      alert(
        err.response?.data?.detail ||
        "Unable to delete product."
      );
    }
  };

  if (loading) {
    return (
      <p className="p-4 text-center">
        Loading products...
      </p>
    );
  }

  return (
    <div className="container-fluid p-4">

      {/* Header */}
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
        <div>
          <h3 className="fw-bold">
            Product Management
          </h3>

          <p className="text-muted">
            Manage your PizzaMart menu
          </p>
        </div>

        <button
          className="btn btn-danger"
          onClick={() => {
            if (showForm) {
              resetForm();
            }
            setShowForm(!showForm);
          }}
        >
          <i className="bi bi-plus-lg me-2" />

          {showForm ? "Close Form" : "Add Product"}
        </button>
      </div>

      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}

      {/* Add / Edit Form */}
      <div className="d-flex gap-2 mb-4">
          <div className="input-group">
            <span className="input-group-text bg-white">
              <i className="bi bi-search text-muted" />
            </span>
            <input type="search" className="form-control" placeholder="Search pizza by name...." value={search} onChange={(ev)=> setSearch(ev.target.value)}/>
            {search &&(
              <button className="btn btn-outline-secondary" onClick={()=>setSearch("")} type="button">
              <i className="bi bi-x-lg" />                
              </button>
            )}
          </div>
          <button className="btn btn-outline-danger" onClick={fetchProducts} title="Refresh products" type="button">
            <i  className="bi bi-arrow-clockwise"/>
          </button>
            </div>
      {showForm && (
        <div className="card border-0 shadow-sm mb-4">

          <div className="card-header bg-white py-3">
            <h5 className="mb-0 fw-bold">
              {editingProduct
                ? "Edit Product"
                : "Add New Product"}
            </h5>
          </div>


          <div className="card-body">

            <form onSubmit={saveProduct}>

              <div className="row g-3">

                {/* Product Name */}
                <div className="col-md-6">
                  <label className="form-label fw-semibold">
                    Product Name
                  </label>

                  <input
                    className="form-control"
                    placeholder="e.g. Margherita"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Category */}
                <div className="col-md-6">
                  <label className="form-label fw-semibold">
                    Category
                  </label>

                  {categoriesList.length > 0 ? (
                    <select
                      className="form-select"
                      name="category"
                      value={form.category}
                      onChange={handleChange}
                      required
                    >
                      <option value="">
                        Select Category
                      </option>

                      {categoriesList.map((cat) => (
                        <option
                          key={cat.id}
                          value={cat.id}
                        >
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <select
                      className="form-select"
                      name="category"
                      value={form.category}
                      onChange={handleChange}
                      required
                    >
                      <option value="">
                        Select Category
                      </option>
                      <option value="1">Veg</option>
                      <option value="2">Non-Veg</option>
                    </select>
                  )}
                </div>

                {/* Price */}
                <div className="col-md-6">
                  <label className="form-label fw-semibold">
                    Price (₹)
                  </label>

                  <input
                    className="form-control"
                    type="number"
                    min="0.01"
                    step="0.01"
                    name="price"
                    value={form.price}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Image */}
                <div className="col-md-6">
                  <label className="form-label fw-semibold">
                    Product Image
                  </label>

                  <input
                    ref={fileInputRef}
                    className="form-control"
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={handleChange}
                  />

                  {editingProduct && editingProduct.image && (
                    <div className="mt-2">
                      <small className="text-muted">
                        Current image:
                      </small>

                      <img
                        src={getImageUrl(editingProduct.image)}
                        alt="Current product"
                        width="65"
                        height="55"
                        className="ms-2 rounded"
                        style={{ objectFit: "cover" }}
                      />
                    </div>
                  )}
                </div>

                {/* Description */}
                <div className="col-12">
                  <label className="form-label fw-semibold">
                    Description
                  </label>

                  <textarea
                    className="form-control"
                    rows="3"
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Delicious pizza with fresh toppings..."
                  />
                </div>

              </div>

              {/* Buttons */}
              <div className="mt-4 d-flex gap-2">

                <button
                  type="submit"
                  className="btn btn-danger px-4"
                  disabled={saving}
                >
                  {saving
                    ? "Saving..."
                    : editingProduct
                    ? "Update Product"
                    : "Save Product"}
                </button>

                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => {
                    resetForm();
                    setShowForm(false);
                  }}
                >
                  Cancel
                </button>

              </div>

            </form>
          </div>
        </div>
      )}

      {/* Product Table */}
      <div className="card border-0 shadow-sm">

        <div className="card-body">

          <div className="table-responsive">

            <table className="table table-hover align-middle">

              <thead className="table-light">
                <tr>
                  <th>Image</th>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>

              <tbody>

                {filteredPizzas.length > 0 ? (

                  filteredPizzas.map((product) => {

                    const imgUrl = getImageUrl(
                      product.image || product.image_url
                    );

                    const catName =
                      typeof product.category === "object"
                        ? product.category?.name
                        : product.category_name ||
                          product.category;

                    const isActive =
                      product.is_active ?? true;

                    return (

                      <tr key={product.id}>

                        {/* Image */}
                        <td>
                          {imgUrl ? (
                            <img
                              src={imgUrl}
                              alt={product.name}
                              width="55"
                              height="45"
                              style={{
                                objectFit: "cover",
                                borderRadius: 8,
                              }}
                            />
                          ) : (
                            <span className="fs-3">
                              🍕
                            </span>
                          )}
                        </td>

                        {/* Product */}
                        <td>
                          <strong className="d-block">
                            {product.name}
                          </strong>

                          <span className="text-muted small">
                            {product.description ||
                              "No description"}
                          </span>
                        </td>

                        {/* Category */}
                        <td>
                          <span
                            className={`badge ${
                              String(catName)
                                .toLowerCase()
                                .includes("non")
                                ? "bg-danger"
                                : "bg-success"
                            }`}
                          >
                            {catName || "N/A"}
                          </span>
                        </td>

                        {/* Price */}
                        <td className="fw-bold">
                          ₹{Number(product.price || 0).toFixed(2)}
                        </td>

                        {/* Status */}
                        <td>
                          <span
                            className={`badge ${
                              isActive
                                ? "bg-success"
                                : "bg-secondary"
                            }`}
                          >
                            {isActive
                              ? "Active"
                              : "Deactive"}
                          </span>
                        </td>

                        {/* Actions */}
                        <td>
                          <div className="d-flex justify-content-end gap-2 flex-wrap">

                            {/* Edit */}
                            <button
                              className="btn btn-sm btn-outline-primary"
                              title="Edit Product"
                              onClick={() =>
                                editProduct(product)
                              }
                            >
                              <i className="bi bi-pencil-square me-1" />
                              {/* Edit */}
                            </button>

                            {/* Active / Deactive */}
                            <button
                              className={`btn btn-sm ${
                                isActive
                                  ? "btn-outline-warning"
                                  : "btn-outline-success"
                              }`}
                              title={
                                isActive
                                  ? "Deactivate Product"
                                  : "Activate Product"
                              }
                              disabled={
                                updatingId === product.id
                              }
                              onClick={() =>
                                toggleProductStatus(product)
                              }
                            >
                              {updatingId === product.id ? (
                                "Updating..."
                              ) : (
                                <>
                                  <i
                                    className={`bi ${
                                      isActive
                                        ? "bi-toggle-on"
                                        : "bi-toggle-off"
                                    } me-1`}
                                  />

                                  {isActive
                                    ? ""
                                    : ""}
                                </>
                              )}
                            </button>

                            {/* Delete */}
                            <button
                              className="btn btn-sm btn-outline-danger"
                              title="Delete Product"
                              onClick={() =>
                                deleteProduct(product)
                              }
                            >
                              <i className="bi bi-trash me-1" />
                              {/* Delete */}
                            </button>

                          </div>
                        </td>

                      </tr>
                    );
                  })

                ) : (

                  <tr>
                    <td
                      colSpan="6"
                      className="text-center text-muted py-5"
                    >
                      {search
  ? `No pizzas found matching "${search}"`
  : 'No products found. Click Add Product to create one.'}
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

export default ProductManagement;
