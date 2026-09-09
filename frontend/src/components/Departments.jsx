import React, { useState } from "react";
import {
  Accessibility,
  Activity,
  Ambulance,
  Baby,
  Bone,
  Brain,
  BrainCircuit,
  Cross,
  Droplets,
  Ear,
  Eye,
  HeartPulse,
  Microscope,
  Pill,
  PillBottle,
  Ribbon,
  ScanLine,
  Scissors,
  ShieldPlus,
  Smile,
  Stethoscope,
  Syringe,
  TestTubes,
  Thermometer,
  Venus,
} from "lucide-react";
import "./Departments.css";

const Departments = () => {
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
  const [showAll, setShowAll] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const visibleDepartments = showAll ? departmentsArray : departmentsArray.slice(0, 10);
  const departmentIcons = {
    Cardiology: HeartPulse,
    Neurology: Brain,
    Orthopedics: Bone,
    Pediatrics: Baby,
    Gynecology: Venus,
    Oncology: Ribbon,
    Dermatology: Activity,
    Radiology: ScanLine,
    Gastroenterology: Pill,
    Nephrology: Droplets,
    "Physical Therapy": Accessibility,
    ENT: Ear,
    Ophthalmology: Eye,
    Psychiatry: BrainCircuit,
    Urology: TestTubes,
    Pulmonology: Activity,
    Dentistry: Smile,
    "General Medicine": Stethoscope,
    "General Surgery": Scissors,
    "Emergency & Trauma": Ambulance,
    "ICU/Critical Care": ShieldPlus,
    Diabetology: Syringe,
    Endocrinology: PillBottle,
    Anesthesiology: Thermometer,
    Pathology: Microscope,
  };
  const departmentDetails = {
    Cardiology: {
      doctors: ["Dr. Aarav Mehta - 9876543210", "Dr. Nisha Rao - 9876543211"],
      description: "Advanced diagnosis and treatment for heart rhythm, blood pressure, coronary artery, and cardiac failure concerns.",
    },
    Neurology: {
      doctors: ["Dr. Kabir Sethi - 9876543212", "Dr. Meera Iyer - 9876543213"],
      description: "Specialized care for stroke, epilepsy, migraine, nerve disorders, movement disorders, and memory-related conditions.",
    },
    Orthopedics: {
      doctors: ["Dr. Rohan Kapoor - 9876543214", "Dr. Priya Menon - 9876543215"],
      description: "Bone, joint, spine, sports injury, fracture, and replacement surgery care with rehabilitation support.",
    },
    Pediatrics: {
      doctors: ["Dr. Tanya Shah - 9876543216", "Dr. Arjun Nair - 9876543217"],
      description: "Complete child healthcare including growth monitoring, infections, vaccinations, nutrition, and newborn care.",
    },
    Gynecology: {
      doctors: ["Dr. Kavya Sharma - 9876543218", "Dr. Sana Qureshi - 9876543219"],
      description: "Women's health services covering pregnancy care, fertility guidance, menstrual concerns, and preventive screening.",
    },
    Oncology: {
      doctors: ["Dr. Dev Malhotra - 9876543220", "Dr. Leena Batra - 9876543221"],
      description: "Cancer screening, diagnosis, chemotherapy coordination, surgical oncology referrals, and long-term follow-up care.",
    },
    Dermatology: {
      doctors: ["Dr. Ishita Sen - 9876543222", "Dr. Neil Dsouza - 9876543223"],
      description: "Treatment for skin, hair, nail, allergy, acne, pigmentation, infection, and cosmetic dermatology concerns.",
    },
    Radiology: {
      doctors: ["Dr. Vikram Joshi - 9876543224", "Dr. Ananya Bose - 9876543225"],
      description: "Imaging support with X-ray, ultrasound, CT, MRI coordination, and expert diagnostic reporting.",
    },
    Gastroenterology: {
      doctors: ["Dr. Harsh Vardhan - 9876543226", "Dr. Ritu Kulkarni - 9876543227"],
      description: "Digestive system care for acidity, liver disease, bowel disorders, endoscopy guidance, and abdominal pain.",
    },
    Nephrology: {
      doctors: ["Dr. Sameer Khan - 9876543228", "Dr. Pooja Reddy - 9876543229"],
      description: "Kidney care including chronic kidney disease, dialysis planning, hypertension-linked kidney issues, and urinary abnormalities.",
    },
    "Physical Therapy": {
      doctors: ["Dr. Amit Bhandari - 9876543230", "Dr. Shreya Das - 9876543231"],
      description: "Rehabilitation for pain, post-surgery recovery, mobility improvement, posture correction, and injury prevention.",
    },
    ENT: {
      doctors: ["Dr. Farhan Ali - 9876543232", "Dr. Neha Verma - 9876543233"],
      description: "Ear, nose, throat, sinus, voice, hearing, tonsil, and balance disorder diagnosis and treatment.",
    },
    Ophthalmology: {
      doctors: ["Dr. Aditya Sinha - 9876543234", "Dr. Mitali Jain - 9876543235"],
      description: "Eye checkups, cataract guidance, glaucoma screening, retina evaluation, and vision correction support.",
    },
    Psychiatry: {
      doctors: ["Dr. Isha Anand - 9876543236", "Dr. Manav Gill - 9876543237"],
      description: "Confidential care for anxiety, depression, sleep concerns, stress, addiction, and emotional wellbeing.",
    },
    Urology: {
      doctors: ["Dr. Nikhil Arora - 9876543238", "Dr. Sara Thomas - 9876543239"],
      description: "Care for kidney stones, urinary infections, prostate concerns, bladder issues, and male reproductive health.",
    },
    Pulmonology: {
      doctors: ["Dr. Akash Roy - 9876543240", "Dr. Hema Pillai - 9876543241"],
      description: "Respiratory care for asthma, COPD, infections, allergies, sleep breathing issues, and lung function testing.",
    },
    Dentistry: {
      doctors: ["Dr. Varun Chopra - 9876543242", "Dr. Diya Mathur - 9876543243"],
      description: "Dental care including cleaning, fillings, root canal support, gum care, extractions, and smile restoration.",
    },
    "General Medicine": {
      doctors: ["Dr. Saurabh Trivedi - 9876543244", "Dr. Radhika Nambiar - 9876543245"],
      description: "Primary medical care for fever, infections, diabetes, hypertension, routine evaluation, and chronic disease follow-up.",
    },
    "General Surgery": {
      doctors: ["Dr. Kunal Desai - 9876543246", "Dr. Malini Krishnan - 9876543247"],
      description: "Surgical consultation for hernia, appendix, gallbladder, wounds, lumps, and minor procedure planning.",
    },
    "Emergency & Trauma": {
      doctors: ["Dr. Parth Bedi - 9876543248", "Dr. Ayesha Mir - 9876543249"],
      description: "Rapid care for accidents, injuries, acute pain, breathing distress, poisoning, and emergency stabilization.",
    },
    "ICU/Critical Care": {
      doctors: ["Dr. Siddharth Rao - 9876543250", "Dr. Juhi Saxena - 9876543251"],
      description: "High-dependency monitoring and life-support care for critically ill patients with multi-speciality coordination.",
    },
    Diabetology: {
      doctors: ["Dr. Pranav Shah - 9876543252", "Dr. Sneha Gokhale - 9876543253"],
      description: "Diabetes diagnosis, insulin planning, lifestyle counseling, complication screening, and long-term sugar control.",
    },
    Endocrinology: {
      doctors: ["Dr. Tarun Bansal - 9876543254", "Dr. Lavanya Rao - 9876543255"],
      description: "Hormone care for thyroid, diabetes, adrenal, pituitary, obesity, and growth-related disorders.",
    },
    Anesthesiology: {
      doctors: ["Dr. Mohit Suri - 9876543256", "Dr. Elina George - 9876543257"],
      description: "Pre-operative evaluation, pain control, anesthesia planning, and procedure safety monitoring.",
    },
    Pathology: {
      doctors: ["Dr. Rajat Khanna - 9876543258", "Dr. Swati Banerjee - 9876543259"],
      description: "Lab diagnostics, blood tests, biopsy reporting, infection panels, and preventive health investigation support.",
    },
  };

  return (
    <section className="excellence-section">
      <div className="container" style={{ padding: "80px 20px" }}>
        <h2 className="section-title">Centre of Excellence</h2>
        <p className="section-subtitle">
          Delivering world-class healthcare with specialized, multi-disciplinary teams
        </p>

        <div className="excellence-grid">
          {visibleDepartments.map((department) => (
            <DepartmentCard
              key={department}
              department={department}
              Icon={departmentIcons[department] || Cross}
              isActive={selectedDepartment === department}
              onSelect={() => setSelectedDepartment(department)}
            />
          ))}
        </div>

        {selectedDepartment ? (
          <div className="dept-detail-panel">
            <div>
              <span className="dept-detail-label">Selected speciality</span>
              <h3>{selectedDepartment}</h3>
              <p>{departmentDetails[selectedDepartment].description}</p>
            </div>
            <div className="dept-doctors">
              <h4>Best doctors in this department</h4>
              {departmentDetails[selectedDepartment].doctors.map((doctor) => (
                <div className="dept-doctor-row" key={doctor}>{doctor}</div>
              ))}
            </div>
          </div>
        ) : null}

        {!showAll ? (
          <div style={{ textAlign: "center", marginTop: "40px" }}>
            <button
              type="button"
              className="btn btn-primary"
              style={{ padding: "12px 30px" }}
              onClick={() => setShowAll(true)}
            >
              View All Specialities
            </button>
          </div>
        ) : null}
      </div>
    </section>
  );
};

const DepartmentCard = ({ department, Icon, isActive, onSelect }) => (
  <button type="button" className={`dept-card ${isActive ? "active" : ""}`} onClick={onSelect}>
    <div className="dept-icon">
      <span className="dept-icon-circle" aria-hidden="true">
        {React.createElement(Icon, { size: 30, strokeWidth: 2.2 })}
      </span>
    </div>
    <h3 className="dept-name">{department}</h3>
    <div className="dept-link-arrow">&rarr;</div>
  </button>
);

export default Departments;
