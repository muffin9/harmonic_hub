import React, { useRef, useState } from 'react';
import { Button } from '../ui/button';
import { motion, AnimatePresence } from 'framer-motion';

export function Mp3Player() {
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null); // 추가

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    setError(null);
    const file = e.target.files?.[0];
    if (!file) return;
    if (
      !file.type.startsWith('audio/mp3') &&
      !file.type.startsWith('audio/mpeg')
    ) {
      setError('MP3 파일만 업로드할 수 있습니다.');
      return;
    }
    const url = URL.createObjectURL(file);
    setAudioUrl(url);
    setFileName(file.name);
    setIsPlaying(false);
    setPlaybackRate(1);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }

  function handlePlayPause() {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  }

  function handleRateChange(e: React.ChangeEvent<HTMLInputElement>) {
    const rate = parseFloat(e.target.value);
    setPlaybackRate(rate);
    if (audioRef.current) {
      audioRef.current.playbackRate = rate;
    }
  }

  function handleReset() {
    setAudioUrl(null);
    setFileName(null);
    setIsPlaying(false);
    setPlaybackRate(1);
    setError(null);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; // 파일 input 초기화
    }
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-2xl mx-auto bg-white/90 rounded-2xl shadow-2xl border border-gray-100 px-8 py-10 flex flex-col items-center gap-8"
    >
      <div className="w-full flex flex-col items-center gap-2">
        <h2 className="text-2xl font-bold text-gray-800 mb-1 tracking-tight">
          MP3 파일 플레이어
        </h2>
        <p className="text-gray-500 text-sm mb-2">
          MP3 파일을 업로드하면 재생 및 템포 조절이 가능합니다.
        </p>
        <label
          htmlFor="mp3-upload"
          className="block text-gray-700 font-medium mb-1"
        >
          MP3 파일 선택
        </label>
        <input
          id="mp3-upload"
          type="file"
          accept=".mp3,audio/mp3,audio/mpeg"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-600
            file:mr-4 file:py-2 file:px-4
            file:rounded-lg file:border-0
            file:text-sm file:font-semibold
            file:bg-green-50 file:text-green-700
            hover:file:bg-green-100
            transition"
          disabled={isPlaying}
          ref={fileInputRef} // ref 연결
        />
        <Button
          type="button"
          variant="outline"
          className="mt-3 w-full max-w-[120px] cursor-pointer"
          onClick={handleReset}
          disabled={!audioUrl}
        >
          초기화
        </Button>
      </div>
      <AnimatePresence>
        {error && (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="text-red-500 font-medium"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>
      {audioUrl && (
        <div className="w-full flex flex-col items-center gap-6">
          <div className="flex items-center gap-3">
            <Button
              type="button"
              onClick={handlePlayPause}
              variant="default"
              className="px-6 py-2 text-base"
            >
              {isPlaying ? '일시정지' : '재생'}
            </Button>
            <span className="text-gray-700 text-base font-medium truncate max-w-[180px]">
              {fileName}
            </span>
          </div>
          <div className="flex flex-col items-center gap-2 w-full">
            <label
              htmlFor="tempo-slider"
              className="text-gray-700 text-sm mb-1"
            >
              템포 (재생 속도):{' '}
              <span className="font-semibold">{playbackRate.toFixed(2)}x</span>
            </label>
            <input
              id="tempo-slider"
              type="range"
              min="0.5"
              max="2"
              step="0.01"
              value={playbackRate}
              onChange={handleRateChange}
              className="w-full accent-green-600"
              disabled={!audioUrl}
            />
            <div className="flex justify-between w-full text-xs text-gray-400 px-1">
              <span>0.5x</span>
              <span>1.0x</span>
              <span>2.0x</span>
            </div>
          </div>
          <audio
            ref={audioRef}
            src={audioUrl}
            onEnded={() => setIsPlaying(false)}
            onPause={() => setIsPlaying(false)}
            onPlay={() => setIsPlaying(true)}
            controls={false}
            style={{ display: 'none' }}
          />
        </div>
      )}
    </motion.section>
  );
}
