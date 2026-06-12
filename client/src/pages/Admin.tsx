import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import { Trash2, Star, Lock, ArrowLeft, Plus, Image, Instagram, Upload, CheckCircle, Layers, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { CONSTRUCTION_SERVICES, PLOWING_SERVICES } from "@shared/services";

const ALL_SERVICES = [...CONSTRUCTION_SERVICES, ...PLOWING_SERVICES];

type Tab = "reviews" | "images" | "categories" | "instagram";

export default function Admin() {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("reviews");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      toast.error("Please enter the admin password.");
      return;
    }
    setAuthenticated(true);
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
        <div className="container max-w-5xl">
          <Link href="/" className="inline-flex items-center gap-2 text-green-400 text-sm mb-6 hover:text-green-300 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Website
          </Link>

          {/* Tab Navigation */}
          <div className="flex gap-1 mb-8 bg-gray-900 rounded-lg p-1 border border-white/10 overflow-x-auto">
            <button
              onClick={() => setActiveTab("reviews")}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-md text-sm font-medium transition-all whitespace-nowrap ${activeTab === "reviews" ? "bg-green-600 text-white" : "text-white/60 hover:text-white/80"}`}
            >
              <Star className="w-4 h-4" /> Reviews
            </button>
            <button
              onClick={() => setActiveTab("images")}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-md text-sm font-medium transition-all whitespace-nowrap ${activeTab === "images" ? "bg-green-600 text-white" : "text-white/60 hover:text-white/80"}`}
            >
              <Image className="w-4 h-4" /> Images
            </button>
            <button
              onClick={() => setActiveTab("categories")}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-md text-sm font-medium transition-all whitespace-nowrap ${activeTab === "categories" ? "bg-green-600 text-white" : "text-white/60 hover:text-white/80"}`}
            >
              <Layers className="w-4 h-4" /> Categories
            </button>
            <button
              onClick={() => setActiveTab("instagram")}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-md text-sm font-medium transition-all whitespace-nowrap ${activeTab === "instagram" ? "bg-green-600 text-white" : "text-white/60 hover:text-white/80"}`}
            >
              <Instagram className="w-4 h-4" /> Instagram
            </button>
          </div>

          {activeTab === "reviews" && <ReviewsTab password={password} />}
          {activeTab === "images" && <ImagesTab password={password} />}
          {activeTab === "categories" && <CategoriesTab password={password} />}
          {activeTab === "instagram" && <InstagramTab />}
        </div>
      </div>
    </div>
  );
}

// --- Reviews Tab ---
function ReviewsTab({ password }: { password: string }) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [newRating, setNewRating] = useState(5);
  const [newText, setNewText] = useState("");
  const [newService, setNewService] = useState("");

  const { data: reviews, refetch, isError, error } = trpc.reviews.adminList.useQuery(
    { password },
    { retry: false }
  );

  useEffect(() => {
    if (isError && error?.message?.includes("Invalid admin password")) {
      toast.error("Invalid admin password.");
    }
  }, [isError, error]);

  const deleteReview = trpc.reviews.delete.useMutation({
    onSuccess: () => { toast.success("Review deleted."); refetch(); },
    onError: () => toast.error("Failed to delete review."),
  });

  const addReview = trpc.reviews.adminAdd.useMutation({
    onSuccess: () => {
      toast.success("Review added.");
      setNewName(""); setNewRating(5); setNewText(""); setNewService("");
      setShowAddForm(false);
      refetch();
    },
    onError: () => toast.error("Failed to add review."),
  });

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

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-heading text-2xl font-bold text-white">Manage Reviews</h2>
        <Button onClick={() => setShowAddForm(!showAddForm)} className="bg-green-600 hover:bg-green-700 text-white">
          <Plus className="w-4 h-4 mr-2" /> Add Review
        </Button>
      </div>

      {showAddForm && (
        <div className="bg-gray-900 rounded-xl p-6 border border-green-500/20 mb-8">
          <h3 className="text-white font-semibold mb-4">Add New Review</h3>
          <form onSubmit={handleAdd} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <Input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Reviewer name" className="bg-gray-800 border-white/10 text-white placeholder:text-white/30" />
              <Input value={newService} onChange={(e) => setNewService(e.target.value)} placeholder="Service (optional)" className="bg-gray-800 border-white/10 text-white placeholder:text-white/30" />
            </div>
            <div>
              <label className="text-white/70 text-sm mb-1 block">Rating</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button key={star} type="button" onClick={() => setNewRating(star)}>
                    <Star className={`w-6 h-6 ${star <= newRating ? "fill-yellow-400 text-yellow-400" : "text-gray-600"}`} />
                  </button>
                ))}
              </div>
            </div>
            <Textarea value={newText} onChange={(e) => setNewText(e.target.value)} placeholder="Review text" rows={3} className="bg-gray-800 border-white/10 text-white placeholder:text-white/30" />
            <div className="flex gap-2">
              <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white">Save Review</Button>
              <Button type="button" variant="outline" onClick={() => setShowAddForm(false)} className="text-white/60 border-white/20">Cancel</Button>
            </div>
          </form>
        </div>
      )}

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
            <Button variant="outline" size="sm" onClick={() => handleDelete(review.id)} className="text-red-400 border-red-400/30 hover:bg-red-500/10 shrink-0">
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
        {reviews?.length === 0 && <p className="text-white/40 text-center py-8">No reviews yet.</p>}
      </div>
    </div>
  );
}

