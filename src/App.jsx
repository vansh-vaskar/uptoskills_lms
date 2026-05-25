import { BrowserRouter as Router } from "react-router-dom";
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from "./store/AuthContext";
import AppRoutes from "./routes/AppRoutes";
import MainLayout from "./layouts/MainLayout";
import { injectTokens } from "./styles/injectTokens";
import "./App.css";

injectTokens();

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster position="top-right" />
        <MainLayout>
          <AppRoutes />
        </MainLayout>
      </Router>
    </AuthProvider>
  );
}

export default App;