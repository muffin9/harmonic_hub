import Image from 'next/image';

const Footer = () => {
  return (
    <footer className="text-sm text-gray-700 pt-20 pb-4">
      <div className="px-12 py-6">
        <div className="flex items-center gap-2 mb-3">
          <Image src="/logo.svg" alt="harmonic logo" width={24} height={24} />
          <span className="text-lg font-bold text-purple-700">하모닉허브</span>
        </div>

        <div className="flex flex-wrap gap-4 text-sm mb-2">
          <span>고객센터 오전 10시 ~ 오후 6시 (주말, 공휴일 제외)</span>
          <a href="#" className="text-gray-700 hover:underline">
            개인정보처리방침
          </a>
          <a href="#" className="text-gray-700 hover:underline">
            이용약관
          </a>
        </div>

        <div className="text-sm text-gray-600">
          <p className="mb-1">
            주식회사 에이미오 &nbsp;&nbsp;&nbsp; 대표 김태윤 &nbsp;&nbsp;&nbsp;
            부산광역시 영도구 태종로 105번길 37-2 3층 &nbsp;&nbsp;&nbsp; 이메일{' '}
            <a
              href="mailto:amio.hh.kr@gmail.com"
              className="hover:text-purple-700 no-underline"
            >
              amio.hh.kr@gmail.com
            </a>
          </p>
          <a href="#" className="underline hover:text-purple-700">
            사업자정보 자세히보기
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
