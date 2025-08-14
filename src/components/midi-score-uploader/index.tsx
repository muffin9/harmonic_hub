'use client';

import React, { useRef, useState } from 'react';
import { OpenSheetMusicDisplay } from 'opensheetmusicdisplay';
import { Button } from '../ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { Mp3Player } from './mp3-player';

export function MusicXmlScoreUploader() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasScore, setHasScore] = useState(false);
  const divRef = useRef<HTMLDivElement | null>(null);
  const osmdRef = useRef<OpenSheetMusicDisplay | null>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    setError(null);
    setIsLoading(true);
    setHasScore(false);
    const file = e.target.files?.[0];
    if (!file) {
      setIsLoading(false);
      return;
    }

    try {
      let text = await file.text();
      // DTD 제거 및 trim
      text = text.replace(/<!DOCTYPE[\s\S]*?>/i, '').trim();
      if (!divRef.current) throw new Error('악보 영역이 준비되지 않았습니다.');

      // 항상 새 인스턴스 생성
      if (osmdRef.current) {
        osmdRef.current = null;
        divRef.current.innerHTML = '';
      }
      osmdRef.current = new OpenSheetMusicDisplay(divRef.current, {
        drawingParameters: 'default',
      });
      await osmdRef.current.load(text);
      await osmdRef.current.render();
      setHasScore(true);
    } catch (err) {
      console.error('OSMD Error:', err);
      setError(
        'MusicXML 파일 파싱 또는 렌더링 실패: ' + (err as Error).message,
      );
    } finally {
      setIsLoading(false);
    }
  }

  function handleReset() {
    setHasScore(false);
    setError(null);
    if (divRef.current) divRef.current.innerHTML = '';
    osmdRef.current = null;
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
          MusicXML 악보 업로더
        </h2>
        <p className="text-gray-500 text-sm mb-2">
          MusicXML 파일을 업로드하면 악보가 아래에 표시됩니다.
        </p>
        <label
          htmlFor="musicxml-upload"
          className="block text-gray-700 font-medium mb-1"
        >
          MusicXML 파일 선택
        </label>
        <input
          id="musicxml-upload"
          type="file"
          accept=".xml"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-600
            file:mr-4 file:py-2 file:px-4
            file:rounded-lg file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100
            transition"
          disabled={isLoading}
        />
        <Button
          type="button"
          variant="outline"
          className="mt-3 w-full max-w-[120px]"
          onClick={handleReset}
          disabled={isLoading}
        >
          초기화
        </Button>
      </div>
      <AnimatePresence>
        {isLoading && (
          <motion.div
            key="loading"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="text-blue-600 font-medium"
          >
            로딩 중...
          </motion.div>
        )}
        {error && (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="text-blue-600 font-medium"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>
      <div className="w-full overflow-x-auto bg-gray-50 rounded-xl border border-gray-100 p-6 min-h-[320px] flex items-center justify-center">
        <div ref={divRef} className="w-full min-h-[300px]" />
      </div>
    </motion.section>
  );
}

export function ScoreAndMp3Section() {
  return (
    <div className="w-full py-16 px-2 flex flex-col items-center gap-16">
      <Mp3Player />
    </div>
  );
}
