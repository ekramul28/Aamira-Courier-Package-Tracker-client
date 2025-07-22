// import type { TUser } from "./user";

import type { TUser } from "./userManagement.type";

export interface SystemStats {
  totalStudents: number;
  totalInstructors: number;
  totalCourses: number;
  activeDepartments: number;
  serverStatus: "online" | "offline";
  databaseStatus: "healthy" | "unhealthy";
  lastBackup: string;
}

export interface RecentActivity {
  id: string;
  type: string;
  count: number;
  period: string;
  progress: number;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  createdBy: TUser;
}

export interface ChatMessage {
  id: string;
  content: string;
  sender: TUser;
  roomId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChatRoom {
  id: string;
  name: string;
  participants: TUser[];
  lastMessage?: ChatMessage;
  createdAt: string;
  updatedAt: string;
}

export type TUserName = {
  firstName: string;
  middleName?: string;
  lastName: string;
};

export type TAdmin = {
  id: string;
  user: string;
  designation: string;
  name: TUserName;
  gender: "male" | "female" | "other";
  dateOfBirth: string;
  email: string;
  contactNo: string;
  emergencyContactNo: string;
  bloodGroup: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";
  presentAddress: string;
  permanentAddress: string;
  profileImg?: string;
  isDeleted?: boolean;
};
