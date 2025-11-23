import React from 'react';
import './HomePage.css'; // Make sure this CSS file exists

const FeatureCard = ({ icon, title, description }) => (
  <div className="feature-card">
    <div className="feature-icon">{icon}</div>
    <h3 className="feature-title">{title}</h3>
    <p className="feature-description">{description}</p>
  </div>
);

const StepItem = ({ icon, title, description }) => (
  <div className="step-item">
    <div className="step-icon-container">
      <div className="step-icon">{icon}</div>
      <div className="step-line"></div>
    </div>
    <div className="step-content">
      <h3 className="step-title">{title}</h3>
      <p className="step-description">{description}</p>
    </div>
  </div>
);

function HomePage({ onRegisterClick }) {
  return (
    <div className="homepage-container">
      {/* --- Hero Section --- */}
      <section className="hero-section" id="hero">
        <div className="hero-content">
          <h1 className="hero-title">
            The Smart Way to Manage Your <span>Dairy Business</span>
          </h1>
          <p className="hero-subtitle">
            From inventory and customers to daily sales, DairyFlow is the all-in-one software designed to modernize your local dairy shop.
          </p>
          <button onClick={onRegisterClick} className="hero-cta-button">
            Get Started for Free
          </button>
        </div>
      </section>

      {/* --- Features Section --- */}
      <section className="features-section" id="features">
        <h2 className="section-title">Why Dairy Owners Love DairyFlow</h2>
        <div className="features-grid">
          <FeatureCard 
            icon="📦" 
            title="Effortless Inventory" 
            description="Track every product, get low-stock alerts, and manage expiry dates to reduce waste." 
          />
          <FeatureCard 
            icon="👤" 
            title="Happy Customers" 
            description="Manage monthly tabs, record payments instantly, and keep all your customer information organized." 
          />
          <FeatureCard 
            icon="📈" 
            title="Boost Your Sales" 
            description="A powerful point-of-sale system and detailed reports help you understand your business and grow." 
          />
        </div>
      </section>
      
      {/* --- "How It Works" Section --- */}
      <section className="how-it-works-section">
        <h2 className="section-title">Get Up and Running in Minutes</h2>
        <div className="how-it-works-grid">
          <div className="steps-container">
            <StepItem 
              icon="📝" 
              title="Register Your Shop" 
              description="Create your free account in less than two minutes. No credit card required." 
            />
            <StepItem 
              icon="🥛" 
              title="Add Your Products" 
              description="Quickly add your products like milk, curd, and ghee with their prices and stock levels." 
            />
            <StepItem 
              icon="✅" 
              title="Start Selling" 
              description="Use our simple point-of-sale to record daily sales for both cash and tab customers." 
            />
          </div>
          <div className="how-it-works-image-container">
            <img 
              src="/images/Capture.PNG" 
              alt="DairyFlow App Screenshot" 
              className="how-it-works-image"
            />
          </div>
        </div>
      </section>

     {/* --- Call to Action Section --- */}
      <section className="cta-section">
          <h2 className="cta-title">Ready to Modernize Your Dairy?</h2>
          <p className="cta-subtitle">Join hundreds of dairy owners who are saving time and increasing profits with DairyFlow.</p>
          <button onClick={onRegisterClick} className="hero-cta-button">
            Register Now
          </button>
      </section>

      {/* --- About Us Section --- */}
      <section className="about-section" id="about">
        <div className="about-grid">
            <div className="about-image-container">
                <img 
                src="https://images.unsplash.com/photo-1556740738-b6a63e27c4df?auto=format&fit=crop&w=1770&q=80" 
                alt="About DairyFlow" 
                className="about-image"
                />
            </div>
            <div className="about-content">
                <h2 className="section-title">Our Story</h2>
                <p className="about-description">
                DairyFlow was born from a simple idea: to empower local dairy businesses with the technology they need to thrive in a modern world. We saw hardworking dairy owners struggling with outdated paper records and complex management tasks. Our mission is to provide an easy-to-use, affordable, and powerful tool that simplifies daily operations, reduces waste, and helps you connect better with your customers.
                </p>
            </div>
        </div>
      </section>

      {/* --- Contact Us Section --- */}
      <section className="contact-section" id="contact">
        <h2 className="section-title">Get in Touch</h2>
        <div className="contact-grid">
            <div className="contact-info">
                <h3>Contact Information</h3>
                <p>Have questions or need support? We're here to help!</p>
                <p><strong>Email:</strong> support@dairyflow.com</p>
                <p><strong>Phone:</strong> +91 12345 67890</p>
            </div>
            <div className="contact-form-container">
                <h3>Send us a Message</h3>
                <form className="contact-form">
                    <input type="text" placeholder="Your Name" required />
                    <input type="email" placeholder="Your Email" required />
                    <textarea placeholder="Your Message" rows="5" required></textarea>
                    <button type="submit" className="hero-cta-button">Send Message</button>
                </form>
            </div>
        </div>
      </section>

    </div>
  );
}

export default HomePage;
