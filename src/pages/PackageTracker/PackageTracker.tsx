import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Pagination } from "@/components/ui/pagination";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  useGetAllPackagesQuery,
  useUpdatePackageMutation,
} from "@/redux/features/package/packageApi";
import { PackageForm } from "@/components/form/package/PackageForm";
import type { PackageFormValues } from "@/components/form/package/PackageForm";
import type { TPackage } from "@/types/package";
import { toast } from "sonner";

const statusOptions = [
  { label: "All", value: "" },
  { label: "Pending", value: "pending" },
  { label: "In Transit", value: "in_transit" },
  { label: "Delivered", value: "delivered" },
  { label: "Stuck", value: "stuck" },
  { label: "Cancelled", value: "cancelled" },
];

export default function PackageTracker() {
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    sender: "",
    recipient: "",
  });
  const [page, setPage] = useState(1);
  const limit = 10;
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<TPackage | null>(null);
  const [updatePackage, { isLoading: isUpdating }] = useUpdatePackageMutation();

  const queryParams = useMemo(() => {
    const params = [
      { name: "page", value: page.toString() },
      { name: "limit", value: limit.toString() },
    ];
    if (filters.search)
      params.push({ name: "searchTerm", value: filters.search });
    if (filters.status) params.push({ name: "status", value: filters.status });
    if (filters.sender) params.push({ name: "sender", value: filters.sender });
    if (filters.recipient)
      params.push({ name: "recipient", value: filters.recipient });
    return params;
  }, [filters, page]);

  const { data: packagesData, isLoading } = useGetAllPackagesQuery(queryParams);
  const packages: TPackage[] = packagesData?.data || [];
  const meta = packagesData?.meta || { total: 0 };

  const handleEdit = (pkg: TPackage) => {
    setSelectedPackage(pkg);
    setEditDialogOpen(true);
  };

  const handleUpdate = async (values: PackageFormValues) => {
    if (!selectedPackage) return;
    try {
      await updatePackage({ id: selectedPackage.id, data: values }).unwrap();
      toast.success("Package updated successfully");
      setEditDialogOpen(false);
      setSelectedPackage(null);
    } catch (error) {
      toast.error("Failed to update package");
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Package List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 mb-6">
            <Input
              placeholder="Search by sender, recipient, origin, destination..."
              value={filters.search}
              onChange={(e) =>
                setFilters((f) => ({ ...f, search: e.target.value }))
              }
              className="max-w-xs"
            />
            <Select
              value={filters.status}
              onValueChange={(v) => setFilters((f) => ({ ...f, status: v }))}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              placeholder="Sender"
              value={filters.sender}
              onChange={(e) =>
                setFilters((f) => ({ ...f, sender: e.target.value }))
              }
              className="max-w-xs"
            />
            <Input
              placeholder="Recipient"
              value={filters.recipient}
              onChange={(e) =>
                setFilters((f) => ({ ...f, recipient: e.target.value }))
              }
              className="max-w-xs"
            />
            <Button
              variant="outline"
              onClick={() =>
                setFilters({
                  search: "",
                  status: "",
                  sender: "",
                  recipient: "",
                })
              }
            >
              Clear Filters
            </Button>
          </div>
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Sender</TableHead>
                  <TableHead>Recipient</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Origin</TableHead>
                  <TableHead>Destination</TableHead>
                  <TableHead>Weight</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {packages.map((pkg: TPackage) => (
                  <TableRow key={pkg.id}>
                    <TableCell>{pkg.id}</TableCell>
                    <TableCell>{pkg.sender}</TableCell>
                    <TableCell>{pkg.recipient}</TableCell>
                    <TableCell>{pkg.status}</TableCell>
                    <TableCell>{pkg.origin}</TableCell>
                    <TableCell>{pkg.destination}</TableCell>
                    <TableCell>{pkg.weight}</TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(pkg)}
                      >
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="mt-4 flex justify-center">
            <Pagination
              currentPage={page}
              totalPages={Math.ceil(meta.total / limit) || 1}
              onPageChange={setPage}
            />
          </div>
        </CardContent>
      </Card>
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Package</DialogTitle>
          </DialogHeader>
          {selectedPackage && (
            <PackageForm
              initialValues={selectedPackage}
              onSubmit={handleUpdate}
              submitLabel="Update Package"
              isLoading={isUpdating}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
