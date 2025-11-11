import apiClient from "./apiClient";
import {
  type ILoginRequest,
  type IRegisterRequest,
  type IUserResponse,
  type IValidationError,
} from "./types/auth";
import axios, { AxiosError } from "axios";

const AUTH_BASE_ROUTE = "/auth";

/**
 * Handles all API calls related to authentication (login, register).
 */
export const AuthService = {
  /**
   * Attempts to log in a user.
   * @param data ILoginRequest containing email and password.
   * @returns A promise resolving to IUserResponse on success, or throws an error.
   */
  login: async (data: ILoginRequest): Promise<IUserResponse> => {
    try {
      const response = await apiClient.post<IUserResponse>(
        `${AUTH_BASE_ROUTE}/login`,
        data
      );
      // The backend is expected to return the token and user data on success (200 OK)
      return response.data;
    } catch (error) {
      // Re-throw the error for the consuming context/component to handle
      throw error;
    }
  },

  /**
   * Attempts to register a new user.
   * @param data IRegisterRequest containing user details.
   * @returns A promise resolving to IUserResponse on success, or throws an error.
   */
  register: async (data: IRegisterRequest): Promise<IUserResponse> => {
    try {
      const response = await apiClient.post<IUserResponse>(
        `${AUTH_BASE_ROUTE}/register`,
        data
      );
      // The backend is expected to return the token and user data on success (200 OK)
      return response.data;
    } catch (error) {
      // Re-throw the error for the consuming context/component to handle
      throw error;
    }
  },

  // Placeholder for other potential auth functions (e.g., refreshing token)
  // fetchCurrentUser: async (): Promise<IUserResponse> => { ... }
};

/**
 * Helper function to parse validation errors from Axios response.
 * @param error The error object returned from the service call.
 * @returns A structured IValidationError object.
 */
export const parseValidationError = (
  error: unknown
): IValidationError | null => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;
    if (axiosError.response && axiosError.response.status === 400) {
      // Check for the standard ASP.NET Core Validation Problem details structure
      const data = axiosError.response.data as { errors: IValidationError };
      if (data.errors) {
        return data.errors;
      }
    }
  }
  return null;
};
