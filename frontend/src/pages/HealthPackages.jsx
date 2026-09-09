import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { CheckCircle, CreditCard, Landmark, QrCode, Smartphone, Wallet, X } from "lucide-react";
import "./FeaturePages.css";

const HealthPackages = () => {
  const savedPatientKey = "zeecarePackagePatientInfo";
  const today = new Date().toISOString().slice(0, 10);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState("idle");
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    nic: "",
    bookingDate: today,
    gender: "",
    preferredDate: "",
    paymentMethod: "Cash at Hospital",
  });

  const packages = [
    {
      title: "Comprehensive Heart Check",
      icon: "Heart",
      price: 2999,
      features: ["ECG & Echo", "Lipid Profile", "Cardiologist Consultation", "Blood Pressure Monitoring"],
    },
    {
      title: "Master Health Checkup",
      icon: "Full Body",
      price: 4499,
      features: ["Complete Blood Count", "Liver Function Test", "Kidney Function Test", "Thyroid Profile", "Physician Consultation"],
    },
    {
      title: "Women's Wellness Package",
      icon: "Wellness",
      price: 3999,
      features: ["Pap Smear", "Breast Examination", "Bone Density Test", "Gynaecologist Consultation"],
    },
    {
      title: "Senior Citizen Care",
      icon: "Senior Care",
      price: 3499,
      features: ["Eye Checkup", "Hearing Test", "Bone Health", "Geriatrician Consultation"],
    },
  ];

  const paymentOptions = ["Cash at Hospital", "UPI", "Credit/Debit Card", "Net Banking"];

  const renderPaymentIcon = (paymentMethod) => {
    if (paymentMethod === "Cash at Hospital") return <Wallet size={18} />;
    if (paymentMethod === "UPI") return <Smartphone size={18} />;
    if (paymentMethod === "Net Banking") return <Landmark size={18} />;
    return <CreditCard size={18} />;
  };

  useEffect(() => {
    const savedInfo = localStorage.getItem(savedPatientKey);
    if (!savedInfo) return;

    try {
      const parsed = JSON.parse(savedInfo);
      setForm((prev) => ({ ...prev, ...parsed, bookingDate: parsed.bookingDate || today }));
    } catch {
      localStorage.removeItem(savedPatientKey);
    }
  }, []);

  const updateForm = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (field === "paymentMethod") setPaymentStatus("idle");
  };

  const renderQrPattern = () => {
    const activeCells = new Set([
      0, 1, 2, 3, 4, 6, 8, 10, 11, 12, 13, 14, 16, 20, 22, 26, 28, 30, 34, 36, 38, 40,
      42, 43, 44, 45, 46, 48, 50, 53, 55, 57, 60, 63, 66, 70, 72, 74, 76, 78, 80, 81,
      84, 86, 88, 90, 91, 93, 96, 98, 100, 102, 104, 106, 108, 109, 110, 111, 112, 114,
      116, 118, 120,
    ]);

    return (
      <div className="dummy-qr" aria-label="Dummy UPI QR code">
        {Array.from({ length: 121 }, (_, index) => (
          <span key={index} className={activeCells.has(index) ? "active" : ""} />
        ))}
      </div>
    );
  };

  const renderPaymentDetails = () => {
    if (form.paymentMethod === "UPI") {
      return (
        <div className="payment-detail-card">
          <div className="payment-detail-header">
            <QrCode size={20} />
            <strong>Scan and pay with any UPI app</strong>
          </div>
          {renderQrPattern()}
          <p>UPI ID: zeecare.demo@upi</p>
        </div>
      );
    }

    if (form.paymentMethod === "Credit/Debit Card") {
      return (
        <div className="payment-detail-card">
          <div className="payment-detail-header">
            <CreditCard size={20} />
            <strong>Secure card payment</strong>
          </div>
          <div className="payment-fields">
            <input type="text" placeholder="Card Number" inputMode="numeric" />
            <input type="text" placeholder="Name on Card" />
            <input type="text" placeholder="MM/YY" />
            <input type="password" placeholder="CVV" />
          </div>
        </div>
      );
    }

    if (form.paymentMethod === "Net Banking") {
      return (
        <div className="payment-detail-card">
          <div className="payment-detail-header">
            <Landmark size={20} />
            <strong>Select your bank</strong>
          </div>
          <select defaultValue="">
            <option value="" disabled>Choose bank</option>
            <option>State Bank of India</option>
            <option>HDFC Bank</option>
            <option>ICICI Bank</option>
            <option>Axis Bank</option>
          </select>
          <p>You will see a simulated bank confirmation after clicking Pay.</p>
        </div>
      );
    }

    return (
      <div className="payment-detail-card">
        <div className="payment-detail-header">
          <Wallet size={20} />
          <strong>Pay at hospital counter</strong>
        </div>
        <p>A payment token will be generated now. The desk can collect the dummy cash amount at arrival.</p>
      </div>
    );
  };

  const handlePackageEnrollment = async (event) => {
    event.preventDefault();
    if (!selectedPackage) return;

    try {
      setIsSubmitting(true);
      setPaymentStatus("processing");
      const patientInfo = {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phone: form.phone,
        nic: form.nic,
        bookingDate: form.bookingDate,
        gender: form.gender,
      };

      await new Promise((resolve) => setTimeout(resolve, 900));

      const { data } = await axios.post(
        "/api/v1/package/enroll",
        {
          ...patientInfo,
          dob: form.bookingDate,
          preferredDate: form.preferredDate,
          paymentMethod: form.paymentMethod,
          paymentStatus: "Payment Successful",
          packageTitle: selectedPackage.title,
          packagePrice: selectedPackage.price,
        },
        { headers: { "Content-Type": "application/json" } }
      );

      localStorage.setItem(savedPatientKey, JSON.stringify(patientInfo));
      setPaymentStatus("success");
      toast.success(data.message);
      setTimeout(() => {
        setForm((prev) => ({ ...prev, preferredDate: "", paymentMethod: "Cash at Hospital" }));
        setPaymentStatus("idle");
        setSelectedPackage(null);
      }, 1000);
    } catch (error) {
      setPaymentStatus("idle");
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="container">
          <h1>Health Checkup Packages</h1>
          <p>Preventive care is the best care. Choose a package that suits your needs.</p>
        </div>
      </div>

      <div className="container page-content">
        <div className="feature-grid">
          {packages.map((pkg) => (
            <div key={pkg.title} className="feature-card">
              <div className="feature-icon package-icon">{pkg.icon}</div>
              <h3>{pkg.title}</h3>
              <div className="price-tag">Rs. {pkg.price.toLocaleString()}</div>
              <ul style={{ listStyle: "none", padding: 0, margin: "20px 0", textAlign: "left" }}>
                {pkg.features.map((feature) => (
                  <li key={feature} style={{ marginBottom: "10px", color: "var(--text-light)" }}>Included: {feature}</li>
                ))}
              </ul>
              <button type="button" className="btn btn-primary" style={{ width: "100%", gap: "8px" }} onClick={() => setSelectedPackage(pkg)}>
                <CreditCard size={18} />
                Book My Package
              </button>
            </div>
          ))}
        </div>
      </div>

      {selectedPackage ? (
        <div className="package-modal-backdrop" role="dialog" aria-modal="true">
          <form className="package-modal" onSubmit={handlePackageEnrollment}>
            <div className="package-modal-header">
              <div>
                <h2>Book My Package</h2>
                <p>{selectedPackage.title} - Rs. {selectedPackage.price.toLocaleString()}</p>
              </div>
              <button type="button" className="package-close-btn" onClick={() => setSelectedPackage(null)} aria-label="Close">
                <X size={20} />
              </button>
            </div>

            <div className="package-form-grid">
              <input type="text" value={form.firstName} onChange={(e) => updateForm("firstName", e.target.value)} placeholder="First Name" />
              <input type="text" value={form.lastName} onChange={(e) => updateForm("lastName", e.target.value)} placeholder="Last Name" />
              <input type="email" value={form.email} onChange={(e) => updateForm("email", e.target.value)} placeholder="Email" />
              <input type="number" value={form.phone} onChange={(e) => updateForm("phone", e.target.value)} placeholder="Phone" />
              <input type="number" value={form.nic} onChange={(e) => updateForm("nic", e.target.value)} placeholder="NIC" />
              <label>
                <span>Booking Date</span>
                <input type="date" value={form.bookingDate} onChange={(e) => updateForm("bookingDate", e.target.value)} aria-label="Booking Date" />
              </label>
              <select value={form.gender} onChange={(e) => updateForm("gender", e.target.value)}>
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              <label>
                <span>Preferred Visit Date</span>
                <input type="date" value={form.preferredDate} onChange={(e) => updateForm("preferredDate", e.target.value)} aria-label="Preferred Visit Date" />
              </label>
            </div>

            <div className="payment-section">
              <h3>Payment Method</h3>
              <div className="payment-options">
                {paymentOptions.map((value) => (
                  <label className={`payment-option ${form.paymentMethod === value ? "active" : ""}`} key={value}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={value}
                      checked={form.paymentMethod === value}
                      onChange={(e) => updateForm("paymentMethod", e.target.value)}
                    />
                    {renderPaymentIcon(value)}
                    {value}
                  </label>
                ))}
              </div>
              {renderPaymentDetails()}
            </div>

            {paymentStatus !== "idle" ? (
              <div className={`payment-status payment-status-${paymentStatus}`}>
                <CheckCircle size={20} />
                {paymentStatus === "success" ? "Payment Successful" : "Processing dummy payment..."}
              </div>
            ) : null}

            <button type="submit" className="btn btn-primary package-submit-btn" disabled={isSubmitting}>
              <CreditCard size={18} />
              {isSubmitting ? "Processing..." : `Pay Rs. ${selectedPackage.price.toLocaleString()}`}
            </button>
          </form>
        </div>
      ) : null}
    </div>
  );
};

export default HealthPackages;
