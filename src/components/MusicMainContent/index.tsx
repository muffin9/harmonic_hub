'use client';

import { useEffect, useCallback, useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useMusicStore } from '@/stores/music-store';
import { getSubGenres, getScales } from '@/api/category';
import { getMusicSheetsInfo } from '@/api/info';
import MusicControls from '@/components/MusicControls';

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
  accompaniment: {
    url: string;
    size: number;
    filename: string;
  };
  score: {
    url: string;
    size: number;
    filename: string;
  };
}

export default function MusicMainContent() {
  // 악보 데이터 상태
  const [musicSheetsData, setMusicSheetsData] = useState<MusicSheetData[]>([]);
  const [isMusicSheetsLoading, setIsMusicSheetsLoading] = useState(false);

  // Zustand 스토어에서 음악 상태 가져오기
  const {
    selectedCategory,
    selectedSubGenre,
    setSelectedSubGenre,
    selectedScale,
    setSelectedScale,
    tempo,
    setTempo,
    subGenres,
    scales,
    setSubGenres,
    setScales,
    setSubGenresLoading,
    setScalesLoading,
    isSubGenresLoading,
    isScalesLoading,
  } = useMusicStore();

  // 서브장르 데이터 로드
  const loadSubGenres = useCallback(
    async (categoryId: number) => {
      try {
        setSubGenresLoading(true);
        const data = await getSubGenres(categoryId);
        if (data && Array.isArray(data)) {
          setSubGenres(data);
          // 현재 선택된 서브장르가 유효하지 않은 경우에만 첫 번째 항목 선택
          if (
            data.length > 0 &&
            (!selectedSubGenre ||
              !data.find((genre) => genre.id === selectedSubGenre))
          ) {
            setSelectedSubGenre(data[0].id);
          }
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
          // 현재 선택된 스케일이 유효하지 않은 경우에만 첫 번째 항목 선택
          if (
            data.length > 0 &&
            (!selectedScale ||
              !data.find((scale) => scale.nameEn === selectedScale))
          ) {
            setSelectedScale(data[0].nameEn);
          }
        }
      } catch (error) {
        console.error('Failed to load scales:', error);
      } finally {
        setScalesLoading(false);
      }
    },
    [setScales, setSelectedScale, setScalesLoading, selectedScale],
  );

  // 악보 데이터 로드
  const loadMusicSheets = useCallback(
    async (categoryId: number, subGenreId: number, scaleId: number) => {
      try {
        setIsMusicSheetsLoading(true);
        console.log('Loading music sheets:', {
          categoryId,
          subGenreId,
          scaleId,
        });
        const data = await getMusicSheetsInfo(categoryId, subGenreId, scaleId);
        if (data && Array.isArray(data)) {
          setMusicSheetsData(data as MusicSheetData[]);
        }
      } catch (error) {
        console.error('Failed to load music sheets:', error);
      } finally {
        setIsMusicSheetsLoading(false);
      }
    },
    [],
  );

  // 카테고리가 변경될 때마다 관련 데이터 로드
  useEffect(() => {
    if (selectedCategory) {
      loadSubGenres(selectedCategory);
    }
  }, [selectedCategory, loadSubGenres]);

  // 서브장르가 변경되거나 카테고리가 변경될 때 스케일 로드
  useEffect(() => {
    if (selectedCategory && selectedSubGenre) {
      loadScales(selectedCategory, selectedSubGenre);
    }
  }, [selectedCategory, selectedSubGenre, loadScales]);

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

  return (
    <>
      {/* 서브장르 버튼 */}
      <div className="max-w-[1040px] mx-auto flex gap-3 px-3 py-2 relative">
        <button className="text-gray-400 hover:text-gray-600 cursor-pointer">
          <ChevronLeft className="absolute left-0 h-8 w-8 text-[#c287b3]" />
        </button>
        <div className="px-4 flex gap-3 mt-8">
          {isSubGenresLoading ? (
            <div className="flex gap-3">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-20 h-8 bg-gray-200 rounded-full animate-pulse"
                />
              ))}
            </div>
          ) : (
            subGenres.map((genre) => (
              <Button
                key={genre.id}
                className={`px-4 py-1 rounded-full border cursor-pointer transition-all duration-200 ${
                  selectedSubGenre === genre.id
                    ? 'bg-[#C891FF] text-white border-[#C891FF] shadow-[0px_2px_8px_0px_rgba(167,139,250,0.3)]'
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
                onClick={() => setSelectedSubGenre(genre.id)}
              >
                {genre.nameEn}
              </Button>
            ))
          )}
        </div>
        <button className="text-gray-400 hover:text-gray-600 cursor-pointer">
          <ChevronRight className="absolute right-0 h-8  w-8 text-[#c287b3]" />
        </button>
      </div>

      {/* 메인 콘텐츠 영역 */}
      <div className="max-w-[1040px] mx-auto flex bg-white">
        <div className="flex mt-4">
          {/* 왼쪽 사이드바: 스케일 선택 */}
          <div className="w-1/4 py-6">
            <div className="w-full flex justify-center items-center gap-2 mb-4">
              <div className="w-[20px] h-[1px] bg-[#C187B3]" />
              <h2 className="text-lg font-bold text-black">스케일 선택</h2>
              <div className="w-[20px] h-[1px] bg-[#C187B3]" />
            </div>
            {isScalesLoading ? (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="w-32 h-4 bg-gray-200 rounded animate-pulse"
                  />
                ))}
              </div>
            ) : (
              <ul className="space-y-2">
                {scales.map((scale) => (
                  <li
                    key={scale.nameEn}
                    className={`cursor-pointer ${
                      selectedScale === scale.nameEn
                        ? 'text-purple-700 font-bold'
                        : 'text-gray-700'
                    }`}
                    onClick={() => setSelectedScale(scale.nameEn)}
                  >
                    {scale.nameKo}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* 메인: 악보 이미지 */}
          <div className="flex-1 flex flex-col items-center justify-start p-4">
            <div className="w-full max-w-4xl">
              {/* 악보 PDF 뷰어 */}
              <div className="w-full shadow border rounded-lg overflow-hidden">
                {isMusicSheetsLoading ? (
                  <div className="w-[818px] h-[719px] bg-gray-200 animate-pulse flex items-center justify-center">
                    <div className="text-gray-500">악보 로딩 중...</div>
                  </div>
                ) : musicSheetsData[0]?.score?.url ? (
                  <div className="w-[818px] h-[719px]">
                    <iframe
                      src={musicSheetsData[0].score.url}
                      className="w-full h-full border-0"
                      title="악보 PDF"
                    />
                  </div>
                ) : (
                  <div className="w-[818px] h-[719px] bg-gray-50 flex flex-col items-center justify-center border-gray-300">
                    <div className="text-center text-gray-500">
                      <div className="text-lg font-medium mb-2">
                        악보를 선택해주세요
                      </div>
                      <div className="text-sm">
                        카테고리, 서브장르, 스케일을 모두 선택하시면
                        <br />
                        해당하는 악보를 확인할 수 있습니다.
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <MusicControls
                musicData={musicSheetsData[0] || null}
                defaultTempo={tempo}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
