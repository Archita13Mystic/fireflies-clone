import React, { useEffect, useState } from "react";
import { Play, Pause } from "lucide-react";
import { formatTimestamp } from "../../lib/utils";

interface AudioPlayerProps {
  currentTime: number;
  duration: number;
  onTimeUpdate: (time: number) => void;
}

export default function AudioPlayer({
  currentTime,
  duration,
  onTimeUpdate,
}: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isPlaying) {
      interval = setInterval(() => {
        onTimeUpdate(Math.min(currentTime + 0.5, duration));
      }, 500);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isPlaying, currentTime, duration, onTimeUpdate]);

  // Pause automatically if we reach the end
  useEffect(() => {
    if (currentTime >= duration && isPlaying) {
      setIsPlaying(false);
    }
  }, [currentTime, duration, isPlaying]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    onTimeUpdate(newTime);
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="bg-[#16161e] border-t border-[#2a2a3a] px-6 py-4 flex items-center justify-between gap-4 select-none">
      {/* Play/Pause Button */}
      <button
        onClick={togglePlay}
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors ${
          isPlaying
            ? "bg-[#7c5cfc] hover:bg-[#6c4cf2] text-white"
            : "bg-[#2a2a3a] hover:bg-[#35354a] text-white"
        }`}
        aria-label={isPlaying ? "Pause" : "Play"}
      >
        {isPlaying ? (
          <Pause size={18} fill="currentColor" />
        ) : (
          <Play size={18} className="ml-0.5" fill="currentColor" />
        )}
      </button>

      {/* Time and Seek slider */}
      <div className="flex-1 flex items-center gap-3">
        <span className="font-mono text-xs text-[#9090a0] min-w-[38px] text-right">
          {formatTimestamp(currentTime)}
        </span>

        {/* Seek track bar wrapper */}
        <div className="flex-1 relative flex items-center h-4 group">
          <input
            type="range"
            min={0}
            max={duration || 100}
            step={0.1}
            value={currentTime}
            onChange={handleSeekChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          />
          {/* Custom Track representation */}
          <div className="w-full h-1.5 rounded bg-[#2a2a3a] overflow-hidden relative">
            <div
              style={{ width: `${progressPercent}%` }}
              className="absolute left-0 top-0 bottom-0 bg-[#7c5cfc] group-hover:bg-[#6c4cf2] transition-colors"
            />
          </div>
        </div>

        <span className="font-mono text-xs text-[#9090a0] min-w-[38px]">
          {formatTimestamp(duration)}
        </span>
      </div>
    </div>
  );
}
