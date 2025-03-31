import React, { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUser, 
  faSignInAlt, 
  faDumbbell, 
  faChartLine, 
  faFileMedical, 
  faHandsHelping, 
  faStar, 
  faEnvelope,
  faPlayCircle,
  faBars
} from '@fortawesome/free-solid-svg-icons';
import { 
  faFacebook, 
  faLinkedin, 
  faTwitter 
} from '@fortawesome/free-brands-svg-icons';
import "./Landingpage.css";

const Landingpage = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  return (
    <div className="homepage-container">
      {/* Login Modal */}
      {showLogin && (
        <div className="modal-overlay">
          <div className="auth-modal">
            <h3>Professional Login <FontAwesomeIcon icon={faUser} /></h3>
            <form>
              <input type="email" placeholder="Email" />
              <input type="password" placeholder="Password" />
              <button className="auth-btn">Login</button>
            </form>
            <button className="close-modal" onClick={() => setShowLogin(false)}>×</button>
          </div>
        </div>
      )}

      {/* Signup Modal */}
      {showSignup && (
        <div className="modal-overlay">
          <div className="auth-modal">
            <h3>Join Now <FontAwesomeIcon icon={faStar} /></h3>
            <form>
              <input type="text" placeholder="Full Name" />
              <input type="email" placeholder="Email" />
              <input type="password" placeholder="Create Password" />
              <button className="auth-btn">Sign Up Free</button>
            </form>
            <button className="close-modal" onClick={() => setShowSignup(false)}>×</button>
          </div>
        </div>
      )}

      <header className="header">
        <div className="logo">
          <FontAwesomeIcon icon={faDumbbell} className="logo-icon" />
          <span>HEP Pro</span>
        </div>
        
      
<div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
  <FontAwesomeIcon icon={faBars} /> 
</div>

        <nav className={menuOpen ? "nav-links open" : "nav-links"}>
          <a href="#features"><FontAwesomeIcon icon={faChartLine} /> Features</a>
          <a href="#testimonials"><FontAwesomeIcon icon={faStar} /> Reviews</a>
          <a href="#contact"><FontAwesomeIcon icon={faEnvelope} /> Contact</a>
          <button className="nav-btn" onClick={() => setShowLogin(true)}>
            <FontAwesomeIcon icon={faSignInAlt} /> Login
          </button>
          <button className="nav-btn primary" onClick={() => setShowSignup(true)}>
            <FontAwesomeIcon icon={faUser} /> Sign Up Free
          </button>
        </nav>
      </header>

      <section className="hero">
        <div className="hero-content">
          <h1>Precision Exercise Programs for Orthopedic Rehabilitation</h1>
          <p className="hero-subtext">Trusted by 5,000+ rehabilitation professionals worldwide</p>
          <div className="cta-container">
            <button className="cta-btn" onClick={() => setShowSignup(true)}>
              Start Free Trial <FontAwesomeIcon icon={faStar} />
            </button>
            <button className="cta-btn outline">
              Watch Demo <FontAwesomeIcon icon={faPlayCircle} />
            </button>
          </div>
        </div>
      </section>

      <section className="features" id="features">
        <h2 className="section-title">Why Choose HEP Pro?</h2>
        <div className="feature-grid">
          <div className="feature-card">
            <FontAwesomeIcon icon={faFileMedical} className="feature-icon" />
            <h3>Custom Plan Builder</h3>
            <p>Create personalized exercise regimens with our intelligent template system</p>
          </div>
          <div className="feature-card">
            <FontAwesomeIcon icon={faHandsHelping} className="feature-icon" />
            <h3>Patient Progress Tracking</h3>
            <p>Real-time compliance monitoring and recovery analytics</p>
          </div>
          <div className="feature-card">
            <FontAwesomeIcon icon={faDumbbell} className="feature-icon" />
            <h3>Orthopedic Exercise Library</h3>
            <p>500+ evidence-based exercises with video demonstrations</p>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h4>HEP Pro</h4>
            <p>Orthopedic Excellence in Rehabilitation</p>
          </div>
          <div className="footer-section">
            <h4>Quick Links</h4>
            <a href="#features">Features</a>
            <a href="#pricing">Pricing</a>
            <a href="#contact">Support</a>
          </div>
          <div className="footer-section">
            <h4>Connect</h4>
            <div className="social-icons">
              <FontAwesomeIcon icon={faFacebook} />
              <FontAwesomeIcon icon={faLinkedin} />
              <FontAwesomeIcon icon={faTwitter} />
            </div>
          </div>
        </div>
        <div className="copyright">
          © 2024 HEP Pro. All rights reserved. For medical professionals only.
        </div>
      </footer>
    </div>
  );
};

export default Landingpage;