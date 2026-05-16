import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../store/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import "../../styles/Dashboard.css";

const Icons = {
    Book: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>,
    Award: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline></svg>,
    User: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>,
    Settings: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>,
    Bell: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>,
    LogOut: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>,
    Edit: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>,
    Check: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
};

const Dashboard = () => {
    const { user, login, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [enrollments, setEnrollments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("learning");

    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [profileData, setProfileData] = useState({ fullName: "", email: "" });
    const [savingProfile, setSavingProfile] = useState(false);

    const [settings, setSettings] = useState({
        emailNotif: true,
        publicProfile: false
    });

    useEffect(() => {
        if (user) {
            fetchDashboardData();
            setProfileData({ fullName: user.fullName, email: user.email });
        }
    }, [user]);

    const fetchDashboardData = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/enrollments/${user.id}`);
            setEnrollments(response.data);
        } catch (err) {
            console.error("Error fetching dashboard data:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setSavingProfile(true);
        try {
            await axios.put("http://localhost:5000/api/auth/profile", {
                id: user.id,
                fullName: profileData.fullName,
                email: profileData.email
            });
            login({ ...user, fullName: profileData.fullName, email: profileData.email });
            setIsEditingProfile(false);
            alert("Profile updated successfully!");
        } catch (err) {
            alert("Error updating profile.");
        } finally {
            setSavingProfile(false);
        }
    };

    const normalizeUrl = (url) => {
        if (!url) return "";
        if (url.startsWith("http")) return url;
        const cleanPath = url.startsWith("/") ? url.slice(1) : url;
        return `http://localhost:5000/${cleanPath}`;
    };

    if (!user) return <div className="error-screen"><h2>Please log in to access your dashboard.</h2></div>;
    if (loading) return <div className="loading-screen-premium">Syncing your learning progress...</div>;

    const completedCourses = enrollments.filter(e => e.completed);
    const inProgressCourses = enrollments.filter(e => !e.completed);

    const calculateActualHours = () => {
        return enrollments.reduce((acc, curr) => {
            const curriculum = Array.isArray(curr.curriculum) ? curr.curriculum : [];
            let totalSeconds = 0;

            if (curriculum.length === 0) {
                const dur = (curr.duration || "0").toLowerCase();
                if (dur.includes('hr')) totalSeconds = (parseFloat(dur) || 0) * 3600;
                else if (dur.includes('min')) totalSeconds = (parseFloat(dur) || 0) * 60;
                else totalSeconds = (parseFloat(dur) || 0) * 3600;
            } else {
                curriculum.forEach(item => {
                    const dur = (item.duration || "0").toString();
                    if (dur.includes(':')) {
                        const parts = dur.split(':').map(Number);
                        if (parts.length === 3) totalSeconds += (parts[0] || 0) * 3600 + (parts[1] || 0) * 60 + (parts[2] || 0);
                        else if (parts.length === 2) totalSeconds += (parts[0] || 0) * 60 + (parts[1] || 0);
                    } else {
                        const numeric = parseInt(dur);
                        if (!isNaN(numeric)) totalSeconds += numeric * 60;
                    }
                });
            }

            const totalHours = totalSeconds / 3600;
            const progressFraction = (curr.progress || 0) / 100;
            return acc + (totalHours * progressFraction);
        }, 0).toFixed(1);
    };

    const calculateLessonsCompleted = () => {
        return enrollments.reduce((acc, curr) => {
            const curriculum = curr.curriculum || [];
            const completedCount = Math.floor((curr.progress / 100) * curriculum.length);
            return acc + completedCount;
        }, 0);
    };

    const actualHoursLearned = calculateActualHours();
    const lessonCompletionCount = calculateLessonsCompleted();
    const WEEKLY_GOAL_TARGET = 10;
    const weeklyGoalPercent = Math.min(100, Math.round((lessonCompletionCount / WEEKLY_GOAL_TARGET) * 100));

    const menuItems = [
        { id: "learning", name: "My Learning", icon: <Icons.Book /> },
        { id: "certificates", name: "Certificates", icon: <Icons.Award /> },
        { id: "profile", name: "My Profile", icon: <Icons.User /> },
        { id: "notifications", name: "Updates", icon: <Icons.Bell /> },
        { id: "settings", name: "Settings", icon: <Icons.Settings /> },
    ];

    return (
        <div className="student-dashboard-root">
            <aside className="student-sidebar">
                <div className="student-sidebar-header">
                    <div className="student-avatar-big">{user.fullName?.charAt(0)}</div>
                    <div className="student-meta">
                        <h4>{user.fullName}</h4>
                        <span>Student</span>
                    </div>
                </div>

                <nav className="student-nav">
                    {menuItems.map(item => (
                        <button
                            key={item.id}
                            className={`student-nav-btn ${activeTab === item.id ? 'active' : ''}`}
                            onClick={() => setActiveTab(item.id)}
                        >
                            {item.icon}
                            <span>{item.name}</span>
                        </button>
                    ))}
                </nav>

                <div className="student-sidebar-footer">
                    <button className="student-logout-btn" onClick={() => { logout(); navigate("/login"); }}>
                        <Icons.LogOut />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            <main className="student-main-content">
                <header className="student-header">
                    <h2>{menuItems.find(m => m.id === activeTab)?.name}</h2>
                </header>

                <div className="student-tab-viewport">
                    <AnimatePresence mode="wait">
                        {activeTab === 'learning' && (
                            <motion.div
                                key="learning"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="tab-pane"
                            >
                                <div className="stats-strip">
                                    <div className="strip-card">
                                        <p>Time Spent</p>
                                        <h3>{actualHoursLearned}h</h3>
                                        <span>Course hours completed</span>
                                    </div>
                                    <div className="strip-card">
                                        <p>Weekly Goal ({WEEKLY_GOAL_TARGET} Lessons)</p>
                                        <h3>{weeklyGoalPercent}%</h3>
                                        <div className="mini-progress"><div style={{ width: `${weeklyGoalPercent}%` }}></div></div>
                                        <span className="goal-status-hint">{lessonCompletionCount}/{WEEKLY_GOAL_TARGET} lessons done this week</span>
                                    </div>
                                    <div className="strip-card">
                                        <p>XP Earned</p>
                                        <h3>{lessonCompletionCount * 50}</h3>
                                        <span>Based on completion</span>
                                    </div>
                                </div>

                                <h3 className="pane-subtitle">Continue Where You Left Off</h3>
                                <div className="dash-course-grid">
                                    {inProgressCourses.length === 0 ? (
                                        <div className="pane-empty">
                                            <p>No active courses. Ready to start something new?</p>
                                            <Link to="/courses" className="dash-primary-btn">Explore Courses</Link>
                                        </div>
                                    ) : (
                                        inProgressCourses.map(e => (
                                            <div key={e.id} className="dash-course-card">
                                                <img src={normalizeUrl(e.course_image)} alt={e.course_title} />
                                                <div className="d-card-content">
                                                    <h4>{e.course_title}</h4>
                                                    <div className="d-card-progress">
                                                        <div className="d-bar"><div style={{ width: `${e.progress}%` }}></div></div>
                                                        <span>{e.progress}%</span>
                                                    </div>
                                                    <Link to={`/course/${e.course_id}/player`} className="dash-resume-btn">Resume</Link>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'certificates' && (
                            <motion.div
                                key="certificates"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="tab-pane"
                            >
                                <div className="certificates-wall">
                                    {completedCourses.length === 0 ? (
                                        <div className="pane-empty">
                                            <Icons.Award />
                                            <p>No certificates earned yet. Complete a course to unlock your first one!</p>
                                        </div>
                                    ) : (
                                        completedCourses.map(e => (
                                            <div key={e.id} className="dash-cert-card">
                                                <div className="cert-badge-icon">🏅</div>
                                                <div className="cert-meta">
                                                    <h4>{e.course_title}</h4>
                                                    <p>Issued on {new Date(e.enrolled_at).toLocaleDateString()}</p>
                                                </div>
                                                <a href={e.certificate_url} target="_blank" rel="noreferrer" className="cert-dl-btn">Download PDF</a>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'profile' && (
                            <motion.div
                                key="profile"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="tab-pane"
                            >
                                <div className="profile-edit-pane">
                                    <div className="pane-header-actions">
                                        <h4>Personal Information</h4>
                                        {!isEditingProfile ? (
                                            <button className="edit-profile-trigger" onClick={() => setIsEditingProfile(true)}>
                                                <Icons.Edit /> Edit Profile
                                            </button>
                                        ) : (
                                            <button className="save-profile-btn" onClick={handleProfileUpdate} disabled={savingProfile}>
                                                <Icons.Check /> {savingProfile ? "Saving..." : "Save Changes"}
                                            </button>
                                        )}
                                    </div>

                                    <form onSubmit={handleProfileUpdate}>
                                        <div className="p-field">
                                            <label>Full Name</label>
                                            <input
                                                type="text"
                                                value={profileData.fullName}
                                                onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                                                readOnly={!isEditingProfile}
                                                className={isEditingProfile ? "editing" : ""}
                                            />
                                        </div>
                                        <div className="p-field">
                                            <label>Email Address</label>
                                            <input
                                                type="email"
                                                value={profileData.email}
                                                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                                                readOnly={!isEditingProfile}
                                                className={isEditingProfile ? "editing" : ""}
                                            />
                                        </div>
                                    </form>

                                    <div className="profile-security-premium" style={{ marginTop: '50px', padding: '30px', background: 'rgba(15, 23, 42, 0.4)', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
                                            <div style={{ flex: '1', minWidth: '250px' }}>
                                                <h4 style={{ margin: '0 0 8px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.1rem', fontWeight: 800 }}>
                                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                                                    Account Security
                                                </h4>
                                                <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: 0 }}>Update your password regularly to keep your learning account safe.</p>
                                            </div>
                                            <Link to="/forgot-password" style={{ textDecoration: 'none' }}>
                                                <button style={{
                                                    background: '#1e293b',
                                                    color: '#f97316',
                                                    border: '2px solid rgba(249, 115, 22, 0.3)',
                                                    padding: '12px 28px',
                                                    borderRadius: '14px',
                                                    fontWeight: 800,
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '10px',
                                                    fontSize: '0.9rem',
                                                    transition: 'all 0.3s'
                                                }}>
                                                    Change Password <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                                                </button>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'notifications' && (
                            <motion.div
                                key="notifications"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="tab-pane"
                            >
                                <div className="notif-list-dash">
                                    <div className="notif-item-dash">
                                        <div className="n-dot"></div>
                                        <div className="n-text">
                                            <p>You have successfully enrolled in "Introduction to Artificial Intelligence".</p>
                                            <span>2 hours ago</span>
                                        </div>
                                    </div>
                                    <div className="notif-item-dash">
                                        <div className="n-dot"></div>
                                        <div className="n-text">
                                            <p>Welcome to UptoSkills AI Learn! Explore our new AI-powered courses.</p>
                                            <span>1 day ago</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'settings' && (
                            <motion.div
                                key="settings"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="tab-pane"
                            >
                                <div className="settings-pane">
                                    <div className="setting-row">
                                        <div>
                                            <h4>Email Notifications</h4>
                                            <p>Receive updates about new courses and achievements.</p>
                                        </div>
                                        <button
                                            className={`toggle-btn-p ${settings.emailNotif ? 'on' : 'off'}`}
                                            onClick={() => setSettings({ ...settings, emailNotif: !settings.emailNotif })}
                                        >
                                            <div className="toggle-slider"></div>
                                            <span>{settings.emailNotif ? 'ON' : 'OFF'}</span>
                                        </button>
                                    </div>
                                    <div className="setting-row">
                                        <div>
                                            <h4>Public Profile</h4>
                                            <p>Allow others to see your certificates and achievements.</p>
                                        </div>
                                        <button
                                            className={`toggle-btn-p ${settings.publicProfile ? 'on' : 'off'}`}
                                            onClick={() => setSettings({ ...settings, publicProfile: !settings.publicProfile })}
                                        >
                                            <div className="toggle-slider"></div>
                                            <span>{settings.publicProfile ? 'ON' : 'OFF'}</span>
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;