import { motion } from 'framer-motion';
import '../styles/About.css';

const About = () => {
    return (
        <motion.div
            className="about-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <section className="about-hero">
                <motion.h1
                    initial={{ y: -20 }}
                    animate={{ y: 0 }}
                >
                    About <span className="text-gradient">UptoSkills AI Learn</span>
                </motion.h1>
                <p className="subtitle">
                    Empowering the next generation of professionals through intuitive, AI-driven learning experiences.
                </p>
            </section>

            <div className="about-content">
                <div className="about-grid">
                    <motion.div
                        className="about-card"
                        whileHover={{ scale: 1.02 }}
                    >
                        <div className="card-icon">🚀</div>
                        <h3>Our Mission</h3>
                        <p>
                            To bridge the gap between academic learning and industry requirements. We leverage artificial intelligence to provide personalized learning paths that adapt to each student's unique pace and style.
                        </p>
                    </motion.div>

                    <motion.div
                        className="about-card"
                        whileHover={{ scale: 1.02 }}
                    >
                        <div className="card-icon">🧠</div>
                        <h3>Why AI-Based?</h3>
                        <p>
                            Traditional learning often follows a one-size-fits-all approach. Our AI algorithms analyze performance and interests to suggest the most relevant content, ensuring you stay ahead of the curve.
                        </p>
                    </motion.div>
                </div>

                <section className="values-section">
                    <h2>Our Core Values</h2>
                    <div className="values-chips">
                        {['Innovation', 'Accessibility', 'Integrity', 'Excellence'].map((value, idx) => (
                            <motion.div
                                key={value}
                                className="value-chip"
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ delay: idx * 0.1 }}
                                viewport={{ once: true }}
                            >
                                {value}
                            </motion.div>
                        ))}
                    </div>
                </section>
            </div>
        </motion.div>
    );
};

export default About;
