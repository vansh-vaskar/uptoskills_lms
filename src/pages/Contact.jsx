import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import '../styles/Contact.css';

const Contact = () => {
    const [formData, setFormData] = useState({ name: "", email: "", message: "" });
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 5000);
    };

    return (
        <motion.div 
            className="contact-container"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="contact-header">
                <h1>Get in <span className="text-gradient">Touch</span></h1>
                <p>Have questions? We're here to help you on your learning journey.</p>
            </div>

            <div className="contact-content">
                <div className="contact-info">
                    <motion.div 
                        className="info-card"
                        whileHover={{ x: 10 }}
                    >
                        <div className="info-icon">📧</div>
                        <div className="info-text">
                            <h4>Email Us</h4>
                            <p>support@uptoskills.ai</p>
                        </div>
                    </motion.div>
                    
                    <motion.div 
                        className="info-card"
                        whileHover={{ x: 10 }}
                    >
                        <div className="info-icon">📍</div>
                        <div className="info-text">
                            <h4>Visit Us</h4>
                            <p>Tech Park, Sector 62, Noida, India</p>
                        </div>
                    </motion.div>
                    
                    <motion.div 
                        className="info-card"
                        whileHover={{ x: 10 }}
                    >
                        <div className="info-icon">📞</div>
                        <div className="info-text">
                            <h4>Call Us</h4>
                            <p>+91 120 456 7890</p>
                        </div>
                    </motion.div>
                </div>

                <div className="contact-form-wrapper">
                    <AnimatePresence mode="wait">
                        {submitted ? (
                            <motion.div 
                                className="success-message"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0 }}
                                key="success"
                            >
                                <div className="success-icon">✅</div>
                                <h3>Message Sent!</h3>
                                <p>We've received your inquiry and will get back to you shortly.</p>
                            </motion.div>
                        ) : (
                            <motion.form 
                                onSubmit={handleSubmit}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                key="form"
                            >
                                <div className="form-group-modern">
                                    <label>Full Name</label>
                                    <input
                                        type="text"
                                        placeholder="Enter your name"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                                <div className="form-group-modern">
                                    <label>Email Address</label>
                                    <input
                                        type="email"
                                        placeholder="Enter your email"
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                                <div className="form-group-modern">
                                    <label>Your Message</label>
                                    <textarea
                                        placeholder="How can we help?"
                                        required
                                        rows="5"
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    ></textarea>
                                </div>
                                <motion.button 
                                    type="submit" 
                                    className="btn-primary-large full-width"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    Send Message
                                </motion.button>
                            </motion.form>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </motion.div>
    );
};

export default Contact;
