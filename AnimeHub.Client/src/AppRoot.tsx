import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, RouterProvider } from "react-router-dom";
import { router } from "./routes/routes.tsx";
import { ThemeProvider } from "./features/theme/ThemeContext.tsx";
import { AuthProvider } from "./features/auth/AuthContext.tsx";
// import { RouterProvider } from "react-router-dom";
// import router from "./routes/routes.tsx";

// 1. Create a client instance for TanStack Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Set a sensible default stale time (e.g., 5 minutes)
      staleTime: 1000 * 60 * 5,
    },
  },
});

// This component will eventually contain all Context Providers (Auth, Theme, etc.)
function AppRoot() {
  return (
    // Wrap the entire application (the Router) with the ThemeProvider
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default AppRoot;
