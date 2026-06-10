import { useState, useRef } from "react";
import { Link } from "wouter";
import { Phone, Mail, MapPin, Send, ArrowLeft, MessageSquare, Camera, X, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CONTACT_INFO } from "@shared/services";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";

const ALL_SERVICES = [
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

export default function Contact() {
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
      setName("");
      setEmail("");
      setPhone("");
      setAddress("");
      setMessage("");
      setService("");
      setPhotoFile(null);
      setPhotoPreview(null);
    },
    onError: () => {
      toast.error("Failed to send. Please try again or call us directly.");
    },
  });

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 16 * 1024 * 1024) {
      toast.error("Photo must be under 16MB.");
      return;
    }
    setPhotoFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setPhotoPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
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
          reader.onload = () => {
            const result = reader.result as string;
            resolve(result.split(",")[1]);
          };
          reader.onerror = reject;
          reader.readAsDataURL(photoFile);
        });
        const result = await uploadPhoto.mutateAsync({
          fileName: photoFile.name,
          contentType: photoFile.type,
          fileData: base64,
        });
        photoUrl = result.url;
        photoKey = result.key;
      } catch {
        toast.error("Photo upload failed. Submitting without photo.");
      } finally {
        setUploading(false);
      }
    }

    submitContact.mutate({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim() || undefined,
      address: address.trim() || undefined,
      message: message.trim(),
      service: service || undefined,
      photoUrl,
      photoKey,
    });
  };

  const isPending = uploading || submitContact.isPending;

  return (
    <div className="min-h-screen bg-gray-950">
      <SiteNav />

      {/* Header */}
      <section className="pt-24 pb-12">
        <div className="container">
          <Link href="/" className="inline-flex items-center gap-2 text-green-400 text-sm mb-6 hover:text-green-300 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
          <h1 className="font-heading text-3xl md:text-5xl font-bold text-white mb-4">Get a Free Bid</h1>
          <p className="text-white/70 text-lg max-w-2xl">
            Fill out the form below and we'll get back to you with a quote. You can attach a photo of your project to help us give you an accurate estimate.
          </p>
        </div>
      </section>

      {/* Contact Info + Form */}
      <section className="pb-16">
        <div className="container">
          <div className="grid lg:grid-cols-5 gap-8">
            {/* Contact Info */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-gray-900 rounded-xl p-6 border border-white/5">
                <h2 className="font-heading text-xl font-bold text-white mb-6">Get In Touch</h2>
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
                <h2 className="font-heading text-xl font-bold text-white mb-6">Request a Bid</h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Name + Email */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-white/70 text-sm mb-1.5 block font-medium">Name *</label>
                      <Input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your full name"
                        className="bg-gray-800 border-white/10 text-white placeholder:text-white/30 focus:border-green-500/50"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-white/70 text-sm mb-1.5 block font-medium">Email *</label>
                      <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com"
                        className="bg-gray-800 border-white/10 text-white placeholder:text-white/30 focus:border-green-500/50"
                        required
                      />
                    </div>
                  </div>

                  {/* Phone + Service */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-white/70 text-sm mb-1.5 block font-medium">Phone</label>
                      <Input
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="970-555-1234"
                        className="bg-gray-800 border-white/10 text-white placeholder:text-white/30 focus:border-green-500/50"
                      />
                    </div>
                    <div>
                      <label className="text-white/70 text-sm mb-1.5 block font-medium">Service Needed</label>
                      <select
                        value={service}
                        onChange={(e) => setService(e.target.value)}
                        className="w-full h-10 rounded-md bg-gray-800 border border-white/10 text-white text-sm px-3 focus:outline-none focus:border-green-500/50"
                      >
                        <option value="">Select a service...</option>
                        {ALL_SERVICES.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Address */}
                  <div>
                    <label className="text-white/70 text-sm mb-1.5 block font-medium">Project Address</label>
                    <Input
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="123 Mountain Rd, Estes Park, CO"
                      className="bg-gray-800 border-white/10 text-white placeholder:text-white/30 focus:border-green-500/50"
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label className="text-white/70 text-sm mb-1.5 block font-medium">Project Description *</label>
                    <Textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Describe your project — size, scope, timeline, any specific requirements..."
                      rows={4}
                      className="bg-gray-800 border-white/10 text-white placeholder:text-white/30 focus:border-green-500/50 resize-none"
                      required
                    />
                  </div>

                  {/* Photo Upload */}
                  <div>
                    <label className="text-white/70 text-sm mb-1.5 block font-medium">
                      <Camera className="w-4 h-4 inline mr-1.5 -mt-0.5" />
                      Attach a Photo (optional, max 16MB)
                    </label>
                    {photoPreview ? (
                      <div className="relative rounded-lg overflow-hidden border border-white/10">
                        <img src={photoPreview} alt="Preview" className="w-full max-h-48 object-cover" />
                        <button
                          type="button"
                          onClick={() => { setPhotoFile(null); setPhotoPreview(null); if (fileInputRef.current) fileInputRef.current.value = ""; }}
                          className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/70 flex items-center justify-center text-white hover:bg-black transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-3 py-1.5 text-white/70 text-xs truncate">
                          {photoFile?.name}
                        </div>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full border-2 border-dashed border-white/10 hover:border-green-500/40 rounded-lg p-6 flex flex-col items-center gap-2 text-white/40 hover:text-white/60 transition-colors"
                      >
                        <Upload className="w-8 h-8" />
                        <span className="text-sm">Click to upload a photo of your project</span>
                        <span className="text-xs">JPG, PNG, HEIC up to 16MB</span>
                      </button>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handlePhotoChange}
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isPending}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold h-12 text-base active:scale-[0.97] transition-transform"
                  >
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
