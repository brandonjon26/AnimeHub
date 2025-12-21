import React, {
  useReducer,
  useContext,
  useEffect,
  useMemo,
  type ReactNode,
} from "react";
import { jwtDecode, type JwtPayload } from "jwt-decode";
import {
  type AuthContextType,
  type AuthState,
  defaultAuthState,
} from "./authContext";
import {
  type ILoginRequest,
  type IRegisterRequest,
  type IUserResponse,
} from "../../../api/types/auth";
import { AuthService } from "../../../api/authService";

// Helper type to merge the standard JwtPayload with our custom claims (like 'role')
interface CustomJwtPayload extends JwtPayload {
  role?: string | string[]; // Expected 'role' claim from ASP.NET Identity
}

// Helper function to decode token data
const decodeToken = (token: string): Partial<IUserResponse> => {
  try {
    const payload = jwtDecode<CustomJwtPayload>(token); // USING jwtDecode library

    // Process roles claim: Ensure it's always an array
    const rolesClaim = payload.role;
    let rolesArray: string[] = [];
    if (typeof rolesClaim === "string") {
      rolesArray = [rolesClaim];
    } else if (Array.isArray(rolesClaim)) {
      rolesArray = rolesClaim;
    }

    // Process expiration claim: Convert Unix timestamp ('exp') to ISO string
    const expirationIso = payload.exp
      ? new Date(payload.exp * 1000).toISOString()
      : undefined;

    // The backend should handle setting the other user fields
    return {
      expiration: expirationIso,
      roles: rolesArray,
    };
  } catch (e) {
    // Log a warning if the token is malformed, but allow the app to continue
    console.warn("Invalid JWT token detected during decode:", e);
    return {};
  }
};

// isTokenValid is defined outside, so it's stable.
const isTokenValid = (expiration: string | undefined): boolean => {
  if (!expiration) return false;
  // Check if current time is less than expiration time
  return new Date().getTime() < new Date(expiration).getTime();
};

// 1. Create Context
export const AuthContext = React.createContext<AuthContextType | undefined>(
  undefined
);

// 2. Define Reducer Actions
type AuthAction =
  | { type: "LOGIN_SUCCESS"; payload: IUserResponse }
  | { type: "LOGOUT" }
  | { type: "SET_LOADING"; payload: boolean };

// 3. Define Reducer
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "LOGIN_SUCCESS":
      return {
        ...state,
        user: action.payload,
        isLoading: false,
      };
    case "LOGOUT":
      return {
        ...state,
        user: null,
        isLoading: false,
      };
    case "SET_LOADING":
      return {
        ...state,
        isLoading: action.payload,
      };
    default:
      return state;
  }
};

// Helper type to determine if initial state is calculated
type AuthStateInitializer = AuthState | (() => AuthState);

// 🔑 New function to calculate the initial state safely
const getInitialAuthState = (): AuthState => {
  const storedToken = localStorage.getItem("jwtToken");
  const storedUserJson = localStorage.getItem("user");

  // isLoading is TRUE only if there is data to process.
  // Otherwise, we are immediately done loading (isLoading: false).
  const hasInitialData = !!storedToken || !!storedUserJson;

  // Use defaultAuthState as the base, but set isLoading conditionally
  return {
    ...defaultAuthState,
    isLoading: true, // Will be true if token exists, false otherwise.
  };
};

