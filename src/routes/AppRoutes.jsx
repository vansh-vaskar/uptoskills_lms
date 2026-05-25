import { Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../store/AuthContext";
import Home from "../pages/Home";
import Courses from "../pages/Courses/Courses";
import About from "../pages/About";
import Contact from "../pages/Contact";
import CourseDetails from "../pages/Courses/CourseDetails";
import CoursePlayer from "../pages/Courses/CoursePlayer";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import ForgotPassword from "../pages/Auth/ForgotPassword";
import Dashboard from "../pages/Dashboard/Dashboard";
import Resources from "../pages/Resources";
import PrivateRoute from "../components/PrivateRoute";
import Certificate from "../pages/Dashboard/Certificate";

const AppRoutes = () => {
  const { user } = useContext(AuthContext);

  if (user && !user.approved && user.role !== "admin") {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '20px' }}>
        <div style={{ background: 'var(--color-surface)', padding: '40px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.1)', maxWidth: '500px' }}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--color-warning)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '20px' }}>
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '10px', color: 'white' }}>Account Pending Approval</h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '0' }}>
            Your account has been successfully created and is currently awaiting administrator approval. You will gain full access to the portal once your account is verified. This page will automatically refresh once approved.
          </p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/courses" element={<PrivateRoute><Courses /></PrivateRoute>} />
      <Route path="/about" element={<PrivateRoute><About /></PrivateRoute>} />
      <Route path="/contact" element={<PrivateRoute><Contact /></PrivateRoute>} />
      <Route path="/resources" element={<PrivateRoute><Resources /></PrivateRoute>} />
      <Route path="/course/:id" element={<PrivateRoute><CourseDetails /></PrivateRoute>} />
      <Route path="/course/:id/player" element={<PrivateRoute><CoursePlayer /></PrivateRoute>} />
      <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/certificate/:enrollmentId" element={<PrivateRoute><Certificate /></PrivateRoute>} />
      <Route path="*" element={<Navigate to={user ? "/" : "/login"} replace />} />
    </Routes>
  );
};

export default AppRoutes;
