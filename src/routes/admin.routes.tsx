import AdminManagement from "@/pages/Admin/AdminManagement";
import AdminProfile from "@/pages/Admin/AdminProfile";

import CreateCourier from "@/pages/CreateCourier/CreateCourier";
import RegisterPackage from "@/pages/RegisterPackage/RegisterPackage";
import { Package, Plus, Truck, User } from "lucide-react";

export const adminPaths = [
  {
    name: "Register Package",
    path: "register-package",
    element: <RegisterPackage />,
    icon: <Package className="w-5 h-5" />,
  },
  {
    name: "Profile",
    path: "profile",
    element: <AdminProfile />,
    icon: <User className="w-5 h-5" />,
  },
  {
    name: "AdminManagement",
    path: "adminManagement",
    element: <AdminManagement />,
    icon: <User className="w-5 h-5" />,
  },
  {
    name: "Create Courier",
    path: "create-courier",
    element: <CreateCourier />,
    icon: <Plus className="w-5 h-5" />,
  },
];
