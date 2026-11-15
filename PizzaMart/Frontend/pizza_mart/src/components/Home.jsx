
import { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import "./Landing.css";
import { Link } from "react-router-dom";
import PizzaCard from "../components/PizzaCard";
import "./Home.css";
import Footer from "./Footer";
import {
  FaLeaf,
  FaTruck,
  FaCreditCard,
  FaUtensils,
  FaArrowRight,
  FaGift,
  FaPizzaSlice,
  FaCheckCircle,
} from "react-icons/fa";

import { useCart } from "../context/CartCotext";
import axios from "axios";

export default function Home() {

  const [pizzas, setPizzas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  const { addToCart, cartCount } = useCart();

  // IMAGE URL HANDLER
  const getImageUrl = (image) => {
    if (!image) return "/default-pizza.png";

    if (typeof image === "object") {
      image = image.url || image.image || "";
    }

    if (!image) return "/default-pizza.png";

    if (image.startsWith("http")) {
      return image;
    }

    return `http://127.0.0.1:8000${image.startsWith("/") ? "" : "/"}${image}`;
  };

  // FETCH PRODUCTS FROM BACKEND
  useEffect(() => {

    const fetchPizzas = async () => {

      try {

        setLoading(true);
        setError("");

        const response = await axios.get(
          "http://127.0.0.1:8000/api/user/auth/products/"
        );

        const data = response.data;

        const productList = Array.isArray(data)
          ? data
          : data.results || [];

        // Show only active products when backend provides is_active
        const activeProducts = productList.filter(
          (pizza) => pizza.is_active !== false
        );

        setPizzas(activeProducts);

      } catch (err) {

        console.error("Product fetching error:", err);

        setError(
          err.response?.data?.detail ||
          "Unable to load products. Please try again."
        );

      } finally {

        setLoading(false);

      }

    };

    fetchPizzas();

  }, []);

  // GET CATEGORY NAME
  const getCategoryName = (pizza) => {

    if (typeof pizza.category === "object") {
      return (
        pizza.category?.name ||
        pizza.category?.category_name ||
        ""
      );
    }

    return pizza.category_name || "";
  };

  // FILTER PRODUCTS
  const filteredPizzas = useMemo(() => {

    return pizzas.filter((pizza) => {

      const categoryName = getCategoryName(pizza);

      const matchesCategory =
        category === "All" ||
        category === "Pizza" ||
        categoryName.toLowerCase() === category.toLowerCase();

      const matchesSearch =
        pizza.name?.toLowerCase().includes(search.trim().toLowerCase());

      return matchesCategory && matchesSearch;

    }).slice(0,6);

  }, [pizzas, category, search]);

  // ADD TO CART
  const handleAddToCart = (pizza) => {

    addToCart(pizza);

    setNotice(`${pizza.name} added to your cart!`);

    setTimeout(() => {
      setNotice("");
    }, 2500);

  };

  // HERO IMAGES
  const heroImages = pizzas.slice(0, 5);

  // SPECIAL OFFER IMAGE
  const offerImage =
    pizzas[4]?.image ||
    pizzas[0]?.image ||
    pizzas[0]?.image_url;

  return (
    <>

      <Navbar />

      {/* HERO */}
    
      <section id="home" className="animated-hero">
        
        <div className="container">

          

          <div className="row align-items-center g-4">

            {/* LEFT CONTENT */}

            <div className="col-lg-6 hero-content">

              <span className="hero-badge">
                🍕 YOUR FAVORITE PIZZA PLACE
              </span>

              <h1>
                MORE THAN
                <br />
                <span>JUST A PIZZA</span>
              </h1>

              <p>
                Freshly baked. Perfectly topped. Delicious pizza delivered
                straight to your door. Discover your next favourite slice!
              </p>

              <div className="d-flex flex-wrap gap-3">

                <a href="#menu" className="btn btn-danger hero-order-btn">
                  Order Now <FaArrowRight />
                </a>

                <Link to="/menu" className="btn hero-menu-btn">
                  Explore Menu
                </Link>

              </div>

              <div className="hero-trust">

                <span>
                  <FaLeaf /> Fresh Ingredients
                </span>

                <span>
                  <FaTruck /> Fast Delivery
                </span>

              </div>

            </div>

            {/* RIGHT ANIMATION */}

            <div className="col-lg-6">

              <div className="pizza-animation">

                {/* Decorative circles */}

                <div className="orbit orbit-one"></div>
                <div className="orbit orbit-two"></div>

                {/* Main pizza */}

                <div className="floating-pizza main-pizza">

                  {heroImages[0] && (
                    <img
                      src={getImageUrl(
                        heroImages[0].image ||
                        heroImages[0].image_url
                      )}
                      alt={heroImages[0].name}
                    />
                  )}

                </div>

                {/* Floating pizza 2 */}

                <div className="floating-pizza pizza-two">

                  {heroImages[1] && (
                    <img
                      src={getImageUrl(
                        heroImages[1].image ||
                        heroImages[1].image_url
                      )}
                      alt={heroImages[1].name}
                    />
                  )}

                </div>

                {/* Floating pizza 3 */}

                <div className="floating-pizza pizza-three">

                  {heroImages[2] && (
                    <img
                      src={getImageUrl(
                        heroImages[2].image ||
                        heroImages[2].image_url
                      )}
                      alt={heroImages[2].name}
                    />
                  )}

                </div>

                {/* Floating pizza 4 */}

                <div className="floating-pizza pizza-four">

                  {heroImages[3] && (
                    <img
                      src={getImageUrl(
                        heroImages[3].image ||
                        heroImages[3].image_url
                      )}
                      alt={heroImages[3].name}
                    />
                  )}

                </div>

                {/* Floating pizza 5 */}

                <div className="floating-pizza pizza-five">

                  {heroImages[4] && (
                    <img
                      src={getImageUrl(
                        heroImages[4].image ||
                        heroImages[4].image_url
                      )}
                      alt={heroImages[4].name}
                    />
                  )}

                </div>

                {/* Offer bubble */}

                <div className="pizza-offer-bubble">

                  <span>🔥 SPECIAL OFFER</span>

                  <h4>20% OFF</h4>

                  <small>On your first order</small>

                </div>

                {/* Floating delivery badge */}

                <div className="delivery-bubble">

                  <FaTruck />

                  <div>

                    <strong>Fast Delivery</strong>

                    <small>Hot & Fresh!</small>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* BEST SELLERS */}

      <section id="menu" className="section-padding">

        <div className="container">

          <div className="section-heading">

            <div>

              <span className="section-label">
                OUR BEST SELLERS
              </span>

              <h2>Best Sellers</h2>

              <p>
                Discover our most-loved freshly baked pizzas.
              </p>

            </div>

           

          </div>

          {/* LOADING */}

          {loading ? (

            <div className="text-center py-5">

              <div className="spinner-border text-danger"></div>

              <p className="mt-2">Loading pizzas...</p>

            </div>

          ) : error ? (

            <div className="alert alert-danger">
              {error}
            </div>

          ) : filteredPizzas.length > 0 ? (

            <div className="row g-3">

              {filteredPizzas.map((pizza) => (

                <div
                  className="col-6 col-md-4 col-lg-2"
                  key={pizza.id}
                >

                  <PizzaCard
                    pizza={{
                      ...pizza,
                      image: getImageUrl(
                        pizza.image || pizza.image_url
                      ),
                    }}
                    onAdd={handleAddToCart}
                  />

                </div>

              ))}

            </div>

          ) : (

            <div className="alert alert-light border">

              {search
                ? `No pizzas found for "${search}". Try another search.`
                : "No pizzas available at the moment."}

            </div>

          )}

        </div>

      </section>


      {/* SPECIAL OFFER */}

      <section className="container offer-section">

        <div className="offer-content">

          <span className="offer-label">
            <FaGift /> LIMITED TIME OFFER
          </span>

          <h2>
            20% OFF YOUR
            <br />
            FIRST ORDER
          </h2>

          <p>
            Discover your favourite pizzas and enjoy a delicious meal with
            our special first-order offer.
          </p>

          <a href="#menu" className="btn btn-danger primary-btn">
            Order Now <FaArrowRight />
          </a>

        </div>

        <div className="offer-image">

          {offerImage && (
            <img
              src={getImageUrl(offerImage)}
              alt="Cheesy pizza"
            />
          )}

          <div className="offer-image-caption">

            <small>HOT & FRESH</small>

            <h5>
              {pizzas[4]?.name || pizzas[0]?.name || "Classic Cheese Pizza"}
            </h5>

          </div>

        </div>

      </section>


      {/* BENEFITS */}

      <section className="container service-section">

        <div className="row g-3">

          {[
            {
              icon: <FaLeaf />,
              title: "Quality Food",
              text: "Fresh ingredients in every bite.",
              color: "green",
            },
            {
              icon: <FaTruck />,
              title: "Fast Delivery",
              text: "Hot pizza delivered to your door.",
              color: "orange",
            },
            {
              icon: <FaUtensils />,
              title: "Easy Ordering",
              text: "Your favourite food in a few clicks.",
              color: "red",
            },
            {
              icon: <FaCreditCard />,
              title: "Secure Payment",
              text: "Convenient and secure checkout.",
              color: "blue",
            },
          ].map((item) => (

            <div className="col-6 col-lg-3" key={item.title}>

              <div className="service-card">

                <div className={`service-icon ${item.color}`}>
                  {item.icon}
                </div>

                <div>

                  <h6>{item.title}</h6>

                  <p>{item.text}</p>

                </div>

              </div>

            </div>

          ))}

        </div>

      </section>


      {/* BOTTOM CTA */}

      <section className="container bottom-cta" id="about">

        <div className="cta-icon">
          <FaPizzaSlice />
        </div>

        <h2>Craving Pizza?</h2>

        <p>
          Freshly made, delicious pizza delivered straight to your door.
        </p>

        <Link to="/menu" className="btn btn-light cta-btn">
          Explore Menu <FaArrowRight />
        </Link>

      </section>


     <Footer />

    </>

  );

}
