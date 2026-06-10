import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Phone, Menu, X } from "lucide-react";
import { CONTACT_INFO } from "@shared/services";

const navLinks = [
  { href: "/plowing", label: "Plowing & Excavation" },
  { href: "/construction", label: "Construction" },
  { href: "/reviews", label: "Reviews" },
  { href: "/contact", label: "Contact" },
];

export default function SiteNav() {
  const [open, setOpen] = useState(false);
  const [location] = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-sm border-b border-white/10">
      <div className="container flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" onClick={() => setOpen(false)}>
          <span className="font-heading text-3xl font-black text-gray-400 tracking-tight">MDF</span>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-white/80">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`hover:text-white transition-colors ${location === link.href ? "text-green-400" : ""}`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Mobile: centered Get Bid Now */}
        <div className="md:hidden flex-1 flex justify-center">
          <Link
            href="/contact"
            className="px-5 py-2 bg-green-600 hover:bg-green-500 text-white text-sm font-bold rounded-lg transition-colors shadow-lg shadow-green-600/20"
          >
            Get Bid Now
          </Link>
        </div>

        {/* Desktop: Get Bid Now + Phone */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/contact"
            className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white text-sm font-bold rounded-lg transition-colors shadow-lg shadow-green-600/20"
          >
            Get Bid Now
          </Link>
          <a
            href={`tel:${CONTACT_INFO.phone}`}
            className="flex items-center gap-2 text-sm font-semibold text-green-400 hover:text-green-300 transition-colors"
          >
            <Phone className="w-4 h-4" />
            <span>{CONTACT_INFO.phone}</span>
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex items-center justify-center w-9 h-9 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden bg-black/95 border-t border-white/10 px-4 pb-4">
          <div className="flex flex-col gap-1 pt-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`py-3 px-4 rounded-lg text-sm font-medium transition-colors ${
                  location === link.href
                    ? "bg-green-500/10 text-green-400"
                    : "text-white/70 hover:text-white hover:bg-white/5"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <a
              href={`tel:${CONTACT_INFO.phone}`}
              className="mt-2 py-3 px-4 rounded-lg text-sm font-semibold text-green-400 bg-green-500/10 flex items-center gap-2"
            >
              <Phone className="w-4 h-4" />
              {CONTACT_INFO.phone}
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
