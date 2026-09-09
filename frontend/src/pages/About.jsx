import { Award, Building2, HeartPulse, ShieldCheck } from "lucide-react";
import "./FeaturePages.css";

const About = () => {
  return (
    <div className="page-container">
      <section className="page-header">
        <div className="container">
          <h1>About ZeeCare Hospitals</h1>
          <p>Patient-first, multi-specialty healthcare with trusted clinical expertise.</p>
        </div>
      </section>

      <main className="container page-content about-page-content">
        <section className="about-intro">
          <div>
            <span className="about-kicker">Hospital Information</span>
            <h2>Care built around people, precision, and access.</h2>
            <p>
              ZeeCare Hospitals has grown from a community clinic into a modern
              multi-specialty hospital serving families with comprehensive
              diagnostics, emergency support, specialty consultations, pharmacy
              services, and coordinated follow-up care.
            </p>
            <p>
              Our teams combine compassionate bedside care with advanced medical
              technology so patients can receive timely treatment in a safer,
              calmer, and more connected hospital environment.
            </p>
          </div>
          <img
            src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=1000&auto=format&fit=crop"
            alt="ZeeCare hospital care team"
          />
        </section>

        <section className="about-stats" aria-label="ZeeCare Hospitals highlights">
          <div>
            <strong>20+</strong>
            <span>Years of care</span>
          </div>
          <div>
            <strong>50k+</strong>
            <span>Patients served</span>
          </div>
          <div>
            <strong>24/7</strong>
            <span>Emergency support</span>
          </div>
          <div>
            <strong>15+</strong>
            <span>Specialty departments</span>
          </div>
        </section>

        <section className="about-values">
          <article>
            <HeartPulse size={30} />
            <h3>Patient-First Care</h3>
            <p>Every treatment plan is guided by dignity, clarity, and comfort.</p>
          </article>
          <article>
            <ShieldCheck size={30} />
            <h3>Clinical Safety</h3>
            <p>Our processes focus on accurate diagnosis, safe care, and reliable follow-up.</p>
          </article>
          <article>
            <Building2 size={30} />
            <h3>Integrated Services</h3>
            <p>Consultations, lab reports, pharmacy, and appointments work together.</p>
          </article>
          <article>
            <Award size={30} />
            <h3>Experienced Teams</h3>
            <p>Specialists and support staff collaborate across departments.</p>
          </article>
        </section>
      </main>
    </div>
  );
};

export default About;
