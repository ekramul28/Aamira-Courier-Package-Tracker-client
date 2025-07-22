export interface Instructor {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  department: string;
  designation: string;
  expertise: string[];
  assignedSubjects: AssignedSubject[];
  academicDetails: {
    qualification: string;
    specialization: string;
    experience: number;
    joiningDate: string;
  };
  role: "instructor" | "admin" | "head";
  permissions: string[];
  status: "active" | "inactive" | "on_leave";
}

export interface AssignedSubject {
  id: string;
  name: string;
  code: string;
  semester: number;
  students: StudentEnrollment[];
  gradingHistory: GradingRecord[];
}

export interface StudentEnrollment {
  studentId: string;
  name: string;
  grade?: string;
  attendance: number;
}

export interface GradingRecord {
  studentId: string;
  subjectId: string;
  grade: string;
  semester: number;
  academicYear: string;
  date: string;
}

export interface InstructorFilters {
  search?: string;
  department?: string;
  status?: Instructor["status"];
  role?: Instructor["role"];
  expertise?: string;
}

export interface InstructorFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  department: string;
  designation: string;
  expertise: string[];
  academicDetails: {
    qualification: string;
    specialization: string;
    experience: number;
    joiningDate: string;
  };
  role: Instructor["role"];
  permissions: string[];
  status: Instructor["status"];
}
