import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../../styles/Dashboard.css";

const Certificate = () => {
    const { enrollmentId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [certData, setCertData] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        const link = document.createElement("link");
        link.href = "https://fonts.googleapis.com/css2?family=Cinzel:wght@500;700;800&family=Great+Vibes&family=Inter:wght@400;600;700&family=Playfair+Display:ital,wght@0,600;0,700;1,400&display=swap";
        link.rel = "stylesheet";
        document.head.appendChild(link);

        const fetchCertificateData = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/enrollment/${enrollmentId}`);
                if (!res.data.completed) {
                    setError("This course has not been marked as completed yet. Complete all curriculum lessons to unlock your certificate!");
                } else {
                    setCertData(res.data);
                }
            } catch (err) {
                console.error("Error fetching certificate data", err);
                setError("Could not retrieve certificate information. Please verify your enrollment status.");
            } finally {
                setLoading(false);
            }
        };

        fetchCertificateData();

        return () => {
            document.head.removeChild(link);
        };
    }, [enrollmentId]);

    if (loading) {
        return (
            <div style={{
                minHeight: "100vh",
                background: "#0f172a",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "'Inter', sans-serif"
            }}>
                <div style={{ textAlign: "center" }}>
                    <div style={{
                        border: "4px solid rgba(255, 255, 255, 0.1)",
                        borderTop: "4px solid var(--color-primary, #f97316)",
                        borderRadius: "50%",
                        width: "50px",
                        height: "50px",
                        animation: "spin 1s linear infinite",
                        margin: "0 auto 20px"
                    }}></div>
                    <p style={{ fontSize: "1.1rem", color: "#94a3b8" }}>Generating Certificate...</p>
                </div>
                <style>{`
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                `}</style>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{
                minHeight: "100vh",
                background: "#0f172a",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "20px",
                fontFamily: "'Inter', sans-serif"
            }}>
                <div style={{
                    background: "rgba(30, 41, 59, 0.8)",
                    padding: "40px",
                    borderRadius: "24px",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    maxWidth: "500px",
                    textAlign: "center"
                }}>
                    <span style={{ fontSize: "3rem", marginBottom: "20px", display: "block" }}>⚠️</span>
                    <h3 style={{ fontSize: "1.5rem", marginBottom: "15px", fontWeight: "700" }}>Access Denied</h3>
                    <p style={{ color: "#94a3b8", lineHeight: "1.6", marginBottom: "25px" }}>{error}</p>
                    <button 
                        onClick={() => navigate("/dashboard")} 
                        style={{
                            background: "var(--color-primary, #f97316)",
                            color: "white",
                            border: "none",
                            padding: "12px 30px",
                            borderRadius: "12px",
                            fontWeight: "700",
                            cursor: "pointer",
                            transition: "all 0.2s"
                        }}
                    >
                        Return to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    const studentName = certData.user_fullname || "Uptoskills Student";
    const courseTitle = certData.course_title || "LMS Training Course";
    const instructorName = certData.selected_instructor_name || certData.default_instructor_name || "LMS Faculty";
    const issueDate = certData.enrolled_at ? new Date(certData.enrolled_at).toLocaleDateString("en-US", {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }) : new Date().toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' });

    const certCode = `UPTO-CE-${certData.id}-${certData.course_id}-${String(certData.user_id).padStart(3, '0')}`;

    return (
        <div className="cert-page-container" style={{
            minHeight: "100vh",
            background: "#090d16",
            padding: "40px 20px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            fontFamily: "'Inter', sans-serif"
        }}>
            <div className="no-print" style={{
                display: "flex",
                gap: "20px",
                marginBottom: "35px",
                width: "100%",
                maxWidth: "1050px",
                justifyContent: "space-between",
                alignItems: "center",
                color: "white"
            }}>
                <button 
                    onClick={() => navigate("/dashboard")} 
                    style={{
                        background: "rgba(255,255,255,0.05)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        color: "white",
                        padding: "10px 20px",
                        borderRadius: "10px",
                        cursor: "pointer",
                        fontWeight: "600",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        transition: "all 0.2s"
                    }}
                >
                    ← Back to Dashboard
                </button>
                <div style={{ textAlign: "center" }}>
                    <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: "700" }}>Your Certificate is Ready!</h3>
                    <p style={{ margin: "4px 0 0 0", fontSize: "0.8rem", color: "#94a3b8" }}>You can download or print it</p>
                </div>
                <button 
                    onClick={() => window.print()} 
                    style={{
                        background: "var(--color-primary, #f97316)",
                        border: "none",
                        color: "white",
                        padding: "10px 25px",
                        borderRadius: "10px",
                        cursor: "pointer",
                        fontWeight: "700",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        boxShadow: "0 4px 15px rgba(249, 115, 22, 0.3)",
                        transition: "all 0.2s"
                    }}
                >
                    🖨️ Print / Download PDF
                </button>
            </div>

            <div className="certificate-sheet" style={{
                width: "100%",
                maxWidth: "1050px",
                aspectRatio: "1.414",
                background: "#fdfbfa",
                color: "#1e293b",
                borderRadius: "16px",
                boxShadow: "0 20px 50px rgba(0, 0, 0, 0.5)",
                padding: "60px",
                boxSizing: "border-box",
                position: "relative",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "space-between",
                overflow: "hidden",
                border: "2px solid #e2e8f0"
            }}>
                <div style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: "550px",
                    height: "550px",
                    opacity: 0.02,
                    pointerEvents: "none",
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath fill='%23000' d='M50 15c-19.3 0-35 15.7-35 35s15.7 35 35 35 35-15.7 35-35-15.7-35-35-35zm0 65c-16.6 0-30-13.4-30-30s13.4-30 30-30 30 13.4 30 30-13.4 30-30 30z'/%3E%3C/svg%3E")`,
                    backgroundSize: "contain",
                    backgroundRepeat: "no-repeat"
                }}></div>

                <div style={{
                    position: "absolute",
                    top: "20px",
                    left: "20px",
                    right: "20px",
                    bottom: "20px",
                    border: "3px double #b45309",
                    pointerEvents: "none"
                }}></div>
                <div style={{
                    position: "absolute",
                    top: "27px",
                    left: "27px",
                    right: "27px",
                    bottom: "27px",
                    border: "1px solid #1e3a8a",
                    pointerEvents: "none"
                }}></div>

                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%", zIndex: 2 }}>
                    <div style={{ marginBottom: "15px", color: "#b45309" }}>
                        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M6 3h12l4 6-10 13L2 9z"></path>
                            <path d="M11 3 8 9l4 13 4-13-3-6z"></path>
                            <path d="M2 9h20"></path>
                        </svg>
                    </div>

                    <h5 style={{
                        fontFamily: "'Cinzel', serif",
                        fontSize: "1.1rem",
                        fontWeight: "700",
                        letterSpacing: "5px",
                        margin: "0 0 10px 0",
                        color: "#1e3a8a",
                        textTransform: "uppercase"
                    }}>
                        Uptoskills AI Learn
                    </h5>
                    
                    <div style={{
                        width: "120px",
                        height: "1px",
                        background: "linear-gradient(to right, transparent, #b45309, transparent)",
                        marginBottom: "15px"
                    }}></div>

                    <h1 style={{
                        fontFamily: "'Cinzel', serif",
                        fontSize: "2.4rem",
                        fontWeight: "800",
                        letterSpacing: "2px",
                        margin: "5px 0 25px 0",
                        color: "#b45309",
                        textTransform: "uppercase",
                        textAlign: "center"
                    }}>
                        Certificate of Completion
                    </h1>
                </div>

                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%", zIndex: 2, padding: "0 40px" }}>
                    <p style={{
                        fontFamily: "'Playfair Display', serif",
                        fontStyle: "italic",
                        fontSize: "1.15rem",
                        margin: "0 0 15px 0",
                        color: "#64748b"
                    }}>
                        This is proudly presented to
                    </p>

                    <h2 style={{
                        fontFamily: "'Great Vibes', cursive",
                        fontSize: "3.6rem",
                        fontWeight: "400",
                        margin: "0 0 20px 0",
                        color: "#1e3a8a",
                        textAlign: "center",
                        lineHeight: "1"
                    }}>
                        {studentName}
                    </h2>

                    <p style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: "1.05rem",
                        textAlign: "center",
                        lineHeight: "1.8",
                        maxWidth: "680px",
                        margin: "0 0 20px 0",
                        color: "#475569"
                    }}>
                        for successfully fulfilling all curriculum requirements, specialized assessments, and advanced training hours required for the professional completion of
                    </p>

                    <h3 style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: "1.8rem",
                        fontWeight: "700",
                        margin: "0 0 15px 0",
                        color: "#b45309",
                        textAlign: "center",
                        lineHeight: "1.2"
                    }}>
                        "{courseTitle}"
                    </h3>
                </div>

                <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-end",
                    width: "100%",
                    zIndex: 2,
                    padding: "0 80px 10px"
                }}>
                    <div style={{ width: "220px", textAlign: "center" }}>
                        <div style={{
                            fontFamily: "'Great Vibes', cursive",
                            fontSize: "2.2rem",
                            color: "#1e3a8a",
                            borderBottom: "1px solid #cbd5e1",
                            paddingBottom: "5px",
                            marginBottom: "8px",
                            lineHeight: "0.9"
                        }}>
                            xyz person
                        </div>
                        <h6 style={{
                            fontFamily: "'Inter', sans-serif",
                            fontSize: "0.75rem",
                            fontWeight: "700",
                            textTransform: "uppercase",
                            letterSpacing: "1px",
                            margin: 0,
                            color: "#64748b"
                        }}>
                            President & CEO
                        </h6>
                        <span style={{ fontSize: "0.65rem", color: "#94a3b8" }}>Uptoskills AI Learn</span>
                    </div>

                    <div style={{ width: "220px", display: "flex", justifyContent: "center" }}>
                        <div style={{ 
                            position: "relative", 
                            width: "100px", 
                            height: "100px", 
                            display: "flex", 
                            alignItems: "center", 
                            justifyContent: "center",
                            transform: "translateY(-15px)"
                        }}>
                            <div style={{
                                position: "absolute",
                                width: "90px",
                                height: "90px",
                                borderRadius: "50%",
                                background: "radial-gradient(circle, #f59e0b 0%, #b45309 80%)",
                                boxShadow: "0 4px 15px rgba(180, 83, 9, 0.4)",
                                border: "2px dashed #fef3c7"
                            }}></div>
                            
                            <div style={{
                                position: "absolute",
                                bottom: "-25px",
                                left: "15px",
                                width: "25px",
                                height: "55px",
                                background: "#b45309",
                                clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 50% 80%, 0% 100%)",
                                transform: "rotate(-15deg)",
                                zIndex: -1
                            }}></div>
                            <div style={{
                                position: "absolute",
                                bottom: "-25px",
                                right: "15px",
                                width: "25px",
                                height: "55px",
                                background: "#1e3a8a",
                                clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 50% 80%, 0% 100%)",
                                transform: "rotate(15deg)",
                                zIndex: -1
                            }}></div>

                            <div style={{
                                position: "absolute",
                                width: "70px",
                                height: "70px",
                                borderRadius: "50%",
                                border: "2px solid #fef3c7",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "white"
                            }}>
                                <span style={{ fontSize: "0.5rem", fontWeight: "800", textTransform: "uppercase", letterSpacing: "1px" }}>OFFICIAL</span>
                                <span style={{ fontSize: "1rem" }}>👑</span>
                                <span style={{ fontSize: "0.5rem", fontWeight: "800", textTransform: "uppercase", letterSpacing: "1px" }}>SEAL</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div style={{
                    position: "absolute",
                    bottom: "35px",
                    left: "50px",
                    right: "50px",
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "0.75rem",
                    color: "#94a3b8",
                    fontFamily: "'Inter', sans-serif",
                    zIndex: 2
                }}>
                    <span>Issued Date: <strong>{issueDate}</strong></span>
                    <span>Verification Hash: <strong style={{ color: "#475569" }}>{certCode}</strong></span>
                </div>
            </div>

            <style>{`
                @media print {
                    /* Completely reset screen styling and hide header */
                    body, html, .cert-page-container {
                        background: #ffffff !important;
                        padding: 0 !important;
                        margin: 0 !important;
                        width: 297mm !important;
                        height: 210mm !important;
                    }
                    .no-print {
                        display: none !important;
                    }
                    .certificate-sheet {
                        box-shadow: none !important;
                        border: none !important;
                        border-radius: 0 !important;
                        margin: 0 !important;
                        padding: 40px !important;
                        width: 297mm !important;
                        height: 210mm !important;
                        max-width: 100% !important;
                        position: absolute !important;
                        top: 0 !important;
                        left: 0 !important;
                        box-sizing: border-box !important;
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                    }
                    /* Page breaks */
                    @page {
                        size: A4 landscape;
                        margin: 0;
                    }
                }
            `}</style>
        </div>
    );
};

export default Certificate;
