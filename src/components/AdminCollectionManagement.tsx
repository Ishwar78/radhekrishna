import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Trash2, Edit2, Plus } from "lucide-react";

interface Collection {
  _id: string;
  name: string;
  description?: string;
  image: string;
  link: string;
  buttonText: string;
  badge?: string;
  displayOrder: number;
  isActive: boolean;
}

const AdminCollectionManagement = () => {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingCollection, setEditingCollection] = useState<Collection | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: "",
    link: "/shop",
    buttonText: "View Collection",
    badge: "",
    displayOrder: 0,
    isActive: true,
  });

  const API_URL = import.meta.env.VITE_API_URL || '/api';

  useEffect(() => {
    fetchCollections();
  }, []);

  const fetchCollections = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("authToken");
      const response = await fetch(`${API_URL}/collections/admin/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setCollections(data.collections || []);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error("Error fetching collections:", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("authToken");

    try {
      const url = editingCollection
        ? `${API_URL}/collections/${editingCollection._id}`
        : `${API_URL}/collections`;

      const response = await fetch(url, {
        method: editingCollection ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        resetForm();
        fetchCollections();
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error("Error saving collection:", errorMessage);
    }
  };

  const handleEdit = (collection: Collection) => {
    setEditingCollection(collection);
    setFormData({
      name: collection.name,
      description: collection.description || "",
      image: collection.image,
      link: collection.link,
      buttonText: collection.buttonText,
      badge: collection.badge || "",
      displayOrder: collection.displayOrder,
      isActive: collection.isActive,
    });
  };

  const handleDelete = async (collectionId: string) => {
    if (!confirm("Are you sure you want to delete this collection?")) return;

    const token = localStorage.getItem("authToken");

    try {
      const response = await fetch(`${API_URL}/collections/${collectionId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        fetchCollections();
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error("Error deleting collection:", errorMessage);
    }
  };

  const resetForm = () => {
    setEditingCollection(null);
    setFormData({
      name: "",
      description: "",
      image: "",
      link: "/shop",
      buttonText: "View Collection",
      badge: "",
      displayOrder: 0,
      isActive: true,
    });
  };

  if (isLoading) {
    return <div className="p-6 text-center">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Collection Management</h2>
        <Button onClick={() => resetForm()} className="gap-2">
          <Plus className="w-4 h-4" /> Add Collection
        </Button>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg p-6 shadow">
        <h3 className="text-lg font-semibold mb-4">
          {editingCollection ? "Edit Collection" : "Create New Collection"}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Collection Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-md"
                placeholder="e.g., Ethnic Wear"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Button Text</label>
              <input
                type="text"
                value={formData.buttonText}
                onChange={(e) =>
                  setFormData({ ...formData, buttonText: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-md"
                placeholder="e.g., View Collection"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Link</label>
              <input
                type="text"
                value={formData.link}
                onChange={(e) =>
                  setFormData({ ...formData, link: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-md"
                placeholder="e.g., /ethnic-wear"
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
                placeholder="e.g., New"
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
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full px-3 py-2 border rounded-md"
              rows={2}
              placeholder="Collection description"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Collection Image URL *</label>
            <input
              type="text"
              required
              value={formData.image}
              onChange={(e) =>
                setFormData({ ...formData, image: e.target.value })
              }
              className="w-full px-3 py-2 border rounded-md"
              placeholder="https://..."
            />
            {formData.image && (
              <img
                src={formData.image}
                alt="Preview"
                className="mt-2 max-h-40 rounded"
              />
            )}
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit">
              {editingCollection ? "Update Collection" : "Create Collection"}
            </Button>
            {editingCollection && (
              <Button type="button" variant="outline" onClick={resetForm}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </div>

      {/* Collections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {collections.map((collection) => (
          <div
            key={collection._id}
            className="bg-white rounded-lg shadow overflow-hidden"
          >
            <img
              src={collection.image}
              alt={collection.name}
              className="w-full h-40 object-cover"
            />
            <div className="p-4">
              <h4 className="font-semibold text-lg mb-1">{collection.name}</h4>
              <p className="text-sm text-gray-600 mb-3">{collection.description}</p>
              <div className="flex items-center justify-between">
                <span className={`px-2 py-1 text-xs rounded ${
                  collection.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                }`}>
                  {collection.isActive ? 'Active' : 'Inactive'}
                </span>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(collection)}
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(collection._id)}
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminCollectionManagement;
