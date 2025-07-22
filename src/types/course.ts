import type {
  TEnrollment,
  EnrollmentFilters,
  EnrollmentFormData,
} from "./enrollment.type";

export type { TEnrollment, EnrollmentFilters, EnrollmentFormData };

export interface Subject {
  _id: string;
  code: string;
  name: string;
  description: string;
  credits: number;
  prerequisites: string[];
  department: string;
  level: "undergraduate" | "graduate";
  status: "active" | "inactive";
}

export interface CourseOffering {
  _id: string;
  subjectId: string;
  subject: Subject;
  semester: number;
  academicYear: string;
  instructorId: string;
  instructor: {
    id: string;
    firstName: string;
    lastName: string;
  };
  capacity: number;
  enrolledStudents: number;
  schedule: {
    day: string;
    time: string;
    room: string;
  };
  status: "open" | "closed" | "cancelled";
  registrationDeadline: string;
}

export interface ICourse {
  _id: string;
  name?: string;
  code?: string;
  department?: string;
  title?: string;
  prefix?: string;
  credits?: number;
  prerequisites?: string[] | any;
  instructor?: string;
}
