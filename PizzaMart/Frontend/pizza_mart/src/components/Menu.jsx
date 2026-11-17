
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

import axios from "axios";
import Footer from "./Footer";

// Helper to ensure image URLs point to the Django backend
const getImageUrl = (image) => {
  if (!image) {
    return "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80";
  }
  if (image.startsWith("http://") || image.startsWith("https://")) {
    return image;
  }
  const backendBase = "https://pizza-mart-mu8r.onrender.com";
  return `${backendBase}${image.startsWith("/") ? "" : "/"}${image}`;
};



const getNormalizedCategory = (pizza) => {
  const rawCat =
    pizza.category_name ||
    pizza.category?.name ||
    pizza.category;

  if (!rawCat || !isNaN(Number(rawCat))) {
    return "Unknown";
  }

  const clean = String(rawCat).toLowerCase().replace(/[-_\s]/g, "");

  if (clean.includes("nonveg") || clean.includes("nonvegetarian")) {
    return "Non-Veg";
  }

  if (clean.includes("veg") || clean.includes("vegetarian")) {
    return "Veg";
  }

  return String(rawCat);
};
export default function Menu() {
  const [pizzas, setPizzas] = useState([]);
  const [errors, setErrors] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState(["All", "Veg", "Non-Veg"]);
  const [currentPage,setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemPerPage = 8;

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
  
const fetchProducts = async (page = 1) => {
  try {
    setLoading(true);
    setErrors("");

    const token =
      localStorage.getItem("token") ||
      localStorage.getItem("access_token");

    const headers = token
      ? { Authorization: `Bearer ${token}` }
      : {};

    const response = await axios.get(
      `https://pizza-mart-mu8r.onrender.com/api/user/auth/products/?page=${page}`,
      { headers }
    );

    const productList = response.data?.results || [];

    setPizzas(productList);
    setTotalPages(
      Math.ceil(response.data.count / itemPerPage)
    );

    console.log("Backend Response:", response.data);

  } catch (error) {
    console.error("Product fetch error:", error.response?.data || error.message);

    setErrors(
      error.response?.data?.detail ||
      error.response?.data?.message ||
      "Unable to load products."
    );
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
  fetchProducts(currentPage);
}, [currentPage]);

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

  const totalPage = totalPages;
  const currentPizzas = filteredPizzas;
  useEffect(()=>{
    setCurrentPage(1);
  },[search,activeCategory])

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
              currentPizzas.map((pizza) => {
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
                        <div className="pizza-title-row  ">
                          <h3>{pizza.name || pizza.title}</h3>



                          <span
                            className={`food-type ${
                              isVeg ? "veg" : isNonVeg ? "non-veg" : ""
                            }  `}
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

          {/* {
            totalPage > 1 &&(
              <div className="d-flex justify-content-center align-items-center gap-2 mt-4 mb-4">
                <button className="btn btn-outline-danger" disabled={currentPage === 1} onClick={()=>setCurrentPage((prev) => prev-1)}>
              Previous
                </button>

                {Array.from({length : totalPage },(_,index)=>(
                  <button key={index} className={`btn ${currentPage === index + 1 ? "btn-danger" : "btn-outline-danger" }`} onClick={() => setCurrentPage(index + 1)}  > {index + 1}     </button>
                ))}
                <button className="btn btn-outline-danger" disabled={currentPage === totalPage} onClick={() =>setCurrentPage((prev) => prev + 1)}>
                  Next
                </button>
              </div>
            )
          }
 */}
        {totalPage > 1 && (
  <div className="d-flex justify-content-center align-items-center gap-2 mt-4 mb-4">

    <button
      className="btn btn-outline-danger"
      disabled={currentPage === 1}
      onClick={() => setCurrentPage(prev => prev - 1)}
    >
      Previous
    </button>

    {Array.from({ length: totalPage }, (_, index) => (
      <button
        key={index}
        className={`btn ${
          currentPage === index + 1
            ? "btn-danger"
            : "btn-outline-danger"
        }`}
        onClick={() => setCurrentPage(index + 1)}
      >
        {index + 1}
      </button>
    ))}

    <button
      className="btn btn-outline-danger"
      disabled={currentPage === totalPage}
      onClick={() => setCurrentPage(prev => prev + 1)}
    >
      Next
    </button>

  </div>
)}

        </section>

        {/* Footer */}
        <Footer />
      </div>
    </>
  );
}