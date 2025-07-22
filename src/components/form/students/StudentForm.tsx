import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { FormFields } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useGetAllAcademicDepartmentsQuery } from "@/redux/features/academic/academicDepartmentApi";
import { useGetAllAcademicSemestersQuery } from "@/redux/features/academic/academicSemesterApi";
import {
  useCreateStudentMutation,
  useUpdateStudentMutation,
} from "@/redux/features/student/studentApi";
import type { TStudent } from "@/types/student";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const studentSchema = z.object({
  name: z.object({
    firstName: z
      .string()
      .min(1, "First name is required")
      .max(20, "Name cannot be more than 20 characters"),
    middleName: z.string().optional(),
    lastName: z
      .string()
      .min(1, "Last name is required")
      .max(20, "Name cannot be more than 20 characters"),
  }),
  profileImg: z.any().optional(),
  gender: z.enum(["male", "female", "other"]),
  dateOfBirth: z.string(),
  email: z.string().email("Invalid email address"),
  contactNo: z.string().min(1, "Contact number is required"),
  emergencyContactNo: z.string().min(1, "Emergency contact number is required"),
  bloodGroup: z.enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]),
  presentAddress: z.string().min(1, "Present address is required"),
  permanentAddress: z.string().min(1, "Permanent address is required"),
  guardian: z.object({
    fatherName: z.string().min(1, "Father's name is required"),
    fatherOccupation: z.string().min(1, "Father's occupation is required"),
    fatherContactNo: z.string().min(1, "Father's contact number is required"),
    motherName: z.string().min(1, "Mother's name is required"),
    motherOccupation: z.string().min(1, "Mother's occupation is required"),
    motherContactNo: z.string().min(1, "Mother's contact number is required"),
  }),
  localGuardian: z.object({
    name: z.string().min(1, "Local guardian's name is required"),
    occupation: z.string().min(1, "Local guardian's occupation is required"),
    contactNo: z.string().min(1, "Local guardian's contact number is required"),
    address: z.string().min(1, "Local guardian's address is required"),
  }),
  admissionSemester: z.string().min(1, "Admission Semester is required"),
  academicDepartment: z.string().min(1, "Academic Department is required"),
});

type StudentFormData = z.infer<typeof studentSchema>;

interface StudentFormProps {
  student?: TStudent;
  onSuccess?: () => void;
}

