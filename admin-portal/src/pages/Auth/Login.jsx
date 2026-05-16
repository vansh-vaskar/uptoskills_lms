import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../store/AuthContext";
import { Shield, Mail, Lock } from "lucide-react";
import { motion } from "framer-motion";
import "../../styles/Auth.css";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("http://localhost:5000/api/auth/login", { email, password });
            if (res.data.user.role !== "admin") {
                setError("Unauthorized access. Admin role required.");
                return;
            }
            login(res.data.user);
            navigate("/");
        } catch (err) {
            setError("Invalid admin credentials.");
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
                
                {error && <div className="auth-error-msg">{error}</div>}

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
                    <button type="submit" className="auth-submit-btn">Authorize Access</button>
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
