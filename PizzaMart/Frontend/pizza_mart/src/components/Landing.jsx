
import { FaPizzaSlice, FaArrowRight, FaBars,FaSearch,FaShoppingCart } from "react-icons/fa";
import { useState } from "react";
import Navbar from "./Navbar";
import "./LandingPage.css"
import { Link } from "react-router-dom";
const pizzaImages = [
  {
    name: "Margherita",
    image:
      "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=700",
  },
  {
    name: "Pepperoni",
    image:
      "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=700",
  },
  {
    name: "Cheese Burst",
    image:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=700",
  },
  {
    name: "Veggie Supreme",
    image:
      "https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=700",
  },
  {
    name: "Italian Special",
    image:
      "https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=700",
  },
];

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
    
  // Duplicate images to create a seamless scrolling loop.
  const scrollingPizzas = [...pizzaImages, ...pizzaImages];

  return (
    <main className="pizza-landing" id="home">
        {/* <Navbar /> */}
        <nav className="navbar navbar-expand-lg bg-white sticky-top pizza-navbar ">
      <div className="container">
        <a className="navbar-brand pizza-brand" href="/">
            🍕 Pizza <span>Mart</span>
          </a>

        <button
          className="navbar-toggler"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation"
        >
          <FaBars />
        </button>

        <div className={`navbar-collapse ${menuOpen ? "d-block" : "collapse"}`}>
          <ul className="navbar-nav mx-auto">
            {/* {["Home", "Menu", "About", "Contact"].map((item) => (
              <li className="nav-item" key={item}>
                <a
                  className="nav-link"
                  href={`#${item.toLowerCase()}`}
                  onClick={() => setMenuOpen(false)}
                >
                  {item}
                </a>
              </li>
            ))} */}
            <div className='navbar-nav d-flex flex-row gap-5'>
            <Link className='text-decoration-none text-dark ' to="/home" >Home</Link>
            <Link className='text-decoration-none text-dark ' to='/signup'>Menu</Link>
            <Link className='text-decoration-none text-dark 'to='/signup'>About</Link>
            <Link className='text-decoration-none text-dark 'to='/signup'>Contact</Link>
            </div>
          </ul>
          

          <form
            className="search-box"
            onSubmit={(e) => {
              e.preventDefault();
              document.getElementById("menu")?.scrollIntoView({
                behavior: "smooth",
              });
            }}
          >
            <FaSearch />
            <input
              type="search"
              placeholder="Search for pizzass..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </form>

          <div className="nav-actions ">
            
            <a href="/cart" className="btn btn-danger cart-button ">
              <FaShoppingCart /> Cart (0)
            </a>
            
            <div className="d-flex mt- justify-content-end ">
              <Link to="/login" className='text-decoration-none'>
            <button className="btn btn-danger d-flex align-items-center gap-2 " type="button">
              <i className="bi bi-person-circle"></i>
              Login
            </button>
            </Link>
          </div>
          </div>
        </div>
      </div>
    </nav>

      <section className="pizza-hero" id="story">
        <div className="hero-glow hero-glow-one" />
        <div className="hero-glow hero-glow-two" />

        <div className="container hero-container">
          <div className="hero-copy">
            <div className="hero-label">
              <span className="label-dot" />
              FRESH FROM OUR OVEN
            </div>

            <h1 className="hero-title">
              A SLICE OF
              <br />
              <span className="hero-highlight">HAPPINESS.</span>
            </h1>

            <p className="hero-description">
              Every pizza tells a story. From our golden, crispy crust
              to the freshest toppings and melted cheese, we make
              every bite worth remembering.
            </p>

            <div className="hero-buttons">
              <a href="#menu" className="btn hero-primary-btn">
                Explore Our Menu <FaArrowRight />
              </a>
              <a href="/signup" className="hero-secondary-btn">
                Join PizzaMart
              </a>
            </div>

            <div className="hero-note">
              <FaPizzaSlice />
              <span>Handcrafted with love. Served hot.</span>
            </div>
          </div>

          {/* CONTINUOUS PIZZA SCROLL */}
          <div className="pizza-marquee" aria-label="Our pizza varieties">
            <div className="marquee-track">
              {scrollingPizzas.map((pizza, index) => (
                <div
                  className="marquee-pizza"
                  key={`${pizza.name}-${index}`}
                  aria-hidden={index >= pizzaImages.length}
                >
                  <img src={pizza.image} alt={index < pizzaImages.length ? pizza.name : ""} />
                  {index < pizzaImages.length && (
                    <span className="marquee-pizza-name">
                      {pizza.name}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="marquee-caption">
            <span>01 — 05</span>
            <span className="caption-line" />
            <span>DISCOVER YOUR PERFECT SLICE</span>
          </div>
        </div>
      </section>

      {/* SMALL FOOTER, NOT A PRODUCT GRID */}
      <section className="pizza-bottom" id="menu">
        <div className="container pizza-bottom-inner">
          <div>
            <span className="bottom-eyebrow">THE PIZZAMART EXPERIENCE</span>
            <h2>Good food. Great mood. <span>Every time.</span></h2>
          </div>

          <a href="/signup" className="bottom-order-link">
            Start your order <FaArrowRight />
          </a>
        </div>
      </section>

      <footer className="pizza-footer" id="contact">
        <div className="container d-flex flex-wrap justify-content-between gap-2">
          <span>© 2026 PizzaMart</span>
          <span>Made with love and extra cheese 🍕</span>
        </div>
      </footer>
    </main>
  );
}
