import { useEffect, useRef, useState } from "react";
import {
  AMBIENT_CUE_SECONDS,
  playerMarkers,
  shareTargets,
} from "../data/studiolotData";
import { SceneCopyPanel } from "./SceneCopyPanel";

function formatTime(totalSeconds) {
  if (!Number.isFinite(totalSeconds)) {
    return "00:00";
  }

  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60);
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function isTypingTarget(target) {
  if (!target) {
    return false;
  }

  const tagName = target.tagName;
  return (
    tagName === "INPUT" ||
    tagName === "TEXTAREA" ||
    tagName === "SELECT" ||
    target.isContentEditable
  );
}

export function OnlinePlayerScene({ scene, isActive }) {
  const videoRef = useRef(null);
  const ambienceRef = useRef(null);
  const timelineRef = useRef(null);
  const playerContainerRef = useRef(null);
  const commentTimeoutRef = useRef(null);
  const cueTriggeredRef = useRef(false);
  const commentTriggeredRef = useRef(new Set());

  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isDialogueMuted, setIsDialogueMuted] = useState(false);
  const [isMusicMuted, setIsMusicMuted] = useState(false);
  const [activeComment, setActiveComment] = useState(null);
  const [isShareOpen, setIsShareOpen] = useState(false);

  useEffect(() => {
    const ambience = new Audio("/assets/riversong3.flac");
    ambience.preload = "auto";
    ambience.volume = 0.4;
    ambienceRef.current = ambience;

    return () => {
      ambience.pause();
      ambienceRef.current = null;
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    video.muted = isDialogueMuted;
  }, [isDialogueMuted]);

  useEffect(() => {
    const ambience = ambienceRef.current;

    if (!ambience) {
      return;
    }

    ambience.muted = isMusicMuted;

    if (isMusicMuted) {
      ambience.pause();
    } else if (isPlaying && cueTriggeredRef.current && ambience.paused) {
      ambience.play().catch(() => {});
    }
  }, [isMusicMuted, isPlaying]);

  useEffect(() => {
    if (!isActive) {
      return undefined;
    }

    function handleKeyDown(event) {
      if (event.code !== "Space") {
        return;
      }

      if (isShareOpen || isTypingTarget(event.target)) {
        return;
      }

      event.preventDefault();
      togglePlayPause();
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isActive, isShareOpen, isPlaying]);

  useEffect(() => {
    return () => {
      if (commentTimeoutRef.current) {
        window.clearTimeout(commentTimeoutRef.current);
      }
    };
  }, []);

  function togglePlayPause() {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    if (video.paused) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }

  function handleLoadedMetadata() {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    setDuration(video.duration);
  }

  function triggerComment(marker) {
    setActiveComment(marker);

    if (commentTimeoutRef.current) {
      window.clearTimeout(commentTimeoutRef.current);
    }

    commentTimeoutRef.current = window.setTimeout(() => {
      setActiveComment(null);
    }, 4000);
  }

  function handleTimeUpdate() {
    const video = videoRef.current;
    const ambience = ambienceRef.current;

    if (!video) {
      return;
    }

    const nextTime = video.currentTime;
    setCurrentTime(nextTime);

    if (nextTime < AMBIENT_CUE_SECONDS - 1) {
      cueTriggeredRef.current = false;
      if (ambience) {
        ambience.pause();
        ambience.currentTime = 0;
      }
    }

    if (!cueTriggeredRef.current && nextTime >= AMBIENT_CUE_SECONDS) {
      cueTriggeredRef.current = true;

      if (ambience && !isMusicMuted) {
        ambience.currentTime = 0;
        ambience.play().catch(() => {});
      }
    }

    playerMarkers.forEach((marker) => {
      if (nextTime < marker.time - 2) {
        commentTriggeredRef.current.delete(marker.id);
      }

      if (
        Math.abs(nextTime - marker.time) < 0.45 &&
        !commentTriggeredRef.current.has(marker.id)
      ) {
        commentTriggeredRef.current.add(marker.id);
        triggerComment(marker);
      }
    });
  }

  function handlePlay() {
    setIsPlaying(true);

    const ambience = ambienceRef.current;
    const video = videoRef.current;

    if (
      ambience &&
      video &&
      cueTriggeredRef.current &&
      !isMusicMuted &&
      ambience.paused
    ) {
      ambience.play().catch(() => {});
    }
  }

  function handlePause() {
    setIsPlaying(false);

    const ambience = ambienceRef.current;
    if (ambience) {
      ambience.pause();
    }
  }

  function handleTimelineClick(event) {
    const video = videoRef.current;
    const timeline = timelineRef.current;

    if (!video || !timeline || !duration) {
      return;
    }

    const rect = timeline.getBoundingClientRect();
    const percentage = (event.clientX - rect.left) / rect.width;
    const nextTime = Math.max(0, Math.min(1, percentage)) * duration;
    video.currentTime = nextTime;
    setCurrentTime(nextTime);
  }

  function handleShareOpen() {
    const video = videoRef.current;

    if (video) {
      video.pause();
    }

    setIsShareOpen(true);
  }

  function handleShareSend() {
    setIsShareOpen(false);
  }

  function handleFullscreen() {
    const player = playerContainerRef.current;

    if (!player) {
      return;
    }

    if (player.requestFullscreen) {
      player.requestFullscreen();
    }
  }

  const progressPercent = duration ? (currentTime / duration) * 100 : 0;
  const cuePercent = duration ? (AMBIENT_CUE_SECONDS / duration) * 100 : 0;

  return (
    <div className="scene scene--player">
      <SceneCopyPanel {...scene} />

      <section className="player-stage">
        <div className="player-frame" ref={playerContainerRef}>
          <div className="player-frame__screen">
            <video
              ref={videoRef}
              className="player-frame__video"
              src={scene.asset}
              preload="auto"
              onLoadedMetadata={handleLoadedMetadata}
              onTimeUpdate={handleTimeUpdate}
              onPlay={handlePlay}
              onPause={handlePause}
              onClick={togglePlayPause}
            />

            {activeComment ? (
              <div className="player-frame__comment">
                <span className="player-frame__comment-index">{activeComment.label}</span>
                <span>{activeComment.comment}</span>
              </div>
            ) : null}
          </div>

          <div className="timeline-shell">
            <span className="timeline-shell__label timeline-shell__label--dialogue">Dialogue</span>

            <div
              ref={timelineRef}
              className="timeline"
              onClick={handleTimelineClick}
            >
              <div className="timeline__waveform" aria-hidden="true" />
              <div className="timeline__base" />
              <div className="timeline__progress" style={{ width: `${progressPercent}%` }} />
              <div
                className="timeline__music-bed"
                style={{ left: `${cuePercent}%`, width: `${100 - cuePercent}%` }}
              />

              {playerMarkers.map((marker) => {
                const left = duration ? (marker.time / duration) * 100 : 0;

                return (
                  <div className="timeline__marker-group" style={{ left: `${left}%` }} key={marker.id}>
                    <span className="timeline__marker" />
                    <span className="timeline__marker-label">{marker.label}</span>
                  </div>
                );
              })}
            </div>

            <span className="timeline-shell__label timeline-shell__label--music">Music</span>
          </div>

          <div className="player-controls">
            <button className="player-controls__button player-controls__button--primary" type="button" onClick={togglePlayPause}>
              {isPlaying ? "Pause" : "Play"}
            </button>

            <div className="player-controls__times">
              <span className="player-controls__time player-controls__time--current">
                {formatTime(currentTime)}
              </span>
              <span className="player-controls__time">{formatTime(duration)}</span>
            </div>

            <div className="player-controls__toggles">
              <button
                className={`player-controls__button ${isDialogueMuted ? "is-muted" : ""}`}
                type="button"
                onClick={() => setIsDialogueMuted((current) => !current)}
              >
                Dialogue
              </button>
              <button
                className={`player-controls__button ${isMusicMuted ? "is-muted" : ""}`}
                type="button"
                onClick={() => setIsMusicMuted((current) => !current)}
              >
                Music
              </button>
              <button className="player-controls__button" type="button" onClick={handleShareOpen}>
                Share
              </button>
              <button className="player-controls__button" type="button" onClick={handleFullscreen}>
                Fullscreen
              </button>
            </div>
          </div>
        </div>
      </section>

      {isShareOpen ? (
        <ShareModal onClose={() => setIsShareOpen(false)} onSend={handleShareSend} />
      ) : null}
    </div>
  );
}

function ShareModal({ onClose, onSend }) {
  const [label, setLabel] = useState("InstantSync #153");
  const [note, setNote] = useState("");
  const [selectedTargets, setSelectedTargets] = useState(["Editor"]);

  function handleToggleTarget(target) {
    setSelectedTargets((current) => {
      if (current.includes(target)) {
        return current.filter((item) => item !== target);
      }

      return [...current, target];
    });
  }

  function handleSubmit(event) {
    event.preventDefault();

    onSend({
      label,
      note,
      targets: selectedTargets,
    });
  }

  return (
    <div className="share-modal">
      <button className="share-modal__backdrop" type="button" onClick={onClose} aria-label="Close share modal" />

      <form className="share-modal__panel" onSubmit={handleSubmit}>
        <div className="share-modal__header">
          <div>
            <h3 className="share-modal__title">Share InstantSync</h3>
          </div>

          <button className="share-modal__close" type="button" onClick={onClose}>
            Close
          </button>
        </div>

        <label className="share-modal__field">
          <span>Label</span>
          <input value={label} onChange={(event) => setLabel(event.target.value)} />
        </label>

        <div className="share-modal__targets">
          {shareTargets.map((target) => (
            <label className="share-modal__target" key={target}>
              <input
                type="checkbox"
                checked={selectedTargets.includes(target)}
                onChange={() => handleToggleTarget(target)}
              />
              <span>{target}</span>
            </label>
          ))}
        </div>

        <label className="share-modal__field">
          <span>Creative note</span>
          <textarea
            rows="4"
            value={note}
            onChange={(event) => setNote(event.target.value)}
            placeholder="Message the next pass..."
          />
        </label>

        <div className="share-modal__actions">
          <button className="share-modal__send" type="submit">
            Send InstantSync
          </button>
        </div>
      </form>
    </div>
  );
}
