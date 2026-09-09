import React, { useContext, useEffect, useState } from "react";
import { Context } from "../Context/AppContext";
import { Navigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const Messages = () => {
  const { isAuthenticated } = useContext(Context);
  const [messages, setMessages] = useState([]);
  const [replyDrafts, setReplyDrafts] = useState({});

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const { data } = await axios.get("/api/v1/message/getall", {
          withCredentials: true,
        });
        setMessages(data.messages);
      } catch (error) {
        console.log(error.response.data.message);
      }
    };
    if (isAuthenticated) fetchMessages();
  }, [isAuthenticated]);

  const handleReplyChange = (messageId, value) => {
    setReplyDrafts((prev) => ({ ...prev, [messageId]: value }));
  };

  const handleSendReply = async (messageId) => {
    const reply = replyDrafts[messageId]?.trim();
    if (!reply) {
      toast.error("Please write a reply first.");
      return;
    }

    try {
      const { data } = await axios.put(
        `/api/v1/message/reply/${messageId}`,
        { reply },
        { withCredentials: true }
      );
      setMessages((prev) =>
        prev.map((message) => (message._id === messageId ? data.patientMessage : message))
      );
      setReplyDrafts((prev) => ({ ...prev, [messageId]: "" }));
      toast.success(data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  if (!isAuthenticated) return <Navigate to="/login" />;

  return (
    <section className="page-header">
      <h2 className="page-title">Patient Messages</h2>
      <div className="card-grid" style={{ gridTemplateColumns: "1fr" }}>
        {messages.length > 0 ? (
          messages.map((element) => (
            <div className="stat-card" key={element._id} style={{ flexDirection: "column", alignItems: "flex-start", gap: "8px" }}>
              <h4>{element.firstName} {element.lastName}</h4>
              <div style={{ display: "flex", gap: "16px", color: "var(--text-muted)", fontSize: "0.9rem" }}>
                <p>Email: {element.email}</p>
                <p>Phone: {element.phone}</p>
              </div>
              <p style={{ marginTop: "8px" }}>"{element.message}"</p>
              {element.reply ? (
                <div style={{ background: "var(--accent-bg)", borderRadius: "8px", padding: "12px", width: "100%" }}>
                  <strong>Reply</strong>
                  <p style={{ marginTop: "6px" }}>{element.reply}</p>
                </div>
              ) : null}
              <div style={{ display: "flex", gap: "8px", alignItems: "flex-start", width: "100%" }}>
                <textarea
                  value={replyDrafts[element._id] || ""}
                  onChange={(e) => handleReplyChange(element._id, e.target.value)}
                  placeholder={element.reply ? "Update reply" : "Write reply"}
                  maxLength="500"
                  rows="2"
                  className="table-textarea"
                  style={{ flex: 1 }}
                />
                <button
                  type="button"
                  className="table-action-btn"
                  onClick={() => handleSendReply(element._id)}
                >
                  Send
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No messages available.</p>
        )}
      </div>
    </section>
  );
};

export default Messages;
