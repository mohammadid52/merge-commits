import React, { createContext, useContext, useEffect } from "react";
const AudioContext = createContext<any>(null);

// TYPES

export const SOUND_BASE_URL =
  "https://iconoclaststorage143306-dev.s3.amazonaws.com/sounds/";

export const AudioProvider = ({ children }: any) => {
  const insertAudioElementToHtml = (soundName: string) => {
    const audioElement = document.createElement("audio");
    audioElement.setAttribute("id", `audio-element-${soundName.toLowerCase()}`);
    audioElement.setAttribute("src", `${SOUND_BASE_URL}${soundName}.mp3`);
    audioElement.setAttribute("type", "audio/mp3");
    document.body.appendChild(audioElement);
  };

  const soundList = ["success", "error"];

  const stopPlayingAllSounds = () => {
    soundList.forEach((sound) => {
      const audioElement = document.getElementById(
        `audio-element-${sound.toLowerCase()}`
      ) as HTMLAudioElement;
      if (audioElement) {
        audioElement.pause();
        audioElement.currentTime = 0;
      }
    });
  };

  useEffect(() => {
    soundList.forEach((soundName) => {
      insertAudioElementToHtml(soundName);
    });
    return () => {
      // stop playing
      stopPlayingAllSounds();
    };
  }, []);

  return <AudioContext.Provider value={{}}>{children}</AudioContext.Provider>;
};

export const useAudioContext = () => useContext(AudioContext);
