import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X as XIcon } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import "../../styles/AdminStudents.css";

const Icons = {
    Search: () => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
    ),
    Mail: () => (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
    ),
    UserMinus: () => (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><line x1="23" y1="11" x2="17" y2="11"></line></svg>
    ),
    CheckCircle: () => (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
    ),
    UserPlus: () => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><line x1="19" y1="8" x2="19" y2="14"></line><line x1="22" y1="11" x2="16" y2="11"></line></svg>
    )
};

const AdminStudents = () => {
    const location = useLocation();
    const [students, setStudents] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ full_name: '', email: '', password: '' });
    const [isLoading, setIsLoading] = useState(false);

    const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const isEmailTouched = formData.email.length > 0;

    const getPasswordStrength = (pass) => {
        let strength = 0;
        if (pass.length >= 8) strength++;
        if (/\d/.test(pass)) strength++;
        if (/[!@#$%^&*(),.?":{}|<>]/.test(pass)) strength++;
        return strength;
    };

    const passStrength = getPasswordStrength(formData.password);
    const passTouched = formData.password.length > 0;

    useEffect(() => {
        fetchStudents();
        if (location.state?.openModal) {
            setIsModalOpen(true);
            window.history.replaceState({}, document.title);
        }
    }, [location.state]);

    const fetchStudents = async () => {
        const res = await axios.get("http://localhost:5000/api/admin/users");
        setStudents(res.data.filter(u => u.role === 'student'));
    };

    const handleSuspend = async (id, name) => {
        if (!window.confirm(`Are you sure you want to suspend/delete ${name}'s account? This will permanently remove them from the system.`)) return;
        try {
            await axios.delete(`http://localhost:5000/api/admin/users/${id}`);
            setStudents(students.filter(s => s.id !== id));
            toast.success(`${name}'s account has been suspended/deleted.`);
        } catch (err) {
            toast.error("Error suspending user");
        }
    };

    const handleApprove = async (id, name) => {
        if (!window.confirm(`Approve ${name}'s account so they can access the platform?`)) return;
        try {
            await axios.put(`http://localhost:5000/api/admin/users/${id}/approve`);
            setStudents(students.map(s => s.id === id ? { ...s, approved: true } : s));
            toast.success(`${name}'s account has been approved!`);
        } catch (err) {
            toast.error("Error approving user");
        }
    };

    const handleCreateStudent = async (e) => {
        e.preventDefault();

        if (!isValidEmail(formData.email)) {
            toast.error("Please enter a valid email address.");
            return;
        }

        if (passStrength < 2) {
            toast.error("Password is too weak. Please meet more requirements.");
            return;
        }

        setIsLoading(true);

        try {
            const res = await axios.post("http://localhost:5000/api/admin/users", formData);
            setStudents([res.data, ...students]);
            setIsModalOpen(false);
            setFormData({ full_name: '', email: '', password: '' });
            toast.success("Student account created successfully!");
        } catch (err) {
            toast.error(err.response?.data?.error || "Error creating student");
        } finally {
            setIsLoading(false);
        }
    };

    const filteredStudents = students.filter(s =>
        s.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="admin-students-page">
            <header className="page-header">
                <div className="header-text">
                    <h2>Student Management</h2>
                    <p>Monitor student activity and account status.</p>
                </div>
            </header>

            <div className="table-actions-bar">
                <div className="table-search">
                    <Icons.Search />
                    <input
                        type="text"
                        placeholder="Search students by name or email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <button className="add-btn" onClick={() => setIsModalOpen(true)}>
                    <Icons.UserPlus /> Add New Student
                </button>
            </div>

            <div className="admin-table-wrapper">
                <table className="admin-data-table">
                    <thead>
                        <tr>
                            <th>Student</th>
                            <th>Email</th>
                            <th>Status</th>
                            <th>Role</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredStudents.map((student) => (
                            <tr key={student.id}>
                                <td>
                                    <div className="table-user-info">
                                        <div className="user-avatar-small">{student.full_name?.charAt(0)}</div>
                                        <span>{student.full_name}</span>
                                    </div>
                                </td>
                                <td>{student.email}</td>
                                <td>
                                    {student.approved ? (
                                        <span className="status-badge active">Active</span>
                                    ) : (
                                        <span className="status-badge" style={{ background: 'var(--color-warning)', color: '#0f172a' }}>Pending Approval</span>
                                    )}
                                </td>
                                <td><span className="role-tag student">Student</span></td>
                                <td>
                                    <div className="table-actions">
                                        {!student.approved && (
                                            <button
                                                className="action-btn"
                                                title={`Approve ${student.full_name}`}
                                                onClick={() => handleApprove(student.id, student.full_name)}
                                                style={{ color: 'var(--color-success)' }}
                                            >
                                                <Icons.CheckCircle />
                                            </button>
                                        )}
                                        <button
                                            className="action-btn"
                                            title={`Email ${student.full_name}`}
                                            onClick={() => window.location.href = `mailto:${student.email}`}
                                        >
                                            <Icons.Mail />
                                        </button>
                                        <button
                                            className="action-btn suspend"
                                            title={`Suspend ${student.full_name}`}
                                            onClick={() => handleSuspend(student.id, student.full_name)}
                                        >
                                            <Icons.UserMinus />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <AnimatePresence>
                {isModalOpen && (
                    <motion.div
                        className="modal-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <motion.div
                            className="modal-content"
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{ duration: 0.2 }}
                        >
                            <h3>Add New Student</h3>
                            <form onSubmit={handleCreateStudent}>
                                <div className="form-group">
                                    <label>Full Name <span className="required-asterisk">*</span></label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.full_name}
                                        onChange={e => setFormData({ ...formData, full_name: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Email Address <span className="required-asterisk">*</span></label>
                                    <input
                                        type="email"
                                        className={isEmailTouched ? (isValidEmail(formData.email) ? "input-valid" : "input-invalid") : ""}
                                        required
                                        value={formData.email}
                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    />
                                    {isEmailTouched && !isValidEmail(formData.email) && <span className="inline-error">Please enter a valid email format.</span>}
                                </div>
                                <div className="form-group">
                                    <label>Temporary Password <span className="required-asterisk">*</span></label>
                                    <input
                                        type="password"
                                        required
                                        value={formData.password}
                                        onChange={e => setFormData({ ...formData, password: e.target.value })}
                                    />
                                    {passTouched && (
                                        <div className="password-meter-container">
                                            <div className="strength-bar-bg">
                                                <div className={`strength-bar-fill ${passStrength === 1 ? 'strength-weak' : passStrength === 2 ? 'strength-medium' : passStrength === 3 ? 'strength-strong' : ''}`}></div>
                                            </div>
                                            <ul className="password-requirements">
                                                <li className={formData.password.length >= 8 ? 'req-met' : 'req-unmet'}>
                                                    {formData.password.length >= 8 ? <Check size={12} /> : <XIcon size={12} />} At least 8 characters
                                                </li>
                                                <li className={/\d/.test(formData.password) ? 'req-met' : 'req-unmet'}>
                                                    {/\d/.test(formData.password) ? <Check size={12} /> : <XIcon size={12} />} Contains a number
                                                </li>
                                                <li className={/[!@#$%^&*(),.?":{}|<>]/.test(formData.password) ? 'req-met' : 'req-unmet'}>
                                                    {/[!@#$%^&*(),.?":{}|<>]/.test(formData.password) ? <Check size={12} /> : <XIcon size={12} />} Contains a special char
                                                </li>
                                            </ul>
                                        </div>
                                    )}
                                </div>
                                <div className="modal-actions">
                                    <button type="button" className="cancel-btn" onClick={() => setIsModalOpen(false)}>Cancel</button>
                                    <button type="submit" className="add-btn" disabled={isLoading}>
                                        {isLoading ? <><span className="spinner-inline"></span> Creating...</> : "Create Student"}
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

export default AdminStudents;
