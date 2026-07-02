"use client";

const AUDIO_SRC = "/music/Manila(1).mp3";

let initialized = false;

function pauseConfessionMusic(): void {
  const confession = document.getElementById(
    "confession-audio"
  ) as HTMLAudioElement | null;
  if (confession && !confession.paused) {
    confession.pause();
  }
}

function getAudio(): HTMLAudioElement {
  let audio = document.getElementById(
    "wheresa-audio"
  ) as HTMLAudioElement | null;

  if (!audio) {
    audio = document.createElement("audio");
    audio.id = "wheresa-audio";
    audio.src = AUDIO_SRC;
    audio.preload = "auto";
    audio.loop = true;
    document.body.appendChild(audio);
  }

  if (!initialized) {
    initialized = true;
  }

  return audio;
}

/** Preload audio when the wheresa page mounts. */
export function preloadWheresaMusic(): void {
  const audio = getAudio();
  audio.load();
}

/** Start Manila.mp3 from 0:00 — call from a user click (Next on page 1). */
export function startWheresaMusic(): void {
  pauseConfessionMusic();
  const audio = getAudio();
  audio.currentTime = 0;
  void audio.play().catch(() => { });
}

export function WheresaMusicControls() {
  return null;
}
