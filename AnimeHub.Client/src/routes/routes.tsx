import { createBrowserRouter } from "react-router-dom";
import React from "react";
import HomePage from "../features/home/HomePage";
import AboutAyamiPage from "../features/ayami/AboutAyamiPage";
import GalleryFolderPage from "../features/ayami/GalleryFolderPage";

// The array that defines all routes in the application
const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />, // The entry point of the application
    errorElement: <div>Oops! Something went wrong.</div>, // Custom error boundary
    // loader: rootLoader, // Add data loading functions here later
  },
  {
    // PARENT ROUTE: Renders AboutAyamiPage.tsx
    path: "/ayami",
    element: <AboutAyamiPage />,
    errorElement: <div>Oops! Ayami seems to have wandered off!</div>,

    // NESTED ROUTES: Renders content inside the <Outlet /> in AboutAyamiPage
    children: [
      {
        // Matches paths like /ayami/Standard%20Anime%20Isekai
        path: ":categoryName",
        element: <GalleryFolderPage />,
      },
      // Note: If you want /ayami itself to render, you can add an index: true route,
      // but for now, AboutAyamiPage's internal logic handles the index view.
    ],
  },
  // We will add other feature routes here (e.g., /login, /anime/:id)
]);

export default router;
