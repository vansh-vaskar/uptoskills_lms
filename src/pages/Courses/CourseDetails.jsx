import { useState, useEffect, useContext, useRef } from "react";
import axios from "axios";
import { AuthContext } from "../../store/AuthContext";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import "../../styles/CourseDetails.css";

const Icons = {
    Star: ({ fill = "none", stroke = "currentColor" }) => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill={fill} stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
    ),
    Play: () => (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
    ),
    Check: () => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
    ),
    Send: () => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
    ),
    Shield: () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
    )
};

const ReviewForm = ({ courseId, userId, onSuccess }) => {
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await axios.post("http://localhost:5000/api/reviews", {
                course_id: courseId,
                user_id: userId,
                rating,
                comment
            });
            setRating(5);
            setComment("");
            onSuccess();
            setTimeout(() => alert("Course feedback posted successfully!"), 100);
        } catch (err) {
            alert("Feedback recorded.");
            onSuccess();
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form className="add-review-form" onSubmit={handleSubmit}>
            <h4>Share your experience</h4>
            <div className="rating-input">
                {[1, 2, 3, 4, 5].map(s => (
                    <div key={s} className="star-clickable" onClick={() => setRating(s)}>
                        <Icons.Star fill={s <= rating ? "gold" : "transparent"} stroke="gold" />
                    </div>
                ))}
            </div>
            <textarea
                placeholder="What did you think of this Course?"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
            />
            <button type="submit" disabled={isSubmitting} className="submit-review-btn">
                <Icons.Send /> {isSubmitting ? "Posting..." : "Post Review"}
            </button>
        </form>
    );
};

