import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Edit2, Search, X, CheckCircle, Clock, AlertCircle } from "lucide-react";
import "../../styles/AdminStudents.css";

const AdminTasks = () => {
    const [tasks, setTasks] = useState([]);
    const [users, setUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentTask, setCurrentTask] = useState(null);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        assigned_to: "",
        due_date: "",
        status: "pending"
    });

    useEffect(() => {
        fetchTasks();
        fetchUsers();
    }, []);

    const fetchTasks = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/admin/tasks");
            setTasks(res.data);
        } catch (err) {
            console.error("Error fetching tasks:", err);
        }
    };

    const fetchUsers = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/admin/users");
            setUsers(res.data.filter(u => u.role !== 'admin'));
        } catch (err) {
            console.error("Error fetching users:", err);
        }
    };

    const handleOpenModal = (task = null) => {
        if (task) {
            setCurrentTask(task);
            setFormData({
                title: task.title,
                description: task.description || "",
                assigned_to: task.assigned_to || "",
                due_date: task.due_date ? new Date(task.due_date).toISOString().split('T')[0] : "",
                status: task.status || "pending"
            });
        } else {
            setCurrentTask(null);
            setFormData({
                title: "",
                description: "",
                assigned_to: "",
                due_date: "",
                status: "pending"
            });
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setCurrentTask(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = { ...formData };
            if (!payload.assigned_to) payload.assigned_to = null;

            if (currentTask) {
                await axios.put(`http://localhost:5000/api/admin/tasks/${currentTask.id}`, payload);
                toast.success("Task updated successfully!");
            } else {
                await axios.post("http://localhost:5000/api/admin/tasks", payload);
                toast.success("Task created successfully!");
            }
            fetchTasks();
            closeModal();
        } catch (err) {
            console.error("Error saving task:", err);
            toast.error("Error saving task.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this task?")) return;
        try {
            await axios.delete(`http://localhost:5000/api/admin/tasks/${id}`);
            toast.success("Task deleted successfully!");
            fetchTasks();
        } catch (err) {
            console.error("Error deleting task:", err);
            toast.error("Error deleting task.");
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'completed': return <span className="status-badge active" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><CheckCircle size={12} /> Completed</span>;
            case 'in_progress': return <span className="status-badge" style={{ background: 'rgba(56, 189, 248, 0.1)', color: 'var(--color-info)', display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={12} /> In Progress</span>;
            default: return <span className="status-badge" style={{ background: 'rgba(249, 115, 22, 0.1)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '4px' }}><AlertCircle size={12} /> Pending</span>;
        }
    };

    const filteredTasks = tasks.filter(t =>
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (t.assigned_to_name && t.assigned_to_name.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <div className="admin-students-page">
            <header className="page-header">
                <div className="header-text">
                    <h2>Student Task Assignment</h2>
                    <p>Assign, track, and manage student responsibilities and deadlines.</p>
                </div>
                <button
                    style={{ background: 'var(--color-primary)', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '12px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
                    onClick={() => handleOpenModal()}
                >
                    <Plus size={18} /> Create Task
                </button>
            </header>

            <div className="table-actions-bar">
                <div className="table-search">
                    <Search size={18} color="#64748b" />
                    <input
                        type="text"
                        placeholder="Search tasks by title or assignee..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <div className="admin-table-wrapper">
                <table className="admin-data-table">
                    <thead>
                        <tr>
                            <th>Task Details</th>
                            <th>Assignee</th>
                            <th>Due Date</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredTasks.length === 0 ? (
                            <tr><td colSpan="5" style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>No tasks found. Create one to get started.</td></tr>
                        ) : filteredTasks.map(task => (
                            <tr key={task.id}>
                                <td>
                                    <div style={{ padding: '8px 0' }}>
                                        <p style={{ margin: '0 0 4px', fontWeight: 700, color: 'white' }}>{task.title}</p>
                                        <p style={{ margin: 0, fontSize: '0.8rem', color: '#94a3b8', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{task.description || "No description provided."}</p>
                                        {task.submission_link && (
                                            <div style={{ marginTop: '8px', fontSize: '0.85rem' }}>
                                                <span style={{ color: 'var(--color-success)', fontWeight: 600 }}>Submission: </span>
                                                <a href={task.submission_link} target="_blank" rel="noreferrer" style={{ color: 'var(--color-info)', textDecoration: 'none' }}>View Link</a>
                                            </div>
                                        )}
                                    </div>
                                </td>
                                <td>
                                    {task.assigned_to_name ? (
                                        <div className="table-user-info">
                                            <div className="user-avatar-small">{task.assigned_to_name.charAt(0)}</div>
                                            <div>
                                                <span style={{ display: 'block', fontSize: '0.9rem', color: '#e2e8f0' }}>{task.assigned_to_name}</span>
                                            </div>
                                        </div>
                                    ) : (
                                        <span style={{ color: '#64748b', fontSize: '0.9rem', fontStyle: 'italic' }}>Unassigned</span>
                                    )}
                                </td>
                                <td>
                                    <span style={{ color: '#cbd5e1', fontSize: '0.9rem' }}>
                                        {task.due_date ? new Date(task.due_date).toLocaleDateString() : "No deadline"}
                                    </span>
                                </td>
                                <td>{getStatusBadge(task.status)}</td>
                                <td>
                                    <div className="table-actions">
                                        <button className="action-btn" onClick={() => handleOpenModal(task)} title="Edit Task">
                                            <Edit2 size={16} />
                                        </button>
                                        <button className="action-btn suspend" onClick={() => handleDelete(task.id)} title="Delete Task">
                                            <Trash2 size={16} />
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
                    <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.8)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            style={{ background: 'var(--color-surface)', width: '100%', maxWidth: '500px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.1)', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }}
                        >
                            <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h3 style={{ margin: 0, color: 'white', fontSize: '1.2rem' }}>{currentTask ? "Edit Task" : "Create New Task"}</h3>
                                <button onClick={closeModal} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}><X size={20} /></button>
                            </div>

                            <form onSubmit={handleSubmit} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.85rem', color: '#94a3b8', marginBottom: '8px', fontWeight: 600 }}>Task Title</label>
                                    <input type="text" required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', padding: '12px', borderRadius: '12px', color: 'white', fontSize: '0.95rem' }} placeholder="e.g. Develop new UI components" />
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontSize: '0.85rem', color: '#94a3b8', marginBottom: '8px', fontWeight: 600 }}>Description</label>
                                    <textarea rows="3" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', padding: '12px', borderRadius: '12px', color: 'white', fontSize: '0.95rem', resize: 'vertical' }} placeholder="Provide task details and expectations..." />
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.85rem', color: '#94a3b8', marginBottom: '8px', fontWeight: 600 }}>Assign To</label>
                                        <select value={formData.assigned_to} onChange={(e) => setFormData({ ...formData, assigned_to: e.target.value })} style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', padding: '12px', borderRadius: '12px', color: 'white', fontSize: '0.95rem' }}>
                                            <option value="" style={{ background: 'var(--color-surface)' }}>Unassigned</option>
                                            {users.map(u => (
                                                <option key={u.id} value={u.id} style={{ background: 'var(--color-surface)' }}>{u.full_name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.85rem', color: '#94a3b8', marginBottom: '8px', fontWeight: 600 }}>Due Date</label>
                                        <input type="date" value={formData.due_date} onChange={(e) => setFormData({ ...formData, due_date: e.target.value })} style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', padding: '12px', borderRadius: '12px', color: 'white', fontSize: '0.95rem' }} />
                                    </div>
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontSize: '0.85rem', color: '#94a3b8', marginBottom: '8px', fontWeight: 600 }}>Status</label>
                                    <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', padding: '12px', borderRadius: '12px', color: 'white', fontSize: '0.95rem' }}>
                                        <option value="pending" style={{ background: 'var(--color-surface)' }}>Pending</option>
                                        <option value="in_progress" style={{ background: 'var(--color-surface)' }}>In Progress</option>
                                        <option value="completed" style={{ background: 'var(--color-surface)' }}>Completed</option>
                                    </select>
                                </div>

                                <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
                                    <button type="button" onClick={closeModal} style={{ flex: 1, background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid rgba(255,255,255,0.1)', padding: '12px', borderRadius: '12px', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
                                    <button type="submit" disabled={loading} style={{ flex: 1, background: 'var(--color-primary)', color: 'white', border: 'none', padding: '12px', borderRadius: '12px', fontWeight: 600, cursor: 'pointer' }}>{loading ? "Saving..." : "Save Task"}</button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminTasks;
