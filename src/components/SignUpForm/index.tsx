'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { SocialLoginButtons } from '../SocialLoginButtons';
import { validateAuthEmail } from '@/api/auth';
import { useToast } from '@/hooks/use-toast';

export default function SignUpForm() {
  const { toast } = useToast();
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

  const handleEmailChange = (value: string) => {
    setEmail(value);
    setIsEmailValid(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value));
  };

  const isFormValid = agreements.over14 && agreements.terms;

  const validateEmail = async () => {
    toast({
      title: 'test',
      variant: 'default',
    });
    const data = await validateAuthEmail(email);
    if (data.status === true) {
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
  };

  const handleSignUp = () => {
    alert('회원가입 서비스 준비중입니다..');
  };

  return (
    <div className="w-full space-y-6">
      <div className="space-y-2">
        <div className="flex flex-col gap-4">
          <label className="text-sm font-medium">일반가입</label>
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
          className="mt-8 w-full bg-purple-300 cursor-pointer"
          onClick={validateEmail}
          disabled={!isEmailValid}
        >
          이메일 인증
        </Button>
        {showCodeInput && (
          <div className="mt-4 space-y-2 animate-fade-in">
            <label className="text-sm font-medium">
              이메일로 받은 인증코드 입력
            </label>
            <Input
              placeholder="인증코드 입력"
              value={authCode}
              onChange={(e) => setAuthCode(e.target.value)}
            />
          </div>
        )}
        <Input
          type="password"
          placeholder="비밀번호 입력"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-2"
        />
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
        disabled={!isFormValid}
        className="w-full cursor-pointer"
        onClick={handleSignUp}
      >
        회원가입하기
      </Button>

      <div className="font-bold text-center text-sm text-primary">
        간편 가입
      </div>
      <SocialLoginButtons />
    </div>
  );
}
