import { createBrowserRouter } from "react-router-dom";
import React from "react";
import HomePage from "../features/home/HomePage";
import AboutAyamiPage from "../features/ayami/AboutAyamiPage";

// The array that defines all routes in the application
const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />, // The entry point of the application
    errorElement: <div>Oops! Something went wrong.</div>, // Custom error boundary
    // loader: rootLoader, // Add data loading functions here later
  },
  {
    // 🔑 New Route for the Ayami Page
    path: "/ayami",
    element: <AboutAyamiPage />,
    errorElement: <div>Oops! Ayami seems to have wandered off!</div>,
  },
  // We will add other feature routes here (e.g., /login, /anime/:id)
]);

export default router;
