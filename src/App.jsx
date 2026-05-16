import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider } from "./store/AuthContext";
import AppRoutes from "./routes/AppRoutes";
import MainLayout from "./layouts/MainLayout";
import "./App.css";

function App() {
  return (
    <AuthProvider>
      <Router>
        <MainLayout>
          <AppRoutes />
        </MainLayout>
      </Router>
    </AuthProvider>
  );
}

export default App;