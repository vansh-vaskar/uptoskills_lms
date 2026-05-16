import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Logo from '../components/Logo/Logo';
import '../styles/Home.css';

const Home = () => {
    return (
        <div className="home-container">
            <section className="hero-section">
                <motion.div
                    className="hero-content"
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                ><br />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="hero-badge"
                    >
                        ✨ New: Learn from AI-Powered Superstars
                    </motion.div>
                    <h1>
                        Learn Skills from Your <br />
                        <span className="text-gradient">Favorite Celebrities</span>
                    </h1>
                    <p>
                        Experience the future of education. Our AI technology brings world-class icons
                        directly to your screen to teach you the skills of tomorrow.
                    </p>
                    <div className="hero-cta">
                        <Link to="/courses" className="btn-primary-large">Explore Courses</Link>
                        <Link to="/about" className="btn-secondary-large">How it Works</Link>
                    </div>
                    <div className="hero-stats">
                        <div className="stat-item">
                            <h3>50K+</h3>
                            <p>Students</p>
                        </div>
                        <div className="stat-item">
                            <h3>100+</h3>
                            <p>Celebrity Mentors</p>
                        </div>
                        <div className="stat-item">
                            <h3>4.9/5</h3>
                            <p>Avg Rating</p>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    className="hero-image-container"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1 }}
                >
                    <div className="hero-floating-card top">
                        <div className="card-icon">🎭</div>
                        <div className="card-info">
                            <p>AI Voice Synthesis</p>
                            <span>100% Realistic</span>
                        </div>
                    </div>
                    <div className="hero-floating-card bottom">
                        <div className="card-icon">⚡</div>
                        <div className="card-info">
                            <p>Real-time Projects</p>
                            <span>Hands-on Learning</span>
                        </div>
                    </div>
                    <div className="hero-main-visual">
                        <div className="ai-glow-orb"></div>
                        <div className="ai-rings">
                            <div className="ring"></div>
                            <div className="ring"></div>
                            <div className="ring"></div>
                        </div>
                    </div>
                </motion.div>
            </section>

            <section className="features-section">
                <div className="section-header">
                    <h2>Why Choose UptoSkills AI?</h2>
                    <p>Combining celebrity charisma with artificial intelligence for an unmatched learning journey.</p>
                </div>
                <div className="features-grid">
                    {[
                        { title: "Celebrity Mentors", desc: "Learn directly from the icons you admire, powered by advanced AI synthesis.", icon: "🌟" },
                        { title: "Adaptive Learning", desc: "Our AI tailors the curriculum to your pace and understanding levels.", icon: "🧠" },
                        { title: "Interactive Projects", desc: "Apply your skills in real-world scenarios designed by industry leaders.", icon: "🛠️" }
                    ].map((feature, idx) => (
                        <motion.div
                            key={idx}
                            className="feature-card"
                            whileHover={{ y: -10 }}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                        >
                            <div className="feature-icon">{feature.icon}</div>
                            <h3>{feature.title}</h3>
                            <p>{feature.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            <section className="home-cta-section">
                <motion.div
                    className="cta-box"
                    whileInView={{ scale: [0.95, 1] }}
                    transition={{ duration: 0.5 }}
                >
                    <h2>Ready to start your journey?</h2>
                    <p>Join UptoSkills today and get exclusive access to celebrity-led courses.</p>
                    <Link to="/register" className="btn-primary-large">Get Started for Free</Link>
                </motion.div>
            </section>
        </div>
    );
};

export default Home;
