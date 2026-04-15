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
  const waveformRef = useRef(null);
  const commentTimeoutRef = useRef(null);
  const introTimeoutRef = useRef(null);
  const cueTriggeredRef = useRef(false);
  const commentTriggeredRef = useRef(new Set());

  const [duration, setDuration] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [showInfoBox, setShowInfoBox] = useState(false);
  const [showPlayerChrome, setShowPlayerChrome] = useState(false);
  const [hoverBubble, setHoverBubble] = useState({
    visible: false,
    x: 0,
    y: 0,
    time: 0,
  });
  const [activeComment, setActiveComment] = useState(null);
  const [isMusicMuted, setIsMusicMuted] = useState(false);
  const [isDialogueMuted, setIsDialogueMuted] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);

  useEffect(() => {
    const riverSong = new Audio("/assets/riversong3.flac");
    riverSong.volume = 0.4;
    riverSong.preload = "auto";
    ambienceRef.current = riverSong;

    return () => {
      riverSong.pause();
      ambienceRef.current = null;
    };
  }, []);

  useEffect(() => {
    introTimeoutRef.current = window.setTimeout(() => {
      setShowInfoBox(true);
      setShowPlayerChrome(true);
    }, 2000);

    return () => {
      if (introTimeoutRef.current) {
        window.clearTimeout(introTimeoutRef.current);
      }
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
    const riverSong = ambienceRef.current;
    const video = videoRef.current;

    if (!riverSong || !video) {
      return;
    }

    riverSong.muted = isMusicMuted;

    if (isMusicMuted) {
      riverSong.pause();
      return;
    }

    if (!video.paused && cueTriggeredRef.current) {
      riverSong.play().catch(() => {});
    }
  }, [isMusicMuted]);

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
  }, [isActive, isShareOpen]);

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

    if (introTimeoutRef.current) {
      window.clearTimeout(introTimeoutRef.current);
    }

    setShowInfoBox(false);

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

    setDuration(video.duration || 1);
  }

  function handlePause() {
    const riverSong = ambienceRef.current;
    if (riverSong) {
      riverSong.pause();
    }
  }

  function handlePlay() {
    const video = videoRef.current;
    const riverSong = ambienceRef.current;

    if (!video || !riverSong || isMusicMuted) {
      return;
    }

    if (video.currentTime >= AMBIENT_CUE_SECONDS) {
      cueTriggeredRef.current = true;
      riverSong.play().catch(() => {});
    }
  }

  function triggerComment(marker, index) {
    setActiveComment({
      id: marker.id,
      text: `#${index + 1} <br> ${marker.comment}`,
    });

    if (commentTimeoutRef.current) {
      window.clearTimeout(commentTimeoutRef.current);
    }

    commentTimeoutRef.current = window.setTimeout(() => {
      setActiveComment(null);
    }, 5000);
  }

  function handleTimeUpdate() {
    const video = videoRef.current;
    const riverSong = ambienceRef.current;

    if (!video) {
      return;
    }

    const nextTime = video.currentTime;
    setCurrentTime(nextTime);

    if (nextTime < AMBIENT_CUE_SECONDS - 1) {
      cueTriggeredRef.current = false;
      if (riverSong) {
        riverSong.pause();
        riverSong.currentTime = 0;
      }
    }

    if (!cueTriggeredRef.current && nextTime >= AMBIENT_CUE_SECONDS) {
      cueTriggeredRef.current = true;
      if (riverSong && !isMusicMuted) {
        riverSong.currentTime = 0;
        riverSong.play().catch(() => {});
      }
    }

    playerMarkers.forEach((marker, index) => {
      if (nextTime < marker.time - 2) {
        commentTriggeredRef.current.delete(marker.id);
      }

      if (
        Math.abs(nextTime - marker.time) < 0.5 &&
        !commentTriggeredRef.current.has(marker.id)
      ) {
        commentTriggeredRef.current.add(marker.id);
        triggerComment(marker, index);
      }
    });
  }

  function handleProgressSeek(clientX) {
    const video = videoRef.current;
    const waveform = waveformRef.current;

    if (!video || !waveform || Number.isNaN(video.duration)) {
      return;
    }

    const rect = waveform.getBoundingClientRect();
    const clickedPercentage = (clientX - rect.left) / rect.width;
    const nextTime = Math.max(0, Math.min(1, clickedPercentage)) * video.duration;
    video.currentTime = nextTime;
    setCurrentTime(nextTime);
  }

  function handleWaveformMove(event) {
    const waveform = waveformRef.current;

    if (!waveform || !duration) {
      return;
    }

    const rect = waveform.getBoundingClientRect();
    const hoveredPercentage = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
    const hoveredTime = hoveredPercentage * duration;

    if (hoveredTime < 0) {
      setHoverBubble((current) => ({ ...current, visible: false }));
      return;
    }

    setHoverBubble({
      visible: true,
      x: event.clientX,
      y: event.clientY - 30,
      time: hoveredTime,
    });
  }

  function handleShareOpen() {
    const video = videoRef.current;
    if (video) {
      video.pause();
    }

    setIsShareOpen(true);
  }

  function handleFullscreen() {
    const video = videoRef.current;
    if (!video) {
      return;
    }

    if (video.requestFullscreen) {
      video.requestFullscreen();
    } else if (video.webkitRequestFullscreen) {
      video.webkitRequestFullscreen();
    }
  }

  const cuePercent = duration ? (AMBIENT_CUE_SECONDS / duration) * 100 : 0;

  return (
    <div className="content-container">
      <SceneCopyPanel section={scene.section} detailsHtml={scene.detailsHtml} />

      <div className="video-container">
        <video
          ref={videoRef}
          className="content-video"
          src={scene.mediaSrc}
          preload="auto"
          onLoadedMetadata={handleLoadedMetadata}
          onTimeUpdate={handleTimeUpdate}
          onPlay={handlePlay}
          onPause={handlePause}
          onClick={togglePlayPause}
        />

        {showInfoBox ? (
          <div className="info-text-box is-visible">
            <span>click video / spacebar </span>
            <span className="material-symbols-rounded info-text-box__icon">play_arrow</span>
            <span className="material-symbols-rounded info-text-box__icon">pause</span>
            <br />
            <span>&amp; timeline to locate</span>
          </div>
        ) : null}

        {activeComment ? (
          <div
            className="info-text-box info-text-box--comment is-visible"
            dangerouslySetInnerHTML={{ __html: activeComment.text }}
          />
        ) : null}

        <div
          ref={waveformRef}
          className={`waveform-progress-container ${showPlayerChrome ? "is-visible" : ""}`}
          onClick={(event) => handleProgressSeek(event.clientX)}
          onMouseMove={handleWaveformMove}
          onMouseOver={() =>
            setHoverBubble((current) => ({
              ...current,
              visible: true,
            }))
          }
          onMouseOut={() =>
            setHoverBubble((current) => ({
              ...current,
              visible: false,
            }))
          }
        >
          <img className="waveform-image" src="/assets/waveform.png" alt="" />
          <div className="progress-bar">
            <div className="progress" style={{ width: `${(currentTime / duration) * 100}%` }} />
          </div>
          <img
            className="musicwave-image"
            src="/assets/musicwave2.png"
            alt=""
            style={{
              left: `${cuePercent}%`,
              width: `${100 - cuePercent}%`,
            }}
          />

          <div
            className="vertical-text"
            onClick={(event) => {
              event.stopPropagation();
              setIsDialogueMuted((current) => !current);
            }}
            style={{ color: isDialogueMuted ? "#777" : "#93C572" }}
          >
            DIALOGUE
          </div>

          <div
            className="vertical-text-music"
            onClick={(event) => {
              event.stopPropagation();
              setIsMusicMuted((current) => !current);
            }}
            style={{ color: isMusicMuted ? "#777" : "#93C572" }}
          >
            MUSIC
          </div>

          {playerMarkers.map((marker) => {
            const markerPosition = duration ? (marker.time / duration) * 100 : 0;

            return (
              <div key={marker.id}>
                <div className="marker" style={{ left: `${markerPosition}%` }} />
                <div className="marker-number" style={{ left: `calc(${markerPosition}% + 4px)` }}>
                  {marker.label}
                </div>
              </div>
            );
          })}
        </div>

        <div className="control-buttons">
          <span className="material-symbols-rounded play-pause">play_arrow</span>
          <span className={`current-time ${showPlayerChrome ? "is-visible" : ""}`}>
            {formatTime(currentTime)}
          </span>
          <span className={`total-time ${showPlayerChrome ? "is-visible" : ""}`}>
            {formatTime(duration)}
          </span>
          <button type="button" className="material-symbols-rounded add-icon" onClick={handleShareOpen}>
            share
          </button>
          <button
            type="button"
            className="material-symbols-rounded volume"
            onClick={() => setIsDialogueMuted((current) => !current)}
          >
            {isDialogueMuted ? "volume_off" : "volume_up"}
          </button>
          <button
            type="button"
            className="material-symbols-rounded fullscreen"
            onClick={handleFullscreen}
          >
            fullscreen
          </button>
        </div>

        {hoverBubble.visible ? (
          <div
            className="time-bubble"
            style={{
              display: "block",
              left: `${hoverBubble.x}px`,
              top: `${hoverBubble.y}px`,
            }}
          >
            {formatTime(hoverBubble.time)}
          </div>
        ) : null}

        {isShareOpen ? <ShareBox onClose={() => setIsShareOpen(false)} /> : null}
      </div>
    </div>
  );
}

