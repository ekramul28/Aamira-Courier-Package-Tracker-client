// src/routes/index.tsx

import DashboardLayout from "@/components/layout/DashboardLayout";
import HomeLayout from "@/components/layout/HomeLayout";
import ProtectedRoute from "@/components/layout/ProtectedRoute";
import { ThemeProvider } from "@/components/theme-provider";

// import Home from "@/pages/Home";
import LoginForm from "@/pages/Login";
import RegisterForm from "@/pages/Register";
import { routeGenerator } from "@/utils/routesGenerator";
import { createBrowserRouter } from "react-router-dom";
import { adminPaths } from "./admin.routes";
import { studentPaths } from "./student.routes";

import { NotFoundPage } from "@/pages/NotFound";

import { facultyPaths } from "./faculty.routes";
import Home from "@/pages/Home/Home";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ThemeProvider>
        <HomeLayout />
      </ThemeProvider>
    ),
    children: [
      {
        index: true,
        element: <Home />,
      },

      {
        path: "login",
        element: <LoginForm />,
      },
      {
        path: "register",
        element: <RegisterForm />,
      },
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
  {
    path: "/admin",
    element: (
      <ProtectedRoute role="admin">
        <ThemeProvider>
          <DashboardLayout />
        </ThemeProvider>
      </ProtectedRoute>
    ),
    children: [
      ...routeGenerator(adminPaths),
      { path: "*", element: <NotFoundPage /> },
    ],
  },
  {
    path: "/student",
    element: (
      <ProtectedRoute role="student">
        <ThemeProvider>
          <DashboardLayout />
        </ThemeProvider>
      </ProtectedRoute>
    ),
    children: [
      ...routeGenerator(studentPaths),
      { path: "*", element: <NotFoundPage /> },
    ],
  },
  {
    path: "/faculty",
    element: (
      <ProtectedRoute role="faculty">
        <ThemeProvider>
          <DashboardLayout />
        </ThemeProvider>
      </ProtectedRoute>
    ),
    children: [
      ...routeGenerator(facultyPaths),
      { path: "*", element: <NotFoundPage /> },
    ],
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);

export default router;
