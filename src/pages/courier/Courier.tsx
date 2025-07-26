import { useGetCourierPackageByIdQuery } from "@/redux/features/courier/courierApi";
import { useUpdatePackageMutation } from "@/redux/features/package/packageApi";
import { useGetMeQuery } from "@/redux/features/users/userApi";
import React, { useState, useEffect } from "react";
import { io, Socket } from "socket.io-client";
import { format } from "date-fns";
import {
  MapPin,
  Clock,
  Package,
  User,
  Phone,
  Home,
  Truck,
  CheckCircle,
} from "lucide-react";

// ShadCN Components
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const SOCKET_URL = "http://localhost:5000";

interface PackageData {
  _id: string;
  packageId: string;
  orderer_name: string;
  phone_number: string;
  home_address: string;
  status: string;
  lat: number;
  lon: number;
  eta: string | null;
  eventTimestamp: string | null;
  receivedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

const statusSequence = ["CREATED", "ACCEPTED", "IN_TRANSIT", "DELIVERED"];

const LiveLocationTracker: React.FC<{
  socket: Socket | null;
  onLocationUpdate: (lat: number, lon: number) => void;
}> = ({ socket, onLocationUpdate }) => {
  const [accuracy, setAccuracy] = useState<number | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        onLocationUpdate(latitude, longitude);
        setAccuracy(accuracy);
        if (socket) {
          socket.emit("locationUpdate", { latitude, longitude, accuracy });
        }
      },
      (error) => {
        console.error("Error getting location:", error);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 10000,
        timeout: 15000,
      }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, [socket, onLocationUpdate]);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="relative h-3 w-3">
          <span className="absolute h-full w-full animate-ping rounded-full bg-green-500 opacity-75"></span>
          <span className="relative inline-flex h-3 w-3 rounded-full bg-green-500"></span>
        </div>
        <span className="text-sm font-medium">Live location active</span>
      </div>
      {accuracy && (
        <div className="space-y-1">
          <div className="flex justify-between text-sm">
            <span>GPS Accuracy</span>
            <span>{Math.round(accuracy)} meters</span>
          </div>
          <Progress
            value={100 - Math.min((accuracy / 50) * 100, 100)}
            className="h-2"
          />
        </div>
      )}
    </div>
  );
};

