import { Link } from "wouter";
import { Phone, Mail, Hammer, ArrowLeft } from "lucide-react";
import { CONSTRUCTION_SERVICES, IMAGES, CONTACT_INFO } from "@shared/services";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";

export default function Construction() {
  return (
    <div className="min-h-screen bg-gray-950">
      <SiteNav />

      {/* Hero */}
      <section className="relative pt-16">
        <div className="relative h-[40vh] md:h-[50vh]">
          <img src={IMAGES.heroConstruction} alt="Construction in Estes Park" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-black/50 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="container">
              <Link href="/" className="inline-flex items-center gap-2 text-green-400 text-sm mb-4 hover:text-green-300 transition-colors">
                <ArrowLeft className="w-4 h-4" /> Back to Home
              </Link>
              <div className="flex items-center gap-3 mb-2">
                <Hammer className="w-8 h-8 text-green-400" />
                <h1 className="font-heading text-3xl md:text-5xl font-bold text-white">Construction Services</h1>
              </div>
              <p className="text-white/70 text-lg max-w-2xl">
                Complete construction services for Estes Park homes and businesses. From foundations to finishing touches, we do it all.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16">
        <div className="container">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {CONSTRUCTION_SERVICES.map((service) => (
              <div
                key={service.id}
                className="group bg-gray-900 rounded-xl overflow-hidden border border-white/5 hover:border-green-500/30 transition-all duration-300"
              >
                <div className="aspect-[4/3] relative overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/30 to-transparent" />
                  <div className="absolute bottom-3 left-3">
                    <h3 className="font-heading text-lg font-bold text-white">{service.name}</h3>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-white/60 text-sm leading-relaxed">{service.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-16 text-center bg-gradient-to-r from-green-900/20 to-gray-900 rounded-xl p-8 border border-green-500/20">
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-white mb-4">Ready to Start Your Project?</h2>
            <p className="text-white/60 mb-6 max-w-xl mx-auto">Contact us today for a free estimate on any construction project. No job too big or too small.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href={`tel:${CONTACT_INFO.phone}`} className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
                <Phone className="w-5 h-5" /> Call {CONTACT_INFO.phone}
              </a>
              <Link href="/contact" className="inline-flex items-center gap-2 border border-white/20 hover:border-white/40 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
                <Mail className="w-5 h-5" /> Request a Bid
              </Link>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
