'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause } from 'lucide-react';
import { MusicDataType } from '../MusicMainContent';

interface MusicControlsProps {
  musicData: MusicDataType | null;
  defaultTempo: number;
}

export default function MusicControls({
  musicData,
  defaultTempo,
}: MusicControlsProps) {
  // 오디오 재생 상태
  const [isPlaying, setIsPlaying] = useState(false);
  const [isAudioLoading, setIsAudioLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // 음악 재생/정지 함수
  const toggleMusic = useCallback(async () => {
    const accompanimentUrl = musicData?.audioFileUrl;

    if (!accompanimentUrl) {
      alert('재생할 음악이 없습니다.');
      return;
    }

    try {
      // 오디오 객체가 없거나 URL이 다르면 새로 생성
      if (!audioRef.current || audioRef.current.src !== accompanimentUrl) {
        // 기존 오디오 정리
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current = null;
        }

        setIsAudioLoading(true);
        audioRef.current = new Audio(accompanimentUrl);

        // 오디오 이벤트 리스너 설정
        audioRef.current.addEventListener('loadeddata', () => {
          setIsAudioLoading(false);
        });

        audioRef.current.addEventListener('ended', () => {
          setIsPlaying(false);
        });

        audioRef.current.addEventListener('error', () => {
          setIsAudioLoading(false);
          setIsPlaying(false);
          alert('음악을 불러올 수 없습니다.');
        });
      }

      if (isPlaying) {
        // 재생 중이면 정지
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        // 정지 중이면 재생
        await audioRef.current.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Audio playback error:', error);
      setIsPlaying(false);
      setIsAudioLoading(false);
      alert('음악 재생 중 오류가 발생했습니다.');
    }
  }, [musicData, isPlaying]);

  // 컴포넌트 언마운트 시 오디오 정리
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // 악보 데이터가 변경될 때 오디오 정지
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }, [musicData?.musicalKey]);

  return (
    <div className="flex justify-center items-center gap-4 border-t py-3 bg-purple-100 rounded-b-lg">
      {/* 재생/정지 버튼 */}
      <button
        data-id={musicData?.musicalKey}
        className={`flex items-center justify-center w-12 h-8 rounded cursor-pointer transition-all duration-200 ${
          isAudioLoading
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-purple-600 hover:bg-purple-700'
        } text-white`}
        onClick={toggleMusic}
        disabled={isAudioLoading || !musicData?.audioFileUrl}
      >
        {isAudioLoading ? (
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : isPlaying ? (
          <Pause className="w-4 h-4" />
        ) : (
          <Play className="w-4 h-4" />
        )}
      </button>

      {/* 템포 버튼 */}
      <Button
        onClick={() => alert('서비스 준비중입니다.')}
        className="cursor-pointer"
      >
        템포: {musicData?.musicalKey || defaultTempo}
      </Button>

      {/* 메트로놈 버튼 */}
      <Button
        className="px-4 py-2 border rounded cursor-pointer hover:bg-gray-50"
        onClick={() => alert('서비스 준비중입니다.')}
      >
        메트로놈
      </Button>
    </div>
  );
}
