import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Shield, Mail, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import "../../styles/Auth.css";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
        toast.success("Recovery link sent to your email!");
    };

    return (
        <div className="admin-auth-root">
            <motion.div
                className="auth-card"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
            >
                <div className="auth-brand">
                    <Shield size={40} className="brand-icon" />
                    <h2>Reset Password</h2>
                    <p>Enter your email to receive recovery instructions</p>
                </div>

                {!submitted ? (
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
                        <button type="submit" className="auth-submit-btn">Send Recovery Link</button>
                    </form>
                ) : (
                    <div className="success-state">
                        <div className="success-icon">📧</div>
                        <h3>Check your email</h3>
                        <p>We've sent a password reset link to <strong>{email}</strong></p>
                        <button onClick={() => navigate("/login")} className="auth-submit-btn">Back to Login</button>
                    </div>
                )}

                <div className="auth-footer">
                    <Link to="/login" className="back-to-login">
                        <ArrowLeft size={16} />
                        <span>Back to Login</span>
                    </Link>
                </div>
            </motion.div>
        </div>
    );
};

export default ForgotPassword;
