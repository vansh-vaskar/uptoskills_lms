import { useState, useContext } from "react";
import { AuthContext } from "../../store/AuthContext";
import { Link } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { User, Mail, Shield, CheckCircle, ArrowRight } from "lucide-react";

const AdminProfile = () => {
    const { user, login } = useContext(AuthContext);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        fullName: user?.fullName || "",
        email: user?.email || ""
    });
    const [loading, setLoading] = useState(false);

    const handleUpdate = async (e) => {
        e.preventDefault();
        if (!isEditing) return;

        setLoading(true);
        try {
            await axios.put("http://localhost:5000/api/auth/profile", {
                id: user.id,
                fullName: formData.fullName,
                email: formData.email
            });
            login({ ...user, fullName: formData.fullName, email: formData.email });
            setIsEditing(false);
            alert("Admin profile updated successfully!");
        } catch (err) {
            alert("Error updating profile.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-profile-page" style={{ maxWidth: '800px' }}>
            <header className="page-header">
                <div className="header-text">
                    <h2>Admin Account</h2>
                    <p>Manage your administrative identity and security preferences.</p>
                </div>
            </header>

            <motion.div
                className="profile-card-premium"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ background: '#1e293b', padding: '40px', borderRadius: '32px', border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '30px', marginBottom: '40px' }}>
                    <div style={{
                        width: '100px',
                        height: '100px',
                        background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
                        borderRadius: '28px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '3.5rem',
                        fontWeight: 900,
                        color: 'white',
                        boxShadow: '0 10px 20px rgba(249, 115, 22, 0.2)'
                    }}>
                        {user?.fullName?.charAt(0)}
                    </div>
                    <div>
                        <h3 style={{ fontSize: '2rem', marginBottom: '8px', letterSpacing: '-0.5px' }}>{user?.fullName}</h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ background: 'rgba(249, 115, 22, 0.1)', color: '#f97316', padding: '6px 16px', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 800, border: '1px solid rgba(249, 115, 22, 0.2)' }}>MASTER ADMINISTRATOR</span>
                            <span style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', fontWeight: 600 }}><CheckCircle size={14} /> Verified</span>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleUpdate} style={{ display: 'grid', gap: '25px' }}>
                    <div className="form-group-admin">
                        <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.75rem', marginBottom: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>Full Name</label>
                        <div style={{ position: 'relative' }}>
                            <User style={{ position: 'absolute', left: '18px', top: '50%', transform: 'translateY(-50%)', color: isEditing ? '#f97316' : '#64748b' }} size={20} />
                            <input
                                type="text"
                                value={formData.fullName}
                                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                readOnly={!isEditing}
                                style={{
                                    width: '100%',
                                    background: isEditing ? 'rgba(15,23,42,0.8)' : 'rgba(255,255,255,0.02)',
                                    border: isEditing ? '2px solid #f97316' : '1px solid rgba(255,255,255,0.05)',
                                    padding: '18px 18px 18px 55px',
                                    borderRadius: '18px',
                                    color: 'white',
                                    fontSize: '1rem',
                                    transition: 'all 0.3s ease',
                                    outline: 'none',
                                    boxSizing: 'border-box'
                                }}
                                placeholder="Enter your full name"
                            />
                        </div>
                    </div>

                    <div className="form-group-admin">
                        <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.75rem', marginBottom: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>Email Address</label>
                        <div style={{ position: 'relative' }}>
                            <Mail style={{ position: 'absolute', left: '18px', top: '50%', transform: 'translateY(-50%)', color: isEditing ? '#f97316' : '#64748b' }} size={20} />
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                readOnly={!isEditing}
                                style={{
                                    width: '100%',
                                    background: isEditing ? 'rgba(15,23,42,0.8)' : 'rgba(255,255,255,0.02)',
                                    border: isEditing ? '2px solid #f97316' : '1px solid rgba(255,255,255,0.05)',
                                    padding: '18px 18px 18px 55px',
                                    borderRadius: '18px',
                                    color: 'white',
                                    fontSize: '1rem',
                                    transition: 'all 0.3s ease',
                                    outline: 'none',
                                    boxSizing: 'border-box'
                                }}
                                placeholder="name@uptoskills.com"
                            />
                        </div>
                    </div>

                    <div style={{ marginTop: '30px', display: 'flex', gap: '20px' }}>
                        {!isEditing ? (
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.preventDefault();
                                    setIsEditing(true);
                                }}
                                style={{ background: '#f97316', color: 'white', border: 'none', padding: '16px 35px', borderRadius: '18px', fontWeight: 800, cursor: 'pointer', fontSize: '1rem', boxShadow: '0 4px 15px rgba(249, 115, 22, 0.3)', transition: 'all 0.2s' }}
                            >
                                Edit Account
                            </button>
                        ) : (
                            <>
                                <button type="submit" disabled={loading} style={{ background: '#10b981', color: 'white', border: 'none', padding: '16px 35px', borderRadius: '18px', fontWeight: 800, cursor: 'pointer', fontSize: '1rem', boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)' }}>{loading ? "Saving Changes..." : "Apply Updates"}</button>
                                <button type="button" onClick={() => setIsEditing(false)} style={{ background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid rgba(255,255,255,0.1)', padding: '16px 35px', borderRadius: '18px', fontWeight: 800, cursor: 'pointer', fontSize: '1rem' }}>Discard</button>
                            </>
                        )}
                    </div>
                </form>

                <div style={{ marginTop: '60px', padding: '30px', background: 'rgba(15, 23, 42, 0.4)', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div className="security-section-flex" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
                        <div style={{ flex: '1', minWidth: '280px' }}>
                            <h4 style={{ margin: '0 0 10px', display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1.2rem', fontWeight: 800 }}>
                                <Shield size={24} color="#f97316" /> Advanced Security
                            </h4>
                            <p style={{ color: '#94a3b8', fontSize: '0.9rem', margin: 0, lineHeight: '1.5' }}>
                                Manage your administrative authentication credentials and protect your account with a unique security key.
                            </p>
                        </div>
                        <Link to="/forgot-password" style={{ textDecoration: 'none' }}>
                            <button style={{
                                background: '#1e293b',
                                color: '#f97316',
                                border: '2px solid rgba(249, 115, 22, 0.3)',
                                padding: '16px 32px',
                                borderRadius: '16px',
                                fontWeight: 800,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                transition: 'all 0.3s ease',
                                fontSize: '0.95rem',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                            }}
                                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(249, 115, 22, 0.05)'; e.currentTarget.style.borderColor = '#f97316'; }}
                                onMouseLeave={(e) => { e.currentTarget.style.background = '#1e293b'; e.currentTarget.style.borderColor = 'rgba(249, 115, 22, 0.3)'; }}
                            >
                                Update Security Key <ArrowRight size={18} />
                            </button>
                        </Link>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default AdminProfile;
