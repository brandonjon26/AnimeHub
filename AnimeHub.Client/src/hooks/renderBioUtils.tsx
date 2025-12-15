import styles from "../features/character/AboutCharacterPage.module.css";

/**
 * Helper function to render markdown-style bio text (paragraphs and bolding).
 * It breaks text by double newlines into paragraphs and converts **text** to <strong>text</strong>.
 * @param text The markdown text to render.
 * @returns An array of React paragraph elements.
 */
export const renderBio = (text: string) => {
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
