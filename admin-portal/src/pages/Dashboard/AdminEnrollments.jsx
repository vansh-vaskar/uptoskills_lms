import { useState, useEffect } from "react";
import axios from "axios";
import "../../styles/AdminStudents.css";

const Icons = {
    Search: () => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
    ),
    Trash2: () => (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
    )
};

const AdminEnrollments = () => {
    const [enrollments, setEnrollments] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        fetchEnrollments();
    }, []);

    const fetchEnrollments = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/admin/enrollments");
            setEnrollments(res.data);
        } catch (err) {
            console.error("Error fetching enrollments:", err);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to remove this enrollment?")) {
            try {
                await axios.delete(`http://localhost:5000/api/admin/enrollments/${id}`);
                setEnrollments(enrollments.filter(e => e.id !== id));
            } catch (err) {
                alert("Failed to delete enrollment.");
            }
        }
    };

    const filtered = enrollments.filter(e =>
        e.user_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.course_title?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="admin-enrollments-page">
            <header className="page-header">
                <div className="header-text">
                    <h2>Enrollment Management</h2>
                    <p>Track and manage student course admissions.</p>
                </div>
            </header>

            <div className="table-actions-bar">
                <div className="table-search">
                    <Icons.Search />
                    <input
                        type="text"
                        placeholder="Search by student or course..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <div className="admin-table-wrapper">
                <table className="admin-data-table">
                    <thead>
                        <tr>
                            <th>Student</th>
                            <th>Course</th>
                            <th>Enrolled Date</th>
                            <th>Progress</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map((e) => (
                            <tr key={e.id}>
                                <td>
                                    <div className="table-user-info">
                                        <div className="user-avatar-small">{e.user_name?.charAt(0)}</div>
                                        <div>
                                            <p style={{ margin: 0, fontWeight: 700 }}>{e.user_name}</p>
                                            <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748b' }}>{e.user_email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td>{e.course_title}</td>
                                <td>{new Date(e.enrolled_at).toLocaleDateString()}</td>
                                <td>
                                    <div className="progress-mini-wrapper" style={{ width: '100px' }}>
                                        <div className="progress-mini-bg" style={{ height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px' }}>
                                            <div className="progress-mini-fill" style={{ width: `${e.progress}%`, height: '100%', background: '#f97316', borderRadius: '2px' }}></div>
                                        </div>
                                        <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{e.progress}%</span>
                                    </div>
                                </td>
                                <td>
                                    <span className={`status-badge ${e.completed ? 'active' : ''}`}>
                                        {e.completed ? 'Completed' : 'In Progress'}
                                    </span>
                                </td>
                                <td>
                                    <button className="action-btn delete" onClick={() => handleDelete(e.id)}>
                                        <Icons.Trash2 />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminEnrollments;
