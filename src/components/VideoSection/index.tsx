export default function VideoSection() {
  return (
    <div className="max-w-[1040px] mx-auto px-4 py-12">
      <div className="flex justify-between items-center gap-[90px]">
        {/* 왼쪽: 비디오 영역 */}
        <div className="w-[50%]">
          <div className="w-full h-[300px] border-2 border-gray-800 rounded-lg flex items-center justify-center bg-gray-50">
            <span className="text-xl font-medium text-gray-800">영상</span>
          </div>
        </div>

        {/* 오른쪽: 텍스트 영역 */}
        <div className="w-[50%] flex flex-col gap-16">
          <h2 className="text-2xl font-bold text-[#593A51] leading-relaxed">
            초보자도 쉽게 시작할 수 있는
            <br />
            음악 학습 코치입니다 :)
          </h2>

          <p className="text-[#C187B3] leading-relaxed">
            편하게 장르를 선택하면 멜로디, 반주, 키에 맞게 스케일을
            <br />
            자연스럽게 기억하면 신나게 학습할 수 있어요
          </p>
        </div>
      </div>
    </div>
  );
}
