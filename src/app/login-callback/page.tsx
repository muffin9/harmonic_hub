'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { setTokens, setUser } from '@/lib/auth';

interface LoginResponse {
  access_token: string;
  refresh_token: string;
  user: {
    id: string;
    email: string;
    name: string;
    profile_image?: string;
  };
}

export default function LoginCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleLoginCallback = async () => {
      try {
        // URL 파라미터에서 토큰 정보 추출
        const accessToken = searchParams.get('access_token');
        const refreshToken = searchParams.get('refresh_token');
        const userData = searchParams.get('user');

        if (!accessToken || !refreshToken || !userData) {
          throw new Error('로그인 정보가 누락되었습니다.');
        }

        // 유저 정보 파싱
        const user = JSON.parse(decodeURIComponent(userData));

        // 토큰과 유저 정보를 안전하게 저장
        setTokens(accessToken, refreshToken);
        setUser(user);

        toast({
          title: '로그인 성공',
          description: `${user.name}님 환영합니다!`,
          variant: 'default',
          duration: 2000,
        });

        // 메인 페이지로 리다이렉트
        router.push('/demo');
      } catch (error) {
        console.error('Login callback error:', error);
        toast({
          title: '로그인 실패',
          description: '로그인 처리 중 오류가 발생했습니다.',
          variant: 'destructive',
          duration: 3000,
        });
        router.push('/');
      } finally {
        setIsLoading(false);
      }
    };

    handleLoginCallback();
  }, [searchParams, router, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-600">로그인 처리 중...</p>
        </div>
      </div>
    );
  }

  return null;
}