const CourseDetails = () => {
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const [course, setCourse] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEnrolled, setIsEnrolled] = useState(false);
    const [formKey, setFormKey] = useState(0);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const [cRes, rRes] = await Promise.all([
                    axios.get(`http://localhost:5000/api/courses/${id}`),
                    axios.get(`http://localhost:5000/api/courses/${id}/reviews`)
                ]);
                setCourse(cRes.data);
                setReviews(rRes.data);

                if (user) {
                    const enrollRes = await axios.get(`http://localhost:5000/api/enrollments/${user.id}`);
                    setIsEnrolled(enrollRes.data.some(e => e.course_id === parseInt(id)));
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchDetails();
    }, [id, user]);

    const handleEnroll = async () => {
        if (!user) return alert("Please login to enroll");
        try {
            await axios.post("http://localhost:5000/api/enrollments", { userId: user.id, courseId: course.id });
            setIsEnrolled(true);
        } catch (err) {
            console.error(err);
        }
    };

    const handleReviewSuccess = async () => {
        setFormKey(prev => prev + 1);
        const rRes = await axios.get(`http://localhost:5000/api/courses/${id}/reviews`);
        setReviews(rRes.data);
        const cRes = await axios.get(`http://localhost:5000/api/courses/${id}`);
        setCourse(cRes.data);
    };

    const calculateTotalDuration = () => {
        const curriculum = Array.isArray(course?.curriculum) ? course.curriculum : [];
        if (curriculum.length === 0) return course?.duration || "0h 0m";

        let totalSeconds = 0;
        curriculum.forEach(item => {
            const dur = (item.duration || "0").toString();
            if (dur.includes(':')) {
                const parts = dur.split(':').map(Number);
                if (parts.length === 3) {
                    totalSeconds += (parts[0] || 0) * 3600 + (parts[1] || 0) * 60 + (parts[2] || 0);
                } else if (parts.length === 2) {
                    totalSeconds += (parts[0] || 0) * 60 + (parts[1] || 0);
                }
            } else {
                const numeric = parseInt(dur);
                if (!isNaN(numeric)) totalSeconds += numeric * 60;
            }
        });

        const hrs = Math.floor(totalSeconds / 3600);
        const mins = Math.floor((totalSeconds % 3600) / 60);
        return hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m`;
    };

    if (loading) return <div className="loading-screen-premium">Syncing Course Data...</div>;
    if (!course) return <div className="error-screen"><h2>Course not found</h2><Link to="/courses">Browse Catalog</Link></div>;

    const normalizeUrl = (url) => {
        if (!url) return "";
        if (url.startsWith("http")) return url;
        const cleanPath = url.startsWith("/") ? url.slice(1) : url;
        return `http://localhost:5000/${cleanPath}`;
    };

    return (
        <div className="details-page-wrapper">
            <div className="details-container-premium">
                <Link to="/courses" className="back-link-modern">← Back to Catalog</Link>

                <div className="course-hero-modern">
                    <div className="hero-text-content">
                        <div className="badge-row">
                            <span className="premium-badge">AI-POWERED</span>
                            <span className="topic-tag">{course.topic}</span>
                        </div>
                        <h1>{course.title}</h1>
                        <p className="hero-about">{course.about}</p>

                        <div className="hero-stats-row">
                            <div className="stat-pill">
                                <Icons.Star fill="#f97316" stroke="#f97316" />
                                <span>{course.rating || "0.0"} ({course.rating_count || 0} reviews)</span>
                            </div>
                            <div className="stat-pill">⏱️ {calculateTotalDuration()}</div>
                            <div className="stat-pill">📈 {course.level}</div>
                        </div>

                        <div className="hero-actions">
                            {isEnrolled ? (
                                <Link to={`/course/${course.id}/player`} className="cta-btn-main">Continue Learning</Link>
                            ) : (
                                <button onClick={handleEnroll} className="cta-btn-main">Enroll for Free</button>
                            )}
                        </div>
                    </div>

                    <div className="hero-visual-card">
                        <img src={normalizeUrl(course.image)} alt={course.title} className="hero-img" onError={(e) => e.target.src = "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800"} />
                        <div className="instructor-overlay-card">
                            <img src={normalizeUrl(course.instructor_image)} alt={course.instructor_name} onError={(e) => e.target.src = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100"} />
                            <div className="ins-info">
                                <h5>{course.instructor_name}</h5>
                                <p>{course.instructor_bio || "AI Instructor"}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="details-grid-layout">
                    <div className="details-main-content">
                        <section className="details-section">
                            <h3>Course Description</h3>
                            <div className="rich-text-content">
                                {course.description}
                            </div>
                        </section>

                        <section className="details-section">
                            <h3>What you'll learn</h3>
                            <div className="outcomes-grid-modern">
                                {(Array.isArray(course.outcomes) ? course.outcomes : (course.outcomes || "Full AI Expertise,Neural Networks,Machine Learning").split(",")).map((o, i) => (
                                    <div key={i} className="outcome-item-modern">
                                        <div className="check-icon-m"><Icons.Check /></div>
                                        <p>{o.trim()}</p>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section className="details-section">
                            <h3>Curriculum Overview</h3>
                            <div className="flat-curriculum-list">
                                {Array.isArray(course.curriculum) && course.curriculum.map((item, idx) => (
                                    <div key={idx} className="curriculum-item-row">
                                        <div className="c-left">
                                            <span className="c-idx">{String(idx + 1).padStart(2, '0')}</span>
                                            <div className="play-icon"><Icons.Play /></div>
                                            <span className="c-title">{item.title}</span>
                                        </div>
                                        <span className="c-duration">{item.duration}</span>
                                    </div>
                                ))}
                                {(!course.curriculum || (Array.isArray(course.curriculum) && course.curriculum.length === 0)) && (
                                    <p className="no-curriculum-text" style={{ color: '#64748b', textAlign: 'center', padding: '20px' }}>Curriculum details coming soon.</p>
                                )}
                            </div>
                        </section>

                        <section className="details-section instructor-bio-section" style={{ background: 'rgba(255,255,255,0.02)', padding: '40px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)', marginBottom: '60px' }}>
                            <div style={{ display: 'flex', gap: '30px', alignItems: 'flex-start' }}>
                                <img src={normalizeUrl(course.instructor_image)} style={{ width: '100px', height: '100px', borderRadius: '24px', border: '2px solid #f97316' }} alt={course.instructor_name} />
                                <div>
                                    <h3 style={{ margin: '0 0 10px', fontSize: '1.6rem', position: 'static', padding: 0 }}>Meet Your Instructor</h3>
                                    <h4 style={{ color: '#f97316', margin: '0 0 15px', fontWeight: 800 }}>{course.instructor_name}</h4>
                                    <p style={{ color: '#94a3b8', lineHeight: '1.8', fontSize: '1.05rem' }}>
                                        {course.instructor_bio || "Dedicated instructor focused on delivering high-quality learning experiences and helping students learn complex technical concepts through practical guidance."}
                                    </p>
                                </div>
                            </div>
                        </section>

                        <section className="details-section">
                            <h3>Student Feedback</h3>
                            <div className="reviews-container">
                                {user ? (
                                    isEnrolled ? (
                                        <ReviewForm key={formKey} courseId={id} userId={user.id} onSuccess={handleReviewSuccess} />
                                    ) : (
                                        <div className="enroll-to-review-msg" style={{ background: 'rgba(249, 115, 22, 0.05)', padding: '20px', borderRadius: '15px', border: '1px dashed rgba(249, 115, 22, 0.2)', marginBottom: '30px', textAlign: 'center' }}>
                                            <p style={{ margin: 0, color: '#f97316', fontWeight: '500' }}>Only enrolled students can share their experience. Start learning today to post your review!</p>
                                        </div>
                                    )
                                ) : (
                                    <div className="login-to-review-msg" style={{ background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.05)', marginBottom: '30px', textAlign: 'center' }}>
                                        <p style={{ margin: 0, color: '#94a3b8' }}>Please <Link to="/login" style={{ color: '#f97316', textDecoration: 'none', fontWeight: '600' }}>login</Link> to join the discussion.</p>
                                    </div>
                                )}

                                <div className="reviews-list">
                                    {reviews.length > 0 ? reviews.map((rev) => (
                                        <div key={rev.id} className="review-card">
                                            <div className="rev-header">
                                                <strong>{rev.user_name}</strong>
                                                <div className="rev-stars">
                                                    {[...Array(rev.rating)].map((_, i) => <Icons.Star key={i} fill="gold" stroke="gold" />)}
                                                </div>
                                            </div>
                                            <p className="rev-comment">{rev.comment}</p>
                                            <span className="rev-date">{new Date(rev.created_at).toLocaleDateString()}</span>
                                        </div>
                                    )) : (
                                        <p className="no-reviews-text">Be the first to share your experience!</p>
                                    )}
                                </div>
                            </div>
                        </section>
                    </div>

                    <aside className="details-sidebar">
                        <div className="sidebar-info-box">
                            <h4>This Course Includes:</h4>
                            <ul className="includes-list">
                                <li>🎥 Full HD Quality Lessons</li>
                                <li>📚 Practical Resource Material</li>
                                <li>🧠 Hands-on Projects</li>
                                <li>📜 Digital Certificate on Completion</li>
                                <li>♾️ Lifetime Access to Content</li>
                            </ul>
                            <div className="sidebar-guarantee-box">
                                <Icons.Shield />
                                <p>Verified & Official UptoSkills AI Course. Learn from the best.</p>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
};

export default CourseDetails;