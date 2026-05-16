import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider } from "./store/AuthContext";
import AdminRoutes from "./routes/AdminRoutes";
import "./index.css";

function App() {
  return (
    <AuthProvider>
      <Router>
        <AdminRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
