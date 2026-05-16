import { Link } from "react-router-dom";
import Logo from "./Logo/Logo";
import "../styles/Footer.css";

const Footer = () => {
    const Icons = {
        Linkedin: () => (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
        ),
        Instagram: () => (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
        ),
        Youtube: () => (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.42a2.78 2.78 0 0 0-1.94 2C1 8.14 1 12 1 12s0 3.86.42 5.58a2.78 2.78 0 0 0 1.94 2c1.71.42 8.6.42 8.6.42s6.88 0 8.6-.42a2.78 2.78 0 0 0 1.94-2C23 15.86 23 12 23 12s0-3.86-.42-5.58z"></path><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"></polygon></svg>
        ),
        Twitter: () => (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
        )
    };

    return (
        <footer className="premium-footer">
            <div className="footer-max-width">
                <div className="footer-main-grid">
                    <div className="footer-brand-col">
                        <Logo size="medium" />
                        <p className="brand-pitch">
                            The world's first AI-powered learning platform featuring courses taught by AI-synthesized celebrities and tech visionaries.
                        </p>
                        <div className="social-links-footer">
                            <a href="https://linkedin.com/company/uptoskills" target="_blank" rel="noreferrer" className="social-icon-btn"><Icons.Linkedin /></a>
                            <a href="https://instagram.com/uptoskills" target="_blank" rel="noreferrer" className="social-icon-btn"><Icons.Instagram /></a>
                            <a href="https://youtube.com/@uptoskills9101" target="_blank" rel="noreferrer" className="social-icon-btn"><Icons.Youtube /></a>
                            <a href="https://twitter.com/uptoskills" target="_blank" rel="noreferrer" className="social-icon-btn"><Icons.Twitter /></a>
                        </div>
                    </div>

                    <div className="footer-links-col">
                        <h4>Platform</h4>
                        <Link to="/courses">Browse Courses</Link>
                        <Link to="/dashboard">My Learning</Link>
                        <Link to="/about">How it Works</Link>
                        <Link to="/courses">Career Paths</Link>
                    </div>

                    <div className="footer-links-col">
                        <h4>Support</h4>
                        <Link to="/contact">Help Center</Link>
                        <Link to="/terms">Terms of Service</Link>
                        <Link to="/privacy">Privacy Policy</Link>
                        <Link to="/dashboard">Refer a Friend</Link>
                    </div>

                    <div className="footer-newsletter-col">
                        <h4>Stay Updated</h4>
                        <p>Get the latest course releases directly in your inbox.</p>
                        <form className="footer-news-form">
                            <input type="email" placeholder="Email Address" required />
                            <button type="submit">Join</button>
                        </form>
                    </div>
                </div>

                <div className="footer-bottom-bar">
                    <p>© 2026 UptoSkills AI Learn. All rights reserved.</p>
                    <div className="footer-legal-links">
                        <a href="#">Privacy</a>
                        <a href="#">Terms</a>
                        <a href="#">Cookies</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;