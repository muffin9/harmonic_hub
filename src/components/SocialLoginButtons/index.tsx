import { kakaoLogin } from '@/api/auth';
import Image from 'next/image';

export const SocialLoginButtons = () => {
  return (
    <div className="flex justify-center gap-4">
      <Image
        src="/naver_logo.png"
        alt="Naver"
        width={30}
        height={30}
        className="cursor-pointer"
        onClick={async () => {
          window.location.href =
            'https://dev.harmonichub.co.kr/api/v1/auth/naver';
        }}
      />
      <Image
        src="/google_logo.png"
        alt="Google"
        width={30}
        height={30}
        className="cursor-pointer"
        onClick={async () => {
          window.location.href =
            'https://dev.harmonichub.co.kr/api/v1/auth/google';
        }}
      />
      <Image
        src="/kakao_logo.png"
        alt="Kakao"
        width={30}
        height={30}
        className="cursor-pointer"
        onClick={async () => {
          window.location.href =
            'https://dev.harmonichub.co.kr/api/v1/auth/kakao';
        }}
      />
    </div>
  );
};
