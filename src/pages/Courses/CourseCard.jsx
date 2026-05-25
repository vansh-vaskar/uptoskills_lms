import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../store/AuthContext';
import '../../styles/CourseCard.css';

const CourseCard = ({ course }) => {
    const navigate = useNavigate();
    const { selectedInstructor } = useContext(AuthContext);

    const displayInstructorName = selectedInstructor ? selectedInstructor.name : course.instructor_name;
    const displayInstructorImage = selectedInstructor ? selectedInstructor.image : course.instructor_image;

    const normalizeUrl = (url) => {
        if (!url) return "";
        if (url.startsWith("http")) return url;
        const cleanPath = url.startsWith("/") ? url.slice(1) : url;
        return `http://localhost:5000/${cleanPath}`;
    };
    const calculateTotalDuration = () => {
        const curriculum = Array.isArray(course.curriculum) ? course.curriculum : [];
        if (curriculum.length === 0) return course.duration || "0h 0m";

        let totalSeconds = 0;
        curriculum.forEach(item => {
            const dur = (item.duration || "0").toString();
            if (dur.includes(':')) {
                const parts = dur.split(':').map(Number);
                if (parts.length === 3) { // HH:MM:SS
                    totalSeconds += (parts[0] || 0) * 3600 + (parts[1] || 0) * 60 + (parts[2] || 0);
                } else if (parts.length === 2) { // MM:SS
                    totalSeconds += (parts[0] || 0) * 60 + (parts[1] || 0);
                }
            } else {
                const numeric = parseInt(dur);
                if (!isNaN(numeric)) totalSeconds += numeric * 60;
            }
        });

        const hrs = Math.floor(totalSeconds / 3600);
        const mins = Math.floor((totalSeconds % 3600) / 60);

        if (hrs > 0) return `${hrs}h ${mins}m`;
        return `${mins}m`;
    };

    const displayDuration = calculateTotalDuration();

    return (
        <div className="course-card-premium" onClick={() => navigate(`/course/${course.id}`)}>
            <div className="card-image-wrapper">
                <img src={normalizeUrl(course.image)} alt={course.title} className="card-course-img" onError={(e) => e.target.src = "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800"} />
                <div className="ai-badge">AI-Powered</div>
            </div>

            <div className="card-content">
                <div className="instructor-mini">
                    <img src={normalizeUrl(displayInstructorImage)} alt={displayInstructorName} className="mini-avatar" onError={(e) => e.target.src = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50"} />
                    <span>{displayInstructorName}</span>
                </div>

                <h3 className="card-title">{course.title}</h3>
                <p className="card-desc">{course.about}</p>

                <div className="card-stats">
                    <div className="stat">
                        <span className="stat-icon">⏱</span>
                        <span>{displayDuration}</span>
                    </div>
                    <div className="stat">
                        <span className="stat-icon">⭐</span>
                        <span>{course.rating} ({course.rating_count || 0})</span>
                    </div>
                    <div className="stat">
                        <span className="stat-icon">👥</span>
                        <span>{course.enrollments.toLocaleString()}</span>
                    </div>
                </div>

                <div className="card-footer">
                    <span className="level-tag">{course.level}</span>
                    <button className="enroll-btn-sparkle">
                        Explore Now
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CourseCard;
