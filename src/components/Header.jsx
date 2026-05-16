import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../store/AuthContext";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "./Logo/Logo";
import "../styles/Header.css";

const Header = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout } = useContext(AuthContext);
    const [searchParams] = useSearchParams();

    const [isSearchExpanded, setIsSearchExpanded] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isNotifOpen, setIsNotifOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");

    useEffect(() => {
        setSearchQuery(searchParams.get("search") || "");
    }, [searchParams]);

    const handleLogout = () => {
        logout();
        navigate("/login");
        setIsProfileOpen(false);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/courses?search=${encodeURIComponent(searchQuery)}`);
        } else {
            navigate(`/courses`);
        }
    };

    return (
        <motion.header
            className="main-header"
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
        >
            <div className="header-left">
                <Link to="/" className="logo-link-wrapper">
                    <Logo size="medium" />
                </Link>

                <nav className="nav-links">
                    {["Explore", "Dashboard", "Resources", "About", "Contact"].map((item, index) => {
                        const path = item === "Dashboard"
                            ? (user?.role === "admin" ? "/admin" : "/dashboard")
                            : (item === "Explore" ? "/courses" : `/${item.toLowerCase()}`);
                        return (
                            <motion.div
                                key={item}
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 * (index + 1) }}
                            >
                                <Link
                                    to={path}
                                    className={`nav-link ${location.pathname === path ? "active" : ""}`}
                                >
                                    {item}
                                </Link>
                            </motion.div>
                        );
                    })}
                </nav>
            </div>

            <div className="header-actions">
                <motion.form
                    className={`search-container ${isSearchExpanded || searchQuery ? "expanded" : ""}`}
                    onSubmit={handleSearchSubmit}
                    layout
                >
                    <input
                        type="text"
                        placeholder="Search courses or celebrities..."
                        className="search-input"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button
                        type="button"
                        className="search-icon-btn"
                        onClick={() => {
                            if (!searchQuery) setIsSearchExpanded(!isSearchExpanded);
                        }}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                    </button>
                </motion.form>

                {user ? (
                    <div className="user-controls">
                        <div className="notif-wrapper">
                            <button className="action-icon" onClick={() => { setIsNotifOpen(!isNotifOpen); setIsProfileOpen(false); }}>
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
                                <span className="badge-dot"></span>
                            </button>
                            <AnimatePresence>
                                {isNotifOpen && (
                                    <motion.div
                                        className="notif-dropdown-modern"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                    >
                                        <h4>Notifications</h4>
                                        <div className="notif-item-modern">
                                            <span>🚀</span>
                                            <p>Welcome to UptoSkills! Start your AI-Powered learning today.</p>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <div className="profile-wrapper">
                            <button
                                className="profile-btn-trigger"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsProfileOpen(!isProfileOpen);
                                    setIsNotifOpen(false);
                                }}
                            >
                                <div className="modern-profile-icon-wrapper student-header-avatar">
                                    {user.fullName?.charAt(0) || user.username?.charAt(0) || "U"}
                                </div>
                            </button>
                            <AnimatePresence>
                                {isProfileOpen && (
                                    <motion.div
                                        className="profile-dropdown-premium"
                                        initial={{ opacity: 0, scale: 0.95, y: 15 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95, y: 15 }}
                                    >
                                        <div className="dropdown-user-info">
                                            <p className="u-name">{user.fullName || user.username}</p>
                                            <p className="u-email">{user.email}</p>
                                        </div>
                                        <div className="dropdown-divider-line"></div>
                                        <Link to="/dashboard" className="dropdown-link-item" onClick={() => setIsProfileOpen(false)}>
                                            <span className="icon">🎓</span> My Learning
                                        </Link>
                                        <Link to="/dashboard" className="dropdown-link-item" onClick={() => setIsProfileOpen(false)}>
                                            <span className="icon">📜</span> My Certificates
                                        </Link>
                                        <Link to="/resources" className="dropdown-link-item" onClick={() => setIsProfileOpen(false)}>
                                            <span className="icon">📚</span> Learning Resources
                                        </Link>
                                        <div className="dropdown-divider-line"></div>
                                        <Link to="/forgot-password" className="dropdown-link-item" onClick={() => setIsProfileOpen(false)}>
                                            <span className="icon">🔑</span> Change Password
                                        </Link>
                                        <button className="logout-action-btn" onClick={handleLogout}>
                                            <span className="icon">🚪</span> Log Out
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                ) : (
                    <div className="auth-btns-header">
                        <Link to="/login" className="login-text-btn">Login</Link>
                        <Link to="/register" className="signup-btn-header">Join for Free</Link>
                    </div>
                )}
            </div>
        </motion.header>
    );
};

export default Header;