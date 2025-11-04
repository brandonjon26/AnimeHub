import React from "react";
import { Link } from "react-router-dom";
import {
  type GalleryImage,
  type GalleryCategory,
} from "../../api/types/GalleryTypes";
import styles from "./AboutAyamiPage.module.css";

interface AyamiContentProps {
  featuredImages: GalleryImage[];
  folders: GalleryCategory[];
}

// Static Bio Text from the old AboutAyamiPage.tsx
const AyamiBio = `
    Ayami (meaning "Bewitching Beauty") is the enigmatic spirit of discovery and charm at the heart of AnimeHub. 
    Hailing from a dark, ruined world somewhere on the outskirts of the Isekai multiverse, 
    she carries herself with an effortless confidence that belies her petite stature.
    
    Her playful nature is only matched by her profound sense of mystery. 
    Dressed in her signature midnight-black mini-dress, witch's hat, and gloves—all highlighted by subtle purple accents matching her mesmerizing eyes—she embodies both elegance and edge.
    
    Ayami wields a distinctive staff, not just as a weapon, but as a key to unlock the most compelling worlds and narratives in the AnimeHub universe. 
    She is here to be your confident, charming, and slightly mischievous guide through all the deepest lore and most captivating stories the fandom has to offer.
`;

const renderBio = (text: string) => {
  return text.split("\n\n").map((paragraph, index) => (
    <p
      key={index}
      className={styles.paragraph}
      dangerouslySetInnerHTML={{
        __html: paragraph
          .trim()
          .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>"),
      }}
    />
  ));
};

const AyamiContent: React.FC<AyamiContentProps> = ({
  featuredImages,
  folders,
}) => {
  return (
    <>
      {/* 1. TOP SECTION: Bio (Left) and Featured Photos (Right) */}
      <h1 className={styles.title}>Meet Ayami 🌟 The Bewitching Beauty</h1>

      {/* Reuses the existing flex wrapper class */}
      <div className={styles.contentWrapper}>
        {/* LEFT: Bio/Text Area (Retaining original structure) */}
        <div className={styles.bioArea}>
          <div className={styles.bioFlexContainer}>
            {/* Static image remains for the bio section */}
            <img
              src="/images/ayami/Ayami_Bio_Page_3.png"
              alt="Ayami Headshot"
              className={styles.headshotImage}
            />

            <div className={styles.bioText}>
              <h2>Ayami's Story</h2>
              {renderBio(AyamiBio)}
            </div>
          </div>
          {/* Key Details List remains static */}
          <h3 className={styles.keyDetailsTitle}>Key Details</h3>
          <ul className={styles.keyList}>
            <li>**Origin:** Outskirts of the Isekai Multiverse.</li>
            <li>**Role:** Guide of discovery and charm for AnimeHub.</li>
            <li>
              **Signature Look:** Midnight-black dress, witch's hat, and purple
              accents.
            </li>
            <li>
              **Equipment:** A distinctive staff, used to unlock compelling
              worlds.
            </li>
          </ul>
        </div>

        {/* RIGHT: Featured Photos Gallery (Replaces static content) */}
        {/* Reuses the existing galleryArea class */}
        <div className={styles.galleryArea}>
          <h2>Featured Photos</h2>

          {/* Grid for two featured images */}
          <div className={styles.featuredGrid}>
            {featuredImages.map((img) => (
              <img
                key={img.galleryImageId}
                src={img.imageUrl}
                alt={img.altText}
                className={styles.featuredImage}
              />
            ))}
            {featuredImages.length === 0 && <p>Loading featured images...</p>}
          </div>
        </div>
      </div>

      {/* 2. BOTTOM SECTION: Album/Folder Links */}
      <div className={styles.albumsSection}>
        <h2>Ayami's Albums</h2>
        <div className={styles.albumList}>
          {folders.map((folder) => (
            <Link
              key={folder.galleryImageCategoryId}
              to={folder.name} // Target the nested route for Step 5
              className={styles.albumLink}
            >
              <div className={styles.albumCard}>
                <img
                  src={folder.coverUrl}
                  alt={`Cover image for ${folder.name} album`}
                  className={styles.albumCover}
                />
                <h4>{folder.name}</h4>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};

export default AyamiContent;
