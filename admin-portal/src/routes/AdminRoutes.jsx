import { Routes, Route } from "react-router-dom";
import PrivateRoute from "../components/PrivateRoute";
import AdminLayout from "../components/AdminLayout";
import AdminDashboard from "../pages/Dashboard/AdminDashboard";
import AdminStudents from "../pages/Dashboard/AdminStudents";
import AdminCourses from "../pages/Dashboard/AdminCourses";
import AdminInstructors from "../pages/Dashboard/AdminInstructors";
import AdminEnrollments from "../pages/Dashboard/AdminEnrollments";
import AdminProfile from "../pages/Dashboard/AdminProfile";
import AdminReports from "../pages/Dashboard/AdminReports";
import AdminReviews from "../pages/Dashboard/AdminReviews";
import AdminSettings from "../pages/Dashboard/AdminSettings";
import AdminTasks from "../pages/Dashboard/AdminTasks";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import ForgotPassword from "../pages/Auth/ForgotPassword";

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route 
        path="/*" 
        element={
          <PrivateRoute>
            <AdminLayout>
                <Routes>
                  <Route path="/" element={<AdminDashboard />} />
                  <Route path="/students" element={<AdminStudents />} />
                  <Route path="/courses" element={<AdminCourses />} />
                  <Route path="/instructors" element={<AdminInstructors />} />
                  <Route path="/enrollments" element={<AdminEnrollments />} />
                  <Route path="/profile" element={<AdminProfile />} />
                  <Route path="/reports" element={<AdminReports />} /> 
                  <Route path="/reviews" element={<AdminReviews />} />
                  <Route path="/settings" element={<AdminSettings />} />
                  <Route path="/tasks" element={<AdminTasks />} />
                </Routes>
            </AdminLayout>
          </PrivateRoute>
        } 
      />
    </Routes>
  );
};

export default AdminRoutes;
