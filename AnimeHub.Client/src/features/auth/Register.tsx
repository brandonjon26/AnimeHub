import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../hooks/TS/useAuth";
import {
  type IRegisterRequest,
  type IValidationError,
} from "../../api/types/auth";
import { parseValidationError } from "../../api/authService";
import styles from "./Login.module.css";

const today = new Date().toISOString().split("T")[0];

// Define common error messages
const passwordRequirements =
  "Password must be at least 8 characters long, include an uppercase letter, a lowercase letter, a number, and a special character.";

const Register: React.FC = () => {
  const { register, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();

  // Initialize with all required fields
  const [formData, setFormData] = useState<IRegisterRequest>({
    email: "",
    userName: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    birthday: today, // Default to current date for ease of development
    location: "",
  });

  const [generalError, setGeneralError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] =
    useState<IValidationError | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const isLoading = authLoading || isSubmitting;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setGeneralError(null);
    setValidationErrors(null);
  };

  const clientValidate = (): boolean => {
    setGeneralError(null);

    // 1. Check for required fields (simple check, backend will be authoritative)
    if (
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword ||
      !formData.firstName ||
      !formData.lastName ||
      !formData.birthday
    ) {
      setGeneralError("All required fields must be filled out.");
      return false;
    }

    // 2. Password Match Check
    if (formData.password !== formData.confirmPassword) {
      setGeneralError("Password and confirmation password do not match.");
      return false;
    }

    // 3. Password Complexity Check (A basic regex check)
    // Requires: Minimum 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d\s]).{8,}$/;

    if (!passwordRegex.test(formData.password)) {
      setGeneralError(passwordRequirements);
      return false;
    }

    // 4. Birthday Check (Ensure it's not a future date)
    if (new Date(formData.birthday) > new Date()) {
      setGeneralError("Birthday cannot be in the future.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!clientValidate()) {
      return;
    }

    setIsSubmitting(true);
    setGeneralError(null);
    setValidationErrors(null);

    try {
      const result = await register(formData);

      if (result.success) {
        // 1. Navigate to the desired page (home or welcome)
        // Let's use /welcome for a better first-time experience, but /home is fine if /welcome isn't created yet.
        // For now, let's stick to /home, and we can change this later when we create the /welcome page.
        navigate("/welcome", { replace: true });

        // 2. 🔑 CRITICAL FIX: Force a hard refresh.
        // This ensures the browser's history stack stabilizes and the AuthContext
        // re-hydrates the new authenticated state without router conflict.
        window.location.reload();
      }
    } catch (error: any) {
      const validation = parseValidationError(error);

      if (validation) {
        // Display specific field validation errors from the API
        setValidationErrors(validation);
      } else {
        // Catch all for network or unhandled errors
        setGeneralError(
          "Registration failed. Please check your details and try again."
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const getValidationError = (fieldName: keyof IRegisterRequest) => {
    // Validation errors from the backend are often returned as arrays of strings
    return validationErrors?.[fieldName]?.[0] || null;
  };

  return (
    <>
      <div className={`${styles.wallpaperLayer} ${styles.registerWallpaper}`} />

      <div className={styles["login-container"]}>
        {/* Reusing container style */}
        <div className={styles["login-box"]} style={{ maxWidth: "500px" }}>
          {/* Wider box for more fields */}
          <h2>🔮 Join AnimeHub! 🔮</h2>
          <form onSubmit={handleSubmit} className={styles["login-form"]}>
            {generalError && (
              <p
                className={`${styles["error-message"]} ${styles["general-error"]}`}
              >
                {generalError}
              </p>
            )}

            {/* Email Input */}
            <div className={styles["form-group"]}>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={isLoading}
                aria-invalid={!!getValidationError("email")}
                required
              />
              {getValidationError("email") && (
                <p className={styles["error-message"]}>
                  {getValidationError("email")}
                </p>
              )}
            </div>

            {/* UserName Input */}
            <div className={styles["form-group"]}>
              <label htmlFor="userName">UserName</label>
              <input
                type="text"
                id="userName"
                name="userName"
                value={formData.userName}
                onChange={handleChange}
                disabled={isLoading}
                aria-invalid={!!getValidationError("userName")}
                required
              />
              {getValidationError("userName") && (
                <p className={styles["error-message"]}>
                  {getValidationError("userName")}
                </p>
              )}
            </div>

            <div
              className={styles["form-group"]}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1rem",
              }}
            >
              {/* Password Input */}
              <div className={styles["form-group"]} style={{ margin: 0 }}>
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

              {/* Confirm Password Input */}
              <div className={styles["form-group"]} style={{ margin: 0 }}>
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  disabled={isLoading}
                  required
                />
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1rem",
              }}
            >
              {/* First Name Input */}
              <div className={styles["form-group"]}>
                <label htmlFor="firstName">First Name</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  disabled={isLoading}
                  required
                />
              </div>

              {/* Last Name Input */}
              <div className={styles["form-group"]}>
                <label htmlFor="lastName">Last Name</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  disabled={isLoading}
                  required
                />
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1rem",
              }}
            >
              {/* Birthday Input */}
              <div className={styles["form-group"]}>
                <label htmlFor="birthday">Birthday</label>
                <input
                  type="date"
                  id="birthday"
                  name="birthday"
                  value={formData.birthday}
                  onChange={handleChange}
                  disabled={isLoading}
                  max={today} // Users cannot select a future date
                  required
                />
              </div>

              {/* Location Input */}
              <div className={styles["form-group"]}>
                <label htmlFor="location">Location (Optional)</label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  disabled={isLoading}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={styles["submit-button"]}
            >
              {isLoading ? "Creating Account..." : "Register"}
            </button>
          </form>
          <p className={styles["register-link-text"]}>
            Already have an account? <Link to="/login">Login Here!</Link> 🌟
          </p>
        </div>
      </div>
    </>
  );
};

export default Register;
