'use client';

import React, { useState } from 'react';
import { SocialLoginButtons } from '../SocialLoginButtons';
import { defaultLogin } from '@/api/auth';
import { useToast } from '@/hooks/use-toast';
import { setTokens } from '@/lib/auth';
import { useUserStore } from '@/stores/user-store';
import { Eye, EyeOff } from 'lucide-react';

interface LoginFormProps {
  loginCallbackFunc: () => void;
  signupCallbackFunc: () => void;
  resetPasswordCallbackFunc: () => void;
}

const LoginForm = ({
  loginCallbackFunc,
  signupCallbackFunc,
  resetPasswordCallbackFunc,
}: LoginFormProps) => {
  const { toast } = useToast();
  const { setUser } = useUserStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(true);

  const handleLogin = async () => {
    const result = await defaultLogin(email, password);

    if (result.access_token && result.refresh_token) {
      setTokens(result.access_token, result.refresh_token);

      // Zustand 스토어에 사용자 정보 설정
      setUser({
        id: result.user?.id || '',
        email: result.user?.email || email,
        name: result.user?.name || null,
        role: result.user?.role || 'user',
        authProvider: 'local',
      });

      toast({ title: '로그인 성공', variant: 'default', duration: 1000 });
      loginCallbackFunc();
      return;
    } else if (result.message) {
      toast({
        title: result.message,
        variant: 'destructive',
        duration: 3000,
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <section className="w-full space-y-6">
      <div className="space-y-4">
        {/* 간편 로그인 */}
        <div className="w-full flex gap-16">
          <span className="text-sm text-purple-600 font-medium mb-2">
            간편 로그인
          </span>
          <SocialLoginButtons />
        </div>

        {/* 서비스명 로그인 */}
        <div className="text-sm text-purple-600 font-medium mb-2">
          서비스명 로그인
        </div>

        <div className="mb-4">
          <input
            type="email"
            placeholder="이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyPress={handleKeyPress}
            className="w-full border-b border-purple-300 focus:outline-none focus:border-purple-500 py-2 placeholder-gray-400"
          />
        </div>

        <div className="mb-2 relative">
          <input
            type={showPassword ? 'password' : 'text'}
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={handleKeyPress}
            className="w-full border-b border-purple-300 focus:outline-none focus:border-purple-500 py-2 placeholder-gray-400 pr-10"
            autoComplete="current-password"
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        </div>

        <div className="mb-6 text-sm">
          {/* <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={saveEmail}
              onChange={() => setSaveEmail(!saveEmail)}
              className="accent-purple-500"
            />
            <span>이메일 저장</span>
          </label> */}
        </div>

        <button
          className="w-full bg-purple-400 hover:bg-purple-500 text-white py-2 rounded-full font-semibold mb-4 cursor-pointer"
          onClick={handleLogin}
        >
          로그인
        </button>

        <div className="flex justify-between text-xs text-gray-500">
          <button
            className="hover:underline cursor-pointer"
            onClick={resetPasswordCallbackFunc}
          >
            비밀번호 재설정
          </button>
          <button
            className="hover:underline cursor-pointer"
            onClick={signupCallbackFunc}
          >
            회원가입
          </button>
        </div>
      </div>
    </section>
  );
};

export default LoginForm;
