import React from "react";
import {
  useRoutes,
  Navigate,
  createBrowserRouter,
  type RouteObject,
} from "react-router-dom";
import MainLayout from "./../components/common/MainLayout/MainLayout.tsx";
import HomePage from "../features/home/HomePage";
import AboutAyamiPage from "../features/ayami/AboutAyamiPage";
import GalleryFolderPage from "../features/ayami/GalleryFolderPage";
import Login from "../features/auth/Login.tsx";
import Register from "../features/auth/Register.tsx";
import ProtectedRoute from "../features/auth/ProtectedRoute.tsx";
import RedirectIfAuthenticated from "../features/auth/RedirectIfAuthenticated.tsx";
import WelcomePage from "../features/home/WelcomePage.tsx";
import ProfilePage from "../features/profile/ProfilePage.tsx";

// 1. Define the route configuration array (outside any component)
const routeConfig: RouteObject[] = [
  // --- PUBLIC AUTH ROUTES ---
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },

  // --- PROTECTED ROUTE WRAPPER ---
  {
    path: "/",
    element: <ProtectedRoute />,
    children: [
      {
        path: "/welcome",
        element: <WelcomePage />,
      },
      {
        element: <MainLayout />,
        children: [
          {
            index: true,
            element: <Navigate to="/home" />,
          },
          {
            path: "home",
            element: <HomePage />,
          },
          // Ayami/Gallery Routes (NESTED STRUCTURE)
          {
            path: "ayami",
            element: <AboutAyamiPage />,
            children: [
              {
                // Matches paths like /ayami/Standard%20Anime%20Isekai
                path: ":categoryName",
                element: <GalleryFolderPage />,
              },
            ],
          },

          // Future Anime and Merchandise paths

          {
            path: "/profile",
            element: <ProfilePage />,
          },
        ],
      },
    ],
  },

  // --- CATCH-ALL (404) ---
  { path: "*", element: <div>404 Not Found</div> },
];

// 2. Export the created browser router
export const router = createBrowserRouter(routeConfig);
