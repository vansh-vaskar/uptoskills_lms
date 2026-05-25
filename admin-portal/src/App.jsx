import { BrowserRouter as Router } from "react-router-dom";
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from "./store/AuthContext";
import AdminRoutes from "./routes/AdminRoutes";
import { injectTokens } from "./styles/injectTokens";
import "./index.css";

injectTokens();

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster position="top-right" />
        <AdminRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
