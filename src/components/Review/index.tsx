'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ThumbsUp, ThumbsDown, Send } from 'lucide-react';

export default function Review() {
  const [feedback, setFeedback] = useState('');
  const [selectedReaction, setSelectedReaction] = useState<
    'positive' | 'negative' | null
  >(null);

  const handleSubmit = () => {
    if (!feedback.trim()) return;

    // TODO: API 호출로 피드백 전송
    console.log('Feedback:', {
      reaction: selectedReaction,
      text: feedback,
    });

    // 폼 초기화
    setFeedback('');
    setSelectedReaction(null);
  };

  return (
    <div className="w-full py-8 px-4">
      {/* 상단 통계 */}
      <div className="text-center mb-6">
        <div className="flex justify-center items-center gap-2 text-black">
          <p className="mt-5 text-[24px]">
            학습자들의 음악이 즐거워지고 있어요!
          </p>
          <img src="/thumb.png" alt="thumb" />
          <span className="text-[40px]">1,537</span>
        </div>
      </div>

      {/* 피드백 입력 영역 */}
      <div className="max-w-2xl h-[74px] mx-auto">
        <div className="bg-white rounded-full px-4 py-2 border border-gray-100 shadow-[2.21px_2.21px_51px_0px_#d2b7cb]">
          <div className="flex items-center gap-3">
            {/* 반응 버튼들 */}
            <div className="flex gap-2">
              <button
                onClick={() =>
                  setSelectedReaction(
                    selectedReaction === 'positive' ? null : 'positive',
                  )
                }
                className={`p-2 rounded-lg transition-colors ${
                  selectedReaction === 'positive'
                    ? 'border-green-500 bg-green-50 text-green-600'
                    : 'border-gray-300 text-gray-500 hover:border-gray-400'
                }`}
              >
                <ThumbsUp className="h-5 w-5" />
              </button>
              <button
                onClick={() =>
                  setSelectedReaction(
                    selectedReaction === 'negative' ? null : 'negative',
                  )
                }
                className={`p-2 rounded-lg transition-colors ${
                  selectedReaction === 'negative'
                    ? 'border-red-500 bg-red-50 text-red-600'
                    : 'border-gray-300 text-gray-500 hover:border-gray-400'
                }`}
              >
                <ThumbsDown className="h-5 w-5" />
              </button>
            </div>

            {/* 텍스트 입력 */}
            <div className="flex-1">
              <input
                type="text"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="학습한 후기나 개선점을 남겨주세요."
                className="w-full px-2 py-3 border-0 outline-none text-black placeholder-black"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSubmit();
                  }
                }}
              />
            </div>

            {/* 전송 버튼 */}
            <button
              onClick={handleSubmit}
              disabled={!feedback.trim()}
              className={`p-2 rounded-lg transition-colors ${
                feedback.trim()
                  ? 'text-black hover:bg-gray-100'
                  : 'text-gray-300 cursor-not-allowed'
              }`}
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
