import { useState } from "react";
import { Link } from "wouter";
import { Phone, Mail, MapPin, Send, ArrowLeft, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { IMAGES, CONTACT_INFO } from "@shared/services";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [service, setService] = useState("");

  const submitContact = trpc.contact.submit.useMutation({
    onSuccess: () => {
      toast.success("Message sent! We'll get back to you soon.");
      setName("");
      setEmail("");
      setPhone("");
      setMessage("");
      setService("");
    },
    onError: () => {
      toast.error("Failed to send message. Please try again or call us directly.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }
    submitContact.mutate({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim() || undefined,
      message: message.trim(),
      service: service.trim() || undefined,
    });
  };

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-sm border-b border-white/10">
        <div className="container flex items-center justify-between h-16">
          <Link href="/">
            <img src={IMAGES.logo} alt="MDF Logo" className="h-10 w-auto" />
          </Link>
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-white/80">
            <Link href="/plowing" className="hover:text-white transition-colors">Plowing & Excavation</Link>
            <Link href="/construction" className="hover:text-white transition-colors">Construction</Link>
            <Link href="/reviews" className="hover:text-white transition-colors">Reviews</Link>
            <Link href="/contact" className="text-green-400">Contact</Link>
          </div>
          <a href={`tel:${CONTACT_INFO.phone}`} className="flex items-center gap-2 text-sm font-semibold text-green-400">
            <Phone className="w-4 h-4" />
            <span className="hidden sm:inline">{CONTACT_INFO.phone}</span>
          </a>
        </div>
      </nav>

      {/* Header */}
      <section className="pt-24 pb-12">
        <div className="container">
          <Link href="/" className="inline-flex items-center gap-2 text-green-400 text-sm mb-6 hover:text-green-300 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
          <h1 className="font-heading text-3xl md:text-5xl font-bold text-white mb-4">Contact Us</h1>
          <p className="text-white/70 text-lg max-w-2xl">
            Ready to start your project? Get in touch for a free estimate. We're here to help with all your plowing, excavation, and construction needs.
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
                <p className="text-white/50 text-sm">Our AI-powered estimator will be available soon. In the meantime, call or message us for a free quote.</p>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-3">
              <div className="bg-gray-900 rounded-xl p-8 border border-white/10">
                <h2 className="font-heading text-xl font-bold text-white mb-6">Send Us a Message</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-white/70 text-sm mb-1 block">Name *</label>
                      <Input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your name"
                        className="bg-gray-800 border-white/10 text-white placeholder:text-white/30"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-white/70 text-sm mb-1 block">Email *</label>
                      <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com"
                        className="bg-gray-800 border-white/10 text-white placeholder:text-white/30"
                        required
                      />
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-white/70 text-sm mb-1 block">Phone (optional)</label>
                      <Input
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="970-555-1234"
                        className="bg-gray-800 border-white/10 text-white placeholder:text-white/30"
                      />
                    </div>
                    <div>
                      <label className="text-white/70 text-sm mb-1 block">Service Interest (optional)</label>
                      <Input
                        value={service}
                        onChange={(e) => setService(e.target.value)}
                        placeholder="e.g., Deck, Plowing, Kitchen"
                        className="bg-gray-800 border-white/10 text-white placeholder:text-white/30"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-white/70 text-sm mb-1 block">Message *</label>
                    <Textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Tell us about your project or question..."
                      rows={5}
                      className="bg-gray-800 border-white/10 text-white placeholder:text-white/30"
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={submitContact.isPending}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    {submitContact.isPending ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black border-t border-white/10 py-8">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img src={IMAGES.logo} alt="MDF" className="h-8 w-auto" />
            <span className="text-white/40 text-sm">&copy; {new Date().getFullYear()} MDF. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-4 text-white/50 text-sm">
            <a href={`tel:${CONTACT_INFO.phone}`} className="hover:text-white transition-colors flex items-center gap-1">
              <Phone className="w-3 h-3" /> {CONTACT_INFO.phone}
            </a>
            <a href={`mailto:${CONTACT_INFO.email}`} className="hover:text-white transition-colors flex items-center gap-1">
              <Mail className="w-3 h-3" /> {CONTACT_INFO.email}
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
