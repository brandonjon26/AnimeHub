import React from "react";
import MainLayout from "../../components/common/MainLayout";
import styles from "./AboutAyamiPage.module.css";

const AyamiBio = `
  Ayami (meaning "Bewitching Beauty") is the enigmatic spirit of discovery and charm at the heart of AnimeHub. 
  Hailing from a dark, ruined world somewhere on the outskirts of the Isekai multiverse, 
  she carries herself with an effortless confidence that belies her petite stature.
  
  Her playful nature is only matched by her profound sense of mystery. 
  Dressed in her signature midnight-black mini-dress, witch's hat, and gloves—all highlighted by subtle purple accents matching her mesmerizing eyes—she embodies both elegance and edge.
  
  Ayami wields a distinctive staff, not just as a weapon, but as a key to unlock the most compelling worlds and narratives in the AnimeHub universe. 
  She is here to be your confident, charming, and slightly mischievous guide through all the deepest lore and most captivating stories the fandom has to offer.
`;

// Helper function to render paragraphs and bold text (retained for clean formatting)
const renderBio = (text: string) => {
  return text
    .split("\n\n")
    .map((paragraph, index) => (
      <p
        key={index}
        style={{ marginBottom: "15px", lineHeight: 1.6 }}
        dangerouslySetInnerHTML={{
          __html: paragraph
            .trim()
            .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>"),
        }}
      />
    ));
};

const AboutAyamiPage: React.FC = () => {
  return (
    <MainLayout>
      {/* 🔑 Use class name for the page container */}
      <div className={styles.pageContainer}>
        <h1 className={styles.title}>Meet Ayami 🌟 The Bewitching Beauty</h1>

        {/* 🔑 Use class name for the flex wrapper */}
        <div className={styles.contentWrapper}>
          {/* Left: Bio/Text Area */}
          <div className={styles.bioArea}>
            <h2>Ayami's Story</h2>
            {renderBio(AyamiBio)}

            <h3 className={styles.keyDetailsTitle}>Key Details</h3>
            <ul className={styles.keyList}>
              <li>
                **Origin:** Outskirts of the Isekai Multiverse (a dark, ruined
                world).
              </li>
              <li>**Role:** Guide of discovery and charm for AnimeHub.</li>
              <li>
                **Signature Look:** Midnight-black dress, witch's hat, and
                subtle purple accents.
              </li>
              <li>
                **Equipment:** A distinctive staff, used to unlock compelling
                worlds.
              </li>
            </ul>
          </div>

          {/* Right: Gallery */}
          <div className={styles.galleryArea}>
            <h2>Gallery</h2>

            {/* REFERENCE IMAGE 1: Full art or main pose */}
            <img
              src="/images/ayami/Ayami Bio Page 1.png"
              alt="Ayami Full Art"
              className={styles.galleryImage}
            />

            {/* REFERENCE IMAGE 2: Chibi or secondary pose */}
            <img
              src="/images/ayami/Ayami Bio Page 2.png"
              alt="Ayami Full Art"
              className={styles.galleryImage}
            />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default AboutAyamiPage;
