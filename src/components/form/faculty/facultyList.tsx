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
import { MoreHorizontal, Pencil, Trash2, BookOpen } from "lucide-react";

import type { TFaculty } from "@/types/faculty";
import { useState } from "react";
import {
  useDeleteFacultyMutation,
  useGetAllFacultiesQuery,
} from "@/redux/features/faculty/facultyApi";

interface FacultyListProps {
  onEdit: (faculty: TFaculty) => void;
  onViewSubjects: (faculty: TFaculty) => void;
}

const FacultyList = ({ onEdit, onViewSubjects }: FacultyListProps) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [facultyToDelete, setFacultyToDelete] = useState<TFaculty | null>(null);
  const [filters, setFilters] = useState({
    search: "",
    department: "",
    faculty: "",
  });

  const { data: facultyData, isLoading } = useGetAllFacultiesQuery(filters);
  console.log("facultyData", facultyData);
  const [deleteFaculty] = useDeleteFacultyMutation();

  const handleSearch = (value: string) => {
    setFilters((prev) => ({ ...prev, search: value }));
  };

  const handleClearFilters = () => {
    setFilters({
      search: "",
      department: "",
      faculty: "",
    });
  };

  const handleDelete = (faculty: TFaculty) => {
    setFacultyToDelete(faculty);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (facultyToDelete) {
      try {
        await deleteFaculty(facultyToDelete.id).unwrap();
        setDeleteDialogOpen(false);
        setFacultyToDelete(null);
      } catch (error) {
        console.error("Failed to delete faculty:", error);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
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
          <CardTitle>Faculty Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 mb-6">
            <div className="flex flex-wrap gap-4">
              <Input
                placeholder="Search faculties..."
                value={filters.search}
                onChange={(e) => handleSearch(e.target.value)}
                className="max-w-sm"
              />

              <Button variant="outline" onClick={handleClearFilters}>
                Clear Filters
              </Button>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Designation</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {facultyData?.data?.map((faculty: TFaculty) => (
                  <TableRow key={faculty.id}>
                    <TableCell>
                      {`${faculty.name.firstName} ${
                        faculty.name.middleName || ""
                      } ${faculty.name.lastName}`}
                    </TableCell>
                    <TableCell>{faculty.academicDepartment}</TableCell>
                    <TableCell>{faculty.designation}</TableCell>
                    <TableCell>{faculty.email}</TableCell>
                    <TableCell>{faculty.contactNo}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => onViewSubjects(faculty)}
                            className="cursor-pointer"
                          >
                            <BookOpen className="mr-2 h-4 w-4" />
                            View Subjects
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => onEdit(faculty)}
                            className="cursor-pointer"
                          >
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(faculty)}
                            className="cursor-pointer text-red-600"
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
              This action cannot be undone. This will permanently delete the
              faculty record.
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

export default FacultyList;
