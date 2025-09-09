'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { SocialLoginButtons } from '../SocialLoginButtons';
import {
  defaultRegister,
  validateAuthCheckEmail,
  validateAuthReqEmail,
} from '@/api/auth';
import { useToast } from '@/hooks/use-toast';
import { useUserStore } from '@/stores/user-store';

interface SignupFormProps {
  signupCallbackFunc: () => void;
}

export default function SignUpForm({ signupCallbackFunc }: SignupFormProps) {
  const { toast } = useToast();
  const { setUser } = useUserStore();
  const [email, setEmail] = useState('');
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [agreements, setAgreements] = useState({
    over14: false,
    terms: false,
    marketing: false,
    sms: false,
  });
  const [password, setPassword] = useState('');
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [authCode, setAuthCode] = useState('');
  const [isEmailLoading, setIsEmailLoading] = useState(false);
  const [codeError, setCodeError] = useState('');
  const [timer, setTimer] = useState(599); // 9분59초
  const [isResending, setIsResending] = useState(false);
  const [isCodeVerified, setIsCodeVerified] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  // 인증코드 타이머
  useEffect(() => {
    if (!showCodeInput) return;
    if (timer <= 0) return;
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [showCodeInput, timer]);

  function formatTimer(sec: number) {
    const m = String(Math.floor(sec / 60)).padStart(2, '0');
    const s = String(sec % 60).padStart(2, '0');
    return `${m}:${s}`;
  }

  const handleEmailChange = (value: string) => {
    setEmail(value);
    setIsEmailValid(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value));
  };

  const isFormValid = agreements.over14 && agreements.terms;

  const validateEmail = async () => {
    if (isEmailLoading) return;
    setIsEmailLoading(true);
    toast({
      title: '이메일을 확인해주세요.',
      variant: 'default',
    });
    const data = await validateAuthReqEmail(email, 'signup');
    if (data.success === true) {
      toast({
        title: data.message,
        variant: 'default',
        duration: 1000,
      });
      setShowCodeInput(true);
    } else {
      toast({
        title: data.message,
        variant: 'destructive',
        duration: 1000,
      });
      setShowCodeInput(false);
    }
    setIsEmailLoading(false);
  };

  const handleCodeCheck = async () => {
    const data = await validateAuthCheckEmail(email, authCode, 'signup');
    if (data.success) {
      toast({
        title: data.message,
        variant: 'default',
        duration: 1000,
      });
      setCodeError('');
      setIsCodeVerified(true);
      setShowCodeInput(false); // 인증코드 영역 숨기기
    } else {
      setCodeError('올바른 인증코드가 아닙니다.');
      setIsCodeVerified(false);
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    setTimer(599);
    setCodeError('');

    const data = await validateAuthReqEmail(email, 'signup');

    if (data.success === true) {
      toast({
        title: data.message,
        variant: 'default',
        duration: 1000,
      });
    } else {
      toast({
        title: data.message,
        variant: 'destructive',
        duration: 1000,
      });
    }
  };

  function validatePassword(pw: string) {
    // 8~15자, 영문 대소문자, 숫자, 특수문자
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-={}\[\]:;"'<>,.?/~`|\\]).{8,15}$/;
    return regex.test(pw);
  }

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    if (!validatePassword(value)) {
      setPasswordError(
        '8~15자 영문 대소문자, 숫자, 특수문자를 모두 포함해야 합니다.',
      );
    } else {
      setPasswordError('');
    }
  };

  const handleSignUp = async () => {
    if (!validatePassword(password)) {
      setPasswordError(
        '8~15자 영문 대소문자, 숫자, 특수문자를 모두 포함해야 합니다.',
      );
      return;
    }
    const data = await defaultRegister(email, password);
    if (data.success) {
      // Zustand 스토어에 사용자 정보 설정 (회원가입 성공 시)
      setUser({
        id: data.user?.id || '',
        email: email,
        name: data.user?.name || null,
        role: data.user?.role || 'user',
        authProvider: 'local',
      });

      toast({
        title: data.message,
        variant: 'default',
        duration: 1000,
      });
      signupCallbackFunc();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      // 이메일 입력 필드에서 엔터키
      if (
        e.target === document.querySelector('input[placeholder="이메일 입력"]')
      ) {
        if (isEmailValid && !isEmailLoading) {
          validateEmail();
        }
      }
      // 인증코드 입력 필드에서 엔터키
      else if (
        e.target ===
        document.querySelector('input[placeholder="인증코드 입력"]')
      ) {
        if (authCode.length === 6) {
          handleCodeCheck();
        }
      }
      // 비밀번호 입력 필드에서 엔터키
      else if (
        e.target ===
        document.querySelector('input[placeholder="비밀번호 입력"]')
      ) {
        if (isFormValid && isCodeVerified) {
          handleSignUp();
        }
      }
    }
  };

  return (
    <div className="w-full space-y-6">
      <div className="space-y-2">
        <div className="flex items-center gap-4 py-2">
          <span className="font-bold text-center text-sm text-[#6A35A0]">
            간편 가입
          </span>
          <SocialLoginButtons />
        </div>

        <div className="flex flex-col gap-4">
          <label className="font-bold text-sm text-[#6A35A0]">일반가입</label>
          <div className="flex items-center">
            <input
              placeholder="이메일 입력"
              value={email}
              onChange={(e) => handleEmailChange(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full border-b border-purple-300 focus:outline-none focus:border-purple-500 py-2 placeholder-gray-400"
            />

            {isEmailValid && <span className="text-green-500 text-sm">✔</span>}
          </div>
        </div>
        <Button
          variant="default"
          className={`mt-8 w-full cursor-pointer text-white ${
            isCodeVerified
              ? 'bg-green-500 hover:bg-green-600'
              : 'bg-purple-300 hover:bg-purple-400'
          }`}
          onClick={validateEmail}
          disabled={!isEmailValid || isEmailLoading || isCodeVerified}
        >
          {isEmailLoading
            ? '인증 요청 중...'
            : isCodeVerified
            ? '이메일 인증 완료'
            : '이메일 인증'}
        </Button>
        {showCodeInput && (
          <div className="mt-4 p-6 rounded-xl bg-purple-100 flex flex-col items-center space-y-2 animate-fade-in">
            <div className="w-full text-center font-medium mb-2">
              이메일로 받은 인증코드를 입력해 주세요.
            </div>
            <div className="w-full flex items-center justify-between border-b border-purple-300 pb-1">
              <input
                className="bg-transparent outline-none flex-1"
                placeholder="인증코드 입력"
                value={authCode}
                onChange={(e) => setAuthCode(e.target.value)}
                onKeyPress={handleKeyPress}
                maxLength={6}
                inputMode="numeric"
              />
              <span className="text-sm text-red-400 font-semibold ml-2 min-w-[48px] text-right">
                {formatTimer(timer)}
              </span>
            </div>
            {codeError && (
              <div className="w-full text-left text-xs text-red-500 mt-1">
                {codeError}
              </div>
            )}
            <button
              type="button"
              className="w-full text-xs text-purple-600 underline text-left mt-1 disabled:opacity-50 cursor-pointer"
              onClick={handleResend}
              disabled={isResending}
            >
              인증코드 재발송
            </button>
            <button
              type="button"
              className="w-full mt-4 py-3 rounded-full bg-purple-300 text-white font-semibold text-base disabled:opacity-50 cursor-pointer"
              onClick={handleCodeCheck}
              disabled={authCode.length !== 6}
            >
              인증코드 확인
            </button>
          </div>
        )}
        <input
          type="password"
          placeholder="비밀번호 입력"
          value={password}
          onChange={(e) => handlePasswordChange(e.target.value)}
          onKeyPress={handleKeyPress}
          className="w-full border-b border-purple-300 focus:outline-none focus:border-purple-500 py-2 placeholder-gray-400"
        />
        {passwordError ? (
          <div className="text-xs text-red-500 mt-1">{passwordError}</div>
        ) : (
          password.length >= 8 && (
            <div className="text-xs text-green-600 mt-1">
              올바른 비밀번호입니다.
            </div>
          )
        )}
      </div>

      <div className="border p-4 rounded-md space-y-2 text-sm">
        <div className="flex items-center gap-2">
          <Checkbox
            checked={Object.values(agreements).every(Boolean)}
            onCheckedChange={(checked) => {
              const val = Boolean(checked);
              setAgreements({
                over14: val,
                terms: val,
                marketing: val,
                sms: val,
              });
            }}
          />
          <label>전체동의</label>
        </div>

        <div className="pl-4 space-y-2">
          <div className="flex items-center gap-2">
            <Checkbox
              checked={agreements.over14}
              onCheckedChange={(checked) =>
                setAgreements({ ...agreements, over14: Boolean(checked) })
              }
            />
            <span>
              만 14세 이상입니다. <span className="text-red-500">(필수)</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              checked={agreements.terms}
              onCheckedChange={(checked) =>
                setAgreements({ ...agreements, terms: Boolean(checked) })
              }
            />
            <span>
              이용약관 <span className="text-red-500">(필수)</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              checked={agreements.marketing}
              onCheckedChange={(checked) =>
                setAgreements({ ...agreements, marketing: Boolean(checked) })
              }
            />
            <span>개인정보 마케팅 활용 동의 (선택)</span>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              checked={agreements.sms}
              onCheckedChange={(checked) =>
                setAgreements({ ...agreements, sms: Boolean(checked) })
              }
            />
            <span>이벤트, 메일 및 SMS 수신 동의 (선택)</span>
          </div>
        </div>
      </div>

      <Button
        disabled={!isFormValid || !isCodeVerified}
        className="w-full cursor-pointer"
        onClick={handleSignUp}
      >
        회원가입하기
      </Button>
    </div>
  );
}
