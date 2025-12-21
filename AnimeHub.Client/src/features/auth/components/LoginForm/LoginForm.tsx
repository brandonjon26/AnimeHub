import React from "react";
import { Link } from "react-router-dom";
import { useLoginForm } from "../../../../hooks/TS/useLoginForm";
import styles from "../../styles/AuthForms.module.css";

const LoginForm: React.FC = () => {
  const {
    formData,
    isLoading,
    generalError,
    user,
    handleChange,
    handleSubmit,
    getValidationError,
  } = useLoginForm();

  if (user) return null;

  return (
    <>
      <div className={`${styles.wallpaperLayer} ${styles.loginWallpaper}`} />
      <div className={styles["login-container"]}>
        <div className={styles["login-box"]}>
          <h2>🔮 Welcome Back, Traveler! 🔮</h2>
          <form onSubmit={handleSubmit} className={styles["login-form"]}>
            {generalError && (
              <p
                className={`${styles["error-message"]} ${styles["general-error"]}`}
              >
                {generalError}
              </p>
            )}

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

export default LoginForm;
