import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Users, BookOpen, GraduationCap, TrendingUp, Clock, Star, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";
import "../../styles/AdminDashboard.css";

const AdminDashboard = () => {
    const [stats, setStats] = useState({ totalStudents: 0, totalCourses: 0, totalEnrollments: 0 });
    const [recentUsers, setRecentUsers] = useState([]);
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
        { title: "Total Students", value: stats.totalStudents, icon: Users, color: "#38bdf8" },
        { title: "Total Courses", value: stats.totalCourses, icon: BookOpen, color: "#f97316" },
        { title: "Total Enrollments", value: stats.totalEnrollments, icon: GraduationCap, color: "#10b981" },
        { title: "Average Rating", value: popularCourses.length > 0 ? (popularCourses.reduce((a, b) => a + (parseFloat(b.rating) || 0), 0) / popularCourses.length).toFixed(1) : "0.0", icon: Star, color: "#facc15" },
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
                            <div className="stat-icon-bg" style={{ backgroundColor: `${card.color}20`, color: card.color }}>
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

            <div className="dashboard-data-grid">
                <div className="left-data-stack">
                    <section className="recent-activity">
                        <div className="section-header">
                            <h3><Users size={18} /> New Registrations</h3>
                        </div>
                        <div className="activity-list">
                            {recentUsers.map((u) => (
                                <div key={u.id} className="activity-item">
                                    <div className="user-initials" style={{ background: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8' }}>{u.full_name?.charAt(0)}</div>
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
                                        <Star size={12} fill="#f97316" stroke="none" /> {c.rating}
                                    </div>
                                </div>
                                <div className="perf-progress-bar">
                                    <div className="fill" style={{ width: `${(c.rating / 5) * 100}%` }}></div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="platform-health" style={{ marginTop: '30px', padding: '20px', background: 'rgba(255,255,255,0.02)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)' }}>
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
