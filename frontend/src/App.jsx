import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Appointment from "./pages/Appointment";
import DoctorsList from "./pages/DoctorsList";
import HealthPackages from "./pages/HealthPackages";
import Pharmacy from "./pages/Pharmacy";
import LabReports from "./pages/LabReports";
import Profile from "./pages/Profile";
import About from "./pages/About";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import MessageForm from "./components/MessageForm";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Context } from "./Context/AppContext";
import { useContext, useEffect } from "react";
import axios from "axios";

if (import.meta.env.VITE_SERVER_URL) {
  axios.defaults.baseURL = import.meta.env.VITE_SERVER_URL;
}

function App() {
  const { setIsAuthenticated, setUser } = useContext(Context);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get("/api/v1/user/patient/me", {
          withCredentials: true,
        });
        setIsAuthenticated(true);
        setUser(response.data.user);
      } catch (error) {
        setIsAuthenticated(false);
        setUser({});
      }
    };
    fetchUser();
  }, [setIsAuthenticated, setUser]);

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/appointment" element={<Appointment />} />
        <Route path="/doctors" element={<DoctorsList />} />
        <Route path="/packages" element={<HealthPackages />} />
        <Route path="/pharmacy" element={<Pharmacy />} />
        <Route path="/reports" element={<LabReports />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/contact" element={<MessageForm />} />
        <Route path="/about" element={<About />} />
      </Routes>
      <Footer />
      <ToastContainer position="top-center" theme="colored" />
    </Router>
  );
}

export default App;
