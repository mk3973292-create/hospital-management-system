import React from "react";
import { Link } from "react-router-dom";
import "./Hero.css";
import EmergencyAmbulanceButton from "./EmergencyAmbulanceButton";

const Hero = ({ title }) => {
  return (
    <section className="hero-section">
      <div className="hero-banner">
        <div className="hero-overlay"></div>
        <div className="container hero-content animate-slide-up">
          <h1 className="hero-title">{title}</h1>
          <p className="hero-subtitle">
            Leading the way in medical excellence, providing compassionate care with state-of-the-art technology.
          </p>
        </div>
      </div>

      <div className="quick-actions-container container">
        <div className="quick-actions-widget animate-slide-up" style={{ animationDelay: "0.3s" }}>
          <Link to="/doctors" className="action-box" style={{ textDecoration: 'none', display: 'block' }}>
            <h3>Find a Doctor</h3>
            <p>Book an appointment with our expert doctors</p>
            <span className="action-link">Book Now &rarr;</span>
          </Link>
          <Link to="/packages" className="action-box" style={{ textDecoration: 'none', display: 'block' }}>
            <h3>Book Health Check</h3>
            <p>Comprehensive health packages for you</p>
            <span className="action-link">Explore &rarr;</span>
          </Link>
          <Link to="/pharmacy" className="action-box" style={{ textDecoration: 'none', display: 'block' }}>
            <h3>Order Medicine</h3>
            <p>Get medicines delivered to your doorstep</p>
            <span className="action-link">Order Now &rarr;</span>
          </Link>
          <EmergencyAmbulanceButton className="action-box highlight-box emergency-action-box" variant="card">
            <h3>Emergency?</h3>
            <p>24/7 Ambulance and Trauma Care</p>
            <span className="action-btn animate-pulse-soft">Send Ambulance Van</span>
          </EmergencyAmbulanceButton>
        </div>
      </div>
    </section>
  );
};

export default Hero;
