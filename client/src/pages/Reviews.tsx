import { useState } from "react";
import { Link } from "wouter";
import { Phone, Mail, Star, Send, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { IMAGES, CONTACT_INFO } from "@shared/services";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function Reviews() {
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");
  const [service, setService] = useState("");
  const [hoverRating, setHoverRating] = useState(0);

  const { data: reviews, isLoading, refetch } = trpc.reviews.list.useQuery();
  const submitReview = trpc.reviews.submit.useMutation({
    onSuccess: () => {
      toast.success("Thank you for your review!");
      setName("");
      setRating(5);
      setText("");
      setService("");
      refetch();
    },
    onError: () => {
      toast.error("Failed to submit review. Please try again.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !text.trim()) {
      toast.error("Please fill in your name and review.");
      return;
    }
    submitReview.mutate({ name: name.trim(), rating, text: text.trim(), service: service.trim() || undefined });
  };

  const averageRating = reviews?.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : "5.0";

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-sm border-b border-white/10">
        <div className="container flex items-center justify-between h-16">
          <Link href="/">
            <span className="font-heading text-3xl font-black text-gray-400 tracking-tight">MDF</span>
          </Link>
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-white/80">
            <Link href="/plowing" className="hover:text-white transition-colors">Plowing & Excavation</Link>
            <Link href="/construction" className="hover:text-white transition-colors">Construction</Link>
            <Link href="/reviews" className="text-green-400">Reviews</Link>
            <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
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
          <h1 className="font-heading text-3xl md:text-5xl font-bold text-white mb-4">Customer Reviews</h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className="w-6 h-6 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <span className="text-white text-2xl font-bold">{averageRating}</span>
            <span className="text-white/50">({reviews?.length || 0} reviews)</span>
          </div>
        </div>
      </section>

      {/* Reviews List */}
      <section className="pb-16">
        <div className="container">
          {isLoading ? (
            <div className="grid md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-gray-900 rounded-xl p-6 border border-white/5 animate-pulse">
                  <div className="h-4 bg-gray-800 rounded w-1/3 mb-4" />
                  <div className="h-3 bg-gray-800 rounded w-full mb-2" />
                  <div className="h-3 bg-gray-800 rounded w-2/3" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {reviews?.map((review) => (
                <div key={review.id} className="bg-gray-900 rounded-xl p-6 border border-white/5">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-white font-semibold">{review.name}</h3>
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-4 h-4 ${star <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-600"}`}
                        />
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
        </div>
      </section>

      {/* Submit Review Form */}
      <section className="pb-16">
        <div className="container max-w-2xl">
          <div className="bg-gray-900 rounded-xl p-8 border border-white/10">
            <h2 className="font-heading text-2xl font-bold text-white mb-6">Leave a Review</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-white/70 text-sm mb-1 block">Your Name *</label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Smith"
                  className="bg-gray-800 border-white/10 text-white placeholder:text-white/30"
                  required
                />
              </div>
              <div>
                <label className="text-white/70 text-sm mb-1 block">Rating *</label>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="p-1"
                    >
                      <Star
                        className={`w-8 h-8 transition-colors ${
                          star <= (hoverRating || rating)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-600"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-white/70 text-sm mb-1 block">Service (optional)</label>
                <Input
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  placeholder="e.g., Decks, Plowing, Kitchen Remodel"
                  className="bg-gray-800 border-white/10 text-white placeholder:text-white/30"
                />
              </div>
              <div>
                <label className="text-white/70 text-sm mb-1 block">Your Review *</label>
                <Textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Tell us about your experience..."
                  rows={4}
                  className="bg-gray-800 border-white/10 text-white placeholder:text-white/30"
                  required
                />
              </div>
              <Button
                type="submit"
                disabled={submitReview.isPending}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold"
              >
                <Send className="w-4 h-4 mr-2" />
                {submitReview.isPending ? "Submitting..." : "Submit Review"}
              </Button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black border-t border-white/10 py-8">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="font-heading text-2xl font-black text-gray-400 tracking-tight">MDF</span>
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
