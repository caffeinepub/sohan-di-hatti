import { Link } from "@tanstack/react-router";
import { Heart, Mail, MapPin, Phone } from "lucide-react";
import { useState } from "react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const year = new Date().getFullYear();
  const hostname = encodeURIComponent(window.location.hostname);

  return (
    <footer style={{ backgroundColor: "#A95512", color: "#FAF2E2" }}>
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* About */}
        <div>
          <h3
            className="text-xl font-bold mb-3"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Sohan Di Hatti
          </h3>
          <p className="text-sm leading-relaxed opacity-90">
            Authentic Amritsari mithai and namkeen since 1930. Crafted with love
            by master halwais preserving a century-old tradition.
          </p>
          <div className="flex items-start gap-2 mt-4 text-sm opacity-90">
            <MapPin className="w-4 h-4 shrink-0 mt-0.5" />
            <span>Hall Bazaar, Amritsar, Punjab 143001</span>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4
            className="text-lg font-bold mb-3"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Quick Links
          </h4>
          <ul className="space-y-2 text-sm opacity-90">
            {[
              { to: "/", label: "Home" },
              { to: "/about", label: "About Us" },
              { to: "/menu", label: "Our Menu" },
              { to: "/order", label: "Order Online" },
              { to: "/gallery", label: "Gallery" },
              { to: "/contact", label: "Contact" },
            ].map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="hover:underline">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4
            className="text-lg font-bold mb-3"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Contact Us
          </h4>
          <ul className="space-y-3 text-sm opacity-90">
            <li className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              <span>+91 98765 43210</span>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              <span>sohandihatti@gmail.com</span>
            </li>
            <li className="flex items-start gap-2">
              <MapPin className="w-4 h-4 mt-0.5" />
              <span>Hall Bazaar, Amritsar, Punjab 143001</span>
            </li>
          </ul>
          <p className="text-sm mt-3 opacity-90">
            <strong>Hours:</strong> Mon–Sun, 8am – 10pm
          </p>
        </div>

        {/* Newsletter */}
        <div>
          <h4
            className="text-lg font-bold mb-3"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Newsletter
          </h4>
          <p className="text-sm opacity-90 mb-3">
            Get festival offers &amp; new arrivals in your inbox.
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setEmail("");
            }}
            className="flex flex-col gap-2"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email"
              className="px-3 py-2 rounded text-sm outline-none"
              style={{ backgroundColor: "#FAF2E2", color: "#3A2A1E" }}
              data-ocid="footer.input"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded text-sm font-semibold transition-opacity hover:opacity-90"
              style={{ backgroundColor: "#3A2A1E", color: "#FAF2E2" }}
              data-ocid="footer.submit_button"
            >
              Subscribe
            </button>
          </form>
          <div className="flex gap-4 mt-4 text-sm opacity-90">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              className="hover:underline"
            >
              Facebook
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="hover:underline"
            >
              Instagram
            </a>
          </div>
        </div>
      </div>

      <div
        className="text-center text-xs py-4 opacity-80"
        style={{ borderTop: "1px solid rgba(250,242,226,0.3)" }}
      >
        © {year}. Built with <Heart className="inline w-3 h-3 mx-1" /> using{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${hostname}`}
          className="underline"
          target="_blank"
          rel="noreferrer"
        >
          caffeine.ai
        </a>
      </div>
    </footer>
  );
}
