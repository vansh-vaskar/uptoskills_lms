import { useState, useContext } from "react";
import { AuthContext } from "../../store/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, X } from "lucide-react";
import Logo from "../../components/Logo/Logo";
import toast from "react-hot-toast";
import axios from "axios";
import "../../styles/Auth.css";

const Register = () => {
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const isEmailTouched = email.length > 0;

    const getPasswordStrength = (pass) => {
        let strength = 0;
        if (pass.length >= 8) strength++;
        if (/\d/.test(pass)) strength++;
        if (/[!@#$%^&*(),.?":{}|<>]/.test(pass)) strength++;
        return strength;
    };

    const passStrength = getPasswordStrength(password);
    const passTouched = password.length > 0;

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isValidEmail(email)) {
            toast.error("Please enter a valid email address.");
            return;
        }

        if (password !== confirmPassword) {
            toast.error("Passwords do not match!");
            return;
        }

        if (passStrength < 2) {
            toast.error("Password is too weak. Please meet more requirements.");
            return;
        }

        setIsLoading(true);

        try {
            // Using email as username for backend compatibility
            const res = await axios.post("http://localhost:5000/api/auth/register", {
                username: email,
                email,
                password,
                role: "student",
                fullName
            });
            login(res.data.user || { id: res.data.userId, email, fullName, role: "student" });
            toast.success("Account created successfully!");
            navigate("/dashboard");
        } catch (err) {
            toast.error(err.response?.data?.error || "Registration failed! Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <motion.div
                className="auth-box"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <div className="auth-logo-center">
                    <Logo size="large" />
                </div>
                <h2 className="auth-title">Join UptoSkills AI</h2>
                <p className="auth-subtitle">Start your journey with world-class celebrity courses</p>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Full Name <span className="required-asterisk">*</span></label>
                        <input
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            required
                            placeholder="John Doe"
                        />
                    </div>
                    <div className="form-group">
                        <label>Email Address <span className="required-asterisk">*</span></label>
                        <input
                            type="email"
                            className={isEmailTouched ? (isValidEmail(email) ? "input-valid" : "input-invalid") : ""}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="john@example.com"
                        />
                        {isEmailTouched && !isValidEmail(email) && <span className="inline-error">Please enter a valid email format.</span>}
                    </div>
                    <div className="form-group">
                        <label>Password <span className="required-asterisk">*</span></label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="••••••••"
                        />
                        {passTouched && (
                            <div className="password-meter-container">
                                <div className="strength-bar-bg">
                                    <div className={`strength-bar-fill ${passStrength === 1 ? 'strength-weak' : passStrength === 2 ? 'strength-medium' : passStrength === 3 ? 'strength-strong' : ''}`}></div>
                                </div>
                                <ul className="password-requirements">
                                    <li className={password.length >= 8 ? 'req-met' : 'req-unmet'}>
                                        {password.length >= 8 ? <Check size={12} /> : <X size={12} />} At least 8 characters
                                    </li>
                                    <li className={/\d/.test(password) ? 'req-met' : 'req-unmet'}>
                                        {/\d/.test(password) ? <Check size={12} /> : <X size={12} />} Contains a number
                                    </li>
                                    <li className={/[!@#$%^&*(),.?":{}|<>]/.test(password) ? 'req-met' : 'req-unmet'}>
                                        {/[!@#$%^&*(),.?":{}|<>]/.test(password) ? <Check size={12} /> : <X size={12} />} Contains a special character
                                    </li>
                                </ul>
                            </div>
                        )}
                    </div>
                    <div className="form-group">
                        <label>Confirm Password <span className="required-asterisk">*</span></label>
                        <input
                            type="password"
                            className={confirmPassword.length > 0 && password !== confirmPassword ? "input-invalid" : ""}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            placeholder="••••••••"
                        />
                        {confirmPassword.length > 0 && password !== confirmPassword && <span className="inline-error">Passwords do not match.</span>}
                    </div>

                    <button type="submit" className="auth-btn" disabled={isLoading}>
                        {isLoading ? <><span className="spinner-inline"></span> Creating Account...</> : "Create Account"}
                    </button>
                </form>
                <p className="auth-footer">
                    Already have an account? <Link to="/login">Log In</Link>
                </p>
            </motion.div>
        </div>
    );
};

export default Register;