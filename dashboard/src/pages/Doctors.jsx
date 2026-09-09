import React, { useContext, useEffect, useState } from "react";
import { Context } from "../Context/AppContext";
import { Navigate } from "react-router-dom";
import axios from "axios";
import { Edit, Trash2 } from "lucide-react";
import { toast } from "react-toastify";

const Doctors = () => {
  const { isAuthenticated } = useContext(Context);
  const [doctors, setDoctors] = useState([]);
  const [editingDoctor, setEditingDoctor] = useState(null);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const { data } = await axios.get("/api/v1/user/doctors", {
          withCredentials: true,
        });
        setDoctors(data.doctors);
      } catch (error) {
        console.log(error.response?.data?.message || "Failed to fetch doctors");
      }
    };
    if (isAuthenticated) fetchDoctors();
  }, [isAuthenticated]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this doctor?")) return;
    try {
      const { data } = await axios.delete(`/api/v1/user/doctor/${id}`, {
        withCredentials: true,
      });
      toast.success(data.message);
      setDoctors((prev) => prev.filter((doc) => doc._id !== id));
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete doctor");
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingDoctor((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put(`/api/v1/user/doctor/${editingDoctor._id}`, editingDoctor, {
        withCredentials: true,
      });
      toast.success(data.message);
      setDoctors((prev) => prev.map((doc) => (doc._id === editingDoctor._id ? data.doctor : doc)));
      setEditingDoctor(null);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update doctor");
    }
  };

  if (!isAuthenticated) return <Navigate to="/login" />;

  return (
    <section className="page-header">
      <h2 className="page-title">Manage Doctors</h2>
      
      {editingDoctor && (
        <div style={modalOverlayStyle}>
          <div style={modalStyle}>
            <h3>Edit Doctor</h3>
            <form onSubmit={handleEditSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
              <div style={{ display: "flex", gap: "10px" }}>
                <input type="text" name="firstName" value={editingDoctor.firstName} onChange={handleEditChange} placeholder="First Name" required style={inputStyle} />
                <input type="text" name="lastName" value={editingDoctor.lastName} onChange={handleEditChange} placeholder="Last Name" required style={inputStyle} />
              </div>
              <input type="email" name="email" value={editingDoctor.email} onChange={handleEditChange} placeholder="Email" required style={inputStyle} />
              <input type="text" name="phone" value={editingDoctor.phone} onChange={handleEditChange} placeholder="Phone" required style={inputStyle} />
              <div style={{ display: "flex", gap: "10px" }}>
                <select name="gender" value={editingDoctor.gender} onChange={handleEditChange} required style={inputStyle}>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
                <input type="text" name="doctorDepartment" value={editingDoctor.doctorDepartment} onChange={handleEditChange} placeholder="Department" required style={inputStyle} />
              </div>
              <input type="text" name="nic" value={editingDoctor.nic} onChange={handleEditChange} placeholder="NIC" required style={inputStyle} />
              <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Save</button>
                <button type="button" onClick={() => setEditingDoctor(null)} className="btn" style={{ flex: 1, backgroundColor: "#ccc", color: "#333" }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="card-grid">
        {doctors.length > 0 ? (
          doctors.map((doctor) => (
            <div className="stat-card" key={doctor._id} style={{ flexDirection: "column", gap: "10px", alignItems: "flex-start", position: "relative" }}>
              <div style={{ position: "absolute", top: "15px", right: "15px", display: "flex", gap: "10px" }}>
                <Edit size={18} color="var(--primary)" style={{ cursor: "pointer" }} onClick={() => setEditingDoctor(doctor)} />
                <Trash2 size={18} color="red" style={{ cursor: "pointer" }} onClick={() => handleDelete(doctor._id)} />
              </div>
              <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
                <img 
                  src={doctor.docAvatar?.url || `https://ui-avatars.com/api/?name=${doctor.firstName}+${doctor.lastName}&background=random&color=fff`} 
                  alt="Avatar" 
                  onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${doctor.firstName}+${doctor.lastName}&background=random&color=fff`; }}
                  style={{ width: "60px", height: "60px", borderRadius: "50%", objectFit: "cover" }} 
                />
                <div>
                  <h4 style={{ margin: "0", paddingRight: "40px" }}>Dr. {doctor.firstName} {doctor.lastName}</h4>
                  <span style={{ fontSize: "0.85rem", color: "var(--primary)", fontWeight: "500" }}>{doctor.doctorDepartment}</span>
                </div>
              </div>
              <div style={{ fontSize: "0.9rem", color: "var(--text-muted)", marginTop: "10px", width: "100%", borderTop: "1px solid var(--border)", paddingTop: "10px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
                  <strong>Gender:</strong> <span>{doctor.gender}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
                  <strong>Phone:</strong> <span>{doctor.phone}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
                  <strong>Email:</strong> <span>{doctor.email}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
                  <strong>DOB:</strong> <span>{new Date(doctor.dob).toLocaleDateString()}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <strong>NIC:</strong> <span>{doctor.nic}</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No doctors found.</p>
        )}
      </div>
    </section>
  );
};

const modalOverlayStyle = {
  position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
  backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1000,
  display: "flex", alignItems: "center", justifyContent: "center"
};

const modalStyle = {
  backgroundColor: "#fff", padding: "30px", borderRadius: "8px",
  width: "90%", maxWidth: "500px", boxShadow: "0 4px 15px rgba(0,0,0,0.2)"
};

const inputStyle = {
  flex: 1, padding: "10px", borderRadius: "5px", border: "1px solid #ccc", fontSize: "1rem"
};

export default Doctors;
