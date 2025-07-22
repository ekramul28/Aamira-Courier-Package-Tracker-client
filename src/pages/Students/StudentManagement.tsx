import StudentForm from "@/components/form/students/StudentForm";
import StudentList from "@/components/form/students/StudentList";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import type { TStudent } from "@/types/student";
import { Plus } from "lucide-react";
import { useState } from "react";
export default function StudentManagement() {
  const { toast } = useToast();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<
    TStudent | undefined
  >();

  const handleEdit = (student: TStudent) => {
    setSelectedStudent(student);
    setIsFormOpen(true);
  };

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    setSelectedStudent(undefined);
    toast({
      title: "Success",
      description: selectedStudent
        ? "Student updated successfully"
        : "Student added successfully",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Student Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage student profiles, academic records, and personal information
          </p>
        </div>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add New Student
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <StudentForm
              student={selectedStudent}
              onSuccess={handleFormSuccess}
            />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Student List</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <StudentList
            onEdit={handleEdit}
            // students={studentsData?.data || []}
            // isLoading={isLoading}
          />
        </CardContent>
      </Card>
    </div>
  );
}
