import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Image, Plus, Pencil, Trash2, Eye, EyeOff, Loader2 } from "lucide-react";

interface Banner {
  _id?: string;
  id?: string;
  title: string;
  subtitle: string;
  description: string;
  imageUrl: string;
  ctaText: string;
  ctaLink: string;
  category: string;
  isActive: boolean;
  order: number;
}

const CATEGORY_OPTIONS = [
  { value: "bestsellers", label: "Bestsellers" },
  { value: "new_arrivals", label: "New Arrivals" },
  { value: "ethnic_wear", label: "Ethnic Wear" },
  { value: "western_wear", label: "Western Wear" },
  { value: "summer_collection", label: "Summer Collection" },
  { value: "winter_collection", label: "Winter Collection" },
];

interface AdminBannerManagementProps {
  category?: string;
}

export default function AdminBannerManagement({ category }: AdminBannerManagementProps) {
  const { token } = useAuth();
  const [banners, setBanners] = useState<Banner[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>(category || "all");
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    description: "",
    imageUrl: "",
    ctaText: "Shop Now",
    ctaLink: "",
    category: "bestsellers",
    isActive: true,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  const API_URL = import.meta.env.VITE_API_URL || '/api';

  // Fetch banners
  const fetchBanners = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/banners/admin/all`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch banners');
      }

      const data = await response.json();
      setBanners(data.banners || []);
    } catch (error) {
      console.error('Error fetching banners:', error);
      toast.error("Failed to load banners");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchBanners();
    }
  }, [token]);

  useEffect(() => {
    if (category) {
      setFilterCategory(category);
    }
  }, [category]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        setImagePreview(base64);
        setFormData(prev => ({ ...prev, imageUrl: base64 }));
      };
      reader.readAsDataURL(file);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      subtitle: "",
      description: "",
      imageUrl: "",
      ctaText: "Shop Now",
      ctaLink: "",
      category: category || "bestsellers",
      isActive: true,
    });
    setEditingBanner(null);
    setImageFile(null);
    setImagePreview("");
  };

  const handleOpenDialog = (banner?: Banner) => {
    if (banner) {
      setEditingBanner(banner);
      setFormData({
        title: banner.title,
        subtitle: banner.subtitle,
        description: banner.description,
        imageUrl: banner.imageUrl,
        ctaText: banner.ctaText,
        ctaLink: banner.ctaLink,
        category: banner.category,
        isActive: banner.isActive,
      });
      setImagePreview(banner.imageUrl);
      setImageFile(null);
    } else {
      resetForm();
      // If viewing category-specific view, set the category
      if (category) {
        setFormData(prev => ({
          ...prev,
          category,
        }));
      }
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    resetForm();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.imageUrl) {
      toast.error("Banner image is required");
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        title: formData.title,
        subtitle: formData.subtitle,
        description: formData.description,
        imageUrl: formData.imageUrl,
        ctaText: formData.ctaText,
        ctaLink: formData.ctaLink,
        category: formData.category,
        isActive: formData.isActive,
        order: editingBanner?.order || 0,
      };

      if (editingBanner?._id) {
        // Update
        const response = await fetch(`${API_URL}/banners/${editingBanner._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error('Failed to update banner');
        }

        toast.success("Banner updated successfully");
      } else {
        // Create
        const response = await fetch(`${API_URL}/banners`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error('Failed to create banner');
        }

        toast.success("Banner created successfully");
      }

      handleCloseDialog();
      fetchBanners();
    } catch (error) {
      console.error('Error saving banner:', error);
      toast.error(error instanceof Error ? error.message : "Failed to save banner");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this banner?")) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/banners/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete banner');
      }

      toast.success("Banner deleted successfully");
      fetchBanners();
    } catch (error) {
      console.error('Error deleting banner:', error);
      toast.error("Failed to delete banner");
    }
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const banner = banners.find(b => b._id === id);
      if (!banner) return;

      const response = await fetch(`${API_URL}/banners/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...banner,
          isActive: !currentStatus,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update banner');
      }

      toast.success("Banner status updated");
      fetchBanners();
    } catch (error) {
      console.error('Error updating banner:', error);
      toast.error("Failed to update banner");
    }
  };

  const filteredBanners = filterCategory === "all" 
    ? banners 
    : banners.filter(b => b.category === filterCategory);

  const activeBanners = banners.filter(b => b.isActive).length;

  const getCategoryLabel = (category: string) => {
    return CATEGORY_OPTIONS.find(opt => opt.value === category)?.label || category;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            {category ? `${getCategoryLabel(category)} Banners` : "Banner Management"}
          </h2>
          <p className="text-muted-foreground">
            {category ? `Manage banners for ${getCategoryLabel(category)}` : "Manage banners for different categories"}
          </p>
        </div>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="h-4 w-4 mr-2" />
          Add Banner
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {category ? "Banners in Category" : "Total Banners"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredBanners.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {category ? "Active in Category" : "Active Banners"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {filteredBanners.filter(b => b.isActive).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {category ? "Inactive in Category" : "Categories Covered"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {category
                ? filteredBanners.filter(b => !b.isActive).length
                : new Set(banners.map(b => b.category)).size
              }
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter - Hide if viewing specific category */}
      {!category && (
        <div className="flex items-center gap-4">
          <Label className="text-foreground font-medium">Filter by Category:</Label>
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-64">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {CATEGORY_OPTIONS.map(cat => (
                <SelectItem key={cat.value} value={cat.value}>
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Banners Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            {category
              ? `${getCategoryLabel(category)} Banners`
              : filterCategory === "all"
                ? "All Banners"
                : `${getCategoryLabel(filterCategory)} Banners`
            }
          </CardTitle>
          <CardDescription>
            {category
              ? `Managing ${filteredBanners.length} banner(s) for ${getCategoryLabel(category)}`
              : filterCategory === "all"
                ? "Showing all banners across all categories"
                : `Showing ${filteredBanners.length} banner(s) in this category`
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
              <span className="ml-2 text-muted-foreground">Loading banners...</span>
            </div>
          ) : filteredBanners.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {category
                ? `No banners created for ${getCategoryLabel(category)} yet. Click 'Add Banner' to create one.`
                : filterCategory === "all"
                  ? "No banners created yet. Click 'Add Banner' to create one."
                  : "No banners in this category. Click 'Add Banner' to create one."
              }
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Preview</TableHead>
                  <TableHead>Title</TableHead>
                  {!category && <TableHead>Category</TableHead>}
                  <TableHead>Subtitle</TableHead>
                  <TableHead>CTA</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBanners.map((banner) => (
                  <TableRow key={banner._id} className={!banner.isActive ? "opacity-50" : ""}>
                    <TableCell>
                      <div className="w-20 h-12 bg-muted rounded flex items-center justify-center overflow-hidden">
                        {banner.imageUrl ? (
                          <img
                            src={banner.imageUrl}
                            alt={banner.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        ) : (
                          <Image className="h-6 w-6 text-muted-foreground" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{banner.title}</TableCell>
                    {!category && (
                      <TableCell>
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                          {getCategoryLabel(banner.category)}
                        </span>
                      </TableCell>
                    )}
                    <TableCell>{banner.subtitle}</TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">{banner.ctaText}</span>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleActive(banner._id || '', banner.isActive)}
                        className={banner.isActive ? "text-green-600" : "text-muted-foreground"}
                      >
                        {banner.isActive ? (
                          <><Eye className="h-4 w-4 mr-1" /> Active</>
                        ) : (
                          <><EyeOff className="h-4 w-4 mr-1" /> Hidden</>
                        )}
                      </Button>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenDialog(banner)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleDelete(banner._id || '')}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>{editingBanner ? "Edit Banner" : "Add New Banner"}</DialogTitle>
            <DialogDescription>
              {editingBanner ? "Update the banner details below" : "Fill in the details for the new banner"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 flex-1 overflow-y-auto pr-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              {category ? (
                <Input
                  id="category"
                  value={getCategoryLabel(formData.category)}
                  disabled
                  className="bg-muted"
                />
              ) : (
                <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                  <SelectTrigger id="category">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORY_OPTIONS.map(cat => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title Tag</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., New Arrivals"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="subtitle">Subtitle (Main Heading)</Label>
                <Input
                  id="subtitle"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  placeholder="e.g., Festive Suit Collection"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Short description for the banner"
                rows={2}
              />
            </div>

            <div className="space-y-4">
              <Label htmlFor="imageFile">Banner Image *</Label>

              {/* Image Preview */}
              {imagePreview && (
                <div className="relative w-full h-48 rounded-lg border-2 border-dashed border-gold/30 overflow-hidden bg-muted">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* File Upload */}
              <div className="space-y-2">
                <Label htmlFor="imageFile" className="text-sm font-medium">Upload Image</Label>
                <input
                  id="imageFile"
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="w-full px-4 py-2 border border-border rounded-md cursor-pointer hover:bg-muted transition-colors"
                />
                <p className="text-xs text-muted-foreground">
                  JPG, PNG, GIF up to 5MB. Recommended size: 1200x600px
                </p>
              </div>

              {/* OR Divider */}
              <div className="relative my-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-2 bg-background text-muted-foreground">OR</span>
                </div>
              </div>

              {/* URL Input */}
              <div className="space-y-2">
                <Label htmlFor="imageUrl" className="text-sm font-medium">Image URL</Label>
                <Input
                  id="imageUrl"
                  value={formData.imageUrl}
                  onChange={(e) => {
                    setFormData({ ...formData, imageUrl: e.target.value });
                    setImagePreview(e.target.value);
                  }}
                  placeholder="https://example.com/image.jpg"
                />
                <p className="text-xs text-muted-foreground">
                  Paste a complete image URL instead of uploading
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ctaText">Button Text</Label>
                <Input
                  id="ctaText"
                  value={formData.ctaText}
                  onChange={(e) => setFormData({ ...formData, ctaText: e.target.value })}
                  placeholder="e.g., Shop Now"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ctaLink">Button Link</Label>
                <Input
                  id="ctaLink"
                  value={formData.ctaLink}
                  onChange={(e) => setFormData({ ...formData, ctaLink: e.target.value })}
                  placeholder="e.g., /shop?category=new"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
              />
              <Label htmlFor="isActive">Banner is active and visible</Label>
            </div>

            <DialogFooter className="mt-4 pt-4 border-t">
              <Button type="button" variant="outline" onClick={handleCloseDialog} disabled={isSaving}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                {editingBanner ? "Update Banner" : "Create Banner"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
