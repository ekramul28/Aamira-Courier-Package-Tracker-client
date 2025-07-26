import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { logout, selectCurrentUser } from "@/redux/features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { motion } from "framer-motion";
import { Menu, Moon, Sun, Truck, User } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const getNavLinks = (role?: string) => {
  const commonLinks = [{ label: "Home", to: "/" }];

  switch (role) {
    case "student":
      return [
        ...commonLinks,
        { label: "Dashboard", to: "/student/dashboard" },
        { label: "My Courses", to: "/student/my-courses" },
        { label: "Grades", to: "/student/grades" },
      ];
    case "courier":
      return [
        ...commonLinks,
        { label: "Dashboard", to: "/courier/deliveries" },
      ];
    case "admin":
    case "superAdmin":
      return [
        ...commonLinks,
        { label: "Dashboard", to: "/admin/register-package" },
      ];
    default:
      return commonLinks;
  }
};

export default function NavBar() {
  const location = useLocation();
  const { theme, setTheme } = useTheme();
  const user = useAppSelector(selectCurrentUser);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const navLinks = getNavLinks(user?.role);

  console.log(user);
  const role = user?.role?.toLowerCase(); // assuming roles are like "Admin", "Student", etc.
  const profileLink = role ? `/${role}/profile` : "/profile"; // fallback

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logged out successfully");
    navigate("/");
  };

  return (
    <motion.header
      className="bg-white dark:bg-gray-900  fixed w-full z-50 top-0"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              to="/"
              className="text-2xl font-extrabold tracking-wide text-[#3F4555] dark:text-blue-400 hover:text-blue-600 transition-colors duration-300 flex items-center gap-1"
            >
              <span>
                <Truck className="w-10 h-10" />
              </span>{" "}
              Aamira Courier
            </Link>
          </motion.div>

          {/* Desktop Navigation - Centered */}
          <nav className="hidden md:flex items-center justify-center flex-1 mx-8">
            <div className="flex space-x-6">
              {navLinks.map((link) => (
                <motion.div
                  key={link.to}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to={link.to}
                    className={`text-sm font-medium transition-colors hover:text-blue-600 dark:hover:text-blue-400 ${
                      location.pathname === link.to
                        ? "text-blue-600 dark:text-blue-400"
                        : "text-gray-600 dark:text-gray-300"
                    }`}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </div>
          </nav>

          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
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

            {/* Auth Buttons or User Menu */}
            {user ? (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-gray-600 dark:text-gray-300"
                    >
                      <User className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="dark:bg-gray-800">
                    <DropdownMenuItem className="dark:text-gray-300">
                      {/* <Link to="//profile">Profile</Link> */}
                      <Link
                        to={profileLink}
                        className="text-sm text-primary hover:underline"
                      >
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="dark:text-gray-300">
                      <Link to="/settings">Settings</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="dark:text-gray-300"
                      onClick={handleLogout}
                    >
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </motion.div>
            ) : (
              <div className="flex items-center space-x-2">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link to="/login">
                    <Button
                      variant="ghost"
                      className="text-gray-600 dark:text-gray-300"
                    >
                      Login
                    </Button>
                  </Link>
                </motion.div>
              </div>
            )}

            {/* Mobile Menu */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="md:hidden"
            >
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-gray-600 dark:text-gray-300"
                  >
                    <Menu className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-48 dark:bg-gray-800"
                >
                  {navLinks.map((link) => (
                    <DropdownMenuItem
                      key={link.to}
                      className="dark:text-gray-300"
                    >
                      <Link
                        to={link.to}
                        className={`w-full ${
                          location.pathname === link.to
                            ? "text-blue-600 dark:text-blue-400"
                            : "text-gray-600 dark:text-gray-300"
                        }`}
                      >
                        {link.label}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                  {!user && (
                    <>
                      <DropdownMenuItem className="dark:text-gray-300">
                        <Link to="/login" className="w-full">
                          Login
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
