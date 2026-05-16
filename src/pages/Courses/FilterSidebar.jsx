import '../../styles/FilterSidebar.css';

const FilterSidebar = ({ filters, setFilters }) => {
    const handleCheckboxChange = (category, value) => {
        setFilters(prev => {
            const currentValues = prev[category] || [];
            if (currentValues.includes(value)) {
                return { ...prev, [category]: currentValues.filter(v => v !== value) };
            } else {
                return { ...prev, [category]: [...currentValues, value] };
            }
        });
    };

    return (
        <aside className="filter-sidebar-premium">
            <div className="sidebar-header">
                <h3>Refine Selection</h3>
                <button className="clear-btn" onClick={() => setFilters({ topic: [], level: [], duration: [] })}>
                    Clear All
                </button>
            </div>

            <div className="filter-section">
                <h4>Topics</h4>
                <div className="checkbox-group">
                    {['Artificial Intelligence', 'Data Science', 'Web Development', 'Creative Design', 'Engineering', 'Business & Growth', 'Cloud Computing'].map(topic => (
                        <label key={topic} className="custom-checkbox">
                            <input
                                type="checkbox"
                                checked={filters.topic.includes(topic)}
                                onChange={() => handleCheckboxChange('topic', topic)}
                            />
                            <span className="checkmark"></span>
                            {topic}
                        </label>
                    ))}
                </div>
            </div>

            <div className="filter-section">
                <h4>Experience Level</h4>
                <div className="checkbox-group">
                    {['Beginner', 'Intermediate', 'Advanced'].map(level => (
                        <label key={level} className="custom-checkbox">
                            <input
                                type="checkbox"
                                checked={filters.level.includes(level)}
                                onChange={() => handleCheckboxChange('level', level)}
                            />
                            <span className="checkmark"></span>
                            {level}
                        </label>
                    ))}
                </div>
            </div>

            <div className="filter-section">
                <h4>Course Duration</h4>
                <div className="checkbox-group">
                    {['< 1 hr', '1-4 hrs', '> 4 hrs'].map(dur => (
                        <label key={dur} className="custom-checkbox">
                            <input
                                type="checkbox"
                                checked={filters.duration.includes(dur)}
                                onChange={() => handleCheckboxChange('duration', dur)}
                            />
                            <span className="checkmark"></span>
                            {dur}
                        </label>
                    ))}
                </div>
            </div>
        </aside>
    );
};

export default FilterSidebar;
