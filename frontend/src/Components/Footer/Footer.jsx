import React from 'react';
// Assuming your CSS is in a file like 'Footer.css' or similar
import './Footer.css'; 

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-container">
                {/* Column 1: Logo and Short Description */}
                <div className="footer-col footer-info">
                    <div className="footer-logo">
                        <span className="logo-text">Skill Connect</span>
                    </div>
                    <p>Your trusted partner for home services. Quality professionals, guaranteed service.</p>
                    <div className="app-downloads">
                        {/* Placeholder for App Store and Google Play Badges/Links */}
                        <a href="#" aria-label="Download on App Store">
                            <span className="app-badge">App Store</span>
                        </a>
                        <a href="#" aria-label="Get it on Google Play">
                            <span className="app-badge">Google Play</span>
                        </a>
                    </div>
                </div>

                {/* Column 2: Quick Links */}
                <div className="footer-col footer-links">
                    <h4>Quick Links</h4>
                    <ul>
                        <li><a href="/about">About Us</a></li>
                        <li><a href="/services">Services</a></li>
                        <li><a href="/professionals">Our Professionals</a></li>
                        <li><a href="/faq">FAQ</a></li>
                        <li><a href="/contact">Contact</a></li>
                    </ul>
                </div>

                {/* Column 3: Service Categories */}
                <div className="footer-col footer-services">
                    <h4>Popular Services</h4>
                    <ul>
                        <li><a href="/service/ac-repair">AC Service & Repair</a></li>
                        <li><a href="/service/plumbing">Plumbing</a></li>
                        <li><a href="/service/cleaning">Deep Cleaning</a></li>
                        <li><a href="/service/salon">Salon at Home</a></li>
                    </ul>
                </div>

                {/* Column 4: Contact & Social */}
                <div className="footer-col footer-contact">
                    <h4>Get In Touch</h4>
                    <p>
                        Email: <a href="mailto:support@homeprotrust.com">support@skillconnect.com</a>
                    </p>
                    <p>
                        Phone: <a href="tel:+18001234567">+1 (800) 123-4567</a>
                    </p>
                    <div className="social-links">
                        {/* Replace [F], [T], [I] with actual icon components (e.g., FontAwesome) */}
                        <a href="#" aria-label="Facebook"><span className="social-icon">[F]</span></a>
                        <a href="#" aria-label="Twitter"><span className="social-icon">[T]</span></a>
                        <a href="#" aria-label="Instagram"><span className="social-icon">[I]</span></a>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="footer-bottom">
                <p>&copy; 2025 Skill Connect. All Rights Reserved.</p>
                <div className="legal-links">
                    <a href="/privacy">Privacy Policy</a>
                    <span>|</span>
                    <a href="/terms">Terms of Service</a>
                </div>
            </div>
        </footer>
    );
}

export default Footer;