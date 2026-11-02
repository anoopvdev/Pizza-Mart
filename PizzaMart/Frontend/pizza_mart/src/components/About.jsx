
import { Link } from "react-router-dom";
import { useState } from "react";
import "./About.css";
import Navbar from "./Navbar";


const About = () => {

  return (
    
    <div className="about-page">
      {/* Navbar */}
      <Navbar />
      {/* Hero Section */}
      <section className="about-hero">
        <div className="container">
          <div className="row align-items-center g-5">
            <div className="col-lg-6">
              <span className="about-label">
                <i className="bi bi-heart-fill me-2"></i>
                MADE WITH LOVE
              </span>

              <h1>
                More Than Pizza,
                <span> It's Happiness.</span>
              </h1>

              <p className="about-hero-text">
                At PizzaMart, every slice tells a story.
                We bring people together with delicious pizzas,
                fresh ingredients, and flavours you'll love.
              </p>

              <div className="d-flex flex-wrap gap-3 mt-4">
                <Link to="/menu" className="btn about-primary-btn">
                  Explore Our Menu
                  <i className="bi bi-arrow-up-right ms-2"></i>
                </Link>

                <a href="#our-story" className="btn about-outline-btn">
                  Our Story
                </a>
              </div>

              <div className="about-rating mt-4">
                <div className="about-stars">★★★★★</div>
                <span>Every pizza made with care and passion</span>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="about-hero-image">
                <img
                  src="https://images.unsplash.com/photo-1579751626657-72bc17010498?auto=format&fit=crop&w=1000&q=85"
                  alt="Delicious freshly prepared pizza"
                />
                <div className="about-image-badge">
                  <i className="bi bi-fire"></i>
                  <div>
                    <strong>Fresh & Tasty</strong>
                    <small>Made for pizza lovers</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Highlights */}
      <section className="about-highlights">
        <div className="container">
          <div className="row g-3 text-center">
            <div className="col-6 col-lg-3">
              <div className="highlight-item">
                <i className="bi bi-egg-fried"></i>
                <h5>Fresh Ingredients</h5>
                <p>Quality in every bite</p>
              </div>
            </div>

            <div className="col-6 col-lg-3">
              <div className="highlight-item">
                <i className="bi bi-fire"></i>
                <h5>Oven Fresh</h5>
                <p>Warm and delicious</p>
              </div>
            </div>

            <div className="col-6 col-lg-3">
              <div className="highlight-item">
                <i className="bi bi-heart"></i>
                <h5>Made with Love</h5>
                <p>Passion in every slice</p>
              </div>
            </div>

            <div className="col-6 col-lg-3">
              <div className="highlight-item">
                <i className="bi bi-truck"></i>
                <h5>Easy Ordering</h5>
                <p>Your favourites, your way</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="about-story" id="our-story">
        <div className="container">
          <div className="row align-items-center g-5">
            <div className="col-lg-6">
              <div className="about-story-image">
                <img
                  src="https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1000&q=85"
                  alt="Pizza topped with fresh ingredients"
                />
                <div className="story-stamp">
                  <span>GOOD FOOD</span>
                  <strong>GOOD MOOD!</strong>
                </div>
              </div>
            </div>

            <div className="col-lg-6">
              <span className="about-label">OUR STORY</span>

              <h2 className="about-section-title">
                Bringing People Together,
                <span> One Slice at a Time.</span>
              </h2>

              <p>
                PizzaMart is built around one simple idea:
                good pizza makes every moment better. Whether
                you're sharing dinner with family, celebrating
                with friends, or enjoying a quiet evening,
                there's always a place for pizza.
              </p>

              <p>
                We focus on flavour, quality, and a simple
                ordering experience. From classic favourites
                to exciting combinations, we want every order
                to feel special.
              </p>

              <Link to="/menu" className="about-text-link">
                Discover our pizzas
                <i className="bi bi-arrow-right ms-2"></i>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="about-why">
        <div className="container">
          <div className="text-center mb-5">
            <span className="about-label">WHY PIZZAMART?</span>
            <h2 className="about-section-title">
              A Little Extra in <span>Every Slice.</span>
            </h2>
            <p className="about-section-subtitle">
              Great taste, easy ordering, and a pizza experience
              made for you.
            </p>
          </div>

          <div className="row g-4">
            <div className="col-md-4">
              <div className="about-feature-card">
                <div className="feature-icon">
                  <i className="bi bi-stars"></i>
                </div>
                <h4>Quality First</h4>
                <p>
                  We put care into the ingredients and flavours
                  that make your favourite pizza memorable.
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="about-feature-card">
                <div className="feature-icon">
                  <i className="bi bi-lightning-charge"></i>
                </div>
                <h4>Simple Ordering</h4>
                <p>
                  Browse the menu, choose your favourites,
                  and place your order through a convenient
                  online experience.
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="about-feature-card">
                <div className="feature-icon">
                  <i className="bi bi-emoji-smile"></i>
                </div>
                <h4>Made for You</h4>
                <p>
                  From a quick snack to a family feast,
                  find a pizza for the moments you love.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="about-cta">
        <div className="container text-center">
          <span className="about-cta-icon">🍕</span>
          <h2>Ready for Your Next Favourite Slice?</h2>
          <p>
            Explore our menu and find something delicious today.
          </p>
          <Link to="/menu" className="btn about-primary-btn">
            Order Your Pizza
            <i className="bi bi-arrow-right ms-2"></i>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="about-footer">
        <div className="container">
          <div className="row align-items-center g-3">
            <div className="col-md-6">
              <Link to="/home" className="footer-brand">
                🍕 PizzaMart
              </Link>
              <p className="mb-0">
                Good pizza. Great moments.
              </p>
            </div>

            <div className="col-md-6 text-md-end">
              <Link to="/home">Home</Link>
              <Link to="/menu">Menu</Link>
              <Link to="/contact">Contact</Link>
            </div>
          </div>

          <hr />

          <p className="footer-copy mb-0 text-center">
            © {new Date().getFullYear()} PizzaMart. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default About;