export type IUserProfile = {
  id: string;
  email: string;
  fullName: string;
  admissionSemester: string;
  role: "admin" | "student" | "faculty";
  // Add more fields if needed
};
