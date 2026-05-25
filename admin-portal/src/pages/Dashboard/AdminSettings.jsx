import { useState } from "react";
import { motion } from "framer-motion";
import { Bell, Globe, Lock, Palette, Eye, Mail } from "lucide-react";

const SettingRow = ({ id, icon: Icon, title, desc, active, onToggle }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '25px', background: 'rgba(255,255,255,0.02)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)', marginBottom: '15px' }}>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <div style={{ width: '48px', height: '48px', background: 'rgba(249, 115, 22, 0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)' }}>
                <Icon size={22} />
            </div>
            <div>
                <h4 style={{ margin: '0 0 5px', fontSize: '1rem' }}>{title}</h4>
                <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>{desc}</p>
            </div>
        </div>
        <button
            onClick={() => onToggle(id)}
            style={{
                width: '60px',
                height: '32px',
                borderRadius: '100px',
                background: active ? 'var(--color-primary)' : '#334155',
                border: 'none',
                cursor: 'pointer',
                position: 'relative',
                transition: 'all 0.3s'
            }}
        >
            <motion.div
                animate={{ x: active ? 30 : 4 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                style={{ width: '24px', height: '24px', background: 'white', borderRadius: '50%', position: 'absolute', top: '4px', left: 0 }}
            />
        </button>
    </div>
);

const AdminSettings = () => {
    const [settings, setSettings] = useState({
        mfa: true,
        emailAlerts: true,
        publicAnalytics: false,
        autoPublish: true,
        maintenanceMode: false
    });

    const toggleSetting = (key) => {
        setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <div className="admin-settings-page">
            <header className="page-header">
                <div className="header-text">
                    <h2>System Settings</h2>
                    <p>Configure global platform behaviors and security protocols.</p>
                </div>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', maxWidth: '900px' }}>
                <section style={{ marginBottom: '40px' }}>
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '20px', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '10px' }}><Lock size={18} /> Security & Access</h3>
                    <SettingRow
                        id="mfa"
                        icon={Shield}
                        title="Multi-Factor Authentication"
                        desc="Require a security code for all administrative logins."
                        active={settings.mfa}
                        onToggle={toggleSetting}
                    />
                    <SettingRow
                        id="maintenanceMode"
                        icon={Globe}
                        title="Maintenance Mode"
                        desc="Disable public access while performing system updates."
                        active={settings.maintenanceMode}
                        onToggle={toggleSetting}
                    />
                </section>

                <section style={{ marginBottom: '40px' }}>
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '20px', color: 'var(--color-info)', display: 'flex', alignItems: 'center', gap: '10px' }}><Bell size={18} /> Notifications</h3>
                    <SettingRow
                        id="emailAlerts"
                        icon={Mail}
                        title="Critical Email Alerts"
                        desc="Receive immediate emails for system errors or security breaches."
                        active={settings.emailAlerts}
                        onToggle={toggleSetting}
                    />
                </section>

                {/* <section>
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '20px', color: 'var(--color-success)', display: 'flex', alignItems: 'center', gap: '10px' }}><Palette size={18} /> Platform Content</h3>
                    <SettingRow 
                        id="autoPublish" 
                        icon={Eye} 
                        title="Auto-Publish Courses" 
                        desc="Automatically publish courses as soon as they are saved by an admin."
                        active={settings.autoPublish}
                        onToggle={toggleSetting}
                    />
                </section> */}
            </div>
        </div>
    );
};

const Shield = (props) => <svg {...props} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>;

export default AdminSettings;
