import './Logo.css';

const Logo = ({ size = 'medium' }) => {
    return (
        <div className={`logo-root ${size}`}>
            <div className="logo-text">
                <span className="text-orange">UPTOSKILLS</span>
                <span className="text-teal">AI LEARN</span>
            </div>
        </div>
    );
};

export default Logo;
