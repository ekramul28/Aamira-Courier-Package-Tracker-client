import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  User,
  Package,
  MapPin,
  Calendar,
  Clock,
  Weight,
  Hash,
  Pencil,
  Trash2,
} from "lucide-react";
import type { TPackage } from "@/types/package";

interface PackageDetailsProps {
  packageData: TPackage | null;
  onClose: () => void;
  onEdit?: (pkg: TPackage) => void;
  onDelete?: (pkg: TPackage) => void;
}

export default function PackageDetails({
  packageData,
  onClose,
  onEdit,
  onDelete,
}: PackageDetailsProps) {
  if (!packageData) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No package selected</p>
      </div>
    );
  }

  const statusToColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "in_transit":
        return "bg-blue-100 text-blue-700";
      case "delivered":
        return "bg-green-100 text-green-700";
      case "stuck":
        return "bg-red-100 text-red-700";
      case "cancelled":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
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

  const handleEdit = () => {
    if (onEdit) onEdit(packageData);
  };

  const handleDelete = () => {
    if (
      onDelete &&
      window.confirm("Are you sure you want to delete this package?")
    ) {
      onDelete(packageData);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold">Package Details</h2>
          <p className="text-muted-foreground">
            View complete information about this package
          </p>
        </div>
        <div className="flex gap-2">
          {onEdit && (
            <Button
              variant="outline"
              size="icon"
              onClick={handleEdit}
              title="Edit"
            >
              <Pencil className="h-4 w-4" />
            </Button>
          )}
          {onDelete && (
            <Button
              variant="destructive"
              size="icon"
              onClick={handleDelete}
              title="Delete"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <CardTitle className="text-xl flex items-center gap-2">
                <Package className="h-5 w-5 text-muted-foreground" />
                {packageData.id}
              </CardTitle>
              <div className="flex items-center gap-2">
                <Badge className={statusToColor(packageData.status)}>
                  {packageData.status}
                </Badge>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Sender:</span>
                <span className="text-muted-foreground">
                  {packageData.sender}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Recipient:</span>
                <span className="text-muted-foreground">
                  {packageData.recipient}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Origin:</span>
                <span className="text-muted-foreground">
                  {packageData.origin}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Destination:</span>
                <span className="text-muted-foreground">
                  {packageData.destination}
                </span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Weight className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Weight:</span>
                <span className="text-muted-foreground">
                  {packageData.weight} kg
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Created:</span>
                <span className="text-muted-foreground">
                  {formatDateTime(packageData.createdAt)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Updated:</span>
                <span className="text-muted-foreground">
                  {formatDateTime(packageData.updatedAt)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Hash className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Package ID:</span>
                <span className="text-muted-foreground">{packageData.id}</span>
              </div>
            </div>
          </div>
          <Separator />
          {/* Add more details here if needed */}
        </CardContent>
      </Card>
    </div>
  );
}
