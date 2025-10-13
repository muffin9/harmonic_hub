'use client';

import { useEffect, useCallback, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useMusicStore } from '@/stores/music-store';
import { useUserStore } from '@/stores/user-store';
import { getSubGenres, getScales } from '@/api/category';
import { getMusicSheetsInfo } from '@/api/info';
import MusicControls from '@/components/MusicControls';

export type MusicDataType = {
  musicalKey: string;
  scoreFileUrl: string;
  audioFileUrl: string;
  melodyFileUrl: string;
  scoreFileSize: string;
  audioFileSize: string;
  melodyFileSize: string;
  createdAt: string;
  updatedAt: string;
};

interface MusicSheetData {
  id: string;
  title: string;
  tempo: number;
  timeSignature: string;
  key: string;
  duration: number;
  melody: {
    url: string;
    size: number;
    filename: string;
  };
  musicData: MusicDataType[];
}

export default function MusicMainContent() {
  // 악보 데이터 상태
  const [musicSheetsData, setMusicSheetsData] = useState<MusicSheetData>({
    id: '',
    title: '',
    tempo: 0,
    timeSignature: '',
    key: '',
    duration: 0,
    melody: {
      url: '',
      size: 0,
      filename: '',
    },
    musicData: [],
  });
  const [isMusicSheetsLoading, setIsMusicSheetsLoading] = useState(false);
  const [selectedMusicIndex, setSelectedMusicIndex] = useState(0);

  // Zustand 스토어에서 음악 상태 가져오기
  const {
    selectedCategory,
    setSelectedCategory,
    selectedSubGenre,
    setSelectedSubGenre,
    selectedScale,
    setSelectedScale,
    subGenres,
    scales,
    setSubGenres,
    setScales,
    setSubGenresLoading,
    setScalesLoading,
    isSubGenresLoading,
    isScalesLoading,
    categories: musicCategories,
  } = useMusicStore();

  // Zustand 스토어에서 사용자 상태 가져오기
  const { isAuthenticated, loadUser } = useUserStore();

  // 서브장르 데이터 로드
  const loadSubGenres = useCallback(
    async (categoryId: number) => {
      try {
        setSubGenresLoading(true);
        const data = await getSubGenres(categoryId);
        if (data && Array.isArray(data)) {
          setSubGenres(data);
          // 현재 선택된 서브장르가 유효하지 않은 경우에만 첫 번째 항목 선택
          // if (
          //   data.length > 0 &&
          //   (!selectedSubGenre ||
          //     !data.find((genre) => genre.id === selectedSubGenre))
          // ) {
          //   setSelectedSubGenre(data[0].id);
          // }
        }
      } catch (error) {
        console.error('Failed to load sub genres:', error);
      } finally {
        setSubGenresLoading(false);
      }
    },
    [setSubGenres, setSelectedSubGenre, setSubGenresLoading, selectedSubGenre],
  );

  // 스케일 데이터 로드
  const loadScales = useCallback(
    async (categoryId: number, subGenreId: number) => {
      try {
        setScalesLoading(true);
        const data = await getScales(categoryId, subGenreId);

        if (data && Array.isArray(data)) {
          setScales(data);
        }
      } catch (error) {
        console.error('Failed to load scales:', error);
      } finally {
        setScalesLoading(false);
      }
    },
    [setScales, setScalesLoading],
  );

  // 악보 데이터 로드
  const loadMusicSheets = useCallback(
    async (categoryId: number, subGenreId: number, scaleId: number) => {
      try {
        setIsMusicSheetsLoading(true);
        const data = await getMusicSheetsInfo(categoryId, subGenreId, scaleId);
        if (data) {
          setMusicSheetsData(data);
        }
      } catch (error) {
        console.error('Failed to load music sheets:', error);
      } finally {
        setIsMusicSheetsLoading(false);
      }
    },
    [],
  );

  // 카테고리가 로드되면 첫 번째 카테고리 자동 선택
  useEffect(() => {
    if (musicCategories.length > 0 && !selectedCategory) {
      setSelectedCategory(musicCategories[0].id);
    }
  }, [musicCategories, selectedCategory, setSelectedCategory]);

  // 카테고리가 변경될 때마다 관련 데이터 로드
  useEffect(() => {
    loadSubGenres(selectedCategory);
  }, [selectedCategory, loadSubGenres]);

  // 서브장르가 변경되거나 카테고리가 변경될 때 스케일 로드
  useEffect(() => {
    if (selectedSubGenre) {
      loadScales(selectedCategory, selectedSubGenre);
    }
  }, [selectedCategory, selectedSubGenre, selectedScale, loadScales]);

  // 카테고리, 서브장르, 스케일이 모두 선택되었을 때 악보 데이터 로드
  useEffect(() => {
    if (
      selectedCategory &&
      selectedSubGenre &&
      selectedScale &&
      scales.length > 0
    ) {
      const selectedScaleData = scales.find(
        (scale) => scale.nameEn === selectedScale,
      );
      if (selectedScaleData && selectedScaleData.id) {
        loadMusicSheets(
          selectedCategory,
          selectedSubGenre,
          selectedScaleData.id,
        );
      }
    }
  }, [
    selectedCategory,
    selectedSubGenre,
    selectedScale,
    scales,
    loadMusicSheets,
  ]);

  // 음원 데이터가 변경될 때 선택된 인덱스 초기화
  useEffect(() => {
    if (musicSheetsData.musicData.length > 0) {
      setSelectedMusicIndex(0);
    }
  }, [musicSheetsData.musicData]);

  // 로그인 상태 확인
  useEffect(() => {
    loadUser();
  }, [loadUser]);

  return (
    <>
      {/* 음악 카테고리 탭 */}
      <div className="max-w-[820px] mx-auto py-4 bg-white">
        <div className="flex space-x-3 sm:space-x-6 text-xs sm:text-sm md:text-base font-medium overflow-x-auto">
          {musicCategories.map((category) => (
            <button
              key={category.id}
              className={`whitespace-nowrap px-2 py-1 rounded ${
                selectedCategory === category.id
                  ? 'text-purple-500 bg-purple-50'
                  : 'text-gray-700 hover:text-purple-700'
              }`}
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.nameEn}
            </button>
          ))}
        </div>
      </div>

      {/* 서브장르 버튼 */}
      <div className="max-w-[820px] mx-auto flex flex-col sm:flex-row justify-between gap-3 relative bg-[#e8cafe] px-4 py-3">
        <div className="md:min-w-[500px] flex items-center gap-2 sm:gap-3 overflow-x-auto">
          <button className="text-gray-400 hover:text-gray-600 cursor-pointer">
            <ChevronLeft className="h-6 w-6 sm:h-8 sm:w-8 text-[#c287b3]" />
          </button>

          <div className="flex gap-2 sm:gap-3 md:min-w-[500px]">
            {subGenres.map((genre) => (
              <Button
                key={genre.id}
                className={`px-2 sm:px-4 py-1 border cursor-pointer text-xs sm:text-sm whitespace-nowrap flex-shrink-0 ${
                  selectedSubGenre === genre.id
                    ? 'bg-[#C891FF] text-white border-[#C891FF] shadow-[0px_2px_8px_0px_rgba(167,139,250,0.3) underline'
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
                onClick={() => setSelectedSubGenre(genre.id)}
              >
                {genre.nameEn}
              </Button>
            ))}
          </div>

          <button className="text-gray-400 hover:text-gray-600 cursor-pointer">
            <ChevronRight className="h-6 w-6 sm:h-8 sm:w-8 text-[#c287b3]" />
          </button>
        </div>

        <div className="h-full flex items-center justify-end sm:justify-start mt-2 sm:mt-0">
          <Select
            value={selectedScale || ''}
            onValueChange={(value: string) => setSelectedScale(value)}
            disabled={isScalesLoading || scales.length === 0}
          >
            <SelectTrigger className="w-full sm:w-[180px] bg-white border-gray-300 hover:border-purple-400 focus:border-purple-500 cursor-pointer">
              <SelectValue placeholder={selectedScale ? '' : '스케일 선택'} />
            </SelectTrigger>
            {scales.length > 0 && (
              <SelectContent>
                {isScalesLoading ? (
                  <SelectItem value="loading" disabled>
                    로딩 중...
                  </SelectItem>
                ) : (
                  scales.map((scale) => (
                    <SelectItem
                      key={scale.nameEn}
                      value={scale.nameEn}
                      className="cursor-pointer"
                    >
                      {scale.nameKo}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            )}
          </Select>
        </div>
      </div>

      {/* 메인 콘텐츠 영역 */}
      <div className="w-full mx-auto bg-white px-4 sm:px-0 mt-4 sm:mt-0">
        <div className="flex">
          {/* 메인: 악보 이미지 */}
          <div className="flex-1 flex flex-col items-center justify-start pb-4">
            <div className="w-full max-w-[818px]">
              {/* 악보 PDF 뷰어 */}
              <div className="w-full shadow border overflow-hidden rounded-lg">
                {isMusicSheetsLoading ? (
                  <div className="w-full h-[400px] sm:h-[600px] md:h-[800px] lg:h-[1100px] bg-gray-200 animate-pulse flex items-center justify-center">
                    <div className="text-gray-500">악보 로딩 중...</div>
                  </div>
                ) : musicSheetsData.musicData.length > 0 ? (
                  <div className="w-full h-[400px] sm:h-[600px] md:h-[800px] lg:h-[1100px] relative bg-white">
                    {/* 음원 선택 버튼들 */}
                    {musicSheetsData.musicData.length > 1 && (
                      <div className="absolute top-2 left-1/2 transform -translate-x-1/2 z-10 flex gap-1 sm:gap-2 flex-wrap justify-center max-w-[90%]">
                        {musicSheetsData.musicData.map((music, index) => (
                          <button
                            key={index}
                            onClick={() => setSelectedMusicIndex(index)}
                            className={`px-2 sm:px-3 py-1 text-xs rounded-full transition-all duration-200 ${
                              selectedMusicIndex === index
                                ? 'bg-[#4A2C5A] text-white shadow-md'
                                : 'bg-white/90 text-gray-700 hover:bg-gray-100'
                            }`}
                          >
                            키: {music.musicalKey}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* PDF 뷰어 */}
                    <div className="w-full h-full relative overflow-hidden">
                      <iframe
                        src={`${musicSheetsData.musicData[selectedMusicIndex].scoreFileUrl}#toolbar=0&navpanes=0&scrollbar=1&view=FitH`}
                        className={`w-full h-full border-0 ${
                          !isAuthenticated ? 'absolute top-0 left-0' : ''
                        }`}
                        title={`악보 PDF - ${musicSheetsData.title}`}
                        style={{
                          background: 'white',
                          minHeight: '100%',
                          ...(isAuthenticated
                            ? {}
                            : {
                                height: '100px', // 맨 윗줄만 보이도록 높이 제한
                                transform: 'scale(1)',
                                transformOrigin: 'top left',
                              }),
                        }}
                        onError={() => {
                          console.error(
                            'PDF 로드 실패:',
                            musicSheetsData.musicData[selectedMusicIndex]
                              .scoreFileUrl,
                          );
                        }}
                      />

                      {/* 로그인하지 않은 경우 나머지 부분을 흐리게 처리 */}
                      {!isAuthenticated && (
                        <div className="absolute w-full h-full bg-gradient-to-b from-transparent via-white/95 to-white/100" />
                      )}
                    </div>

                    {/* 로그인 유도 오버레이 */}
                    {!isAuthenticated && (
                      <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/40">
                        <Button
                          onClick={() => {
                            // Header의 로그인 버튼 클릭과 동일한 동작
                            const loginButton = document.querySelector(
                              '[data-login-button]',
                            ) as HTMLButtonElement;
                            if (loginButton) {
                              loginButton.click();
                            }
                          }}
                          className="bg-[#ffc000] text-gray-800 px-6 py-2 rounded-full cursor-pointer"
                        >
                          로그인하고 더 연습하기
                        </Button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="w-full h-[400px] sm:h-[600px] bg-gray-50 flex flex-col items-center justify-center border-gray-300 rounded-lg">
                    <div className="text-center text-gray-500 px-4">
                      <div className="text-base sm:text-lg font-medium mb-2">
                        연습할 장르와 스케일을 선택하면 <br /> 해당 악보를
                        확인하실 수 있습니다.
                      </div>
                      {/* <div className="text-xs sm:text-sm">
                        카테고리, 서브장르, 스케일을 모두 선택하시면
                        <br className="hidden sm:block" />
                        <span className="sm:hidden"> </span>
                        해당하는 악보를 확인할 수 있습니다.
                      </div> */}
                    </div>
                  </div>
                )}
              </div>

              <MusicControls
                musicData={
                  musicSheetsData.musicData[selectedMusicIndex] || null
                }
                defaultTempo={musicSheetsData.tempo}
                isLoggedIn={isAuthenticated}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
