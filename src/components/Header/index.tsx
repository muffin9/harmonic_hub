'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useState } from 'react';
import SignUpForm from '@/components/SignUpForm';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import LoginForm from '../LoginForm';

const categories = ['All', 'Jazz', 'Pop&Rock', 'EDM', 'K-pop', '기타'];

const Header = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);

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

          <div className="flex gap-4">
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
          <SignUpForm />
        </DialogContent>
      </Dialog>

      <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">로그인</DialogTitle>
          </DialogHeader>
          <LoginForm />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Header;
