import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Trash2, Edit2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface FilterItem {
  id: string;
  name: string;
  hex?: string;
  order?: number;
  isActive?: boolean;
}

const AdminFilterManagement = () => {
  const { token } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL || '/api';

  // Sizes State
  const [sizes, setSizes] = useState<FilterItem[]>([]);
  const [colors, setColors] = useState<FilterItem[]>([]);
  const [ethnicSubcategories, setEthnicSubcategories] = useState<FilterItem[]>([]);
  const [westernSubcategories, setWesternSubcategories] = useState<FilterItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Dialog States
  const [sizeDialogOpen, setSizeDialogOpen] = useState(false);
  const [colorDialogOpen, setColorDialogOpen] = useState(false);
  const [ethnicDialogOpen, setEthnicDialogOpen] = useState(false);
  const [westernDialogOpen, setWesternDialogOpen] = useState(false);

  const [editingItem, setEditingItem] = useState<FilterItem | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Form States
  const [newName, setNewName] = useState("");
  const [newHex, setNewHex] = useState("#FFFFFF");

  // Fetch filters on mount
  useEffect(() => {
    fetchFilters();
  }, []);

  const fetchFilters = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}/filters/admin/all`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch filters');
      }

      const data = await response.json();
      if (data.success) {
        setSizes(data.filters.sizes || []);
        setColors(data.filters.colors || []);
        setEthnicSubcategories(data.filters.ethnicSubcategories || []);
        setWesternSubcategories(data.filters.westernSubcategories || []);
      }
    } catch (error) {
      console.error('Error fetching filters:', error);
      toast.error('Failed to load filters');
    } finally {
      setIsLoading(false);
    }
  };

  // Add Filter
  const handleAddFilter = async (type: string, name: string, hex?: string) => {
    if (!name.trim()) {
      toast.error('Name is required');
      return;
    }

    try {
      setIsSaving(true);
      const payload: any = { type, name };
      if (hex) payload.hex = hex;

      const response = await fetch(`${API_URL}/filters`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to add filter');
      }

      toast.success('Filter added successfully');
      setNewName('');
      setNewHex('#FFFFFF');
      fetchFilters();

      // Close dialogs
      setSizeDialogOpen(false);
      setColorDialogOpen(false);
      setEthnicDialogOpen(false);
      setWesternDialogOpen(false);
    } catch (error) {
      console.error('Error adding filter:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to add filter');
    } finally {
      setIsSaving(false);
    }
  };

  // Update Filter
  const handleUpdateFilter = async (id: string, name: string, hex?: string) => {
    if (!name.trim()) {
      toast.error('Name is required');
      return;
    }

    try {
      setIsSaving(true);
      const payload: any = { name };
      if (hex) payload.hex = hex;

      const response = await fetch(`${API_URL}/filters/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update filter');
      }

      toast.success('Filter updated successfully');
      setEditingItem(null);
      setNewName('');
      setNewHex('#FFFFFF');
      fetchFilters();

      // Close dialogs
      setSizeDialogOpen(false);
      setColorDialogOpen(false);
      setEthnicDialogOpen(false);
      setWesternDialogOpen(false);
    } catch (error) {
      console.error('Error updating filter:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to update filter');
    } finally {
      setIsSaving(false);
    }
  };

  // Delete Filter
  const handleDeleteFilter = async (id: string) => {
    if (!confirm('Are you sure you want to delete this filter?')) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/filters/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete filter');
      }

      toast.success('Filter deleted successfully');
      fetchFilters();
    } catch (error) {
      console.error('Error deleting filter:', error);
      toast.error('Failed to delete filter');
    }
  };

  const FilterListItem = ({ item, onEdit, onDelete }: any) => (
    <div className="flex items-center justify-between p-3 border rounded-lg bg-card">
      <div className="flex items-center gap-3 flex-1">
        {item.hex && (
          <div
            className="w-8 h-8 rounded border"
            style={{ backgroundColor: item.hex }}
          />
        )}
        <div>
          <span className="font-medium">{item.name}</span>
          {item.hex && <span className="text-xs text-muted-foreground ml-2">{item.hex}</span>}
        </div>
      </div>
      <div className="flex gap-2">
        <button
          onClick={onEdit}
          className="p-1 hover:bg-secondary rounded transition-colors"
        >
          <Edit2 className="h-4 w-4" />
        </button>
        <button
          onClick={onDelete}
          className="p-1 hover:bg-destructive/10 rounded transition-colors"
        >
          <Trash2 className="h-4 w-4 text-destructive" />
        </button>
      </div>
    </div>
  );

  const FilterDialog = ({
    open,
    onOpenChange,
    title,
    onSubmit,
    isColor = false,
  }: any) => (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="filter-name">Name</Label>
            <Input
              id="filter-name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder={isColor ? 'e.g., Red, Blue' : 'e.g., S, M, L, XL'}
              disabled={isSaving}
            />
          </div>
          {isColor && (
            <div>
              <Label htmlFor="filter-hex">Color Code</Label>
              <div className="flex gap-2">
                <Input
                  id="filter-hex"
                  value={newHex}
                  onChange={(e) => setNewHex(e.target.value)}
                  placeholder="#FFFFFF"
                  disabled={isSaving}
                />
                <div
                  className="w-10 h-10 rounded border cursor-pointer"
                  style={{ backgroundColor: newHex }}
                  onClick={() => {
                    const input = document.createElement('input');
                    input.type = 'color';
                    input.value = newHex;
                    input.onchange = (e: any) => setNewHex(e.target.value);
                    input.click();
                  }}
                />
              </div>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button onClick={onSubmit} disabled={isSaving}>
            {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            {editingItem ? 'Update' : 'Add'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Filter Management</h2>
        <p className="text-muted-foreground mt-1">
          Manage sizes, colors, and subcategories for your store
        </p>
      </div>

      <Tabs defaultValue="sizes" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="sizes">Sizes</TabsTrigger>
          <TabsTrigger value="colors">Colors</TabsTrigger>
          <TabsTrigger value="ethnic">Ethnic Wear</TabsTrigger>
          <TabsTrigger value="western">Western Wear</TabsTrigger>
        </TabsList>

        {/* SIZES TAB */}
        <TabsContent value="sizes" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Size Options</CardTitle>
                  <CardDescription>Add or edit available size options</CardDescription>
                </div>
                <Button
                  onClick={() => {
                    setEditingItem(null);
                    setNewName('');
                    setSizeDialogOpen(true);
                  }}
                  className="gap-2"
                  disabled={isSaving}
                >
                  <Plus className="h-4 w-4" />
                  Add Size
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {sizes.map((size) => (
                  <FilterListItem
                    key={size.id}
                    item={size}
                    onEdit={() => {
                      setEditingItem(size);
                      setNewName(size.name);
                      setSizeDialogOpen(true);
                    }}
                    onDelete={() => handleDeleteFilter(size.id)}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* COLORS TAB */}
        <TabsContent value="colors" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Color Options</CardTitle>
                  <CardDescription>Add or edit available colors</CardDescription>
                </div>
                <Button
                  onClick={() => {
                    setEditingItem(null);
                    setNewName('');
                    setNewHex('#FFFFFF');
                    setColorDialogOpen(true);
                  }}
                  className="gap-2"
                  disabled={isSaving}
                >
                  <Plus className="h-4 w-4" />
                  Add Color
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {colors.map((color) => (
                  <FilterListItem
                    key={color.id}
                    item={color}
                    onEdit={() => {
                      setEditingItem(color);
                      setNewName(color.name);
                      setNewHex(color.hex || '#FFFFFF');
                      setColorDialogOpen(true);
                    }}
                    onDelete={() => handleDeleteFilter(color.id)}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ETHNIC SUBCATEGORIES TAB */}
        <TabsContent value="ethnic" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Ethnic Wear Subcategories</CardTitle>
                  <CardDescription>Manage ethnic wear subcategories</CardDescription>
                </div>
                <Button
                  onClick={() => {
                    setEditingItem(null);
                    setNewName('');
                    setEthnicDialogOpen(true);
                  }}
                  className="gap-2"
                  disabled={isSaving}
                >
                  <Plus className="h-4 w-4" />
                  Add Category
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {ethnicSubcategories.map((category) => (
                  <FilterListItem
                    key={category.id}
                    item={category}
                    onEdit={() => {
                      setEditingItem(category);
                      setNewName(category.name);
                      setEthnicDialogOpen(true);
                    }}
                    onDelete={() => handleDeleteFilter(category.id)}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* WESTERN SUBCATEGORIES TAB */}
        <TabsContent value="western" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Western Wear Subcategories</CardTitle>
                  <CardDescription>Manage western wear subcategories</CardDescription>
                </div>
                <Button
                  onClick={() => {
                    setEditingItem(null);
                    setNewName('');
                    setWesternDialogOpen(true);
                  }}
                  className="gap-2"
                  disabled={isSaving}
                >
                  <Plus className="h-4 w-4" />
                  Add Category
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {westernSubcategories.map((category) => (
                  <FilterListItem
                    key={category.id}
                    item={category}
                    onEdit={() => {
                      setEditingItem(category);
                      setNewName(category.name);
                      setWesternDialogOpen(true);
                    }}
                    onDelete={() => handleDeleteFilter(category.id)}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* SIZE DIALOG */}
      <FilterDialog
        open={sizeDialogOpen}
        onOpenChange={setSizeDialogOpen}
        title={editingItem ? 'Edit Size' : 'Add New Size'}
        onSubmit={() => {
          if (editingItem) {
            handleUpdateFilter(editingItem.id, newName);
          } else {
            handleAddFilter('size', newName);
          }
        }}
      />

      {/* COLOR DIALOG */}
      <FilterDialog
        open={colorDialogOpen}
        onOpenChange={setColorDialogOpen}
        title={editingItem ? 'Edit Color' : 'Add New Color'}
        onSubmit={() => {
          if (editingItem) {
            handleUpdateFilter(editingItem.id, newName, newHex);
          } else {
            handleAddFilter('color', newName, newHex);
          }
        }}
        isColor={true}
      />

      {/* ETHNIC DIALOG */}
      <FilterDialog
        open={ethnicDialogOpen}
        onOpenChange={setEthnicDialogOpen}
        title={editingItem ? 'Edit Category' : 'Add New Category'}
        onSubmit={() => {
          if (editingItem) {
            handleUpdateFilter(editingItem.id, newName);
          } else {
            handleAddFilter('ethnicSubcategory', newName);
          }
        }}
      />

      {/* WESTERN DIALOG */}
      <FilterDialog
        open={westernDialogOpen}
        onOpenChange={setWesternDialogOpen}
        title={editingItem ? 'Edit Category' : 'Add New Category'}
        onSubmit={() => {
          if (editingItem) {
            handleUpdateFilter(editingItem.id, newName);
          } else {
            handleAddFilter('westernSubcategory', newName);
          }
        }}
      />
    </div>
  );
};

export default AdminFilterManagement;
