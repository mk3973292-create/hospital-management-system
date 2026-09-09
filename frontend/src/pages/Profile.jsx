import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { Context } from "../Context/AppContext";

const Profile = () => {
  const { isAuthenticated, user } = useContext(Context);
  const [appointments, setAppointments] = useState([]);
  const [messages, setMessages] = useState([]);
  const [activeTab, setActiveTab] = useState("appointments"); // "appointments" or "enquiries"

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apptRes = await axios.get("/api/v1/appointment/my", {
          withCredentials: true,
        });
        setAppointments(apptRes.data.appointments);
      } catch (error) {
        setAppointments([]);
      }

      try {
        const msgRes = await axios.get("/api/v1/message/my", {
          withCredentials: true,
        });
        setMessages(msgRes.data.messages);
      } catch (error) {
        setMessages([]);
      }
    };

    if (isAuthenticated) fetchData();
  }, [isAuthenticated]);

  if (!isAuthenticated) return <Navigate to="/login" />;

  const initials = ((user?.firstName?.[0] || "") + (user?.lastName?.[0] || "")).toUpperCase();

  return (
    <section className="section" style={{ minHeight: "80vh", padding: "40px 20px" }}>
      <div className="container animate-slide-up">
        <div style={{ marginBottom: "28px" }}>
          <h2 className="section-title" style={{ fontSize: "2rem", textAlign: "left", marginBottom: "6px" }}>
            Patient Profile
          </h2>
          <p style={{ color: "var(--text-light)" }}>
            Manage your appointments and view replies to your support enquiries.
          </p>
        </div>

        <div className="profile-container">
          {/* Sidebar - Personal Details */}
          <aside className="profile-sidebar">
            <div className="profile-avatar-container">
              <div className="profile-avatar-circle">{initials}</div>
              <h3 className="profile-sidebar-name">
                {user?.firstName} {user?.lastName}
              </h3>
              <span className="profile-sidebar-role">{user?.role}</span>
            </div>

            <div className="profile-info-list">
              <div className="profile-info-item">
                <span className="profile-info-label">Email</span>
                <span className="profile-info-value">{user?.email}</span>
              </div>
              <div className="profile-info-item">
                <span className="profile-info-label">Phone</span>
                <span className="profile-info-value">{user?.phone}</span>
              </div>
              <div className="profile-info-item">
                <span className="profile-info-label">Gender</span>
                <span className="profile-info-value">{user?.gender}</span>
              </div>
              <div className="profile-info-item">
                <span className="profile-info-label">Date of Birth</span>
                <span className="profile-info-value">
                  {user?.dob ? new Date(user.dob).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  }) : "N/A"}
                </span>
              </div>
              <div className="profile-info-item">
                <span className="profile-info-label">NIC</span>
                <span className="profile-info-value">{user?.nic}</span>
              </div>
            </div>
          </aside>

          {/* Main Content - Tabs */}
          <main className="profile-main-content">
            <div className="profile-tab-header">
              <button
                className={`profile-tab-btn ${activeTab === "appointments" ? "active" : ""}`}
                onClick={() => setActiveTab("appointments")}
              >
                Appointments ({appointments.length})
              </button>
              <button
                className={`profile-tab-btn ${activeTab === "enquiries" ? "active" : ""}`}
                onClick={() => setActiveTab("enquiries")}
              >
                My Enquiries ({messages.length})
              </button>
            </div>

            {/* Appointments Tab Content */}
            {activeTab === "appointments" && (
              <div className="profile-grid">
                {appointments.length > 0 ? (
                  appointments.map((appt) => (
                    <article className="profile-appointment-card animate-slide-up" key={appt._id}>
                      <div className="profile-card-header">
                        <div>
                          <h3 style={{ fontSize: "1.1rem" }}>
                            Dr. {appt.doctor?.firstName} {appt.doctor?.lastName}
                          </h3>
                          <p style={{ fontSize: "0.85rem", color: "var(--text-light)" }}>
                            {appt.department}
                          </p>
                        </div>
                        <span className={`profile-status profile-status-${appt.status}`}>
                          {appt.status}
                        </span>
                      </div>

                      <div className="profile-details">
                        <p style={{ fontSize: "0.9rem" }}>
                          <strong>Date:</strong> {appt.appointment_date}
                        </p>
                        <p style={{ fontSize: "0.9rem" }}>
                          <strong>Fee:</strong> ₹{(appt.fee || 500).toLocaleString()}
                        </p>
                      </div>

                      <div className="profile-message">
                        <h4 style={{ fontSize: "0.9rem", marginBottom: "4px" }}>Your Message</h4>
                        <p style={{ fontSize: "0.85rem", color: "#4b5563" }}>
                          {appt.patientMessage || "No message added."}
                        </p>
                      </div>

                      <div className="profile-message doctor-reply">
                        <h4 style={{ fontSize: "0.9rem", marginBottom: "4px", color: "var(--primary-dark)" }}>
                          Doctor Reply
                        </h4>
                        <p style={{ fontSize: "0.85rem", color: "#1f2937" }}>
                          {appt.doctorReply || "No reply yet."}
                        </p>
                      </div>
                    </article>
                  ))
                ) : (
                  <div style={{ padding: "20px", color: "var(--text-light)" }}>
                    <p>No appointments found.</p>
                  </div>
                )}
              </div>
            )}

            {/* Enquiries Tab Content */}
            {activeTab === "enquiries" && (
              <div className="profile-enquiries-list">
                {messages.length > 0 ? (
                  messages.map((msg) => (
                    <article className="profile-enquiry-card animate-slide-up" key={msg._id}>
                      <div className="enquiry-meta">
                        <span className="enquiry-date">
                          Sent:{" "}
                          {msg.createdAt
                            ? new Date(msg.createdAt).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })
                            : "N/A"}
                        </span>
                        <span
                          className={`reply-badge ${
                            msg.reply
                              ? "reply-badge-answered"
                              : "reply-badge-pending"
                          }`}
                        >
                          {msg.reply ? "Replied" : "Pending"}
                        </span>
                      </div>

                      <div className="enquiry-question">
                        <h5>Your Enquiry</h5>
                        <p>"{msg.message}"</p>
                      </div>

                      {msg.reply ? (
                        <div className="enquiry-response">
                          <h5>Response</h5>
                          <p>{msg.reply}</p>
                          {msg.repliedAt && (
                            <span
                              style={{
                                display: "block",
                                fontSize: "0.75rem",
                                color: "#9ca3af",
                                marginTop: "8px",
                              }}
                            >
                              Replied on:{" "}
                              {new Date(msg.repliedAt).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          )}
                        </div>
                      ) : (
                        <div
                          className="enquiry-response"
                          style={{ borderLeftColor: "#fbbf24" }}
                        >
                          <h5 style={{ color: "#b45309" }}>Status</h5>
                          <p style={{ color: "#6b7280", fontSize: "0.9rem" }}>
                            Our administrative support team is reviewing your enquiry and will reply shortly.
                          </p>
                        </div>
                      )}
                    </article>
                  ))
                ) : (
                  <div style={{ padding: "20px", color: "var(--text-light)" }}>
                    <p>You haven't submitted any enquiries yet.</p>
                  </div>
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </section>
  );
};

export default Profile;
