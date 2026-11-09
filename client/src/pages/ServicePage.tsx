import { useEffect } from "react";
import { Link, useParams } from "wouter";
import { CONSTRUCTION_SERVICES, PLOWING_SERVICES, CONTACT_INFO } from "@shared/services";

const ALL_SERVICES = [...PLOWING_SERVICES, ...CONSTRUCTION_SERVICES];

// Map route slug → service id
const SLUG_MAP: Record<string, string> = {
  "snow-plowing-estes-park": "snow-plowing",
  "excavation-estes-park": "excavation",
  "grading-land-prep-estes-park": "grading",
  "driveway-maintenance-estes-park": "driveway-maintenance",
  "construction-estes-park": "construction",
  "garage-builder-estes-park": "garages",
  "home-additions-estes-park": "additions",
  "deck-builder-estes-park": "decks",
  "siding-contractor-estes-park": "siding",
  "home-renovation-estes-park": "renovations",
  "deck-staining-estes-park": "staining",
  "fencing-contractor-estes-park": "fencing",
  "machine-repair-estes-park": "machine-repair",
  "flatwork-retaining-walls-estes-park": "flatwork-retaining-walls",
  "foundation-contractor-estes-park": "foundations",
  "broom-finish-concrete-estes-park": "broom-finish",
  "slick-trowel-concrete-estes-park": "slick-trowel",
  "stamped-concrete-estes-park": "stamped-concrete",
  "drywall-contractor-estes-park": "drywall",
  "framing-contractor-estes-park": "framing",
  "flooring-installation-estes-park": "flooring",
  "trim-molding-estes-park": "trim",
  "window-installation-estes-park": "windows",
  "kitchen-remodel-estes-park": "kitchens",
  "basement-finishing-estes-park": "basements",
};

interface ServicePageProps {
  slug?: string;
}

export default function ServicePage({ slug: propSlug }: ServicePageProps) {
  const params = useParams<{ slug: string }>();
  const slug = propSlug || params.slug || "";
  const serviceId = SLUG_MAP[slug];
  const service = ALL_SERVICES.find((s) => s.id === serviceId);

  useEffect(() => {
    if (service) {
      document.title = `${service.name} Estes Park | MDF Estes Park | ${CONTACT_INFO.phone}`;
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute(
          "content",
          `${service.description} Licensed contractor serving Estes Park, CO. Call MDF at ${CONTACT_INFO.phone}.`
        );
      }
      const canonical = document.querySelector('link[rel="canonical"]');
      if (canonical) {
        canonical.setAttribute("href", `https://mdfestes.com/${slug}`);
      }
    }
  }, [service, slug]);

  if (!service) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground">
        <h1 className="text-3xl font-bold mb-4">Service Not Found</h1>
        <Link href="/" className="text-primary underline">Back to Home</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Nav back */}
      <nav className="bg-black/80 px-6 py-4 flex items-center gap-4">
        <Link href="/" className="text-white font-semibold text-lg hover:text-yellow-400 transition-colors">
          ← MDF Estes Park
        </Link>
        <span className="text-gray-400">|</span>
        <span className="text-gray-300 text-sm">{service.name}</span>
      </nav>

      {/* Hero */}
      <div className="relative h-72 md:h-96 overflow-hidden">
        <img
          src={service.image}
          alt={`${service.name} in Estes Park CO`}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg">
            {service.name} in Estes Park, CO
          </h1>
          <p className="text-yellow-400 text-xl mt-2 font-semibold">MDF Estes Park — Licensed Contractor</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-bold mb-4 text-foreground">
          Professional {service.name} in Estes Park, Colorado
        </h2>
        <p className="text-muted-foreground text-lg leading-relaxed mb-8">
          {service.description}
        </p>
        <p className="text-muted-foreground text-lg leading-relaxed mb-8">
          MDF Estes Park has been serving the Estes Park area with reliable, high-quality{" "}
          {service.name.toLowerCase()} services. We're a local, licensed contractor who understands the
          unique demands of Colorado's mountain environment — from freeze-thaw cycles to strict local
          building codes. Whether you need work done at a residence, commercial property, or vacation
          rental, we get it done right.
        </p>

        {/* CTA */}
        <div className="bg-yellow-400 rounded-2xl p-8 text-center shadow-lg">
          <h3 className="text-2xl font-bold text-black mb-2">Get a Free Estimate</h3>
          <p className="text-black/80 mb-4">
            Call or text MDF Estes Park today for a fast, free quote on{" "}
            {service.name.toLowerCase()} services.
          </p>
          <a
            href={`tel:${CONTACT_INFO.phone.replace(/-/g, "")}`}
            className="inline-block bg-black text-yellow-400 font-bold text-xl px-8 py-4 rounded-xl hover:bg-gray-900 transition-colors"
          >
            📞 {CONTACT_INFO.phone}
          </a>
          <div className="mt-4">
            <Link
              href="/#contact"
              className="text-black underline font-medium hover:text-gray-800"
            >
              Or fill out our contact form →
            </Link>
          </div>
        </div>

        {/* Service area */}
        <div className="mt-12">
          <h3 className="text-xl font-bold mb-3">Service Area</h3>
          <p className="text-muted-foreground">
            MDF serves Estes Park and surrounding communities including Allenspark, Drake, Glen Haven,
            Lyons, Loveland, and Fort Collins.
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-black text-gray-400 text-center py-6 text-sm mt-8">
        <p>© {new Date().getFullYear()} MDF Estes Park · Estes Park, CO 80517 · {CONTACT_INFO.phone}</p>
        <p className="mt-1">
          <Link href="/" className="underline hover:text-white">Home</Link>
          {" · "}
          <a href={`tel:${CONTACT_INFO.phone.replace(/-/g, "")}`} className="underline hover:text-white">Call Now</a>
        </p>
      </footer>
    </div>
  );
}
