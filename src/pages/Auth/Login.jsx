import { useState, useContext } from "react";
import { AuthContext } from "../../store/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import Logo from "../../components/Logo/Logo";
import axios from "axios";
import toast from "react-hot-toast";
import "../../styles/Auth.css";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await axios.post("http://localhost:5000/api/auth/login", { email, password });
            login(res.data.user);
            toast.success(`Welcome, ${res.data.user.fullName || "Student"}!`);
            navigate("/courses");
        } catch (err) {
            toast.error(err.response?.data?.message || "Invalid credentials!");
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <motion.div 
                className="auth-box"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
            >
                <div className="auth-logo-center">
                    <Logo size="large" />
                </div>
                <h2 className="auth-title">Welcome Back</h2>
                <p className="auth-subtitle">Continue your journey with world-class mentors</p>
                
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Email Address</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="Enter your email" />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Enter your password" />
                    </div>
                    <Link to="/forgot-password" stroke="currentColor" className="forgot-password-link">Forgot Password?</Link>
                    <motion.button 
                        type="submit" 
                        className="auth-btn"
                        disabled={loading}
                        whileHover={{ scale: loading ? 1 : 1.02 }}
                        whileTap={{ scale: loading ? 1 : 0.98 }}
                    >
                        {loading ? (
                            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                <svg className="animate-spin" style={{ animation: 'spin 1s linear infinite', width: '16px', height: '16px' }} viewBox="0 0 24 24" fill="none">
                                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" style={{ opacity: 0.25 }}></circle>
                                    <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" style={{ opacity: 0.75 }}></path>
                                </svg>
                                Logging in...
                            </span>
                        ) : "Log In"}
                    </motion.button>
                </form>
                <p className="auth-footer">
                    Don't have an account? <Link to="/register">Sign Up</Link>
                </p>
            </motion.div>
        </div>
    );
};

export default Login;