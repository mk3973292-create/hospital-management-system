import React, { useContext, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import AddNewDoctor from "./pages/AddNewDoctor";
import AddNewAdmin from "./pages/AddNewAdmin";
import Messages from "./pages/Messages";
import Doctors from "./pages/Doctors";
import Patients from "./pages/Patients";
import Sidebar from "./components/Sidebar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Context } from "./Context/AppContext";
import axios from "axios";

function App() {
  const { isAuthenticated, setIsAuthenticated, setAdmin } = useContext(Context);

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const { data } = await axios.get("/api/v1/user/admin/me", {
          withCredentials: true,
        });
        setIsAuthenticated(true);
        setAdmin(data.user);
      } catch (error) {
        setIsAuthenticated(false);
        setAdmin({});
      }
    };
    fetchAdmin();
  }, [setIsAuthenticated, setAdmin]);

  const basename = window.location.pathname.startsWith('/admin') ? '/admin' : '/';

  return (
    <Router basename={basename}>
      <div className={isAuthenticated ? "admin-layout" : ""}>
        <Sidebar />
        <main className={isAuthenticated ? "main-wrapper" : ""}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/doctor/addnew" element={<AddNewDoctor />} />
            <Route path="/admin/addnew" element={<AddNewAdmin />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/doctors" element={<Doctors />} />
            <Route path="/patients" element={<Patients />} />
          </Routes>
        </main>
      </div>
      <ToastContainer position="top-center" theme="colored" />
    </Router>
  );
}

export default App;
