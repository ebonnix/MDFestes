import { useState, useRef } from "react";
import { ChevronRight, MessageSquare, Truck, Clock, Users, Mountain, Snowflake, Hammer, Star, Send, Phone, Mail, MapPin, Camera, X, Upload, Instagram, Facebook } from "lucide-react";
import { IMAGES, CONTACT_INFO, PLOWING_SERVICES, CONSTRUCTION_SERVICES, ServiceItem } from "@shared/services";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";

const STATIC_SERVICES = [
  "Snow Plowing",
  "Excavation",
  "Grading & Land Prep",
  "Driveway Maintenance",
  "Construction",
  "Garages",
  "Additions",
  "Decks",
  "Siding",
  "Renovations",
  "Staining",
  "Fencing",
  "Machine Repair",
  "Flatwork & Retaining Walls",
  "Foundations",
  "Broom Finish",
  "Slick Trowel",
  "Stamped Concrete",
  "Drywall",
  "Framing",
  "Flooring",
  "Trim",
  "Windows",
  "Kitchens",
  "Basements",
  "Other",
];

export default function Home() {
  // Reviews state
  const [reviewName, setReviewName] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [reviewService, setReviewService] = useState("");
  const [hoverRating, setHoverRating] = useState(0);

  const { data: reviews, isLoading: reviewsLoading, refetch: refetchReviews } = trpc.reviews.list.useQuery();
  const submitReview = trpc.reviews.submit.useMutation({
    onSuccess: () => {
      toast.success("Thank you for your review!");
      setReviewName("");
      setReviewRating(5);
      setReviewText("");
      setReviewService("");
      refetchReviews();
    },
    onError: () => toast.error("Failed to submit review. Please try again."),
  });

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName.trim() || !reviewText.trim()) {
      toast.error("Please fill in your name and review.");
      return;
    }
    submitReview.mutate({ name: reviewName.trim(), rating: reviewRating, text: reviewText.trim(), service: reviewService.trim() || undefined });
  };

  const averageRating = reviews?.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : "5.0";

  // Contact/Bid form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [message, setMessage] = useState("");
  const [service, setService] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadPhoto = trpc.contact.uploadPhoto.useMutation();
  const submitContact = trpc.contact.submit.useMutation({
    onSuccess: () => {
      toast.success("Your bid request has been sent! We'll be in touch soon.");
      setName(""); setEmail(""); setPhone(""); setAddress(""); setMessage(""); setService("");
      setPhotoFile(null); setPhotoPreview(null);
    },
    onError: () => toast.error("Failed to send. Please try again or call us directly."),
  });

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 16 * 1024 * 1024) { toast.error("Photo must be under 16MB."); return; }
    setPhotoFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setPhotoPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      toast.error("Please fill in your name, email, and message.");
      return;
    }
    let photoUrl: string | undefined;
    let photoKey: string | undefined;
    if (photoFile) {
      setUploading(true);
      try {
        const reader = new FileReader();
        const base64 = await new Promise<string>((resolve, reject) => {
          reader.onload = () => { resolve((reader.result as string).split(",")[1]); };
          reader.onerror = reject;
          reader.readAsDataURL(photoFile);
        });
        const result = await uploadPhoto.mutateAsync({ fileName: photoFile.name, contentType: photoFile.type, fileData: base64 });
        photoUrl = result.url;
        photoKey = result.key;
      } catch { toast.error("Photo upload failed. Submitting without photo."); }
      finally { setUploading(false); }
    }
    submitContact.mutate({ name: name.trim(), email: email.trim(), phone: phone.trim() || undefined, address: address.trim() || undefined, message: message.trim(), service: service || undefined, photoUrl, photoKey });
  };

  const isPending = uploading || submitContact.isPending;

  // Service images from admin
  const { data: imageOverrides } = trpc.serviceImages.getAllPublic.useQuery();

  // Dynamic categories from DB (seeded with built-ins on first load)
  const { data: dbCategories } = trpc.categories.listPublic.useQuery();

  // Use DB as primary source; fall back to hardcoded if DB is empty/loading
  const allPlowing: ServiceItem[] = dbCategories && dbCategories.length > 0
    ? dbCategories.filter(c => c.category === "plowing").map(c => ({
        id: c.serviceId,
        name: c.name,
        description: c.description || "",
        image: c.image || IMAGES.heroPlow,
        category: "plowing" as const,
      }))
    : PLOWING_SERVICES;
  const allConstruction: ServiceItem[] = dbCategories && dbCategories.length > 0
    ? dbCategories.filter(c => c.category === "construction").map(c => ({
        id: c.serviceId,
        name: c.name,
        description: c.description || "",
        image: c.image || IMAGES.heroConstruction,
        category: "construction" as const,
      }))
    : CONSTRUCTION_SERVICES;

  // Build service list for bid form (includes all from DB)
  const dynamicNames = [...allPlowing, ...allConstruction].map(s => s.name);
  const ALL_SERVICES = [...STATIC_SERVICES, ...dynamicNames].filter((v, i, a) => a.indexOf(v) === i);

  return (
    <div className="min-h-screen bg-black">
      <SiteNav />

      {/* ===== HERO SECTION ===== */}
      <section id="home" className="relative pt-16 min-h-screen flex flex-col items-center justify-center">
        <div className="absolute inset-0">
          <img src={IMAGES.heroMountains} alt="Estes Park Mountains" className="w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black" />
        </div>
        <div className="relative z-10 container text-center py-20">
          <h1 className="font-heading text-[8rem] md:text-[12rem] lg:text-[16rem] font-black text-gray-400 leading-none tracking-tight mb-6">
            MDF
          </h1>
          <p className="text-white/70 text-3xl md:text-4xl lg:text-5xl font-heading font-bold max-w-2xl mx-auto mb-4">
            Plowing, Excavation & Construction
          </p>
          <p className="text-white/50 text-base max-w-2xl mx-auto mb-12">
            Proudly serving Estes Park and the surrounding Colorado mountain communities.
          </p>
          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            <a href="#plowing" className="block">
              <div className="group relative overflow-hidden rounded-xl border border-white/10 hover:border-green-500/50 transition-all duration-300 cursor-pointer">
                <div className="aspect-[16/10] relative">
                  <img src={IMAGES.heroPlow} alt="Snow Plow Truck" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <Snowflake className="w-6 h-6 text-green-400" />
                    <h3 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-white">Plowing & Excavation</h3>
                  </div>
                  <p className="text-white/70 text-sm mb-3">Snow removal, excavation, grading, and land preparation</p>
                  <span className="inline-flex items-center gap-1 text-green-400 text-sm font-semibold group-hover:gap-2 transition-all">
                    View Services <ChevronRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </a>
            <a href="#construction" className="block">
              <div className="group relative overflow-hidden rounded-xl border border-white/10 hover:border-green-500/50 transition-all duration-300 cursor-pointer">
                <div className="aspect-[16/10] relative">
                  <img src={IMAGES.heroConstruction} alt="Construction - Hammer and Nail" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <Hammer className="w-6 h-6 text-green-400" />
                    <h3 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-white">Construction</h3>
                  </div>
                  <p className="text-white/70 text-sm mb-3">Full-service construction, remodeling, and concrete work</p>
                  <span className="inline-flex items-center gap-1 text-green-400 text-sm font-semibold group-hover:gap-2 transition-all">
                    View Services <ChevronRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* ===== CREDIBILITY SECTION ===== */}
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

      {/* ===== PLOWING & EXCAVATION SECTION ===== */}
      <section id="plowing" className="py-20 bg-gray-950 scroll-mt-16">
        <div className="container">
          <div className="flex items-center gap-3 mb-4">
            <Snowflake className="w-8 h-8 text-green-400" />
            <h2 className="font-heading text-3xl md:text-5xl font-bold text-white">Plowing & Excavation</h2>
          </div>
          <p className="text-white/70 text-lg max-w-2xl mb-12">
            Reliable snow plowing, excavation, grading, and land preparation services for Estes Park and surrounding mountain communities.
          </p>
          <div className="grid md:grid-cols-2 gap-8">
            {allPlowing.map((svc) => (
              <div key={svc.id} className="group bg-gray-900 rounded-xl overflow-hidden border border-white/5 hover:border-green-500/30 transition-all duration-300">
                <div className="aspect-[16/9] relative overflow-hidden">
                  <img src={imageOverrides?.[svc.id] || svc.image} alt={svc.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent" />
                </div>
                <div className="p-6">
                  <h3 className="font-heading text-xl font-bold text-white mb-2">{svc.name}</h3>
                  <p className="text-white/60 text-sm leading-relaxed">{svc.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CONSTRUCTION SECTION ===== */}
      <section id="construction" className="py-20 bg-black scroll-mt-16">
        <div className="container">
          <div className="flex items-center gap-3 mb-4">
            <Hammer className="w-8 h-8 text-green-400" />
            <h2 className="font-heading text-3xl md:text-5xl font-bold text-white">Construction Services</h2>
          </div>
          <p className="text-white/70 text-lg max-w-2xl mb-12">
            Complete construction services for Estes Park homes and businesses. From foundations to finishing touches, we do it all.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {allConstruction.map((svc) => (
              <div key={svc.id} className="group bg-gray-900 rounded-xl overflow-hidden border border-white/5 hover:border-green-500/30 transition-all duration-300">
                <div className="aspect-[4/3] relative overflow-hidden">
                  <img src={imageOverrides?.[svc.id] || svc.image} alt={svc.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/30 to-transparent" />
                  <div className="absolute bottom-3 left-3">
                    <h3 className="font-heading text-lg font-bold text-white">{svc.name}</h3>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-white/60 text-sm leading-relaxed">{svc.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== REVIEWS SECTION ===== */}
      <section id="reviews" className="py-20 bg-gray-950 scroll-mt-16">
        <div className="container">
          <h2 className="font-heading text-3xl md:text-5xl font-bold text-white mb-4">Customer Reviews</h2>
          <div className="flex items-center gap-4 mb-12">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className="w-6 h-6 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <span className="text-white text-2xl font-bold">{averageRating}</span>
            <span className="text-white/50">({reviews?.length || 0} reviews)</span>
          </div>

          {/* Reviews Grid */}
          {reviewsLoading ? (
            <div className="grid md:grid-cols-2 gap-6 mb-12">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-gray-900 rounded-xl p-6 border border-white/5 animate-pulse">
                  <div className="h-4 bg-gray-800 rounded w-1/3 mb-4" />
                  <div className="h-3 bg-gray-800 rounded w-full mb-2" />
                  <div className="h-3 bg-gray-800 rounded w-2/3" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6 mb-12">
              {reviews?.map((review) => (
                <div key={review.id} className="bg-gray-900 rounded-xl p-6 border border-white/5">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-white font-semibold">{review.name}</h3>
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className={`w-4 h-4 ${star <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-600"}`} />
                      ))}
                    </div>
                  </div>
                  <p className="text-white/70 text-sm leading-relaxed mb-3">{review.text}</p>
                  {review.service && (
                    <span className="inline-block px-2 py-1 bg-green-500/10 text-green-400 text-xs rounded-full border border-green-500/20">
                      {review.service}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Leave a Review Form */}
          <div className="max-w-2xl mx-auto">
            <div className="bg-gray-900 rounded-xl p-8 border border-white/10">
              <h3 className="font-heading text-2xl font-bold text-white mb-6">Leave a Review</h3>
              <form onSubmit={handleReviewSubmit} className="space-y-4">
                <div>
                  <label className="text-white/70 text-sm mb-1 block">Your Name *</label>
                  <Input value={reviewName} onChange={(e) => setReviewName(e.target.value)} placeholder="John Smith" className="bg-gray-800 border-white/10 text-white placeholder:text-white/30" required />
                </div>
                <div>
                  <label className="text-white/70 text-sm mb-1 block">Rating *</label>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button key={star} type="button" onClick={() => setReviewRating(star)} onMouseEnter={() => setHoverRating(star)} onMouseLeave={() => setHoverRating(0)} className="p-1">
                        <Star className={`w-8 h-8 transition-colors ${star <= (hoverRating || reviewRating) ? "fill-yellow-400 text-yellow-400" : "text-gray-600"}`} />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-white/70 text-sm mb-1 block">Service (optional)</label>
                  <Input value={reviewService} onChange={(e) => setReviewService(e.target.value)} placeholder="e.g., Decks, Plowing, Kitchen Remodel" className="bg-gray-800 border-white/10 text-white placeholder:text-white/30" />
                </div>
                <div>
                  <label className="text-white/70 text-sm mb-1 block">Your Review *</label>
                  <Textarea value={reviewText} onChange={(e) => setReviewText(e.target.value)} placeholder="Tell us about your experience..." rows={4} className="bg-gray-800 border-white/10 text-white placeholder:text-white/30" required />
                </div>
                <Button type="submit" disabled={submitReview.isPending} className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold">
                  <Send className="w-4 h-4 mr-2" />
                  {submitReview.isPending ? "Submitting..." : "Submit Review"}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CONTACT / BID SECTION ===== */}
      <section id="contact" className="py-20 bg-black scroll-mt-16">
        <div className="container">
          <h2 className="font-heading text-3xl md:text-5xl font-bold text-white mb-4">Get a Free Bid</h2>
          <p className="text-white/70 text-lg max-w-2xl mb-12">
            Fill out the form below and we'll get back to you with a quote. You can attach a photo of your project to help us give you an accurate estimate.
          </p>

          <div className="grid lg:grid-cols-5 gap-8">
            {/* Contact Info */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-gray-900 rounded-xl p-6 border border-white/5">
                <h3 className="font-heading text-xl font-bold text-white mb-6">Get In Touch</h3>
                <div className="space-y-5">
                  <a href={`tel:${CONTACT_INFO.phone}`} className="flex items-start gap-4 group">
                    <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center shrink-0">
                      <Phone className="w-5 h-5 text-green-400" />
                    </div>
                    <div>
                      <p className="text-white/50 text-sm">Phone</p>
                      <p className="text-white font-semibold group-hover:text-green-400 transition-colors">{CONTACT_INFO.phone}</p>
                    </div>
                  </a>
                  <a href={`mailto:${CONTACT_INFO.email}`} className="flex items-start gap-4 group">
                    <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center shrink-0">
                      <Mail className="w-5 h-5 text-green-400" />
                    </div>
                    <div>
                      <p className="text-white/50 text-sm">Email</p>
                      <p className="text-white font-semibold group-hover:text-green-400 transition-colors">{CONTACT_INFO.email}</p>
                    </div>
                  </a>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center shrink-0">
                      <MapPin className="w-5 h-5 text-green-400" />
                    </div>
                    <div>
                      <p className="text-white/50 text-sm">Location</p>
                      <p className="text-white font-semibold">{CONTACT_INFO.location}</p>
                      <p className="text-white/50 text-xs mt-1">Serving Allenspark, Little Valley, Storm Mountain & beyond</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Media Coming Soon */}
              <div className="bg-gray-900 rounded-xl p-6 border border-white/5">
                <h4 className="text-white/70 text-sm font-medium mb-4 uppercase tracking-wider">Follow Us</h4>
                <div className="flex gap-3">
                  <div className="flex-1 flex items-center gap-3 bg-gray-800/60 rounded-lg px-4 py-3 border border-white/5">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center shrink-0">
                      <Instagram className="w-4 h-4 text-purple-400" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-white/80 text-sm font-medium">Instagram</p>
                      <span className="text-xs text-green-400">Coming Soon</span>
                    </div>
                  </div>
                  <div className="flex-1 flex items-center gap-3 bg-gray-800/60 rounded-lg px-4 py-3 border border-white/5">
                    <div className="w-8 h-8 rounded-lg bg-blue-600/20 flex items-center justify-center shrink-0">
                      <Facebook className="w-4 h-4 text-blue-400" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-white/80 text-sm font-medium">Facebook</p>
                      <span className="text-xs text-green-400">Coming Soon</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Chatbot Teaser */}
              <div className="bg-gradient-to-br from-green-900/20 to-gray-900 rounded-xl p-6 border border-green-500/20">
                <div className="flex items-center gap-3 mb-3">
                  <MessageSquare className="w-6 h-6 text-green-400" />
                  <span className="px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 text-xs font-medium border border-green-500/20">Coming Soon</span>
                </div>
                <p className="text-white font-semibold mb-1">Share a photo and get a bid (40–60% range)</p>
                <p className="text-white/50 text-sm">Our AI-powered instant estimator is coming soon. For now, use the form to send us your project details and photos.</p>
              </div>
            </div>

            {/* Bid Form */}
            <div className="lg:col-span-3">
              <div className="bg-gray-900 rounded-xl p-8 border border-white/10">
                <h3 className="font-heading text-xl font-bold text-white mb-6">Request a Bid</h3>
                <form onSubmit={handleContactSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-white/70 text-sm mb-1.5 block font-medium">Name *</label>
                      <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your full name" className="bg-gray-800 border-white/10 text-white placeholder:text-white/30 focus:border-green-500/50" required />
                    </div>
                    <div>
                      <label className="text-white/70 text-sm mb-1.5 block font-medium">Email *</label>
                      <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" className="bg-gray-800 border-white/10 text-white placeholder:text-white/30 focus:border-green-500/50" required />
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-white/70 text-sm mb-1.5 block font-medium">Phone</label>
                      <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="970-555-1234" className="bg-gray-800 border-white/10 text-white placeholder:text-white/30 focus:border-green-500/50" />
                    </div>
                    <div>
                      <label className="text-white/70 text-sm mb-1.5 block font-medium">Service Needed</label>
                      <select value={service} onChange={(e) => setService(e.target.value)} className="w-full h-10 rounded-md bg-gray-800 border border-white/10 text-white text-sm px-3 focus:outline-none focus:border-green-500/50">
                        <option value="">Select a service...</option>
                        {ALL_SERVICES.map((s) => (<option key={s} value={s}>{s}</option>))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="text-white/70 text-sm mb-1.5 block font-medium">Project Address</label>
                    <Input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="123 Mountain Rd, Estes Park, CO" className="bg-gray-800 border-white/10 text-white placeholder:text-white/30 focus:border-green-500/50" />
                  </div>
                  <div>
                    <label className="text-white/70 text-sm mb-1.5 block font-medium">Project Description *</label>
                    <Textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Describe your project — size, scope, timeline, any specific requirements..." rows={4} className="bg-gray-800 border-white/10 text-white placeholder:text-white/30 focus:border-green-500/50 resize-none" required />
                  </div>
                  <div>
                    <label className="text-white/70 text-sm mb-1.5 block font-medium">
                      <Camera className="w-4 h-4 inline mr-1.5 -mt-0.5" />
                      Attach a Photo (optional, max 16MB)
                    </label>
                    {photoPreview ? (
                      <div className="relative rounded-lg overflow-hidden border border-white/10">
                        <img src={photoPreview} alt="Preview" className="w-full max-h-48 object-cover" />
                        <button type="button" onClick={() => { setPhotoFile(null); setPhotoPreview(null); if (fileInputRef.current) fileInputRef.current.value = ""; }} className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/70 flex items-center justify-center text-white hover:bg-black transition-colors">
                          <X className="w-4 h-4" />
                        </button>
                        <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-3 py-1.5 text-white/70 text-xs truncate">{photoFile?.name}</div>
                      </div>
                    ) : (
                      <button type="button" onClick={() => fileInputRef.current?.click()} className="w-full border-2 border-dashed border-white/10 hover:border-green-500/40 rounded-lg p-6 flex flex-col items-center gap-2 text-white/40 hover:text-white/60 transition-colors">
                        <Upload className="w-8 h-8" />
                        <span className="text-sm">Click to upload a photo of your project</span>
                        <span className="text-xs">JPG, PNG, HEIC up to 16MB</span>
                      </button>
                    )}
                    <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
                  </div>
                  <Button type="submit" disabled={isPending} className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold h-12 text-base active:scale-[0.97] transition-transform">
                    <Send className="w-4 h-4 mr-2" />
                    {uploading ? "Uploading photo..." : submitContact.isPending ? "Sending..." : "Send Bid Request"}
                  </Button>
                  <p className="text-white/30 text-xs text-center">
                    We typically respond within 24 hours. For urgent needs, call us directly at {CONTACT_INFO.phone}.
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
