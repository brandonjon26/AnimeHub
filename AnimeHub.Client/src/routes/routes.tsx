import {
  Navigate,
  createBrowserRouter,
  type RouteObject,
} from "react-router-dom";
import MainLayout from "./../components/common/MainLayout/MainLayout.tsx";
import HomePage from "../features/home/HomePage";
import AboutCharacterPage from "../features/character/AboutCharacterPage.tsx";
import { GalleryFolderPage } from "../features/character/gallery/GalleryFolder";
import LoginForm from "../features/auth/components/LoginForm/LoginForm.tsx";
import RegisterForm from "../features/auth/components/RegisterForm/RegisterForm.tsx";
import ProtectedRoute from "../features/auth/guards/ProtectedRoute.tsx";
import RedirectIfAuthenticated from "../features/auth/guards/RedirectIfAuthenticated.tsx";
import WelcomePage from "../features/home/WelcomePage.tsx";
import ProfilePage from "../features/profile/ProfilePage.tsx";

// 1. Define the route configuration array (outside any component)
const routeConfig: RouteObject[] = [
  // --- PUBLIC AUTH ROUTES ---
  {
    element: <RedirectIfAuthenticated />,
    children: [
      {
        path: "login",
        element: <LoginForm />,
      },
      {
        path: "register",
        element: <RegisterForm />,
      },
    ],
  },

  // --- PROTECTED ROUTE WRAPPER ---
  {
    path: "/",
    element: <ProtectedRoute />,
    children: [
      {
        path: "welcome",
        element: <WelcomePage />,
      },
      {
        element: <MainLayout />,
        children: [
          {
            index: true,
            element: <Navigate to="home" replace />,
          },
          {
            path: "home",
            element: <HomePage />,
          },
          // Ayami/Gallery Routes (NESTED STRUCTURE)
          {
            path: "ayami",
            element: <AboutCharacterPage />,
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
            path: "profile",
            element: <ProfilePage />,
          },
        ],
      },
    ],
  },

  // --- CATCH-ALL (404) ---
  { path: "*", element: <div style={{ padding: "2rem" }}>404 Not Found</div> },
];

// 2. Export the created browser router
export const router = createBrowserRouter(routeConfig);
