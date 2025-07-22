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
import { setSelectedStudent } from "@/redux/features/studentSlice";
import {
  useGetAllStudentsQuery,
  useDeleteStudentMutation,
} from "@/redux/features/student/studentApi";
import { Skeleton } from "@/components/ui/skeleton";
import { useDebounce } from "@/hooks/useDebounce";
import type { TStudent } from "@/types/student";
import { useGetAllAcademicDepartmentsQuery } from "@/redux/features/academic/academicDepartmentApi";
import { useGetAllFacultiesQuery } from "@/redux/features/faculty/facultyApi";
import { useGetAllSemestersQuery } from "@/redux/features/admin/academicManagement.api";
import { Pagination } from "@/components/ui/pagination";

interface StudentListProps {
  onEdit: (student: TStudent) => void;
}

const StudentList = ({ onEdit }: StudentListProps) => {
  const dispatch = useDispatch();

  const [filters, setFilters] = useState({
    searchTerm: "",
    department: "",
    faculty: "",
    semester: "",
  });

  const [page, setPage] = useState(1);
  const limit = 10;

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<TStudent | null>(null);

  const debouncedSearchTerm = useDebounce(filters.searchTerm, 500);

  const queryParams = useMemo(() => {
    const params: { name: string; value: string }[] = [
      { name: "page", value: page.toString() },
      { name: "limit", value: limit.toString() },
    ];
    if (debouncedSearchTerm)
      params.push({ name: "searchTerm", value: debouncedSearchTerm });
    if (filters.department)
      params.push({ name: "department", value: filters.department });
    if (filters.faculty)
      params.push({ name: "faculty", value: filters.faculty });
    if (filters.semester)
      params.push({ name: "semester", value: filters.semester });
    return params;
  }, [debouncedSearchTerm, filters, page]);

  const { data: studentsData, isLoading } = useGetAllStudentsQuery(queryParams);
  const { data: departments } = useGetAllAcademicDepartmentsQuery([]);
  const { data: faculties } = useGetAllFacultiesQuery([]);
  const { data: semesters } = useGetAllSemestersQuery([]);

  const [deleteStudent] = useDeleteStudentMutation();

  const handleSearch = (value: string) =>
    setFilters((prev) => ({ ...prev, searchTerm: value }));
  const handleDepartmentChange = (value: string) => {
    setFilters((prev) => ({ ...prev, department: value }));
    setPage(1);
  };
  const handleFacultyChange = (value: string) => {
    setFilters((prev) => ({ ...prev, faculty: value }));
    setPage(1);
  };
  const handleSemesterChange = (value: string) => {
    setFilters((prev) => ({ ...prev, semester: value }));
    setPage(1);
  };
  const handleClearFilters = () => {
    setFilters({ searchTerm: "", department: "", faculty: "", semester: "" });
    setPage(1);
  };

  const handleEdit = (student: TStudent) => {
    dispatch(setSelectedStudent(student));
    onEdit(student);
  };

  const handleDelete = (student: TStudent) => {
    setStudentToDelete(student);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (studentToDelete) {
      try {
        await deleteStudent(studentToDelete.id).unwrap();
        setDeleteDialogOpen(false);
        setStudentToDelete(null);
      } catch (error) {
        console.error("Failed to delete student:", error);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, idx) => (
          <Skeleton key={idx} className="h-10 w-full" />
        ))}
      </div>
    );
  }

  const students = studentsData?.data || [];
  console.log({ semesters });
  console.log({ faculties });
  console.log({ departments });
  console.log(students);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Student Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 mb-6">
            <div className="flex flex-wrap gap-4">
              <Input
                placeholder="Search students..."
                value={filters.searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="max-w-sm"
              />
              {/* <Select
                value={filters.department}
                onValueChange={handleDepartmentChange}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent>
                  {departments?.data?.map((dept: any) => (
                    <SelectItem key={dept._id} value={dept._id}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={filters.faculty}
                onValueChange={handleFacultyChange}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Faculty" />
                </SelectTrigger>
                <SelectContent>
                  {faculties?.data?.map((faculty: any) => (
                    <SelectItem key={faculty._id} value={faculty._id}>
                      {faculty.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={filters.semester}
                onValueChange={handleSemesterChange}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Semester" />
                </SelectTrigger>
                <SelectContent>
                  {semesters?.data?.map((sem: any) => (
                    <SelectItem key={sem._id} value={sem._id}>
                      {sem.name} {sem.year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select> */}

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
                  <TableHead>ID</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Semester</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students?.map((student: TStudent) => (
                  <TableRow key={student.id}>
                    <TableCell>
                      {`${student?.name?.firstName || ""} ${
                        student?.name?.middleName || ""
                      } ${student?.name?.lastName || ""}`.trim()}
                    </TableCell>
                    <TableCell>{student.id}</TableCell>
                    <TableCell>{student.email}</TableCell>
                    <TableCell>{student.contactNo}</TableCell>
                    <TableCell>
                      {typeof student?.academicDepartment === "object"
                        ? student?.academicDepartment?.name || "N/A"
                        : student?.academicDepartment || "N/A"}
                    </TableCell>
                    <TableCell>
                      {typeof student?.admissionSemester === "object" &&
                      student?.admissionSemester?.name &&
                      student?.admissionSemester?.year
                        ? `${student?.admissionSemester?.name} ${student?.admissionSemester?.year}`
                        : typeof student?.admissionSemester === "string"
                        ? student?.admissionSemester
                        : "N/A"}
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
                            onClick={() => handleEdit(student)}
                            className="cursor-pointer"
                          >
                            <Pencil className="mr-2 h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(student)}
                            className="cursor-pointer text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {studentsData?.meta && (
            <div className="mt-4 flex justify-center">
              <Pagination
                currentPage={page}
                totalPages={Math.ceil(studentsData.meta.total / limit)}
                onPageChange={setPage}
              />
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              student record.
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

export default StudentList;
