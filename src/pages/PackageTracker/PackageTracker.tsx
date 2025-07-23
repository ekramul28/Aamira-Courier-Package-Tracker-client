import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";

const MOCK_PACKAGES = [
  {
    id: "PKG12345",
    status: "IN_TRANSIT",
    lastSeen: "12m ago",
    location: "39.76,-86.16",
    history: ["Picked up", "In transit"],
  },
  {
    id: "PKG55510",
    status: "OUT_FOR_DEL.",
    lastSeen: "02m ago",
    location: "39.78,-86.10",
    history: ["Picked up", "In transit", "Out for delivery"],
  },
  {
    id: "PKG90001",
    status: "STUCK!",
    lastSeen: "47m ago",
    location: "39.70,-86.21",
    history: ["Picked up", "In transit", "Stuck"],
  },
];

const STATUS_FILTERS = [
  { label: "Active", value: "active" },
  { label: "Stuck", value: "stuck" },
  { label: "Delivered", value: "delivered" },
];

const getStatusColor = (status: string) => {
  if (status === "STUCK!") return "bg-red-100 text-red-700";
  if (status === "OUT_FOR_DEL.") return "bg-yellow-100 text-yellow-700";
  if (status === "IN_TRANSIT") return "bg-blue-100 text-blue-700";
  return "";
};

const PackageTracker: React.FC = () => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("active");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [mapLocation, setMapLocation] = useState<string | null>(null);

  const filteredPackages = MOCK_PACKAGES.filter((pkg) => {
    const matchesSearch = pkg.id.toLowerCase().includes(search.toLowerCase());
    if (filter === "active") return matchesSearch && pkg.status !== "STUCK!";
    if (filter === "stuck") return matchesSearch && pkg.status === "STUCK!";
    return matchesSearch;
  });

  const hasStuck = MOCK_PACKAGES.some((pkg) => pkg.status === "STUCK!");

  // Helper to parse lat/lng
  const getLatLng = (loc: string) => {
    const [lat, lng] = loc.split(",").map(Number);
    return { lat, lng };
  };

  return (
    <div className=" mt-8">
      <Card className="p-4 mb-4">
        <h1 className="text-2xl font-bold mb-2">Aamira Package Tracker</h1>
        <div className="flex gap-4 items-center mb-2">
          <div className="flex-1">
            <Input
              placeholder="Search by Package ID"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              {STATUS_FILTERS.map((f) => (
                <SelectItem key={f.value} value={f.value}>
                  {f.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <hr />
        {hasStuck && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-red-100 text-red-700 px-4 py-2 rounded mt-3 font-semibold shadow"
          >
            ⚠️ Alert: One or more packages appear to be stuck!
          </motion.div>
        )}
      </Card>
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>Package ID</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Seen</TableHead>
              <TableHead>Location</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPackages.map((pkg, idx) => (
              <React.Fragment key={pkg.id}>
                <motion.tr
                  layout
                  className={`cursor-pointer ${
                    pkg.status === "STUCK!" ? "bg-red-50" : "hover:bg-muted"
                  }`}
                  onClick={() =>
                    setExpanded(expanded === pkg.id ? null : pkg.id)
                  }
                  initial={false}
                  animate={{ scale: expanded === pkg.id ? 1.01 : 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <TableCell>{idx + 1}</TableCell>
                  <TableCell>{pkg.id}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded text-xs font-bold ${getStatusColor(
                        pkg.status
                      )}`}
                    >
                      {pkg.status}
                    </span>
                  </TableCell>
                  <TableCell>{pkg.lastSeen}</TableCell>
                  <TableCell>
                    <button
                      className="underline text-blue-700 hover:text-blue-900"
                      onClick={(e) => {
                        e.stopPropagation();
                        setMapLocation(pkg.location);
                      }}
                    >
                      {pkg.location}
                    </button>
                  </TableCell>
                </motion.tr>
                <AnimatePresence>
                  {expanded === pkg.id && (
                    <motion.tr
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-muted"
                    >
                      <TableCell colSpan={5} className="p-4">
                        <div className="flex flex-col gap-2">
                          <div className="font-semibold">Package History:</div>
                          <ul className="list-disc list-inside text-sm">
                            {pkg.history.map((h, i) => (
                              <li key={i}>{h}</li>
                            ))}
                          </ul>
                          <div className="mt-2">
                            <span className="font-semibold">Map Pin:</span>
                            <button
                              className="underline text-blue-700 hover:text-blue-900"
                              onClick={(e) => {
                                e.stopPropagation();
                                setMapLocation(pkg.location);
                              }}
                            >
                              {pkg.location}
                            </button>
                          </div>
                        </div>
                      </TableCell>
                    </motion.tr>
                  )}
                </AnimatePresence>
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </Card>
      <Dialog open={!!mapLocation} onOpenChange={() => setMapLocation(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Package Location</DialogTitle>
          </DialogHeader>
          {mapLocation &&
            (() => {
              const { lat, lng } = getLatLng(mapLocation);
              return (
                <div className="w-full h-72">
                  <iframe
                    title="Map"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    loading="lazy"
                    allowFullScreen
                    src={`https://www.openstreetmap.org/export/embed.html?bbox=${
                      lng - 0.01
                    }%2C${lat - 0.01}%2C${lng + 0.01}%2C${
                      lat + 0.01
                    }&layer=mapnik&marker=${lat}%2C${lng}`}
                  />
                  <div className="text-xs text-center mt-2">
                    Lat: {lat}, Lng: {lng}
                  </div>
                </div>
              );
            })()}
          <DialogClose asChild>
            <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded">
              Close
            </button>
          </DialogClose>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PackageTracker;
