'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, RotateCw, Volume2, VolumeX } from 'lucide-react';

interface AudioPlayerProps {
  audioUrl?: string;
  currentTime: number;
  duration: number;
  isPlaying: boolean;
  onPlayPause: () => void;
  onSeek: (time: number) => void;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  audioUrl = '/samples/sample-meeting.mp3',
  currentTime,
  duration,
  isPlaying,
  onPlayPause,
  onSeek,
}) => {
  const [speed, setSpeed] = useState<number>(1);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioRef.current) {
      if (Math.abs(audioRef.current.currentTime - currentTime) > 0.5) {
        audioRef.current.currentTime = currentTime;
      }
    }
  }, [currentTime]);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(() => {});
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = speed;
    }
  }, [speed]);

  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds < 0) return '00:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      onSeek(audioRef.current.currentTime);
    }
  };

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    onSeek(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const handleSkip = (seconds: number) => {
    const newTime = Math.max(0, Math.min(duration, currentTime + seconds));
    onSeek(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const speeds = [1, 1.25, 1.5, 2];
  const cycleSpeed = () => {
    const nextIdx = (speeds.indexOf(speed) + 1) % speeds.length;
    setSpeed(speeds[nextIdx]);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
      <audio
        ref={audioRef}
        src={audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => onPlayPause()}
        preload="metadata"
      />

      {/* Audio Waveform Bars */}
      <div
        className="flex items-center gap-[3px] h-8 mb-3 px-1 cursor-pointer"
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const clickX = e.clientX - rect.left;
          const pct = clickX / rect.width;
          onSeek(pct * (duration || 1));
        }}
      >
        {Array.from({ length: 48 }).map((_, i) => {
          const height = Math.min(100, Math.max(20, Math.sin(i * 0.4) * 40 + Math.cos(i * 0.7) * 30 + 50));
          const progressPct = (currentTime / (duration || 1)) * 100;
          const isPassed = (i / 48) * 100 <= progressPct;
          return (
            <div
              key={i}
              className={`flex-1 rounded-full transition-all ${
                isPassed ? 'bg-purple-600' : 'bg-slate-200'
              }`}
              style={{ height: `${height}%` }}
            />
          );
        })}
      </div>

      {/* Seekbar */}
      <div className="flex items-center gap-3 mb-3">
        <span className="text-xs font-mono text-purple-700 font-semibold w-10">
          {formatTime(currentTime)}
        </span>

        <input
          type="range"
          min="0"
          max={duration || 100}
          value={currentTime || 0}
          onChange={handleSeekChange}
          className="flex-1 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-600 focus:outline-none"
        />

        <span className="text-xs font-mono text-slate-500 w-10 text-right">
          {formatTime(duration)}
        </span>
      </div>

      {/* Controls Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleSkip(-10)}
            className="p-1.5 text-slate-500 hover:text-slate-800 transition-colors"
            title="Rewind 10s"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={onPlayPause}
            className="w-10 h-10 rounded-xl bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center shadow-md transition-transform active:scale-95"
          >
            {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current translate-x-0.5" />}
          </button>

          <button
            onClick={() => handleSkip(10)}
            className="p-1.5 text-slate-500 hover:text-slate-800 transition-colors"
            title="Forward 10s"
          >
            <RotateCw className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={cycleSpeed}
            className="px-2 py-1 rounded-lg bg-slate-100 border border-slate-200 text-xs font-mono font-semibold text-purple-700 hover:bg-purple-50 transition-all"
            title="Playback Speed"
          >
            {speed}x
          </button>

          <button
            onClick={() => setIsMuted(!isMuted)}
            className="text-slate-500 hover:text-slate-800 p-1"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-500" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};
