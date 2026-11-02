import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./Contact.css";
import Navbar from "./Navbar";
const API = "http://127.0.0.1:8000/api/user/contact/";

const initialForm = {
  name: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
};

function Contact() {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setSuccess("");
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setSuccess("");
    setError("");

    try {
      const response = await axios.post(API, form);

      setSuccess(
        response.data.message ||
          "Your message has been sent successfully!"
      );

      setForm(initialForm);
    } catch (err) {
      const data = err.response?.data;

      if (data && typeof data === "object") {
        const firstError = Object.values(data).flat()[0];

        setError(
          typeof firstError === "string"
            ? firstError
            : "Unable to send your message. Please try again."
        );
      } else {
        setError(
          "Unable to send your message. Please check your connection and try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-page">
      {/* Navbar */}
      {/* <nav className="navbar navbar-expand-lg contact-navbar">
        <div className="container">
          <Link className="navbar-brand contact-brand" to="/home">
            🍕 Pizza<span>Mart</span>
          </Link>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#contactNavbar"
            aria-controls="contactNavbar"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div
            className="collapse navbar-collapse"
            id="contactNavbar"
          >
            <div className="navbar-nav ms-auto align-items-lg-center gap-lg-3">
              <Link className="nav-link" to="/home">Home</Link>
              <Link className="nav-link" to="/menu">Menu</Link>
              <Link className="nav-link" to="/about">About</Link>
              <Link className="nav-link active" to="/contact">
                Contact
              </Link>
              <Link className="btn contact-order-btn" to="/menu">
                Order Now
              </Link>
            </div>
          </div>
        </div>
      </nav> */}
      <Navbar />

      {/* Hero */}
      <section className="contact-hero">
        <div className="container text-center">
          <span className="contact-eyebrow">
            WE ARE HERE FOR YOU
          </span>

          <h1>
            Let's Talk <span>Pizza!</span>
          </h1>

          <p>
            Questions, feedback, or an issue with your order?
            Send us a message and our team will get back to you.
          </p>
        </div>
      </section>

      {/* Contact content */}
      <section className="contact-main">
        <div className="container">
          <div className="row g-4">
            {/* Contact information */}
            <div className="col-lg-5">
              <div className="contact-info-card">
                <span className="contact-eyebrow">
                  CONTACT INFORMATION
                </span>

                <h2>We'd love to hear from you.</h2>

                <p className="contact-info-intro">
                  Have a question about our pizzas or need help
                  with an order? Get in touch with us.
                </p>

                <div className="contact-info-item">
                  <div className="contact-icon">
                    <i className="bi bi-envelope-fill"></i>
                  </div>
                  <div>
                    <h6>Email Us</h6>
                    <a href="mailto:support@pizzamart.com">
                      support@pizzamart.com
                    </a>
                  </div>
                </div>

                <div className="contact-info-item">
                  <div className="contact-icon">
                    <i className="bi bi-telephone-fill"></i>
                  </div>
                  <div>
                    <h6>Call Us</h6>
                    <a href="tel:+919876543210">
                      +91 98765 43210
                    </a>
                  </div>
                </div>

                <div className="contact-info-item">
                  <div className="contact-icon">
                    <i className="bi bi-clock-fill"></i>
                  </div>
                  <div>
                    <h6>Opening Hours</h6>
                    <p>Every day: 10:00 AM – 11:00 PM</p>
                  </div>
                </div>

                <div className="contact-info-item">
                  <div className="contact-icon">
                    <i className="bi bi-geo-alt-fill"></i>
                  </div>
                  <div>
                    <h6>Our Location</h6>
                    <p>PizzaMart, Kerala, India</p>
                  </div>
                </div>

                <div className="contact-social">
                  <span>Let's connect</span>
                  <div className="d-flex gap-3 mt-3">
                    <a href="mailto:support@pizzamart.com"
                      aria-label="Email us">
                      <i className="bi bi-envelope"></i>
                    </a>
                    <a href="tel:+919876543210"
                      aria-label="Call us">
                      <i className="bi bi-telephone"></i>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact form */}
            <div className="col-lg-7">
              <div className="contact-form-card">
                <h2>Send Us a Message</h2>
                <p className="contact-form-subtitle">
                  Fill out the form below. Fields marked * are required.
                </p>

                {success && (
                  <div className="alert alert-success" role="status">
                    <i className="bi bi-check-circle-fill me-2"></i>
                    {success}
                  </div>
                )}

                {error && (
                  <div className="alert alert-danger" role="alert">
                    <i className="bi bi-exclamation-circle-fill me-2"></i>
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label htmlFor="contact-name" className="form-label">
                        Full Name *
                      </label>
                      <input
                        id="contact-name"
                        type="text"
                        name="name"
                        className="form-control contact-input"
                        placeholder="Enter your name"
                        value={form.name}
                        onChange={handleChange}
                        maxLength={100}
                        autoComplete="name"
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label htmlFor="contact-email" className="form-label">
                        Email Address *
                      </label>
                      <input
                        id="contact-email"
                        type="email"
                        name="email"
                        className="form-control contact-input"
                        placeholder="you@example.com"
                        value={form.email}
                        onChange={handleChange}
                        maxLength={254}
                        autoComplete="email"
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label htmlFor="contact-phone" className="form-label">
                        Phone Number
                      </label>
                      <input
                        id="contact-phone"
                        type="tel"
                        name="phone"
                        className="form-control contact-input"
                        placeholder="Your phone number"
                        value={form.phone}
                        onChange={handleChange}
                        maxLength={20}
                        autoComplete="tel"
                      />
                    </div>

                    <div className="col-md-6">
                      <label htmlFor="contact-subject" className="form-label">
                        Subject *
                      </label>
                      <select
                        id="contact-subject"
                        name="subject"
                        className="form-select contact-input"
                        value={form.subject}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select a subject</option>
                        <option value="Order enquiry">Order enquiry</option>
                        <option value="Delivery issue">Delivery issue</option>
                        <option value="Payment issue">Payment issue</option>
                        <option value="Feedback">Feedback</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div className="col-12">
                      <label htmlFor="contact-message" className="form-label">
                        Your Message *
                      </label>
                      <textarea
                        id="contact-message"
                        name="message"
                        className="form-control contact-input"
                        rows="5"
                        placeholder="How can we help you?"
                        value={form.message}
                        onChange={handleChange}
                        minLength={10}
                        maxLength={5000}
                        required
                      ></textarea>
                      <small className="text-muted">
                        {form.message.length}/5000 characters
                      </small>
                    </div>

                    <div className="col-12 mt-4">
                      <button
                        type="submit"
                        className="btn contact-submit-btn"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <span
                              className="spinner-border spinner-border-sm me-2"
                              aria-hidden="true"
                            ></span>
                            Sending Message...
                          </>
                        ) : (
                          <>
                            Send Message
                            <i className="bi bi-send-fill ms-2"></i>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </form>

                <div className="contact-privacy-note">
                  <i className="bi bi-shield-check me-2"></i>
                  Your details are used to respond to your enquiry.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="contact-bottom">
        <div className="container text-center">
          <span>🍕</span>
          <h2>Good food starts with good conversations.</h2>
          <p>Thanks for being part of PizzaMart!</p>
          <Link to="/menu" className="btn contact-order-btn">
            Explore Our Menu
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="contact-footer">
        <div className="container d-flex flex-column flex-md-row
                        justify-content-between align-items-center gap-3">
          <Link className="footer-contact-brand" to="/home">
            🍕 PizzaMart
          </Link>
          <p className="mb-0">
            © {new Date().getFullYear()} PizzaMart. All rights reserved.
          </p>
          <Link to="/about">About Us</Link>
        </div>
      </footer>
    </div>
  );
}

export default Contact;