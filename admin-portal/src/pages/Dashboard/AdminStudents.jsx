import { useState, useEffect } from "react";
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
    )
};

const AdminStudents = () => {
    const [students, setStudents] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        const res = await axios.get("http://localhost:5000/api/admin/users");
        setStudents(res.data.filter(u => u.role === 'student'));
    };

    const handleSuspend = async (id, name) => {
        if (!window.confirm(`Are you sure you want to suspend/delete ${name}'s account? This will permanently remove them from the system.`)) return;
        try {
            await axios.delete(`http://localhost:5000/api/admin/users/${id}`);
            setStudents(students.filter(s => s.id !== id));
        } catch (err) {
            alert("Error suspending user");
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
                                <td><span className="status-badge active">Active</span></td>
                                <td><span className="role-tag student">Student</span></td>
                                <td>
                                    <div className="table-actions">
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
                                            style={{ marginLeft: '8px' }}
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
        </div>
    );
};

export default AdminStudents;
