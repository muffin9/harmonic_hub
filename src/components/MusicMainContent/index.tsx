'use client';

import { useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useMusicStore } from '@/stores/music-store';
import { getSubGenres, getScales } from '@/api/category';

export default function MusicMainContent() {
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
    async (category: string) => {
      try {
        setSubGenresLoading(true);
        const data = await getSubGenres(category);
        if (data && Array.isArray(data)) {
          setSubGenres(data);
          // 카테고리가 변경된 경우에만 첫 번째 서브장르를 선택
          if (data.length > 0 && selectedSubGenre === 'Bossanova') {
            setSelectedSubGenre(data[0].nameEn);
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
    async (categoryId: string, subGenre: string) => {
      try {
        setScalesLoading(true);
        const data = await getScales(categoryId, subGenre);
        if (data && Array.isArray(data)) {
          setScales(data);
          // 첫 번째 스케일을 기본 선택으로 설정
          if (data.length > 0) {
            setSelectedScale(data[0].nameEn);
          }
        }
      } catch (error) {
        console.error('Failed to load scales:', error);
      } finally {
        setScalesLoading(false);
      }
    },
    [setScales, setSelectedScale, setScalesLoading],
  );

  // 카테고리가 변경될 때마다 관련 데이터 로드
  useEffect(() => {
    if (selectedCategory) {
      // 카테고리가 변경되면 서브장르만 로드
      loadSubGenres(selectedCategory);
    }
  }, [selectedCategory, loadSubGenres, loadScales]);

  // 서브장르가 변경되거나 카테고리가 변경될 때 스케일 로드
  useEffect(() => {
    if (selectedCategory && selectedSubGenre) {
      loadScales(selectedCategory, selectedSubGenre);
    }
  }, [selectedCategory, selectedSubGenre, loadScales]);

  return (
    <>
      {/* 서브장르 버튼 */}
      <div className="flex justify-center gap-3 py-6">
        <button className="text-gray-400 hover:text-gray-600 cursor-pointer">
          <ChevronLeft className="h-5 w-5 text-[#c287b3]" />
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
          subGenres.map((genre) => (
            <Button
              key={genre.id}
              className={`px-4 py-1 rounded-full border cursor-pointer ${
                selectedSubGenre === genre.nameEn
                  ? 'bg-purple-500 text-white border-purple-500'
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
              onClick={() => setSelectedSubGenre(genre.nameEn)}
            >
              {genre.nameEn}
            </Button>
          ))
        )}
        <button className="text-gray-400 hover:text-gray-600 cursor-pointer">
          <ChevronRight className="h-5 w-5 text-[#c287b3]" />
        </button>
      </div>

      {/* 메인 콘텐츠 영역 */}
      <div className="flex justify-center bg-white">
        <div className="max-w-6xl w-full flex">
          {/* 왼쪽 사이드바: 스케일 선택 */}
          <div className="w-1/4 border-r px-4 py-6">
            <h2 className="text-lg font-bold text-purple-600 mb-4">
              스케일 선택
            </h2>
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
              {/* 악보 이미지 */}
              <div className="w-full shadow border rounded-lg overflow-hidden">
                <Image
                  src={
                    scales.find((scale) => scale.nameEn === selectedScale)
                      ?.imageUrl || '/score/uphill_road1.png'
                  }
                  alt="악보 이미지"
                  width={800}
                  height={1200}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 하단 컨트롤 */}
      <div className="flex justify-center items-center gap-4 border-t py-3 bg-purple-100">
        <button
          className="bg-purple-600 text-white px-4 py-2 rounded cursor-pointer hover:bg-purple-700"
          onClick={() => alert('서비스 준비중입니다.')}
        >
          ▶︎
        </button>
        <Button className="px-4 py-2 border rounded cursor-pointer hover:bg-gray-50">
          키 변경
        </Button>
        <Button
          onClick={() => alert('아래 MP3 파일 플레이어를 이용해주세요.')}
          className="cursor-pointer"
        >
          템포: {tempo}
        </Button>
        <Button className="px-4 py-2 border rounded cursor-pointer hover:bg-gray-50">
          메트로놈
        </Button>
      </div>
    </>
  );
}
