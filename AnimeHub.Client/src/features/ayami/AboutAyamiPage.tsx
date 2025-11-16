import React, { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import AyamiContent from "./AyamiContent";
import { GalleryClient } from "../../api/GalleryClient";
import { AyamiClient } from "../../api/AyamiClient";
import {
  type GalleryImage,
  type GalleryCategory,
} from "../../api/types/GalleryTypes";
import { type AyamiProfileDto } from "../../api/types/AyamiTypes";
import MainLayout from "../../components/common/MainLayout";
import { useAuth } from "../../hooks/useAuth";
import styles from "./AboutAyamiPage.module.css";

// Initialize the client
const galleryClient = new GalleryClient();

const AboutAyamiPage: React.FC = () => {
  const location = useLocation();
  const { user } = useAuth(); // Get user context (assuming it contains isAdult)
  const isAdult = user?.isAdult ?? false; // Extract isAdult status, default to false if not logged in

  const isIndexRoute =
    location.pathname.endsWith("/ayami") ||
    location.pathname.endsWith("/ayami/");

  // --- TanStack Query Data Fetching ---

  // 1. Fetch Ayami Profile Data
  const profileQuery = useQuery<AyamiProfileDto, Error>({
    queryKey: ["ayamiProfile"], // Unique key for the profile
    queryFn: () => AyamiClient.getProfile(),
    enabled: isIndexRoute, // Only run the query if we are on the index route
  });

  // 2. Fetch Featured Images (Replacing old useEffect logic)
  const featuredQuery = useQuery({
    queryKey: ["galleryFeatured"],
    queryFn: () => galleryClient.getFeaturedImages(),
    enabled: isIndexRoute,
  });

  // 3. Fetch Gallery Folders (Replacing old useEffect logic)
  const foldersQuery = useQuery({
    queryKey: ["galleryFolders"],
    queryFn: () => galleryClient.getFolders(),
    enabled: isIndexRoute,
  });

  // --- Combine Loading & Error States ---

  const isLoading =
    profileQuery.isLoading || featuredQuery.isLoading || foldersQuery.isLoading;
  const error = profileQuery.error || featuredQuery.error || foldersQuery.error;

  if (isIndexRoute && isLoading) {
    return (
      <div className={styles.pageContainer}>Loading Ayami's universe...</div>
    );
  }

  if (isIndexRoute && error) {
    return (
      <div className={styles.pageContainer} style={{ color: "red" }}>
        Error: Failed to load Ayami data: {error.message}
      </div>
    );
  }

  // --- Render Logic ---

  // Note: Data is guaranteed to exist here if isLoading is false and no error occurred.
  const profile = profileQuery.data;
  const featuredImages = featuredQuery.data || [];
  const folders = foldersQuery.data || [];

  return (
    <div className={styles.pageContainer}>
      {/* Outlet for rendering nested routes (Step 5) */}
      <Outlet />

      {/* Render AyamiContent ONLY if we are on the index route */}
      {isIndexRoute && profile && (
        <AyamiContent
          profile={profile}
          featuredImages={featuredImages}
          folders={folders}
          isAdult={isAdult}
        />
      )}
    </div>
  );
};

export default AboutAyamiPage;
