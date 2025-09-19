import { createAuthHeaders } from '@/lib/auth';

interface ReviewData {
  content: string;
}

export const postReview = async (reviewData: ReviewData | string) => {
  try {
    // 문자열인 경우 객체로 변환
    const payload =
      typeof reviewData === 'string' ? { content: reviewData } : reviewData;

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/service-review`,
      {
        method: 'POST',
        headers: createAuthHeaders(),
        body: JSON.stringify(payload),
      },
    );

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('postReview error', error);
    return {
      status: false,
      message: '네트워크 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.',
    };
  }
};
