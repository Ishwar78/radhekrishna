import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Edit, Trash2, Loader2, Settings } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

interface SectionSetting {
  _id?: string;
  id?: string;
  sectionKey: string;
  title: string;
  subtitle: string;
  description: string;
  backgroundPattern: 'diwali' | 'holi' | 'festival' | 'gold' | 'elegant' | 'modern';
  accentColor: string;
  isActive: boolean;
  createdAt: string;
}

const API_URL = import.meta.env.VITE_API_URL || '/api';

const PATTERN_OPTIONS = [
  { value: 'diwali', label: 'Diwali' },
  { value: 'holi', label: 'Holi' },
  { value: 'festival', label: 'Festival' },
  { value: 'gold', label: 'Gold' },
  { value: 'elegant', label: 'Elegant' },
  { value: 'modern', label: 'Modern' },
];

export default function AdminSectionSettingsManagement() {
  const { token } = useAuth();
  const [sections, setSections] = useState<SectionSetting[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<SectionSetting | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    sectionKey: '',
    title: '',
    subtitle: '',
    description: '',
    backgroundPattern: 'elegant' as const,
    accentColor: '#d4a574',
    isActive: true,
  });

  // Load sections on mount
  useEffect(() => {
    fetchSections();
  }, []);

  const fetchSections = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}/section-settings`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch sections');
      }

      const data = await response.json();
      const sectionList = data.sections.map((sec: any) => ({
        _id: sec._id,
        id: sec._id,
        sectionKey: sec.sectionKey,
        title: sec.title,
        subtitle: sec.subtitle,
        description: sec.description,
        backgroundPattern: sec.backgroundPattern,
        accentColor: sec.accentColor,
        isActive: sec.isActive,
        createdAt: new Date(sec.createdAt).toISOString().split('T')[0],
      }));
      setSections(sectionList);
    } catch (error) {
      console.error('Error fetching sections:', error);
      toast.error("Failed to load section settings");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      sectionKey: '',
      title: '',
      subtitle: '',
      description: '',
      backgroundPattern: 'elegant',
      accentColor: '#d4a574',
      isActive: true,
    });
    setEditingSection(null);
  };

  const handleEdit = (section: SectionSetting) => {
    setEditingSection(section);
    setFormData({
      sectionKey: section.sectionKey,
      title: section.title,
      subtitle: section.subtitle,
      description: section.description,
      backgroundPattern: section.backgroundPattern,
      accentColor: section.accentColor,
      isActive: section.isActive,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.sectionKey || !formData.title) {
      toast.error("Section Key and Title are required");
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        title: formData.title,
        subtitle: formData.subtitle,
        description: formData.description,
        backgroundPattern: formData.backgroundPattern,
        accentColor: formData.accentColor,
        isActive: formData.isActive,
      };

      if (editingSection?._id) {
        // Update section
        const response = await fetch(`${API_URL}/section-settings/${editingSection.sectionKey}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error('Failed to update section');
        }

        toast.success("Section updated successfully");
      } else {
        // Create new section
        const response = await fetch(`${API_URL}/section-settings/${formData.sectionKey}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error('Failed to create section');
        }

        toast.success("Section created successfully");
      }

      resetForm();
      setIsDialogOpen(false);
      fetchSections();
    } catch (error) {
      console.error('Error saving section:', error);
      toast.error("Failed to save section");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (sectionKey: string) => {
    if (!confirm('Are you sure you want to delete this section setting?')) return;

    try {
      const response = await fetch(`${API_URL}/section-settings/${sectionKey}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete section');
      }

      toast.success("Section deleted successfully");
      fetchSections();
    } catch (error) {
      console.error('Error deleting section:', error);
      toast.error("Failed to delete section");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Section Settings</h2>
          <p className="text-muted-foreground">Manage section titles, subtitles, and styling</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="h-4 w-4 mr-2" />
              Add Section
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingSection ? "Edit Section" : "Add New Section"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="sectionKey">Section Key (ID)</Label>
                <Input
                  id="sectionKey"
                  value={formData.sectionKey}
                  onChange={(e) => setFormData({ ...formData, sectionKey: e.target.value.toLowerCase() })}
                  placeholder="e.g., featured-products, trending-ethnic-wear"
                  disabled={!!editingSection}
                  required
                />
                <p className="text-xs text-muted-foreground">Use lowercase with hyphens. Cannot be changed after creation.</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Featured Products, New Arrivals"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="subtitle">Subtitle</Label>
                <Input
                  id="subtitle"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  placeholder="e.g., Handpicked styles that define elegance"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Optional detailed description"
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pattern">Background Pattern</Label>
                <Select
                  value={formData.backgroundPattern}
                  onValueChange={(value) => setFormData({ ...formData, backgroundPattern: value as any })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PATTERN_OPTIONS.map(opt => (
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="accentColor">Accent Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="accentColor"
                    type="color"
                    value={formData.accentColor}
                    onChange={(e) => setFormData({ ...formData, accentColor: e.target.value })}
                    className="w-12 h-10"
                  />
                  <Input
                    type="text"
                    value={formData.accentColor}
                    onChange={(e) => setFormData({ ...formData, accentColor: e.target.value })}
                    placeholder="#d4a574"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="button" variant="outline" onClick={resetForm} className="flex-1" disabled={isSaving}>
                  Cancel
                </Button>
                <Button type="submit" className="flex-1" disabled={isSaving}>
                  {isSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  {editingSection ? "Update" : "Create"} Section
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Sections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? (
          <div className="col-span-full flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <span className="ml-2 text-muted-foreground">Loading sections...</span>
          </div>
        ) : sections.length === 0 ? (
          <div className="col-span-full text-center py-8 text-muted-foreground">
            No section settings found. Create one to get started.
          </div>
        ) : (
          sections.map((section) => (
            <Card key={section._id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{section.title}</CardTitle>
                    <p className="text-xs text-muted-foreground mt-1">{section.sectionKey}</p>
                  </div>
                  {section.isActive && (
                    <Badge variant="default" className="text-xs">Active</Badge>
                  )}
                  {!section.isActive && (
                    <Badge variant="secondary" className="text-xs">Inactive</Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {section.subtitle && (
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">Subtitle</p>
                    <p className="text-sm">{section.subtitle}</p>
                  </div>
                )}

                {section.description && (
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">Description</p>
                    <p className="text-sm line-clamp-2">{section.description}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2 pt-2">
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">Pattern</p>
                    <Badge variant="outline" className="text-xs">{section.backgroundPattern}</Badge>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">Accent</p>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-6 h-6 rounded border"
                        style={{ backgroundColor: section.accentColor }}
                      />
                      <span className="text-xs">{section.accentColor}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 pt-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(section)}
                    className="flex-1"
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(section.sectionKey)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Quick Reference */}
      {!isLoading && sections.length > 0 && (
        <Card className="bg-muted/50">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Section Keys Reference
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">
              Use these section keys in your frontend components:
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {sections.map((section) => (
                <div key={section.sectionKey} className="text-xs p-2 bg-background rounded border">
                  <code className="text-primary font-mono">{section.sectionKey}</code>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
