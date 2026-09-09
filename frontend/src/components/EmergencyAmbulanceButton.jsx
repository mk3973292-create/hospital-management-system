import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Ambulance, LocateFixed, Phone, X } from "lucide-react";

const EmergencyAmbulanceButton = ({ className = "", children, variant = "badge" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    patientName: "",
    phone: "",
    address: "",
    note: "",
    latitude: "",
    longitude: "",
  });

  const updateForm = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const captureLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Location is not supported by this browser.");
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setForm((prev) => ({
          ...prev,
          latitude: position.coords.latitude.toString(),
          longitude: position.coords.longitude.toString(),
        }));
        setIsLocating(false);
        toast.success("Patient location captured.");
      },
      () => {
        setIsLocating(false);
        toast.error("Please allow location access or enter coordinates manually.");
      },
      { enableHighAccuracy: true, timeout: 12000 }
    );
  };

  const submitRequest = async (event) => {
    event.preventDefault();

    if (!form.patientName.trim() || !form.phone.trim() || !form.latitude || !form.longitude) {
      toast.error("Please add patient details and location.");
      return;
    }

    try {
      setIsSubmitting(true);
      const { data } = await axios.post("/api/v1/ambulance/request", form);
      toast.success(data.message);
      setIsOpen(false);
      setForm({
        patientName: "",
        phone: "",
        address: "",
        note: "",
        latitude: "",
        longitude: "",
      });
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <button type="button" className={className} onClick={() => setIsOpen(true)}>
        {children || (
          <>
            <Ambulance size={variant === "badge" ? 14 : 18} />
            Emergency
          </>
        )}
      </button>

      {isOpen ? (
        <div className="emergency-modal-backdrop" role="dialog" aria-modal="true">
          <form className="emergency-modal" onSubmit={submitRequest}>
            <div className="emergency-modal-header">
              <div>
                <h2>Send Ambulance</h2>
                <p>Share the patient location with the emergency desk.</p>
              </div>
              <button type="button" className="emergency-close-btn" onClick={() => setIsOpen(false)} aria-label="Close">
                <X size={20} />
              </button>
            </div>

            <div className="emergency-fields">
              <label>
                Patient name
                <input
                  type="text"
                  value={form.patientName}
                  onChange={(event) => updateForm("patientName", event.target.value)}
                  placeholder="Full name"
                />
              </label>
              <label>
                Phone
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(event) => updateForm("phone", event.target.value)}
                  placeholder="Contact number"
                />
              </label>
              <label className="emergency-full-field">
                Address
                <input
                  type="text"
                  value={form.address}
                  onChange={(event) => updateForm("address", event.target.value)}
                  placeholder="Building, street, landmark"
                />
              </label>
              <label className="emergency-full-field">
                Emergency note
                <textarea
                  value={form.note}
                  onChange={(event) => updateForm("note", event.target.value)}
                  placeholder="Condition, floor, or pickup details"
                  maxLength="300"
                />
              </label>
            </div>

            <button type="button" className="location-btn" onClick={captureLocation} disabled={isLocating}>
              <LocateFixed size={18} />
              {isLocating ? "Capturing location..." : "Use Patient Location"}
            </button>

            {form.latitude && form.longitude ? (
              <p className="location-preview">
                Location ready: {Number(form.latitude).toFixed(5)}, {Number(form.longitude).toFixed(5)}
              </p>
            ) : null}

            <div className="emergency-modal-actions">
              <a href="tel:1755000222" className="call-emergency-link">
                <Phone size={16} />
                Call emergency
              </a>
              <button type="submit" className="send-ambulance-btn" disabled={isSubmitting}>
                <Ambulance size={18} />
                {isSubmitting ? "Sending..." : "Send Ambulance Van"}
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </>
  );
};

export default EmergencyAmbulanceButton;
