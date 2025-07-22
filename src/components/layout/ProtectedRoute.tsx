import { type ReactNode, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { logout, useCurrentToken } from "../../redux/features/auth/authSlice";
import { Navigate } from "react-router-dom";
import { verifyToken } from "../../utils/verifyToken";

type TProtectedRoute = {
  children: ReactNode;
  role?: string;
};

const ProtectedRoute = ({ children, role }: TProtectedRoute) => {
  const token = useAppSelector(useCurrentToken);
  const dispatch = useAppDispatch();

  const user = useMemo(() => {
    try {
      return token ? verifyToken(token) : null;
    } catch {
      return null;
    }
  }, [token]);

  if (!token || !user) {
    dispatch(logout());
    return <Navigate to="/login" replace />;
  }

  if (
    role &&
    (user as any).role !== role &&
    (user as any).role !== "superAdmin"
  ) {
    dispatch(logout());
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
