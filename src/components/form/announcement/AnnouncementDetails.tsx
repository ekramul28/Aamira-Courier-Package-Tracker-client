import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Calendar, Clock, User, Tag, AlertTriangle } from "lucide-react";
import type { TAnnouncement } from "@/types/announcement";

interface AnnouncementDetailsProps {
  announcement: TAnnouncement | null;
  onClose: () => void;
}

export default function AnnouncementDetails({
  announcement,
  onClose,
}: AnnouncementDetailsProps) {
  if (!announcement) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No announcement selected</p>
      </div>
    );
  }

  const typeToVariant = (type: string) => {
    switch (type) {
      case "enrollment":
        return "default";
      case "academic":
        return "secondary";
      case "job":
        return "outline";
      case "general":
        return "destructive";
      default:
        return "default";
    }
  };

  const priorityToColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-600 dark:text-red-400";
      case "medium":
        return "text-yellow-600 dark:text-yellow-400";
      case "low":
        return "text-green-600 dark:text-green-400";
      default:
        return "text-gray-600 dark:text-gray-400";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold">Announcement Details</h2>
          <p className="text-muted-foreground">
            View complete information about this announcement
          </p>
        </div>
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <CardTitle className="text-xl">{announcement.title}</CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant={typeToVariant(announcement.type)}>
                  {announcement.type}
                </Badge>
                <Badge
                  variant={announcement.isActive ? "default" : "secondary"}
                >
                  {announcement.isActive ? "Active" : "Inactive"}
                </Badge>
                <span
                  className={`text-sm font-medium ${priorityToColor(
                    announcement.priority
                  )}`}
                >
                  {announcement.priority} priority
                </span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-semibold mb-2">Content</h3>
            <p className="text-muted-foreground whitespace-pre-wrap">
              {announcement.content}
            </p>
          </div>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Start Date:</span>
                <span className="text-muted-foreground">
                  {formatDate(announcement.startDate)}
                </span>
              </div>

              {announcement?.endDate && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">End Date:</span>
                  <span className="text-muted-foreground">
                    {formatDate(announcement.endDate)}
                  </span>
                </div>
              )}

              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Created:</span>
                <span className="text-muted-foreground">
                  {formatDateTime(announcement.createdAt)}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Updated:</span>
                <span className="text-muted-foreground">
                  {formatDateTime(announcement.updatedAt)}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Created By:</span>
                <span className="text-muted-foreground">
                  {announcement.createdBy}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Type:</span>
                <Badge variant={typeToVariant(announcement.type)}>
                  {announcement.type}
                </Badge>
              </div>

              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Priority:</span>
                <span
                  className={`font-medium ${priorityToColor(
                    announcement.priority
                  )}`}
                >
                  {announcement.priority}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-medium">Status:</span>
                <Badge
                  variant={announcement.isActive ? "default" : "secondary"}
                >
                  {announcement.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
            </div>
          </div>

          {announcement?.endDate &&
            new Date(announcement.endDate) < new Date() && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  <span className="text-yellow-800 font-medium">
                    This announcement has expired
                  </span>
                </div>
                <p className="text-yellow-700 text-sm mt-1">
                  The end date has passed. Consider updating or deactivating
                  this announcement.
                </p>
              </div>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
