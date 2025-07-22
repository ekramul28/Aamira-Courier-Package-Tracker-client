// components/dashboard/DashboardNavbar.tsx

import React from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useCurrentToken, setUser } from "@/redux/features/auth/authSlice";
import { verifyToken } from "@/utils/verifyToken";
import { type TUser } from "@/redux/features/auth/authSlice";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Moon, Sun } from "lucide-react";
import Sidebar from "@/components/layout/Sidebar";
import { motion } from "framer-motion";
import { useTheme } from "@/components/theme-provider";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const DashboardNavbar: React.FC = () => {
  const token = useAppSelector(useCurrentToken);
  const user = token ? (verifyToken(token) as TUser) : null;
  const { theme, setTheme } = useTheme();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(setUser({ user: null, token: null }));
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <header className="w-full h-12 px-4 mb-2 lg:px-6 border-b flex items-center justify-between sticky top-0 z-50 bg-background">
      {/* Left: Brand + Mobile Sidebar trigger */}
      <div className="flex items-center gap-3">
        {/* Mobile sidebar trigger */}
        <div className="lg:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <Sidebar />
            </SheetContent>
          </Sheet>
        </div>

        {/* Logo */}
        {/* <Link to="/dashboard" className="text-lg font-bold text-primary">
          PH Uni
        </Link> */}
      </div>

      {/* Right: User + Logout */}
      <div className="flex items-center gap-4">
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="text-gray-600 dark:text-gray-300"
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>
        </motion.div>
        {user && (
          <div className="text-sm text-muted-foreground hidden sm:block">
            Hi, <span className="font-semibold">{user?.role}</span>
          </div>
        )}
        <Button
          variant="outline"
          size="sm"
          onClick={handleLogout}
          className="hover:bg-destructive hover:text-destructive-foreground"
        >
          Logout
        </Button>
      </div>
    </header>
  );
};

export default DashboardNavbar;
