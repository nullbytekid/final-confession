"use client";

import { useEffect, useRef, useState } from "react";

export const MUSIC_KEY = "confession-music-started";
const AUDIO_SRC = "/music/song.mp3";
const START_SECONDS = 5;

function getAudio(): HTMLAudioElement {
  let audio = document.getElementById(
    "confession-audio"
  ) as HTMLAudioElement | null;

  if (!audio) {
    audio = document.createElement("audio");
    audio.id = "confession-audio";
    audio.src = AUDIO_SRC;
    audio.preload = "auto";
    document.body.appendChild(audio);

    audio.addEventListener("ended", () => {
      audio!.currentTime = START_SECONDS;
      void audio!.play();
    });
  }

  return audio;
}

function playFromStart(): void {
  const audio = getAudio();
  audio.currentTime = START_SECONDS;
  void audio.play().then(() => {
    window.dispatchEvent(new Event("confession-music-playing"));
  });
}

/** Call from a user click (envelope or play button). */
export function startConfessionMusic(): void {
  sessionStorage.setItem(MUSIC_KEY, "true");
  playFromStart();
}

export function isMusicSessionActive(): boolean {
  return sessionStorage.getItem(MUSIC_KEY) === "true";
}

export function MusicControls() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const sync = () => {
      const audio = document.getElementById(
        "confession-audio"
      ) as HTMLAudioElement | null;
      audioRef.current = audio;
      setPlaying(Boolean(audio && !audio.paused));
      setVisible(Boolean(audio && !audio.paused));
    };

    sync();
    window.addEventListener("confession-music-playing", sync);
    return () => window.removeEventListener("confession-music-playing", sync);
  }, []);

  if (!visible) return null;

  return (
    <div className="music-controls fixed bottom-4 right-4 z-[60] flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 shadow-lg backdrop-blur-sm">
      <button
        type="button"
        onClick={() => {
          const audio = audioRef.current;
          if (!audio) return;
          if (audio.paused) {
            void audio.play();
            setPlaying(true);
          } else {
            audio.pause();
            setPlaying(false);
          }
        }}
        className="text-sm text-pink-800"
      >
        {playing ? "⏸ Pause" : "▶ Play"}
      </button>
    </div>
  );
}

export default function BackgroundMusic() {
  return null;
}
