import React, { useEffect, useState } from "react";
import axios from "axios";
import "./FeaturePages.css";

const DoctorsList = () => {
  const [doctors, setDoctors] = useState([]);
  const [department, setDepartment] = useState("All");

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const { data } = await axios.get("/api/v1/user/doctors", { withCredentials: true });
        setDoctors(data.doctors);
      } catch (error) {
        console.log(error);
      }
    };
    fetchDoctors();
  }, []);

  const departments = ["All", ...new Set(doctors.map(doc => doc.doctorDepartment))];
  const filteredDoctors = department === "All" ? doctors : doctors.filter(doc => doc.doctorDepartment === department);



  return (
    <div className="page-container">
      <div className="page-header">
        <div className="container">
          <h1>Find a Doctor</h1>
          <p>Book an appointment with ZeeCare Hospitals' expert doctors.</p>
        </div>
      </div>

      <div className="container page-content">
        <div className="filter-section">
          <h3>Filter by Speciality:</h3>
          <div className="filter-tags">
            {departments.map((dep, index) => (
              <button 
                key={index} 
                className={`filter-tag ${department === dep ? "active" : ""}`}
                onClick={() => setDepartment(dep)}
              >
                {dep}
              </button>
            ))}
          </div>
        </div>

        <div className="doctors-grid">
          {filteredDoctors.length > 0 ? (
            filteredDoctors.map((doctor) => {
              const displayFullName = `${doctor.firstName} ${doctor.lastName}`;
              const fallbackImage = `https://ui-avatars.com/api/?name=${doctor.firstName}+${doctor.lastName}&background=random&color=fff`;

              return (
              <div key={doctor._id} className="doctor-card">
                <img src={doctor.docAvatar?.url || fallbackImage} 
                     onError={(e) => {e.target.src = fallbackImage}}
                     alt={`Dr. ${displayFullName}`} className="doc-avatar" />
                <div className="doc-info">
                  <h4>Dr. {displayFullName}</h4>
                  <span className="doc-dept">{doctor.doctorDepartment}</span>
                  <div className="doc-details-extra" style={{ fontSize: "0.85rem", color: "var(--text-light)", marginBottom: "15px", lineHeight: "1.6" }}>
                    <p style={{ margin: "4px 0" }}><strong>Gender:</strong> {doctor.gender}</p>
                    <p style={{ margin: "4px 0" }}><strong>Email:</strong> {doctor.email}</p>
                    <p style={{ margin: "4px 0" }}><strong>Phone:</strong> {doctor.phone}</p>
                  </div>
                  <div className="doc-actions">
                    <a href="/appointment" className="btn btn-primary" style={{ width: "100%", padding: "10px" }}>Book Appointment</a>
                  </div>
                </div>
              </div>
            )})
          ) : (
            <div style={{ textAlign: "center", gridColumn: "1 / -1", padding: "40px" }}>
              <p>No doctors found for this category.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorsList;
