import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import OrnamentalDivider from "../components/OrnamentalDivider";
import { useActor } from "../hooks/useActor";

export default function ContactPage() {
  const { actor } = useActor();
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!actor) {
      toast.error("Connecting to backend, please try again.");
      return;
    }
    if (!form.name || !form.email || !form.message) {
      toast.error("Please fill all fields.");
      return;
    }
    setSubmitting(true);
    try {
      await actor.submitContactQuery({
        id: 0n,
        name: form.name,
        email: form.email,
        message: form.message,
        createdAt: BigInt(Date.now()) * 1_000_000n,
      });
      setSubmitted(true);
      toast.success("Message sent! We'll get back to you soon.");
    } catch (e) {
      console.error(e);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <section
        className="py-16 px-4 text-center"
        style={{
          background: "linear-gradient(135deg, #1a0f08 0%, #3A2A1E 100%)",
        }}
      >
        <h1
          className="text-4xl font-bold mb-2"
          style={{ fontFamily: "'Playfair Display', serif", color: "#FAF2E2" }}
        >
          Contact Us
        </h1>
        <p
          style={{ color: "#C9A46A" }}
          className="text-sm tracking-widest uppercase"
        >
          We&apos;d love to hear from you
        </p>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <OrnamentalDivider />

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div data-ocid="contact.section">
            <h2
              className="text-2xl font-bold mb-6"
              style={{ color: "#3A2A1E" }}
            >
              Get in Touch
            </h2>
            <div className="space-y-5 mb-8">
              <div className="flex items-start gap-4">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                  style={{ backgroundColor: "#A95512" }}
                >
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4
                    className="font-bold text-sm"
                    style={{ color: "#3A2A1E" }}
                  >
                    Address
                  </h4>
                  <p className="text-sm" style={{ color: "#5a3a22" }}>
                    Hall Bazaar, Near Golden Temple,
                    <br />
                    Amritsar, Punjab 143001
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                  style={{ backgroundColor: "#A95512" }}
                >
                  <Phone className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4
                    className="font-bold text-sm"
                    style={{ color: "#3A2A1E" }}
                  >
                    Phone
                  </h4>
                  <p className="text-sm" style={{ color: "#5a3a22" }}>
                    +91 98765 43210
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                  style={{ backgroundColor: "#A95512" }}
                >
                  <Mail className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4
                    className="font-bold text-sm"
                    style={{ color: "#3A2A1E" }}
                  >
                    Email
                  </h4>
                  <p className="text-sm" style={{ color: "#5a3a22" }}>
                    sohandihatti@gmail.com
                  </p>
                </div>
              </div>
            </div>

            {/* WhatsApp Button */}
            <a
              href="https://wa.me/919876543210?text=Hi!%20I'd%20like%20to%20enquire%20about%20Sohan%20Di%20Hatti"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded font-semibold text-white transition-opacity hover:opacity-90 mb-8"
              style={{ backgroundColor: "#25D366" }}
              data-ocid="contact.button"
            >
              <MessageCircle className="w-5 h-5" />
              Chat on WhatsApp
            </a>

            {/* Map */}
            <div
              className="rounded-lg overflow-hidden shadow-card"
              style={{ border: "1px solid #C9A46A" }}
            >
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3394.4!2d74.8723!3d31.6340!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x391964b0e7c98bef%3A0x51a23f8feaee4f81!2sHall%20Bazaar%2C%20Amritsar%2C%20Punjab!5e0!3m2!1sen!2sin!4v1"
                width="100%"
                height="240"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Sohan Di Hatti Location"
              />
            </div>
          </div>

          {/* Contact Form */}
          <div data-ocid="contact.panel">
            <h2
              className="text-2xl font-bold mb-6"
              style={{ color: "#3A2A1E" }}
            >
              Send a Message
            </h2>
            {submitted ? (
              <div
                className="rounded-lg p-8 text-center shadow-card"
                style={{
                  backgroundColor: "#FAF2E2",
                  border: "1px solid #C9A46A",
                }}
                data-ocid="contact.success_state"
              >
                <p className="text-4xl mb-4">✉️</p>
                <h3
                  className="font-bold text-lg mb-2"
                  style={{ color: "#A95512" }}
                >
                  Message Received!
                </h3>
                <p className="text-sm" style={{ color: "#5a3a22" }}>
                  Thank you for contacting us. We&apos;ll respond within 24
                  hours.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="mt-4 text-sm font-semibold"
                  style={{ color: "#A95512" }}
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="rounded-lg p-6 shadow-card space-y-4"
                style={{
                  backgroundColor: "#FAF2E2",
                  border: "1px solid #e0d0b0",
                }}
              >
                <div>
                  <label
                    htmlFor="contact-name"
                    className="block text-sm font-semibold mb-1"
                    style={{ color: "#3A2A1E" }}
                  >
                    Your Name
                  </label>
                  <input
                    id="contact-name"
                    value={form.name}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, name: e.target.value }))
                    }
                    placeholder="Full name"
                    className="w-full px-3 py-2 rounded border text-sm outline-none"
                    style={{
                      borderColor: "#C9A46A",
                      backgroundColor: "#F4E9D2",
                    }}
                    data-ocid="contact.input"
                  />
                </div>
                <div>
                  <label
                    htmlFor="contact-email"
                    className="block text-sm font-semibold mb-1"
                    style={{ color: "#3A2A1E" }}
                  >
                    Email Address
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    value={form.email}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, email: e.target.value }))
                    }
                    placeholder="your@email.com"
                    className="w-full px-3 py-2 rounded border text-sm outline-none"
                    style={{
                      borderColor: "#C9A46A",
                      backgroundColor: "#F4E9D2",
                    }}
                    data-ocid="contact.input"
                  />
                </div>
                <div>
                  <label
                    htmlFor="contact-message"
                    className="block text-sm font-semibold mb-1"
                    style={{ color: "#3A2A1E" }}
                  >
                    Message
                  </label>
                  <textarea
                    id="contact-message"
                    value={form.message}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, message: e.target.value }))
                    }
                    placeholder="How can we help you?"
                    rows={5}
                    className="w-full px-3 py-2 rounded border text-sm outline-none resize-none"
                    style={{
                      borderColor: "#C9A46A",
                      backgroundColor: "#F4E9D2",
                    }}
                    data-ocid="contact.textarea"
                  />
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 rounded font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
                  style={{ backgroundColor: "#A95512" }}
                  data-ocid="contact.submit_button"
                >
                  {submitting ? "Sending..." : "Send Message"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
