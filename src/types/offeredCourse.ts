// Base Types (already correct)
export interface TCourse {
  _id: string;
  title: string;
  code: string;
}

export interface TFaculty {
  _id: string;
  fullName: string;
  email?: string;
}

export interface TAcademicDepartment {
  _id: string;
  name: string;
}

export interface TAcademicFaculty {
  _id: string;
  name: string;
}

export interface TAcademicSemester {
  _id: string;
  name: string;
  year: string;
}

export interface TSemesterRegistration {
  _id: string;
  status: string;
  academicSemester?: TAcademicSemester;
  startDate?: string;
  endDate?: string;
  minCredit?: number;
  maxCredit?: number;
}

export type Days = "Sat" | "Sun" | "Mon" | "Tue" | "Wed" | "Thu" | "Fri";

// Populated Offered Course type
export interface IOfferedCourse {
  _id: string;
  semesterRegistration: TSemesterRegistration;
  academicFaculty: TAcademicFaculty;
  academicDepartment: TAcademicDepartment;
  enrolledStudents: number | any;
  course: TCourse;
  faculty: TFaculty;
  section: number;
  maxCapacity: number;
  image?: string;
  days: Days[];
  startTime: string;
  endTime: string;
  createdAt: string;
  updatedAt: string;
}

// Create type (ID-based only)
export interface ICreateOfferedCourse {
  semesterRegistration: string;
  academicFaculty: string;
  academicDepartment: string;
  course: string;
  faculty: string;
  section: number;
  maxCapacity: number;
  image?: string;
  days: Days[];
  startTime: string;
  endTime: string;
}

// Update type (partial, ID-based)
export interface IUpdateOfferedCourse {
  faculty?: string;
  maxCapacity?: number;
  days?: Days[];
  startTime?: string;
  endTime?: string;
}
