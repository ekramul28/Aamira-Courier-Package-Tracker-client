import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Plus, MoreHorizontal, Pencil, Trash2, BookOpen } from "lucide-react";

import type { TFaculty } from "@/types/faculty";

import type { TQueryParam } from "@/types/global";
import { Pagination } from "@/components/ui/pagination";
import { useToast } from "@/components/ui/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import FacultyForm from "@/components/form/faculty/facultyForm";
import {
  useDeleteFacultyMutation,
  useGetAllFacultiesQuery,
} from "@/redux/features/faculty/facultyApi";

export default function FacultyManagement() {
  const { toast } = useToast();
  const [faculties, setFaculties] = useState<TFaculty[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedFaculty, setSelectedFaculty] = useState<
    TFaculty | undefined
  >();
  const [isSubjectsDialogOpen, setIsSubjectsDialogOpen] = useState(false);
  const [selectedFacultyForSubjects, setSelectedFacultyForSubjects] = useState<
    TFaculty | undefined | any
  >();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [facultyToDelete, setFacultyToDelete] = useState<any | null>(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [filters, setFilters] = useState({
    search: "",
    department: "",
    status: "",
  });

  const [deleteFaculty] = useDeleteFacultyMutation();

  // Prepare query params
  const queryParams: TQueryParam[] = [
    { name: "page", value: page },
    { name: "limit", value: limit },
  ];

  if (filters.search) {
    queryParams.push({ name: "searchTerm", value: filters.search });
  }
  if (filters.department) {
    queryParams.push({ name: "department", value: filters.department });
  }
  if (filters.status) {
    queryParams.push({ name: "status", value: filters.status });
  }

  const { data: facultyData, isLoading } = useGetAllFacultiesQuery(queryParams);
  console.log("facultyData", facultyData);
  const handleSearch = (value: string) => {
    setFilters((prev) => ({ ...prev, search: value }));
    setPage(1);
  };

  const handleDepartmentChange = (value: string) => {
    setFilters((prev) => ({ ...prev, department: value }));
    setPage(1);
  };

  const handleStatusChange = (value: string) => {
    setFilters((prev) => ({ ...prev, status: value }));
    setPage(1);
  };

  const handleClearFilters = () => {
    setFilters({
      search: "",
      department: "",
      status: "",
    });
    setPage(1);
  };

  const handleFormSuccess = (updatedFaculty?: TFaculty) => {
    if (updatedFaculty) {
      setFaculties((prev) =>
        prev.map((faculty) =>
          faculty.id === updatedFaculty.id ? updatedFaculty : faculty
        )
      );
    }
    setIsFormOpen(false);
    setSelectedFaculty(undefined);
    toast({
      title: "Success",
      description: updatedFaculty
        ? "Faculty updated successfully"
        : "Faculty added successfully",
    });
  };

  const handleEdit = (faculty: TFaculty) => {
    setSelectedFaculty(faculty);
    setIsFormOpen(true);
  };

  const handleViewSubjects = (faculty: TFaculty) => {
    setSelectedFacultyForSubjects(faculty);
    setIsSubjectsDialogOpen(true);
  };

  const handleDelete = (faculty: any) => {
    setFacultyToDelete(faculty);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    try {
      if (facultyToDelete) {
        await deleteFaculty(facultyToDelete._id).unwrap();
        toast({
          title: "Success",
          description: "Faculty deleted successfully",
        });
        setDeleteDialogOpen(false);
        setFacultyToDelete(null);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete faculty",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Faculty Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage faculty profiles, assigned subjects, and academic records
          </p>
        </div>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add New Faculty
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <FacultyForm
              faculty={selectedFaculty}
              onSuccess={handleFormSuccess}
            />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Faculty List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 mb-6">
            <Input
              placeholder="Search faculties..."
              value={filters.search}
              onChange={(e) => handleSearch(e.target.value)}
              className="max-w-sm"
            />
            <Select
              value={filters.department}
              onValueChange={handleDepartmentChange}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="computer-science">
                  Computer Science
                </SelectItem>
                <SelectItem value="engineering">Engineering</SelectItem>
                <SelectItem value="business">Business</SelectItem>
                <SelectItem value="arts">Arts</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filters.status} onValueChange={handleStatusChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="on_leave">On Leave</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={handleClearFilters}>
              Clear Filters
            </Button>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Assigned Subjects</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : facultyData?.data?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center">
                      No faculties found
                    </TableCell>
                  </TableRow>
                ) : (
                  facultyData?.data?.map((faculty: any) => (
                    <TableRow key={faculty._id}>
                      <TableCell>{faculty.fullName}</TableCell>
                      <TableCell>{faculty.academicDepartment?.name}</TableCell>
                      <TableCell>{faculty.email}</TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            faculty.status === "active"
                              ? "bg-green-100 text-green-800"
                              : faculty.status === "inactive"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {faculty.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        {faculty.assignedSubjects?.length || 0} subjects
                      </TableCell>
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
                              onClick={() => handleViewSubjects(faculty)}
                              className="cursor-pointer"
                            >
                              <BookOpen className="mr-2 h-4 w-4" />
                              View Subjects
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleEdit(faculty)}
                              className="cursor-pointer"
                            >
                              <Pencil className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDelete(faculty)}
                              className="text-red-600"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {facultyData?.meta && (
            <div className="mt-4 flex justify-center">
              <Pagination
                currentPage={page}
                totalPages={Math.ceil(facultyData.meta.total / limit)}
                onPageChange={setPage}
              />
            </div>
          )}
        </CardContent>
      </Card>

      <AnimatePresence mode="wait">
        <motion.div
          key="faculty-list"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
        >
          <div className="grid gap-4">
            {faculties.map((faculty: any) => (
              <div key={faculty.id} className="p-6 border rounded-lg space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-semibold">
                      {faculty.firstName} {faculty.lastName}
                    </h3>
                    <p className="text-muted-foreground">
                      {faculty?.academicDepartment?.name}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {faculty.email}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewSubjects(faculty)}
                    >
                      View Subjects
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(faculty)}
                    >
                      Edit
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2">
                      Assigned Subjects
                    </h4>
                    <div className="space-y-2">
                      {faculty.assignedSubjects.map((subject: any) => (
                        <div
                          key={subject.id}
                          className="text-sm p-2 bg-muted rounded"
                        >
                          {subject.name} (Semester {subject.semester})
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      <Dialog
        open={isSubjectsDialogOpen}
        onOpenChange={setIsSubjectsDialogOpen}
      >
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedFacultyForSubjects && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold">
                  {selectedFacultyForSubjects.firstName}{" "}
                  {selectedFacultyForSubjects.lastName}'s Subjects
                </h2>
                <p className="text-muted-foreground">
                  Department: {selectedFacultyForSubjects.department}
                </p>
              </div>

              <div className="space-y-4">
                {selectedFacultyForSubjects.assignedSubjects.map(
                  (subject: any, index: any | string) => (
                    <div
                      key={index}
                      className="p-4 border rounded-lg space-y-4"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">{subject.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            Code: {subject.code} | Semester: {subject.semester}
                          </p>
                        </div>
                        <Button variant="outline" size="sm">
                          View Students
                        </Button>
                      </div>

                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Student List</h4>
                        <div className="border rounded-md">
                          <table className="w-full">
                            <thead>
                              <tr className="border-b">
                                <th className="text-left p-2">Student ID</th>
                                <th className="text-left p-2">Name</th>
                                <th className="text-left p-2">Grade</th>
                                <th className="text-left p-2">Attendance</th>
                              </tr>
                            </thead>
                            <tbody>
                              {subject.students.map((student: any) => (
                                <tr
                                  key={student.studentId}
                                  className="border-b"
                                >
                                  <td className="p-2">{student.studentId}</td>
                                  <td className="p-2">{student.name}</td>
                                  <td className="p-2">
                                    {student.grade || "N/A"}
                                  </td>
                                  <td className="p-2">{student.attendance}%</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Grading History</h4>
                        <div className="border rounded-md">
                          <table className="w-full">
                            <thead>
                              <tr className="border-b">
                                <th className="text-left p-2">Date</th>
                                <th className="text-left p-2">Student ID</th>
                                <th className="text-left p-2">Grade</th>
                                <th className="text-left p-2">Semester</th>
                              </tr>
                            </thead>
                            <tbody>
                              {subject.gradingHistory.map(
                                (record: any, index: any) => (
                                  <tr key={index} className="border-b">
                                    <td className="p-2">{record.date}</td>
                                    <td className="p-2">{record.studentId}</td>
                                    <td className="p-2">{record.grade}</td>
                                    <td className="p-2">{record.semester}</td>
                                  </tr>
                                )
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

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
    </div>
  );
}
