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

  // 카테고리가 변경될 때마다 관련 데이터 로드
  useEffect(() => {
    loadSubGenres(selectedCategory);
  }, [selectedCategory, loadSubGenres]);

  // 서브장르가 변경되거나 카테고리가 변경될 때 스케일 로드
  useEffect(() => {
    if (selectedScale && selectedSubGenre) {
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

  return (
    <>
      {/* 서브장르 버튼 */}
      <div className="max-w-[820px] mx-auto h-[50px] flex align-items justify-between gap-3 pt-4 relative">
        <div className="flex gap-3">
          <button className="text-gray-400 hover:text-gray-600 cursor-pointer">
            <ChevronLeft className="h-8 w-8 text-[#c287b3]" />
          </button>

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
            <div className="flex gap-3">
              {subGenres.map((genre) => (
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
              ))}
            </div>
          )}

          <button className="text-gray-400 hover:text-gray-600 cursor-pointer">
            <ChevronRight className="h-8  w-8 text-[#c287b3]" />
          </button>
        </div>
        {/* 왼쪽 사이드바: 스케일 선택 */}
        {scales.length > 0 && (
          <div>
            <div className="w-full min-w-[150px] flex justify-center items-center gap-2"></div>
            <Select
              value={selectedScale || ''}
              onValueChange={(value: string) => setSelectedScale(value)}
              disabled={isScalesLoading}
            >
              <SelectTrigger className="w-full bg-white border-gray-300 hover:border-purple-400 focus:border-purple-500">
                <SelectValue placeholder="스케일을 선택해주세요." />
              </SelectTrigger>
              <SelectContent>
                {isScalesLoading ? (
                  <SelectItem value="loading" disabled>
                    로딩 중...
                  </SelectItem>
                ) : (
                  scales.map((scale) => (
                    <SelectItem key={scale.nameEn} value={scale.nameEn}>
                      {scale.nameKo}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {/* 메인 콘텐츠 영역 */}
      <div className="w-full mx-auto bg-white">
        <div className="flex mt-4">
          {/* 메인: 악보 이미지 */}
          <div className="flex-1 flex flex-col items-center justify-start py-4">
            <div>
              {/* 악보 PDF 뷰어 */}
              <div className="w-full shadow border overflow-hidden">
                {isMusicSheetsLoading ? (
                  <div className="w-[818px] h-[719px] bg-gray-200 animate-pulse flex items-center justify-center">
                    <div className="text-gray-500">악보 로딩 중...</div>
                  </div>
                ) : musicSheetsData.musicData[0]?.scoreFileUrl ? (
                  <div className="w-[818px] h-[719px] relative">
                    <iframe
                      src={musicSheetsData.musicData[0].scoreFileUrl}
                      className="w-full h-full border-0 rounded-lg"
                      title="악보 PDF"
                      onError={() => {
                        console.error(
                          'PDF 로드 실패:',
                          musicSheetsData.musicData[0].scoreFileUrl,
                        );
                      }}
                    />
                    {/* 백업 링크 - iframe 로드 실패 시 사용 */}
                    <div className="absolute top-2 right-2">
                      <a
                        href={musicSheetsData.musicData[0].scoreFileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block px-3 py-1 text-xs bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
                      >
                        새 탭에서 열기
                      </a>
                    </div>
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
                musicData={musicSheetsData.musicData[0] || null}
                defaultTempo={tempo}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