function ShareBox({ onClose }) {
  const [label, setLabel] = useState("");
  const [message, setMessage] = useState("");
  const [selectedTargets, setSelectedTargets] = useState([]);

  function toggleTarget(targetId) {
    setSelectedTargets((current) =>
      current.includes(targetId)
        ? current.filter((item) => item !== targetId)
        : [...current, targetId],
    );
  }

  function handleSend() {
    onClose({
      label,
      message,
      selectedTargets,
    });
  }

  return (
    <div className="demo-share-box">
      <p>
        <strong>#153</strong>
        <input
          id="label-input"
          value={label}
          onChange={(event) => setLabel(event.target.value)}
          placeholder="label instant sync..."
        />
      </p>

      <div className="checklist">
        {shareTargets.map((target) => (
          <div className="check-item" key={target.id}>
            <label htmlFor={target.id}>{target.label}</label>
            <input
              id={target.id}
              type="checkbox"
              checked={selectedTargets.includes(target.id)}
              onChange={() => toggleTarget(target.id)}
            />
          </div>
        ))}
      </div>

      <div className="share-row">
        <textarea
          id="creative-message"
          rows="3"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder="message . . ."
        />
        <button
          id="share-instant-sync"
          type="button"
          className="material-symbols-rounded"
          onClick={handleSend}
        >
          send
        </button>
      </div>
    </div>
  );
}
