import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Edit, Trash2, Play, Loader2, Upload } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { parseVideoSource, handleVideoError } from "@/lib/videoUtils";

interface SidebarVideo {
  _id?: string;
  id?: string;
  title: string;
  description: string;
  videoUrl: string;
  videoType: 'html5' | 'youtube' | 'vimeo' | 'instagram' | 'tiktok';
  thumbnailUrl: string;
  position: 'left' | 'right';
  displayDuration: number;
  isActive: boolean;
  order: number;
}

const API_URL = import.meta.env.VITE_API_URL || '/api';

const AdminSidebarVideoManagement = () => {
  const { token } = useAuth();
  const [videos, setVideos] = useState<SidebarVideo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState<SidebarVideo | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadMode, setUploadMode] = useState<'file' | 'url'>('url');
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    videoUrl: "",
    videoType: "html5",
    thumbnailUrl: "",
    position: "right",
    displayDuration: "0",
    isActive: true,
    order: "0"
  });

  // Load videos on mount
  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}/sidebar-videos/admin/all`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch videos');
      }

      const data = await response.json();
      setVideos(data.videos || []);
    } catch (error) {
      console.error('Error fetching videos:', error);
      toast.error("Failed to load videos");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.videoUrl) {
      toast.error("Title and video URL are required");
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        videoUrl: formData.videoUrl,
        videoType: formData.videoType,
        thumbnailUrl: formData.thumbnailUrl,
        position: formData.position,
        displayDuration: parseInt(formData.displayDuration) || 0,
        isActive: formData.isActive,
        order: parseInt(formData.order) || 0,
      };

      if (editingVideo?._id) {
        // Update video
        const response = await fetch(`${API_URL}/sidebar-videos/${editingVideo._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error('Failed to update video');
        }

        toast.success("Video updated successfully");
      } else {
        // Create new video
        const response = await fetch(`${API_URL}/sidebar-videos`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Failed to create video');
        }

        toast.success("Video added successfully");
      }

      resetForm();
      fetchVideos();
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error saving video:', error);
      toast.error(error instanceof Error ? error.message : "Failed to save video");
    } finally {
      setIsSaving(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      videoUrl: "",
      videoType: "html5",
      thumbnailUrl: "",
      position: "right",
      displayDuration: "0",
      isActive: true,
      order: "0"
    });
    setEditingVideo(null);
    setUploadMode('url');
    setUploadProgress(0);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'];
    if (!validTypes.includes(file.type)) {
      toast.error('Invalid file type. Please upload MP4, WebM, OGG, or MOV files.');
      return;
    }

    // Validate file size (max 100MB)
    const maxSize = 100 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error('File is too large. Maximum size is 100MB.');
      return;
    }

    // Convert file to base64
    const reader = new FileReader();
    let loadProgress = 0;

    reader.onprogress = (event) => {
      if (event.lengthComputable) {
        loadProgress = Math.round((event.loaded / event.total) * 100);
        setUploadProgress(loadProgress);
      }
    };

    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setFormData({ ...formData, videoUrl: base64, videoType: 'html5' });
      setUploadProgress(0);
      toast.success(`Video uploaded: ${file.name}`);
    };

    reader.onerror = () => {
      toast.error('Failed to read file');
      setUploadProgress(0);
    };

    reader.readAsDataURL(file);
  };

  const handleEdit = (video: SidebarVideo) => {
    setEditingVideo(video);
    setFormData({
      title: video.title,
      description: video.description,
      videoUrl: video.videoUrl,
      videoType: video.videoType,
      thumbnailUrl: video.thumbnailUrl,
      position: video.position,
      displayDuration: String(video.displayDuration),
      isActive: video.isActive,
      order: String(video.order)
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this video?')) return;

    try {
      const response = await fetch(`${API_URL}/sidebar-videos/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete video');
      }

      toast.success("Video deleted successfully");
      fetchVideos();
    } catch (error) {
      console.error('Error deleting video:', error);
      toast.error("Failed to delete video");
    }
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`${API_URL}/sidebar-videos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ isActive: !currentStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update video');
      }

      toast.success(currentStatus ? "Video disabled" : "Video enabled");
      fetchVideos();
    } catch (error) {
      console.error('Error toggling video:', error);
      toast.error("Failed to update video");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Floating Sidebar Videos</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Manage promotional videos shown on the homepage sidebar
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="w-4 h-4 mr-2" />
              Add Video
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-screen overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingVideo ? 'Edit Video' : 'Add New Video'}
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Title */}
              <div className="space-y-2">
                <Label>Title *</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Aishwarya Collection Promo"
                  required
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of the video"
                  rows={3}
                />
              </div>

              {/* Upload Mode Toggle */}
              <div className="space-y-2">
                <Label>Video Source *</Label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant={uploadMode === 'file' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setUploadMode('file')}
                    className="flex-1"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload File
                  </Button>
                  <Button
                    type="button"
                    variant={uploadMode === 'url' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setUploadMode('url')}
                    className="flex-1"
                  >
                    Link/URL
                  </Button>
                </div>
              </div>

              {/* File Upload */}
              {uploadMode === 'file' && (
                <div className="space-y-2">
                  <Label>Upload Video File *</Label>
                  <div className="border-2 border-dashed border-border rounded-lg p-4 text-center bg-muted/50 hover:bg-muted transition-colors">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="video/mp4,video/webm,video/ogg,video/quicktime,.mp4,.webm,.ogg,.mov"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full"
                    >
                      <div className="flex flex-col items-center gap-2">
                        <Upload className="w-8 h-8 text-muted-foreground" />
                        <div>
                          <p className="font-medium text-foreground">Click to upload video</p>
                          <p className="text-xs text-muted-foreground">or drag and drop</p>
                        </div>
                      </div>
                    </button>
                  </div>
                  {uploadProgress > 0 && uploadProgress < 100 && (
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  )}
                  {formData.videoUrl && uploadMode === 'file' && (
                    <p className="text-xs text-green-600 font-medium">✓ Video uploaded successfully</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Supported: MP4, WebM, OGG, MOV (Max 100MB)
                  </p>
                </div>
              )}

              {/* Video URL / Link */}
              {uploadMode === 'url' && (
                <div className="space-y-2">
                  <Label>Video URL / Link *</Label>
                  <Textarea
                    value={formData.videoUrl}
                    onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                    placeholder="Paste video URL (YouTube, Vimeo, direct MP4 link, etc.)"
                    rows={2}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Supports: Direct MP4/WebM links, YouTube, Vimeo, Instagram, TikTok URLs
                  </p>
                </div>
              )}

              {/* Video Type */}
              <div className="space-y-2">
                <Label>Video Type</Label>
                <Select value={formData.videoType} onValueChange={(value) => setFormData({ ...formData, videoType: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="html5">Direct MP4/WebM</SelectItem>
                    <SelectItem value="youtube">YouTube</SelectItem>
                    <SelectItem value="vimeo">Vimeo</SelectItem>
                    <SelectItem value="instagram">Instagram</SelectItem>
                    <SelectItem value="tiktok">TikTok</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Thumbnail URL */}
              <div className="space-y-2">
                <Label>Thumbnail URL (Optional)</Label>
                <Input
                  value={formData.thumbnailUrl}
                  onChange={(e) => setFormData({ ...formData, thumbnailUrl: e.target.value })}
                  placeholder="https://example.com/thumbnail.jpg"
                />
              </div>

              {/* Position */}
              <div className="space-y-2">
                <Label>Position</Label>
                <Select value={formData.position} onValueChange={(value) => setFormData({ ...formData, position: value as 'left' | 'right' })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="left">Left Side</SelectItem>
                    <SelectItem value="right">Right Side</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Display Duration */}
              <div className="space-y-2">
                <Label>Display Duration (seconds)</Label>
                <Input
                  type="number"
                  value={formData.displayDuration}
                  onChange={(e) => setFormData({ ...formData, displayDuration: e.target.value })}
                  placeholder="0 (always show)"
                  min="0"
                />
                <p className="text-xs text-muted-foreground">
                  Leave as 0 to always display the video
                </p>
              </div>

              {/* Order */}
              <div className="space-y-2">
                <Label>Display Order</Label>
                <Input
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: e.target.value })}
                  placeholder="0"
                  min="0"
                />
              </div>

              {/* Active Status */}
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <Label>Active</Label>
                <Switch
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                />
              </div>

              {/* Submit Button */}
              <Button type="submit" className="w-full" disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  editingVideo ? 'Update Video' : 'Add Video'
                )}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>

      <CardContent>
        <div className="space-y-3">
          {videos.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No videos yet. Add your first promotional video!</p>
            </div>
          ) : (
            videos.map((video) => (
              <div
                key={video._id || video.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-24 h-16 rounded-lg overflow-hidden border border-border bg-black/10 flex items-center justify-center">
                    {video.videoUrl && parseVideoSource(String(video.videoUrl)).type === 'html5' ? (
                      <video
                        src={video.videoUrl}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          handleVideoError(e, video.videoUrl);
                          const target = e.target as HTMLVideoElement;
                          target.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/20">
                        <Play className="h-6 w-6 text-primary" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{video.title}</h3>
                      {!video.isActive && (
                        <Badge variant="secondary">Inactive</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {video.position === 'left' ? '← Left' : '→ Right'} • {video.videoType} • Order: {video.order}
                    </p>
                    {video.description && (
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                        {video.description}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => toggleActive(video._id || video.id || '', video.isActive)}
                  >
                    {video.isActive ? 'Disable' : 'Enable'}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(video)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(video._id || video.id || '')}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminSidebarVideoManagement;
