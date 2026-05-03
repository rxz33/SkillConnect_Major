import React, { useContext } from 'react';
import './Membership.css';
import { FaCheckCircle, FaRocket, FaCrown, FaShieldAlt } from 'react-icons/fa';
import { AuthContext } from '../Context/AuthContext';
import { BASE_URL } from '../config';

const Membership = () => {
    const { currentUser } = useContext(AuthContext);

    const handleSubscription = async () => {
        if (!currentUser) {
            alert("Please login to purchase a membership.");
            window.location.hash = "/login";
            return;
        }

        try {
            const response = await fetch(`${BASE_URL}/create-checkout-session`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: currentUser.uid,
                    profileId: 'membership_pro',
                    name: 'SkillConnect Pro Membership',
                    price: 5,
                })
            });

            const session = await response.json();
            if (session.url) {
                window.location.href = session.url;
            }
        } catch (error) {
            console.error("Payment failed", error);
            alert("Something went wrong with the payment. Please try again.");
        }
    };

    return (
        <div className="membership-container">
            <div className="membership-header">
                <h1>Elevate Your Experience</h1>
                <p>Choose the plan that fits your professional growth</p>
            </div>

            <div className="membership-cards">
                {/* Free Tier */}
                <div className="membership-card">
                    <div className="card-header">
                        <h3>Basic</h3>
                        <div className="price">Free</div>
                    </div>
                    <ul className="benefits-list">
                        <li><FaCheckCircle className="check-icon" /> Standard Profile</li>
                        <li><FaCheckCircle className="check-icon" /> Basic Search visibility</li>
                        <li><FaCheckCircle className="check-icon" /> Limited Chats</li>
                        <li className="disabled">Priority Support</li>
                        <li className="disabled">Verified Badge</li>
                    </ul>
                    <button className="membership-btn secondary" disabled>Current Plan</button>
                </div>

                {/* Pro Tier */}
                <div className="membership-card pro">
                    <div className="pro-badge">RECOMMENDED</div>
                    <div className="card-header">
                        <FaCrown className="crown-icon" />
                        <h3>SkillConnect Pro</h3>
                        <div className="price">$5<span>/month</span></div>
                    </div>
                    <ul className="benefits-list">
                        <li><FaRocket className="benefit-icon" /> <strong>Priority Search</strong> Listing</li>
                        <li><FaShieldAlt className="benefit-icon" /> <strong>Verified Pro</strong> Badge</li>
                        <li><FaCheckCircle className="check-icon" /> Unlimited Customer Chats</li>
                        <li><FaCheckCircle className="check-icon" /> Analytics Dashboard</li>
                        <li><FaCheckCircle className="check-icon" /> 24/7 Priority Support</li>
                    </ul>
                    <button className="membership-btn primary" onClick={handleSubscription}>Upgrade to Pro</button>
                </div>
            </div>

            <div className="membership-footer">
                <p>Secure payments handled by Stripe. Cancel anytime.</p>
            </div>
        </div>
    );
};

export default Membership;
