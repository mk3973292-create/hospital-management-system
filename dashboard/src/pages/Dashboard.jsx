import React, { useContext, useEffect, useState } from "react";
import { Context } from "../Context/AppContext";
import { Navigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { Activity, Ambulance, CalendarCheck, IndianRupee, MapPin, PackageCheck, Stethoscope, Users } from "lucide-react";

const Dashboard = () => {
  const { isAuthenticated, admin } = useContext(Context);
  const [appointments, setAppointments] = useState([]);
  const [ambulanceRequests, setAmbulanceRequests] = useState([]);
  const [packageEnrollments, setPackageEnrollments] = useState([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const { data } = await axios.get("/api/v1/appointment/getall", {
          withCredentials: true,
        });
        setAppointments(data.appointments);
      } catch {
        setAppointments([]);
      }
    };

    const fetchAmbulanceRequests = async () => {
      try {
        const { data } = await axios.get("/api/v1/ambulance/getall", {
          withCredentials: true,
        });
        setAmbulanceRequests(data.ambulanceRequests);
      } catch {
        setAmbulanceRequests([]);
      }
    };

    const fetchPackageEnrollments = async () => {
      try {
        const { data } = await axios.get("/api/v1/package/getall", {
          withCredentials: true,
        });
        setPackageEnrollments(data.enrollments || []);
      } catch {
        setPackageEnrollments([]);
      }
    };

    if (isAuthenticated) {
      fetchAppointments();
      fetchAmbulanceRequests();
      fetchPackageEnrollments();
      const appointmentRefresh = setInterval(fetchAppointments, 10000);
      return () => clearInterval(appointmentRefresh);
    }
  }, [isAuthenticated]);

  const handleUpdateStatus = async (appointmentId, status) => {
    try {
      const { data } = await axios.put(
        `/api/v1/appointment/update/${appointmentId}`,
        { status },
        { withCredentials: true }
      );
      setAppointments((prev) =>
        prev.map((appt) => (appt._id === appointmentId ? { ...appt, status } : appt))
      );
      toast.success(data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const handleUpdateAmbulanceStatus = async (requestId, status) => {
    try {
      const { data } = await axios.put(
        `/api/v1/ambulance/update/${requestId}`,
        { status },
        { withCredentials: true }
      );
      setAmbulanceRequests((prev) =>
        prev.map((request) => (request._id === requestId ? data.ambulanceRequest : request))
      );
      toast.success(status === "Dispatched" ? "Ambulance van dispatched!" : data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  if (!isAuthenticated) return <Navigate to="/login" />;

  const pendingCount = appointments.filter((appt) => appt.status === "Pending").length;
  const acceptedCount = appointments.filter((appt) => appt.status === "Accepted").length;
  const totalFees = appointments.reduce((sum, appt) => sum + (appt.fee || 500), 0);
  const packageRevenue = packageEnrollments.reduce((sum, enrollment) => sum + (enrollment.packagePrice || 0), 0);
  const activeAmbulanceCount = ambulanceRequests.filter((request) => request.status === "Requested").length;

  const doctorPatientMap = {};
  appointments.forEach((appt) => {
    const docName = `Dr. ${appt.doctor?.firstName || ""} ${appt.doctor?.lastName || ""}`.trim();
    if (!doctorPatientMap[docName]) {
      doctorPatientMap[docName] = { count: 0, department: appt.department };
    }
    doctorPatientMap[docName].count++;
  });

  return (
    <section className="page-header">
      <h2 className="page-title">Overview</h2>

      <div className="card-grid">
        <div className="stat-card">
          <div className="stat-icon"><Users size={24} /></div>
          <div className="stat-content">
            <h4>Welcome Admin</h4>
            <p style={{ fontSize: "1.2rem" }}>{admin?.firstName} {admin?.lastName}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ color: "var(--warning)", background: "rgba(255, 183, 3, 0.1)" }}><Activity size={24} /></div>
          <div className="stat-content">
            <h4>Pending Appointments</h4>
            <p>{pendingCount}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ color: "var(--success)", background: "rgba(46, 196, 182, 0.1)" }}><CalendarCheck size={24} /></div>
          <div className="stat-content">
            <h4>Accepted Appointments</h4>
            <p>{acceptedCount}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ color: "#e040fb", background: "rgba(224, 64, 251, 0.1)" }}><IndianRupee size={24} /></div>
          <div className="stat-content">
            <h4>Total Revenue</h4>
            <p>Rs. {(totalFees + packageRevenue).toLocaleString()}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ color: "var(--danger)", background: "rgba(239, 35, 60, 0.1)" }}><Ambulance size={24} /></div>
          <div className="stat-content">
            <h4>Ambulance Requests</h4>
            <p>{activeAmbulanceCount}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ color: "#047857", background: "rgba(4, 120, 87, 0.1)" }}><PackageCheck size={24} /></div>
          <div className="stat-content">
            <h4>Package Bookings</h4>
            <p>{packageEnrollments.length}</p>
          </div>
        </div>
      </div>

      <h3 style={{ marginBottom: "16px" }}><Ambulance size={20} style={{ verticalAlign: "middle", marginRight: "8px" }} />Emergency Ambulance Requests</h3>
      <div className="data-table-container" style={{ marginBottom: "32px" }}>
        <table>
          <thead>
            <tr>
              <th>Patient</th>
              <th>Phone</th>
              <th>Location</th>
              <th>Details</th>
              <th>Status</th>
              <th>Dispatch</th>
            </tr>
          </thead>
          <tbody>
            {ambulanceRequests.length > 0 ? (
              ambulanceRequests.map((request) => (
                <tr key={request._id}>
                  <td>{request.patientName}</td>
                  <td><a href={`tel:${request.phone}`}>{request.phone}</a></td>
                  <td>
                    <a
                      href={`https://www.google.com/maps?q=${request.latitude},${request.longitude}`}
                      target="_blank"
                      rel="noreferrer"
                      className="table-map-link"
                    >
                      <MapPin size={16} /> Open map
                    </a>
                    <div style={{ color: "var(--text-muted)", fontSize: "0.82rem", marginTop: "4px" }}>
                      {Number(request.latitude).toFixed(5)}, {Number(request.longitude).toFixed(5)}
                    </div>
                  </td>
                  <td style={{ minWidth: "240px" }}>
                    <strong>{request.address || "No address added"}</strong>
                    <p style={{ color: "var(--text-muted)", marginTop: "4px" }}>{request.note || "No note"}</p>
                  </td>
                  <td>
                    <select
                      className={`status-select ambulance-status-${request.status}`}
                      value={request.status}
                      onChange={(e) => handleUpdateAmbulanceStatus(request._id, e.target.value)}
                    >
                      <option value="Requested">Requested</option>
                      <option value="Dispatched">Dispatched</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td>
                    <button
                      type="button"
                      className="table-action-btn ambulance-dispatch-btn"
                      onClick={() => handleUpdateAmbulanceStatus(request._id, "Dispatched")}
                      disabled={request.status === "Dispatched" || request.status === "Completed"}
                    >
                      Send Van
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="6" style={{ textAlign: "center" }}>No ambulance requests found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <h3 style={{ marginBottom: "16px" }}><PackageCheck size={20} style={{ verticalAlign: "middle", marginRight: "8px" }} />Booked Health Packages</h3>
      <div className="data-table-container" style={{ marginBottom: "32px" }}>
        <table>
          <thead>
            <tr>
              <th>Patient</th>
              <th>Contact</th>
              <th>Package</th>
              <th>Booking Date</th>
              <th>Visit Date</th>
              <th>Payment</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {packageEnrollments.length > 0 ? (
              packageEnrollments.map((enrollment) => (
                <tr key={enrollment._id}>
                  <td style={{ fontWeight: "600", minWidth: "150px" }}>{enrollment.firstName} {enrollment.lastName}</td>
                  <td style={{ minWidth: "190px" }}>
                    <div>{enrollment.phone}</div>
                    <div style={{ color: "var(--text-muted)", fontSize: "0.82rem", marginTop: "4px" }}>{enrollment.email}</div>
                  </td>
                  <td style={{ minWidth: "220px" }}>
                    <div>{enrollment.packageTitle}</div>
                    <div style={{ color: "var(--success)", fontSize: "0.85rem", fontWeight: "700", marginTop: "4px" }}>
                      Rs. {(enrollment.packagePrice || 0).toLocaleString()}
                    </div>
                  </td>
                  <td>{enrollment.dob ? new Date(enrollment.dob).toLocaleDateString() : "Not added"}</td>
                  <td>{enrollment.preferredDate}</td>
                  <td style={{ minWidth: "180px" }}>
                    <div>{enrollment.paymentMethod}</div>
                    <span className="package-payment-success">{enrollment.paymentStatus || "Payment Successful"}</span>
                  </td>
                  <td><span className="package-status-badge">{enrollment.status}</span></td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="7" style={{ textAlign: "center" }}>No package bookings found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <h3 style={{ marginBottom: "16px" }}>Recent Appointments</h3>
      <div className="data-table-container">
        <table>
          <thead>
            <tr>
              <th>Patient</th>
              <th>Date</th>
              <th>Doctor</th>
              <th>Department</th>
              <th>Fee</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {appointments.length > 0 ? (
              appointments.map((appt) => (
                <tr key={appt._id}>
                  <td>{appt.firstName} {appt.lastName}</td>
                  <td>{appt.appointment_date}</td>
                  <td>Dr. {appt.doctor?.firstName || ""} {appt.doctor?.lastName || ""}</td>
                  <td>{appt.department}</td>
                  <td style={{ fontWeight: "600", color: "var(--success)" }}>Rs. {(appt.fee || 500).toLocaleString()}</td>
                  <td>
                    <select
                      className={`status-select status-${appt.status}`}
                      value={appt.status}
                      onChange={(e) => handleUpdateStatus(appt._id, e.target.value)}
                    >
                      <option value="Pending" className="status-Pending">Pending</option>
                      <option value="Accepted" className="status-Accepted">Accepted</option>
                      <option value="Rejected" className="status-Rejected">Rejected</option>
                    </select>
                  </td>
                  <td>{appt.hasVisited ? "Visited" : "New"}</td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="7" style={{ textAlign: "center" }}>No appointments found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <h3 style={{ marginBottom: "16px", marginTop: "32px" }}><Stethoscope size={20} style={{ verticalAlign: "middle", marginRight: "8px" }} />Patients Per Doctor</h3>
      <div className="card-grid">
        {Object.keys(doctorPatientMap).length > 0 ? (
          Object.entries(doctorPatientMap).map(([docName, info]) => (
            <div className="stat-card" key={docName} style={{ flexDirection: "column", alignItems: "flex-start", gap: "8px" }}>
              <h4 style={{ margin: 0 }}>{docName}</h4>
              <span style={{ fontSize: "0.85rem", color: "var(--primary)", fontWeight: "500" }}>{info.department}</span>
              <div style={{ fontSize: "1.4rem", fontWeight: "700", marginTop: "4px" }}>
                {info.count} <span style={{ fontSize: "0.85rem", fontWeight: "400", color: "var(--text-muted)" }}>patient{info.count !== 1 ? "s" : ""}</span>
              </div>
            </div>
          ))
        ) : (
          <p>No data available.</p>
        )}
      </div>
    </section>
  );
};

export default Dashboard;
