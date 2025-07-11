'use client';

import Link from 'next/link';
import React, { useState } from 'react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [saveEmail, setSaveEmail] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <section className="min-h-screen flex flex-col justify-center items-center bg-gray-50 py-12">
      <div className="bg-white rounded-xl w-full max-w-md p-8 shadow-lg relative">
        {/* 제목 */}
        <h2 className="text-2xl font-bold text-center mb-6">로그인</h2>

        {/* 간편 로그인 */}
        <div className="text-sm text-purple-600 font-medium mb-2">
          간편 로그인
        </div>
        <div className="flex justify-center gap-4 mb-6">
          <img src="/naver-icon.png" alt="Naver" className="w-6 h-6" />
          <img src="/kakao-icon.png" alt="Kakao" className="w-6 h-6" />
          <img src="/google-icon.png" alt="Google" className="w-6 h-6" />
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
            className="w-full border-b border-purple-300 focus:outline-none focus:border-purple-500 py-2 placeholder-gray-400"
          />
        </div>

        <div className="mb-2 relative">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border-b border-purple-300 focus:outline-none focus:border-purple-500 py-2 placeholder-gray-400"
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 text-sm"
          >
            👁
          </button>
        </div>

        <div className="mb-6 text-sm">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={saveEmail}
              onChange={() => setSaveEmail(!saveEmail)}
              className="accent-purple-500"
            />
            <span>이메일 저장</span>
          </label>
        </div>

        <button
          className="w-full bg-purple-400 hover:bg-purple-500 text-white py-2 rounded-full font-semibold mb-4 cursor-pointer"
          onClick={() => alert('서비스 준비중입니다.')}
        >
          로그인
        </button>

        <div className="flex justify-between text-xs text-gray-500">
          <Link href="/demo">
            <button className="hover:underline cursor-pointer">
              비밀번호 재설정
            </button>
          </Link>
          <Link href="/signup">
            <button className="hover:underline cursor-pointer">회원가입</button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Login;
