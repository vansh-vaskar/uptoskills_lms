import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { Shield, Mail, Lock, User } from "lucide-react";
import { motion } from "framer-motion";
import "../../styles/Auth.css";

const Register = () => {
    const [formData, setFormData] = useState({ fullName: "", email: "", password: "", role: "admin" });
    const navigate = useNavigate();
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:5000/api/auth/register", formData);
            alert("Admin account created successfully! Please login.");
            navigate("/login");
        } catch (err) {
            setError("Registration failed. Email might already be in use.");
        }
    };

    return (
        <div className="admin-auth-root">
            <motion.div 
                className="auth-card"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
            >
                <div className="auth-brand">
                    <Shield size={40} className="brand-icon" />
                    <h2>Create Admin Account</h2>
                    <p>Register a new system administrator</p>
                </div>
                
                {error && <div className="auth-error-msg">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <User size={18} className="input-icon" />
                        <input 
                            type="text" 
                            placeholder="Full Name" 
                            value={formData.fullName}
                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                            required 
                        />
                    </div>
                    <div className="input-group">
                        <Mail size={18} className="input-icon" />
                        <input 
                            type="email" 
                            placeholder="Admin Email" 
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required 
                        />
                    </div>
                    <div className="input-group">
                        <Lock size={18} className="input-icon" />
                        <input 
                            type="password" 
                            placeholder="Master Password" 
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required 
                        />
                    </div>
                    <button type="submit" className="auth-submit-btn">Register Administrator</button>
                </form>
                <div className="auth-footer">
                    <p>Already have an account? <Link to="/login">Login here</Link></p>
                </div>
            </motion.div>
        </div>
    );
};

export default Register;
