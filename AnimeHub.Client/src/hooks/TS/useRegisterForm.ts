import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./useAuth";
import { parseValidationError } from "../../api/authService";
import {
  type IRegisterRequest,
  type IValidationError,
} from "../../api/types/auth";

const today = new Date().toISOString().split("T")[0];
const passwordRequirements =
  "Password must be at least 8 characters long, include an uppercase letter, a lowercase letter, a number, and a special character.";

export const useRegisterForm = () => {
  const { register, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<IRegisterRequest>({
    email: "",
    userName: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    birthday: today,
    location: "",
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

  const clientValidate = (): boolean => {
    setGeneralError(null);

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

    if (formData.password !== formData.confirmPassword) {
      setGeneralError("Password and confirmation password do not match.");
      return false;
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d\s]).{8,}$/;
    if (!passwordRegex.test(formData.password)) {
      setGeneralError(passwordRequirements);
      return false;
    }

    if (new Date(formData.birthday) > new Date()) {
      setGeneralError("Birthday cannot be in the future.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientValidate()) return;

    setIsSubmitting(true);
    setGeneralError(null);
    setValidationErrors(null);

    try {
      const result = await register(formData);
      if (result.success) {
        navigate("/welcome", { replace: true });
        window.location.reload(); // 🔑 Critical Refresh
      }
    } catch (error: any) {
      const validation = parseValidationError(error);
      if (validation) {
        setValidationErrors(validation);
      } else {
        setGeneralError(
          "Registration failed. Please check your details and try again."
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const getValidationError = (fieldName: keyof IRegisterRequest) => {
    return validationErrors?.[fieldName]?.[0] || null;
  };

  return {
    formData,
    isLoading,
    generalError,
    today,
    handleChange,
    handleSubmit,
    getValidationError,
  };
};
