import { useState, useEffect, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../store/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import "../../styles/CoursePlayer.css";

const Icons = {
    Play: ({ size = 14 }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
    ),
    CheckCircle: ({ size = 14, className = "" }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
    ),
    FileText: ({ size = 16 }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
    ),
    Info: ({ size = 16 }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
    ),
    Book: ({ size = 16 }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
    ),
    Download: ({ size = 18 }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
    ),
    ArrowLeft: ({ size = 16 }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
    ),
    ArrowRight: ({ size = 16 }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
    )
};

const CoursePlayer = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeLessonIdx, setActiveLessonIdx] = useState(0);
    const [activeTab, setActiveTab] = useState("overview");
    const [notes, setNotes] = useState("");
    const [enrollmentId, setEnrollmentId] = useState(null);

    useEffect(() => {
        const fetchCourseAndProgress = async () => {
            try {
                const [courseRes, enrollRes] = await Promise.all([
                    axios.get(`http://localhost:5000/api/courses/${id}`),
                    user ? axios.get(`http://localhost:5000/api/enrollments/${user.id}/${id}`) : Promise.resolve({ data: null })
                ]);

                setCourse(courseRes.data);

                if (enrollRes.data) {
                    setEnrollmentId(enrollRes.data.id);
                    setActiveLessonIdx(enrollRes.data.last_video_index || 0);
                }

                const savedNotes = localStorage.getItem(`notes_${id}`);
                if (savedNotes) setNotes(savedNotes);
            } catch (err) {
                console.error("Error fetching data:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchCourseAndProgress();
    }, [id, user]);

    useEffect(() => {
        if (enrollmentId && course) {
            const curriculum = course.curriculum || [];
            const progress = Math.round(((activeLessonIdx + 1) / curriculum.length) * 100);

            axios.put(`http://localhost:5000/api/enrollments/${enrollmentId}/progress`, {
                progress,
                last_video_index: activeLessonIdx
            }).catch(err => console.error("Progress save error:", err));
        }
    }, [activeLessonIdx, enrollmentId, course]);

    const handleNoteChange = (e) => {
        setNotes(e.target.value);
        localStorage.setItem(`notes_${id}`, e.target.value);
    };

    const handleComplete = async () => {
        if (!user) return;
        if (window.confirm("Ready to claim your official Certificate of Completion?")) {
            try {
                await axios.post("http://localhost:5000/api/enrollments/complete", {
                    userId: user.id,
                    courseId: course.id
                });
                alert("Course completed! Your certificate is ready in your dashboard.");
                navigate("/dashboard");
            } catch (err) {
                console.error("Completion error:", err);
            }
        }
    };

    const downloadDummyPDF = () => {
        const link = document.createElement('a');
        link.href = 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf';
        link.download = `${course.title}_Official_Guide.pdf`;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const normalizeUrl = (url) => {
        if (!url) return "";
        if (url.startsWith("http")) return url;
        const cleanPath = url.startsWith("/") ? url.slice(1) : url;
        return `http://localhost:5000/${cleanPath}`;
    };

    if (loading) return <div className="player-loading">Initializing Environment...</div>;
    if (!course) return <div className="error-screen"><h2>Course not found!</h2></div>;

    const curriculum = course.curriculum || [];
    const currentLesson = curriculum[activeLessonIdx] || { title: "Introduction", link: "https://www.youtube.com/embed/aircAruvnKk" };

    return (
        <div className="modern-player-layout">
            <motion.div
                className="player-sidebar-premium"
                initial={{ x: -300 }}
                animate={{ x: 0 }}
            >
                <div className="sidebar-header-player">
                    <Link to={`/course/${course.id}`} className="back-btn-player"><Icons.ArrowLeft /> Exit</Link>
                    <h3>{course.title}</h3>
                    <div className="progress-container-mini">
                        <div className="progress-bar-mini" style={{ width: `${((activeLessonIdx + 1) / curriculum.length) * 100}%` }}></div>
                        <span>{Math.round(((activeLessonIdx + 1) / curriculum.length) * 100)}% Completed</span>
                    </div>
                </div>

                <div className="video-list-container">
                    {curriculum.map((item, idx) => (
                        <div
                            key={idx}
                            className={`lesson-item-flat ${activeLessonIdx === idx ? 'active' : ''}`}
                            onClick={() => setActiveLessonIdx(idx)}
                        >
                            <div className="l-idx-box">
                                {activeLessonIdx > idx ? <Icons.CheckCircle className="done" /> : <span>{idx + 1}</span>}
                            </div>
                            <div className="l-content-box">
                                <span className="l-title">{item.title}</span>
                                <span className="l-dur">{item.duration}</span>
                            </div>
                            <Icons.Play />
                        </div>
                    ))}
                </div>

                <div className="sidebar-footer-player">
                    <button
                        className={`complete-all-btn ${activeLessonIdx !== curriculum.length - 1 ? 'disabled' : ''}`}
                        onClick={handleComplete}
                        disabled={activeLessonIdx !== curriculum.length - 1}
                    >
                        Claim Certificate
                    </button>
                    {activeLessonIdx !== curriculum.length - 1 && (
                        <p className="cert-hint">Complete all lessons to unlock</p>
                    )}
                </div>
            </motion.div>

            <main className="player-content-area">
                <div className="media-header">
                    <div className="lesson-info">
                        <h2>{currentLesson.title}</h2>
                        <p>Part {activeLessonIdx + 1} of {curriculum.length} • {course.instructor_name}</p>
                    </div>
                    <div className="player-nav-controls">
                        <button
                            className="nav-control-btn"
                            disabled={activeLessonIdx === 0}
                            onClick={() => setActiveLessonIdx(activeLessonIdx - 1)}
                        >
                            <Icons.ArrowLeft size={14} /> Previous
                        </button>
                        <button
                            className="nav-control-btn"
                            disabled={activeLessonIdx === curriculum.length - 1}
                            onClick={() => setActiveLessonIdx(activeLessonIdx + 1)}
                        >
                            Next <Icons.ArrowRight size={14} />
                        </button>
                    </div>
                </div>

                <div className="media-viewport">
                    <div className="video-wrapper">
                        <iframe
                            width="100%" height="100%"
                            src={currentLesson.link}
                            title={currentLesson.title}
                            frameBorder="0" allowFullScreen
                        ></iframe>
                    </div>
                </div>

                <div className="player-tabs-bar">
                    <button className={`tab-btn-p ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>
                        <Icons.Info /> Overview
                    </button>
                    <button className={`tab-btn-p ${activeTab === 'notes' ? 'active' : ''}`} onClick={() => setActiveTab('notes')}>
                        <Icons.FileText /> My Notes
                    </button>
                    <button className={`tab-btn-p ${activeTab === 'resources' ? 'active' : ''}`} onClick={() => setActiveTab('resources')}>
                        <Icons.Book /> Resources
                    </button>
                </div>

                <div className="tab-content-area-player">
                    <AnimatePresence mode="wait">
                        {activeTab === 'overview' && (
                            <motion.div
                                key="overview"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="overview-tab"
                            >
                                <h3>About this Session</h3>
                                <p>{course.about}</p>
                                <p>This session is part of the professional certification track for {course.topic}. Learn from your instructor {course.instructor_name} as they share advanced techniques and practical insights.</p>
                                <div className="instructor-mini-bio">
                                    <img src={normalizeUrl(course.instructor_image)} alt={course.instructor_name} />
                                    <div>
                                        <strong>{course.instructor_name}</strong>
                                        <p>{course.instructor_bio}</p>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'notes' && (
                            <motion.div
                                key="notes"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="notes-tab"
                            >
                                <h3>Personal Learning Notes</h3>
                                <p className="notes-hint">Your notes are automatically saved to this device.</p>
                                <textarea
                                    className="player-notes-area"
                                    placeholder="Start typing your insights here..."
                                    value={notes}
                                    onChange={handleNoteChange}
                                />
                            </motion.div>
                        )}

                        {activeTab === 'resources' && (
                            <motion.div
                                key="resources"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="resources-tab"
                            >
                                <h3>Supplemental Resources</h3>
                                <div className="resource-download-card">
                                    <div className="res-icon"><Icons.FileText size={24} /></div>
                                    <div className="res-info">
                                        <h4>{course.title} - Complete Resource Pack</h4>
                                        <p>Includes cheat sheets, code snippets, and session transcripts.</p>
                                    </div>
                                    <button className="res-dl-btn" onClick={downloadDummyPDF}>
                                        <Icons.Download /> Download
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
};

export default CoursePlayer;