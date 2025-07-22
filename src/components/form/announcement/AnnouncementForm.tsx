import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import {
  useCreateAnnouncementMutation,
  useUpdateAnnouncementMutation,
} from "@/redux/features/announcement/announcement.api";
import type { TAnnouncement, TCreateAnnouncement } from "@/types/announcement";

interface AnnouncementFormProps {
  announcement?: TAnnouncement | null;
  onSuccess: () => void;
}

export default function AnnouncementForm({
  announcement,
  onSuccess,
}: AnnouncementFormProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState<TCreateAnnouncement>({
    title: "",
    content: "",
    type: "general",
    priority: "medium",
    isActive: true,
    startDate: new Date().toISOString().split("T")[0],
    endDate: "",
  });

  const [createAnnouncement] = useCreateAnnouncementMutation();
  const [updateAnnouncement] = useUpdateAnnouncementMutation();

  useEffect(() => {
    if (announcement) {
      setFormData({
        title: announcement.title,
        content: announcement.content,
        type: announcement.type,
        priority: announcement.priority,
        isActive: announcement.isActive,
        startDate: new Date(announcement.startDate).toISOString().split("T")[0],
        endDate: announcement.endDate
          ? new Date(announcement.endDate).toISOString().split("T")[0]
          : "",
      });
    }
  }, [announcement]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log(formData);
    try {
      if (announcement) {
        await updateAnnouncement({
          id: announcement._id,
          data: formData,
        }).unwrap();
      } else {
        await createAnnouncement(formData).unwrap();
      }

      onSuccess();
    } catch (error) {
      console.log(error);
      toast({
        title: "Error",
        description: announcement
          ? "Failed to update announcement"
          : "Failed to create announcement",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (
    field: keyof TCreateAnnouncement,
    value: string | boolean
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">
          {announcement ? "Edit Announcement" : "Create New Announcement"}
        </h2>
        <p className="text-muted-foreground">
          {announcement
            ? "Update the announcement details below"
            : "Fill in the details to create a new announcement"}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              placeholder="Enter announcement title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Type *</Label>
            <Select
              value={formData.type}
              onValueChange={(value) => handleInputChange("type", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="enrollment">Enrollment</SelectItem>
                <SelectItem value="academic">Academic</SelectItem>
                <SelectItem value="job">Job</SelectItem>
                <SelectItem value="general">General</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="priority">Priority *</Label>
            <Select
              value={formData.priority}
              onValueChange={(value) => handleInputChange("priority", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="startDate">Start Date *</Label>
            <Input
              id="startDate"
              type="date"
              value={formData.startDate}
              onChange={(e) => handleInputChange("startDate", e.target.value)}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="endDate">End Date (Optional)</Label>
          <Input
            id="endDate"
            type="date"
            value={formData.endDate}
            onChange={(e) => handleInputChange("endDate", e.target.value)}
            min={formData.startDate}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="content">Content *</Label>
          <Textarea
            id="content"
            value={formData.content}
            onChange={(e) => handleInputChange("content", e.target.value)}
            placeholder="Enter announcement content"
            rows={6}
            required
          />
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="isActive"
            checked={formData.isActive}
            onCheckedChange={(checked) =>
              handleInputChange("isActive", checked)
            }
          />
          <Label htmlFor="isActive">Active Announcement</Label>
        </div>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={onSuccess}>
            Cancel
          </Button>
          <Button type="submit">
            {announcement ? "Update Announcement" : "Create Announcement"}
          </Button>
        </div>
      </form>
    </div>
  );
}
