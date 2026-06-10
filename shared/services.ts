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
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310419663031726902/dXSKZo4CTV8xN7g2WYCuTk/hero-construction-e2KWq9FQQZmJbWXbpFfwTp.webp",
    category: "construction",
  },
  {
    id: "garages",
    name: "Garages",
    description: "Custom garage construction built to withstand Colorado mountain weather. Detached, attached, and oversized options available.",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310419663031726902/dXSKZo4CTV8xN7g2WYCuTk/service-garage-gxq7sgd8HDuysSeUqQXuyx.webp",
    category: "construction",
  },
  {
    id: "additions",
    name: "Additions",
    description: "Expand your living space with seamless home additions that match your existing structure and meet mountain building codes.",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310419663031726902/dXSKZo4CTV8xN7g2WYCuTk/service-framing-GX9LKe3yTbJGQmNBg3ijf6.webp",
    category: "construction",
  },
  {
    id: "decks",
    name: "Decks",
    description: "Beautiful, durable decks designed to showcase your mountain views. Cedar, composite, and hardwood options built to last.",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310419663031726902/dXSKZo4CTV8xN7g2WYCuTk/service-deck-kJqavkA2JFjgifxMvWSNma.webp",
    category: "construction",
  },
  {
    id: "siding",
    name: "Siding",
    description: "Professional siding installation and replacement. Protect your home from Colorado's harsh mountain elements with quality materials.",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310419663031726902/dXSKZo4CTV8xN7g2WYCuTk/service-siding-WbS97qhuMFcdWGb5GfkXKd.webp",
    category: "construction",
  },
  {
    id: "renovations",
    name: "Renovations",
    description: "Complete home renovations that transform your space. We handle everything from design to final touches with mountain craftsmanship.",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310419663031726902/dXSKZo4CTV8xN7g2WYCuTk/service-kitchen-nG9S2QABuKNLU83tTxpX9B.webp",
    category: "construction",
  },
  {
    id: "staining",
    name: "Staining",
    description: "Professional wood staining and sealing for decks, fences, and exteriors. Protect and beautify your wood surfaces against UV and moisture.",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310419663031726902/dXSKZo4CTV8xN7g2WYCuTk/service-deck-kJqavkA2JFjgifxMvWSNma.webp",
    category: "construction",
  },
  {
    id: "fencing",
    name: "Fencing",
    description: "Custom fencing solutions for mountain properties. Privacy, split-rail, and decorative options that complement the natural landscape.",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310419663031726902/dXSKZo4CTV8xN7g2WYCuTk/service-fencing-KrCzdUu4eRrCsWSa6LhoTP.webp",
    category: "construction",
  },
  {
    id: "machine-repair",
    name: "Machine Repair",
    description: "Excavation equipment repair and maintenance. Keep your heavy machinery running strong in demanding mountain terrain conditions.",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310419663031726902/dXSKZo4CTV8xN7g2WYCuTk/service-excavation-jTAPT99xZ7ZARnEdnEa3KD.webp",
    category: "construction",
  },
  {
    id: "flatwork-retaining-walls",
    name: "Flatwork & Retaining Walls",
    description: "Expert flatwork and retaining wall construction for mountain properties. Proper drainage and structural integrity for sloped terrain.",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310419663031726902/dXSKZo4CTV8xN7g2WYCuTk/service-concrete-Yfdhf34aAKDbyJF2BeL8ha.webp",
    category: "construction",
  },
  {
    id: "foundations",
    name: "Foundations",
    description: "Solid foundation work for new construction and repairs. Engineered for Colorado's freeze-thaw cycles and mountain soil conditions.",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310419663031726902/dXSKZo4CTV8xN7g2WYCuTk/service-excavation-jTAPT99xZ7ZARnEdnEa3KD.webp",
    category: "construction",
  },
  {
    id: "broom-slick-trowel",
    name: "Broom & Slick Trowel",
    description: "Professional concrete finishing with broom and slick trowel techniques. Durable, slip-resistant surfaces for driveways, patios, and walkways.",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310419663031726902/dXSKZo4CTV8xN7g2WYCuTk/service-concrete-Yfdhf34aAKDbyJF2BeL8ha.webp",
    category: "construction",
  },
  {
    id: "stamped-concrete",
    name: "Stamped Concrete",
    description: "Decorative stamped concrete that mimics natural stone, brick, or slate. Beautiful, low-maintenance surfaces for any outdoor space.",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310419663031726902/dXSKZo4CTV8xN7g2WYCuTk/service-concrete-Yfdhf34aAKDbyJF2BeL8ha.webp",
    category: "construction",
  },
  {
    id: "drywall",
    name: "Drywall",
    description: "Professional drywall installation, repair, and finishing. Clean lines and smooth surfaces for new construction and renovations.",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310419663031726902/dXSKZo4CTV8xN7g2WYCuTk/service-framing-GX9LKe3yTbJGQmNBg3ijf6.webp",
    category: "construction",
  },
  {
    id: "framing",
    name: "Framing",
    description: "Structural framing for new builds and additions. Precision carpentry that forms the backbone of your mountain home.",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310419663031726902/dXSKZo4CTV8xN7g2WYCuTk/service-framing-GX9LKe3yTbJGQmNBg3ijf6.webp",
    category: "construction",
  },
  {
    id: "flooring",
    name: "Flooring",
    description: "All types of flooring installation — hardwood, tile, laminate, vinyl, and carpet. Quality materials and expert installation for every room.",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310419663031726902/dXSKZo4CTV8xN7g2WYCuTk/service-flooring-6bHRB5KXZ39dVER5pm594p.webp",
    category: "construction",
  },
  {
    id: "trim",
    name: "Trim",
    description: "Custom trim and molding installation that adds the finishing touch to any room. Crown molding, baseboards, and custom millwork.",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310419663031726902/dXSKZo4CTV8xN7g2WYCuTk/service-flooring-6bHRB5KXZ39dVER5pm594p.webp",
    category: "construction",
  },
  {
    id: "windows",
    name: "Windows",
    description: "Energy-efficient window installation and replacement. Keep the mountain views in and the cold out with professional window services.",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310419663031726902/dXSKZo4CTV8xN7g2WYCuTk/service-siding-WbS97qhuMFcdWGb5GfkXKd.webp",
    category: "construction",
  },
  {
    id: "kitchens",
    name: "Kitchens",
    description: "Complete kitchen remodeling from cabinets to countertops. Create the mountain kitchen of your dreams with expert craftsmanship.",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310419663031726902/dXSKZo4CTV8xN7g2WYCuTk/service-kitchen-nG9S2QABuKNLU83tTxpX9B.webp",
    category: "construction",
  },
  {
    id: "basements",
    name: "Basements",
    description: "Basement finishing and remodeling that adds valuable living space. From framing to final finishes, we transform your basement.",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310419663031726902/dXSKZo4CTV8xN7g2WYCuTk/service-basement-XL6f96LgBt54GfGarWQkYw.webp",
    category: "construction",
  },
];

