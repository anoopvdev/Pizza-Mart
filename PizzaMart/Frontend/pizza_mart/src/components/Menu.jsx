
import { useEffect, useState } from "react";
import "./Cart.css";
import "./Menu.css";
import {
  FaPizzaSlice,
  FaShoppingCart,
  FaSearch,
  FaStar,
  FaPlus,
  FaMinus,
} from "react-icons/fa";
import Navbar from "./Navbar";
import { useCart } from "../context/CartCotext";
import { Link } from "react-router-dom";
import axios from "axios";

// Helper to ensure image URLs point to the Django backend
const getImageUrl = (image) => {
  if (!image) {
    return "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80";
  }
  if (image.startsWith("http://") || image.startsWith("https://")) {
    return image;
  }
  const backendBase = "http://127.0.0.1:8000";
  return `${backendBase}${image.startsWith("/") ? "" : "/"}${image}`;
};

// Helper to reliably detect Veg vs Non-Veg regardless of how Django stores it
const getNormalizedCategory = (pizza) => {
  if (pizza.is_veg === true || pizza.is_vegetarian === true) return "Veg";
  if (pizza.is_veg === false || pizza.is_vegetarian === false) return "Non-Veg";

  const rawCat =
    typeof pizza.category === "object" && pizza.category !== null
      ? pizza.category.name
      : pizza.category;

  const clean = String(rawCat || "")
    .toLowerCase()
    .replace(/[-_\s]/g, ""); // removes hyphens, underscores, spaces: "non-veg" -> "nonveg"

  if (clean.includes("nonveg")) return "Non-Veg";
  if (clean.includes("veg")) return "Veg";
  return rawCat || "Other";
};

