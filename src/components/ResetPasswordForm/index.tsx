'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  resetPassword,
  validateAuthCheckEmail,
  validateAuthReqEmail,
} from '@/api/auth';
import { useToast } from '@/hooks/use-toast';
import { getUser } from '@/lib/auth';

interface ResetPasswordFormProps {
  resetPasswordCallbackFunc: () => void;
}

export default function ResetPasswordForm({
  resetPasswordCallbackFunc,
}: ResetPasswordFormProps) {
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [authCode, setAuthCode] = useState('');
  const [isEmailLoading, setIsEmailLoading] = useState(false);
  const [codeError, setCodeError] = useState('');
  const [timer, setTimer] = useState(599); // 9분59초
  const [isResending, setIsResending] = useState(false);
  const [isCodeVerified, setIsCodeVerified] = useState(false);
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  // 컴포넌트 마운트 시 로그인된 유저 정보 확인
  useEffect(() => {
    const currentUser = getUser();
    if (currentUser?.email) {
      setEmail(currentUser.email);
      setIsEmailValid(true);
    }
  }, []);

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

  const validateEmail = async () => {
    if (isEmailLoading) return;
    setIsEmailLoading(true);
    const data = await validateAuthReqEmail(email, 'reset');
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
    const data = await validateAuthCheckEmail(email, authCode, 'reset');
    if (data.success) {
      toast({
        title: data.message,
        variant: 'default',
        duration: 1000,
      });
      setCodeError('');
      setIsCodeVerified(true);
      setShowPasswordInput(true);
    } else {
      setCodeError('올바른 인증코드가 아닙니다.');
      setIsCodeVerified(false);
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    setTimer(599);
    setCodeError('');

    const data = await validateAuthReqEmail(email, 'reset');

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
    setIsResending(false);
  };

  function validatePassword(pw: string) {
    // 8~15자, 영문 대소문자, 숫자, 특수문자
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-={}\[\]:;"'<>,.?/~`|\\]).{8,15}$/;
    return regex.test(pw);
  }

  const handleNewPasswordChange = (value: string) => {
    setNewPassword(value);
    if (!validatePassword(value)) {
      setPasswordError(
        '8~15자 영문 대소문자, 숫자, 특수문자를 모두 포함해야 합니다.',
      );
    } else {
      setPasswordError('');
    }
  };

  const handleConfirmPasswordChange = (value: string) => {
    setConfirmPassword(value);
    if (value !== newPassword) {
      setConfirmPasswordError('비밀번호가 일치하지 않습니다.');
    } else {
      setConfirmPasswordError('');
    }
  };

  const handleResetPassword = async () => {
    if (!validatePassword(newPassword)) {
      setPasswordError(
        '8~15자 영문 대소문자, 숫자, 특수문자를 모두 포함해야 합니다.',
      );
      return;
    }
    if (newPassword !== confirmPassword) {
      setConfirmPasswordError('비밀번호가 일치하지 않습니다.');
      return;
    }

    const data = await resetPassword(email, newPassword, confirmPassword);

    if (data.success) {
      toast({
        title: data.message,
        variant: 'default',
        duration: 2000,
      });
      resetPasswordCallbackFunc();
    } else {
      toast({
        title: data.message,
        variant: 'destructive',
        duration: 2000,
      });
    }
  };

  return (
    <div className="w-full space-y-6">
      <div className="space-y-2">
        <div className="flex flex-col gap-4">
          <label className="text-sm font-medium">이메일 입력</label>
          <div className="flex items-center">
            <Input
              placeholder="이메일 입력"
              value={email}
              onChange={(e) => handleEmailChange(e.target.value)}
            />
            {isEmailValid && <span className="text-green-500 text-sm">✔</span>}
          </div>
        </div>
        <Button
          variant="default"
          className="mt-8 w-full bg-purple-300 cursor-pointer text-white"
          onClick={validateEmail}
          disabled={!isEmailValid || isEmailLoading}
        >
          {isEmailLoading ? '인증 요청 중...' : '이메일 인증'}
        </Button>

        {showCodeInput && (
          <div className="mt-4 p-6 rounded-xl bg-purple-100 flex flex-col items-center space-y-2 animate-fade-in">
            <div className="w-full text-center text-lg font-medium mb-2">
              이메일로 받은 인증코드를 입력해 주세요.
            </div>
            <div className="w-full flex items-center justify-between border-b border-purple-300 pb-1">
              <input
                className="bg-transparent outline-none text-lg flex-1"
                placeholder="인증코드 입력"
                value={authCode}
                onChange={(e) => setAuthCode(e.target.value)}
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
              className="w-full mt-4 py-3 rounded-full bg-purple-300 hover:bg-purple-400 text-white font-semibold text-base disabled:opacity-50 cursor-pointer transition-colors duration-200"
              onClick={handleCodeCheck}
              disabled={authCode.length !== 6}
            >
              인증코드 확인
            </button>
          </div>
        )}

        {showPasswordInput && (
          <div className="mt-4 space-y-4 animate-fade-in">
            <div className="space-y-2">
              <label className="text-sm font-medium">새 비밀번호</label>
              <Input
                type="password"
                placeholder="새 비밀번호 입력"
                value={newPassword}
                onChange={(e) => handleNewPasswordChange(e.target.value)}
              />
              {passwordError ? (
                <div className="text-xs text-red-500 mt-1">{passwordError}</div>
              ) : (
                newPassword.length >= 8 && (
                  <div className="text-xs text-green-600 mt-1">
                    올바른 비밀번호입니다.
                  </div>
                )
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">새 비밀번호 확인</label>
              <Input
                type="password"
                placeholder="새 비밀번호 재입력"
                value={confirmPassword}
                onChange={(e) => handleConfirmPasswordChange(e.target.value)}
              />
              {confirmPasswordError && (
                <div className="text-xs text-red-500 mt-1">
                  {confirmPasswordError}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {showPasswordInput && (
        <Button
          disabled={
            !validatePassword(newPassword) || newPassword !== confirmPassword
          }
          className="w-full cursor-pointer"
          onClick={handleResetPassword}
        >
          비밀번호 재설정
        </Button>
      )}
    </div>
  );
}