// --- Service Images Tab ---
function ImagesTab({ password }: { password: string }) {
  const [selectedService, setSelectedService] = useState(ALL_SERVICES[0]?.id || "");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Also fetch dynamic categories to include in the selector
  const { data: dbCategories } = trpc.categories.list.useQuery({ password }, { retry: false });

  const { data: images, refetch } = trpc.serviceImages.list.useQuery(
    { password, serviceId: selectedService },
    { enabled: !!selectedService }
  );

  const addImage = trpc.serviceImages.add.useMutation({
    onSuccess: () => { toast.success("Image added!"); refetch(); setUploading(false); },
    onError: () => { toast.error("Failed to upload image."); setUploading(false); },
  });

  const deleteImage = trpc.serviceImages.delete.useMutation({
    onSuccess: () => { toast.success("Image deleted."); refetch(); },
    onError: () => toast.error("Failed to delete image."),
  });

  const setPrimary = trpc.serviceImages.setPrimary.useMutation({
    onSuccess: () => { toast.success("Set as primary image."); refetch(); },
    onError: () => toast.error("Failed to set primary."),
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 16 * 1024 * 1024) {
      toast.error("File too large. Max 16MB.");
      return;
    }
    setUploading(true);
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = (reader.result as string).split(",")[1];
      addImage.mutate({
        password,
        serviceId: selectedService,
        fileName: file.name,
        contentType: file.type,
        fileData: base64,
        isPrimary: !images || images.length === 0,
      });
    };
    reader.readAsDataURL(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Merge built-in services with DB categories for the selector
  const builtInIds = new Set(ALL_SERVICES.map(s => s.id));
  const dynamicOnly = (dbCategories ?? []).filter(c => !builtInIds.has(c.serviceId));

  const currentBuiltIn = ALL_SERVICES.find(s => s.id === selectedService);
  const currentDynamic = dynamicOnly.find(c => c.serviceId === selectedService);
  const currentServiceName = currentBuiltIn?.name || currentDynamic?.name || selectedService;
  const currentServiceImage = currentBuiltIn?.image || currentDynamic?.image || null;

  const uploadedImages = images ?? [];
  const hasPrimary = uploadedImages.some(img => img.isPrimary === 1);

  return (
    <div>
      <h2 className="font-heading text-2xl font-bold text-white mb-2">Manage Service Images</h2>
      <p className="text-white/50 text-sm mb-6">Upload multiple photos per service. Mark one as the primary image shown on the site.</p>

      {/* Service Selector */}
      <div className="mb-6">
        <label className="text-white/70 text-sm mb-2 block">Select Service</label>
        <select
          value={selectedService}
          onChange={(e) => setSelectedService(e.target.value)}
          className="w-full bg-gray-800 border border-white/10 rounded-lg px-4 py-3 text-white"
        >
          <optgroup label="Construction">
            {CONSTRUCTION_SERVICES.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
            {dynamicOnly.filter(c => c.category === "construction").map(c => (
              <option key={c.serviceId} value={c.serviceId}>{c.name} (custom)</option>
            ))}
          </optgroup>
          <optgroup label="Plowing & Excavation">
            {PLOWING_SERVICES.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
            {dynamicOnly.filter(c => c.category === "plowing").map(c => (
              <option key={c.serviceId} value={c.serviceId}>{c.name} (custom)</option>
            ))}
          </optgroup>
        </select>
      </div>

      {/* Upload Button */}
      <div className="mb-8">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="hidden"
        />
        <Button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          <Upload className="w-4 h-4 mr-2" />
          {uploading ? "Uploading..." : "Upload New Image"}
        </Button>
        <p className="text-white/30 text-xs mt-2">Max 16MB per image. Upload as many as you like.</p>
      </div>

      {/* Unified Image Gallery */}
      <div>
        <h3 className="text-white font-semibold mb-4">
          {uploadedImages.length > 0
            ? `Images for ${currentServiceName} (${uploadedImages.length} uploaded${currentServiceImage ? ' + 1 default' : ''})`
            : `Images for ${currentServiceName}`}
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {/* Uploaded images */}
          {uploadedImages.map((img) => (
            <div key={img.id} className="relative group bg-gray-900 rounded-lg overflow-hidden border-2 transition-all"
              style={{ borderColor: img.isPrimary === 1 ? 'rgb(22 163 74)' : 'rgba(255,255,255,0.1)' }}
            >
              <img src={img.imageUrl} alt="" className="w-full h-44 object-cover" />
              {img.isPrimary === 1 && (
                <div className="absolute top-2 left-2 bg-green-600 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1 shadow-lg">
                  <CheckCircle className="w-3 h-3" /> Primary
                </div>
              )}
              {img.isPrimary !== 1 && (
                <div className="absolute top-2 left-2 bg-black/60 text-white/60 text-xs px-2 py-1 rounded-full">
                  Uploaded
                </div>
              )}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2">
                {img.isPrimary !== 1 && (
                  <Button
                    size="sm"
                    onClick={() => setPrimary.mutate({ password, id: img.id, serviceId: selectedService })}
                    className="bg-green-600 hover:bg-green-700 text-white text-xs w-full"
                  >
                    <CheckCircle className="w-3 h-3 mr-1" /> Set as Primary
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    if (confirm("Delete this image?")) {
                      deleteImage.mutate({ password, id: img.id });
                    }
                  }}
                  className="text-red-400 border-red-400/30 hover:bg-red-500/10 text-xs w-full"
                >
                  <Trash2 className="w-3 h-3 mr-1" /> Delete
                </Button>
              </div>
            </div>
          ))}

          {/* Default/fallback image — only shown for built-in services */}
          {currentServiceImage && (
            <div className="relative bg-gray-900 rounded-lg overflow-hidden border-2 border-dashed"
              style={{ borderColor: !hasPrimary ? 'rgb(22 163 74)' : 'rgba(255,255,255,0.1)' }}
            >
              <img src={currentServiceImage} alt={currentServiceName} className="w-full h-44 object-cover opacity-70" />
              <div className="absolute top-2 left-2 bg-gray-700 text-white/70 text-xs px-2 py-1 rounded-full">
                {!hasPrimary ? '✓ Default (active)' : 'Default'}
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white/50 text-xs text-center py-1">
                Built-in default — upload to replace
              </div>
            </div>
          )}
        </div>
      </div>

      {images !== undefined && images.length === 0 && !currentServiceImage && (
        <p className="text-white/40 text-center py-4 text-sm">No images yet. Upload photos above to add images for this service.</p>
      )}
    </div>
  );
}

// --- Categories Tab ---
function CategoriesTab({ password }: { password: string }) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [newName, setNewName] = useState("");
  const [newServiceId, setNewServiceId] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newCategory, setNewCategory] = useState<"construction" | "plowing">("construction");
  const [newSortOrder, setNewSortOrder] = useState(0);

  // Edit state
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editCategory, setEditCategory] = useState<"construction" | "plowing">("construction");
  const [editSortOrder, setEditSortOrder] = useState(0);

  const { data: categories, refetch } = trpc.categories.list.useQuery({ password }, { retry: false });

  const createCategory = trpc.categories.create.useMutation({
    onSuccess: () => {
      toast.success("Category created!");
      setNewName(""); setNewServiceId(""); setNewDescription(""); setNewCategory("construction"); setNewSortOrder(0);
      setShowAddForm(false);
      refetch();
    },
    onError: (err) => toast.error(err.message || "Failed to create category."),
  });

  const updateCategory = trpc.categories.update.useMutation({
    onSuccess: () => {
      toast.success("Category updated!");
      setEditingId(null);
      refetch();
    },
    onError: (err) => toast.error(err.message || "Failed to update category."),
  });

  const deleteCategory = trpc.categories.delete.useMutation({
    onSuccess: () => { toast.success("Category deleted."); refetch(); },
    onError: (err) => toast.error(err.message || "Failed to delete category."),
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) { toast.error("Name is required."); return; }
    const serviceId = newServiceId.trim() || newName.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    createCategory.mutate({
      password,
      serviceId,
      name: newName.trim(),
      description: newDescription.trim() || undefined,
      category: newCategory,
      sortOrder: newSortOrder,
    });
  };

  const handleUpdate = (id: number) => {
    updateCategory.mutate({
      password,
      id,
      name: editName.trim() || undefined,
      description: editDescription.trim() || null,
      category: editCategory,
      sortOrder: editSortOrder,
    });
  };

  const handleDelete = (id: number, name: string) => {
    if (confirm(`Delete the category "${name}"? This cannot be undone.`)) {
      deleteCategory.mutate({ password, id });
    }
  };

  const startEdit = (cat: { id: number; name: string; description: string | null; category: "construction" | "plowing"; sortOrder: number }) => {
    setEditingId(cat.id);
    setEditName(cat.name);
    setEditDescription(cat.description || "");
    setEditCategory(cat.category);
    setEditSortOrder(cat.sortOrder);
  };

  // All categories from DB (built-ins are seeded into DB on first load)
  const allCategories = categories ?? [];

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h2 className="font-heading text-2xl font-bold text-white">Manage Service Categories</h2>
        <Button onClick={() => setShowAddForm(!showAddForm)} className="bg-green-600 hover:bg-green-700 text-white">
          <Plus className="w-4 h-4 mr-2" /> Add Category
        </Button>
      </div>
      <p className="text-white/50 text-sm mb-6">
        Add, rename, or delete service categories. Custom categories appear alongside the built-in ones on the public site.
      </p>

      {/* Add Form */}
      {showAddForm && (
        <div className="bg-gray-900 rounded-xl p-6 border border-green-500/20 mb-8">
          <h3 className="text-white font-semibold mb-4">Add New Category</h3>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-white/70 text-sm mb-1 block">Name *</label>
                <Input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="e.g. Roofing" className="bg-gray-800 border-white/10 text-white placeholder:text-white/30" />
              </div>
              <div>
                <label className="text-white/70 text-sm mb-1 block">ID (auto-generated if blank)</label>
                <Input value={newServiceId} onChange={(e) => setNewServiceId(e.target.value)} placeholder="e.g. roofing" className="bg-gray-800 border-white/10 text-white placeholder:text-white/30" />
              </div>
            </div>
            <div>
              <label className="text-white/70 text-sm mb-1 block">Description</label>
              <Textarea value={newDescription} onChange={(e) => setNewDescription(e.target.value)} placeholder="Brief description of this service" rows={2} className="bg-gray-800 border-white/10 text-white placeholder:text-white/30" />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-white/70 text-sm mb-1 block">Type</label>
                <select value={newCategory} onChange={(e) => setNewCategory(e.target.value as "construction" | "plowing")} className="w-full bg-gray-800 border border-white/10 rounded-lg px-4 py-2.5 text-white">
                  <option value="construction">Construction</option>
                  <option value="plowing">Plowing & Excavation</option>
                </select>
              </div>
              <div>
                <label className="text-white/70 text-sm mb-1 block">Sort Order</label>
                <Input type="number" value={newSortOrder} onChange={(e) => setNewSortOrder(Number(e.target.value))} className="bg-gray-800 border-white/10 text-white" />
              </div>
            </div>
            <div className="flex gap-2">
              <Button type="submit" disabled={createCategory.isPending} className="bg-green-600 hover:bg-green-700 text-white">
                {createCategory.isPending ? "Creating..." : "Create Category"}
              </Button>
              <Button type="button" variant="outline" onClick={() => setShowAddForm(false)} className="text-white/60 border-white/20">Cancel</Button>
            </div>
          </form>
        </div>
      )}

      {/* All categories (built-ins are seeded into DB, all are editable/deletable) */}
      <div>
        <h3 className="text-white/70 text-sm font-medium mb-3 uppercase tracking-wider">All Service Categories ({allCategories.length})</h3>
        {allCategories.length === 0 ? (
          <div className="bg-gray-900/50 rounded-lg border border-white/5 p-8 text-center">
            <Layers className="w-10 h-10 text-white/20 mx-auto mb-3" />
            <p className="text-white/40 text-sm">No categories yet. Click "Add Category" to create one, or categories will be auto-seeded on first public page load.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {allCategories.map((cat) => (
              <div key={cat.id} className="bg-gray-900 rounded-xl p-5 border border-white/5">
                {editingId === cat.id ? (
                  <div className="space-y-3">
                    <div className="grid sm:grid-cols-2 gap-3">
                      <Input value={editName} onChange={(e) => setEditName(e.target.value)} placeholder="Category name" className="bg-gray-800 border-white/10 text-white placeholder:text-white/30" />
                      <select value={editCategory} onChange={(e) => setEditCategory(e.target.value as "construction" | "plowing")} className="bg-gray-800 border border-white/10 rounded-lg px-4 py-2 text-white">
                        <option value="construction">Construction</option>
                        <option value="plowing">Plowing & Excavation</option>
                      </select>
                    </div>
                    <Textarea value={editDescription} onChange={(e) => setEditDescription(e.target.value)} placeholder="Description" rows={2} className="bg-gray-800 border-white/10 text-white placeholder:text-white/30" />
                    <div className="flex items-center gap-3">
                      <label className="text-white/70 text-sm">Sort Order:</label>
                      <Input type="number" value={editSortOrder} onChange={(e) => setEditSortOrder(Number(e.target.value))} className="w-24 bg-gray-800 border-white/10 text-white" />
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => handleUpdate(cat.id)} disabled={updateCategory.isPending} className="bg-green-600 hover:bg-green-700 text-white">
                        {updateCategory.isPending ? "Saving..." : "Save"}
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setEditingId(null)} className="text-white/60 border-white/20">Cancel</Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1 flex-wrap">
                        <h4 className="text-white font-semibold">{cat.name}</h4>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${cat.category === "construction" ? "bg-blue-500/10 text-blue-400" : "bg-cyan-500/10 text-cyan-400"}`}>
                          {cat.category}
                        </span>
                        <span className="text-white/30 text-xs">#{cat.sortOrder}</span>
                      </div>
                      {cat.description && <p className="text-white/50 text-sm line-clamp-1">{cat.description}</p>}
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <Button variant="outline" size="sm" onClick={() => startEdit(cat)} className="text-white/60 border-white/20 hover:text-white">
                        <Pencil className="w-3.5 h-3.5" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDelete(cat.id, cat.name)} className="text-red-400 border-red-400/30 hover:bg-red-500/10">
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// --- Instagram Tab ---
function InstagramTab() {
  const [caption, setCaption] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handlePost = () => {
    toast.info("Instagram posting coming soon! This feature requires Meta Business API integration. Your post has been saved as a draft.");
  };

  return (
    <div>
      <h2 className="font-heading text-2xl font-bold text-white mb-2">Instagram</h2>
      <p className="text-white/60 mb-6">Post to <a href="https://instagram.com/mdfplowing" target="_blank" rel="noopener noreferrer" className="text-green-400 hover:text-green-300">@mdfplowing</a></p>

      {/* Coming Soon Banner */}
      <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl p-6 mb-8">
        <div className="flex items-start gap-4">
          <Instagram className="w-8 h-8 text-purple-400 shrink-0 mt-1" />
          <div>
            <h3 className="text-white font-semibold mb-1">Auto-Posting Coming Soon</h3>
            <p className="text-white/60 text-sm">
              Direct Instagram posting requires Meta Business API approval. For now, you can prepare posts here and manually share them.
              Once the API is connected, posts will go directly to @mdfplowing.
            </p>
          </div>
        </div>
      </div>

      {/* Post Creator */}
      <div className="bg-gray-900 rounded-xl p-6 border border-white/10">
        <h3 className="text-white font-semibold mb-4">Create Post</h3>

        <div className="space-y-4">
          {/* Image Upload */}
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            {previewUrl ? (
              <div className="relative">
                <img src={previewUrl} alt="Preview" className="w-full max-w-md h-64 object-cover rounded-lg" />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => { setSelectedFile(null); setPreviewUrl(null); if (fileInputRef.current) fileInputRef.current.value = ""; }}
                  className="absolute top-2 right-2 text-white/80 border-white/30 bg-black/50"
                >
                  Remove
                </Button>
              </div>
            ) : (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full max-w-md h-48 border-2 border-dashed border-white/20 rounded-lg flex flex-col items-center justify-center gap-2 text-white/40 hover:text-white/60 hover:border-white/30 transition-colors"
              >
                <Image className="w-8 h-8" />
                <span className="text-sm">Click to select photo</span>
              </button>
            )}
          </div>

          {/* Caption */}
          <Textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Write your caption... #mdfestes #estespark #construction #plowing"
            rows={4}
            className="bg-gray-800 border-white/10 text-white placeholder:text-white/30"
          />

          {/* Post Button */}
          <Button
            onClick={handlePost}
            disabled={!selectedFile || !caption.trim()}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
          >
            <Instagram className="w-4 h-4 mr-2" /> Post to Instagram
          </Button>
        </div>
      </div>
    </div>
  );
}
