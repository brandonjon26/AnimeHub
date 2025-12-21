import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./useAuth";
import { parseValidationError } from "../../api/authService";
import {
  type ILoginRequest,
  type IValidationError,
} from "../../api/types/auth";

export const useLoginForm = () => {
  const { login, isLoading: authLoading, user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<ILoginRequest>({
    loginIdentifier: "",
    password: "",
  });

  const [generalError, setGeneralError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] =
    useState<IValidationError | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const isLoading = authLoading || isSubmitting;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
        navigate("/home", { replace: true });
        window.location.reload(); // 🔑 The Critical Refresh
      }
    } catch (error: any) {
      const validation = parseValidationError(error);
      if (validation) {
        setValidationErrors(validation);
      } else if (error.response?.status === 401) {
        setGeneralError("Invalid email or password.");
      } else {
        setGeneralError("An unexpected error occurred during login.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const getValidationError = (fieldName: keyof ILoginRequest) => {
    return validationErrors?.[fieldName]?.[0] || null;
  };

  return {
    formData,
    isLoading,
    generalError,
    user,
    handleChange,
    handleSubmit,
    getValidationError,
  };
};
