
import { Link } from "react-router-dom";
import {
  FaPizzaSlice,
  FaArrowLeft,
  FaTrash,
  FaMinus,
  FaPlus,
  FaShoppingCart,
} from "react-icons/fa";
import { useCart } from "../context/CartCotext";
import "./Cart.css"

export default function Cart() {
  const {
    cartItems,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    cartCount,
    cartTotal,
    loading,
  } = useCart();

  return (
    <div className="cart-page">
      <nav className="navbar cart-navbar">
        <div className="container">
          <Link to="/" className="navbar-brand cart-brand">
            <FaPizzaSlice /> Pizza<span>Mart</span>
          </Link>

          <Link to="/menu" className="cart-back-link">
            <FaArrowLeft /> Continue Shopping
          </Link>
        </div>
      </nav>

      <main className="container cart-container">
        <div className="cart-heading">
          <span className="cart-eyebrow">YOUR ORDER, YOUR WAY</span>
          <h1>My Shopping Cart</h1>
          <p>
            {cartCount} {cartCount === 1 ? "item" : "items"} in your cart
          </p>
        </div>

        {cartItems.length === 0 ? (
          <div className="empty-cart">
            <div className="empty-cart-icon">
              <FaShoppingCart />
            </div>
            <h2>Your cart is feeling lonely!</h2>
            <p>
              You haven't added any pizzas yet. Explore our menu and find
              your favourite.
            </p>
            <Link to="/menu" className="cart-primary-button">
              <FaPizzaSlice /> Explore Menu
            </Link>
          </div>
        ) : (
          <div className="row g-4">
            <div className="col-lg-8">
              <div className="cart-items-panel">
                <div className="cart-panel-title">
                  <h2>Order Items</h2>
                  <span>{cartCount} items</span>
                </div>

                {cartItems.map((pizza) => (
                  <div className="cart-item" key={pizza.id}>
                    <img
                      src={pizza.image}
                      alt={pizza.name}
                      className="cart-item-image"
                    />

                    <div className="cart-item-details">
                      <h3>{pizza.name}</h3>
                      <span
                        className={`cart-food-type ${
                          pizza.category === "Veg" ? "veg" : "non-veg"
                        }`}
                      >
                        {pizza.category}
                      </span>
                      <p>{pizza.description}</p>
                      <strong className="cart-item-price">
                        ₹{pizza.price}
                      </strong>
                    </div>

                    <div className="cart-item-actions">
                      <div className="quantity-control">
                        <button
                          type="button"
                          onClick={() => decreaseQuantity(pizza.id)}
                          aria-label={`Decrease ${pizza.name} quantity`}
                        >
                          <FaMinus />
                        </button>

                        <span>{pizza.quantity}</span>

                        <button
                          type="button"
                          onClick={() => increaseQuantity(pizza.id)}
                          aria-label={`Increase ${pizza.name} quantity`}
                        >
                          <FaPlus />
                        </button>
                      </div>

                      <strong className="cart-line-total">
                        ₹{pizza.price * pizza.quantity}
                      </strong>

                      <button
                        className="remove-cart-item"
                        type="button"
                        onClick={() => removeFromCart(pizza.id)}
                      >
                        <FaTrash /> Remove
                      </button>
                    </div>
                  </div>
                ))}

                <Link to="/menu" className="cart-continue-link">
                  <FaArrowLeft /> Add more pizzas
                </Link>
              </div>
            </div>

            <div className="col-lg-4">
              <div className="cart-summary-panel">
                <h2>Order Summary</h2>

                <div className="summary-row">
                  <span>Items</span>
                  <span>{cartCount}</span>
                </div>

                <div className="summary-row">
                  <span>Subtotal</span>
                  <span>₹{cartTotal}</span>
                </div>

                <div className="summary-row">
                  <span>Delivery</span>
                  <span className="delivery-free">FREE</span>
                </div>

                <div className="summary-divider" />

                <div className="summary-row summary-total">
                  <span>Total</span>
                  <strong>₹{cartTotal}</strong>
                </div>

                <button
                  type="button"
                  className="checkout-button"
                  onClick={() =>
                    alert("Your cart is ready! Checkout will be connected next.")
                  }
                >
                  Proceed to Checkout
                </button>

                <p className="cart-secure-note">
                  Freshly prepared with love and care.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="cart-footer">
        <div className="container">
          <FaPizzaSlice />
          <p>PizzaMart — Happiness is just a slice away.</p>
        </div>
      </footer>
    </div>
  );
}
