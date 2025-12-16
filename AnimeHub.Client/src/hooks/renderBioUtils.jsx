import styles from "../features/character/AboutCharacterPage.module.css";

/**
 * Helper function to render markdown-style bio text (paragraphs and bolding).
 * It breaks text by double newlines into paragraphs and converts **text** to <strong>text</strong>.
 * @param {string} text The markdown text to render.
 * @returns {React.ReactNode | null} An array of React paragraph elements.
 */
export const renderBio = (text) => {
  /* : string ===> add back to argument if setting back to typescript */
  if (!text) return null;

  return text.split("\n\n").map((paragraph, index) => (
    <p
      key={index}
      // Uses the shared style for paragraph spacing/line height
      className={styles.loreParagraph}
      dangerouslySetInnerHTML={{
        __html: paragraph
          .trim()
          .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>"),
      }}
    />
  ));
};
