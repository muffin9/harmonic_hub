'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import {
  Play,
  Pause,
  Square,
  Music,
  Volume2,
  VolumeX,
  Volume1,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';
import { MusicDataType } from '../MusicMainContent';
import { useUserStore } from '@/stores/user-store';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import LoginForm from '../LoginForm';

interface MusicControlsProps {
  musicData: MusicDataType | null;
  defaultTempo: number;
  isLoggedIn: boolean; // 이 prop은 호환성을 위해 유지하지만 실제로는 사용하지 않음
}

export default function MusicControls({
  musicData,
  defaultTempo,
  isLoggedIn: _isLoggedIn, // 사용하지 않는 prop을 언더스코어로 표시
}: MusicControlsProps) {
  // Zustand 스토어에서 실제 로그인 상태 가져오기

  const { isAuthenticated, loadUser } = useUserStore();
  // 오디오 재생 상태
  const [isPlaying, setIsPlaying] = useState(false);
  const [isAudioLoading, setIsAudioLoading] = useState(false);
  const [isMelodyOn, setIsMelodyOn] = useState(true);
  const [currentTempo, setCurrentTempo] = useState(defaultTempo);
  const [isMetronomeOn, setIsMetronomeOn] = useState(false);
  const [showMetronomePopup, setShowMetronomePopup] = useState(false);
  const [showTempoPopup, setShowTempoPopup] = useState(false);
  const [metronomeBPM, setMetronomeBPM] = useState(120);
  const [tempBPM, setTempBPM] = useState(120);
  const [isTrialMode, setIsTrialMode] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [dialogContent, setDialogContent] = useState({
    title: '',
    description: '',
  });
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [tempoInputValue, setTempoInputValue] = useState(
    defaultTempo.toString(),
  );
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const melodyAudioRef = useRef<HTMLAudioElement | null>(null);
  const metronomeIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const metronomeAudioContextRef = useRef<AudioContext | null>(null);
  const metronomeNextBeatTimeRef = useRef<number>(0);
  const metronomeSchedulerRef = useRef<number | null>(null);
  const trialTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 로그인 상태 확인
  useEffect(() => {
    loadUser();
  }, [loadUser]);

  // defaultTempo가 변경될 때 tempoInputValue도 업데이트
  useEffect(() => {
    setTempoInputValue(defaultTempo.toString());
    setCurrentTempo(defaultTempo);
  }, [defaultTempo]);

  // Dialog 표시 함수
  const showDialogMessage = useCallback(
    (title: string, description: string) => {
      setDialogContent({ title, description });
      setShowDialog(true);
    },
    [],
  );

  // Dialog 닫기 함수
  const closeDialog = useCallback(() => {
    setShowDialog(false);
  }, []);

  // 템포 입력 필드 포커스 아웃 처리
  const handleTempoInputBlur = useCallback(() => {
    const value = parseInt(tempoInputValue);

    // 유효하지 않은 값이면 현재 템포로 되돌리기
    if (isNaN(value)) {
      setTempoInputValue(currentTempo.toString());
    } else {
      // 유효한 값이지만 범위를 벗어나면 제한된 값으로 설정
      const clampedValue = Math.min(Math.max(value, 0), 400);
      if (value !== clampedValue) {
        setTempoInputValue(clampedValue.toString());
        setCurrentTempo(clampedValue);
        const tempoRatio = clampedValue / defaultTempo;

        if (audioRef.current) {
          audioRef.current.playbackRate = tempoRatio;
        }
        if (melodyAudioRef.current) {
          melodyAudioRef.current.playbackRate = tempoRatio;
        }
      }
    }
  }, [tempoInputValue, currentTempo, defaultTempo]);

  // 음악 재생/정지 함수
  const toggleMusic = useCallback(async () => {
    const audioUrl = musicData?.audioFileUrl;
    const melodyUrl = musicData?.melodyFileUrl;

    if (!audioUrl && !melodyUrl) {
      showDialogMessage('알림', '재생할 음악이 없습니다.');
      return;
    }

    // 멜로디음원만 있고 반주음원이 없는 경우
    if (!audioUrl && melodyUrl) {
      showDialogMessage(
        '알림',
        '반주음원이 없습니다. 멜로디음원만 재생됩니다.',
      );
    }

    // 로그인하지 않은 경우 체험 모드 안내
    if (!isAuthenticated && !isTrialMode) {
      setIsTrialMode(true);
    }

    try {
      // 오디오가 이미 로드되어 있는지 확인
      const isAudioAlreadyLoaded =
        audioRef.current && audioRef.current.readyState >= 2;
      const isMelodyAlreadyLoaded =
        melodyAudioRef.current && melodyAudioRef.current.readyState >= 2;

      // 오디오가 로드되지 않은 경우에만 로딩 상태 설정
      if (!isAudioAlreadyLoaded || !isMelodyAlreadyLoaded) {
        setIsAudioLoading(true);
      }

      // 반주 오디오 설정
      if (audioUrl) {
        if (!audioRef.current || audioRef.current.src !== audioUrl) {
          if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current = null;
          }
          audioRef.current = new Audio(audioUrl);
          audioRef.current.volume = 0.5; // -14LUFS에 맞춰 볼륨 조정 (반주)
        }
      }

      // 멜로디 오디오 설정
      if (melodyUrl) {
        if (
          !melodyAudioRef.current ||
          melodyAudioRef.current.src !== melodyUrl
        ) {
          if (melodyAudioRef.current) {
            melodyAudioRef.current.pause();
            melodyAudioRef.current = null;
          }
          melodyAudioRef.current = new Audio(melodyUrl);
          melodyAudioRef.current.volume = isMelodyOn ? 0.5 : 0.0; // -14LUFS에 맞춰 볼륨 조정 (멜로디)
        }
      }

      // 오디오 이벤트 리스너 설정
      const setupAudioListeners = (
        audio: HTMLAudioElement,
        isMelody = false,
      ) => {
        const handleLoadedData = () => {
          setIsAudioLoading(false);
        };

        const handleEnded = () => {
          setIsPlaying(false);
        };

        const handleError = () => {
          setIsAudioLoading(false);
          setIsPlaying(false);
          showDialogMessage(
            '오류',
            `${isMelody ? '멜로디' : '반주'} 음악을 불러올 수 없습니다.`,
          );
        };

        audio.addEventListener('loadeddata', handleLoadedData);
        audio.addEventListener('ended', handleEnded);
        audio.addEventListener('error', handleError);
      };

      // 오디오 로딩 상태 확인 및 이벤트 리스너 설정
      let allAudioReady = true;

      if (audioRef.current) {
        setupAudioListeners(audioRef.current, false);
        // 오디오가 이미 로드된 상태인지 확인
        if (audioRef.current.readyState >= 2) {
          // HAVE_CURRENT_DATA
          // 이미 로드된 경우
        } else {
          allAudioReady = false;
        }
      }

      if (melodyAudioRef.current) {
        setupAudioListeners(melodyAudioRef.current, true);
        // 오디오가 이미 로드된 상태인지 확인
        if (melodyAudioRef.current.readyState >= 2) {
          // HAVE_CURRENT_DATA
          // 이미 로드된 경우
        } else {
          allAudioReady = false;
        }
      }

      // 모든 오디오가 이미 로드된 경우 로딩 상태 해제
      if (allAudioReady) {
        setIsAudioLoading(false);
      }

      if (isPlaying) {
        // 재생 중이면 일시정지
        if (audioRef.current) audioRef.current.pause();
        if (melodyAudioRef.current) melodyAudioRef.current.pause();
        setIsPlaying(false);
        setIsAudioLoading(false);
        return; // 일시정지 후 함수 종료
      } else {
        // 정지 중이면 재생
        const playPromises = [];
        if (audioRef.current) {
          playPromises.push(audioRef.current.play());
        }
        if (melodyAudioRef.current) {
          playPromises.push(melodyAudioRef.current.play());
        }

        await Promise.all(playPromises);
        setIsPlaying(true);

        // 로그인하지 않은 경우 20초 후 자동 정지 및 로그인 다이얼로그 표시
        if (!isAuthenticated) {
          trialTimeoutRef.current = setTimeout(() => {
            if (audioRef.current) {
              audioRef.current.pause();
              audioRef.current.currentTime = 0;
            }
            if (melodyAudioRef.current) {
              melodyAudioRef.current.pause();
              melodyAudioRef.current.currentTime = 0;
            }
            setIsPlaying(false);
            setIsTrialMode(false);
            setShowLoginDialog(true);

            // 체험 모드 타이머 정리
            if (trialTimeoutRef.current) {
              clearTimeout(trialTimeoutRef.current);
              trialTimeoutRef.current = null;
            }
          }, 20000);
        }
      }
    } catch (error) {
      console.error('Audio playback error:', error);
      setIsPlaying(false);
      setIsAudioLoading(false);
      showDialogMessage('오류', '음악 재생 중 오류가 발생했습니다.');
    }
  }, [
    musicData,
    isPlaying,
    isMelodyOn,
    isAuthenticated,
    isTrialMode,
    showDialogMessage,
  ]);

  // 정지 함수
  const stopMusic = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    if (melodyAudioRef.current) {
      melodyAudioRef.current.pause();
      melodyAudioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
    setIsAudioLoading(false); // 정지 시 로딩 상태도 해제

    // 체험 모드 타이머 정리
    if (trialTimeoutRef.current) {
      clearTimeout(trialTimeoutRef.current);
      trialTimeoutRef.current = null;
    }

    // 로그인하지 않은 경우 체험 모드 리셋 (다시 재생 가능하도록)
    if (!isAuthenticated) {
      setIsTrialMode(false);
    }
  }, [isAuthenticated]);

  // 멜로디 토글 함수
  const toggleMelody = useCallback(() => {
    setIsMelodyOn((prev) => {
      const newState = !prev;
      // 멜로디 오디오의 볼륨 조절
      if (melodyAudioRef.current) {
        melodyAudioRef.current.volume = newState ? 0.5 : 0.0; // -14LUFS에 맞춰 볼륨 조정
      }
      return newState;
    });
  }, []);

  // 템포 팝업 토글 함수
  const toggleTempoPopup = useCallback(() => {
    setShowTempoPopup((prev) => !prev);
  }, []);

  // 템포 슬라이더 변경 함수
  const handleTempoSliderChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newTempo = parseInt(e.target.value);
      setCurrentTempo(newTempo);
      setTempoInputValue(newTempo.toString());
      const tempoRatio = newTempo / defaultTempo;

      if (audioRef.current) {
        audioRef.current.playbackRate = tempoRatio;
      }
      if (melodyAudioRef.current) {
        melodyAudioRef.current.playbackRate = tempoRatio;
      }
    },
    [defaultTempo],
  );

  // 템포 숫자 입력 변경 함수
  const handleTempoInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;

      // 빈 값이면 현재 템포 유지
      if (inputValue === '') {
        setTempoInputValue(inputValue);
        return;
      }

      const value = parseInt(inputValue);

      // 유효한 숫자인 경우
      if (!isNaN(value)) {
        // 400 이상이면 400으로 제한
        const clampedValue = Math.min(value, 400);
        // 0 미만이면 0으로 제한
        const finalValue = Math.max(clampedValue, 0);

        // 입력 값이 제한된 값과 다르면 제한된 값으로 업데이트
        if (value !== finalValue) {
          setTempoInputValue(finalValue.toString());
        } else {
          setTempoInputValue(inputValue);
        }

        setCurrentTempo(finalValue);
        const tempoRatio = finalValue / defaultTempo;

        if (audioRef.current) {
          audioRef.current.playbackRate = tempoRatio;
        }
        if (melodyAudioRef.current) {
          melodyAudioRef.current.playbackRate = tempoRatio;
        }
      } else {
        // 유효하지 않은 숫자면 입력 값만 업데이트 (사용자가 입력 중일 수 있음)
        setTempoInputValue(inputValue);
      }
    },
    [defaultTempo],
  );

  // 템포 증가 함수
  const increaseTempo = useCallback(() => {
    if (currentTempo < 400) {
      const newTempo = currentTempo + 1;
      setCurrentTempo(newTempo);
      setTempoInputValue(newTempo.toString());
      const tempoRatio = newTempo / defaultTempo;

      if (audioRef.current) {
        audioRef.current.playbackRate = tempoRatio;
      }
      if (melodyAudioRef.current) {
        melodyAudioRef.current.playbackRate = tempoRatio;
      }
    }
  }, [currentTempo, defaultTempo]);

  // 템포 감소 함수
  const decreaseTempo = useCallback(() => {
    if (currentTempo > 0) {
      const newTempo = currentTempo - 1;
      setCurrentTempo(newTempo);
      setTempoInputValue(newTempo.toString());
      const tempoRatio = newTempo / defaultTempo;

      if (audioRef.current) {
        audioRef.current.playbackRate = tempoRatio;
      }
      if (melodyAudioRef.current) {
        melodyAudioRef.current.playbackRate = tempoRatio;
      }
    }
  }, [currentTempo, defaultTempo]);

  // 메트로놈 토글 함수
  const toggleMetronome = useCallback(() => {
    setShowMetronomePopup((prev) => !prev);
  }, []);

  // 메트로놈 비트 재생 함수
  const playMetronomeBeat = useCallback(
    (audioContext: AudioContext, time: number) => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.setValueAtTime(800, time);
      oscillator.type = 'sine';

      // 고정된 볼륨 사용
      gainNode.gain.setValueAtTime(0, time);
      gainNode.gain.linearRampToValueAtTime(0.3, time + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.001, time + 0.1);

      oscillator.start(time);
      oscillator.stop(time + 0.1);
    },
    [],
  );

  // 메트로놈 스케줄러 함수
  const scheduleMetronomeBeats = useCallback(() => {
    if (!metronomeAudioContextRef.current || !isMetronomeOn) return;

    const audioContext = metronomeAudioContextRef.current;
    const currentTime = audioContext.currentTime;
    const beatInterval = 60 / metronomeBPM; // BPM을 초 단위로 변환

    // 다음 비트 시간 계산
    if (metronomeNextBeatTimeRef.current === 0) {
      metronomeNextBeatTimeRef.current = currentTime + 0.1; // 약간의 지연 후 시작
    }

    // 현재 시간부터 0.5초 앞까지의 비트들을 스케줄
    while (metronomeNextBeatTimeRef.current < currentTime + 0.5) {
      playMetronomeBeat(audioContext, metronomeNextBeatTimeRef.current);
      metronomeNextBeatTimeRef.current += beatInterval;
    }

    // 다음 스케줄링 예약
    metronomeSchedulerRef.current = requestAnimationFrame(
      scheduleMetronomeBeats,
    );
  }, [isMetronomeOn, metronomeBPM, playMetronomeBeat]);

  // 메트로놈 시작/정지 함수
  const toggleMetronomePlayback = useCallback(() => {
    if (isMetronomeOn) {
      // 메트로놈 정지
      if (metronomeSchedulerRef.current) {
        cancelAnimationFrame(metronomeSchedulerRef.current);
        metronomeSchedulerRef.current = null;
      }
      if (metronomeAudioContextRef.current) {
        metronomeAudioContextRef.current.close();
        metronomeAudioContextRef.current = null;
      }
      metronomeNextBeatTimeRef.current = 0;
      setIsMetronomeOn(false);
    } else {
      // 메트로놈 시작
      try {
        metronomeAudioContextRef.current = new (window.AudioContext ||
          (window as any).webkitAudioContext)();
        metronomeNextBeatTimeRef.current = 0;
        setTempBPM(metronomeBPM); // tempBPM을 현재 BPM으로 동기화
        setIsMetronomeOn(true);
        // scheduleMetronomeBeats를 직접 호출하지 않고 useEffect에서 처리
      } catch (error) {
        console.error('Failed to start metronome:', error);
        setIsMetronomeOn(false);
      }
    }
  }, [isMetronomeOn, metronomeBPM]);

  // BPM 슬라이더 드래그 중 변경 함수 (임시 값만 업데이트)
  const handleBPMChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newBPM = parseInt(e.target.value);
      setTempBPM(newBPM);
    },
    [],
  );

  // BPM 슬라이더 드래그 완료 함수 (실제 BPM 적용)
  const handleBPMChangeComplete = useCallback(() => {
    setMetronomeBPM(tempBPM);

    // 메트로놈이 재생 중이면 새로운 BPM으로 재시작
    if (isMetronomeOn) {
      // 기존 스케줄러 정리
      if (metronomeSchedulerRef.current) {
        cancelAnimationFrame(metronomeSchedulerRef.current);
        metronomeSchedulerRef.current = null;
      }

      // 다음 비트 시간 리셋
      metronomeNextBeatTimeRef.current = 0;

      // 새로운 BPM으로 스케줄링 재시작 (useEffect에서 자동으로 처리됨)
    }
  }, [tempBPM, isMetronomeOn]);

  // 컴포넌트 언마운트 시 오디오 및 메트로놈 정리
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (melodyAudioRef.current) {
        melodyAudioRef.current.pause();
        melodyAudioRef.current = null;
      }
      if (metronomeSchedulerRef.current) {
        cancelAnimationFrame(metronomeSchedulerRef.current);
        metronomeSchedulerRef.current = null;
      }
      if (metronomeAudioContextRef.current) {
        metronomeAudioContextRef.current.close();
        metronomeAudioContextRef.current = null;
      }
      if (trialTimeoutRef.current) {
        clearTimeout(trialTimeoutRef.current);
        trialTimeoutRef.current = null;
      }
    };
  }, []);

  // 악보 데이터가 변경될 때 오디오 정지 및 초기화
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    if (melodyAudioRef.current) {
      melodyAudioRef.current.pause();
      melodyAudioRef.current = null;
    }
    setIsPlaying(false);
    setIsAudioLoading(false);
    setIsTrialMode(false);

    // 체험 모드 타이머 정리
    if (trialTimeoutRef.current) {
      clearTimeout(trialTimeoutRef.current);
      trialTimeoutRef.current = null;
    }
  }, [
    musicData?.musicalKey,
    musicData?.melodyFileUrl,
    musicData?.audioFileUrl,
  ]);

  // 메트로놈 상태 변경 시 스케줄링 시작/정지
  useEffect(() => {
    if (isMetronomeOn && metronomeAudioContextRef.current) {
      scheduleMetronomeBeats();
    }
  }, [isMetronomeOn, scheduleMetronomeBeats]);

  // 팝업 외부 클릭 시 팝업 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;

      if (showMetronomePopup) {
        if (
          !target.closest('.metronome-popup') &&
          !target.closest('[data-metronome-button]')
        ) {
          setShowMetronomePopup(false);
        }
      }

      if (showTempoPopup) {
        if (
          !target.closest('.tempo-popup') &&
          !target.closest('[data-tempo-button]')
        ) {
          setShowTempoPopup(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMetronomePopup, showTempoPopup]);

  return (
    <>
      {/* Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">
              {dialogContent.title}
            </DialogTitle>
            <DialogDescription className="text-center">
              {dialogContent.description}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-center">
            <Button
              onClick={closeDialog}
              className="bg-[#4A2C5A] hover:bg-[#3A1C4A] text-white px-6 py-2 rounded-full"
            >
              확인
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 로그인 다이얼로그 */}
      <Dialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">
              <div className="text-4xl mb-3">🔒</div>
              <div className="text-lg font-semibold text-gray-800">
                로그인하고 더 연습하기
              </div>
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <LoginForm
              loginCallbackFunc={() => setShowLoginDialog(false)}
              signupCallbackFunc={() => setShowLoginDialog(false)}
              resetPasswordCallbackFunc={() => setShowLoginDialog(false)}
            />
          </div>
        </DialogContent>
      </Dialog>

      <div className="w-full bg-[#7030A0] py-3 sm:py-4 px-3 sm:px-6 rounded-lg relative">
        {/* 템포 팝업 */}
        {showTempoPopup && (
          <div className="tempo-popup absolute bottom-full right-0 sm:right-1/4 mb-2 z-50 w-full sm:w-auto">
            {/* 템포 컨트롤 */}
            <div className="bg-white border-2 border-[#4A2C5A] rounded-lg p-3 sm:p-4 mb-2 shadow-lg mx-2 sm:mx-0">
              <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
                {/* 템포 슬라이더 */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs text-gray-500">0</span>
                    <input
                      type="range"
                      min="0"
                      max="400"
                      value={currentTempo}
                      onChange={handleTempoSliderChange}
                      className="flex-1 h-2 bg-purple-200 rounded-lg appearance-none cursor-pointer"
                      style={{
                        background: `linear-gradient(to right, #4A2C5A 0%, #4A2C5A ${
                          (currentTempo / 400) * 100
                        }%, #E5E7EB ${
                          (currentTempo / 400) * 100
                        }%, #E5E7EB 100%)`,
                      }}
                    />
                    <span className="text-xs text-gray-500">400</span>
                  </div>
                  <div className="text-center">
                    <span className="text-sm font-medium text-black">
                      {currentTempo}
                    </span>
                  </div>
                </div>

                {/* 숫자 입력 필드 */}
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    max="400"
                    value={tempoInputValue}
                    onChange={handleTempoInputChange}
                    onBlur={handleTempoInputBlur}
                    className="w-16 h-8 px-2 text-center text-sm font-medium text-black bg-white border-2 border-[#4A2C5A] rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300"
                  />
                  <div className="absolute right-1 top-1 bottom-0 flex flex-col">
                    <button
                      onClick={increaseTempo}
                      className="w-3 h-3 flex items-center justify-center text-gray-500 hover:text-[#4A2C5A] active:bg-white transition-colors"
                    >
                      <ChevronUp className="w-2 h-2" />
                    </button>
                    <button
                      onClick={decreaseTempo}
                      className="w-3 h-3 flex items-center justify-center text-gray-500 hover:text-[#4A2C5A] active:bg-white transition-colors"
                    >
                      <ChevronDown className="w-2 h-2" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 메트로놈 팝업 */}
        {showMetronomePopup && (
          <div className="metronome-popup absolute bottom-full right-0 mb-2 z-50 w-full sm:w-auto">
            {/* 메트로놈 컨트롤 통합 박스 */}
            <div className="bg-white border-2 border-[#4A2C5A] rounded-lg p-3 sm:p-4 shadow-lg min-w-0 sm:min-w-80 mx-2 sm:mx-0">
              <div className="space-y-3 sm:space-y-4">
                {/* BPM 조절 */}
                <div className="flex items-center gap-2 sm:gap-3">
                  <Volume2 className="w-4 h-4 text-[#4A2C5A]" />
                  <span className="text-xs sm:text-sm font-medium text-[#4A2C5A] min-w-12 sm:min-w-16">
                    BPM
                  </span>
                  <input
                    type="range"
                    min="60"
                    max="200"
                    value={tempBPM}
                    onChange={handleBPMChange}
                    onMouseUp={handleBPMChangeComplete}
                    onTouchEnd={handleBPMChangeComplete}
                    className="flex-1 h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, #4A2C5A 0%, #4A2C5A ${
                        ((tempBPM - 60) / 140) * 100
                      }%, #E5E7EB ${
                        ((tempBPM - 60) / 140) * 100
                      }%, #E5E7EB 100%)`,
                    }}
                  />
                  <span className="text-xs sm:text-sm font-medium text-[#4A2C5A] w-6 sm:w-8">
                    {tempBPM}
                  </span>
                </div>

                {/* 재생/정지 버튼 */}
                <div className="flex justify-center">
                  <button
                    onClick={toggleMetronomePlayback}
                    className={`px-4 sm:px-6 py-2 rounded-full flex items-center gap-1 sm:gap-2 text-xs sm:text-sm font-medium transition-all duration-200 ${
                      isMetronomeOn
                        ? 'bg-[#4A2C5A] text-white hover:bg-[#3A1C4A]'
                        : 'bg-[#E8D5F2] text-[#4A2C5A] hover:bg-[#D4C4E0]'
                    }`}
                  >
                    {isMetronomeOn ? (
                      <>
                        <Square className="w-4 h-4" />
                        정지
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4" />
                        재생
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-center items-center gap-2 sm:gap-4 flex-wrap">
          {/* 재생/일시정지 버튼 */}
          <button
            onClick={toggleMusic}
            disabled={
              isAudioLoading ||
              (!musicData?.audioFileUrl && !musicData?.melodyFileUrl)
            }
            className={`flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full transition-all duration-200 cursor-pointer active:bg-white ${
              isAudioLoading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-[#E8D5F2] hover:bg-[#D4C4E0]'
            }`}
          >
            {isAudioLoading ? (
              <div className="w-5 h-5 border-2 border-[#4A2C5A] border-t-transparent rounded-full animate-spin" />
            ) : isPlaying ? (
              <Pause className="w-5 h-5 text-[#4A2C5A]" />
            ) : (
              <Play className="w-5 h-5 text-[#4A2C5A] ml-0.5" />
            )}
          </button>

          {/* 정지 버튼 */}
          <button
            onClick={stopMusic}
            disabled={
              (!musicData?.audioFileUrl && !musicData?.melodyFileUrl) ||
              (!isAuthenticated && !isTrialMode)
            }
            className={`flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full transition-all duration-200 cursor-pointer active:bg-white ${
              !isAuthenticated && !isTrialMode
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-[#E8D5F2] hover:bg-[#D4C4E0]'
            }`}
          >
            <Square className="w-4 h-4 text-[#4A2C5A]" />
          </button>

          {/* 멜로디 토글 버튼 */}
          <button
            onClick={toggleMelody}
            disabled={!isAuthenticated}
            className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 sm:py-3 rounded-full transition-all duration-200 cursor-pointer active:bg-white ${
              !isAuthenticated
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-[#E8D5F2] hover:bg-[#D4C4E0]'
            }`}
          >
            <span className="text-xs sm:text-sm font-medium text-[#4A2C5A]">
              멜로디
            </span>
            <div
              className={`w-8 h-4 rounded-full transition-all duration-200 ${
                isMelodyOn ? 'bg-[#4A2C5A]' : 'bg-gray-300'
              }`}
            >
              <div
                className={`w-3 h-3 bg-white rounded-full transition-all duration-200 mt-0.5 cursor-pointer ${
                  isMelodyOn ? 'ml-4' : 'ml-0.5'
                }`}
              />
            </div>
          </button>

          {/* <button
          onClick={changeKey}
          className="px-4 py-3 rounded-full bg-[#E8D5F2] hover:bg-[#D4C4E0] transition-all duration-200 cursor-pointer"
        >
          <span className="text-sm font-medium text-[#4A2C5A]">키 변경</span>
        </button> */}

          {/* 템포 버튼 */}
          <button
            data-tempo-button
            onClick={toggleTempoPopup}
            disabled={!isAuthenticated}
            className={`px-2 sm:px-4 py-2 sm:py-3 rounded-full transition-all duration-200 cursor-pointer active:bg-white ${
              !isAuthenticated
                ? 'bg-gray-400 cursor-not-allowed text-gray-600'
                : showTempoPopup
                ? 'bg-[#4A2C5A] text-white'
                : 'bg-[#E8D5F2] hover:bg-[#D4C4E0] text-[#4A2C5A]'
            }`}
          >
            <span className="text-xs sm:text-sm font-medium">
              템포 {currentTempo}
            </span>
          </button>

          {/* 메트로놈 버튼 */}
          <button
            data-metronome-button
            onClick={toggleMetronome}
            disabled={!isAuthenticated}
            className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 sm:py-3 rounded-full transition-all duration-200 cursor-pointer active:bg-white ${
              !isAuthenticated
                ? 'bg-gray-400 cursor-not-allowed text-gray-600'
                : showMetronomePopup || isMetronomeOn
                ? 'bg-[#4A2C5A] text-white'
                : 'bg-[#E8D5F2] hover:bg-[#D4C4E0] text-[#4A2C5A]'
            }`}
          >
            <Volume2 className="w-4 h-4" />
            <span className="text-xs sm:text-sm font-medium">메트로놈</span>
          </button>
        </div>
      </div>
    </>
  );
}
