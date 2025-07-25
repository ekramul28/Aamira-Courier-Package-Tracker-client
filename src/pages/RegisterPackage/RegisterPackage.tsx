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
import { usePackageSocket } from "@/hooks/usePackageSocket";

const socket = io("http://localhost:5000"); // Adjust if your backend runs elsewhere

export default function RegisterPackage() {
  const [createPackage, { isLoading }] = useCreatePackageMutation();
  const [deletePackage] = useDeletePackageMutation();
  const [updatePackage] = useUpdatePackageMutation();

  // Modes: list, add, details, edit
  const [mode, setMode] = useState<"list" | "add" | "details" | "edit">("list");
  const [selectedPackage, setSelectedPackage] = useState<TPackage | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // Add these state variables for modals
  const [editModalPackage, setEditModalPackage] = useState<TPackage | null>(
    null
  );
  const [deleteModalPackage, setDeleteModalPackage] = useState<TPackage | null>(
    null
  );

  // Search/filter state
  const [search, setSearch] = useState("");
  // const [statusFilter, setStatusFilter] = useState("ALL"); // Removed status filter

  // Query params for package list
  const queryParams = useMemo(() => {
    const params = [];
    if (search) params.push({ name: "searchTerm", value: search });
    // if (statusFilter && statusFilter !== "ALL") // Removed status filter
    //   params.push({ name: "status", value: statusFilter });
    return params;
  }, [search]); // Removed statusFilter from dependency array

  const { data: packagesData, isLoading: isLoadingPackages } =
    useGetAllPackagesQuery(queryParams);
  const packages: TPackage[] = Array.isArray(packagesData?.data)
    ? packagesData.data
    : [];

  usePackageSocket();

  // Handlers
  const handleCreate = async (data: IPackageFormValues) => {
    console.log("data", data);
    try {
      const result = await createPackage({
        ...data,
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
            orderer_name: selectedPackage.orderer_name,
            home_address: selectedPackage.home_address,
            phone_number: selectedPackage.phone_number,
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
              placeholder="Search by Orderer Name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-xs"
            />

            <Button
              variant="outline"
              onClick={() => {
                setSearch("");
                // setStatusFilter("ALL"); // Removed status filter
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
                  <TableHead>Orderer Name</TableHead>
                  <TableHead>Home Address</TableHead>
                  <TableHead>Phone Number</TableHead>
                  <TableHead>Status</TableHead>

                  <TableHead>ETA</TableHead>
                  <TableHead>Event Timestamp</TableHead>
                  <TableHead>Latitude</TableHead>
                  <TableHead>Longitude</TableHead>
                  <TableHead>Note</TableHead>
                  <TableHead>Received At</TableHead>

                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoadingPackages ? (
                  <TableRow>
                    <TableCell colSpan={15}>Loading...</TableCell>
                  </TableRow>
                ) : packages.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={15}>No packages found.</TableCell>
                  </TableRow>
                ) : (
                  packages?.map((pkg) => (
                    <TableRow
                      key={pkg.id || pkg._id}
                      className="hover:bg-muted"
                    >
                      <TableCell>{pkg.packageId}</TableCell>
                      <TableCell>{pkg.orderer_name}</TableCell>
                      <TableCell>{pkg.home_address}</TableCell>
                      <TableCell>{pkg.phone_number}</TableCell>
                      <TableCell>{pkg.status}</TableCell>

                      <TableCell>
                        {pkg.eta ? new Date(pkg.eta).toLocaleString() : ""}
                      </TableCell>
                      <TableCell>
                        {pkg.eventTimestamp
                          ? new Date(pkg.eventTimestamp).toLocaleString()
                          : ""}
                      </TableCell>
                      <TableCell>{pkg.lat}</TableCell>
                      <TableCell>{pkg.lon}</TableCell>
                      <TableCell>{pkg.note}</TableCell>
                      <TableCell>
                        {pkg.receivedAt
                          ? new Date(pkg.receivedAt).toLocaleString()
                          : ""}
                      </TableCell>

                      <TableCell>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditModalPackage(pkg)}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          className="ml-2"
                          onClick={() => setDeleteModalPackage(pkg)}
                        >
                          Delete
                        </Button>
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
      {/* Edit Package Modal */}
      {editModalPackage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-background rounded-lg shadow-lg p-6 w-full max-w-md relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={() => setEditModalPackage(null)}
            >
              &times;
            </button>
            <PackageForm
              initialValues={{
                orderer_name: editModalPackage.orderer_name,
                home_address: editModalPackage.home_address,
                phone_number: editModalPackage.phone_number,
              }}
              onSubmit={async (data) => {
                await handleUpdate.call(
                  { selectedPackage: editModalPackage },
                  data
                );
                setEditModalPackage(null);
              }}
              submitLabel="Update Package"
              isLoading={isLoading}
            />
          </div>
        </div>
      )}
      {/* Delete Confirmation Modal */}
      {deleteModalPackage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-background rounded-lg shadow-lg p-6 w-full max-w-md relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={() => setDeleteModalPackage(null)}
            >
              &times;
            </button>
            <div className="mb-4">
              Are you sure you want to delete this package?
            </div>
            <div className="flex gap-2">
              <Button
                variant="destructive"
                onClick={async () => {
                  await handleDelete(deleteModalPackage);
                  setDeleteModalPackage(null);
                }}
              >
                Delete
              </Button>
              <Button
                variant="outline"
                onClick={() => setDeleteModalPackage(null)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
