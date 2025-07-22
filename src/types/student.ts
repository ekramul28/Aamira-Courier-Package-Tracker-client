export type TUserName = {
  firstName: string;
  middleName?: string;
  lastName: string;

  email: string;
  profileImage: string;
  dateOfBirth: string;
  gender: "male" | "female" | "other";
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  contactNumber: string;
  enrollmentDate: string;
  academicDetails: {
    studentId: string;
    department: string;
    program: string;
    currentSemester: number;
    gpa: number;
    status: "active" | "inactive" | "graduated" | "on_leave";
    enrollmentDate: string;
  };
  emergencyContact: {
    name: string;
    relationship: string;
    contactNumber: string;
  };
  createdAt: string;
  updatedAt: string;
};

export type TGuardian = {
  fatherName: string;
  fatherOccupation: string;
  fatherContactNo: string;
  motherName: string;
  motherOccupation: string;
  motherContactNo: string;
};

export type TLocalGuardian = {
  name: string;
  occupation: string;
  contactNo: string;
  address: string;
};

export type TStudent = {
  id: string;
  user: string;
  name: TUserName;
  gender: "male" | "female" | "other";
  dateOfBirth: string;
  email: string;
  contactNo: string;
  emergencyContactNo: string;
  bloodGroup: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";
  presentAddress: string;
  permanentAddress: string;
  guardian: TGuardian;
  localGuardian: TLocalGuardian;
  profileImg?: File;
  admissionSemester:
    | string
    | {
        name: string;
        year: string;
      };
  academicDepartment:
    | string
    | {
        name: string;
        code: string;
      };
  academicFaculty?:
    | string
    | {
        name: string;
        code: string;
      };
  isDeleted?: boolean;
};

export type StudentModel = {
  isUserExists(id: string): Promise<TStudent | null>;
};

export type StudentFormData = Omit<
  TStudent,
  "id" | "createdAt" | "updatedAt" | "isDeleted"
>;

export interface StudentFilters {
  search?: string;
  department?: string;
  faculty?: string;
  semester?: string;
}

// Subject-wise marks type
export type TSubjectMarks = {
  [subject: string]: number;
};

// Mark distribution type for a student in a course
export type TMarkDistribution = {
  student: string; // Types.ObjectId as string
  course: string; // Types.ObjectId as string
  classTests: number[];
  subjects: TSubjectMarks;
  finalExam?: number;
  totalMarks?: number;
  resultStatus?: "PASS" | "FAIL" | "INCOMPLETE";
};
