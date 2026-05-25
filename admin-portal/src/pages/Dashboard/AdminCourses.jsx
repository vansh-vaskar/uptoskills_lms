import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash, Edit2, Search, ExternalLink, X, BookOpen, Layout, Video, User, Star, List, Info, FileText } from "lucide-react";
import "../../styles/AdminCourses.css";

const AdminCourses = () => {
    const [courses, setCourses] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentCourse, setCurrentCourse] = useState(null);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: "", topic: "Artificial Intelligence", level: "Beginner",
        image: "", about: "", description: "",
        instructor_name: "", instructor_bio: "", instructor_image: "",
        outcomes: "", requirements: "",
        curriculum: []
    });

    const topics = [
        "Artificial Intelligence", "Data Science", "Web Development",
        "Creative Design", "Engineering", "Business & Growth", "Cloud Computing"
    ];

    const location = useLocation();

    useEffect(() => {
        fetchCourses();
        if (location.state?.openModal) {
            handleOpenModal();
            window.history.replaceState({}, document.title);
        }
    }, [location.state]);

    const fetchCourses = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/courses");
            setCourses(res.data);
        } catch (err) {
            console.error("Error fetching courses:", err);
        }
    };

    const normalizeUrl = (url) => {
        if (!url) return "https://images.unsplash.com/photo-1620712943543-bcc4628c9757";
        if (url.startsWith("http")) return url;
        const cleanPath = url.startsWith("/") ? url.slice(1) : url;
        return `http://localhost:5000/${cleanPath}`;
    };

    const handleOpenModal = (course = null) => {
        if (course) {
            setCurrentCourse(course);
            setFormData({
                ...course,
                outcomes: Array.isArray(course.outcomes) ? course.outcomes.join(", ") : (course.outcomes || ""),
                requirements: Array.isArray(course.requirements) ? course.requirements.join(", ") : (course.requirements || ""),
                curriculum: course.curriculum ? (typeof course.curriculum === 'string' ? JSON.parse(course.curriculum) : course.curriculum) : []
            });
        } else {
            setCurrentCourse(null);
            setFormData({
                title: "", topic: "Artificial Intelligence", level: "Beginner",
                image: "", about: "", description: "",
                instructor_name: "", instructor_bio: "", instructor_image: "",
                outcomes: "", requirements: "",
                curriculum: []
            });
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setCurrentCourse(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const data = new FormData();
            data.append("title", formData.title);
            data.append("topic", formData.topic);
            data.append("level", formData.level);
            data.append("about", formData.about);
            data.append("description", formData.description);
            data.append("instructor_name", formData.instructor_name);
            data.append("instructor_bio", formData.instructor_bio);
            
            if (formData.image instanceof File) {
                data.append("image", formData.image);
            } else {
                data.append("image", formData.image || "");
            }

            if (formData.instructor_image instanceof File) {
                data.append("instructor_image", formData.instructor_image);
            } else {
                data.append("instructor_image", formData.instructor_image || "");
            }

            data.append("outcomes", JSON.stringify(formData.outcomes.split(",").map(s => s.trim()).filter(s => s)));
            data.append("requirements", JSON.stringify(formData.requirements.split(",").map(s => s.trim()).filter(s => s)));
            data.append("curriculum", JSON.stringify(formData.curriculum));

            const config = { headers: { 'Content-Type': 'multipart/form-data' } };

            if (currentCourse) {
                await axios.put(`http://localhost:5000/api/courses/${currentCourse.id}`, data, config);
            } else {
                await axios.post("http://localhost:5000/api/courses", data, config);
            }
            fetchCourses();
            closeModal();
            toast.success(`Course ${currentCourse ? "updated" : "added"} successfully!`);
        } catch (err) {
            console.error("Error saving course:", err);
            toast.error("Error saving course data.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this course?")) return;
        try {
            await axios.delete(`http://localhost:5000/api/courses/${id}`);
            fetchCourses();
        } catch (err) {
            console.error("Error deleting course:", err);
        }
    };

    const filteredCourses = courses.filter(c =>
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.topic.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="admin-courses-page">
            <header className="page-header">
                <div className="header-text">
                    <h2>Course Management</h2>
                    <p>Comprehensive management of all learning assets and instructor profiles.</p>
                </div>
                <button className="add-course-btn" onClick={() => handleOpenModal()}>
                    <Plus size={20} /> Add Course
                </button>
            </header>

            <div className="table-actions-bar">
                <div className="table-search">
                    <Search size={18} color="#64748b" />
                    <input
                        type="text"
                        placeholder="Search courses..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <div className="admin-table-wrapper">
                <table className="admin-data-table">
                    <thead>
                        <tr>
                            <th>Course Info</th>
                            <th>Topic</th>
                            <th>Stats</th>
                            <th>Learners</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredCourses.map(course => (
                            <tr key={course.id}>
                                <td>
                                    <div className="table-course-info">
                                        <div className="course-thumb-container">
                                            <img src={normalizeUrl(course.image)} alt={course.title} onError={(e) => e.target.src = "https://images.unsplash.com/photo-1620712943543-bcc4628c9757?w=100"} />
                                        </div>
                                        <div className="t-info">
                                            <p className="t-title">{course.title}</p>
                                            <p className="t-sub">{course.level} Level</p>
                                        </div>
                                    </div>
                                </td>
                                <td><span className="topic-badge">{course.topic}</span></td>
                                <td>
                                    <div className="rating-pill">
                                        <Star size={12} fill="var(--color-primary)" stroke="none" /> {course.rating || "0.0"} ({course.rating_count || 0})
                                    </div>
                                </td>
                                <td><span className="enrollment-count">{course.enrollments || 0}</span></td>
                                <td>
                                    <div className="table-actions">
                                        <button className="action-btn edit" onClick={() => handleOpenModal(course)} title="Edit"><Edit2 size={16} /></button>
                                        <button className="action-btn delete" onClick={() => handleDelete(course.id)} title="Delete"><Trash size={16} /></button>
                                        <a href={`http://localhost:5173/course/${course.id}`} target="_blank" rel="noreferrer" className="action-btn view" title="View Public"><ExternalLink size={16} /></a>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <AnimatePresence>
                {isModalOpen && (
                    <motion.div className="admin-modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <motion.div className="admin-modal-card-scrollable">
                            <div className="modal-header-sticky">
                                <h2>{currentCourse ? "Edit Course" : "Add New Course"}</h2>
                                <button className="close-modal-btn" onClick={closeModal}><X size={20} /></button>
                            </div>

                            <form onSubmit={handleSubmit} className="admin-modal-form-grid">
                                <div className="modal-section">
                                    <div className="modal-section-title"><Info size={18} /> Core Specifications</div>
                                    <div className="form-grid-2">
                                        <div className="form-group">
                                            <label>Course Title <span className="required-asterisk">*</span></label>
                                            <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required placeholder="e.g. Generative AI Architecture" />
                                        </div>
                                        <div className="form-group">
                                            <label>Industry Category <span className="required-asterisk">*</span></label>
                                            <select value={formData.topic} onChange={(e) => setFormData({ ...formData, topic: e.target.value })}>
                                                {topics.map(t => <option key={t} value={t}>{t}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="form-grid-2" style={{ marginTop: '20px' }}>
                                        <div className="form-group">
                                            <label>Difficulty Level <span className="required-asterisk">*</span></label>
                                            <select value={formData.level} onChange={(e) => setFormData({ ...formData, level: e.target.value })}>
                                                <option value="Beginner">Beginner</option>
                                                <option value="Intermediate">Intermediate</option>
                                                <option value="Advanced">Advanced</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div className="modal-section">
                                    <div className="modal-section-title"><Layout size={18} /> Asset Management</div>
                                    <div className="form-group">
                                        <label>About</label>
                                        <textarea rows="2" value={formData.about} onChange={(e) => setFormData({ ...formData, about: e.target.value })} placeholder="Catchy hook for the student portal..." />
                                    </div>
                                    <div className="form-group" style={{ marginTop: '20px' }}>
                                        <label>Full Description <span className="required-asterisk">*</span></label>
                                        <textarea rows="4" value={formData.description} required onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Comprehensive breakdown of the course..." />
                                    </div>
                                    <div className="form-group" style={{ marginTop: '20px' }}>
                                        <label>Cover Image</label>
                                        <div className="path-picker-wrapper">
                                            <input type="file" accept="image/png, image/jpeg, image/webp" onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })} />
                                        </div>
                                        <span className="inline-error" style={{ color: '#94a3b8', marginTop: '4px' }}>Max 5MB (JPG, PNG, WebP)</span>
                                        {currentCourse && typeof formData.image === 'string' && <span style={{display: 'block', fontSize: '0.8rem', color: 'var(--color-primary)', marginTop: '4px'}}>Current: {formData.image}</span>}
                                    </div>
                                </div>



                                <div className="modal-section">
                                    <div className="modal-section-title"><List size={18} /> Educational Framework</div>
                                    <div className="form-group">
                                        <label>Key Outcomes (Comma Separated)</label>
                                        <textarea rows="2" value={formData.outcomes} onChange={(e) => setFormData({ ...formData, outcomes: e.target.value })} placeholder="Expertise in LLMs, Neural Networks, Cloud Ops..." />
                                    </div>
                                    <div className="form-group" style={{ marginTop: '20px' }}>
                                        <label>Prerequisites (Comma Separated)</label>
                                        <textarea rows="2" value={formData.requirements} onChange={(e) => setFormData({ ...formData, requirements: e.target.value })} placeholder="Python Basics, Linear Algebra..." />
                                    </div>
                                </div>

                                

                                <div className="modal-section">
                                    <div className="modal-section-title"><Video size={18} /> Curriculum Architecture</div>
                                    <div className="curriculum-editor">
                                        {formData.curriculum.map((item, idx) => (
                                            <div key={idx} className="curriculum-edit-row">
                                                <input type="text" placeholder="Video Title" required value={item.title} onChange={(e) => {
                                                    const newCurr = [...formData.curriculum];
                                                    newCurr[idx].title = e.target.value;
                                                    setFormData({ ...formData, curriculum: newCurr });
                                                }} />
                                                <input type="text" placeholder="Video Link / Path" required value={item.link || ""} onChange={(e) => {
                                                    const newCurr = [...formData.curriculum];
                                                    newCurr[idx].link = e.target.value;
                                                    setFormData({ ...formData, curriculum: newCurr });
                                                }} />
                                                <input type="text" placeholder="Duration (MM:SS)" required pattern="^([0-9]{1,2}:)?[0-5][0-9]:[0-5][0-9]$" title="Format: MM:SS or HH:MM:SS" value={item.duration} onChange={(e) => {
                                                    const newCurr = [...formData.curriculum];
                                                    newCurr[idx].duration = e.target.value;
                                                    setFormData({ ...formData, curriculum: newCurr });
                                                }} />
                                                <button type="button" className="row-delete" onClick={() => {
                                                    const newCurr = formData.curriculum.filter((_, i) => i !== idx);
                                                    setFormData({ ...formData, curriculum: newCurr });
                                                }}><Trash size={16} /></button>
                                            </div>
                                        ))}
                                        <button type="button" className="add-video-row-btn" onClick={() => setFormData({ ...formData, curriculum: [...formData.curriculum, { title: "", duration: "", link: "", type: "Video" }] })}>
                                            <Plus size={18} /> Add Course Module
                                        </button>
                                    </div>
                                </div>

                                <div className="modal-footer-sticky">
                                    <button type="button" className="modal-discard-btn" onClick={closeModal}>Cancel</button>
                                    <button type="submit" className="modal-submit-btn" disabled={loading}>
                                        {loading ? <><span className="spinner-inline"></span> Processing...</> : (currentCourse ? "Update Course" : "Add Course")}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminCourses;
