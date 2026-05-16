import { useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Logo from "./Logo/Logo";
import { AuthContext } from "../store/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import "../styles/AdminLayout.css";

const Icons = {
    LayoutDashboard: () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
    ),
    Users: () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
    ),
    BookOpen: () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>
    ),
    GraduationCap: () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c3 3 9 3 12 0v-5"></path></svg>
    ),
    LogOut: () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
    ),
    Bell: () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
    ),
    X: ({ size = 14 }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
    ),
    ChevronDown: ({ size = 14, className = "" }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="6 9 12 15 18 9"></polyline></svg>
    ),
    BarChart: () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
    ),
    MessageSquare: () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
    ),
    Settings: () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
    ),
    UserCircle: () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="10" r="3"></circle><path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662"></path></svg>
    )
};

const AdminLayout = ({ children }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useContext(AuthContext);
    const [isNotifOpen, setIsNotifOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    const menuItems = [
        { name: "Overview", path: "/", icon: Icons.LayoutDashboard },
        { name: "Students", path: "/students", icon: Icons.Users },
        { name: "Courses", path: "/courses", icon: Icons.BookOpen },
        { name: "Enrollments", path: "/enrollments", icon: Icons.GraduationCap },
        { name: "Reports", path: "/reports", icon: Icons.BarChart },
        { name: "Reviews", path: "/reviews", icon: Icons.MessageSquare },
        { name: "Profile", path: "/profile", icon: Icons.UserCircle },
        { name: "Settings", path: "/settings", icon: Icons.Settings },
    ];

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <div className="admin-layout-root">
            <aside className="admin-sidebar">
                <div className="sidebar-brand">
                    <Logo size="small" />
                    <span className="admin-badge-text">Admin Panel</span>
                </div>

                <nav className="sidebar-nav">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`sidebar-link ${location.pathname === item.path ? "active" : ""}`}
                            >
                                <Icon />
                                <span>{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="sidebar-footer">
                    <button className="sidebar-logout" onClick={handleLogout}>
                        <Icons.LogOut />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            <main className="admin-main-content">
                <header className="admin-top-bar">
                    <div className="top-bar-left">
                        <h2 className="page-title">
                            {menuItems.find(m => m.path === location.pathname)?.name || "Dashboard"}
                        </h2>
                    </div>
                    <div className="top-bar-actions">
                        <div className="notif-rel">
                            <button className="notif-btn" onClick={() => setIsNotifOpen(!isNotifOpen)}>
                                <Icons.Bell />
                                <span className="btn-badge"></span>
                            </button>
                            <AnimatePresence>
                                {isNotifOpen && (
                                    <motion.div
                                        className="admin-notif-dropdown"
                                        initial={{ opacity: 0, y: 15, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 15, scale: 0.95 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <div className="notif-head">
                                            <h4>System Notifications</h4>
                                            <button onClick={() => setIsNotifOpen(false)}><Icons.X size={14} /></button>
                                        </div>
                                        <div className="notif-body">
                                            <div className="notif-entry">
                                                <span>🚀</span>
                                                <p>New course 'Introduction to AI' added by System.</p>
                                            </div>
                                            <div className="notif-entry">
                                                <span>👥</span>
                                                <p>3 new student registrations in the last hour.</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <div className="profile-rel">
                            <div className="admin-profile-pill" onClick={() => setIsProfileOpen(!isProfileOpen)}>
                                <div className="admin-avatar">{user?.fullName?.charAt(0) || "A"}</div>
                                <div className="admin-p-info">
                                    <span>{user?.fullName || "Admin"}</span>
                                    <Icons.ChevronDown className={isProfileOpen ? 'rotate' : ''} />
                                </div>
                            </div>
                            <AnimatePresence>
                                {isProfileOpen && (
                                    <motion.div
                                        className="admin-profile-dropdown"
                                        initial={{ opacity: 0, y: 15, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 15, scale: 0.95 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <div className="dropdown-user-header">
                                            <p className="p-name">{user?.fullName}</p>
                                            <p className="p-email">{user?.email}</p>
                                        </div>
                                        <div className="dropdown-divider"></div>
                                        <Link to="/profile" style={{ textDecoration: 'none' }} onClick={() => setIsProfileOpen(false)}>
                                            <button className="p-action">My Profile</button>
                                        </Link>
                                        <Link to="/forgot-password" style={{ textDecoration: 'none' }} onClick={() => setIsProfileOpen(false)}>
                                            <button className="p-action">Change Password</button>
                                        </Link>
                                        <div className="dropdown-divider"></div>
                                        <button className="p-action logout" onClick={handleLogout}>
                                            <Icons.LogOut />
                                            <span>Logout</span>
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </header>

                <motion.div
                    className="admin-page-container"
                    key={location.pathname}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    {children}
                </motion.div>
            </main>
        </div>
    );
};

export default AdminLayout;
