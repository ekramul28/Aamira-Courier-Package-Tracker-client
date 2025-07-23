import AnnouncementManagement from "@/pages/Admin/AnnouncementManagement";

import { Megaphone, User } from "lucide-react";

export const facultyPaths = [
  {
    name: "Announce Management",
    path: "announcement-management",
    element: <AnnouncementManagement />,
    icon: <Megaphone className="w-5 h-5" />,
  },
];
