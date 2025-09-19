'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ThumbsUp, ThumbsDown, Send } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useUserStore } from '@/stores/user-store';
import { postReview } from '@/api/review';
import { useToast } from '@/hooks/use-toast';

export default function Review() {
  const [feedback, setFeedback] = useState('');
  const [selectedReaction, setSelectedReaction] = useState<
    'positive' | 'negative' | null
  >(null);
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);
  const [isFeedbackDialogOpen, setIsFeedbackDialogOpen] = useState(false);
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);
  const [likeCount, setLikeCount] = useState(1537); // 좋아요 개수 상태
  const [negativeFeedback, setNegativeFeedback] = useState(''); // 싫어요 피드백
  const [hasLikedToday, setHasLikedToday] = useState(false); // 오늘 좋아요를 눌렀는지 여부
  const [isLikeDisabled, setIsLikeDisabled] = useState(false); // 좋아요 버튼 비활성화 여부
  const [loginDialogType, setLoginDialogType] = useState<
    'like' | 'review' | null
  >(null); // 로그인 다이얼로그 타입

  // Zustand 스토어에서 로그인 상태 가져오기
  const { isAuthenticated } = useUserStore();
  const { toast } = useToast();

  // 오늘 좋아요를 눌렀는지 확인하는 함수
  const checkTodayLikeStatus = () => {
    if (!isAuthenticated) return;

    const today = new Date().toDateString();
    const lastLikeDate = localStorage.getItem('lastLikeDate');
    const hasLiked = lastLikeDate === today;

    setHasLikedToday(hasLiked);
    setIsLikeDisabled(hasLiked);
  };

  // 컴포넌트 마운트 시 오늘 좋아요 상태 확인
  useEffect(() => {
    checkTodayLikeStatus();
  }, [isAuthenticated]);

  const handleReactionClick = (reaction: 'positive' | 'negative') => {
    if (!isAuthenticated) {
      setLoginDialogType('like');
      setIsLoginDialogOpen(true);
      return;
    }

    // 좋아요 버튼을 누른 경우
    if (reaction === 'positive') {
      // 이미 오늘 좋아요를 눌렀다면 토스트 메시지 표시
      if (hasLikedToday) {
        toast({
          title: '하루에 한 번만 좋아요를 누를 수 있습니다',
          description: '내일 다시 좋아요를 눌러주세요!',
          variant: 'default',
          duration: 2000,
        });
        return;
      }

      // 좋아요 처리
      setSelectedReaction('positive');
      setLikeCount((prev) => prev + 1);
      setHasLikedToday(true);
      setIsLikeDisabled(true);

      // 오늘 날짜를 localStorage에 저장
      const today = new Date().toDateString();
      localStorage.setItem('lastLikeDate', today);

      toast({
        title: '좋아요를 눌렀습니다!',
        description: '소중한 의견 감사합니다.',
        variant: 'default',
        duration: 2000,
      });
    } else {
      // 싫어요 버튼을 누른 경우
      if (selectedReaction === 'negative') {
        // 이미 싫어요를 누른 상태라면 취소
        setSelectedReaction(null);
      } else {
        // 싫어요를 누르지 않은 상태라면 싫어요 + 피드백 다이얼로그 표시
        setSelectedReaction('negative');
        setIsFeedbackDialogOpen(true);
      }
    }
  };

  const handleInputClick = () => {
    if (!isAuthenticated) {
      setLoginDialogType('review');
      setIsLoginDialogOpen(true);
      return;
    }
  };

  const handleSubmit = async () => {
    if (!isAuthenticated) {
      setLoginDialogType('review');
      setIsLoginDialogOpen(true);
      return;
    }

    if (!feedback.trim()) return;

    try {
      // API 호출로 피드백 전송
      const result = await postReview({
        content: feedback,
      });

      if (result.status === false) {
        // API에서 실패 응답을 받은 경우
        toast({
          title: '피드백 전송 실패',
          description:
            result.message || '피드백을 전송하는 중 오류가 발생했습니다.',
          variant: 'destructive',
          duration: 3000,
        });
        return;
      }

      // 성공한 경우 - 모달창 표시
      setIsSuccessDialogOpen(true);

      // 폼 초기화
      setFeedback('');
      setSelectedReaction(null);
    } catch (error) {
      console.error('Feedback submission error:', error);
      toast({
        title: '피드백 전송 실패',
        description:
          '네트워크 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.',
        variant: 'destructive',
        duration: 3000,
      });
    }
  };

  const handleNegativeFeedbackSubmit = async () => {
    if (!negativeFeedback.trim()) return;

    try {
      // API 호출로 싫어요 피드백 전송
      const result = await postReview({
        content: negativeFeedback,
      });

      if (result.status === false) {
        // API에서 실패 응답을 받은 경우
        toast({
          title: '피드백 전송 실패',
          description:
            result.message || '피드백을 전송하는 중 오류가 발생했습니다.',
          variant: 'destructive',
          duration: 3000,
        });
        return;
      }

      // 성공한 경우
      toast({
        title: '피드백이 전송되었습니다!',
        description:
          '소중한 의견 감사합니다. 더 나은 서비스로 만들어가겠습니다.',
        variant: 'default',
        duration: 3000,
      });

      // 피드백 초기화
      setNegativeFeedback('');
      setIsFeedbackDialogOpen(false);
    } catch (error) {
      console.error('Negative feedback submission error:', error);
      toast({
        title: '피드백 전송 실패',
        description:
          '네트워크 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.',
        variant: 'destructive',
        duration: 3000,
      });
    }
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
          <span className="text-[40px]">{likeCount.toLocaleString()}</span>
        </div>
      </div>

      {/* 피드백 입력 영역 */}
      <div className="max-w-2xl h-[74px] mx-auto">
        <div className="bg-white rounded-2xl px-4 py-2 border border-gray-100 shadow-[2.21px_2.21px_51px_0px_#d2b7cb]">
          <div className="flex items-center gap-3">
            {/* 반응 버튼들 */}
            <div className="flex gap-2">
              <button
                onClick={() => handleReactionClick('positive')}
                disabled={isLikeDisabled}
                className={`p-2 rounded-lg transition-colors ${
                  isLikeDisabled
                    ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                    : selectedReaction === 'positive'
                    ? 'border-green-500 bg-green-50 text-green-600 cursor-pointer'
                    : 'border-gray-300 text-gray-500 hover:border-gray-400 cursor-pointer'
                }`}
              >
                <ThumbsUp className="h-5 w-5" />
              </button>
              <button
                onClick={() => handleReactionClick('negative')}
                className={`p-2 rounded-lg transition-colors cursor-pointer ${
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
              <textarea
                maxLength={500}
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                onClick={handleInputClick}
                placeholder="학습한 후기나 개선점을 남겨주세요."
                className="w-full border-0 pt-8 outline-none text-black placeholder-black cursor-pointer resize-none"
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

      {/* 로그인 유도 다이얼로그 */}
      <Dialog open={isLoginDialogOpen} onOpenChange={setIsLoginDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">
              <div className="text-4xl">🔒</div>
            </DialogTitle>
          </DialogHeader>
          <div className="text-center py-2">
            <p className="text-gray-600 mb-6">
              {loginDialogType === 'like'
                ? '로그인 후 눌러주세요!'
                : '로그인 후 후기를 남겨주세요!'}
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* 성공 다이얼로그 */}
      <Dialog open={isSuccessDialogOpen} onOpenChange={setIsSuccessDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">
              <div className="text-4xl mb-3">🎉</div>
              <div className="text-lg font-semibold text-purple-600">
                피드백이 전송되었습니다!
              </div>
            </DialogTitle>
          </DialogHeader>
          <div className="text-center py-2">
            <p className="text-gray-600 mb-6">
              소중한 의견 감사합니다. 더 나은 서비스로 만들어가겠습니다.
            </p>
            <Button
              onClick={() => setIsSuccessDialogOpen(false)}
              className="px-6 bg-purple-600 hover:bg-purple-700"
            >
              확인
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 싫어요 피드백 다이얼로그 */}
      <Dialog
        open={isFeedbackDialogOpen}
        onOpenChange={setIsFeedbackDialogOpen}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-lg font-semibold text-purple-600">
              어떤 부분이 마음에 안드셨나요?ㅠㅠ
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-center text-gray-600 mb-4">
              의견을 적어주시면 더 좋은 서비스로 만들어 가겠습니다 (__)
            </p>
            <div className="flex gap-3 justify-end mt-4">
              <Button
                onClick={() => {
                  setIsFeedbackDialogOpen(false);
                  setNegativeFeedback('');
                }}
                variant="outline"
                className="px-6"
              >
                취소
              </Button>
              <Button
                onClick={handleNegativeFeedbackSubmit}
                disabled={!negativeFeedback.trim()}
                className="px-6 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400"
              >
                제출
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
