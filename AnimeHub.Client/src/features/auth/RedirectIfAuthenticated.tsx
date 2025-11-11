import React, { useEffect } from "react";
import { Navigate, useNavigate, Outlet } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth"; // Assuming path to useAuth

/**
 * Wrapper component to redirect authenticated users away from public routes
 * (like /login and /register) to prevent them from seeing the login form
 * after they have successfully logged in.
 */
const RedirectIfAuthenticated: React.FC = () => {
  const { user, isLoading } = useAuth();

  // 1. RULE B: Wait for state to stabilize. If still checking local storage, return null.
  if (isLoading) {
    // Returning null is safe and standard for waiting for context hydration.
    return null;
  }

  // 2. RULE A: If authenticated, immediately send them to the protected home path.
  // This is the CRITICAL STEP that forces navigation after a successful login state change.
  if (user) {
    // We use Navigate (JSX) for declarative routing, which is the most stable form.
    return <Navigate to="/home" replace />;
  }

  // 3. RULE C: If NOT authenticated (user is null), render the content (Login/Register)
  return <Outlet />;
};

export default RedirectIfAuthenticated;
