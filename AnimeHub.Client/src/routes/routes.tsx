import { createBrowserRouter } from "react-router-dom";
import React from "react";
import HomePage from "../features/home/HomePage";

// The array that defines all routes in the application
const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />, // The entry point of the application
    errorElement: <div>Oops! Something went wrong.</div>, // Custom error boundary
    // loader: rootLoader, // Add data loading functions here later
  },
  // We will add other feature routes here (e.g., /login, /anime/:id)
]);

export default router;
