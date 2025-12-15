import React from "react";
import { useCharacterAudio } from "../../../../hooks/useCharacterAudio";
import styles from "./CharacterGreetingTitle.module.css";

interface CharacterGreetingTitleProps {
  fullName: string;
  japaneseName: string;
  greetingAudioUrl: string | undefined;
  firstName: string;
}

const CharacterGreetingTitle: React.FC<CharacterGreetingTitleProps> = ({
  fullName,
  japaneseName,
  greetingAudioUrl,
  firstName,
}) => {
  // Use the custom hook to manage audio state and handlers
  const { audioRef, isPlaying, handlePlayGreeting } =
    useCharacterAudio(greetingAudioUrl);

  return (
    <>
      <h1 className={styles.title}>
        Meet {fullName} ({japaneseName}) 🔮 The Bewitching Beauty
        {/* Play Button */}
        {greetingAudioUrl && (
          <button
            className={styles.audioButton}
            onClick={handlePlayGreeting}
            aria-label={
              isPlaying
                ? `Pause ${firstName}'s greeting`
                : `Play ${firstName}'s greeting`
            }
          >
            {/* Simple icon logic: use a speaker icon or play/pause symbols */}
            {isPlaying ? "🔈" : "🔊"}
          </button>
        )}
      </h1>

      {/* Hidden Audio Element (Loaded via URL from DTO) */}
      {greetingAudioUrl && (
        <audio ref={audioRef} src={greetingAudioUrl} preload="auto" />
      )}
    </>
  );
};

export default CharacterGreetingTitle;
