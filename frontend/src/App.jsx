import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/Landing";
import RegisterPage from "./pages/Register";
import LoginPage from "./pages/Login";
import Verification from "./pages/Verification";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/verify" element={<Verification />} />
        <Route path="/login" element={<LoginPage />} />
        {/* Add more routes here */}
      </Routes>
    </Router>
  );
}
