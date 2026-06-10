import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Trash2, Star, Lock, ArrowLeft, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function Admin() {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [newRating, setNewRating] = useState(5);
  const [newText, setNewText] = useState("");
  const [newService, setNewService] = useState("");

  const { data: reviews, refetch, isError, error } = trpc.reviews.adminList.useQuery(
    { password },
    { enabled: authenticated, retry: false }
  );

  // If the query fails with invalid password, reset auth state
  useEffect(() => {
    if (isError && authenticated && error?.message?.includes("Invalid admin password")) {
      setAuthenticated(false);
      toast.error("Invalid admin password.");
    }
  }, [isError, authenticated, error]);

  const deleteReview = trpc.reviews.delete.useMutation({
    onSuccess: () => {
      toast.success("Review deleted.");
      refetch();
    },
    onError: () => toast.error("Failed to delete review."),
  });

  const addReview = trpc.reviews.adminAdd.useMutation({
    onSuccess: () => {
      toast.success("Review added.");
      setNewName("");
      setNewRating(5);
      setNewText("");
      setNewService("");
      setShowAddForm(false);
      refetch();
    },
    onError: () => toast.error("Failed to add review."),
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      toast.error("Please enter the admin password.");
      return;
    }
    setAuthenticated(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this review?")) {
      deleteReview.mutate({ id, password });
    }
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newText.trim()) {
      toast.error("Name and review text are required.");
      return;
    }
    addReview.mutate({
      password,
      name: newName.trim(),
      rating: newRating,
      text: newText.trim(),
      service: newService.trim() || undefined,
    });
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="w-full max-w-md mx-4">
          <div className="bg-gray-900 rounded-xl p-8 border border-white/10">
            <div className="flex items-center gap-3 mb-6">
              <Lock className="w-6 h-6 text-green-400" />
              <h1 className="font-heading text-2xl font-bold text-white">Admin Panel</h1>
            </div>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="text-white/70 text-sm mb-1 block">Password</label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  className="bg-gray-800 border-white/10 text-white placeholder:text-white/30"
                />
              </div>
              <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white">
                Login
              </Button>
            </form>
            <Link href="/" className="block text-center text-white/40 text-sm mt-4 hover:text-white/60 transition-colors">
              Back to website
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Admin top bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-sm border-b border-white/10">
        <div className="container flex items-center justify-between h-16">
          <Link href="/">
            <span className="font-heading text-3xl font-black text-gray-400 tracking-tight">MDF</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-green-400 text-sm font-medium">Admin Panel</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => { setAuthenticated(false); setPassword(""); }}
              className="text-white/60 border-white/20"
            >
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="pt-24 pb-16">
        <div className="container max-w-4xl">
          <Link href="/" className="inline-flex items-center gap-2 text-green-400 text-sm mb-6 hover:text-green-300 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Website
          </Link>

          <div className="flex items-center justify-between mb-8">
            <h1 className="font-heading text-3xl font-bold text-white">Manage Reviews</h1>
            <Button
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <Plus className="w-4 h-4 mr-2" /> Add Review
            </Button>
          </div>

          {/* Add Review Form */}
          {showAddForm && (
            <div className="bg-gray-900 rounded-xl p-6 border border-green-500/20 mb-8">
              <h2 className="text-white font-semibold mb-4">Add New Review</h2>
              <form onSubmit={handleAdd} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <Input
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Reviewer name"
                    className="bg-gray-800 border-white/10 text-white placeholder:text-white/30"
                  />
                  <Input
                    value={newService}
                    onChange={(e) => setNewService(e.target.value)}
                    placeholder="Service (optional)"
                    className="bg-gray-800 border-white/10 text-white placeholder:text-white/30"
                  />
                </div>
                <div>
                  <label className="text-white/70 text-sm mb-1 block">Rating</label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setNewRating(star)}
                      >
                        <Star className={`w-6 h-6 ${star <= newRating ? "fill-yellow-400 text-yellow-400" : "text-gray-600"}`} />
                      </button>
                    ))}
                  </div>
                </div>
                <Textarea
                  value={newText}
                  onChange={(e) => setNewText(e.target.value)}
                  placeholder="Review text"
                  rows={3}
                  className="bg-gray-800 border-white/10 text-white placeholder:text-white/30"
                />
                <div className="flex gap-2">
                  <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white">Save Review</Button>
                  <Button type="button" variant="outline" onClick={() => setShowAddForm(false)} className="text-white/60 border-white/20">Cancel</Button>
                </div>
              </form>
            </div>
          )}

          {/* Reviews List */}
          <div className="space-y-4">
            {reviews?.map((review) => (
              <div key={review.id} className="bg-gray-900 rounded-xl p-6 border border-white/5 flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-white font-semibold">{review.name}</h3>
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className={`w-3 h-3 ${star <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-600"}`} />
                      ))}
                    </div>
                    {review.service && (
                      <span className="text-green-400 text-xs bg-green-500/10 px-2 py-0.5 rounded-full">{review.service}</span>
                    )}
                  </div>
                  <p className="text-white/60 text-sm">{review.text}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(review.id)}
                  className="text-red-400 border-red-400/30 hover:bg-red-500/10 shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
            {reviews?.length === 0 && (
              <p className="text-white/40 text-center py-8">No reviews yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