// 4. Provider Component
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, getInitialAuthState());

  // 1. Stabilize the Logout handler using useCallback
  const handleLogout = React.useCallback(() => {
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("user");
    dispatch({ type: "LOGOUT" });
  }, []); // Empty dependency array means this function is stable

  const login = React.useCallback(
    async (credentials: ILoginRequest) => {
      try {
        const userResponse = await AuthService.login(credentials);
        // handleLoginSuccess(userResponse);

        localStorage.setItem("jwtToken", userResponse.token);

        const { token, ...userDetails } = userResponse;
        localStorage.setItem("user", JSON.stringify(userDetails));

        // 🔑 CRITICAL CHANGE: Dispatch success NOW, synchronously
        dispatch({ type: "LOGIN_SUCCESS", payload: userResponse });

        return { success: true, user: userResponse };
      } catch (error) {
        console.error("Login failed:", error);
        return { success: false, error: error };
      }
    },
    [dispatch]
  ); // Dependency is the stable function handleLoginSuccess

  // REFACTOR TO MATCH LOGIN LATER (NEED TO UPDATE BACKEND TO RETURN USER DATA ** Might not need this refactor anymore)
  const register = React.useCallback(
    async (data: IRegisterRequest) => {
      try {
        const userResponse = await AuthService.register(data);
        // handleLoginSuccess(userResponse);

        localStorage.setItem("jwtToken", userResponse.token);

        const { token, ...userDetails } = userResponse;
        localStorage.setItem("user", JSON.stringify(userDetails));

        // 🔑 CRITICAL CHANGE: Dispatch success NOW, synchronously
        // This ensures the global state is updated immediately before the
        // subsequent window.location.reload() in Register.tsx
        dispatch({ type: "LOGIN_SUCCESS", payload: userResponse });

        return { success: true, user: userResponse };
      } catch (error) {
        console.error("Registration failed:", error);
        return { success: false, error: error };
      }
    },
    [dispatch]
  ); // Dependency is the stable function handleLoginSuccess

  const hasRole = React.useCallback(
    (role: string): boolean => {
      // state is now stable within this closure
      return state.user?.roles?.includes(role) ?? false;
    },
    [state.user]
  ); // Only update if user roles change

  const isTokenExpired = React.useCallback((): boolean => {
    return !isTokenValid(state.user?.expiration);
  }, [state.user]); // Only update if user expiration changes

  // Effect to check for an existing token on initial load
  useEffect(() => {
    // 🔑 1. Introduce a guard flag
    let isMounted = true;

    const storedToken = localStorage.getItem("jwtToken");
    const storedUserJson = localStorage.getItem("user");

    if (storedToken && storedUserJson) {
      try {
        const storedUser: IUserResponse = JSON.parse(storedUserJson);
        const decodedPayload = decodeToken(storedToken);

        // Combine stored data with decoded expiry/roles
        const fullUser: IUserResponse = {
          ...storedUser,
          token: storedToken,
          expiration: decodedPayload.expiration || storedUser.expiration,
          roles: decodedPayload.roles || storedUser.roles,
        };

        // Check expiry before setting state
        if (isTokenValid(fullUser.expiration)) {
          if (isMounted) {
            // 🔑 2. ONLY dispatch if the component is still mounted
            dispatch({ type: "LOGIN_SUCCESS", payload: fullUser });
          }
        } else {
          if (isMounted) {
            // Token is invalid/expired, manually perform logout actions here
            localStorage.removeItem("jwtToken");
            localStorage.removeItem("user");
            dispatch({ type: "LOGOUT" }); // <--- Call action directly here!
          }
        }
      } catch (e) {
        console.error("Error parsing stored user data, logging out:", e);
        localStorage.removeItem("jwtToken");
        localStorage.removeItem("user");
        if (isMounted) {
          dispatch({ type: "LOGOUT" }); // <--- Call action directly here!
        }
      }
    }

    // 🔑 FINAL FIX: Only dispatch SET_LOADING(false) IF the state is still loading
    // and we've reached the end of the check (i.e., we are done loading).
    // This runs only if the token check logic didn't already dispatch a LOGOUT or LOGIN_SUCCESS.
    if (isMounted && state.isLoading) {
      dispatch({ type: "SET_LOADING", payload: false });
    }

    // 🔑 4. Cleanup function: runs when the component unmounts
    return () => {
      isMounted = false;
    };
  }, []);

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      ...state,
      dispatch,
      login,
      register,
      logout: handleLogout,
      hasRole,
      isTokenExpired,
    }),
    [state, dispatch, handleLogout, login, register, hasRole, isTokenExpired]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
