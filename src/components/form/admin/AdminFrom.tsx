import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormMessage,
  FormControl,
  FormLabel,
  FormItem,
  FormField,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { TAdmin } from "@/types/admin";
import {
  useCreateAdminMutation,
  useUpdateAdminMutation,
} from "@/redux/features/admin/adminApi";
import { useToast } from "@/components/ui/use-toast";
import { useState, useEffect } from "react";
import { FormFields } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";

const adminSchema = z.object({
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
  designation: z.string().min(1, "Designation is required"),
  gender: z.enum(["male", "female", "other"]),
  dateOfBirth: z.string(),
  email: z.string().email("Invalid email address"),
  contactNo: z.string().min(1, "Contact number is required"),
  emergencyContactNo: z.string().min(1, "Emergency contact number is required"),
  bloodGroup: z.enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]),
  presentAddress: z.string().min(1, "Present address is required"),
  permanentAddress: z.string().min(1, "Permanent address is required"),
});

type AdminFormData = z.infer<typeof adminSchema>;

interface AdminFormProps {
  admin?: TAdmin;
  onSuccess?: () => void;
}

const AdminForm = ({ admin, onSuccess }: AdminFormProps) => {
  const { toast } = useToast();
  const [createAdmin] = useCreateAdminMutation();
  const [updateAdmin] = useUpdateAdminMutation();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const form = useForm<AdminFormData>({
    resolver: zodResolver(adminSchema),
    defaultValues: {
      name: {
        firstName: "",
        middleName: "",
        lastName: "",
      },
      designation: "",
      gender: "male",
      dateOfBirth: "",
      email: "",
      contactNo: "",
      emergencyContactNo: "",
      bloodGroup: "A+",
      presentAddress: "",
      permanentAddress: "",
      // profileImg: "", // Ensure this is a string
    },
  });

  useEffect(() => {
    if (admin) {
      form.reset({
        name: admin.name,
        designation: admin.designation,
        gender: admin.gender,
        dateOfBirth: admin.dateOfBirth,
        email: admin.email,
        contactNo: admin.contactNo,
        emergencyContactNo: admin.emergencyContactNo,
        bloodGroup: admin.bloodGroup,
        presentAddress: admin.presentAddress,
        permanentAddress: admin.permanentAddress,
      });
    }
  }, [admin, form]);

  const onSubmit = async (data: AdminFormData) => {
    console.log("adminFormData", data);
    try {
      const formData = new FormData();
      const adminData = {
        password: "123456",
        admin: {
          name: data.name,
          designation: data.designation,
          gender: data.gender,
          dateOfBirth: data.dateOfBirth,
          email: data.email,
          contactNo: data.contactNo,
          emergencyContactNo: data.emergencyContactNo,
          bloodGroup: data.bloodGroup,
          presentAddress: data.presentAddress,
          permanentAddress: data.permanentAddress,
        },
      };
      formData.append("data", JSON.stringify(adminData));

      if (selectedImage) {
        formData.append("file", selectedImage);
      }

      if (admin) {
        await updateAdmin({
          id: admin.id,
          updatedData: {
            ...data,
            user: admin.user,
          },
        }).unwrap();
        toast({
          title: "Success",
          description: "Admin updated successfully",
        });
      } else {
        await createAdmin(formData as any).unwrap();
        toast({
          title: "Success",
          description: "Admin added successfully",
        });
      }
      onSuccess?.();
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Error",
        description: "Failed to save admin data",
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="w-full">
        <CardHeader>
          <CardTitle>{admin ? "Edit Admin" : "Add New Admin"}</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit as any)}
              className="space-y-6"
            >
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Personal Information</h3>

                {/* Image Upload Field */}
                <div className="flex flex-col gap-2">
                  <FormField
                    control={form.control as any}
                    name="profileImg"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Profile Image</FormLabel>
                        <FormControl>
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0] ?? "";
                              field.onChange(file);
                              handleImageChange(e);
                            }}
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
                  <FormFields.TextWithIcon
                    form={form}
                    name="designation"
                    label="Designation"
                    placeholder="Enter designation"
                    required
                  />
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
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormFields.DatePicker
                    form={form}
                    name="dateOfBirth"
                    label="Date of Birth"
                    required
                  />
                  <FormFields.TextWithIcon
                    form={form}
                    name="email"
                    label="Email"
                    placeholder="Enter email"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormFields.TextWithIcon
                    form={form}
                    name="contactNo"
                    label="Contact Number"
                    placeholder="Enter contact number"
                    required
                  />
                  <FormFields.TextWithIcon
                    form={form}
                    name="emergencyContactNo"
                    label="Emergency Contact Number"
                    placeholder="Enter emergency contact"
                    required
                  />
                </div>

                <div className="grid grid-2 gap-4">
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
                  <FormFields.TextWithIcon
                    form={form}
                    name="presentAddress"
                    label="Present Address"
                    placeholder="Enter present address"
                    required
                  />
                </div>

                <div className="grid grid-1 gap-4">
                  <FormFields.TextWithIcon
                    form={form}
                    name="permanentAddress"
                    label="Permanent Address"
                    placeholder="Enter permanent address"
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full">
                {admin ? "Update Admin" : "Add Admin"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default AdminForm;
