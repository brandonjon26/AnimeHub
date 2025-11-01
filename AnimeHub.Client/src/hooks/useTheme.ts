import { useContext } from "react";
import {
  type ThemeContextType,
  ThemeContext,
} from "../features/auth/ThemeContext";

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);

  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  // TypeScript knows 'context' is not undefined here, so we can return it directly.
  return context;
};
