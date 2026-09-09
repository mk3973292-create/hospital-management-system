import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../Context/AppContext";
import { Phone, Search } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import "./Navbar.css"; // We'll create this
import EmergencyAmbulanceButton from "./EmergencyAmbulanceButton";

const Navbar = () => {
  const { isAuthenticated, setIsAuthenticated } = useContext(Context);
  const navigate = useNavigate();
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleLogout = async () => {
    try {
      const response = await axios.get("/api/v1/user/patient/logout", {
        withCredentials: true,
      });
      toast.success(response.data.message);
      setIsAuthenticated(false);
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if(searchQuery.trim()){
      navigate(`/doctors`);
      setShowSearch(false);
      setSearchQuery("");
      window.scrollTo(0, 0);
    }
  };

  return (
    <header className="manipal-header">
      {/* Top Bar */}
      <div className="top-bar">
        <div className="container top-bar-inner">
          <div className="top-left">
            <Link to="/packages" className="top-link">Book Health Checkup Packages</Link>
            <Link to="/reports" className="top-link">Access Lab Reports</Link>
            <EmergencyAmbulanceButton className="emergency-badge">Emergency</EmergencyAmbulanceButton>
          </div>
          <div className="top-right">
            <a href="tel:1755000222" className="top-contact">
              <Phone size={14} /> 175 5000 222
            </a>
            {isAuthenticated ? (
              <>
                <Link to="/profile" className="top-link">Patient Profile</Link>
                <button className="top-link" onClick={handleLogout} style={{background: 'transparent', border:'none', cursor:'pointer', color:'white', fontSize:'13px', fontWeight:'500'}}>Logout</button>
              </>
            ) : (
              <Link to="/login" className="top-link">Patient Login</Link>
            )}
          </div>
        </div>
      </div>

      {/* Main Nav */}
      <nav className="main-nav">
        <div className="container nav-container">
          <Link to="/about" className="nav-logo" aria-label="ZeeCare Hospitals information">
             <span style={{color: "var(--primary-color)", fontWeight: "800", fontSize: "28px"}}>ZeeCare</span>
             <span style={{color: "var(--text-light)", fontSize: "14px", display: "block", marginTop: "-5px"}}>HOSPITALS</span>
          </Link>

          <div className="nav-links">
            <div className="nav-item">
               <Link to="/" className="nav-link">Centre of Excellence</Link>
            </div>
            <div className="nav-item">
               <Link to="/packages" className="nav-link">Health Packages</Link>
            </div>
            <div className="nav-item">
               <Link to="/doctors" className="nav-link">Doctors</Link>
            </div>
            <div className="nav-item">
               <Link to="/pharmacy" className="nav-link">Pharmacy</Link>
            </div>
            <div className="nav-item">
               <Link to="/reports" className="nav-link">Lab Reports</Link>
            </div>
          </div>

          <div className="nav-actions">
            {showSearch ? (
              <form onSubmit={handleSearchSubmit} className="search-form" style={{display: 'flex', alignItems: 'center', gap: '5px', background: '#f5f5f5', borderRadius: '20px', padding: '4px 10px'}}>
                <input 
                  type="text" 
                  placeholder="Find doctors..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{border: 'none', background: 'transparent', outline: 'none', fontSize: '14px', width: '130px', paddingLeft: '5px'}}
                  autoFocus
                />
                <Search size={16} style={{cursor: 'pointer', color: 'var(--primary-color)'}} onClick={() => setShowSearch(false)} />
              </form>
            ) : (
              <Search size={20} className="search-icon" onClick={() => setShowSearch(true)} style={{cursor: 'pointer'}} />
            )}
            <Link to="/contact" className="btn btn-secondary nav-btn-outline">Enquire Now</Link>
            <Link to="/appointment" className="btn btn-primary nav-btn">Book Appointment</Link>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
