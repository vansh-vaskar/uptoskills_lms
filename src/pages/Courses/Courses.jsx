import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import CourseCard from "./CourseCard";
import FilterSidebar from "./FilterSidebar";
import "../../styles/courses.css";

const Courses = () => {
    const [searchParams] = useSearchParams();
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        topic: [],
        level: [],
        duration: []
    });

    const search = searchParams.get("search") || "";

    useEffect(() => {
        const fetchCourses = async () => {
            setLoading(true);
            try {
                const params = new URLSearchParams();
                if (search) params.append("search", search);
                filters.topic.forEach(t => params.append("topic", t));
                filters.level.forEach(l => params.append("level", l));

                const response = await axios.get(`http://localhost:5000/api/courses?${params.toString()}`);

                let filteredData = response.data;
                if (filters.duration.length > 0) {
                    filteredData = filteredData.filter(course => {
                        const curriculum = Array.isArray(course.curriculum) ? course.curriculum : [];
                        let totalSeconds = 0;

                        if (curriculum.length === 0) {
                            const dur = (course.duration || "0").toLowerCase();
                            if (dur.includes('hr')) totalSeconds = (parseFloat(dur) || 0) * 3600;
                            else if (dur.includes('min')) totalSeconds = (parseFloat(dur) || 0) * 60;
                            else totalSeconds = (parseFloat(dur) || 0) * 3600;
                        } else {
                            curriculum.forEach(item => {
                                const dur = (item.duration || "0").toString();
                                if (dur.includes(':')) {
                                    const parts = dur.split(':').map(Number);
                                    if (parts.length === 3) totalSeconds += (parts[0] || 0) * 3600 + (parts[1] || 0) * 60 + (parts[2] || 0);
                                    else if (parts.length === 2) totalSeconds += (parts[0] || 0) * 60 + (parts[1] || 0);
                                } else {
                                    const numeric = parseInt(dur);
                                    if (!isNaN(numeric)) totalSeconds += numeric * 60;
                                }
                            });
                        }

                        const totalHours = totalSeconds / 3600;
                        if (filters.duration.includes("< 1 hr") && totalHours < 1) return true;
                        if (filters.duration.includes("1-4 hrs") && totalHours >= 1 && totalHours <= 4) return true;
                        if (filters.duration.includes("> 4 hrs") && totalHours > 4) return true;
                        return false;
                    });
                }

                setCourses(filteredData);
            } catch (err) {
                console.error("Error fetching courses:", err);
                setError("Failed to load courses. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, [search, filters]);

    return (
        <div className="courses-container-premium">
            <header className="catalog-header">
                <div className="header-text">
                    <h1>Explore AI-Powered Courses</h1>
                    <p>Learn from the world's most influential celebrities and tech visionaries.</p>
                </div>
                {search && (
                    <div className="search-status">
                        Showing results for: <strong>"{search}"</strong>
                    </div>
                )}
            </header>

            <div className="courses-layout-premium">
                <FilterSidebar filters={filters} setFilters={setFilters} />

                <main className="courses-content">
                    {loading ? (
                        <div className="loading-spinner">
                            <div className="spinner"></div>
                            <p>Loading Courses...</p>
                        </div>
                    ) : error ? (
                        <div className="error-box">{error}</div>
                    ) : courses.length > 0 ? (
                        <div className="courses-grid-premium">
                            {courses.map((course) => (
                                <CourseCard key={course.id} course={course} />
                            ))}
                        </div>
                    ) : (
                        <div className="no-results">
                            <h3>No courses found</h3>
                            <p>Try adjusting your search or filters to find what you're looking for.</p>
                            <button className="reset-btn" onClick={() => setFilters({ topic: [], level: [], duration: [] })}>
                                Reset Filters
                            </button>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default Courses;
