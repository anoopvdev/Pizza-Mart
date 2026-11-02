import { useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import "./Landing.css"
import { Link } from "react-router-dom";
import PizzaCard from "../components/PizzaCard";
import "./Home.css"
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
const pizzas = [
  {
    id: 1,
    name: "Margherita Pizza",
    description: "Classic cheese and tomato with fresh basil.",
    price: 299,
    oldPrice: 399,
    rating: "4.8",
    reviews: 124,
    tag: "Bestseller",
    category: "Pizza",
    image:
      "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600",
  },
  {
    id: 2,
    name: "Pepperoni Pizza",
    description: "Loaded with pepperoni and mozzarella.",
    price: 399,
    oldPrice: 499,
    rating: "4.7",
    reviews: 98,
    tag: "Popular",
    category: "Pizza",
    image:
      "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=600",
  },
  {
    id: 3,
    name: "BBQ Chicken Pizza",
    description: "BBQ sauce, chicken and onions.",
    price: 449,
    oldPrice: 549,
    rating: "4.6",
    reviews: 76,
    tag: "New",
    category: "Pizza",
    image:
      "https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=600",
  },
  {
    id: 4,
    name: "Farmhouse Pizza",
    description: "Fresh vegetables, cheese and herbs.",
    price: 349,
    oldPrice: 449,
    rating: "4.5",
    reviews: 62,
    tag: "Bestseller",
    category: "Pizza",
    image:
      "https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=600",
  },
  {
    id: 5,
    name: "Cheese Burst Pizza",
    description: "Extra cheese, extra love.",
    price: 379,
    oldPrice: 499,
    rating: "4.7",
    reviews: 89,
    tag: "Popular",
    category: "Pizza",
    image:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600",
  },
  {
    id: 6,
    name: "Veggie Delight",
    description: "A colourful mix of fresh vegetables.",
    price: 329,
    oldPrice: 429,
    rating: "4.5",
    reviews: 55,
    tag: "Fresh",
    category: "Pizza",
    image:
      "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=600",
  },
];

const favorites = [
  { name: "Classic Margherita", price: 299, rating: "4.8", pizzaId: 1 },
  { name: "BBQ Chicken", price: 449, rating: "4.6", pizzaId: 3 },
  { name: "Cheese Lovers", price: 379, rating: "4.7", pizzaId: 5 },
  { name: "Spicy Pepperoni", price: 399, rating: "4.7", pizzaId: 2 },
  { name: "Veggie Delight", price: 329, rating: "4.5", pizzaId: 6 },
  { name: "Farmhouse Special", price: 349, rating: "4.5", pizzaId: 4 },
];

export default function Home() {
  const [cart, setCart] = useState([]);
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [notice, setNotice] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
const {addToCart,cartCount} = useCart();
  const filteredPizzas = useMemo(() => {
    return pizzas.filter((pizza) => {
      const matchesCategory =
        category === "All" || pizza.category === category;

      const matchesSearch =
        pizza.name.toLowerCase().includes(search.trim().toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [category, search]);

  // const addToCart = (pizza) => {
  //   setCart((current) => [...current, pizza]);
  //   setNotice(`${pizza.name} added to your cart!`);
  //   window.setTimeout(() => setNotice(""), 2500);
  // };

  const cartTotal = cart.reduce((total, item) => total + item.price, 0);

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
      
                <Link to='/menu' className="btn hero-menu-btn">
                  Explore Menu
                </Link>
              </div>
      
              <div className="hero-trust">
                <span><FaLeaf /> Fresh Ingredients</span>
                <span><FaTruck /> Fast Delivery</span>
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
                  <img src={pizzas[0].image} alt="Margherita pizza" />
                </div>
      
                {/* Floating pizza 2 */}
                <div className="floating-pizza pizza-two">
                  <img src={pizzas[1].image} alt="Pepperoni pizza" />
                </div>
      
                {/* Floating pizza 3 */}
                <div className="floating-pizza pizza-three">
                  <img src={pizzas[2].image} alt="BBQ chicken pizza" />
                </div>
      
                {/* Floating pizza 4 */}
                <div className="floating-pizza pizza-four">
                  <img src={pizzas[3].image} alt="Farmhouse pizza" />
                </div>
      
                {/* Floating pizza 5 */}
                <div className="floating-pizza pizza-five">
                  <img src={pizzas[4].image} alt="Cheese burst pizza" />
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
              <span className="section-label">OUR BEST SELLERS</span>
              <h2>Best Sellers</h2>
              <p>Discover our most-loved freshly baked pizzas.</p>
            </div>

            <div className="category-filters">
              {["All", "Pizza"].map((item) => (
                <button
                  key={item}
                  className={`category-btn ${
                    category === item ? "active" : ""
                  }`}
                  onClick={() => setCategory(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {filteredPizzas.length > 0 ? (
            <div className="row g-3">
              {filteredPizzas.map((pizza) => (
                <div className="col-6 col-md-4 col-lg-2" key={pizza.id}>
                  <PizzaCard pizza={pizza} onAdd={addToCart} />
                </div>
              ))}
            </div>
          ) : (
            <div className="alert alert-light border">
              No pizzas found for "{search}". Try another search.
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
          <h2>20% OFF YOUR<br />FIRST ORDER</h2>
          <p>
            Discover your favourite pizzas and enjoy a delicious meal with
            our special first-order offer.
          </p>
          <a href="#menu" className="btn btn-danger primary-btn">
            Order Now <FaArrowRight />
          </a>
        </div>

        <div className="offer-image">
          <img src={pizzas[4].image} alt="Cheesy pizza" />
          <div className="offer-image-caption">
            <small>HOT & FRESH</small>
            <h5>Classic Cheese Pizza</h5>
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

      {/* CUSTOMER FAVORITES */}
      <section className="favorites-section" id="favorites">
        <div className="container">
          <div className="section-heading">
            <div>
              <span className="section-label">CUSTOMER FAVORITES</span>
              <h2>Most-Ordered Pizzas</h2>
              <p>Take a look at what our customers love.</p>
            </div>
            <a href="#menu" className="view-all">View All →</a>
          </div>

          <div className="row g-3">
            {favorites.map((item) => {
              const pizza = pizzas.find((p) => p.id === item.pizzaId);

              return (
                <div className="col-md-6 col-lg-4" key={item.name}>
                  <div className="favorite-card">
                    <img src={pizza.image} alt={item.name} />
                    <div className="favorite-info">
                      <h6>{item.name}</h6>
                      <span className="favorite-rating">★ {item.rating}</span>
                      <strong>₹{item.price}</strong>
                    </div>
                    <button
                      className="btn btn-danger favorite-add"
                      type="button"
                      onClick={() => addToCart(pizza)}
                    >
                      Add
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* BOTTOM CTA */}
      <section className="container bottom-cta" id="about">
        <div className="cta-icon"><FaPizzaSlice /></div>
        <h2>Craving Pizza?</h2>
        <p>
          Freshly made, delicious pizza delivered straight to your door.
        </p>
        <a href="#menu" className="btn btn-light cta-btn">
          Explore Menu <FaArrowRight />
        </a>
      </section>

      {/* FOOTER */}
      <footer className="site-footer" id="contact">
        <div className="container">
          <a className="pizza-logo" href="#home">
            <FaPizzaSlice /> Pizza Mart
          </a>
          <p>Made for Pizza Lovers 🍕</p>
          <small>© 2026 PizzaMart. All rights reserved.</small>
        </div>
      </footer>

      {/* CART FEEDBACK */}
      {notice && (
        <div className="cart-notice" role="status">
          <FaCheckCircle /> {notice}
        </div>
      )}

      {cart.length > 0 && (
        <button
          className="floating-cart"
          onClick={() =>
            window.alert(
              `Cart items: ${cart.length}\nTotal: ₹${cartTotal}\n\nConnect your Cart page to complete checkout.`
            )
          }
        >
          View Cart · {cart.length} items · ₹{cartTotal}
        </button>
      )}
    </>
  );
}