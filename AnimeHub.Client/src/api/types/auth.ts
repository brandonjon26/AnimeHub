// --- REQUEST DTOs (Inputs) ---

/**
 * Interface for user login credentials. Maps to LoginDto.cs.
 */
export interface ILoginRequest {
  loginIdentifier: string;
  password: string;
}

/**
 * Interface for new user registration data. Maps to RegisterDto.cs.
 */
export interface IRegisterRequest {
  email: string;
  userName: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  birthday: string; // Will be sent as an ISO date string (YYYY-MM-DD)
  location: string;
}

// --- RESPONSE DTOs (Outputs) ---

/**
 * Interface for the user data returned upon successful login. Maps to UserResponseDto.cs.
 * This is the primary object stored in local state/context.
 */
export interface IUserResponse {
  token: string;
  expiration: string; // ISO date string for token expiration
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[]; // Array of roles (e.g., ["Villager", "Mage"])
}

/**
 * Interface for handling validation errors returned from the API.
 */
export interface IValidationError {
  [key: string]: string[]; // e.g., { "Password": ["Password must be at least 6 characters."], "email": ["Email already in use."] }
}
