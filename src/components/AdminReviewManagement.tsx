import { useState, useEffect } from "react";
import { Loader2, Trash2, Edit2, Plus, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

interface Review {
  _id: string;
  customerName: string;
  customerImage: string;
  reviewText: string;
  rating: number;
  isActive: boolean;
  order: number;
}

export default function AdminReviewManagement() {
  const { token } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [formData, setFormData] = useState({
    customerName: "",
    customerImage: "",
    reviewText: "",
    rating: 5,
    isActive: true,
  });

  const API_URL = import.meta.env.VITE_API_URL || '/api';

  const fetchReviews = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}/reviews/admin/all`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setReviews(data.reviews || []);
      } else {
        toast.error("Failed to fetch reviews");
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
      toast.error("Error fetching reviews");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          customerImage: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {

    try {
      const method = editingReview ? 'PUT' : 'POST';
      const url = editingReview
        ? `${API_URL}/reviews/${editingReview._id}`
        : `${API_URL}/reviews`;

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success(editingReview ? "Review updated!" : "Review created!");
        setIsOpen(false);
        setFormData({
          customerName: "",
          customerImage: "",
          reviewText: "",
          rating: 5,
          isActive: true,
        });
        setEditingReview(null);
        fetchReviews();
      } else {
        const data = await response.json();
        toast.error(data.error || "Failed to save review");
      }
    } catch (error) {
      console.error('Error saving review:', error);
      toast.error("Error saving review");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return;

    try {
      const response = await fetch(`${API_URL}/reviews/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        toast.success("Review deleted!");
        fetchReviews();
      } else {
        toast.error("Failed to delete review");
      }
    } catch (error) {
      console.error('Error deleting review:', error);
      toast.error("Error deleting review");
    }
  };

  const handleEdit = (review: Review) => {
    setEditingReview(review);
    setFormData({
      customerName: review.customerName,
      customerImage: review.customerImage,
      reviewText: review.reviewText,
      rating: review.rating,
      isActive: review.isActive,
    });
    setIsOpen(true);
  };

  const handleNewReview = () => {
    setEditingReview(null);
    setFormData({
      customerName: "",
      customerImage: "",
      reviewText: "",
      rating: 5,
      isActive: true,
    });
    setIsOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Manage Customer Reviews</h2>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleNewReview} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Review
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingReview ? "Edit Review" : "Create New Review"}
              </DialogTitle>
              <DialogDescription>
                {editingReview ? "Update the review details" : "Add a new customer review"}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="customerName">Customer Name</Label>
                <Input
                  id="customerName"
                  placeholder="Customer name"
                  value={formData.customerName}
                  onChange={(e) =>
                    setFormData(prev => ({
                      ...prev,
                      customerName: e.target.value,
                    }))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="customerImage">Customer Image</Label>
                <Input
                  id="customerImage"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
                {formData.customerImage && (
                  <div className="mt-2">
                    <img
                      src={formData.customerImage}
                      alt="Preview"
                      className="h-32 w-32 object-cover rounded"
                    />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="reviewText">Review Text</Label>
                <textarea
                  id="reviewText"
                  placeholder="Customer review"
                  rows={4}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={formData.reviewText}
                  onChange={(e) =>
                    setFormData(prev => ({
                      ...prev,
                      reviewText: e.target.value,
                    }))
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="rating">Rating (1-5)</Label>
                  <Input
                    id="rating"
                    type="number"
                    min="1"
                    max="5"
                    value={formData.rating}
                    onChange={(e) =>
                      setFormData(prev => ({
                        ...prev,
                        rating: parseInt(e.target.value),
                      }))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="isActive">Active</Label>
                  <select
                    id="isActive"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={formData.isActive ? "true" : "false"}
                    onChange={(e) =>
                      setFormData(prev => ({
                        ...prev,
                        isActive: e.target.value === "true",
                      }))
                    }
                  >
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave}>
                {editingReview ? "Update Review" : "Create Review"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {reviews.length === 0 ? (
        <Card className="p-6 text-center text-muted-foreground">
          No reviews yet. Create your first review!
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review) => (
            <Card key={review._id} className="p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold truncate">{review.customerName}</h3>
                  <p className="text-xs text-muted-foreground">
                    ⭐ {review.rating}/5
                  </p>
                </div>
                <div className="flex gap-2">
                  {review.isActive ? (
                    <Eye className="h-4 w-4 text-green-600" />
                  ) : (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  )}
                </div>
              </div>

              <img
                src={review.customerImage}
                alt={review.customerName}
                className="w-full h-40 object-cover rounded"
              />

              <p className="text-sm text-muted-foreground line-clamp-2">
                {review.reviewText}
              </p>

              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 gap-2"
                  onClick={() => handleEdit(review)}
                >
                  <Edit2 className="h-4 w-4" />
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  className="gap-2"
                  onClick={() => handleDelete(review._id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
