import Image from 'next/image';

export const SocialLoginButtons = () => {
  return (
    <div className="flex justify-center gap-4">
      <Image
        src="/naver.svg"
        alt="Naver"
        width={30}
        height={30}
        className="cursor-pointer"
      />
      <Image
        src="/google.svg"
        alt="Google"
        width={30}
        height={30}
        className="cursor-pointer"
      />
      <Image
        src="/kakao.svg"
        alt="Kakao"
        width={30}
        height={30}
        className="cursor-pointer"
      />
    </div>
  );
};
