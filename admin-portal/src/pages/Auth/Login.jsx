import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../store/AuthContext";
import { Shield, Mail, Lock } from "lucide-react";
import { motion } from "framer-motion";
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
            if (res.data.user.role !== "admin") {
                toast.error("Unauthorized access. Admin role required.");
                setLoading(false);
                return;
            }
            login(res.data.user);
            toast.success(`Welcome back, ${res.data.user.fullName}!`);
            navigate("/");
        } catch (err) {
            toast.error("Invalid admin credentials.");
            setLoading(false);
        }
    };

    return (
        <div className="admin-auth-root">
            <motion.div 
                className="auth-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
            >
                <div className="auth-brand">
                    <Shield size={40} className="brand-icon" />
                    <h2>Admin Portal</h2>
                    <p>Secure login for UptoSkills AI Learn Management</p>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <Mail size={18} className="input-icon" />
                        <input 
                            type="email" 
                            placeholder="Admin Email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required 
                        />
                    </div>
                    <div className="input-group">
                        <Lock size={18} className="input-icon" />
                        <input 
                            type="password" 
                            placeholder="Password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required 
                        />
                    </div>
                    <button type="submit" className="auth-submit-btn" disabled={loading}>
                        {loading ? (
                            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                <svg className="animate-spin" style={{ animation: 'spin 1s linear infinite', width: '16px', height: '16px' }} viewBox="0 0 24 24" fill="none">
                                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" style={{ opacity: 0.25 }}></circle>
                                    <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" style={{ opacity: 0.75 }}></path>
                                </svg>
                                Authorizing...
                            </span>
                        ) : "Authorize Access"}
                    </button>
                </form>
                <div className="auth-footer">
                    <Link to="/forgot-password">Forgot security credentials?</Link>
                    <p>New admin? <Link to="/register">Create account</Link></p>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
