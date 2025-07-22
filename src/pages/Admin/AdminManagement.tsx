import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import AdminForm from "@/components/form/admin/AdminFrom";
import AdminList from "@/components/form/admin/AdminList";
import type { TAdmin } from "@/types/admin";
import { useGetAllAdminsQuery } from "@/redux/features/admin/adminApi";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Pagination } from "@/components/ui/pagination";

export default function AdminManagement() {
  const { toast } = useToast();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<TAdmin | undefined>();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [selectedDesignation, setSelectedDesignation] = useState<string>("");

  // Prepare query parameters
  const queryParams = [
    { name: "page", value: page.toString() },
    { name: "limit", value: limit.toString() },
  ];

  if (selectedDesignation && selectedDesignation !== "all") {
    queryParams.push({ name: "designation", value: selectedDesignation });
  }

  // Get admins with filters
  const { data: adminsData, isLoading } = useGetAllAdminsQuery(queryParams);

  const handleEdit = (admin: TAdmin) => {
    setSelectedAdmin(admin);
    setIsFormOpen(true);
  };

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    setSelectedAdmin(undefined);
    toast({
      title: "Success",
      description: selectedAdmin
        ? "Admin updated successfully"
        : "Admin added successfully",
    });
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleDesignationChange = (value: string) => {
    setSelectedDesignation(value);
    setPage(1); // Reset to first page when filter changes
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Admin Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage admin profiles and system access
          </p>
        </div>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add New Admin
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <AdminForm admin={selectedAdmin} onSuccess={handleFormSuccess} />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Admin List</CardTitle>
            <div className="flex gap-4">
              <Select
                value={selectedDesignation}
                onValueChange={handleDesignationChange}
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select Designation" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Designations</SelectItem>
                  <SelectItem value="super-admin">Super Admin</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="moderator">Moderator</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <AdminList
            onEdit={handleEdit}
            admins={adminsData?.data || []}
            isLoading={isLoading}
          />

          {adminsData?.meta && (
            <div className="mt-4 flex justify-center">
              <Pagination
                currentPage={page}
                totalPages={Math.ceil(adminsData.meta.total / limit)}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
