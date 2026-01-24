import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Trash2, Edit2, Plus } from "lucide-react";

interface Offer {
  _id: string;
  title: string;
  subtitle?: string;
  description?: string;
  backgroundImage?: string;
  badge?: string;
  ctaText: string;
  ctaLink: string;
  isActive: boolean;
  displayOrder: number;
}

const AdminOfferManagement = () => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    description: "",
    backgroundImage: "",
    badge: "",
    ctaText: "Shop Now",
    ctaLink: "/shop",
    isActive: true,
    displayOrder: 0,
  });

  const API_URL = import.meta.env.VITE_API_URL || '/api';

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("authToken");
      const response = await fetch(`${API_URL}/offers/admin/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setOffers(data.offers || []);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error("Error fetching offers:", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("authToken");

    try {
      const url = editingOffer
        ? `${API_URL}/offers/${editingOffer._id}`
        : `${API_URL}/offers`;

      const response = await fetch(url, {
        method: editingOffer ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        resetForm();
        fetchOffers();
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error("Error saving offer:", errorMessage);
    }
  };

  const handleEdit = (offer: Offer) => {
    setEditingOffer(offer);
    setFormData({
      title: offer.title,
      subtitle: offer.subtitle || "",
      description: offer.description || "",
      backgroundImage: offer.backgroundImage || "",
      badge: offer.badge || "",
      ctaText: offer.ctaText,
      ctaLink: offer.ctaLink,
      isActive: offer.isActive,
      displayOrder: offer.displayOrder,
    });
  };

  const handleDelete = async (offerId: string) => {
    if (!confirm("Are you sure you want to delete this offer?")) return;

    const token = localStorage.getItem("authToken");

    try {
      const response = await fetch(`${API_URL}/offers/${offerId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        fetchOffers();
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error("Error deleting offer:", errorMessage);
    }
  };

  const resetForm = () => {
    setEditingOffer(null);
    setFormData({
      title: "",
      subtitle: "",
      description: "",
      backgroundImage: "",
      badge: "",
      ctaText: "Shop Now",
      ctaLink: "/shop",
      isActive: true,
      displayOrder: 0,
    });
  };

  if (isLoading) {
    return <div className="p-6 text-center">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Offer Management</h2>
        <Button onClick={() => resetForm()} className="gap-2">
          <Plus className="w-4 h-4" /> Add Offer
        </Button>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg p-6 shadow">
        <h3 className="text-lg font-semibold mb-4">
          {editingOffer ? "Edit Offer" : "Create New Offer"}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-md"
                placeholder="e.g., DIWALI SALE"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Subtitle</label>
              <input
                type="text"
                value={formData.subtitle}
                onChange={(e) =>
                  setFormData({ ...formData, subtitle: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-md"
                placeholder="e.g., Up to 50% Off"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Badge</label>
              <input
                type="text"
                value={formData.badge}
                onChange={(e) =>
                  setFormData({ ...formData, badge: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-md"
                placeholder="e.g., Limited Time"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">CTA Text</label>
              <input
                type="text"
                value={formData.ctaText}
                onChange={(e) =>
                  setFormData({ ...formData, ctaText: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-md"
                placeholder="e.g., Shop Now"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">CTA Link</label>
              <input
                type="text"
                value={formData.ctaLink}
                onChange={(e) =>
                  setFormData({ ...formData, ctaLink: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-md"
                placeholder="e.g., /shop"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Display Order</label>
              <input
                type="number"
                value={formData.displayOrder}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    displayOrder: parseInt(e.target.value),
                  })
                }
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full px-3 py-2 border rounded-md"
              rows={3}
              placeholder="Offer description"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Background Image URL</label>
            <input
              type="text"
              value={formData.backgroundImage}
              onChange={(e) =>
                setFormData({ ...formData, backgroundImage: e.target.value })
              }
              className="w-full px-3 py-2 border rounded-md"
              placeholder="https://..."
            />
          </div>

          <div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) =>
                  setFormData({ ...formData, isActive: e.target.checked })
                }
              />
              <span className="text-sm font-medium">Active</span>
            </label>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit">
              {editingOffer ? "Update Offer" : "Create Offer"}
            </Button>
            {editingOffer && (
              <Button type="button" variant="outline" onClick={resetForm}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </div>

      {/* Offers List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-semibold">All Offers ({offers.length})</h3>
        </div>
        <div className="divide-y">
          {offers.map((offer) => (
            <div key={offer._id} className="px-6 py-4 flex items-center justify-between">
              <div className="flex-1">
                <h4 className="font-semibold">{offer.title}</h4>
                <p className="text-sm text-gray-600">{offer.subtitle}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 text-xs rounded ${
                  offer.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                }`}>
                  {offer.isActive ? 'Active' : 'Inactive'}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEdit(offer)}
                >
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(offer._id)}
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminOfferManagement;
