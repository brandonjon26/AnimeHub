import React, { useState, useEffect, useRef } from "react";

/**
 * Custom hook to manage audio playback, state, and cleanup for a character greeting.
 * * @param audioUrl The URL of the greeting audio file.
 * @returns An object containing the audio ref, playback state, and play/pause handler.
 */
export const useCharacterAudio = (audioUrl?: string) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Effect to reset playback state when audio finishes
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      const handleEnded = () => setIsPlaying(false);
      audio.addEventListener("ended", handleEnded);
      return () => {
        audio.removeEventListener("ended", handleEnded);
      };
    }
  }, [audioUrl]);

  // Play/Pause Audio Handler
  const handlePlayGreeting = (e?: React.MouseEvent) => {
    e?.preventDefault(); // Stop click events if used on a button
    if (!audioRef.current || !audioUrl) return;

    if (audioRef.current.paused) {
      // Always reset to start before playing for a fresh greeting
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch((error) => {
        console.error("Audio playback failed:", error);
        // Fallback for user gesture requirement, though modern browsers usually handle this on click
      });
      setIsPlaying(true);
    } else {
      // If currently playing, pause it and reset
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  };

  return {
    audioRef,
    isPlaying,
    handlePlayGreeting,
  };
};
