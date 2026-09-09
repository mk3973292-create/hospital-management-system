import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const Appointment = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [nic, setNic] = useState("");
  const [dob, setDob] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [department, setDepartment] = useState("Cardiology");
  const [doctorFirstName, setDoctorFirstName] = useState("");
  const [doctorLastName, setDoctorLastName] = useState("");
  const [selectedDoctorId, setSelectedDoctorId] = useState("");
  const [hasVisited, setHasVisited] = useState(false);
  const [patientMessage, setPatientMessage] = useState("");
  const [medicalRecord, setMedicalRecord] = useState("");

  const departmentsArray = [
    "Cardiology",
    "Neurology",
    "Orthopedics",
    "Pediatrics",
    "Gynecology",
    "Oncology",
    "Dermatology",
    "Radiology",
    "Gastroenterology",
    "Nephrology",
    "Physical Therapy",
    "ENT",
    "Ophthalmology",
    "Psychiatry",
    "Urology",
    "Pulmonology",
    "Dentistry",
    "General Medicine",
    "General Surgery",
    "Emergency & Trauma",
    "ICU/Critical Care",
    "Diabetology",
    "Endocrinology",
    "Anesthesiology",
    "Pathology",
  ];

  const [doctors, setDoctors] = useState([]);

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

  const handleAppointment = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        "/api/v1/appointment/post",
        {
          firstName,
          lastName,
          email,
          phone,
          address,
          nic,
          dob,
          gender,
          appointment_date: appointmentDate,
          department,
          doctor_firstName: doctorFirstName,
          doctor_lastName: doctorLastName,
          doctorId: selectedDoctorId,
          hasVisited,
          patientMessage: patientMessage.trim(),
          medicalRecord: medicalRecord.trim(),
        },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      toast.success(data.message);
      setFirstName(""); setLastName(""); setEmail(""); setPhone(""); setAddress(""); setNic(""); setDob(""); setAge(""); setGender(""); setAppointmentDate(""); setPatientMessage(""); setMedicalRecord(""); setSelectedDoctorId(""); setDoctorFirstName(""); setDoctorLastName("");
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  return (
    <section className="section" style={{ minHeight: "80vh", padding: "40px 20px" }}>
      <div className="container" style={{ maxWidth: "800px" }}>
        <div className="glass-card" style={{ padding: "40px", background: "white" }}>
          <h2 className="section-title" style={{ fontSize: "2rem", marginBottom: "8px" }}>Book Appointment</h2>
          <p className="section-subtitle" style={{ marginBottom: "32px", fontSize: "1rem" }}>Please login before booking an appointment, if you face authentication errors.</p>

          <form onSubmit={handleAppointment}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
              <div className="form-group"><input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="form-input" placeholder="First Name" /></div>
              <div className="form-group"><input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} className="form-input" placeholder="Last Name" /></div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
              <div className="form-group"><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="form-input" placeholder="Email" /></div>
              <div className="form-group"><input type="number" value={phone} onChange={(e) => setPhone(e.target.value)} className="form-input" placeholder="Phone" /></div>
            </div>

            <div className="form-group">
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="form-input"
                placeholder="Address"
                rows="3"
                maxLength="300"
                style={{ resize: "vertical" }}
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "20px" }}>
              <div className="form-group"><input type="number" value={nic} onChange={(e) => setNic(e.target.value)} className="form-input" placeholder="NIC" style={{ marginTop: '22px' }} /></div>
              <div className="form-group">
                <div style={{ fontSize: '13px', color: '#666', marginBottom: '4px', marginLeft: '4px' }}>Date of Birth</div>
                <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} className="form-input" />
              </div>
              <div className="form-group">
                <div style={{ fontSize: '13px', color: '#666', marginBottom: '4px', marginLeft: '4px' }}>Age</div>
                <input type="number" value={age} onChange={(e) => setAge(e.target.value)} className="form-input" placeholder="Age" />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", alignItems: "end" }}>
              <div className="form-group">
                <select value={gender} onChange={(e) => setGender(e.target.value)} className="form-input">
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <div style={{ fontSize: '13px', color: '#666', marginBottom: '4px', marginLeft: '4px' }}>Appointment Date</div>
                <input type="date" value={appointmentDate} onChange={(e) => setAppointmentDate(e.target.value)} className="form-input" />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
              <div className="form-group">
                <select value={department} onChange={(e) => { setDepartment(e.target.value); setSelectedDoctorId(""); setDoctorFirstName(""); setDoctorLastName(""); }} className="form-input">
                  {departmentsArray.map((depart, index) => (
                    <option value={depart} key={index}>{depart}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <select value={selectedDoctorId} onChange={(e) => {
                  const selectedDoctor = doctors.find((doctor) => doctor._id === e.target.value);
                  setSelectedDoctorId(e.target.value);
                  setDoctorFirstName(selectedDoctor?.firstName || "");
                  setDoctorLastName(selectedDoctor?.lastName || "");
                  if (selectedDoctor?.doctorDepartment) {
                    setDepartment(selectedDoctor.doctorDepartment);
                  }
                }} className="form-input">
                  <option value="">Select Doctor</option>
                  {doctors.map((doctor) => (
                    <option value={doctor._id} key={doctor._id}>
                      Dr. {doctor.firstName} {doctor.lastName} - {doctor.doctorDepartment || "Department not added"}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group" style={{ display: "flex", gap: "10px", alignItems: "center", marginTop: "10px" }}>
              <p style={{ fontWeight: "500" }}>Have you visited before?</p>
              <input type="checkbox" checked={hasVisited} onChange={(e) => setHasVisited(e.target.checked)} style={{ width: "20px", height: "20px" }} />
            </div>

            <div className="form-group" style={{ marginTop: "20px" }}>
              <textarea
                value={patientMessage}
                onChange={(e) => setPatientMessage(e.target.value)}
                className="form-input"
                placeholder="Message for doctor (optional)"
                rows="4"
                maxLength="500"
                style={{ resize: "vertical" }}
              />
            </div>

            <div className="form-group" style={{ marginTop: "20px" }}>
              <textarea
                value={medicalRecord}
                onChange={(e) => setMedicalRecord(e.target.value)}
                className="form-input"
                placeholder="Medical record, history, allergies, or current medicines (optional)"
                rows="4"
                maxLength="1000"
                style={{ resize: "vertical" }}
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: "100%", padding: "14px", marginTop: "24px" }}>Schedule Appointment</button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Appointment;
