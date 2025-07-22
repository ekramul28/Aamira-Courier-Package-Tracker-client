export interface AcademicYear {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type AcademicSemesterName =
  | "1st Semester"
  | "2nd Semester"
  | "3rd Semester"
  | "4th Semester"
  | "5th Semester"
  | "6th Semester"
  | "7th Semester"
  | "8th Semester";

export type AcademicSemesterCode =
  | "01"
  | "02"
  | "03"
  | "04"
  | "05"
  | "06"
  | "07"
  | "08";

export enum Months {
  JANUARY = "January",
  FEBRUARY = "February",
  MARCH = "March",
  APRIL = "April",
  MAY = "May",
  JUNE = "June",
  JULY = "July",
  AUGUST = "August",
  SEPTEMBER = "September",
  OCTOBER = "October",
  NOVEMBER = "November",
  DECEMBER = "December",
}

export interface Semester {
  [x: string]: any;
  id: string;
  name: AcademicSemesterName;
  year: string;
  code: AcademicSemesterCode;
  startMonth: Months;
  endMonth: Months;
  createdAt: string;
  updatedAt: string;
}

export interface Department {
  [x: string]: any;
  id: string;
  name: string;
  code: string;
  description: string;
  headOfDepartment: string;
  totalCredits: string;
  createdAt: string;
  updatedAt: string;
}

export interface Program {
  id: string;
  name: string;
  code: string;
  description: string;
  departmentId: string;
  duration: number;
  totalCredits: number;
  degreeType: string;
  createdAt: string;
  updatedAt: string;
}

export interface AcademicStats {
  totalStudents: number;
  totalFaculty: number;
  totalDepartments: number;
  totalCourses: number;
  activeSemesters: number;
  upcomingEvents: number;
  recentAdmissions: number;
  recentGraduations: number;
}

export interface CreateDepartmentDto {
  name: string;
  code: string;
  description: string;
  headOfDepartment: string;
  totalCredits: string;
}

export interface UpdateDepartmentDto extends CreateDepartmentDto {
  id: string;
}

export interface CreateSemesterDto {
  name: AcademicSemesterName;
  year: string;
  code: AcademicSemesterCode;
  startMonth: Months;
  endMonth: Months;
}

export interface UpdateSemesterDto extends CreateSemesterDto {
  id: string;
}

export interface CreateAcademicYearDto {
  name: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export interface UpdateAcademicYearDto extends CreateAcademicYearDto {
  id: string;
}

export interface Course {
  id: string;
  name: string;
  code: string;
  credits: number;
  description: string;
  departmentId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCourseDto {
  name: string;
  code: string;
  credits: number;
  description: string;
  departmentId: string;
}

export interface UpdateCourseDto extends CreateCourseDto {
  id: string;
}

export interface Faculty {
  id: string;
  name: string;
  code: string;
  description: string;
  dean: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateFacultyDto {
  name: string;
  code: string;
  description: string;
  dean: string;
}

export interface UpdateFacultyDto extends CreateFacultyDto {
  id: string;
}

export interface CreateProgramDto {
  name: string;
  code: string;
  description: string;
  departmentId: string;
  duration: number;
  totalCredits: number;
  degreeType: string;
}

export interface UpdateProgramDto extends CreateProgramDto {
  id: string;
}
