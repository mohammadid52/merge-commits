const useSounds = (soundNames: string[]): HTMLAudioElement[] => {
  const response: HTMLAudioElement[] = soundNames.map((soundName) => {
    const audioElement = document.getElementById(
      `audio-element-${soundName.toLowerCase()}`
    ) as HTMLAudioElement;

    if (audioElement) {
      return audioElement;
    }
  });
  return response;
};

export default useSounds;
