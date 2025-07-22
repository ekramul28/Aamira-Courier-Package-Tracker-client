import AnnouncementManagement from "@/pages/Admin/AnnouncementManagement";
import FacultyProfile from "@/pages/facultys/FacultyProfile";

import { Megaphone, User } from "lucide-react";

export const facultyPaths = [
  {
    name: "Profile",
    path: "profile",
    element: <FacultyProfile />,
    icon: <User className="w-5 h-5" />,
  },

  {
    name: "Announce Management",
    path: "announcement-management",
    element: <AnnouncementManagement />,
    icon: <Megaphone className="w-5 h-5" />,
  },
];