export const PLOWING_SERVICES: ServiceItem[] = [
  {
    id: "snow-plowing",
    name: "Snow Plowing",
    description: "Reliable commercial and residential snow plowing throughout Estes Park. Early morning service to keep your property accessible.",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310419663031726902/dXSKZo4CTV8xN7g2WYCuTk/hero-plow-FJnmhTC24uFh2EwYujxTAx.webp",
    category: "plowing",
  },
  {
    id: "excavation",
    name: "Excavation",
    description: "Professional excavation services for foundations, utilities, grading, and land clearing. Heavy equipment operated by experienced professionals.",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310419663031726902/dXSKZo4CTV8xN7g2WYCuTk/service-excavation-jTAPT99xZ7ZARnEdnEa3KD.webp",
    category: "plowing",
  },
  {
    id: "grading",
    name: "Grading & Land Prep",
    description: "Site grading and land preparation for construction projects. Proper drainage solutions for mountain properties.",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310419663031726902/dXSKZo4CTV8xN7g2WYCuTk/service-excavation-jTAPT99xZ7ZARnEdnEa3KD.webp",
    category: "plowing",
  },
  {
    id: "driveway-maintenance",
    name: "Driveway Maintenance",
    description: "Keep your mountain driveway in top condition year-round. Gravel replenishment, grading, and seasonal maintenance services.",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310419663031726902/dXSKZo4CTV8xN7g2WYCuTk/hero-plow-FJnmhTC24uFh2EwYujxTAx.webp",
    category: "plowing",
  },
];

export const CONTACT_INFO = {
  phone: "970-889-5771",
  email: "mdfplowing@gmail.com",
  location: "Estes Park, Colorado",
};

export const IMAGES = {
  logo: "https://d2xsxph8kpxj0f.cloudfront.net/310419663031726902/dXSKZo4CTV8xN7g2WYCuTk/mdf-logo-9J6vcQDL2hdpmp2oF8EoYD.webp",
  heroPlow: "https://d2xsxph8kpxj0f.cloudfront.net/310419663031726902/dXSKZo4CTV8xN7g2WYCuTk/hero-plow-FJnmhTC24uFh2EwYujxTAx.webp",
  heroConstruction: "https://d2xsxph8kpxj0f.cloudfront.net/310419663031726902/dXSKZo4CTV8xN7g2WYCuTk/hero-construction-e2KWq9FQQZmJbWXbpFfwTp.webp",
  heroMountains: "https://d2xsxph8kpxj0f.cloudfront.net/310419663031726902/dXSKZo4CTV8xN7g2WYCuTk/hero-mountains-mipJG3cmsAjkrKJVsv7hF6.webp",
};
