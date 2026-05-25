import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { Star, User, Trash2 } from "lucide-react";

const AdminReviews = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchAllReviews = async () => {
        setLoading(true);
        try {
            const res = await axios.get("http://localhost:5000/api/admin/reviews");
            setReviews(res.data);
        } catch (err) {
            console.error("Error fetching all reviews:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllReviews();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to permanently delete this review? This action cannot be undone.")) return;
        try {
            await axios.delete(`http://localhost:5000/api/admin/reviews/${id}`);
            setReviews(reviews.filter(r => r.id !== id));
            toast.success("Review deleted successfully!");
        } catch (err) {
            toast.error("Error deleting review");
        }
    };

    return (
        <div className="admin-reviews-page">
            <header className="page-header">
                <div className="header-text">
                    <h2>Student Feedback</h2>
                    <p>Monitor and manage all course reviews across the platform.</p>
                </div>
            </header>

            <div className="reviews-management-grid" style={{ display: 'grid', gap: '20px' }}>
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '50px', color: '#64748b' }}>Aggregating feedback data...</div>
                ) : reviews.length === 0 ? (
                    <div className="empty-state-v">No reviews posted yet.</div>
                ) : reviews.map((rev) => (
                    <motion.div
                        key={rev.id}
                        className="admin-review-card-premium"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{ background: 'var(--color-surface)', padding: '25px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)', display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: '25px', alignItems: 'start' }}
                    >
                        <div style={{ width: '50px', height: '50px', background: 'rgba(249, 115, 22, 0.1)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)' }}>
                            <User size={24} />
                        </div>

                        <div className="rev-main-info">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                                <h4 style={{ margin: 0, fontSize: '1.1rem' }}>{rev.user_name}</h4>
                                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>on {rev.course_title}</span>
                            </div>
                            <div style={{ display: 'flex', gap: '4px', marginBottom: '12px' }}>
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={14} fill={i < rev.rating ? "#facc15" : "transparent"} stroke={i < rev.rating ? "#facc15" : "#475569"} />
                                ))}
                            </div>
                            <p style={{ color: '#cbd5e1', fontSize: '0.95rem', lineHeight: '1.6', margin: 0, fontStyle: 'italic' }}>"{rev.comment}"</p>
                        </div>

                        <div className="rev-actions">
                            <button 
                                onClick={() => handleDelete(rev.id)}
                                style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: 'var(--color-error)', padding: '10px', borderRadius: '12px', cursor: 'pointer', transition: 'all 0.2s' }}
                                onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--color-error)'; e.currentTarget.style.color = 'white'; }}
                                onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'; e.currentTarget.style.color = 'var(--color-error)'; }}
                                title="Delete Review"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default AdminReviews;
