import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Users, BookOpen, GraduationCap, TrendingUp, Clock, Star, MessageSquare, BarChart } from "lucide-react";
import { motion } from "framer-motion";
import "../../styles/AdminDashboard.css";

const AdminDashboard = () => {
    const [stats, setStats] = useState({ totalStudents: 0, totalCourses: 0, totalEnrollments: 0, enrollmentsThisWeek: 0, completionRate: 0, pendingApprovals: 0, systemHealth: "Optimal", instructorStats: [] });
    const [recentUsers, setRecentUsers] = useState([]);

    const normalizeUrl = (url) => {
        if (!url) return "https://images.unsplash.com/photo-1534528741775-53994a69daeb";
        if (url.startsWith("http")) return url;
        const cleanPath = url.startsWith("/") ? url.slice(1) : url;
        return `http://localhost:5000/${cleanPath}`;
    };
    const [popularCourses, setPopularCourses] = useState([]);
    const [recentReviews, setRecentReviews] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsRes, usersRes, coursesRes] = await Promise.all([
                    axios.get("http://localhost:5000/api/admin/stats"),
                    axios.get("http://localhost:5000/api/admin/users"),
                    axios.get("http://localhost:5000/api/courses")
                ]);

                setStats(statsRes.data);
                setRecentUsers(usersRes.data.slice(0, 5));

                const sorted = [...coursesRes.data]
                    .sort((a, b) => (parseInt(b.enrollments) || 0) - (parseInt(a.enrollments) || 0))
                    .slice(0, 3);
                setPopularCourses(sorted);

                const revRes = await axios.get("http://localhost:5000/api/admin/reviews/recent");
                setRecentReviews(revRes.data);
            } catch (err) {
                console.error("Error fetching dashboard data:", err);
            }
        };
        fetchData();
    }, []);

    const cards = [
        { title: "Total Active Users", value: stats.totalStudents, icon: Users, color: "var(--color-success)" },
        { title: "Total Courses", value: stats.totalCourses, icon: BookOpen, color: "var(--color-secondary)" },
        { title: "Enrollments This Week", value: `+${stats.enrollmentsThisWeek}`, icon: TrendingUp, color: "var(--color-primary)" },
        { title: "Course Completion Rate", value: `${stats.completionRate}%`, icon: GraduationCap, color: "var(--color-success)" },
        { title: "Pending Approvals", value: stats.pendingApprovals, icon: Clock, color: "var(--color-error)" },
        { title: "System Health", value: stats.systemHealth, icon: Star, color: stats.systemHealth === "Optimal" ? "var(--color-success)" : "var(--color-warning)" }
    ];

    return (
        <div className="admin-dashboard">
            <header className="dashboard-header">
                <div className="header-glass-bg"></div>
                <div className="header-content-v">
                    <h2>Platform Overview</h2>
                    <p>Track your platform's growth and engagement in real-time.</p>
                </div>
            </header>

            <div className="stats-grid">
                {cards.map((card, idx) => {
                    const Icon = card.icon;
                    return (
                        <motion.div
                            key={idx}
                            className="stat-card-premium"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                        >
                            <div className="stat-icon-bg" style={{ background: `color-mix(in srgb, ${card.color} 20%, transparent)`, color: card.color }}>
                                <Icon size={24} />
                            </div>
                            <div className="stat-content">
                                <span className="stat-label">{card.title}</span>
                                <h3 className="stat-value">{card.value}</h3>
                            </div>
                            <div className="stat-chart-mini">
                                <div className="bar" style={{ height: '40%', background: card.color }}></div>
                                <div className="bar" style={{ height: '70%', background: card.color }}></div>
                                <div className="bar" style={{ height: '60%', background: card.color }}></div>
                                <div className="bar" style={{ height: '90%', background: card.color }}></div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            <div className="quick-actions-section">
                <Link to="/courses" state={{ openModal: true }} className="qa-btn qa-primary">
                    <BookOpen size={18} /> + New Course
                </Link>
                <Link to="/students" state={{ openModal: true }} className="qa-btn qa-primary">
                    <Users size={18} /> + New Student
                </Link>
                <Link to="/students" className="qa-btn qa-secondary">
                    <Clock size={18} /> Approve Pending
                </Link>
                <Link to="/reports" className="qa-btn qa-secondary">
                    <BarChart size={18} /> View Reports
                </Link>
            </div>

            <div className="dashboard-data-grid">
                <div className="left-data-stack">
                    <section className="recent-activity">
                        <div className="section-header">
                            <h3><Users size={18} /> New Registrations</h3>
                        </div>
                        <div className="activity-list">
                            {recentUsers.map((u) => (
                                <div key={u.id} className="activity-item">
                                    <div className="user-initials" style={{ background: 'rgba(56, 189, 248, 0.1)', color: 'var(--color-info)' }}>{u.full_name?.charAt(0)}</div>
                                    <div className="item-info">
                                        <p className="item-title">{u.full_name}</p>
                                        <p className="item-sub">{u.email}</p>
                                    </div>
                                    <span className={`item-status ${u.role === 'admin' ? 'admin' : 'student'}`}>
                                        {u.role}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="recent-reviews-box">
                        <div className="section-header">
                            <h3><MessageSquare size={18} /> Recent Feedback</h3>
                        </div>
                        <div className="rev-list-mini">
                            {recentReviews.length === 0 ? <p className="empty-msg">No recent reviews found.</p> : recentReviews.map(r => (
                                <div key={r.id} className="rev-item-mini">
                                    <div className="rev-head">
                                        <strong>{r.user_name}</strong>
                                        <span><Star size={10} fill="#facc15" stroke="none" /> {r.rating}</span>
                                    </div>
                                    <p>"{r.comment?.substring(0, 60)}..."</p>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                <section className="course-performance">
                    <div className="section-header">
                        <h3><TrendingUp size={18} /> Popular Courses</h3>
                    </div>
                    <div className="course-perf-list">
                        {popularCourses.length === 0 ? <p className="empty-msg">Add courses to see performance.</p> : popularCourses.map((c, i) => (
                            <div key={c.id} className="perf-item-premium">
                                <div className="perf-rank">#{i + 1}</div>
                                <div className="perf-info">
                                    <p>{c.title}</p>
                                    <span>{c.instructor_name}</span>
                                </div>
                                <div className="perf-stats-v">
                                    <div className="p-stat">
                                        <Users size={12} /> {c.enrollments}
                                    </div>
                                    <div className="p-stat rating">
                                        <Star size={12} fill="var(--color-primary)" stroke="none" /> {c.rating}
                                    </div>
                                </div>
                                <div className="perf-progress-bar">
                                    <div className="fill" style={{ width: `${(c.rating / 5) * 100}%` }}></div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="platform-health" style={{ marginTop: '30px', padding: '20px', background: 'rgba(255,255,255,0.02)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <h4 style={{ fontSize: '0.9rem', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}><Star size={16} color="var(--color-primary)" fill="var(--color-primary)" /> Trending Celebrity Faculty</h4>
                        <div className="trending-inst-list" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {(!stats.instructorStats || stats.instructorStats.length === 0) ? (
                                <p style={{ fontSize: '0.8rem', color: '#64748b', textAlign: 'center', margin: 0 }}>No instructor stats available.</p>
                            ) : stats.instructorStats.slice(0, 4).map((inst) => {
                                const total = stats.totalStudents || 1;
                                const pct = Math.round((parseInt(inst.student_count) || 0) / total * 100);
                                return (
                                    <div key={inst.id} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <img 
                                            src={normalizeUrl(inst.image)} 
                                            alt={inst.name} 
                                            style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover', border: '1.5px solid rgba(255,255,255,0.08)' }} 
                                            onError={(e) => e.target.src = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"} 
                                        />
                                        <div style={{ flex: 1 }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '4px' }}>
                                                <span style={{ fontWeight: 700, color: 'white' }}>{inst.name}</span>
                                                <span style={{ color: 'var(--color-primary)', fontWeight: 800 }}>{pct}% <span style={{ color: '#64748b', fontWeight: 500 }}>({inst.student_count} learners)</span></span>
                                            </div>
                                            <div style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                                                <div style={{ height: '100%', width: `${pct}%`, background: 'linear-gradient(to right, var(--color-primary), var(--color-success))', borderRadius: '3px' }}></div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="platform-health" style={{ marginTop: '20px', padding: '20px', background: 'rgba(255,255,255,0.02)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <h4 style={{ fontSize: '0.9rem', marginBottom: '15px' }}>Platform Performance</h4>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                            <div className="health-stat">
                                <span>Uptime</span>
                                <strong>99.9%</strong>
                            </div>
                            <div className="health-stat">
                                <span>Avg Load</span>
                                <strong>1.2s</strong>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default AdminDashboard;
