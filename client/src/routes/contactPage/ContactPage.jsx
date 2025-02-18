import "./Contact.scss";
import { useState } from "react";
import { Mail, MapPin, Phone } from "lucide-react";
import apiRequest from "../../lib/apiRequest.js";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await apiRequest.post("/contacts", formData);

      if (response.status === 201) {
        setSuccess(true);
        // Reset form
        setFormData({
          name: "",
          email: "",
          subject: "",
          message: "",
        });
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-page">
      <main className="contact-container">
        {error && <div className="error-message">{error}</div>}
        {success && (
          <div className="success-message">
            Your message has been sent successfully. We'll get back to you soon!
          </div>
        )}
        <div className="contact-grid">
          {/* Contact Form Section */}
          <div className="contact-form-section">
            <div>
              <h1 className="contact-heading">Get in Touch</h1>
              <p className="contact-subheading">
                Have questions about our properties? Fill out the form and we'll
                get back to you shortly.
              </p>
            </div>

            <form className="contact-form" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="name" className="form-label">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  placeholder="John Doe"
                  className="form-input"
                  required
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="email" className="form-label">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  placeholder="john@example.com"
                  className="form-input"
                  required
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="subject" className="form-label">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  placeholder="Inquiry about..."
                  className="form-input"
                  required
                  value={formData.subject}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="message" className="form-label">
                  Message
                </label>
                <textarea
                  id="message"
                  placeholder="Tell us about your requirements..."
                  className="form-textarea"
                  required
                  value={formData.message}
                  onChange={handleChange}
                />
              </div>

              <button
                type="submit"
                className="submit-button"
                disabled={loading}
              >
                {loading ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>

          {/* Contact Information Section */}
          <div className="contact-info-section">
            <h2 className="info-heading">Contact Information</h2>
            <p className="info-subheading">
              Feel free to reach out to us using the information below.
            </p>
            <div className="info-list">
              <div className="info-item">
                <Phone className="info-icon" />
                <p>+91 8210070921</p>
              </div>
              <div className="info-item">
                <Mail className="info-icon" />
                <p>ezyhomes@gmail.com</p>
              </div>
              <div className="info-item">
                <MapPin className="info-icon" />
                <p>123 Main St, Bengaluru,Karnataka, India </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
