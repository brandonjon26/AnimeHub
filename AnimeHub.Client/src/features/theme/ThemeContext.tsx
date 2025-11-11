import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";

// 1. Define the possible Theme values and the Context Shape
type Theme = "light" | "dark";

export interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

// 2. Create the Context with a default (null or undefined) value
export const ThemeContext = createContext<ThemeContextType | undefined>(
  undefined
);

// 3. Define the Provider Component
interface ThemeProviderProps {
  children: ReactNode;
}

// NOTE: We are setting 'dark' as the initial/default theme, as requested.
const INITIAL_THEME: Theme = "dark";

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // Use state to hold the current theme
  const [theme, setTheme] = useState<Theme>(INITIAL_THEME);

  // Function to switch between 'dark' and 'light'
  const toggleTheme = useCallback(() => {
    setTheme((currentTheme) => (currentTheme === "dark" ? "light" : "dark"));
  }, []); // Empty dependency array makes this function stable

  // Effect to apply the theme to the document body
  useEffect(() => {
    // This adds the data-theme attribute, which triggers the CSS variable swap in global.css
    document.body.setAttribute("data-theme", theme);
  }, [theme]); // Reruns whenever the 'theme' state changes

  const contextValue = useMemo(
    () => ({
      theme,
      toggleTheme,
    }),
    [theme, toggleTheme]
  ); // Dependencies: theme state and stable toggleTheme function

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};
