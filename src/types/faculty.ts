export type BloodGroup =
  | "A+"
  | "A-"
  | "B+"
  | "B-"
  | "AB+"
  | "AB-"
  | "O+"
  | "O-";
export type Gender = "male" | "female" | "other";

export interface TUserName {
  firstName: string;
  middleName?: string;
  lastName: string;
}

export interface TFaculty {
  id: string;
  user: string;
  designation: string;
  name: TUserName;
  gender: Gender;
  dateOfBirth?: Date;
  email: string;
  contactNo: string;
  emergencyContactNo: string;
  bloodGroup?: BloodGroup;
  presentAddress: string;
  permanentAddress: string;
  profileImg?: string;
  academicDepartment: string;
  academicFaculty: string;
  isDeleted?: boolean;
}

export interface TAcademicDepartment {
  _id: string;
  name: string;
  academicFaculty: string;
}

export interface TAcademicFaculty {
  _id: string;
  name: string;
}
