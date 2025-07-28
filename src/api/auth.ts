export const validateAuthReqEmail = async (email: string, type: string) => {
  try {
    const content = { email: email, type: type };
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/request-email-verification`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
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

export const validateAuthCheckEmail = async (
  email: string,
  code: string,
  type: string,
) => {
  try {
    const content = { email: email, code: code, type: type };

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/verify-email-code`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
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

export const defaultRegister = async (email: string, password: string) => {
  try {
    const content = { email, password };

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
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

export const defaultLogin = async (email: string, password: string) => {
  try {
    const content = { email, password };

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(content),
      },
    );

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('validate login error', error);
    return {
      status: false,
      message: '네트워크 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.',
    };
  }
};

export const kakaoLogin = async () => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/kakao`,
    );
    console.log(response);
  } catch (error) {
    console.error('kakao login error', error);
  }
};

export const resetPassword = async (
  email: string,
  newPassword: string,
  newPasswordConfirm: string,
) => {
  try {
    const content = { email, newPassword, newPasswordConfirm };

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/reset-password`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(content),
      },
    );

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('reset password error', error);
  }
};
