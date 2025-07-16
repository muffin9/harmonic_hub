export const validateAuthEmail = async (email: string) => {
  try {
    const content = { email: email, type: 'signup' };
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/request-email-verification`,
      {
        method: 'POST',
        body: JSON.stringify(content),
      },
    );

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('validate email error', error);
    return {
      status: false,
      message: '네트워크 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.',
    };
  }
};
