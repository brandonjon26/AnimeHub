import { useState, useEffect } from "react";

/**
 * Manages image preview URLs for local files or remote URLs.
 * @param {File|null} file - The local file to preview.
 * @param {string} [initialUrl] - An optional existing image URL.
 * @returns {string|null} The preview URL string.
 */
export const useImagePreview = (file, initialUrl) => {
  const [previewUrl, setPreviewUrl] = useState(initialUrl || null);

  useEffect(() => {
    // Priority 1: Handle local file (ADD)
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);

      // Memory management: clean up the blob URL
      return () => URL.revokeObjectURL(objectUrl);
    }

    // Priority 2: Fallback to existing URL (UPDATE)
    setPreviewUrl(initialUrl || null);
  }, [file, initialUrl]);

  return previewUrl;
};
