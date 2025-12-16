import React, { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useQueries, useQuery } from "@tanstack/react-query";
import CharacterContent from "./CharacterContent";
import { GalleryClient } from "../../api/GalleryClient";
import { CharacterClient } from "../../api/CharacterClient";
import {
  type GalleryImage,
  type GalleryCategory,
} from "../../api/types/GalleryTypes";
import { type CharacterProfileDto } from "../../api/types/CharacterTypes";
import MainLayout from "../../components/common/MainLayout";
import { useAuth } from "../../hooks/TS/useAuth";
import styles from "./AboutCharacterPage.module.css";

// Initialize the client
const galleryClient = new GalleryClient();

// Define the two characters we need to fetch
const PRIMARY_CHARACTER_NAME = "ayami";
const SECONDARY_CHARACTER_NAME = "chiara";

const AboutCharacterPage: React.FC = () => {
  const location = useLocation();
  const { user } = useAuth(); // Get user context (assuming it contains isAdult)
  const isAdult = user?.isAdult ?? false; // Extract isAdult status, default to false if not logged in

  const isIndexRoute =
    location.pathname.endsWith("/ayami") ||
    location.pathname.endsWith("/ayami/");

  // --- TanStack Query Data Fetching ---

  // 1. Fetch BOTH Character Profiles concurrently using useQueries
  const characterQueries = useQueries({
    queries: [
      {
        queryKey: ["characterProfile", PRIMARY_CHARACTER_NAME],
        queryFn: () => CharacterClient.getProfile(PRIMARY_CHARACTER_NAME),
        enabled: isIndexRoute,
      },
      {
        queryKey: ["characterProfile", SECONDARY_CHARACTER_NAME],
        queryFn: () => CharacterClient.getProfile(SECONDARY_CHARACTER_NAME),
        enabled: isIndexRoute,
      },
    ],
  });

  // Extract the individual query results
  const [ayamiQuery, chiaraQuery] = characterQueries;

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

  // Extract the refetch function for the folders
  const { refetch: refetchFolders } = foldersQuery;

  // --- Combine Loading & Error States ---

  const isLoading =
    ayamiQuery.isLoading ||
    chiaraQuery.isLoading ||
    featuredQuery.isLoading ||
    foldersQuery.isLoading;

  const error =
    ayamiQuery.error ||
    chiaraQuery.error ||
    featuredQuery.error ||
    foldersQuery.error;

  // Check specifically if the primary profile (Ayami) is missing or errored
  const primaryError = ayamiQuery.error;

  if (isIndexRoute && isLoading) {
    return (
      <div className={styles.pageContainer}>Loading Ayami's universe...</div>
    );
  }

  if (isIndexRoute && primaryError) {
    return (
      <div className={styles.pageContainer} style={{ color: "red" }}>
        Error: Failed to load Primary Character data: {primaryError.message}
      </div>
    );
  }

  // Define the refresh handler using the refetch method
  // We don't need to await the refetch, just trigger it.
  const handleGalleryRefresh = () => {
    // This tells TanStack Query to re-execute the 'galleryFolders' query.
    refetchFolders();
    // Since the featured images are related, it's good practice to refetch them too.
    featuredQuery.refetch();
  };

  // --- Render Logic ---

  // Note: Data is guaranteed to exist here if isLoading is false and no error occurred.
  const primaryProfile = ayamiQuery.data;
  // The secondary character, which might be null if the query failed (error check is above)
  const secondaryProfile = chiaraQuery.data;
  const featuredImages = featuredQuery.data || [];
  const folders = foldersQuery.data || [];

  return (
    <div className={styles.pageContainer}>
      {/* Outlet for rendering nested routes (Step 5) */}
      <Outlet />

      {/* Render AyamiContent ONLY if we are on the index route */}
      {isIndexRoute && primaryProfile && (
        <CharacterContent
          primaryProfile={primaryProfile}
          secondaryProfile={secondaryProfile}
          featuredImages={featuredImages}
          folders={folders}
          isAdult={isAdult}
          onGalleryRefresh={handleGalleryRefresh}
        />
      )}
    </div>
  );
};

export default AboutCharacterPage;
