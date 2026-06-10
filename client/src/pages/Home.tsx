import { Link } from "wouter";
import { Phone, Mail, MapPin, Snowflake, Hammer, ChevronRight, MessageSquare, Truck, Clock, Users, Mountain } from "lucide-react";
import { IMAGES, CONTACT_INFO } from "@shared/services";

export default function Home() {
  return (
    <div className="min-h-screen bg-black">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-sm border-b border-white/10">
        <div className="container flex items-center justify-between h-16">
          <Link href="/">
            <span className="font-heading text-3xl font-black text-gray-400 tracking-tight">MDF</span>
          </Link>
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-white/80">
            <Link href="/plowing" className="hover:text-white transition-colors">Plowing & Excavation</Link>
            <Link href="/construction" className="hover:text-white transition-colors">Construction</Link>
            <Link href="/reviews" className="hover:text-white transition-colors">Reviews</Link>
            <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
          </div>
          <a href={`tel:${CONTACT_INFO.phone}`} className="flex items-center gap-2 text-sm font-semibold text-green-400 hover:text-green-300 transition-colors">
            <Phone className="w-4 h-4" />
            <span className="hidden sm:inline">{CONTACT_INFO.phone}</span>
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-16 min-h-screen flex flex-col items-center justify-center">
        {/* Background */}
        <div className="absolute inset-0">
          <img
            src={IMAGES.heroMountains}
            alt="Estes Park Mountains"
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black" />
        </div>

        {/* Content */}
        <div className="relative z-10 container text-center py-20">
          {/* CSS Text Logo - Large Gray MDF */}
          <h1 className="font-heading text-[8rem] md:text-[12rem] lg:text-[16rem] font-black text-gray-400 leading-none tracking-tight mb-6">
            MDF
          </h1>

          <p className="text-white/70 text-lg md:text-xl max-w-2xl mx-auto mb-4">
            Plowing, Excavation & Construction
          </p>
          <p className="text-white/50 text-base max-w-2xl mx-auto mb-12">
            Proudly serving Estes Park and the surrounding Colorado mountain communities.
          </p>

          {/* Two Split-Path Cards */}
          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {/* Plowing Card */}
            <Link href="/plowing">
              <div className="group relative overflow-hidden rounded-xl border border-white/10 hover:border-green-500/50 transition-all duration-300 cursor-pointer">
                <div className="aspect-[16/10] relative">
                  <img
                    src={IMAGES.heroPlow}
                    alt="Snow Plow Truck"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <Snowflake className="w-6 h-6 text-green-400" />
                    <h3 className="font-heading text-xl md:text-2xl font-bold text-white">Plowing & Excavation</h3>
                  </div>
                  <p className="text-white/70 text-sm mb-3">Snow removal, excavation, grading, and land preparation</p>
                  <span className="inline-flex items-center gap-1 text-green-400 text-sm font-semibold group-hover:gap-2 transition-all">
                    View Services <ChevronRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </Link>

            {/* Construction Card */}
            <Link href="/construction">
              <div className="group relative overflow-hidden rounded-xl border border-white/10 hover:border-green-500/50 transition-all duration-300 cursor-pointer">
                <div className="aspect-[16/10] relative">
                  <img
                    src={IMAGES.heroConstruction}
                    alt="Construction - Hammer and Nail"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <Hammer className="w-6 h-6 text-green-400" />
                    <h3 className="font-heading text-xl md:text-2xl font-bold text-white">Construction</h3>
                  </div>
                  <p className="text-white/70 text-sm mb-3">Full-service construction, remodeling, and concrete work</p>
                  <span className="inline-flex items-center gap-1 text-green-400 text-sm font-semibold group-hover:gap-2 transition-all">
                    View Services <ChevronRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Credibility Section */}
      <section className="relative bg-gradient-to-b from-black to-gray-900 border-t border-white/10 py-16">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {/* 20 Years */}
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="font-heading text-3xl font-bold text-white mb-2">20+ Years</h3>
              <p className="text-white/60 text-sm">Trusted by the Estes Valley for over two decades</p>
            </div>

            {/* Clients */}
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="font-heading text-3xl font-bold text-white mb-2">Trusted Partners</h3>
              <p className="text-white/60 text-sm">HOAs, private owners, ranches, private roads, and county roads</p>
            </div>

            {/* Fleet */}
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center mx-auto mb-4">
                <Truck className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="font-heading text-3xl font-bold text-white mb-2">30+ Vehicles</h3>
              <p className="text-white/60 text-sm">One of the largest fleets in the Estes Park area</p>
            </div>

            {/* Service Area */}
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center mx-auto mb-4">
                <Mountain className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="font-heading text-3xl font-bold text-white mb-2">Remote Access</h3>
              <p className="text-white/60 text-sm">Serving Allenspark, Little Valley, Storm Mountain, and hard-to-reach areas</p>
            </div>
          </div>

          {/* Credibility Statement */}
          <div className="mt-12 text-center max-w-3xl mx-auto">
            <p className="text-white/70 text-lg leading-relaxed">
              For over 20 years, MDF has been the name the Estes Valley trusts for plowing, excavation, and construction. We go where others won't — from Allenspark to Little Valley, Storm Mountain, and every hard-to-get-to spot in between. With a fleet of 30+ vehicles and a reputation built on reliability, we're ready when you need us.
            </p>
          </div>
        </div>
      </section>

      {/* Chatbot Teaser */}
      <section className="relative bg-gradient-to-r from-green-900/30 to-black border-t border-green-500/20">
        <div className="container py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <p className="text-white font-semibold text-lg">Share a photo and get a bid (40–60% range)</p>
              <p className="text-white/50 text-sm">Coming Soon — AI-powered instant estimates</p>
            </div>
          </div>
          <span className="px-4 py-2 rounded-full border border-green-500/30 text-green-400 text-sm font-medium">
            Future Feature
          </span>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black border-t border-white/10 py-12">
        <div className="container">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <span className="font-heading text-4xl font-black text-gray-400 tracking-tight">MDF</span>
              <p className="text-white/50 text-sm mt-4">Proudly serving Estes Park, Colorado and surrounding mountain communities for over 20 years.</p>
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
    </div>
  );
}
