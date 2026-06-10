import { Link } from "wouter";
import { ChevronRight, MessageSquare, Truck, Clock, Users, Mountain, Snowflake, Hammer } from "lucide-react";
import { IMAGES, CONTACT_INFO } from "@shared/services";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";

export default function Home() {
  return (
    <div className="min-h-screen bg-black">
      <SiteNav />

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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="font-heading text-3xl font-bold text-white mb-2">20+ Years</h3>
              <p className="text-white/60 text-sm">Trusted by the Estes Valley for over two decades</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="font-heading text-3xl font-bold text-white mb-2">Trusted Partners</h3>
              <p className="text-white/60 text-sm">HOAs, private owners, ranches, private roads, and county roads</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center mx-auto mb-4">
                <Truck className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="font-heading text-3xl font-bold text-white mb-2">30+ Vehicles</h3>
              <p className="text-white/60 text-sm">One of the largest fleets in the Estes Park area</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center mx-auto mb-4">
                <Mountain className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="font-heading text-3xl font-bold text-white mb-2">Remote Access</h3>
              <p className="text-white/60 text-sm">Serving Allenspark, Little Valley, Storm Mountain, and hard-to-reach areas</p>
            </div>
          </div>
          <div className="mt-12 text-center max-w-3xl mx-auto">
            <p className="text-white/70 text-lg leading-relaxed">
              For over 20 years, MDF has been the name the Estes Valley trusts for plowing, excavation, and construction. We go where others won't — from Allenspark to Little Valley, Storm Mountain, and every hard-to-get-to spot in between.
            </p>
          </div>
        </div>
      </section>

      {/* Chatbot Teaser */}
      <section className="relative bg-gradient-to-r from-green-900/30 to-black border-t border-green-500/20">
        <div className="container py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center shrink-0">
              <MessageSquare className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <p className="text-white font-semibold text-lg">Share a photo and get a bid (40–60% range)</p>
              <p className="text-white/50 text-sm">Coming Soon — AI-powered instant estimates</p>
            </div>
          </div>
          <Link href="/contact">
            <span className="px-4 py-2 rounded-full border border-green-500/30 text-green-400 text-sm font-medium hover:bg-green-500/10 transition-colors cursor-pointer">
              Request a Bid Now →
            </span>
          </Link>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
