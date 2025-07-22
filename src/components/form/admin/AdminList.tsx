import { useEffect, useState, useMemo } from "react";
import { useDispatch } from "react-redux";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { setSelectedAdmin } from "@/redux/features/adminSlice";
import type { TAdmin } from "@/types/admin";
import {
  useGetAllAdminsQuery,
  useDeleteAdminMutation,
} from "@/redux/features/admin/adminApi";
import { Skeleton } from "@/components/ui/skeleton";
import { useDebounce } from "@/hooks/useDebounce";

const AdminList = ({ onEdit }: { onEdit: (admin: TAdmin) => void }) => {
  const dispatch = useDispatch();

  const [filters, setFilters] = useState({
    searchTerm: "",
  });

  const debouncedSearchTerm = useDebounce(filters.searchTerm, 500);

  // Prepare queryParams array for API
  const queryParams = useMemo(() => {
    const params: { name: string; value: string }[] = [];

    if (debouncedSearchTerm) {
      params.push({ name: "searchTerm", value: debouncedSearchTerm });
    }

    return params;
  }, [debouncedSearchTerm]);

  const { data: adminsData, isLoading } = useGetAllAdminsQuery(queryParams);
  const [deleteAdmin] = useDeleteAdminMutation();

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [adminToDelete, setAdminToDelete] = useState<TAdmin | null>(null);

  const handleSearch = (value: string) => {
    setFilters((prev) => ({ ...prev, searchTerm: value }));
  };

  const handleClearFilters = () => {
    setFilters({ searchTerm: "" });
  };

  const handleEdit = (admin: TAdmin) => {
    dispatch(setSelectedAdmin(admin));
    onEdit(admin);
  };

  const handleDelete = (admin: TAdmin) => {
    setAdminToDelete(admin);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (adminToDelete) {
      try {
        await deleteAdmin(adminToDelete.id).unwrap();
        setDeleteDialogOpen(false);
        setAdminToDelete(null);
      } catch (error) {
        console.error("Delete failed", error);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Admin Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 mb-6">
            <Input
              placeholder="Search admins..."
              value={filters.searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="max-w-sm"
            />

            <Button variant="outline" onClick={handleClearFilters}>
              Clear Search
            </Button>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>ID</TableHead>
                  <TableHead>Designation</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {adminsData?.data?.map((admin: TAdmin) => (
                  <TableRow key={admin.id}>
                    <TableCell>
                      {`${admin.name.firstName} ${
                        admin.name.middleName ? admin.name.middleName + " " : ""
                      }${admin.name.lastName}`}
                    </TableCell>
                    <TableCell>{admin.id}</TableCell>
                    <TableCell>{admin.designation}</TableCell>
                    <TableCell>{admin.email}</TableCell>
                    <TableCell>{admin.contactNo}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(admin)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(admin)}
                            className="text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this admin.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
};

export default AdminList;
