import { Link } from "wouter";
import { Phone, Mail, MapPin } from "lucide-react";
import { CONTACT_INFO } from "@shared/services";

export default function SiteFooter() {
  return (
    <footer className="bg-black border-t border-white/10 py-12">
      <div className="container">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <span className="font-heading text-4xl font-black text-gray-400 tracking-tight">MDF</span>
            <p className="text-white/50 text-sm mt-4">
              Proudly serving Estes Park, Colorado and surrounding mountain communities for over 20 years.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">Services</h4>
            <div className="space-y-2">
              <Link href="/plowing" className="block text-white/60 hover:text-white text-sm transition-colors">Plowing & Excavation</Link>
              <Link href="/construction" className="block text-white/60 hover:text-white text-sm transition-colors">Construction</Link>
              <Link href="/reviews" className="block text-white/60 hover:text-white text-sm transition-colors">Reviews</Link>
              <Link href="/contact" className="block text-white/60 hover:text-white text-sm transition-colors">Contact Us</Link>
            </div>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">Contact</h4>
            <div className="space-y-3">
              <a href={`tel:${CONTACT_INFO.phone}`} className="flex items-center gap-2 text-white/60 hover:text-white text-sm transition-colors">
                <Phone className="w-4 h-4" /> {CONTACT_INFO.phone}
              </a>
              <a href={`mailto:${CONTACT_INFO.email}`} className="flex items-center gap-2 text-white/60 hover:text-white text-sm transition-colors">
                <Mail className="w-4 h-4" /> {CONTACT_INFO.email}
              </a>
              <div className="flex items-center gap-2 text-white/60 text-sm">
                <MapPin className="w-4 h-4" /> {CONTACT_INFO.location}
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10 mt-8 pt-8 text-center text-white/40 text-xs">
          &copy; {new Date().getFullYear()} MDF — Plowing, Excavation & Construction. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
