import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Minimal working app - bypasses all problematic components
const MinimalApp: React.FC = () => {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a1a2e 0%, #0f0f23 100%)',
      color: 'white',
      padding: '40px',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <Router>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <header style={{ marginBottom: '40px', textAlign: 'center' }}>
            <h1 style={{
              fontSize: '3rem',
              fontWeight: 'bold',
              background: 'linear-gradient(to right, #7c3aed, #3b82f6)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: '10px'
            }}>
              EA-S Solutions
            </h1>
            <p style={{ fontSize: '1.2rem', color: '#9ca3af' }}>
              Emergency Mode - Site is recovering
            </p>
          </header>

          <Routes>
            <Route path="/" element={
              <div>
                <section style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '10px',
                  padding: '30px',
                  marginBottom: '20px',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                  <h2 style={{ fontSize: '2rem', marginBottom: '20px' }}>
                    Welcome to EA Solutions
                  </h2>
                  <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: '#d1d5db' }}>
                    We're experiencing temporary technical issues. Our AI-powered solutions for Smart Living
                    and Gastronomy will be back shortly.
                  </p>

                  <div style={{ marginTop: '30px', display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                    <a href="/services" style={{
                      padding: '12px 24px',
                      background: 'linear-gradient(to right, #7c3aed, #3b82f6)',
                      color: 'white',
                      textDecoration: 'none',
                      borderRadius: '5px',
                      fontWeight: 'bold'
                    }}>
                      View Services
                    </a>
                    <a href="/contact" style={{
                      padding: '12px 24px',
                      background: 'transparent',
                      color: 'white',
                      textDecoration: 'none',
                      borderRadius: '5px',
                      border: '2px solid #7c3aed',
                      fontWeight: 'bold'
                    }}>
                      Contact Us
                    </a>
                  </div>
                </section>

                <section style={{
                  background: 'rgba(124, 58, 237, 0.1)',
                  borderRadius: '10px',
                  padding: '30px',
                  border: '1px solid rgba(124, 58, 237, 0.3)'
                }}>
                  <h3 style={{ fontSize: '1.5rem', marginBottom: '15px' }}>
                    System Status
                  </h3>
                  <ul style={{ listStyle: 'none', padding: 0 }}>
                    <li style={{ marginBottom: '10px' }}>
                      ✅ Core services: <span style={{ color: '#10b981' }}>Online</span>
                    </li>
                    <li style={{ marginBottom: '10px' }}>
                      ⚠️ Booking system: <span style={{ color: '#f59e0b' }}>Maintenance</span>
                    </li>
                    <li style={{ marginBottom: '10px' }}>
                      ✅ Contact form: <span style={{ color: '#10b981' }}>Available</span>
                    </li>
                  </ul>
                </section>
              </div>
            } />

            <Route path="/services" element={
              <div style={{
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '10px',
                padding: '30px',
                backdropFilter: 'blur(10px)'
              }}>
                <h2 style={{ fontSize: '2rem', marginBottom: '20px' }}>Our Services</h2>
                <ul style={{ fontSize: '1.1rem', lineHeight: '2' }}>
                  <li>🤖 AI-Powered Automation</li>
                  <li>🏠 Smart Living Solutions</li>
                  <li>🍴 Gastronomy Management</li>
                  <li>📅 Intelligent Booking Systems</li>
                  <li>📊 Business Analytics</li>
                </ul>
              </div>
            } />

            <Route path="/contact" element={
              <div style={{
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '10px',
                padding: '30px',
                backdropFilter: 'blur(10px)'
              }}>
                <h2 style={{ fontSize: '2rem', marginBottom: '20px' }}>Contact EA-S</h2>
                <p style={{ fontSize: '1.1rem', marginBottom: '20px' }}>
                  We're here to help. Reach out to us:
                </p>
                <ul style={{ fontSize: '1.1rem', lineHeight: '2' }}>
                  <li>📧 Email: info@ea-s.info</li>
                  <li>📱 Phone: +49 XXX XXXXXXX</li>
                  <li>📍 Location: Wiesbaden, Germany</li>
                </ul>
              </div>
            } />

            <Route path="*" element={
              <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                <h2 style={{ fontSize: '2rem', marginBottom: '20px' }}>Page Not Found</h2>
                <p style={{ marginBottom: '20px' }}>The page you're looking for doesn't exist.</p>
                <a href="/" style={{
                  color: '#7c3aed',
                  textDecoration: 'underline'
                }}>
                  Return to Home
                </a>
              </div>
            } />
          </Routes>
        </div>
      </Router>
    </div>
  );
};

export default MinimalApp;