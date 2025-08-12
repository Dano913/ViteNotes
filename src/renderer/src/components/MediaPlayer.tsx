import React, { useState, useRef, useEffect, ChangeEvent } from 'react';
import { Play, Pause, SkipBack, SkipForward, Upload } from 'lucide-react';

interface MediaPlayerProps {
  audioFile?: File;
}

export default function MediaPlayer({ audioFile }: MediaPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isVideo, setIsVideo] = useState(false);
  const mediaRef = useRef<HTMLVideoElement | HTMLAudioElement>(null);
  const [mediaUrl, setMediaUrl] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    if (audioFile) {
      const url = URL.createObjectURL(audioFile);
      setMediaUrl(url);
      setIsVideo(audioFile.type.startsWith('video/'));
      return () => URL.revokeObjectURL(url);
    }
  }, [audioFile]);

  const handleLoadedMetadata = () => {
    if (mediaRef.current) {
      setDuration(mediaRef.current.duration);
    }
  };

  const handleTimeUpdate = () => {
    if (mediaRef.current) {
      setCurrentTime(mediaRef.current.currentTime);
    }
  };

  const togglePlay = () => {
    if (mediaRef.current) {
      if (isPlaying) {
        mediaRef.current.pause();
      } else {
        mediaRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleProgress = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (mediaRef.current) {
      const time = Number(e.target.value);
      mediaRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setMediaUrl(url);
      setIsVideo(file.type.startsWith('video/'));
    }
  };

  return (
    <div className=" h-12 flex text-[var(--text-color)] h-6 justify-end">
      {isVideo ? (
        <video
          ref={mediaRef as React.RefObject<HTMLVideoElement>}
          src={mediaUrl}
          className="w-full rounded-lg"
          onLoadedMetadata={handleLoadedMetadata}
          onTimeUpdate={handleTimeUpdate}
          onEnded={() => setIsPlaying(false)}
        />
      ) : (
        <audio
          ref={mediaRef as React.RefObject<HTMLAudioElement>}
          src={mediaUrl}
          onLoadedMetadata={handleLoadedMetadata}
          onTimeUpdate={handleTimeUpdate}
          onEnded={() => setIsPlaying(false)}
        />
      )}
      
      {/* Track Info */}
      <div className="items-center text-center flex">
        <label
          htmlFor="media-upload"
          className="flex flex-col items-center justify-center w-8 h-6 rounded-md cursor-pointer transition-colors hover:text-cyan-400"
        >
          <Upload className="w-4 h-4" />
          <input
            id="media-upload"
            type="file"
            accept="audio/*,video/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </label>
        <div className="w-[145px]">
          <h2 className=" items-center text-md w-full flex font-semibold overflow-hidden whitespace-nowrap text-ellipsis">
            {selectedFile?.name || audioFile?.name || 'No file selected'}
          </h2>
          </div>
      </div>

      {/* Progress Bar */}
      <div className="flex w-[150px] px-2 items-center gap-x-2 text-[var(--text-color)]">
        <input
          type="range"
          value={currentTime}
          min={0}
          max={duration}
          onChange={handleProgress}
          className="w-full h-1 rounded-lg appearance-none cursor-pointer accent-[var(--terciary-bg-color)] bg-[var(--secondary-bg-color)]"
        />
        <div className="flex justify-between text-sm font-semibold">
          <span>{formatTime(currentTime)}</span>
          <span className="px-3">-</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-1">
        <button
          className="p-1 hover:text-cyan-400 transition-colors"
          onClick={() => {
            if (mediaRef.current) mediaRef.current.currentTime -= 10;
          }}
        >
          <SkipBack className="w-3 h-3 text-[var(--text-color)] text-lg font-bold" />
        </button>

        <button
          className="p-1 hover:text-cyan-400 transition-colors"
          onClick={togglePlay}
        >
          {isPlaying ? (
            <Pause className="w-4 h-4 text-[var(--text-color)] text-lg font-bold" />
          ) : (
            <Play className="w-4 h-4 text-[var(--text-color)] text-lg font-bold" />
          )}
        </button>

        <button
          className="p-1 hover:text-cyan-400 transition-colors"
          onClick={() => {
            if (mediaRef.current) mediaRef.current.currentTime += 10;
          }}
        >
          <SkipForward className="w-3 h-3 text-[var(--text-color)] text-lg font-bold" />
        </button>
      </div>
    </div>
  );
}