import { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, Users, Download, ArrowUpRight, BarChart2, Activity } from "lucide-react";

const AdminReports = () => {
    const [stats, setStats] = useState({ totalStudents: 0, totalEnrollments: 0, totalCourses: 0 });
    const [trendType, setTrendType] = useState('monthly');

    useEffect(() => {
        axios.get("http://localhost:5000/api/admin/stats").then(res => setStats(res.data));
    }, []);

    const monthlyData = [
        { label: 'Jan', value: 30 }, { label: 'Feb', value: 45 }, { label: 'Mar', value: 38 },
        { label: 'Apr', value: 65 }, { label: 'May', value: 82 }, { label: 'Jun', value: 95 }
    ];

    const weeklyData = [
        { label: 'W1', value: 15 }, { label: 'W2', value: 25 }, { label: 'W3', value: 22 },
        { label: 'W4', value: 30 }, { label: 'W5', value: 28 }, { label: 'W6', value: 45 }
    ];

    const currentData = trendType === 'monthly' ? monthlyData : weeklyData;

    const handleExport = () => {
        const link = document.createElement("a");
        link.href = "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf";
        link.download = "UptoSkills_Platform_Analytics_Report.pdf";
        link.target = "_blank";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="admin-reports-page">
            <header className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div className="header-text">
                    <h2>Growth Analytics</h2>
                    <p>Real-time data visualization of platform performance and learner acquisition.</p>
                </div>
                <button
                    onClick={handleExport}
                    style={{ background: '#f97316', color: 'white', border: 'none', padding: '12px 28px', borderRadius: '14px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', boxShadow: '0 10px 20px rgba(249, 115, 22, 0.2)' }}
                >
                    <Download size={18} /> Export Analytics
                </button>
            </header>

            <div className="reports-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '25px', marginBottom: '40px' }}>
                <div className="report-card-premium" style={{ background: '#1e293b', padding: '30px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                        <div style={{ width: '48px', height: '48px', background: 'rgba(56, 189, 248, 0.1)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#38bdf8' }}>
                            <TrendingUp size={24} />
                        </div>
                        <span style={{ color: '#10b981', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '5px' }}><ArrowUpRight size={16} /> +12%</span>
                    </div>
                    <h4 style={{ color: '#64748b', fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '1px' }}>Global Reach</h4>
                    <h3 style={{ fontSize: '2.2rem', margin: 0, fontWeight: 900 }}>{stats.totalEnrollments} <span style={{ fontSize: '1rem', color: '#64748b', fontWeight: 500 }}>enrolls</span></h3>
                </div>

                <div className="report-card-premium" style={{ background: '#1e293b', padding: '30px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                        <div style={{ width: '48px', height: '48px', background: 'rgba(249, 115, 22, 0.1)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f97316' }}>
                            <Users size={24} />
                        </div>
                        <span style={{ color: '#10b981', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '5px' }}><ArrowUpRight size={16} /> +8%</span>
                    </div>
                    <h4 style={{ color: '#64748b', fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '1px' }}>Total Learners</h4>
                    <h3 style={{ fontSize: '2.2rem', margin: 0, fontWeight: 900 }}>{stats.totalStudents} <span style={{ fontSize: '1rem', color: '#64748b', fontWeight: 500 }}>active</span></h3>
                </div>
            </div>

            <section style={{ background: '#1e293b', padding: '40px', borderRadius: '32px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '50px' }}>
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><Activity size={20} color="#f97316" /> Enrollment Trends</h3>
                    <div style={{ display: 'flex', background: 'rgba(15, 23, 42, 0.5)', padding: '5px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <button
                            onClick={() => setTrendType('monthly')}
                            style={{ background: trendType === 'monthly' ? '#f97316' : 'transparent', color: trendType === 'monthly' ? 'white' : '#64748b', border: 'none', padding: '8px 20px', borderRadius: '10px', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s' }}
                        >Monthly</button>
                        <button
                            onClick={() => setTrendType('weekly')}
                            style={{ background: trendType === 'weekly' ? '#f97316' : 'transparent', color: trendType === 'weekly' ? 'white' : '#64748b', border: 'none', padding: '8px 20px', borderRadius: '10px', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s' }}
                        >Weekly</button>
                    </div>
                </div>

                <div style={{ height: '320px', position: 'relative', width: '100%', padding: '0 10px', marginBottom: '20px' }}>
                    <svg key={trendType} viewBox="0 0 1000 300" style={{ width: '100%', height: '280px', overflow: 'visible' }}>
                        {[0, 75, 150, 225, 300].map(y => (
                            <line key={y} x1="0" y1={y} x2="1000" y2={y} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                        ))}

                        <motion.path
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 1.5, ease: "easeInOut" }}
                            d={`M ${currentData.map((d, i) => `${(i * 1000) / (currentData.length - 1)} ${300 - (d.value * 2.5)}`).join(' L ')}`}
                            fill="none"
                            stroke="url(#lineGradient)"
                            strokeWidth="4"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />

                        <motion.path
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5, duration: 1 }}
                            d={`M 0 300 L ${currentData.map((d, i) => `${(i * 1000) / (currentData.length - 1)} ${300 - (d.value * 2.5)}`).join(' L ')} L 1000 300 Z`}
                            fill="url(#areaGradient)"
                        />

                        {currentData.map((d, i) => (
                            <circle
                                key={i}
                                cx={(i * 1000) / (currentData.length - 1)}
                                cy={300 - (d.value * 2.5)}
                                r="6"
                                fill="#1e293b"
                                stroke="#f97316"
                                strokeWidth="3"
                            />
                        ))}

                        <defs>
                            <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                                <stop offset="0%" stopColor="#f97316" />
                                <stop offset="100%" stopColor="#38bdf8" />
                            </linearGradient>
                            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#f97316" stopOpacity="0.2" />
                                <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
                            </linearGradient>
                        </defs>
                    </svg>

                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', padding: '0 5px' }}>
                        {currentData.map(d => (
                            <span key={d.label} style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 700, textAlign: 'center', width: '60px' }}>{d.label}</span>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AdminReports;
