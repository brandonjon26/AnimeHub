import { useContext } from "react";
import { type AuthContextType } from "../features/auth/authContext"; // Import the type definition

// We need a way to reference the actual React Context object created in AuthContext.tsx
// Since we can't import the *value* of AuthContext directly without circular dependency,
// we will assume a way to access it, or slightly modify the original plan to expose it.

// Given the current structure, the most common way is to define the context object
// and the hook together, or pass the context object to the hook.

// For minimal file changes, let's redefine the hook here and ensure the context
// object can be imported, or keep the context definition minimal in AuthContext.tsx.
// Since the context object is named 'AuthContext' but is not exported, we need to
// slightly adjust AuthContext.tsx to expose the context object itself.

// ASSUMING AuthContext.tsx now exports the context object:
import { AuthContext } from "../features/auth/AuthContext.tsx"; // Assuming this is now exported

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

  // // 🔑 THE NEW DEBUGGER
  // if (context.user && context.user.token) {
  //   // This logs every time a component consumes the *authenticated* state
  //   console.log(
  //     "🔥 AUTH STATE CONSUMED BY:",
  //     (new Error().stack || "").split("\n")[2]
  //   );
  // }
  return context;
};
