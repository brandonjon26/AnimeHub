import React, { useMemo } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../hooks/TS/useAuth";

interface ProtectedRouteProps {
  // Optionally specify required roles, e.g., "Admin", "Moderator"
  requiredRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ requiredRoles }) => {
  const { user, isLoading, isTokenExpired, hasRole } = useAuth();

  const storedToken = localStorage.getItem("jwtToken");

  // 1. Check if the user is authenticated (token exists and is valid)
  const isAuthenticated = useMemo(() => {
    // Calculate isAuthenticated only when user or token status changes
    return user !== null && !isTokenExpired();
  }, [user, isTokenExpired]); // Depends on the stable user object and the isTokenExpired function

  // 2. Memoize Authorization Status Check
  const isAuthorized = useMemo(() => {
    // If no required roles, authorization is granted
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    } // Check if the user has any of the required roles
    return requiredRoles.some((role) => hasRole(role));
  }, [requiredRoles, hasRole]); // Depends on the requiredRoles prop and the stable hasRole function

  // If still loading the authentication state
  if (isLoading || (storedToken && !user)) {
    // Use null for the most stable component state during hydration
    return null;
  }

  if (!user && !isAuthenticated) {
    // Redirect unauthenticated users to the login page
    return <Navigate to="/login" />;
  }

  if (!isAuthenticated) {
    // Redirect unauthenticated users to the login page
    return <Navigate to="/login" />;
  }

  // Redirect unauthorized users
  if (!isAuthorized) {
    // Redirect unauthorized users (e.g., to a 403 Forbidden page or home)
    return <Navigate to="/login" />;
  }

  // If authenticated and authorized, render the child route content via Outlet
  return <Outlet />;
};

export default ProtectedRoute;
