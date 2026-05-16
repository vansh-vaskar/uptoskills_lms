import { motion } from 'framer-motion';
import { ArrowLeft, Download, Book } from 'lucide-react';
import { Link } from 'react-router-dom';

const Resources = () => {
    const studyGuides = [
        { name: "AI Fundamentals & Ethics Guide", size: "2.4 MB", type: "PDF" },
        { name: "Neural Networks Deep Dive", size: "1.8 MB", type: "PDF" },
        { name: "Machine Learning Concepts", size: "3.2 MB", type: "PDF" },
        { name: "Python for Data Science Handbook", size: "4.5 MB", type: "PDF" },
        { name: "Generative AI Masterclass Notes", size: "1.1 MB", type: "PDF" }
    ];

    const downloadFile = (name) => {
        const wpLink = "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf";
        const link = document.createElement('a');
        link.href = wpLink;
        link.download = `UptoSkills_${name.replace(/\s+/g, '_')}.pdf`;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="resources-page-root" style={{ padding: '100px 20px', minHeight: '100vh', background: '#0f172a', color: 'white' }}>
            <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Link to="/" style={{ color: '#f97316', display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', marginBottom: '40px', fontWeight: 600 }}>
                        <ArrowLeft size={20} /> Back to Home
                    </Link>
                </motion.div>

                <motion.header
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    style={{ marginBottom: '60px' }}
                >
                    <h1 style={{ fontSize: '3.5rem', fontWeight: 800, marginBottom: '20px' }}>
                        Study <span style={{
                            background: 'linear-gradient(to right, #f97316, #10b981)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            display: 'inline-block'
                        }}>Guides</span>
                    </h1>
                    <p style={{ color: '#94a3b8', fontSize: '1.25rem', maxWidth: '700px', lineHeight: '1.6' }}>
                        Download our curated collection of professional study guides and course notes to enhance your learning experience.
                    </p>
                </motion.header>

                <motion.div
                    style={{ background: '#1e293b', padding: '40px', borderRadius: '32px', border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px' }}>
                        <div style={{ background: 'rgba(249, 115, 22, 0.1)', padding: '15px', borderRadius: '16px' }}>
                            <Book className="text-orange-500" />
                        </div>
                        <h2 style={{ fontSize: '1.8rem', margin: 0 }}>PDF Resources</h2>
                    </div>

                    <div style={{ display: 'grid', gap: '15px' }}>
                        {studyGuides.map(item => (
                            <div key={item.name} className="resource-row-modern" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 24px', background: 'rgba(255,255,255,0.02)', borderRadius: '18px', border: '1px solid rgba(255,255,255,0.03)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                    <div style={{ fontSize: '1.2rem' }}>📄</div>
                                    <div>
                                        <p style={{ margin: 0, fontWeight: 600 }}>{item.name}</p>
                                        <span style={{ fontSize: '0.8rem', color: '#64748b' }}>{item.type} • {item.size}</span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => downloadFile(item.name)}
                                    style={{ background: '#f97316', border: 'none', color: 'white', padding: '10px 18px', borderRadius: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, fontSize: '0.9rem' }}
                                >
                                    <Download size={18} /> Download
                                </button>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Resources;