export default function Menu() {
  const [pizzas, setPizzas] = useState([]);
  const [errors, setErrors] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState(["All", "Veg", "Non-Veg"]);

  // Cart Context
  const cartContext = useCart() || {};
  const {
    cart = [],
    addToCart = () => {},
    cartCount = 0,
    increaseQuantity,
    increaseQunatity,
    decreaseQuantity,
    decreaseQuatity,
  } = cartContext;

  const handleIncrease = increaseQuantity || increaseQunatity || (() => {});
  const handleDecrease = decreaseQuantity || decreaseQuatity || (() => {});

  // Fetch products from Django API
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setErrors("");

      const token = localStorage.getItem("token") || localStorage.getItem("access_token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const response = await axios.get("http://127.0.0.1:8000/api/user/auth/products/", {
        headers,
      });

      console.log("Backend Response:", response.data);

      const productList =
        response.data?.results ||
        response.data?.products ||
        response.data?.pizzas ||
        response.data?.data ||
        (Array.isArray(response.data) ? response.data : []);

      setPizzas(Array.isArray(productList) ? productList : []);
    } catch (error) {
      console.error("Product fetch error:", error.response?.data || error.message);
      setErrors(
        error.response?.data?.detail ||
          error.response?.data?.message ||
          "Unable to load products. Please check if your Django server is running."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const cartTotal = (cart || []).reduce(
    (total, item) => total + (Number(item.price) || 0) * (item.quantity || 1),
    0
  );

  const getItemCartQuantity = (pizzaId) => {
    const item = (cart || []).find((c) => c.id === pizzaId);
    return item ? item.quantity : 0;
  };

  // Fixed Filter: Category & Search
  const filteredPizzas = pizzas.filter((pizza) => {
    const normalizedCat = getNormalizedCategory(pizza);

    const matchesCategory =
      activeCategory === "All" ||
      normalizedCat.toLowerCase() === activeCategory.toLowerCase();

    const pizzaName = (pizza.name || pizza.title || "").toString().toLowerCase();
    const matchesSearch = pizzaName.includes(search.toLowerCase().trim());

    return matchesCategory && matchesSearch;
  });

  if (loading) {
    return (
      <div className="text-center mt-5 py-5">
        <div className="spinner-border text-danger" role="status"></div>
        <p className="mt-3">Loading fresh pizzas...</p>
      </div>
    );
  }

  if (errors) {
    return (
      <div className="text-center mt-5 py-5">
        <p className="text-danger fs-5">{errors}</p>
        <button className="btn btn-outline-danger mt-2" onClick={fetchProducts}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="menu-page">
        {/* Menu Hero */}
        <section className="menu-hero">
          <div className="container text-center">
            <span className="menu-eyebrow">MADE FRESH, SERVED HOT</span>
            <h1>
              Find Your <span>Perfect Pizza</span>
            </h1>
            <p>
              Fresh ingredients, irresistible cheese, and a little slice of
              happiness in every bite.
            </p>

            <div className="menu-search">
              <FaSearch />
              <input
                type="text"
                placeholder="Search your favourite pizza..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                aria-label="Search pizzas"
              />
            </div>
          </div>
        </section>

        {/* Categories & Filter */}
        <section className="container menu-content" id="pizzas">
          <div className="menu-section-heading">
            <div>
              <span className="menu-eyebrow">OUR MENU</span>
              <h2>Explore the Menu</h2>
              <p>Pick your favourite and make today delicious.</p>
            </div>

            <div className="menu-filters">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  className={`category-button ${
                    activeCategory === category ? "selected" : ""
                  }`}
                  onClick={() => setActiveCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Pizza Cards Grid */}
          <div className="row g-4">
            {filteredPizzas.length > 0 ? (
              filteredPizzas.map((pizza) => {
                const categoryLabel = getNormalizedCategory(pizza);
                const isVeg = categoryLabel === "Veg";
                const isNonVeg = categoryLabel === "Non-Veg";
                const itemQuantity = getItemCartQuantity(pizza.id);

                return (
                  <div
                    className="col-12 col-sm-6 col-lg-4 col-xl-3 mb-4"
                    key={pizza.id}
                  >
                    <article className="pizza-menu-card">
                      {/* Pizza Image */}
                      <div className="pizza-image-wrap">
                        <img
                          src={getImageUrl(pizza.image || pizza.image_url)}
                          alt={pizza.name || "Pizza"}
                          className="pizza-menu-image"
                          loading="lazy"
                        />

                        {pizza.tag && (
                          <span className="pizza-tag">{pizza.tag}</span>
                        )}

                        {pizza.rating && (
                          <span className="pizza-rating">
                            <FaStar /> {pizza.rating}
                          </span>
                        )}
                      </div>

                      {/* Product Details */}
                      <div className="pizza-card-body">
                        <div className="pizza-title-row">
                          <h3>{pizza.name || pizza.title}</h3>

                          <span
                            className={`food-type ${
                              isVeg ? "veg" : isNonVeg ? "non-veg" : ""
                            }`}
                          >
                            {categoryLabel}
                          </span>
                        </div>

                        <p className="pizza-description">
                          {pizza.description ||
                            "Fresh and delicious oven-baked pizza."}
                        </p>

                        {/* Price and Cart Actions */}
                        <div className="pizza-card-footer">
                          <div className="pizza-price">
                            <small>Price</small>
                            <strong>
                              ₹{Number(pizza.price || 0).toFixed(2)}
                            </strong>
                          </div>

                          {itemQuantity > 0 ? (
                            <div className="pizza-quantity-control">
                              <button
                                type="button"
                                onClick={() => handleDecrease(pizza.id)}
                                aria-label={`Decrease ${pizza.name} quantity`}
                              >
                                <FaMinus />
                              </button>

                              <span>{itemQuantity}</span>

                              <button
                                type="button"
                                onClick={() => handleIncrease(pizza.id)}
                                aria-label={`Increase ${pizza.name} quantity`}
                              >
                                <FaPlus />
                              </button>
                            </div>
                          ) : (
                            <button
                              className="add-cart-button"
                              type="button"
                              onClick={() => addToCart(pizza)}
                            >
                              <FaPlus />
                              <span>Add to cart</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </article>
                  </div>
                );
              })
            ) : (
              <div className="col-12 text-center py-5">
                <FaPizzaSlice className="empty-menu-icon fs-1 text-muted mb-3" />
                <h3>No pizzas found</h3>
                <p>Try another search or choose a different category.</p>
                <button
                  className="category-button selected"
                  onClick={() => {
                    setSearch("");
                    setActiveCategory("All");
                  }}
                >
                  Show all pizzas
                </button>
              </div>
            )}
          </div>

          {/* Cart summary */}
          <div className="menu-cart-summary mt-4 d-flex justify-content-between align-items-center p-3 bg-light rounded">
            <div>
              <strong>
                <FaShoppingCart /> Your Cart: {cartCount} item(s)
              </strong>
              <p className="mb-0 text-muted">
                Your selected pizzas are ready to order.
              </p>
            </div>
            <div className="cart-summary-total fs-4 fw-bold text-danger">
              ₹{cartTotal.toFixed(2)}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="menu-footer mt-5 text-center py-4 bg-dark text-white">
          <div className="container">
            <FaPizzaSlice className="fs-3 mb-2 text-warning" />
            <p className="mb-1">PizzaMart — Every slice tells a delicious story.</p>
            <small className="text-secondary">
              © 2026 PizzaMart. Made with love and cheese.
            </small>
          </div>
        </footer>
      </div>
    </>
  );
}