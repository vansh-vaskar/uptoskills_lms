import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem("lms_user");
        return savedUser ? JSON.parse(savedUser) : null;
    });

    const [instructors, setInstructors] = useState([]);

    const fetchInstructors = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/instructors");
            setInstructors(res.data);
        } catch (err) {
            console.error("Error fetching instructors", err);
        }
    };

    useEffect(() => {
        fetchInstructors();
    }, []);

    useEffect(() => {
        const checkUserStatus = async () => {
            if (user && user.id) {
                try {
                    const res = await axios.get(`http://localhost:5000/api/users/${user.id}`);
                    if (res.data.user) {
                        setUser(res.data.user);
                        localStorage.setItem("lms_user", JSON.stringify(res.data.user));
                    }
                } catch (err) {
                    console.error("Failed to verify user status", err);
                }
            }
        };
        checkUserStatus();

        let interval;
        if (user && !user.approved && user.role !== 'admin') {
            interval = setInterval(checkUserStatus, 10000);
        }
        return () => { if (interval) clearInterval(interval); };
    }, [user?.id, user?.approved]);

    const login = (userData) => {
        setUser(userData);
        localStorage.setItem("lms_user", JSON.stringify(userData))
    }

    const logout = () => {
        setUser(null);
        localStorage.removeItem("lms_user")
    };

    const changeInstructor = async (instructorId) => {
        if (!user || !user.id) return;
        try {
            const res = await axios.put(`http://localhost:5000/api/users/${user.id}/instructor`, {
                selected_instructor_id: instructorId
            });
            if (res.data.user) {
                const updatedUser = { ...user, selectedInstructorId: res.data.user.selectedInstructorId };
                setUser(updatedUser);
                localStorage.setItem("lms_user", JSON.stringify(updatedUser));
                return res.data.user;
            }
        } catch (err) {
            console.error("Failed to update instructor", err);
            throw err;
        }
    };

    const selectedInstructor = instructors.find(i => i.id === user?.selectedInstructorId) || null;

    return (
        <AuthContext.Provider value={{ user, login, logout, instructors, selectedInstructor, changeInstructor, fetchInstructors }}>
            {children}
        </AuthContext.Provider>
    )
}