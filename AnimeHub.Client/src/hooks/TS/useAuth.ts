import { useContext } from "react";
import { type AuthContextType } from "../../features/auth/authContext.ts"; // Import the type definition
import { AuthContext } from "../../features/auth/AuthContext.tsx"; // Assuming this is now exported

/**
 * Custom hook to consume the AuthContext, providing access to authentication state and actions.
 * @returns AuthContextType
 * @throws Error if used outside of an AuthProvider.
 */
export const useAuth = (): AuthContextType => {
  // 🔑 The actual React Context object is imported here
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  // if (context.user && context.user.token) {
  //   // This logs every time a component consumes the *authenticated* state
  //   console.log(
  //     "🔥 AUTH STATE CONSUMED BY:",
  //     (new Error().stack || "").split("\n")[2]
  //   );
  // }
  return context;
};
