import React, { useState, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { io } from "socket.io-client";
import { toast } from "sonner";
import {
  useCreatePackageMutation,
  useDeletePackageMutation,
  useUpdatePackageMutation,
  useGetAllPackagesQuery,
} from "@/redux/features/package/packageApi";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  PackageForm,
  type IPackageFormValues,
  packageStatusOptions,
} from "@/components/form/package/PackageForm";
import type { TPackage } from "@/types/package";
import PackageDetails from "@/components/form/package/PackageDetails";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const socket = io("http://localhost:5000"); // Adjust if your backend runs elsewhere

const mapStatusToForm = (status: string): IPackageFormValues["status"] => {
  switch (status) {
    case "pending":
      return "CREATED";
    case "in_transit":
      return "IN_TRANSIT";
    case "delivered":
      return "DELIVERED";
    case "stuck":
      return "EXCEPTION";
    case "cancelled":
      return "CANCELLED";
    default:
      return "CREATED";
  }
};

export default function RegisterPackage() {
  const [createPackage, { isLoading }] = useCreatePackageMutation();
  const [deletePackage] = useDeletePackageMutation();
  const [updatePackage] = useUpdatePackageMutation();

  // Modes: list, add, details, edit
  const [mode, setMode] = useState<"list" | "add" | "details" | "edit">("list");
  const [selectedPackage, setSelectedPackage] = useState<TPackage | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // Search/filter state
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Query params for package list
  const queryParams = useMemo(() => {
    const params = [];
    if (search) params.push({ name: "searchTerm", value: search });
    if (statusFilter && statusFilter !== "ALL")
      params.push({ name: "status", value: statusFilter });
    return params;
  }, [search, statusFilter]);

  const { data: packagesData, isLoading: isLoadingPackages } =
    useGetAllPackagesQuery(queryParams);
  const packages: TPackage[] = Array.isArray(packagesData?.data)
    ? packagesData.data
    : [];

  // Handlers
  const handleCreate = async (data: IPackageFormValues) => {
    try {
      const result = await createPackage({
        ...data,
        status: data.status || "CREATED",
      }).unwrap();
      toast.success("Package registered successfully!");
      socket.emit("package_registered", result);
      setSelectedPackage(result);
      setShowAddModal(false);
      setMode("details");
    } catch (error) {
      toast.error("Failed to register package");
    }
  };

  const handleUpdate = async (data: IPackageFormValues) => {
    if (!selectedPackage) return;
    try {
      const result = await updatePackage({
        id: selectedPackage.id,
        data,
      }).unwrap();
      toast.success("Package updated successfully!");
      setSelectedPackage(result);
      setMode("details");
    } catch (error) {
      toast.error("Failed to update package");
    }
  };

  const handleDelete = async (pkg?: TPackage) => {
    const pkgToDelete = pkg || selectedPackage;
    if (!pkgToDelete) return;
    if (!window.confirm("Are you sure you want to delete this package?"))
      return;
    try {
      await deletePackage(pkgToDelete.id).unwrap();
      toast.success("Package deleted successfully!");
      setSelectedPackage(null);
      setMode("list");
    } catch (error) {
      toast.error("Failed to delete package");
    }
  };

  // Render modes
  if (mode === "add") {
    return (
      <div className="flex flex-col items-center min-h-screen bg-gray-50 dark:bg-background p-4">
        <PackageForm
          onSubmit={handleCreate}
          submitLabel="Register Package"
          isLoading={isLoading}
        />
        <Button
          className="mt-4"
          variant="outline"
          onClick={() => setMode("list")}
        >
          Cancel
        </Button>
      </div>
    );
  }

  if (mode === "edit" && selectedPackage) {
    return (
      <div className="flex flex-col items-center min-h-screen bg-gray-50 dark:bg-background p-4">
        <PackageForm
          initialValues={{
            packageId: selectedPackage.packageId ?? selectedPackage.id ?? "",
            status: mapStatusToForm(selectedPackage.status),
            lat: selectedPackage.lat,
            lon: selectedPackage.lon,
            note: selectedPackage.note,
            eta: selectedPackage.eta,
          }}
          onSubmit={handleUpdate}
          submitLabel="Update Package"
          isLoading={isLoading}
        />
        <Button
          className="mt-4"
          variant="outline"
          onClick={() => setMode("details")}
        >
          Cancel
        </Button>
      </div>
    );
  }

  if (mode === "details" && selectedPackage) {
    return (
      <div className="flex flex-col items-center min-h-screen bg-gray-50 dark:bg-background p-4">
        <PackageDetails
          packageData={selectedPackage}
          onClose={() => setMode("list")}
          onEdit={() => setMode("edit")}
          onDelete={handleDelete}
        />
      </div>
    );
  }

  // Default: list mode
  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-50 dark:bg-background p-4">
      {/* Package List with Search/Filter */}
      <Card className="w-full  mb-8">
        <CardHeader>
          <CardTitle>All Packages</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 mb-4">
            <Input
              placeholder="Search by Package ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-xs"
            />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Statuses</SelectItem>
                {packageStatusOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              onClick={() => {
                setSearch("");
                setStatusFilter("ALL");
              }}
            >
              Clear Filters
            </Button>
            {/* Add Package Button */}
            <div className="flex justify-end items-end">
              <Button
                onClick={() => {
                  setSelectedPackage(null);
                  setShowAddModal(true);
                }}
              >
                Add Package
              </Button>
            </div>
          </div>
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Package ID</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Latitude</TableHead>
                  <TableHead>Longitude</TableHead>
                  <TableHead>Note</TableHead>
                  <TableHead>ETA</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoadingPackages ? (
                  <TableRow>
                    <TableCell colSpan={6}>Loading...</TableCell>
                  </TableRow>
                ) : packages.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6}>No packages found.</TableCell>
                  </TableRow>
                ) : (
                  packages?.map((pkg) => (
                    <TableRow
                      key={pkg.id}
                      className="cursor-pointer hover:bg-muted"
                      onClick={() => {
                        setSelectedPackage(pkg);
                        setMode("details");
                      }}
                    >
                      <TableCell>{pkg.packageId ?? pkg.id}</TableCell>
                      <TableCell>{pkg.status}</TableCell>
                      <TableCell>{pkg.lat ?? "-"}</TableCell>
                      <TableCell>{pkg.lon ?? "-"}</TableCell>
                      <TableCell>{pkg.note ?? "-"}</TableCell>
                      <TableCell>
                        {pkg.eta ? new Date(pkg.eta).toLocaleString() : "-"}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      {/* Add Package Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-background rounded-lg shadow-lg p-6 w-full max-w-md relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={() => setShowAddModal(false)}
            >
              &times;
            </button>
            <PackageForm
              onSubmit={handleCreate}
              submitLabel="Register Package"
              isLoading={isLoading}
            />
          </div>
        </div>
      )}
    </div>
  );
}
