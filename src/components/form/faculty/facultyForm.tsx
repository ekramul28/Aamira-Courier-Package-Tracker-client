import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";

import {
  useGetAcademicFacultiesQuery,
  useGetAcademicDepartmentsQuery,
} from "@/redux/features/admin/academicManagement.api";
import type { TFaculty } from "@/types/faculty";
import { CustomFormField } from "@/components/ui/form-field";
import {
  useCreateFacultyMutation,
  useUpdateFacultyMutation,
} from "@/redux/features/faculty/facultyApi";
import { toast } from "sonner";
import { useState } from "react";

// Constants for validation
const Gender = ["male", "female", "other"] as const;
const BloodGroup = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] as const;

const createUserNameValidationSchema = z.object({
  firstName: z
    .string()
    .min(1, "First name is required")
    .max(20, "First name cannot be more than 20 characters")
    .refine((value) => /^[A-Z]/.test(value), {
      message: "First Name must start with a capital letter",
    }),
  middleName: z.string().optional(),
  lastName: z
    .string()
    .min(1, "Last name is required")
    .max(20, "Last name cannot be more than 20 characters"),
});

const formSchema = z.object({
  password: z.string().max(20, "Password cannot be more than 20 characters"),
  faculty: z.object({
    designation: z.string().min(1, "Designation is required"),
    name: createUserNameValidationSchema,
    gender: z.enum([...Gender] as [string, ...string[]], {
      required_error: "Gender is required",
    }),
    dateOfBirth: z.string().optional(),
    email: z.string().email("Invalid email address"),
    contactNo: z.string().min(1, "Contact number is required"),
    emergencyContactNo: z.string().min(1, "Emergency contact is required"),
    bloodGroup: z.enum([...BloodGroup] as [string, ...string[]], {
      required_error: "Blood group is required",
    }),
    presentAddress: z.string().min(1, "Present address is required"),
    permanentAddress: z.string().min(1, "Permanent address is required"),
    academicDepartment: z.string().min(1, "Academic Department is required"),
    profileImg: z.string().optional(),
  }),
});

interface FacultyFormProps {
  faculty?: TFaculty | undefined;
  onSuccess: () => void;
}

