export default function Loading() {
  return (
    <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-20 flex items-center justify-center rounded-lg">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-gray-500 text-sm mt-2">잠시만 기다려주세요</p>
      </div>
    </div>
  );
}
