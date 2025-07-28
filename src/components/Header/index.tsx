'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import SignUpForm from '@/components/SignUpForm';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import LoginForm from '../LoginForm';
import ResetPasswordForm from '../ResetPasswordForm';
import { getUser, logout } from '@/lib/auth';

const categories = ['All', 'Jazz', 'Pop&Rock', 'EDM', 'K-pop', '기타'];

const Header = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);
  const [isResetPasswordOpen, setIsResetPasswordOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // 컴포넌트 마운트 시 유저 정보 확인
    const currentUser = getUser();
    setUser(currentUser);
  }, []);

  const handleSignup = () => {
    setIsSignUpOpen(false); // 회원가입 폼 닫기
    setIsLoginOpen(true); // 회원가입 완료 후 로그인 폼 열기
  };

  const handleLogin = () => {
    setIsLoginOpen(false);
    // 로그인 성공 후 유저 정보 업데이트
    const currentUser = getUser();
    setUser(currentUser);
  };

  const handleSwitchToSignup = () => {
    setIsLoginOpen(false);
    setIsSignUpOpen(true);
  };

  const handleSwitchToResetPassword = () => {
    setIsLoginOpen(false);
    setIsResetPasswordOpen(true);
  };

  const handleLogout = () => {
    logout();
    setUser(null);
  };

  return (
    <>
      <header className="w-full bg-gradient-to-b from-primary to-white border-b border-primary">
        <div className="max-w-7xl mx-auto flex items-center justify-between py-4 px-6">
          <Link href="/demo">
            <div className="flex gap-2 items-center">
              <Image
                src="/logo.svg"
                alt="harmonic logo"
                width={32}
                height={32}
              />
              <h2 className="text-black font-bold">하모닉 허브</h2>
            </div>
          </Link>

          <div className="flex gap-4 items-center">
            {user ? (
              // 로그인된 상태
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-700">{user.email}</span>
                <Button
                  className="cursor-pointer bg-white text-black hover:bg-white/50 hover:text-black/50"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </div>
            ) : (
              // 로그인되지 않은 상태
              <>
                <Button
                  className="cursor-pointer bg-white text-black hover:bg-white/50 hover:text-black/50"
                  onClick={() => setIsLoginOpen(true)}
                >
                  Login
                </Button>

                <Button
                  className="cursor-pointer bg-white text-black hover:bg-white/50 hover:text-black/50"
                  onClick={() => setIsSignUpOpen(true)}
                >
                  Sign up
                </Button>
              </>
            )}
          </div>
        </div>

        <div className="text-center py-10">
          <div className="text-2xl md:text-3xl font-semibold text-purple-700 flex justify-center items-center gap-2">
            <span role="img" aria-label="music">
              🎼
            </span>
            음악은 즐거우려고 배우잖아요,
          </div>
          <p className="mt-2 text-gray-600 text-base md:text-lg">
            당신의 연습을 연주하듯 학습해 보세요.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex justify-center space-x-6 pb-4 text-sm md:text-base font-medium">
          {categories.map((cat, idx) => (
            <button
              key={idx}
              className={`${
                cat === 'All' ? 'text-purple-500' : 'text-gray-700'
              } hover:text-purple-700 cursor-pointer`}
            >
              {cat}
            </button>
          ))}
        </div>
      </header>

      <Dialog open={isSignUpOpen} onOpenChange={setIsSignUpOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">회원가입</DialogTitle>
          </DialogHeader>
          <SignUpForm signupCallbackFunc={handleSignup} />
        </DialogContent>
      </Dialog>

      <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">로그인</DialogTitle>
          </DialogHeader>
          <LoginForm
            loginCallbackFunc={handleLogin}
            signupCallbackFunc={handleSwitchToSignup}
            resetPasswordCallbackFunc={handleSwitchToResetPassword}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isResetPasswordOpen} onOpenChange={setIsResetPasswordOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">비밀번호 재설정</DialogTitle>
          </DialogHeader>
          <ResetPasswordForm resetPasswordCallbackFunc={handleLogin} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Header;
