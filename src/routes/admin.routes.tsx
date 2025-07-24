import AdminProfile from "@/pages/Admin/AdminProfile";
import AnnouncementManagement from "@/pages/Admin/AnnouncementManagement";
import Courier from "@/pages/courier/Courier";
import RegisterPackage from "@/pages/RegisterPackage/RegisterPackage";
import PackageTracker from "@/pages/PackageTracker/PackageTracker";

import { MapPin, Megaphone, Package, Truck, User } from "lucide-react";

export const adminPaths = [
  {
    name: "Profile",
    path: "profile",
    element: <AdminProfile />,
    icon: <User className="w-5 h-5" />,
  },
  {
    name: "Courier",
    path: "courier",
    element: <Courier />,
    icon: <Truck className="w-5 h-5" />,
  },
  {
    name: "Package Tracker",
    path: "package-tracker",
    element: <PackageTracker />,
    icon: <MapPin className="w-5 h-5" />,
  },
  {
    name: "Register Package",
    path: "register-package",
    element: <RegisterPackage />,
    icon: <Package className="w-5 h-5" />,
  },
  {
    name: "Announce Management",
    path: "announcement-management",
    element: <AnnouncementManagement />,
    icon: <Megaphone className="w-5 h-5" />,
  },
];
