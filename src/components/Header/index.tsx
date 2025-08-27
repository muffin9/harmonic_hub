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
import MusicPreferenceForm from '../MusicPreferenceForm';
import { getUser, isAuthenticated, logout } from '@/lib/auth';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu } from 'lucide-react';
import { getUserInfo } from '@/api/users';
import { getMusicCategories } from '@/api/category';
import { useMusicStore } from '@/stores/music-store';

type AppUser = {
  id: string;
  email: string;
  name: string | null;
  role: string;
  authProvider: string;
};

interface MusicCategory {
  id: number;
  nameKo: string;
  nameEn: string;
  slug: string;
  isActive: boolean;
}

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<AppUser | null>(null);

  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);
  const [isResetPasswordOpen, setIsResetPasswordOpen] = useState(false);
  const [isMyInfoOpen, setIsMyInfoOpen] = useState(false);
  const [isMusicPreferenceOpen, setIsMusicPreferenceOpen] = useState(false);

  // Zustand 스토어에서 음악 상태 가져오기
  const {
    selectedCategory,
    setSelectedCategory,
    categories: musicCategories,
    setCategories,
    setCategoriesLoading,
  } = useMusicStore();

  const loadUser = useCallback(() => {
    const ok = isAuthenticated();
    if (ok) {
      const currentUser = getUser();
      setUser(currentUser);
    } else {
      setUser(null);
    }
  }, []);

  const loadMusicCategories = useCallback(async () => {
    try {
      setCategoriesLoading(true);
      const categories = await getMusicCategories();
      if (categories && Array.isArray(categories)) {
        setCategories(categories);
      }
    } catch (error) {
      console.error('Failed to load music categories:', error);
    } finally {
      setCategoriesLoading(false);
    }
  }, [setCategories, setCategoriesLoading]);

  useEffect(() => {
    loadUser();
    loadMusicCategories();
    // 다른 탭/창에서 로그인/로그아웃 시 동기화
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'access_token' || e.key === 'user' || e.key === null) {
        loadUser();
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [loadUser, loadMusicCategories]);

  const onLogout = () => {
    logout();
    setUser(null);
    setMenuOpen(false);
  };

  const handleGetUser = async () => {
    const userInfo = await getUserInfo();

    if (userInfo && 'id' in userInfo) {
      setUser(userInfo);
    } else {
      setUser(null);
    }
  };

  const handleSignup = () => {
    setIsSignUpOpen(false); // 회원가입 폼 닫기
    setIsLoginOpen(true); // 회원가입 완료 후 로그인 폼 열기
  };

  const handleLogin = () => {
    setIsLoginOpen(false);
    handleGetUser();
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
      <header
        className="w-full h-[238px] relative bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(/header_bg.png)' }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between py-4 px-6">
          <Link href="/">
            <div className="flex gap-2 items-center">
              <Image
                src="/logo.svg"
                alt="harmonic logo"
                width={32}
                height={32}
              />
              <h2 className="text-black font-bold">하모닉허브</h2>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            {user ? (
              // 로그인된 상태
              <div className="flex items-center gap-3">
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
                              className="p-4 cursor-pointer"
                            >
                              내정보
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem
                            onClick={() => {
                              setMenuOpen(false);
                              setIsMusicPreferenceOpen(true);
                            }}
                            className="p-4 cursor-pointer"
                          >
                            상세설정
                          </DropdownMenuItem>
                        </motion.div>
                      </DropdownMenuContent>
                    )}
                  </AnimatePresence>
                </DropdownMenu>
              </div>
            ) : (
              // 비로그인 상태
              <>
                <Button
                  className="cursor-pointer bg-white text-black hover:bg-white/50 hover:text-black/50"
                  onClick={() => setIsLoginOpen(true)}
                >
                  로그인
                </Button>
                <Button
                  className="cursor-pointer bg-white text-black hover:bg-white/50 hover:text-black/50"
                  onClick={() => setIsSignUpOpen(true)}
                >
                  회원가입
                </Button>
              </>
            )}
          </div>
        </div>

        <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 text-center">
          <div className="text-2xl md:text-3xl font-semibold text-purple-700 flex justify-center items-center gap-2">
            <span role="img" aria-label="music">
              🎼
            </span>
            음악은 즐거우려고 배우잖아요,
          </div>
          <p className="mt-2 text-[#9575AD] text-base md:text-2xl">
            당신의 연습을 연주하듯 학습해 보세요.
          </p>
        </div>

        {/* 음악 카테고리 탭 */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex justify-center space-x-6 text-sm md:text-base font-medium">
          {musicCategories.map((category) => (
            <button
              key={category.id}
              className={`${
                selectedCategory === category.id
                  ? 'text-purple-500'
                  : 'text-gray-700'
              } hover:text-purple-700 cursor-pointer`}
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.nameEn}
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
            resetPasswordCallbackFunc={handleSwitchToResetPassword}
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

      <Dialog
        open={isMusicPreferenceOpen}
        onOpenChange={setIsMusicPreferenceOpen}
      >
        <DialogContent className="sm:max-w-2xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="py-2 text-lg font-semibold text-purple-600">
              상세설정
            </DialogTitle>
          </DialogHeader>
          <MusicPreferenceForm
            onComplete={() => {
              setIsMusicPreferenceOpen(false);
              // TODO: 완료 후 처리 (예: 토스트 메시지)
            }}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Header;
