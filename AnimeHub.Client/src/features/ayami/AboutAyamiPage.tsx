import React, { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import AyamiContent from "./AyamiContent";
import { GalleryClient } from "../../api/GalleryClient";
import {
  type GalleryImage,
  type GalleryCategory,
} from "../../api/types/GalleryTypes";
import MainLayout from "../../components/common/MainLayout";
import styles from "./AboutAyamiPage.module.css";

// Initialize the client
const galleryClient = new GalleryClient();

const AboutAyamiPage: React.FC = () => {
  // 🔑 State for the dynamic gallery data
  const [featuredImages, setFeaturedImages] = useState<GalleryImage[]>([]);
  const [folders, setFolders] = useState<GalleryCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const location = useLocation();
  // Determines if we are on the index route (/ayami) or a nested route (/ayami/album)
  const isIndexRoute =
    location.pathname.endsWith("/ayami") ||
    location.pathname.endsWith("/ayami/");

  // 🔑 Data Fetching Logic
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch both data sets concurrently
        const [featured, categories] = await Promise.all([
          galleryClient.getFeaturedImages(),
          galleryClient.getFolders(),
        ]);

        setFeaturedImages(featured);
        setFolders(categories);
      } catch (err) {
        console.error("Failed to fetch gallery data:", err);
        setError("Failed to load Ayami's media gallery.");
      } finally {
        setIsLoading(false);
      }
    };

    // Only fetch data if we are rendering the index view
    if (isIndexRoute) {
      fetchData();
    }
  }, [isIndexRoute]);

  // If the route is not the index (/ayami/album), Outlet handles rendering, so we skip loading/error screens here.

  if (isIndexRoute && isLoading) {
    return <div className={styles.pageContainer}>Loading Ayami's media...</div>;
  }

  if (isIndexRoute && error) {
    return (
      <div className={styles.pageContainer} style={{ color: "red" }}>
        Error: {error}
      </div>
    );
  }

  return (
    <MainLayout>
      <div className={styles.pageContainer}>
        {/* Outlet for rendering nested routes (Step 5) */}
        <Outlet />

        {/* Render AyamiContent ONLY if we are on the index route */}
        {isIndexRoute && (
          <AyamiContent featuredImages={featuredImages} folders={folders} />
        )}
      </div>
    </MainLayout>
  );
};

export default AboutAyamiPage;
