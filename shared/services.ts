export interface ServiceItem {
  id: string;
  name: string;
  description: string;
  image: string;
  category: "construction" | "plowing";
}

export const CONSTRUCTION_SERVICES: ServiceItem[] = [
  {
    id: "construction",
    name: "Construction",
    description: "Full-service new construction for residential and commercial projects in the Estes Park area. From ground-breaking to final walkthrough, we build it right.",
    image: "/images/05-construction-estes-park.png",
    category: "construction",
  },
  {
    id: "garages",
    name: "Garages",
    description: "Custom garage construction built to withstand Colorado mountain weather. Detached, attached, and oversized options available.",
    image: "/images/06-garages-estes-park.png",
    category: "construction",
  },
  {
    id: "additions",
    name: "Additions",
    description: "Expand your living space with seamless home additions that match your existing structure and meet mountain building codes.",
    image: "/images/07-additions-estes-park.png",
    category: "construction",
  },
  {
    id: "decks",
    name: "Decks",
    description: "Beautiful, durable decks designed to showcase your mountain views. Cedar, composite, and hardwood options built to last.",
    image: "/images/08-decks-estes-park.png",
    category: "construction",
  },
  {
    id: "siding",
    name: "Siding",
    description: "Professional siding installation and replacement. Protect your home from Colorado's harsh mountain elements with quality materials.",
    image: "/images/09-siding-estes-park.png",
    category: "construction",
  },
  {
    id: "renovations",
    name: "Renovations",
    description: "Complete home renovations that transform your space. We handle everything from design to final touches with mountain craftsmanship.",
    image: "/images/10-renovations-estes-park.png",
    category: "construction",
  },
  {
    id: "staining",
    name: "Staining",
    description: "Professional wood staining and sealing for decks, fences, and exteriors. Protect and beautify your wood surfaces against UV and moisture.",
    image: "/images/11-staining-estes-park.png",
    category: "construction",
  },
  {
    id: "fencing",
    name: "Fencing",
    description: "Custom fencing solutions for mountain properties. Privacy, split-rail, and decorative options that complement the natural landscape.",
    image: "/images/12-fencing-estes-park.png",
    category: "construction",
  },
  {
    id: "machine-repair",
    name: "Machine Repair",
    description: "Excavation equipment repair and maintenance. Keep your heavy machinery running strong in demanding mountain terrain conditions.",
    image: "/images/13-machine-repair-estes-park.png",
    category: "construction",
  },
  {
    id: "flatwork-retaining-walls",
    name: "Flatwork & Retaining Walls",
    description: "Expert flatwork and retaining wall construction for mountain properties. Proper drainage and structural integrity for sloped terrain.",
    image: "/images/14-flatwork-retaining-walls-estes-park.png",
    category: "construction",
  },
  {
    id: "foundations",
    name: "Foundations",
    description: "Solid foundation work for new construction and repairs. Engineered for Colorado's freeze-thaw cycles and mountain soil conditions.",
    image: "/images/15-foundations-estes-park.png",
    category: "construction",
  },
  {
    id: "broom-finish",
    name: "Broom Finish",
    description: "Professional broom-finished concrete for sidewalks, driveways, and patios. Durable, slip-resistant textured surfaces built to last in mountain weather.",
    image: "/images/16-broom-finish-estes-park.png",
    category: "construction",
  },
  {
    id: "slick-trowel",
    name: "Slick Trowel",
    description: "Smooth, polished slick trowel concrete finishing for garage floors and interior surfaces. Clean, professional results with a glossy finish.",
    image: "/images/17-slick-trowel-estes-park.png",
    category: "construction",
  },
  {
    id: "stamped-concrete",
    name: "Stamped Concrete",
    description: "Decorative stamped concrete that mimics natural stone, brick, or slate. Beautiful, low-maintenance surfaces for any outdoor space.",
    image: "/images/18-stamped-concrete-estes-park.png",
    category: "construction",
  },
  {
    id: "drywall",
    name: "Drywall",
    description: "Professional drywall installation, repair, and finishing. Clean lines and smooth surfaces for new construction and renovations.",
    image: "/images/19-drywall-estes-park.png",
    category: "construction",
  },
  {
    id: "framing",
    name: "Framing",
    description: "Structural framing for new builds and additions. Precision carpentry that forms the backbone of your mountain home.",
    image: "/images/20-framing-estes-park.png",
    category: "construction",
  },
  {
    id: "flooring",
    name: "Flooring",
    description: "All types of flooring installation — hardwood, tile, laminate, vinyl, and carpet. Quality materials and expert installation for every room.",
    image: "/images/21-flooring-estes-park.png",
    category: "construction",
  },
  {
    id: "trim",
    name: "Trim",
    description: "Custom trim and molding installation that adds the finishing touch to any room. Crown molding, baseboards, window casings, and custom millwork.",
    image: "/images/22-trim-estes-park.png",
    category: "construction",
  },
  {
    id: "windows",
    name: "Windows",
    description: "Energy-efficient window installation and replacement. Keep the mountain views in and the cold out with professional window services.",
    image: "/images/23-windows-estes-park.png",
    category: "construction",
  },
  {
    id: "kitchens",
    name: "Kitchens",
    description: "Complete kitchen remodeling from cabinets to countertops. Create the mountain kitchen of your dreams with expert craftsmanship.",
    image: "/images/24-kitchens-estes-park.png",
    category: "construction",
  },
  {
    id: "basements",
    name: "Basements",
    description: "Basement finishing and remodeling that adds valuable living space. From framing to final finishes, we transform your basement.",
    image: "/images/25-basements-estes-park.png",
    category: "construction",
  },
];

export const PLOWING_SERVICES: ServiceItem[] = [
  {
    id: "snow-plowing",
    name: "Snow Plowing",
    description: "Reliable commercial and residential snow plowing throughout Estes Park. Early morning service to keep your property accessible.",
    image: "/images/01-snow-plowing-estes-park.png",
    category: "plowing",
  },
  {
    id: "excavation",
    name: "Excavation",
    description: "Professional excavation services for foundations, utilities, grading, and land clearing. Heavy equipment operated by experienced professionals.",
    image: "/images/02-excavation-estes-park.png",
    category: "plowing",
  },
  {
    id: "grading",
    name: "Grading & Land Prep",
    description: "Site grading and land preparation for construction projects. Proper drainage solutions for mountain properties.",
    image: "/images/03-grading-land-prep-estes-park.png",
    category: "plowing",
  },
  {
    id: "driveway-maintenance",
    name: "Driveway Maintenance",
    description: "Keep your mountain driveway in top condition year-round. Gravel replenishment, grading, and seasonal maintenance services.",
    image: "/images/04-driveway-maintenance-estes-park.png",
    category: "plowing",
  },
];

export const CONTACT_INFO = {
  phone: "970-889-5771",
  email: "mdfestes@gmail.com",
  location: "Estes Park, Colorado",
};

export const IMAGES = {
  logo: "/images/05-construction-estes-park.png",
  heroPlow: "/images/01-snow-plowing-estes-park.png",
  heroConstruction: "/images/05-construction-estes-park.png",
  heroMountains: "/images/03-grading-land-prep-estes-park.png",
  mikePhoto: "/manus-storage/Screenshot_20260610_171111_Messenger_14faf9f5.jpg",
};
