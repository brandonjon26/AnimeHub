import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../hooks/TS/useAuth";
import {
  type ILoginRequest,
  type IValidationError,
} from "../../api/types/auth";
import { parseValidationError } from "../../api/authService";
import styles from "./Login.module.css";

const Login: React.FC = () => {
  const { login, isLoading: authLoading, user } = useAuth();
  const navigate = useNavigate();

  // Local state for form data
  const [formData, setFormData] = useState<ILoginRequest>({
    loginIdentifier: "",
    password: "",
  });

  // State for handling non-validation errors (e.g., wrong credentials)
  const [generalError, setGeneralError] = useState<string | null>(null);
  // State for handling validation errors from the API (e.g., format errors)
  const [validationErrors, setValidationErrors] =
    useState<IValidationError | null>(null);
  // State for local submission loading
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const isLoading = authLoading || isSubmitting;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear errors on input change
    setGeneralError(null);
    setValidationErrors(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setGeneralError(null);
    setValidationErrors(null);

    try {
      const result = await login(formData);

      if (result.success) {
        // 1. Navigate to /home frist (updates the URL)
        navigate("/home", { replace: true });

        // 2. 🔑 CRITICAL FIX: Force a hard refresh.
        // This bypasses all React Router internal checks and forces the browser
        // to load the new URL with the now-set authenticated state.
        window.location.reload();
      }
    } catch (error: any) {
      const validation = parseValidationError(error);

      if (validation) {
        // Display validation errors (e.g., Password field requirements)
        setValidationErrors(validation);
      } else if (error.response && error.response.status === 401) {
        // Specific error for unauthorized/bad credentials
        setGeneralError("Invalid email or password.");
      } else {
        // Catch all for network or other unhandled errors
        setGeneralError("An unexpected error occurred during login.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const getValidationError = (fieldName: keyof ILoginRequest) => {
    // Validation errors from the backend are often returned as arrays of strings
    return validationErrors?.[fieldName]?.[0] || null;
  };

  // 🔑 FINAL STABILITY CHECK: If user exists, render nothing and rely on navigate
  if (user) {
    // The user object is now set, but the component is still mounted at '/login'.
    // Rendering null is the cleanest way to signal to React it should be gone.
    return null;
  }

  return (
    <>
      <div className={`${styles.wallpaperLayer} ${styles.loginWallpaper}`} />

      <div className={styles["login-container"]}>
        <div className={styles["login-box"]}>
          <h2>🔮 Welcome Back, Traveler! 🔮</h2>
          <form onSubmit={handleSubmit} className={styles["login-form"]}>
            {/* Display General Errors (e.g., 401 Unauthorized) */}
            {generalError && (
              <p
                className={`${styles["error-message"]} ${styles["general-error"]}`}
              >
                {generalError}
              </p>
            )}

            {/* Email Input */}
            <div className={styles["form-group"]}>
              <label htmlFor="loginIdentifier">Username or Email</label>
              <input
                type="text"
                id="loginIdentifier"
                name="loginIdentifier"
                value={formData.loginIdentifier}
                onChange={handleChange}
                disabled={isLoading}
                aria-invalid={!!getValidationError("loginIdentifier")}
                required
              />
              {getValidationError("loginIdentifier") && (
                <p className={styles["error-message"]}>
                  {getValidationError("loginIdentifier")}
                </p>
              )}
            </div>

            {/* Password Input */}
            <div className={styles["form-group"]}>
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                disabled={isLoading}
                aria-invalid={!!getValidationError("password")}
                required
              />
              {getValidationError("password") && (
                <p className={styles["error-message"]}>
                  {getValidationError("password")}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={styles["submit-button"]}
            >
              {isLoading ? "Connecting..." : "Login"}
            </button>
          </form>

          <p className={styles["register-link-text"]}>
            New to AnimeHub? <Link to="/register">Create an Account!</Link> 🌟
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;
