
import { Link } from "react-router-dom";
import {
  FaPizzaSlice,
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaClock
} from "react-icons/fa";
import "./Footer.css";

function Footer() {
  return (
    <footer className="pizzamart-footer">
      <div className="container">
        <div className="row gy-4">

          {/* Brand */}
          <div className="col-lg-3 col-md-6">
            <h3 className="footer-logo">
              <FaPizzaSlice /> Pizza<span>Mart</span>
            </h3>

            <p className="footer-description">
              Freshly baked pizzas, delicious flavours and
              happiness in every bite. Order your favourite
              pizza and enjoy it at home!
            </p>

            <div className="footer-social">
              <a href="https://facebook.com" target="_blank" rel="noreferrer">
                <FaFacebookF />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer">
                <FaInstagram />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer">
                <FaTwitter />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-lg-3 col-md-6">
            <h5>Quick Links</h5>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/menu">Our Menu</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
              <li><Link to="/cart">My Cart</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="col-lg-3 col-md-6">
            <h5>Contact Us</h5>

            <p>
              <FaMapMarkerAlt />
              <span> Your Restaurant Address</span>
            </p>

            <p>
              <FaPhone />
              <span> Your Phone Number</span>
            </p>

            <p>
              <FaEnvelope />
              <span> your-email@example.com</span>
            </p>
          </div>

          {/* Opening Hours */}
          <div className="col-lg-3 col-md-6">
            <h5>Opening Hours</h5>

            <p>
              <FaClock /> Monday - Friday
              <br />
              <span className="footer-time">10:00 AM - 10:00 PM</span>
            </p>

            <p>
              <FaClock /> Saturday - Sunday
              <br />
              <span className="footer-time">11:00 AM - 11:00 PM</span>
            </p>
          </div>

        </div>

        <hr className="footer-divider" />

        <div className="footer-bottom">
          <p>
            © {new Date().getFullYear()} PizzaMart.
            All Rights Reserved.
          </p>
          <p>Made with ❤️ for Pizza Lovers</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
