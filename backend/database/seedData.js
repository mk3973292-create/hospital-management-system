import { User } from "../models/userSchema.js";
import { Appointment } from "../models/appointmentSchema.js";
import cloudinary from "cloudinary";

export const seedDoctors = async () => {
    try {
        const count = await User.countDocuments({ role: "Doctor" });
        if (count > 0) return; // Already seeded

        const doctors = [
            {
                firstName: "Aman",
                lastName: "Gupta",
                email: "aman.gupta@example.com",
                phone: "9876543210",
                password: "password123",
                gender: "Male",
                dob: new Date("1980-05-15"),
                nic: "123456789012",
                role: "Doctor",
                doctorDepartment: "Cardiology",
                docAvatar: { public_id: "placeholder", url: "https://randomuser.me/api/portraits/men/11.jpg" }
            },
            {
                firstName: "Priya",
                lastName: "Sharma",
                email: "priya.sharma@example.com",
                phone: "9876543211",
                password: "password123",
                gender: "Female",
                dob: new Date("1985-08-22"),
                nic: "123456789013",
                role: "Doctor",
                doctorDepartment: "Neurology",
                docAvatar: { public_id: "placeholder", url: "https://randomuser.me/api/portraits/women/11.jpg" }
            },
            {
                firstName: "Vikram",
                lastName: "Singh",
                email: "vikram.singh@example.com",
                phone: "9876543212",
                password: "password123",
                gender: "Male",
                dob: new Date("1978-11-10"),
                nic: "123456789014",
                role: "Doctor",
                doctorDepartment: "Orthopaedics",
                docAvatar: { public_id: "placeholder", url: "https://randomuser.me/api/portraits/men/22.jpg" }
            },
            {
                firstName: "Neha",
                lastName: "Verma",
                email: "neha.verma@example.com",
                phone: "9876543213",
                password: "password123",
                gender: "Female",
                dob: new Date("1990-02-14"),
                nic: "123456789015",
                role: "Doctor",
                doctorDepartment: "Pediatrics",
                docAvatar: { public_id: "placeholder", url: "https://randomuser.me/api/portraits/women/22.jpg" }
            },
            {
                firstName: "Arjun",
                lastName: "Patel",
                email: "arjun.patel@example.com",
                phone: "9876543214",
                password: "password123",
                gender: "Male",
                dob: new Date("1982-07-30"),
                nic: "123456789016",
                role: "Doctor",
                doctorDepartment: "ENT",
                docAvatar: { public_id: "placeholder", url: "https://randomuser.me/api/portraits/men/33.jpg" }
            },
            {
                firstName: "Sneha",
                lastName: "Reddy",
                email: "sneha.reddy@example.com",
                phone: "9876543215",
                password: "password123",
                gender: "Female",
                dob: new Date("1988-03-25"),
                nic: "123456789017",
                role: "Doctor",
                doctorDepartment: "Dermatology",
                docAvatar: { public_id: "placeholder", url: "https://randomuser.me/api/portraits/women/33.jpg" }
            },
            {
                firstName: "Rohan",
                lastName: "Mehta",
                email: "rohan.mehta@example.com",
                phone: "9876543216",
                password: "password123",
                gender: "Male",
                dob: new Date("1975-09-12"),
                nic: "123456789018",
                role: "Doctor",
                doctorDepartment: "Oncology",
                docAvatar: { public_id: "placeholder", url: "https://randomuser.me/api/portraits/men/44.jpg" }
            },
            {
                firstName: "Kavya",
                lastName: "Iyer",
                email: "kavya.iyer@example.com",
                phone: "9876543217",
                password: "password123",
                gender: "Female",
                dob: new Date("1992-11-05"),
                nic: "123456789019",
                role: "Doctor",
                doctorDepartment: "Gastroenterology",
                docAvatar: { public_id: "placeholder", url: "https://randomuser.me/api/portraits/women/44.jpg" }
            },
            {
                firstName: "Siddharth",
                lastName: "Joshi",
                email: "siddharth.joshi@example.com",
                phone: "9876543218",
                password: "password123",
                gender: "Male",
                dob: new Date("1983-06-18"),
                nic: "123456789020",
                role: "Doctor",
                doctorDepartment: "Radiology",
                docAvatar: { public_id: "placeholder", url: "https://randomuser.me/api/portraits/men/55.jpg" }
            },
            {
                firstName: "Anjali",
                lastName: "Desai",
                email: "anjali.desai@example.com",
                phone: "9876543219",
                password: "password123",
                gender: "Female",
                dob: new Date("1987-12-09"),
                nic: "123456789021",
                role: "Doctor",
                doctorDepartment: "Physical Therapy",
                docAvatar: { public_id: "placeholder", url: "https://randomuser.me/api/portraits/women/55.jpg" }
            }
        ];

        for (const doctor of doctors) {
            await User.create(doctor);
        }
        console.log("Seeded default doctors successfully.");
    } catch (error) {
        console.log("Error seeding doctors:", error);
    }
};

