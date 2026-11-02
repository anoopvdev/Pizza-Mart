
import { useState } from "react";
import './Cart.css'
import {
  FaPizzaSlice,
  FaShoppingCart,
  FaSearch,
  FaStar,
  FaPlus,
  FaBars,
  FaMinus,
} from "react-icons/fa";
import "./Menu.css";
import Navbar from "./Navbar";
import { useCart } from "../context/CartCotext";
import { Link } from "react-router-dom";
const pizzas = [
  {
    id: 1,
    name: "Margherita",
    category: "Veg",
    price: 199,
    rating: 4.8,
    description: "Classic cheese, fresh tomato sauce and basil.",
    image:
      "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600",
    tag: "Classic",
  },
  {
    id: 2,
    name: "Farmhouse",
    category: "Veg",
    price: 279,
    rating: 4.7,
    description: "Onion, capsicum, mushrooms and golden cheese.",
    image:
      "https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=600",
    tag: "Popular",
  },
  {
    id: 3,
    name: "Pepperoni",
    category: "Non-Veg",
    price: 329,
    rating: 4.9,
    description: "Pepperoni slices with mozzarella and rich tomato sauce.",
    image:
      "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=600",
    tag: "Bestseller",
  },
  {
    id: 4,
    name: "Cheese Burst",
    category: "Veg",
    price: 299,
    rating: 4.8,
    description: "A soft crust loaded with delicious melted cheese.",
    image:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600",
    tag: "Cheesy",
  },
  {
    id: 5,
    name: "BBQ Chicken",
    category: "Non-Veg",
    price: 359,
    rating: 4.7,
    description: "Smoky barbecue chicken, onions and melted cheese.",
    image:
      "https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=600",
    tag: "Special",
  },
  {
    id: 6,
    name: "Veggie Supreme",
    category: "Veg",
    price: 259,
    rating: 4.6,
    description: "Fresh vegetables, herbs and a crispy golden crust.",
    image:
      "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=600",
    tag: "Fresh",
  },
];

const categories = ["All", "Veg", "Non-Veg"];

export default function Menu() {
  const {increaseQunatity,decreaseQuatity} = useCart();
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState([]);
  
const [menuOpen, setMenuOpen] = useState(false);
const { addToCart, cartCount } = useCart();

  const filteredPizzas = pizzas.filter((pizza) => {
    const matchesCategory =
      activeCategory === "All" || pizza.category === activeCategory;

    const matchesSearch = pizza.name
      .toLowerCase()
      .includes(search.toLowerCase());

    return matchesCategory && matchesSearch;
  });

//   const addToCart = (pizza) => {
//     setCart((previousCart) => {
//       const existingItem = previousCart.find(
//         (item) => item.id === pizza.id
//       );

//       if (existingItem) {
//         return previousCart.map((item) =>
//           item.id === pizza.id
//             ? { ...item, quantity: item.quantity + 1 }
//             : item
//         );
//       }

//       return [...previousCart, { ...pizza, quantity: 1 }];
//     });
//   };

//   const cartCount = cart.reduce(
//     (total, item) => total + item.quantity,
//     0
//   );

  const cartTotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );


  return (
    <div className="menu-page">
       <nav className="navbar navbar-expand-lg sticky-top pizza-navbar bg-white ">
        <div className="container-fluid px-4">
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

            
             <div className='navbar-nav d-flex flex-row gap-5'>
            <Link className='text-decoration-none text-dark ' to="/home" >Home</Link>
            <Link className='text-decoration-none  text-dark  ' to='/menu'>Menu</Link>
            <Link className='text-decoration-none text-dark 'to='/about'>About</Link>
            <Link className='text-decoration-none  text-dark  'to='/contact'>Contact</Link>
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
                            
                    <Link to='/cart' className="btn btn-danger cart-button ">
                              <FaShoppingCart />  Cart {cartCount}
                    </Link>
                    

                    <a className="profile-nav-icon" href="/profile" aria-label="Profile">
                      <i className="bi bi-person-circle"></i>
                     </a>

                  </div>
            
          

          
        </div>
        </div>
      </nav>
      
      {/* Menu hero */}
      <section className="menu-hero">
        <div className="container text-center">
          <span className="menu-eyebrow">MADE FRESH, SERVED HOT</span>
          <h1>
            Find Your <span>Perfect Pizza</span>
          </h1>
          <p>
            Fresh ingredients, irresistible cheese and a little slice of
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

      {/* Categories */}
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

        {/* Pizza cards */}
        <div className="row g-4">
          {filteredPizzas.length > 0 ? (
            filteredPizzas.map((pizza) => (
              <div className="col-sm-6 col-lg-4" key={pizza.id}>
                <article className="pizza-menu-card">
                  <div className="pizza-image-wrap">
                    <img
                      src={pizza.image}
                      alt={pizza.name}
                      className="pizza-menu-image"
                      loading="lazy"
                    />
                    <span className="pizza-tag">{pizza.tag}</span>
                    <span className="pizza-rating">
                      <FaStar /> {pizza.rating}
                    </span>
                  </div>

                  <div className="pizza-card-body">
                    <div className="d-flex justify-content-between align-items-center gap-2">
                      <h3>{pizza.name}</h3>
                      <span
                        className={`food-type ${
                          pizza.category === "Veg" ? "veg" : "non-veg"
                        }`}
                      >
                        {pizza.category}
                      </span>
                    </div>

                    <p>{pizza.description}</p>
                    <div className="pizza-card-footer">
                      <div className="pizza-price">
                        <small>Starting from</small>
                        <strong>₹{pizza.price}</strong>
                      </div>

                      {/* <button
                        className="add-cart-button"
                        type="button"
                        onClick={() => addToCart(pizza)}
                      >
                        Add cart
                      </button> */}
                      <div className="cart-items-actions"></div>
                      <div className="quantity-control">
                      <button type="button" onClick={()=>decreaseQuatity(pizza.id)}aria-label={`Decrease ${pizza.name} qunatity`}>
                        <FaMinus />
                      </button>
                      <span>{pizza.quantity}</span>
                      <button type="button" onClick={()=>increaseQunatity(pizza.id)}aria-label={`Increase ${pizza.name} qunatity`}>
                        <FaPlus />
                      </button>
                      </div>
                      <button
                        className="add-cart-button"
                        type="button"
                        onClick={() => addToCart(pizza)}
                      >
                      
                        Add cart
                      </button>

                    </div>

                    <div className="pizza-card-footer">
                      {/* <div className="pizza-price">
                        <small>Starting from</small>
                        <strong>₹{pizza.price}</strong>
                      </div> */}

                      {/* <button
                        className="add-cart-button"
                        type="button"
                        onClick={() => addToCart(pizza)}
                      >
                        <FaMinus /> 
                      </button> */}
                    </div>


                    
                  </div>
                </article>
              </div>
            ))
          ) : (
            <div className="col-12 text-center py-5">
              <FaPizzaSlice className="empty-menu-icon" />
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
        <div className="menu-cart-summary">
          <div>
            <strong>
              <FaShoppingCart /> Your Cart: {cartCount} item(s)
            </strong>
            <p className="mb-0">Your selected pizzas are ready to order.</p>
          </div>
          <div className="cart-summary-total">₹{cartTotal}</div>
        </div>
      </section>

      {/* Footer */}
      <footer className="menu-footer">
        <div className="container">
          <FaPizzaSlice />
          <p>PizzaMart — Every slice tells a delicious story.</p>
          <small>© 2026 PizzaMart. Made with love and cheese.</small>
        </div>
      </footer>
    </div>
  );
}
