import { z } from "zod";

const createUserNameValidationSchema = z.object({
  firstName: z
    .string()
    .min(1, "First name is required")
    .max(20, "First name cannot exceed 20 characters")
    .refine((value) => /^[A-Z]/.test(value), {
      message: "First Name must start with a capital letter",
    }),
  middleName: z.string().optional(),
  lastName: z
    .string()
    .min(1, "Last name is required")
    .max(20, "Last name cannot exceed 20 characters"),
});

const createGuardianValidationSchema = z.object({
  fatherName: z
    .string()
    .min(1, "Father's name is required")
    .max(50, "Father's name cannot exceed 50 characters"),
  fatherOccupation: z
    .string()
    .min(1, "Father's occupation is required")
    .max(50, "Father's occupation cannot exceed 50 characters"),
  fatherContactNo: z
    .string()
    .min(10, "Father's contact number must be at least 10 digits")
    .max(15, "Father's contact number cannot exceed 15 digits"),
  motherName: z
    .string()
    .min(1, "Mother's name is required")
    .max(50, "Mother's name cannot exceed 50 characters"),
  motherOccupation: z
    .string()
    .min(1, "Mother's occupation is required")
    .max(50, "Mother's occupation cannot exceed 50 characters"),
  motherContactNo: z
    .string()
    .min(10, "Mother's contact number must be at least 10 digits")
    .max(15, "Mother's contact number cannot exceed 15 digits"),
});

const createLocalGuardianValidationSchema = z.object({
  name: z
    .string()
    .min(1, "Local guardian's name is required")
    .max(50, "Local guardian's name cannot exceed 50 characters"),
  occupation: z
    .string()
    .min(1, "Local guardian's occupation is required")
    .max(50, "Local guardian's occupation cannot exceed 50 characters"),
  contactNo: z
    .string()
    .min(10, "Local guardian's contact number must be at least 10 digits")
    .max(15, "Local guardian's contact number cannot exceed 15 digits"),
  address: z
    .string()
    .min(1, "Local guardian's address is required")
    .max(100, "Local guardian's address cannot exceed 100 characters"),
});

export const createStudentValidationSchema = z.object({
  name: createUserNameValidationSchema,
  gender: z.enum(["male", "female", "other"], {
    required_error: "Gender is required",
  }),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  email: z.string().email("Invalid email address"),
  contactNo: z
    .string()
    .min(10, "Contact number must be at least 10 digits")
    .max(15, "Contact number cannot exceed 15 digits"),
  emergencyContactNo: z
    .string()
    .min(10, "Emergency contact number must be at least 10 digits")
    .max(15, "Emergency contact number cannot exceed 15 digits"),
  bloodGroup: z.enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"], {
    required_error: "Blood group is required",
  }),
  presentAddress: z
    .string()
    .min(1, "Present address is required")
    .max(100, "Present address cannot exceed 100 characters"),
  permanentAddress: z
    .string()
    .min(1, "Permanent address is required")
    .max(100, "Permanent address cannot exceed 100 characters"),
  guardian: createGuardianValidationSchema,
  localGuardian: createLocalGuardianValidationSchema,
  admissionSemester: z.string().min(1, "Admission semester is required"),
  academicDepartment: z.string().min(1, "Academic department is required"),
});

const updateUserNameValidationSchema = z.object({
  firstName: z
    .string()
    .min(1, "First name is required")
    .max(20, "First name cannot exceed 20 characters")
    .refine((value) => /^[A-Z]/.test(value), {
      message: "First Name must start with a capital letter",
    })
    .optional(),
  middleName: z.string().optional(),
  lastName: z
    .string()
    .min(1, "Last name is required")
    .max(20, "Last name cannot exceed 20 characters")
    .optional(),
});

const updateGuardianValidationSchema = z.object({
  fatherName: z
    .string()
    .min(1, "Father's name is required")
    .max(50, "Father's name cannot exceed 50 characters")
    .optional(),
  fatherOccupation: z
    .string()
    .min(1, "Father's occupation is required")
    .max(50, "Father's occupation cannot exceed 50 characters")
    .optional(),
  fatherContactNo: z
    .string()
    .min(10, "Father's contact number must be at least 10 digits")
    .max(15, "Father's contact number cannot exceed 15 digits")
    .optional(),
  motherName: z
    .string()
    .min(1, "Mother's name is required")
    .max(50, "Mother's name cannot exceed 50 characters")
    .optional(),
  motherOccupation: z
    .string()
    .min(1, "Mother's occupation is required")
    .max(50, "Mother's occupation cannot exceed 50 characters")
    .optional(),
  motherContactNo: z
    .string()
    .min(10, "Mother's contact number must be at least 10 digits")
    .max(15, "Mother's contact number cannot exceed 15 digits")
    .optional(),
});

const updateLocalGuardianValidationSchema = z.object({
  name: z
    .string()
    .min(1, "Local guardian's name is required")
    .max(50, "Local guardian's name cannot exceed 50 characters")
    .optional(),
  occupation: z
    .string()
    .min(1, "Local guardian's occupation is required")
    .max(50, "Local guardian's occupation cannot exceed 50 characters")
    .optional(),
  contactNo: z
    .string()
    .min(10, "Local guardian's contact number must be at least 10 digits")
    .max(15, "Local guardian's contact number cannot exceed 15 digits")
    .optional(),
  address: z
    .string()
    .min(1, "Local guardian's address is required")
    .max(100, "Local guardian's address cannot exceed 100 characters")
    .optional(),
});

export const updateStudentValidationSchema = z.object({
  name: updateUserNameValidationSchema,
  gender: z.enum(["male", "female", "other"]).optional(),
  dateOfBirth: z.string().optional(),
  email: z.string().email("Invalid email address").optional(),
  contactNo: z
    .string()
    .min(10, "Contact number must be at least 10 digits")
    .max(15, "Contact number cannot exceed 15 digits")
    .optional(),
  emergencyContactNo: z
    .string()
    .min(10, "Emergency contact number must be at least 10 digits")
    .max(15, "Emergency contact number cannot exceed 15 digits")
    .optional(),
  bloodGroup: z
    .enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"])
    .optional(),
  presentAddress: z
    .string()
    .min(1, "Present address is required")
    .max(100, "Present address cannot exceed 100 characters")
    .optional(),
  permanentAddress: z
    .string()
    .min(1, "Permanent address is required")
    .max(100, "Permanent address cannot exceed 100 characters")
    .optional(),
  guardian: updateGuardianValidationSchema.optional(),
  localGuardian: updateLocalGuardianValidationSchema.optional(),
  admissionSemester: z.string().optional(),
  academicDepartment: z.string().optional(),
});

export const studentValidations = {
  createStudentValidationSchema,
  updateStudentValidationSchema,
};