export const seedAdmin = async () => {
    try {
        const count = await User.countDocuments({ role: "Admin" });
        if (count > 0) return; // Already seeded

        const admin = {
            firstName: "Super",
            lastName: "Admin",
            email: "admin@hospital.com",
            phone: "1111111111",
            password: "password123",
            gender: "Male",
            dob: new Date("1990-01-01"),
            nic: "111111111111",
            role: "Admin"
        };
        await User.create(admin);
        console.log("Seeded default admin successfully.");
    } catch (error) {
        console.log("Error seeding admin:", error);
    }
};

export const seedDummyPatients = async () => {
    try {
        const existingAppointments = await Appointment.countDocuments();
        if (existingAppointments > 0) return;

        const doctors = await User.find({ role: "Doctor" }).select("_id firstName lastName doctorDepartment");
        if (doctors.length === 0) return;

        const patientNames = [
            ["Aarav", "Mehta"],
            ["Isha", "Kapoor"],
            ["Kabir", "Rao"],
            ["Meera", "Nair"],
            ["Riya", "Malhotra"],
            ["Arjun", "Saxena"],
            ["Ananya", "Bose"],
            ["Vivaan", "Khanna"],
            ["Tara", "Menon"],
            ["Reyansh", "Shah"],
            ["Nisha", "Yadav"],
            ["Dev", "Chopra"],
            ["Saanvi", "Mishra"],
            ["Karan", "Bhatia"],
            ["Pooja", "Kulkarni"],
            ["Aditya", "Jain"],
            ["Simran", "Kaur"],
            ["Rahul", "Agarwal"],
            ["Diya", "Sinha"],
            ["Manav", "Trivedi"]
        ];

        const addresses = [
            "12 Lake View Road, Pune",
            "44 Park Street, Kolkata",
            "7 MG Road, Bengaluru",
            "91 Civil Lines, Jaipur",
            "28 Green Avenue, Delhi",
            "63 Marine Drive, Mumbai",
            "18 Anna Nagar, Chennai",
            "52 Banjara Hills, Hyderabad",
            "9 Sector 21, Chandigarh",
            "35 Hazratganj, Lucknow"
        ];

        const medicalRecords = [
            "History of mild asthma. Uses inhaler as needed.",
            "Type 2 diabetes under medication. Fasting sugar monitoring advised.",
            "Hypertension, regular BP follow-up required.",
            "Seasonal allergy with occasional sinus congestion.",
            "Post-surgery follow-up. Wound healing normally.",
            "Migraine episodes twice a month. Neurology review requested.",
            "Knee pain after sports injury. Physiotherapy advised.",
            "Routine pediatric checkup. Vaccination records reviewed.",
            "Dermatitis flare-up. Topical medication prescribed.",
            "Cardiac screening requested due to family history."
        ];

        const patients = await Promise.all(patientNames.map(([firstName, lastName], index) => (
            User.create({
                firstName,
                lastName,
                email: `patient${index + 1}@example.com`,
                phone: String(9000000000 + index),
                password: "password123",
                gender: index % 2 === 0 ? "Male" : "Female",
                dob: new Date(1985 + (index % 18), index % 12, (index % 27) + 1),
                nic: String(222222222222 + index),
                role: "Patient"
            })
        )));

        const appointments = patients.map((patient, index) => {
            const doctor = doctors[index % doctors.length];
            const appointmentDate = new Date();
            appointmentDate.setDate(appointmentDate.getDate() + (index % 14));

            return {
                firstName: patient.firstName,
                lastName: patient.lastName,
                email: patient.email,
                phone: patient.phone,
                address: addresses[index % addresses.length],
                nic: patient.nic,
                dob: patient.dob,
                gender: patient.gender,
                appointment_date: appointmentDate.toISOString().slice(0, 10),
                department: doctor.doctorDepartment,
                doctor: {
                    firstName: doctor.firstName,
                    lastName: doctor.lastName,
                },
                hasVisited: index % 3 === 0,
                doctorId: doctor._id,
                patientId: patient._id,
                status: ["Pending", "Accepted", "Rejected"][index % 3],
                fee: 500 + ((index % 5) * 100),
                patientMessage: "Dummy appointment record for dashboard testing.",
                medicalRecord: medicalRecords[index % medicalRecords.length],
                doctorReply: index % 4 === 0 ? "Continue current care plan and follow up if symptoms worsen." : "",
                repliedAt: index % 4 === 0 ? new Date() : undefined,
            };
        });

        await Appointment.create(appointments);
        console.log("Seeded dummy patients and appointments successfully.");
    } catch (error) {
        console.log("Error seeding dummy patients:", error);
    }
};
