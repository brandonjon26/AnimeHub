import React from "react";
import { Link } from "react-router-dom";
import { useRegisterForm } from "../../../../hooks/TS/useRegisterForm";
import styles from "../../styles/AuthForms.module.css";

const RegisterForm: React.FC = () => {
  const {
    formData,
    isLoading,
    generalError,
    today,
    handleChange,
    handleSubmit,
    getValidationError,
  } = useRegisterForm();

  return (
    <>
      <div className={`${styles.wallpaperLayer} ${styles.registerWallpaper}`} />
      <div className={styles["login-container"]}>
        <div className={styles["login-box"]} style={{ maxWidth: "500px" }}>
          <h2>🔮 Join AnimeHub! 🔮</h2>
          <form onSubmit={handleSubmit} className={styles["login-form"]}>
            {generalError && (
              <p
                className={`${styles["error-message"]} ${styles["general-error"]}`}
              >
                {generalError}
              </p>
            )}

            {/* Email & Username */}
            <div className={styles["form-group"]}>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={isLoading}
                required
              />
              {getValidationError("email") && (
                <p className={styles["error-message"]}>
                  {getValidationError("email")}
                </p>
              )}
            </div>

            <div className={styles["form-group"]}>
              <label htmlFor="userName">UserName</label>
              <input
                type="text"
                id="userName"
                name="userName"
                value={formData.userName}
                onChange={handleChange}
                disabled={isLoading}
                required
              />
              {getValidationError("userName") && (
                <p className={styles["error-message"]}>
                  {getValidationError("userName")}
                </p>
              )}
            </div>

            {/* Passwords Grid */}
            <div
              className={styles["form-group"]}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1rem",
              }}
            >
              <div className={styles["form-group"]} style={{ margin: 0 }}>
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={isLoading}
                  required
                />
                {getValidationError("password") && (
                  <p className={styles["error-message"]}>
                    {getValidationError("password")}
                  </p>
                )}
              </div>
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

            {/* Names Grid */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1rem",
              }}
            >
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

            {/* Birthday & Location Grid */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1rem",
              }}
            >
              <div className={styles["form-group"]}>
                <label htmlFor="birthday">Birthday</label>
                <input
                  type="date"
                  id="birthday"
                  name="birthday"
                  value={formData.birthday}
                  onChange={handleChange}
                  disabled={isLoading}
                  max={today}
                  required
                />
              </div>
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

export default RegisterForm;
