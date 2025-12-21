import { useState } from "react";

export const usePasswordToggle = () => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    setIsVisible((prev) => !prev);
  };

  // Return the type for the input and the current state
  return {
    type: isVisible ? "text" : "password",
    isVisible,
    toggleVisibility,
  };
};