const CourierDashboard: React.FC = () => {
  const [location, setLocation] = useState("");
  const [connected, setConnected] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [eta, setEta] = useState("");
  const [currentLat, setCurrentLat] = useState(0);
  const [currentLon, setCurrentLon] = useState(0);
  const [selectedPackage, setSelectedPackage] = useState<PackageData | null>(
    null
  );

  const { data: userData } = useGetMeQuery();
  const { data: packageData, refetch: refetchPackage } =
    useGetCourierPackageByIdQuery("6883f107aad8688a7cba869a");
  const [updatePackage] = useUpdatePackageMutation();
  const courierPackages = packageData?.data || [];

  useEffect(() => {
    const sock = io(SOCKET_URL);
    setSocket(sock);

    sock.on("connect", () => setConnected(true));
    sock.on("disconnect", () => setConnected(false));

    return () => {
      sock.disconnect();
    };
  }, []);

  const handleLocationUpdate = (lat: number, lon: number) => {
    setCurrentLat(lat);
    setCurrentLon(lon);
  };

  const updatePackageStatus = async (
    pkg: PackageData,
    updateData: Partial<PackageData>
  ) => {
    try {
      // Update via API
      await updatePackage({
        id: pkg._id,
        data: updateData,
      }).unwrap();

      // Update via socket
      if (socket && connected) {
        socket.emit("courierStatusUpdate", {
          packageId: pkg._id,
          ...updateData,
        });
      }

      // Refetch package data
      await refetchPackage();
    } catch (error) {
      console.error("Failed to update package:", error);
    }
  };

  const handleStatusUpdate = async (pkg: PackageData, newStatus: string) => {
    const updateData: Partial<PackageData> = {
      status: newStatus,
      lat: currentLat,
      lon: currentLon,
      eventTimestamp: new Date().toISOString(),
    };

    if (newStatus === "DELIVERED") {
      updateData.receivedAt = new Date().toISOString();
    }

    await updatePackageStatus(pkg, updateData);
  };

  const handleAcceptPackage = async (pkg: PackageData) => {
    if (!eta) return;

    const updateData = {
      status: "ACCEPTED",
      eta,
      lat: currentLat,
      lon: currentLon,
      eventTimestamp: new Date().toISOString(),
    };

    await updatePackageStatus(pkg, updateData);
    setEta("");
    setSelectedPackage(null);
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "CREATED":
        return "secondary";
      case "ACCEPTED":
        return "default";
      case "IN_TRANSIT":
        return "outline";
      case "DELIVERED":
        return "default";
      default:
        return "secondary";
    }
  };

  const getStatusIndex = (status: string) => {
    return statusSequence.indexOf(status);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "CREATED":
        return <Package className="h-4 w-4" />;
      case "ACCEPTED":
        return <Truck className="h-4 w-4" />;
      case "IN_TRANSIT":
        return <Truck className="h-4 w-4" />;
      case "DELIVERED":
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Courier Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your deliveries in real-time
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Avatar>
            <AvatarImage src={userData?.data?.avatar} />
            <AvatarFallback>{userData?.data?.name?.charAt(0)}</AvatarFallback>
          </Avatar>
        </div>
      </div>

      <Tabs defaultValue="active" className="space-y-6">
        <TabsList>
          <TabsTrigger value="active">Active Deliveries</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value="active">
          <div className="grid gap-6">
            {courierPackages
              .filter((pkg) => pkg.status !== "DELIVERED")
              .map((pkg) => (
                <Card
                  key={pkg._id}
                  className="hover:shadow-lg transition-shadow"
                >
                  <CardHeader className="flex flex-row justify-between items-start space-y-0">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <CardTitle className="flex items-center gap-2">
                          {getStatusIcon(pkg.status)}
                          {pkg.packageId}
                        </CardTitle>
                        <Badge variant={getStatusVariant(pkg.status)}>
                          {pkg.status.replace("_", " ")}
                        </Badge>
                      </div>
                      {pkg.eta && (
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Clock className="h-4 w-4 mr-1" />
                          ETA: {format(new Date(pkg.eta), "PPpp")}
                        </div>
                      )}
                    </div>
                    {pkg.status === "CREATED" && (
                      <Dialog
                        onOpenChange={(open) =>
                          open
                            ? setSelectedPackage(pkg)
                            : setSelectedPackage(null)
                        }
                      >
                        <DialogTrigger asChild>
                          <Button size="sm">Accept Delivery</Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Accept Delivery</DialogTitle>
                            <DialogDescription>
                              Confirm the details for package {pkg.packageId}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="eta" className="text-right">
                                Estimated Arrival
                              </Label>
                              <Input
                                id="eta"
                                type="datetime-local"
                                className="col-span-3"
                                value={eta}
                                onChange={(e) => setEta(e.target.value)}
                                min={new Date().toISOString().slice(0, 16)}
                              />
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <MapPin className="h-4 w-4" />
                              <span>Your current location will be shared</span>
                            </div>
                          </div>
                          <DialogFooter>
                            <Button
                              onClick={() => handleAcceptPackage(pkg)}
                              disabled={!eta}
                            >
                              Confirm Acceptance
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    )}
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          <User className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <h4 className="font-medium">Recipient</h4>
                            <p className="text-sm text-muted-foreground">
                              {pkg.orderer_name}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <h4 className="font-medium">Contact</h4>
                            <p className="text-sm text-muted-foreground">
                              {pkg.phone_number}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <Home className="h-5 w-5 text-muted-foreground mt-0.5" />
                          <div>
                            <h4 className="font-medium">Delivery Address</h4>
                            <p className="text-sm text-muted-foreground">
                              {pkg.home_address}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="font-medium">Delivery Progress</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Status</span>
                            <span>{pkg.status.replace("_", " ")}</span>
                          </div>
                          <Progress
                            value={
                              (getStatusIndex(pkg.status) /
                                (statusSequence.length - 1)) *
                              100
                            }
                            className="h-2"
                          />
                          <div className="flex justify-between text-xs text-muted-foreground">
                            {statusSequence.map((status) => (
                              <TooltipProvider>
                                <Tooltip key={status}>
                                  <TooltipTrigger>
                                    <div
                                      className={`w-2 h-2 rounded-full ${
                                        getStatusIndex(pkg.status) >=
                                        getStatusIndex(status)
                                          ? "bg-primary"
                                          : "bg-muted"
                                      }`}
                                    />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>{status.replace("_", " ")}</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="font-medium">Location Data</h4>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="space-y-1">
                            <Label>Latitude</Label>
                            <div className="p-2 rounded-md border">
                              {pkg.lat.toFixed(6)}
                            </div>
                          </div>
                          <div className="space-y-1">
                            <Label>Longitude</Label>
                            <div className="p-2 rounded-md border">
                              {pkg.lon.toFixed(6)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  {pkg.status !== "CREATED" && (
                    <CardFooter className="flex flex-wrap gap-2 border-t pt-4">
                      <Button
                        variant={
                          pkg.status === "IN_TRANSIT" ? "default" : "outline"
                        }
                        onClick={() => handleStatusUpdate(pkg, "IN_TRANSIT")}
                        className="gap-2"
                      >
                        <Truck className="h-4 w-4" />
                        Mark as In Transit
                      </Button>
                      <Button
                        variant={
                          pkg.status === "DELIVERED" ? "default" : "outline"
                        }
                        onClick={() => handleStatusUpdate(pkg, "DELIVERED")}
                        className="gap-2"
                      >
                        <CheckCircle className="h-4 w-4" />
                        Mark as Delivered
                      </Button>
                    </CardFooter>
                  )}
                </Card>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="completed">
          <div className="grid gap-6">
            {courierPackages
              .filter((pkg) => pkg.status === "DELIVERED")
              .map((pkg) => (
                <Card key={pkg._id}>
                  <CardHeader className="flex flex-row justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        {pkg.packageId}
                      </CardTitle>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="default">DELIVERED</Badge>
                        <span className="text-sm text-muted-foreground">
                          {format(
                            new Date(pkg.receivedAt || pkg.updatedAt),
                            "PPpp"
                          )}
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <h4 className="font-medium mb-2">Recipient</h4>
                        <p>{pkg.orderer_name}</p>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Delivery Address</h4>
                        <p>{pkg.home_address}</p>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Completion Time</h4>
                        <p>
                          {format(
                            new Date(pkg.receivedAt || pkg.updatedAt),
                            "PPpp"
                          )}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>
      </Tabs>

      {courierPackages.some((pkg) => pkg.status !== "CREATED") && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Live Location Tracking
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <LiveLocationTracker
                socket={socket}
                onLocationUpdate={handleLocationUpdate}
              />

              <div className="space-y-4">
                <div>
                  <Label>Current Location Description</Label>
                  <Input
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="E.g., Near Central Park, 5th Avenue"
                    className="mt-1"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Latitude</Label>
                    <div className="mt-1 p-2 rounded-md border font-mono">
                      {currentLat.toFixed(6)}
                    </div>
                  </div>
                  <div>
                    <Label>Longitude</Label>
                    <div className="mt-1 p-2 rounded-md border font-mono">
                      {currentLon.toFixed(6)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CourierDashboard;