const StudentForm = ({ student, onSuccess }: StudentFormProps) => {
  const { toast } = useToast();
  const [createStudent] = useCreateStudentMutation();
  const [updateStudent] = useUpdateStudentMutation();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const { data: semestersData } = useGetAllAcademicSemestersQuery([]);
  const { data: departmentsData } = useGetAllAcademicDepartmentsQuery([]);

  const form = useForm<StudentFormData>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      name: {
        firstName: "",
        middleName: "",
        lastName: "",
      },
      gender: "male",
      dateOfBirth: "",
      email: "",
      contactNo: "",
      emergencyContactNo: "",
      bloodGroup: "A+",
      presentAddress: "",
      permanentAddress: "",

      guardian: {
        fatherName: "",
        fatherOccupation: "",
        fatherContactNo: "",
        motherName: "",
        motherOccupation: "",
        motherContactNo: "",
      },
      localGuardian: {
        name: "",
        occupation: "",
        contactNo: "",
        address: "",
      },
      admissionSemester: "",
      academicDepartment: "",
    },
  });

  useEffect(() => {
    if (student) {
      form.reset({
        name: student.name,
        gender: student.gender,
        dateOfBirth: student.dateOfBirth,
        email: student.email,
        contactNo: student.contactNo,
        emergencyContactNo: student.emergencyContactNo,
        bloodGroup: student.bloodGroup,
        presentAddress: student.presentAddress,
        permanentAddress: student.permanentAddress,
        guardian: student.guardian,
        localGuardian: student.localGuardian,
        admissionSemester:
          typeof student.admissionSemester === "string"
            ? student.admissionSemester
            : student.admissionSemester?.name,
        academicDepartment:
          typeof student.academicDepartment === "string"
            ? student.academicDepartment
            : student.academicDepartment?.name,
      });
    }
  }, [student, form]);

  const onSubmit = async (data: StudentFormData) => {
    console.log(data);
    try {
      const formData = new FormData();
      const studentData = {
        password: "123456",
        student: {
          ...data,
          user: student?.user || "",
          id: student?.id || "",
        },
      };
      formData.append("data", JSON.stringify(studentData));

      if (selectedImage) {
        formData.append("file", selectedImage);
      }

      if (student) {
        await updateStudent({
          id: student.id,
          updatedData: {
            student: {
              ...data,
              user: student.user,
              id: student.id,
            },
          },
        }).unwrap();
        toast({
          title: "Success",
          description: "Student updated successfully",
        });
      } else {
        await createStudent(formData as any).unwrap();
        toast({
          title: "Success",
          description: "Student added successfully",
        });
      }
      onSuccess?.();
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Error",
        description: "Failed to save student data",
        variant: "destructive",
      });
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  // Convert data to select options format
  const semesterOptions =
    semestersData?.data?.map((semester: any) => ({
      label: `${semester.name} `,
      value: semester._id,
    })) || [];

  const departmentOptions =
    departmentsData?.data?.map((department: any) => ({
      label: department.name,
      value: department._id,
    })) || [];
  console.log(semesterOptions);
  console.log(departmentOptions);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="w-full">
        <CardHeader>
          <CardTitle>{student ? "Edit Student" : "Add New Student"}</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Personal Information</h3>

                {/* Image Upload Field */}
                <div className="flex flex-col gap-2">
                  <FormField
                    control={form.control}
                    name="profileImg"
                    render={({ field: { onChange, value, ...field } }) => (
                      <FormItem>
                        <FormLabel>Profile Image</FormLabel>
                        <FormControl>
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              handleImageChange(e);
                              onChange(e.target.files?.[0]);
                            }}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {selectedImage && (
                    <div className="mt-2">
                      <img
                        src={URL.createObjectURL(selectedImage)}
                        alt="Preview"
                        className="w-32 h-32 object-cover rounded-lg"
                      />
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <FormFields.TextWithIcon
                    form={form}
                    name="name.firstName"
                    label="First Name"
                    placeholder="Enter first name"
                    required
                  />
                  <FormFields.TextWithIcon
                    form={form}
                    name="name.middleName"
                    label="Middle Name"
                    placeholder="Enter middle name"
                  />
                  <FormFields.TextWithIcon
                    form={form}
                    name="name.lastName"
                    label="Last Name"
                    placeholder="Enter last name"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormFields.Select
                    form={form}
                    name="gender"
                    label="Gender"
                    options={[
                      { label: "Male", value: "male" },
                      { label: "Female", value: "female" },
                      { label: "Other", value: "other" },
                    ]}
                    required
                  />
                  <FormFields.DatePicker
                    form={form}
                    name="dateOfBirth"
                    label="Date of Birth"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormFields.TextWithIcon
                    form={form}
                    name="email"
                    label="Email"
                    placeholder="Enter email"
                    required
                  />
                  <FormFields.TextWithIcon
                    form={form}
                    name="contactNo"
                    label="Contact Number"
                    placeholder="Enter contact number"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormFields.TextWithIcon
                    form={form}
                    name="emergencyContactNo"
                    label="Emergency Contact Number"
                    placeholder="Enter emergency contact"
                    required
                  />
                  <FormFields.Select
                    form={form}
                    name="bloodGroup"
                    label="Blood Group"
                    options={[
                      { label: "A+", value: "A+" },
                      { label: "A-", value: "A-" },
                      { label: "B+", value: "B+" },
                      { label: "B-", value: "B-" },
                      { label: "AB+", value: "AB+" },
                      { label: "AB-", value: "AB-" },
                      { label: "O+", value: "O+" },
                      { label: "O-", value: "O-" },
                    ]}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormFields.TextWithIcon
                    form={form}
                    name="presentAddress"
                    label="Present Address"
                    placeholder="Enter present address"
                    required
                  />
                  <FormFields.TextWithIcon
                    form={form}
                    name="permanentAddress"
                    label="Permanent Address"
                    placeholder="Enter permanent address"
                    required
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Guardian Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <FormFields.TextWithIcon
                    form={form}
                    name="guardian.fatherName"
                    label="Father's Name"
                    placeholder="Enter father's name"
                    required
                  />
                  <FormFields.TextWithIcon
                    form={form}
                    name="guardian.fatherOccupation"
                    label="Father's Occupation"
                    placeholder="Enter father's occupation"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormFields.TextWithIcon
                    form={form}
                    name="guardian.fatherContactNo"
                    label="Father's Contact Number"
                    placeholder="Enter father's contact"
                    required
                  />
                  <FormFields.TextWithIcon
                    form={form}
                    name="guardian.motherName"
                    label="Mother's Name"
                    placeholder="Enter mother's name"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormFields.TextWithIcon
                    form={form}
                    name="guardian.motherOccupation"
                    label="Mother's Occupation"
                    placeholder="Enter mother's occupation"
                    required
                  />
                  <FormFields.TextWithIcon
                    form={form}
                    name="guardian.motherContactNo"
                    label="Mother's Contact Number"
                    placeholder="Enter mother's contact"
                    required
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">
                  Local Guardian Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <FormFields.TextWithIcon
                    form={form}
                    name="localGuardian.name"
                    label="Local Guardian's Name"
                    placeholder="Enter local guardian's name"
                    required
                  />
                  <FormFields.TextWithIcon
                    form={form}
                    name="localGuardian.occupation"
                    label="Local Guardian's Occupation"
                    placeholder="Enter local guardian's occupation"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormFields.TextWithIcon
                    form={form}
                    name="localGuardian.contactNo"
                    label="Local Guardian's Contact Number"
                    placeholder="Enter local guardian's contact"
                    required
                  />
                  <FormFields.TextWithIcon
                    form={form}
                    name="localGuardian.address"
                    label="Local Guardian's Address"
                    placeholder="Enter local guardian's address"
                    required
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Academic Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <FormFields.Select
                    form={form}
                    name="admissionSemester"
                    label="Admission Semester"
                    options={semesterOptions}
                    required
                  />
                  <FormFields.Select
                    form={form}
                    name="academicDepartment"
                    label="Academic Department"
                    options={departmentOptions}
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full">
                {student ? "Update Student" : "Add Student"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default StudentForm;
