import type { CourseOffering } from "./course";

export interface TEnrollment {
  id: string;
  studentId: string;
  courseOfferingId: string;
  courseOffering: CourseOffering;
  status: "registered" | "dropped" | "completed";
  registrationDate: string;
  grade?: string;
}

export interface EnrollmentFilters {
  semester?: number;
  academicYear?: string;
  department?: string;
  search?: string;
  status?: CourseOffering["status"];
}

export interface EnrollmentFormData {
  courseOfferingId: string;
  studentId: string;
}
