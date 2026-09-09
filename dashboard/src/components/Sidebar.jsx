import React, { useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { LayoutDashboard, Users, UserPlus, FileText, LogOut, Stethoscope, ClipboardList } from "lucide-react";
import { Context } from "../Context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const Sidebar = () => {
  const { isAuthenticated, setIsAuthenticated } = useContext(Context);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      const { data } = await axios.get("/api/v1/user/admin/logout", {
        withCredentials: true,
      });
      toast.success(data.message);
      setIsAuthenticated(false);
      navigate("/login");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  if (!isAuthenticated) return null;

  return (
    <aside className="sidebar">
      <div className="sidebar-header">ZeeCare Admin</div>
      
      <div className="sidebar-links">
        <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
          <LayoutDashboard size={20} /> Dashboard
        </Link>
        <Link to="/messages" className={`nav-link ${location.pathname === '/messages' ? 'active' : ''}`}>
          <FileText size={20} /> Messages
        </Link>
        <Link to="/doctors" className={`nav-link ${location.pathname === '/doctors' ? 'active' : ''}`}>
          <Stethoscope size={20} /> Doctors
        </Link>
        <Link to="/patients" className={`nav-link ${location.pathname === '/patients' ? 'active' : ''}`}>
          <ClipboardList size={20} /> Patients
        </Link>
        <Link to="/doctor/addnew" className={`nav-link ${location.pathname === '/doctor/addnew' ? 'active' : ''}`}>
          <Users size={20} /> Add Doctor
        </Link>
        <Link to="/admin/addnew" className={`nav-link ${location.pathname === '/admin/addnew' ? 'active' : ''}`}>
          <UserPlus size={20} /> Add Admin
        </Link>
      </div>

      <button className="logout-btn" onClick={handleLogout}>
        <LogOut size={20} /> Logout
      </button>
    </aside>
  );
};

export default Sidebar;