export default function FacultyForm({ faculty, onSuccess }: FacultyFormProps) {
  const [createFaculty] = useCreateFacultyMutation();
  const [updateFaculty] = useUpdateFacultyMutation();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const { data: departmentsData } = useGetAcademicDepartmentsQuery(undefined);
  const { data: facultiesData } = useGetAcademicFacultiesQuery(undefined);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      faculty: {
        designation: faculty?.designation || "Professor",
        name: faculty?.name || {
          firstName: "John",
          middleName: "",
          lastName: "Doe",
        },
        gender: faculty?.gender || "male",
        dateOfBirth:
          faculty?.dateOfBirth?.toString() ||
          new Date().toISOString().split("T")[0],
        email: faculty?.email || "john.doe@example.com",
        contactNo: faculty?.contactNo || "+1234567890",
        emergencyContactNo: faculty?.emergencyContactNo || "+1234567890",
        bloodGroup: faculty?.bloodGroup || "A+",
        presentAddress: faculty?.presentAddress || "123 Main St, City",
        permanentAddress: faculty?.permanentAddress || "123 Main St, City",
        academicDepartment: faculty?.academicDepartment || "",
        profileImg: faculty?.profileImg || "",
      },
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      form.setValue("faculty.profileImg", e.target.files[0].name);
    }
  };

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      const formattedData = {
        ...data,
        faculty: {
          ...data.faculty,
          dateOfBirth: data.faculty.dateOfBirth
            ? new Date(data.faculty.dateOfBirth).toISOString()
            : undefined,
        },
      };

      // Create FormData object for file upload
      const formData = new FormData();
      formData.append("data", JSON.stringify(formattedData));
      if (selectedFile) {
        formData.append("file", selectedFile);
      }

      if (faculty) {
        const result = await updateFaculty({
          id: faculty.id,
          data: formData,
        }).unwrap();
        if (result) {
          toast.success("Faculty updated successfully");
          onSuccess();
        }
      } else {
        const result = await createFaculty(formData).unwrap();
        if (result) {
          toast.success("Faculty created successfully");
          onSuccess();
        }
      }
    } catch (error) {
      console.error("Failed to submit form:", error);
      toast.error("Failed to submit form. Please try again.");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* File Upload Field */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Profile Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
          />
          {faculty?.profileImg && !selectedFile && (
            <img
              src={faculty.profileImg}
              alt="Profile"
              className="w-20 h-20 object-cover rounded-full"
            />
          )}
        </div>

        {/* Password field for new faculty */}
        {!faculty && (
          <CustomFormField
            form={form}
            name="password"
            label="Password"
            type="password"
            placeholder="Enter password"
            required
          />
        )}

        <div className="grid grid-cols-2 gap-4">
          <CustomFormField
            form={form}
            name="faculty.name.firstName"
            label="First Name"
            placeholder="John"
            required
          />
          <CustomFormField
            form={form}
            name="faculty.name.lastName"
            label="Last Name"
            placeholder="Doe"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <CustomFormField
            form={form}
            name="faculty.email"
            label="Email"
            placeholder="john@example.com"
            type="email"
            required
          />
          <CustomFormField
            form={form}
            name="faculty.designation"
            label="Designation"
            placeholder="Professor"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <CustomFormField
            form={form}
            name="faculty.contactNo"
            label="Contact Number"
            placeholder="+1234567890"
            required
          />
          <CustomFormField
            form={form}
            name="faculty.emergencyContactNo"
            label="Emergency Contact"
            placeholder="+1234567890"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <CustomFormField
            form={form}
            name="faculty.gender"
            label="Gender"
            required
            customRender={({ value, onChange }) => (
              <select
                value={value}
                onChange={onChange}
                className="w-full rounded-md border border-gray-300 p-2"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            )}
          />
          <CustomFormField
            form={form}
            name="faculty.bloodGroup"
            label="Blood Group"
            customRender={({ value, onChange }) => (
              <select
                value={value}
                onChange={onChange}
                className="w-full rounded-md border border-gray-300 p-2"
              >
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <CustomFormField
            form={form}
            name="faculty.presentAddress"
            label="Present Address"
            placeholder="Enter present address"
            required
            customRender={({ value, onChange }) => (
              <Textarea
                value={value}
                onChange={onChange}
                placeholder="Enter present address"
              />
            )}
          />
          <CustomFormField
            form={form}
            name="faculty.permanentAddress"
            label="Permanent Address"
            placeholder="Enter permanent address"
            required
            customRender={({ value, onChange }) => (
              <Textarea
                value={value}
                onChange={onChange}
                placeholder="Enter permanent address"
              />
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <CustomFormField
            form={form}
            name="faculty.academicFaculty"
            label="Academic Faculty"
            required
            customRender={({ value, onChange }) => (
              <select
                value={value}
                onChange={onChange}
                className="w-full rounded-md border border-gray-300 p-2"
              >
                <option value="">Select Faculty</option>
                {facultiesData?.data?.map((faculty) => (
                  <option key={faculty._id} value={faculty._id}>
                    {faculty.name}
                  </option>
                ))}
              </select>
            )}
          />
          <CustomFormField
            form={form}
            name="faculty.academicDepartment"
            label="Academic Department"
            required
            disabled={!form.watch("faculty.academicFaculty")}
            customRender={({ value, onChange }) => (
              <select
                value={value}
                onChange={onChange}
                className="w-full rounded-md border border-gray-300 p-2"
              >
                <option value="">Select Department</option>
                {departmentsData?.data?.map((dept) => (
                  <option key={dept._id} value={dept._id}>
                    {dept.name}
                  </option>
                ))}
              </select>
            )}
          />
        </div>

        <div className="flex justify-end space-x-4">
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting
              ? "Submitting..."
              : faculty
              ? "Update Faculty"
              : "Add Faculty"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
