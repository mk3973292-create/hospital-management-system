import React, { useContext, useEffect, useState } from "react";
import { Context } from "../Context/AppContext";
import { Navigate } from "react-router-dom";
import axios from "axios";

const Patients = () => {
  const { isAuthenticated } = useContext(Context);
  const [appointments, setAppointments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const { data } = await axios.get("/api/v1/appointment/getall", {
          params: { limit: 200 },
          withCredentials: true,
        });
        setAppointments((data.appointments || []).slice(0, 200));
      } catch {
        setAppointments([]);
      }
    };

    if (isAuthenticated) fetchAppointments();
  }, [isAuthenticated]);

  if (!isAuthenticated) return <Navigate to="/login" />;

  const getDoctorDetails = (appt) => {
    const populatedDoctor = appt.doctorId || {};
    const savedDoctor = appt.doctor || {};
    const doctorName = `${populatedDoctor.firstName || savedDoctor.firstName || ""} ${
      populatedDoctor.lastName || savedDoctor.lastName || ""
    }`.trim();

    return {
      name: doctorName ? `Dr. ${doctorName}` : "Doctor not assigned",
      department: populatedDoctor.doctorDepartment || appt.department || "Department not added",
      phone: populatedDoctor.phone || "",
      email: populatedDoctor.email || "",
    };
  };

  const filtered = appointments.filter((appt) => {
    const term = searchTerm.toLowerCase();
    const patientName = `${appt.firstName} ${appt.lastName}`.toLowerCase();
    const doctor = getDoctorDetails(appt);

    return (
      patientName.includes(term) ||
      doctor.name.toLowerCase().includes(term) ||
      doctor.department.toLowerCase().includes(term) ||
      appt.address?.toLowerCase().includes(term) ||
      appt.medicalRecord?.toLowerCase().includes(term) ||
      appt.patientMessage?.toLowerCase().includes(term)
    );
  });

  const totalFees = filtered.reduce((sum, appt) => sum + (appt.fee || 500), 0);

  return (
    <section className="page-header">
      <h2 className="page-title">Patient Details</h2>

      <div className="card-grid" style={{ marginBottom: "24px" }}>
        <div className="stat-card">
          <div className="stat-content">
            <h4>Total Patients</h4>
            <p style={{ fontSize: "1.5rem" }}>{filtered.length}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-content">
            <h4>Loaded Limit</h4>
            <p style={{ fontSize: "1.5rem" }}>{appointments.length}/200</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-content">
            <h4>Total Fees Collected</h4>
            <p style={{ fontSize: "1.5rem", color: "var(--success)" }}>
              Rs. {totalFees.toLocaleString()}
            </p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-content">
            <h4>Accepted</h4>
            <p style={{ fontSize: "1.5rem", color: "var(--primary)" }}>
              {filtered.filter((a) => a.status === "Accepted").length}
            </p>
          </div>
        </div>
      </div>

      <div style={{ marginBottom: "16px" }}>
        <input
          type="text"
          placeholder="Search by patient, doctor, department, address, or record..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: "100%",
            maxWidth: "460px",
            padding: "10px 16px",
            borderRadius: "8px",
            border: "1px solid var(--border)",
            fontSize: "0.95rem",
            outline: "none",
          }}
        />
      </div>

      <div className="data-table-container">
        <table>
          <thead>
            <tr>
              <th>Patient Name</th>
              <th>Address</th>
              <th>Gender</th>
              <th>Contact</th>
              <th>Doctor Details</th>
              <th>Medical Record</th>
              <th>Appointment</th>
              <th>Status</th>
              <th>Visited</th>
              <th>Fee Paid</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length > 0 ? (
              filtered.map((appt) => {
                const doctor = getDoctorDetails(appt);

                return (
                  <tr key={appt._id}>
                    <td style={{ fontWeight: "500", minWidth: "150px" }}>
                      {appt.firstName} {appt.lastName}
                    </td>
                    <td style={{ minWidth: "220px" }}>{appt.address || "Address not added"}</td>
                    <td>{appt.gender}</td>
                    <td style={{ minWidth: "190px" }}>
                      <div>{appt.phone}</div>
                      <div style={{ color: "var(--text-muted)", fontSize: "0.82rem", marginTop: "4px" }}>
                        {appt.email}
                      </div>
                    </td>
                    <td style={{ minWidth: "220px" }}>
                      <div style={{ fontWeight: "600" }}>{doctor.name}</div>
                      <div style={{ color: "var(--primary)", fontSize: "0.85rem", marginTop: "4px" }}>
                        {doctor.department}
                      </div>
                      {doctor.phone ? (
                        <div style={{ color: "var(--text-muted)", fontSize: "0.82rem", marginTop: "4px" }}>
                          {doctor.phone}
                        </div>
                      ) : null}
                      {doctor.email ? (
                        <div style={{ color: "var(--text-muted)", fontSize: "0.82rem", marginTop: "4px" }}>
                          {doctor.email}
                        </div>
                      ) : null}
                    </td>
                    <td style={{ minWidth: "260px" }}>
                      <div>{appt.medicalRecord || appt.patientMessage || "No medical record added"}</div>
                      {appt.doctorReply ? (
                        <div style={{ color: "var(--text-muted)", fontSize: "0.82rem", marginTop: "8px" }}>
                          Reply: {appt.doctorReply}
                        </div>
                      ) : null}
                    </td>
                    <td style={{ minWidth: "140px" }}>{appt.appointment_date}</td>
                    <td>
                      <span
                        className={`status-select status-${appt.status}`}
                        style={{
                          padding: "4px 12px",
                          borderRadius: "12px",
                          fontSize: "0.8rem",
                          fontWeight: "600",
                        }}
                      >
                        {appt.status}
                      </span>
                    </td>
                    <td>{appt.hasVisited ? "Yes" : "No"}</td>
                    <td style={{ fontWeight: "600", color: "var(--success)" }}>
                      Rs. {(appt.fee || 500).toLocaleString()}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="10" style={{ textAlign: "center" }}>
                  No patient records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default Patients;
