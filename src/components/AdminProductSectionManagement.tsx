import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Trash2, Edit2, Plus } from "lucide-react";

interface Product {
  _id: string;
  name: string;
  price: number;
}

interface ProductSection {
  _id: string;
  name: string;
  heading: string;
  subheading?: string;
  productIds: (string | Product)[];
  displayLayout: string;
  backgroundImage?: string;
  isActive: boolean;
  displayOrder: number;
}

const AdminProductSectionManagement = () => {
  const [sections, setSections] = useState<ProductSection[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingSection, setEditingSection] = useState<ProductSection | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    heading: "",
    subheading: "",
    productIds: [] as string[],
    displayLayout: "asymmetric",
    backgroundImage: "",
    isActive: true,
    displayOrder: 0,
  });

  const API_URL = import.meta.env.VITE_API_URL || '/api';
  const AUTH_STORAGE_KEY = "vasstra_auth_token";

  useEffect(() => {
    fetchSections();
    fetchProducts();
  }, []);

  const fetchSections = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem(AUTH_STORAGE_KEY);
      const response = await fetch(`${API_URL}/product-sections/admin/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setSections(data.sections || []);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error("Error fetching sections:", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_URL}/products?limit=999`);

      if (response.ok) {
        const data = await response.json();
        setProducts(data.products || []);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error("Error fetching products:", errorMessage);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem(AUTH_STORAGE_KEY);

    try {
      const url = editingSection
        ? `${API_URL}/product-sections/${editingSection._id}`
        : `${API_URL}/product-sections`;

      const response = await fetch(url, {
        method: editingSection ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        resetForm();
        fetchSections();
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.error || 'Failed to save section'}`);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error("Error saving section:", errorMessage);
      alert(`Error: ${errorMessage}`);
    }
  };

  const handleEdit = (section: ProductSection) => {
    setEditingSection(section);
    const productIds = section.productIds.map(p =>
      typeof p === 'string' ? p : p._id
    );
    setFormData({
      name: section.name,
      heading: section.heading,
      subheading: section.subheading || "",
      productIds,
      displayLayout: section.displayLayout,
      backgroundImage: section.backgroundImage || "",
      isActive: section.isActive,
      displayOrder: section.displayOrder,
    });
  };

  const handleDelete = async (sectionId: string) => {
    if (!confirm("Are you sure you want to delete this section?")) return;

    const token = localStorage.getItem(AUTH_STORAGE_KEY);

    try {
      const response = await fetch(`${API_URL}/product-sections/${sectionId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        fetchSections();
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error("Error deleting section:", errorMessage);
    }
  };

  const resetForm = () => {
    setEditingSection(null);
    setFormData({
      name: "",
      heading: "",
      subheading: "",
      productIds: [],
      displayLayout: "asymmetric",
      backgroundImage: "",
      isActive: true,
      displayOrder: 0,
    });
  };

  const toggleProductId = (productId: string) => {
    setFormData(prev => ({
      ...prev,
      productIds: prev.productIds.includes(productId)
        ? prev.productIds.filter(id => id !== productId)
        : [...prev.productIds, productId]
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setFormData(prev => ({
        ...prev,
        backgroundImage: dataUrl
      }));
    };
    reader.readAsDataURL(file);
  };

  if (isLoading) {
    return <div className="p-6 text-center">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Product Section Management</h2>
        <Button onClick={() => resetForm()} className="gap-2">
          <Plus className="w-4 h-4" /> Add Section
        </Button>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg p-6 shadow">
        <h3 className="text-lg font-semibold mb-4">
          {editingSection ? "Edit Section" : "Create New Section"}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Section Name (Identifier) *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-md"
                placeholder="e.g., holi-sale"
                disabled={!!editingSection}
              />
              <p className="text-xs text-gray-500 mt-1">Used to identify section internally</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Section Heading *</label>
              <input
                type="text"
                required
                value={formData.heading}
                onChange={(e) =>
                  setFormData({ ...formData, heading: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-md"
                placeholder="e.g., HOLI SALE"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Subheading</label>
              <input
                type="text"
                value={formData.subheading}
                onChange={(e) =>
                  setFormData({ ...formData, subheading: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-md"
                placeholder="e.g., Special Festive Collection"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Display Layout</label>
              <select
                value={formData.displayLayout}
                onChange={(e) =>
                  setFormData({ ...formData, displayLayout: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="asymmetric">Asymmetric (Large + 2 Rows)</option>
                <option value="carousel">Carousel</option>
                <option value="grid">Grid</option>
                <option value="featured">Featured</option>
              </select>
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

          {/* Background Image Upload */}
          <div>
            <label className="block text-sm font-medium mb-2">Section Background Image</label>
            <div className="flex items-center gap-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="flex-1 px-3 py-2 border rounded-md"
              />
              {formData.backgroundImage && (
                <div className="w-20 h-20 rounded-md overflow-hidden border">
                  <img
                    src={formData.backgroundImage}
                    alt="Background preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1">Upload an image for section background (optional)</p>
          </div>

          {/* Products Selection */}
          <div>
            <label className="block text-sm font-medium mb-3">Select Products *</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-64 overflow-y-auto border rounded-md p-4">
              {products.map((product) => (
                <label key={product._id} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.productIds.includes(product._id)}
                    onChange={() => toggleProductId(product._id)}
                    className="rounded"
                  />
                  <span className="text-sm">{product.name}</span>
                </label>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Selected: {formData.productIds.length} product(s)
            </p>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit">
              {editingSection ? "Update Section" : "Create Section"}
            </Button>
            {editingSection && (
              <Button type="button" variant="outline" onClick={resetForm}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </div>

      {/* Sections List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-semibold">All Sections ({sections.length})</h3>
        </div>
        <div className="divide-y">
          {sections.map((section) => (
            <div key={section._id} className="px-6 py-4 flex items-center justify-between">
              <div className="flex-1">
                <h4 className="font-semibold">{section.heading}</h4>
                <p className="text-sm text-gray-600">{section.name}</p>
                <p className="text-sm text-gray-500">
                  {section.productIds.length} products • {section.displayLayout} layout
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 text-xs rounded ${
                  section.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                }`}>
                  {section.isActive ? 'Active' : 'Inactive'}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEdit(section)}
                >
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(section._id)}
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

export default AdminProductSectionManagement;
