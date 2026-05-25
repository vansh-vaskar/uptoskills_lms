import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { Shield, Mail, Lock, User, Check, X as XIcon } from "lucide-react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import "../../styles/Auth.css";

const Register = () => {
    const [formData, setFormData] = useState({ fullName: "", email: "", password: "", role: "admin" });
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const isEmailTouched = formData.email.length > 0;

    const getPasswordStrength = (pass) => {
        let strength = 0;
        if (pass.length >= 8) strength++;
        if (/\d/.test(pass)) strength++;
        if (/[!@#$%^&*(),.?":{}|<>]/.test(pass)) strength++;
        return strength;
    };

    const passStrength = getPasswordStrength(formData.password);
    const passTouched = formData.password.length > 0;

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isValidEmail(formData.email)) {
            toast.error("Please enter a valid email address.");
            return;
        }

        if (passStrength < 2) {
            toast.error("Password is too weak. Please meet more requirements.");
            return;
        }

        setIsLoading(true);
        try {
            await axios.post("http://localhost:5000/api/auth/register", formData);
            toast.success("Admin account created successfully! Please login.");
            navigate("/login");
        } catch (err) {
            toast.error("Registration failed. Email might already be in use.");
        } finally {
            setIsLoading(false);
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
                            className={isEmailTouched ? (isValidEmail(formData.email) ? "input-valid" : "input-invalid") : ""}
                            placeholder="Admin Email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                        />
                    </div>
                    {isEmailTouched && !isValidEmail(formData.email) && <span className="inline-error" style={{ marginBottom: '15px', marginTop: '-10px' }}>Please enter a valid email format.</span>}
                    <div className="input-group" style={{ marginBottom: passTouched ? '10px' : '20px' }}>
                        <Lock size={18} className="input-icon" />
                        <input
                            type="password"
                            placeholder="Master Password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required
                        />
                    </div>
                    {passTouched && (
                        <div className="password-meter-container" style={{ marginBottom: '20px', textAlign: 'left' }}>
                            <div className="strength-bar-bg">
                                <div className={`strength-bar-fill ${passStrength === 1 ? 'strength-weak' : passStrength === 2 ? 'strength-medium' : passStrength === 3 ? 'strength-strong' : ''}`}></div>
                            </div>
                            <ul className="password-requirements">
                                <li className={formData.password.length >= 8 ? 'req-met' : 'req-unmet'}>
                                    {formData.password.length >= 8 ? <Check size={12} /> : <XIcon size={12} />} At least 8 characters
                                </li>
                                <li className={/\d/.test(formData.password) ? 'req-met' : 'req-unmet'}>
                                    {/\d/.test(formData.password) ? <Check size={12} /> : <XIcon size={12} />} Contains a number
                                </li>
                                <li className={/[!@#$%^&*(),.?":{}|<>]/.test(formData.password) ? 'req-met' : 'req-unmet'}>
                                    {/[!@#$%^&*(),.?":{}|<>]/.test(formData.password) ? <Check size={12} /> : <XIcon size={12} />} Contains a special character
                                </li>
                            </ul>
                        </div>
                    )}
                    <button type="submit" className="auth-submit-btn" disabled={isLoading}>
                        {isLoading ? <><span className="spinner-inline"></span> Registering...</> : "Register Administrator"}
                    </button>
                </form>
                <div className="auth-footer">
                    <p>Already have an account? <Link to="/login">Login here</Link></p>
                </div>
            </motion.div>
        </div>
    );
};

export default Register;
