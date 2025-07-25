import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  User,
  Package,
  MapPin,
  Calendar,
  Clock,
  Pencil,
  Trash2,
  Phone,
  StickyNote,
  LocateFixed,
  Home,
  Timer,
  CheckCircle,
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
    switch (status.toLowerCase()) {
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

  const formatDateTime = (dateString: string | null) => {
    if (!dateString) return "N/A";
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

  // Parse coordinates, default to 0,0 if invalid
  const lat = parseFloat(packageData.lat?.toString()) || 0;
  const lng = parseFloat(packageData.lon?.toString()) || 0;
  const coordinatesValid = lat !== 0 || lng !== 0;

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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Package details card */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <CardTitle className="text-xl flex items-center gap-2">
                  <Package className="h-5 w-5 text-muted-foreground" />
                  {packageData.packageId || packageData.id}
                </CardTitle>
                <Badge className={statusToColor(packageData.status)}>
                  {packageData.status}
                </Badge>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Orderer Name:</span>
                  <span className="text-muted-foreground">
                    {packageData.orderer_name}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Phone:</span>
                  <span className="text-muted-foreground">
                    {packageData.phone_number}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Home className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Address:</span>
                  <span className="text-muted-foreground">
                    {packageData.home_address}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <StickyNote className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Note:</span>
                  <span className="text-muted-foreground">
                    {packageData.note ?? "N/A"}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <LocateFixed className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Coordinates:</span>
                  <span className="text-muted-foreground">
                    {lat.toFixed(6)}, {lng.toFixed(6)}
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
                  <Timer className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">ETA:</span>
                  <span className="text-muted-foreground">
                    {formatDateTime(packageData.eta)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Received At:</span>
                  <span className="text-muted-foreground">
                    {formatDateTime(packageData.receivedAt)}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Map card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-muted-foreground" />
              Delivery Location
            </CardTitle>
          </CardHeader>
          <CardContent>
            {coordinatesValid ? (
              <div className="h-96 rounded-lg overflow-hidden">
                <iframe
                  width="100%"
                  height="400"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                  src={`https://maps.google.com/maps?q=${packageData.lat},${packageData.lon}&z=15&output=embed`}
                ></iframe>
              </div>
            ) : (
              <div className="h-64 bg-gray-100 rounded-lg flex flex-col items-center justify-center gap-2">
                <MapPin className="h-8 w-8 text-gray-400" />
                <p className="text-gray-500">No valid coordinates provided</p>
                <p className="text-sm text-gray-400">(0, 0)</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
