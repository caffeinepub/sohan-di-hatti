import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, ShoppingCart, X } from "lucide-react";
import { useState } from "react";
import { useCart } from "../context/CartContext";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About Us" },
  { to: "/menu", label: "Menu" },
  { to: "/order", label: "Online Order" },
  { to: "/gallery", label: "Gallery" },
  { to: "/contact", label: "Contact" },
];

export default function Navbar() {
  const { totalItems } = useCart();
  const routerState = useRouterState();
  const pathname = routerState.location.pathname;
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header
      className="sticky top-0 z-40 w-full"
      style={{
        backgroundColor: "#F4E9D2",
        borderTop: "2px solid #C9A46A",
        borderBottom: "2px solid #C9A46A",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link
          to="/"
          className="flex flex-col leading-tight shrink-0"
          data-ocid="nav.link"
        >
          <span
            className="text-2xl font-bold"
            style={{
              fontFamily: "'Playfair Display', serif",
              color: "#A95512",
            }}
          >
            Sohan Di Hatti
          </span>
          <span
            className="text-xs tracking-widest uppercase"
            style={{ color: "#C9A46A" }}
          >
            Heritage Since 1930
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              data-ocid="nav.link"
              className="text-sm font-semibold transition-colors hover:text-burnt-orange"
              style={{
                color: pathname === link.to ? "#A95512" : "#3A2A1E",
                borderBottom:
                  pathname === link.to
                    ? "2px solid #A95512"
                    : "2px solid transparent",
                paddingBottom: "2px",
              }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Cart + Mobile toggle */}
        <div className="flex items-center gap-3">
          <Link
            to="/order"
            className="relative p-2 rounded-full hover:bg-gold/20 transition-colors"
            data-ocid="nav.link"
            aria-label="Cart"
          >
            <ShoppingCart className="w-5 h-5" style={{ color: "#3A2A1E" }} />
            {totalItems > 0 && (
              <span
                className="absolute -top-1 -right-1 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold"
                style={{ backgroundColor: "#A95512" }}
              >
                {totalItems}
              </span>
            )}
          </Link>
          <button
            type="button"
            className="md:hidden p-2"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <nav
          className="md:hidden flex flex-col px-4 pb-4 gap-3"
          style={{ borderTop: "1px solid #C9A46A" }}
        >
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              data-ocid="nav.link"
              onClick={() => setMobileOpen(false)}
              className="text-sm font-semibold py-1"
              style={{ color: pathname === link.to ? "#A95512" : "#3A2A1E" }}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
