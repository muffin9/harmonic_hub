'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';

import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';
import SignUpForm from '@/components/SignUpForm';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import LoginForm from '../LoginForm';
import ResetPasswordForm from '../ResetPasswordForm';
import { getUser, isAuthenticated, logout } from '@/lib/auth';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu } from 'lucide-react';

type AppUser = {
  id: string;
  email: string;
  name: string | null;
  role: string;
  authProvider: string;
};

const categories = ['All', 'Jazz', 'Pop&Rock', 'EDM', 'K-pop', '기타'];

const Header = () => {
  const [authed, setAuthed] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);
  const [isResetPasswordOpen, setIsResetPasswordOpen] = useState(false);
  const [isMyInfoOpen, setIsMyInfoOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  const loadUser = useCallback(() => {
    const ok = isAuthenticated();
    setAuthed(ok);
    setUser(ok ? getUser() : null);
  }, []);

  useEffect(() => {
    loadUser();
    // 다른 탭/창에서 로그인/로그아웃 시 동기화
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'access_token' || e.key === 'user' || e.key === null) {
        loadUser();
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [loadUser]);

  const onLogout = () => {
    logout();
    setAuthed(false);
    setUser(null);
    setMenuOpen(false);
  };

  const handleSignup = () => {
    setIsSignUpOpen(false); // 회원가입 폼 닫기
    setIsLoginOpen(true); // 회원가입 완료 후 로그인 폼 열기
  };

  const handleLogin = () => {
    setIsLoginOpen(false);
    // 로그인 성공 후 유저 정보 업데이트
    const currentUser = getUser();
    setUser(currentUser);
    setAuthed(!!currentUser);
  };

  const handleSwitchToSignup = () => {
    setIsLoginOpen(false);
    setIsSignUpOpen(true);
  };

  const handleSwitchToResetPassword = () => {
    setIsLoginOpen(false);
    setIsResetPasswordOpen(true);
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

          <div className="flex items-center gap-3">
            {authed && user ? (
              <>
                <span className="hidden sm:inline text-sm text-gray-700">
                  {user.email}
                </span>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={onLogout}
                  className="cursor-pointer bg-white text-black hover:bg-white/50 hover:text-black/50"
                >
                  로그아웃
                </Button>

                {/* 햄버거 드롭다운 */}
                <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="메뉴 열기"
                      className="cursor-pointer"
                    >
                      <Menu className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>

                  {/* framer-motion으로 애니메이션 */}
                  <AnimatePresence>
                    {menuOpen && (
                      <DropdownMenuContent
                        align="end"
                        className="w-44 p-0 overflow-hidden"
                        asChild
                      >
                        <motion.div
                          initial={{ opacity: 0, scale: 0.98, y: -4 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.98, y: -4 }}
                          transition={{ duration: 0.12, ease: 'easeOut' }}
                        >
                          {user?.authProvider === 'local' && (
                            <DropdownMenuItem
                              onClick={() => {
                                setMenuOpen(false);
                                setIsMyInfoOpen(true);
                              }}
                              className="p-4"
                            >
                              내정보
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem
                            onClick={() => {
                              alert('서비스 준비중입니다..');
                            }}
                            className="p-4"
                          >
                            상세설정
                          </DropdownMenuItem>
                        </motion.div>
                      </DropdownMenuContent>
                    )}
                  </AnimatePresence>
                </DropdownMenu>
              </>
            ) : (
              // 비로그인 상태
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
          <ResetPasswordForm
            resetPasswordCallbackFunc={() => {
              setIsResetPasswordOpen(false);
              setIsLoginOpen(true);
            }}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isMyInfoOpen} onOpenChange={setIsMyInfoOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-left text-lg font-semibold text-purple-600">
              내 정보
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* 아이디 표시 */}
            <div className="grid grid-cols-[80px_1fr] items-center gap-4">
              <span className="text-sm text-gray-700">아이디</span>
              <span className="text-sm text-gray-900 break-all">
                {user?.email}
              </span>
            </div>

            {/* 비밀번호 변경 */}
            <div className="grid grid-cols-[80px_1fr] items-center gap-4">
              <span className="text-sm text-gray-700">비밀번호 변경</span>
              <div>
                <Button
                  className="rounded-full bg-purple-400 hover:bg-purple-500 text-white"
                  onClick={() => {
                    setIsMyInfoOpen(false);
                    setIsResetPasswordOpen(true); // 기존 비밀번호 재설정 다이얼로그 열기
                  }}
                >
                  비밀번호 재설정
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Header;
