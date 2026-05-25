import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import Logo from "../../components/Logo/Logo";
import "../../styles/Auth.css";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            toast.success("OTP has been sent to your email address!");
        }, 1500);
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
                <h2 className="auth-title">Reset Password</h2>
                <p className="auth-subtitle">Enter your email and we'll send you an OTP to reset your password.</p>


                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Email Address</label>
                        <input
                            type="email"
                            placeholder="Enter your registered email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="auth-btn" disabled={loading}>
                        {loading ? "Sending OTP..." : "Send OTP"}
                    </button>
                </form>

                <div className="auth-footer">
                    <Link to="/login">Back to Login</Link>
                </div>
            </motion.div>
        </div>
    );
};

export default ForgotPassword;