import Image from 'next/image';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

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
          <Dialog>
            <DialogTrigger asChild>
              <button className="text-gray-700 hover:underline cursor-pointer">
                개인정보처리방침
              </button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold text-purple-700 mb-4">
                  개인정보처리방침
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-6 text-sm leading-relaxed">
                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-gray-700">
                    주식회사 에이미오(이하 "회사")는 이용자의 개인정보를
                    중요시하며, 「개인정보 보호법」 등 관련 법령을 준수합니다.
                    회사는 개인정보처리방침을 통해 이용자가 제공한 개인정보가
                    어떠한 용도와 방식으로 이용되고 있으며, 개인정보 보호를 위해
                    어떠한 조치를 취하고 있는지 알려드립니다.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="border-l-4 border-purple-300 pl-4">
                    <h3 className="font-semibold text-purple-700 mb-2">
                      1. 수집하는 개인정보 항목 및 방법
                    </h3>
                    <p className="mb-2">
                      회사는 회원가입, 서비스 이용, 고객 상담을 위해 아래와 같은
                      개인정보를 수집할 수 있습니다.
                    </p>
                    <ul className="space-y-1 ml-4">
                      <li>
                        <span className="font-medium">필수 항목:</span> 이메일,
                        비밀번호
                      </li>
                      <li>
                        <span className="font-medium">선택 항목:</span> 개인별
                        음악 관련 정보 외 없음
                      </li>
                      <li>
                        <span className="font-medium">자동 수집 항목:</span>{' '}
                        서비스 이용 기록, 접속 로그, 쿠키, IP 주소, 기기 정보
                      </li>
                    </ul>
                    <p className="mt-2 text-gray-600">
                      수집 방법은 홈페이지 회원가입, 서비스 이용 과정, 고객
                      문의를 통한 수집으로 이루어집니다.
                    </p>
                  </div>

                  <div className="border-l-4 border-purple-300 pl-4">
                    <h3 className="font-semibold text-purple-700 mb-2">
                      2. 개인정보의 이용 목적
                    </h3>
                    <p className="mb-2">
                      회사는 수집한 개인정보를 다음의 목적을 위해 활용합니다.
                    </p>
                    <ul className="space-y-1 ml-4">
                      <li>• 회원 관리 (회원제 서비스 제공, 본인확인)</li>
                      <li>
                        • 서비스 제공 (학습 도구 제공, 맞춤형 콘텐츠 추천)
                      </li>
                      <li>• 고객 응대 및 공지사항 전달</li>
                      <li>• 서비스 개선 및 신규 서비스 개발</li>
                      <li>• 법령상 의무 이행 및 분쟁 해결</li>
                    </ul>
                  </div>

                  <div className="border-l-4 border-purple-300 pl-4">
                    <h3 className="font-semibold text-purple-700 mb-2">
                      3. 개인정보의 보관 및 이용기간
                    </h3>
                    <p className="mb-2">
                      회사는 원칙적으로 개인정보 수집 및 이용 목적이 달성된
                      후에는 해당 정보를 지체 없이 파기합니다. 단, 관련 법령에
                      따라 일정 기간 보관할 수 있습니다.
                    </p>
                    <ul className="space-y-1 ml-4">
                      <li>• 회원 탈퇴 시 즉시 파기</li>
                      <li>• 전자상거래 관련 법령에 따른 기록 보관: 3~5년</li>
                    </ul>
                  </div>

                  <div className="border-l-4 border-purple-300 pl-4">
                    <h3 className="font-semibold text-purple-700 mb-2">
                      4. 개인정보 제3자 제공
                    </h3>
                    <p>
                      회사는 원칙적으로 이용자의 개인정보를 제3자에게 제공하지
                      않습니다. 다만, 이용자의 사전 동의가 있거나 법령에 근거한
                      경우 예외로 합니다.
                    </p>
                  </div>

                  <div className="border-l-4 border-purple-300 pl-4">
                    <h3 className="font-semibold text-purple-700 mb-2">
                      5. 개인정보 처리 위탁
                    </h3>
                    <p>
                      회사는 원활한 서비스 제공을 위해 필요한 경우 개인정보 처리
                      업무를 외부 전문 업체에 위탁할 수 있으며, 이 경우 관련
                      내용을 사전에 공지합니다.
                    </p>
                  </div>

                  <div className="border-l-4 border-purple-300 pl-4">
                    <h3 className="font-semibold text-purple-700 mb-2">
                      6. 이용자의 권리
                    </h3>
                    <p>
                      이용자는 언제든 자신의 개인정보를 조회하거나 수정할 수
                      있으며, 회원 탈퇴를 통해 개인정보 삭제를 요청할 수
                      있습니다.
                    </p>
                  </div>

                  <div className="border-l-4 border-purple-300 pl-4">
                    <h3 className="font-semibold text-purple-700 mb-2">
                      7. 개인정보 보호를 위한 조치
                    </h3>
                    <p>
                      회사는 개인정보 보호를 위해 관리적, 기술적, 물리적 보안
                      조치를 시행합니다.
                    </p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-purple-700 mb-2">
                      8. 개인정보 보호책임자
                    </h3>
                    <div className="space-y-1">
                      <p>
                        <span className="font-medium">성명:</span> 김효정
                      </p>
                      <p>
                        <span className="font-medium">이메일:</span>{' '}
                        amio.hh.kr@gmail.com
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <Dialog>
            <DialogTrigger asChild>
              <button className="text-gray-700 hover:underline cursor-pointer">
                이용약관
              </button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold text-purple-700 mb-4">
                  이용약관
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-6 text-sm leading-relaxed">
                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-gray-700">
                    본 약관은 주식회사 에이미오(이하 "회사")가 제공하는 웹 기반
                    음악 학습 도구 서비스 "하모닉허브" (이하 "서비스")의 이용과
                    관련하여 회사와 회원 간의 권리, 의무 및 책임사항을 규정함을
                    목적으로 합니다.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="border-l-4 border-purple-300 pl-4">
                    <h3 className="font-semibold text-purple-700 mb-2">
                      제1조 (목적)
                    </h3>
                    <p className="text-gray-700">
                      본 약관은 주식회사 에이미오(이하 "회사")가 제공하는 웹
                      기반 음악 학습 도구 서비스 "하모닉허브" (이하 "서비스")의
                      이용과 관련하여 회사와 회원 간의 권리, 의무 및 책임사항을
                      규정함을 목적으로 합니다.
                    </p>
                  </div>

                  <div className="border-l-4 border-purple-300 pl-4">
                    <h3 className="font-semibold text-purple-700 mb-2">
                      제2조 (정의)
                    </h3>
                    <ul className="space-y-1 ml-4">
                      <li>
                        <span className="font-medium">"회원"</span>이란 본
                        약관에 동의하고 서비스를 이용하는 자를 말합니다.
                      </li>
                      <li>
                        <span className="font-medium">"서비스"</span>란 회사가
                        운영하는 웹 플랫폼에서 제공하는 음악 학습 도구 및 관련
                        기능을 의미합니다.
                      </li>
                    </ul>
                  </div>

                  <div className="border-l-4 border-purple-300 pl-4">
                    <h3 className="font-semibold text-purple-700 mb-2">
                      제3조 (약관의 효력 및 변경)
                    </h3>
                    <p className="text-gray-700">
                      회사는 관련 법령을 위반하지 않는 범위에서 본 약관을 변경할
                      수 있으며, 변경 시 공지사항을 통해 사전 공지합니다.
                    </p>
                  </div>

                  <div className="border-l-4 border-purple-300 pl-4">
                    <h3 className="font-semibold text-purple-700 mb-2">
                      제4조 (회원 가입 및 관리)
                    </h3>
                    <ul className="space-y-1 ml-4">
                      <li>
                        • 회원가입은 이용자가 약관에 동의하고 필요한 정보를
                        입력함으로써 성립됩니다.
                      </li>
                      <li>
                        • 회원은 개인정보를 허위로 기재할 수 없으며, 그로 인해
                        발생하는 불이익은 회원 본인에게 있습니다.
                      </li>
                    </ul>
                  </div>

                  <div className="border-l-4 border-purple-300 pl-4">
                    <h3 className="font-semibold text-purple-700 mb-2">
                      제5조 (서비스의 제공 및 변경)
                    </h3>
                    <ul className="space-y-1 ml-4">
                      <li>
                        • 회사는 회원에게 음악 학습 도구 및 관련 서비스를
                        제공합니다.
                      </li>
                      <li>
                        • 회사는 운영상 필요에 따라 서비스 내용을 변경할 수
                        있으며, 사전에 공지합니다.
                      </li>
                    </ul>
                  </div>

                  <div className="border-l-4 border-purple-300 pl-4">
                    <h3 className="font-semibold text-purple-700 mb-2">
                      제6조 (회원의 의무)
                    </h3>
                    <p className="mb-2 text-gray-700">
                      회원은 다음 행위를 하여서는 안 됩니다.
                    </p>
                    <ul className="space-y-1 ml-4">
                      <li>• 타인의 개인정보 도용</li>
                      <li>• 서비스 운영 방해 행위</li>
                      <li>• 저작권 등 제3자의 권리 침해 행위</li>
                    </ul>
                  </div>

                  <div className="border-l-4 border-purple-300 pl-4">
                    <h3 className="font-semibold text-purple-700 mb-2">
                      제7조 (회사의 의무)
                    </h3>
                    <p className="text-gray-700">
                      회사는 안정적인 서비스 제공을 위해 최선을 다하며, 회원의
                      개인정보를 보호하기 위해 관련 법령을 준수합니다.
                    </p>
                  </div>

                  <div className="border-l-4 border-purple-300 pl-4">
                    <h3 className="font-semibold text-purple-700 mb-2">
                      제8조 (서비스 이용의 제한)
                    </h3>
                    <p className="text-gray-700">
                      회원이 본 약관을 위반할 경우, 회사는 회원의 서비스 이용을
                      제한하거나 회원 자격을 해지할 수 있습니다.
                    </p>
                  </div>

                  <div className="border-l-4 border-purple-300 pl-4">
                    <h3 className="font-semibold text-purple-700 mb-2">
                      제9조 (책임의 제한)
                    </h3>
                    <p className="text-gray-700">
                      회사는 천재지변, 불가항력, 회원의 귀책사유로 인해 발생한
                      문제에 대해 책임지지 않습니다.
                    </p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-purple-700 mb-2">
                      제10조 (준거법 및 분쟁 해결)
                    </h3>
                    <p className="text-gray-700">
                      본 약관은 대한민국 법률에 따라 해석되며, 서비스 이용과
                      관련하여 발생한 분쟁은 관할 법원에 제소합니다.
                    </p>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
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
