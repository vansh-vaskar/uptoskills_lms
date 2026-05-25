import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash, Edit2, Search, X, Award, FileText, Sparkles, Upload, User } from "lucide-react";
import "../../styles/AdminInstructors.css";

const AdminInstructors = () => {
    const [instructors, setInstructors] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentInstructor, setCurrentInstructor] = useState(null);
    const [loading, setLoading] = useState(false);
    
    const [formData, setFormData] = useState({
        name: "",
        bio: "",
        image: null
    });
    const [fileError, setFileError] = useState("");
    const [previewUrl, setPreviewUrl] = useState("");

    useEffect(() => {
        fetchInstructors();
    }, []);

    const fetchInstructors = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/instructors");
            setInstructors(res.data);
        } catch (err) {
            console.error("Error fetching instructors:", err);
            toast.error("Failed to load instructors.");
        }
    };

    const normalizeUrl = (url) => {
        if (!url) return "https://images.unsplash.com/photo-1534528741775-53994a69daeb";
        if (url.startsWith("http")) return url;
        const cleanPath = url.startsWith("/") ? url.slice(1) : url;
        return `http://localhost:5000/${cleanPath}`;
    };

    const handleOpenModal = (instructor = null) => {
        setFileError("");
        if (instructor) {
            setCurrentInstructor(instructor);
            setFormData({
                name: instructor.name || "",
                bio: instructor.bio || "",
                image: instructor.image || ""
            });
            setPreviewUrl(normalizeUrl(instructor.image));
        } else {
            setCurrentInstructor(null);
            setFormData({
                name: "",
                bio: "",
                image: null
            });
            setPreviewUrl("");
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setCurrentInstructor(null);
        setPreviewUrl("");
        setFileError("");
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setFileError("");
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            setFileError("File exceeds the 5MB size limit.");
            return;
        }

        const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
        if (!allowedTypes.includes(file.type)) {
            setFileError("Unsupported format. Please upload a JPG, PNG, or WebP image.");
            return;
        }

        setFormData({ ...formData, image: file });
        
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreviewUrl(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (fileError) {
            toast.error("Please fix form errors first.");
            return;
        }

        setLoading(true);
        try {
            const data = new FormData();
            data.append("name", formData.name);
            data.append("bio", formData.bio);

            if (formData.image instanceof File) {
                data.append("image", formData.image);
            } else if (typeof formData.image === "string") {
                data.append("image", formData.image);
            }

            const config = {
                headers: { "Content-Type": "multipart/form-data" }
            };

            if (currentInstructor) {
                await axios.put(`http://localhost:5000/api/instructors/${currentInstructor.id}`, data, config);
                toast.success("Instructor details updated successfully!");
            } else {
                await axios.post("http://localhost:5000/api/instructors", data, config);
                toast.success("New celebrity instructor added successfully!");
            }

            fetchInstructors();
            closeModal();
        } catch (err) {
            console.error("Error saving instructor:", err);
            toast.error(err.response?.data?.error || "Error saving instructor data.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this instructor? Any student currently linked to this celebrity will fall back to default settings.")) return;
        
        try {
            await axios.delete(`http://localhost:5000/api/instructors/${id}`);
            toast.success("Instructor removed successfully.");
            fetchInstructors();
        } catch (err) {
            console.error("Error deleting instructor:", err);
            toast.error("Failed to delete instructor.");
        }
    };

    const filteredInstructors = instructors.filter(i =>
        i.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (i.bio && i.bio.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <div className="admin-instructors-page">
            <header className="page-header">
                <div className="header-text">
                    <h2>Celebrity Instructors</h2>
                    <p>Manage the global stars who instruct the platform's customized student curriculum.</p>
                </div>
                <button className="add-instructor-btn" onClick={() => handleOpenModal()}>
                    <Plus size={20} /> Add Instructor
                </button>
            </header>

            <div className="table-actions-bar">
                <div className="table-search">
                    <Search size={18} color="#64748b" />
                    <input
                        type="text"
                        placeholder="Search instructors by name or specialty..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <div className="instructors-grid">
                <AnimatePresence>
                    {filteredInstructors.map((inst, index) => (
                        <motion.div
                            key={inst.id}
                            className="instructor-card-premium"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -30 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                        >
                            <div className="card-image-wrapper">
                                <img
                                    src={normalizeUrl(inst.image)}
                                    alt={inst.name}
                                    onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200"; }}
                                />
                                <div className="card-actions-overlay">
                                    <button className="overlay-btn edit" onClick={() => handleOpenModal(inst)} title="Edit Details">
                                        <Edit2 size={16} />
                                    </button>
                                    <button className="overlay-btn delete" onClick={() => handleDelete(inst.id)} title="Delete Instructor">
                                        <Trash size={16} />
                                    </button>
                                </div>
                                <div className="instructor-card-badge">
                                    <Award size={12} /> Star Faculty
                                </div>
                            </div>
                            
                            <div className="card-info">
                                <h3 className="inst-name">{inst.name}</h3>
                                <p className="inst-bio">{inst.bio || "No professional biography added yet."}</p>
                            </div>
                        </motion.div>
                    ))}
                    {filteredInstructors.length === 0 && (
                        <div className="empty-state-wrapper">
                            <Sparkles size={48} className="empty-icon" />
                            <h3>No Instructors Found</h3>
                            <p>Try searching for a different celebrity or click "Add Instructor" to create one.</p>
                        </div>
                    )}
                </AnimatePresence>
            </div>

            <AnimatePresence>
                {isModalOpen && (
                    <motion.div
                        className="admin-modal-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="admin-modal-card-scrollable instructor-modal-card"
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                        >
                            <div className="modal-header-sticky">
                                <h2>{currentInstructor ? "Edit Instructor" : "Add Celebrity Faculty"}</h2>
                                <button className="close-modal-btn" onClick={closeModal}><X size={20} /></button>
                            </div>

                            <form onSubmit={handleSubmit} className="admin-modal-form-grid">
                                <div className="modal-section">
                                    <div className="modal-section-title"><User size={18} /> Identity & Credentials</div>
                                    <div className="form-group">
                                        <label>Celebrity Name <span className="required-asterisk">*</span></label>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            required
                                            placeholder="e.g. Sam Altman, Taylor Swift"
                                        />
                                    </div>
                                    <div className="form-group" style={{ marginTop: "20px" }}>
                                        <label>Biography <span className="required-asterisk">*</span></label>
                                        <textarea
                                            rows="4"
                                            value={formData.bio}
                                            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                            required
                                            placeholder="Introduce the celebrity's background, achievements, and unique instructional perspective..."
                                        />
                                    </div>
                                </div>

                                <div className="modal-section">
                                    <div className="modal-section-title"><Upload size={18} /> Media & Avatar Upload</div>
                                    <div className="upload-container-row">
                                        <div className="form-group upload-controls-box">
                                            <label>Instructor Photo</label>
                                            <div className="path-picker-wrapper">
                                                <input
                                                    type="file"
                                                    accept="image/png, image/jpeg, image/webp"
                                                    onChange={handleFileChange}
                                                />
                                            </div>
                                            <span className="file-limits-tip">Supported: JPG, PNG, WebP (Max 5MB)</span>
                                            {fileError && <span className="validation-error-msg">{fileError}</span>}
                                        </div>

                                        {previewUrl && (
                                            <div className="image-preview-panel">
                                                <div className="avatar-preview-circle">
                                                    <img src={previewUrl} alt="Instructor preview" />
                                                </div>
                                                <span className="preview-lbl">Photo Preview</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="modal-footer-sticky">
                                    <button type="button" className="modal-discard-btn" onClick={closeModal}>Cancel</button>
                                    <button type="submit" className="modal-submit-btn" disabled={loading || !!fileError}>
                                        {loading ? <><span className="spinner-inline"></span> Processing...</> : (currentInstructor ? "Save Changes" : "Create Instructor")}
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

export default AdminInstructors;
