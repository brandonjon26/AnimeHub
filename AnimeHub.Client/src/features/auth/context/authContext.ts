import {
  type ILoginRequest,
  type IRegisterRequest,
  type IUserResponse,
} from "../../../api/types/auth";

// 🔑 NEW TYPE: Defines the result object returned by login/register
export interface AuthResult {
  success: boolean;
  user?: IUserResponse; // Contains user data and token on success
  error?: any; // Contains error object on failure
}

// Define the shape of the state in the context
export type AuthState = {
  // Stores the authenticated user data (or null if logged out)
  user: IUserResponse | null;
  // Flag to indicate if the user data is currently being retrieved (e.g., from localStorage)
  isLoading: boolean;
};

// Define the shape of the actions/methods provided by the context
export type AuthContextType = AuthState & {
  dispatch: React.Dispatch<any>;
  // Attempts to log in the user
  login: (credentials: ILoginRequest) => Promise<AuthResult>;
  // Attempts to register a new user
  register: (data: IRegisterRequest) => Promise<AuthResult>;
  // Logs out the user (clears token, user state)
  logout: () => void;
  // Helper to check if the user has a specific role
  hasRole: (role: string) => boolean;
  // Helper to check if the token is expired
  isTokenExpired: () => boolean;
};

// Default values for the context when it's not wrapped in a provider
export const defaultAuthState: AuthState = {
  user: null,
  isLoading: false, // Start as true to check for existing token on load
};
