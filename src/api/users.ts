import { UserInfo, UserSetting } from '@/interface/user';
import { createAuthHeaders } from '@/lib/auth';

export const getUserInfo = async () => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/users/profile`,
      {
        method: 'GET',
        headers: createAuthHeaders(),
      },
    );

    const data: UserInfo = await response.json();
    return data;
  } catch (error) {
    console.error('getUserInfo error', error);
    return {
      status: false,
      message: '네트워크 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.',
    };
  }
};

export const getUserSetting = async () => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/users/setting`,
      {
        method: 'GET',
        headers: createAuthHeaders(),
      },
    );

    console.log('getUserSetting: Response status:', response.status);
    console.log('getUserSetting: Response ok:', response.ok);
    console.log('getUserSetting: Response headers:', response.headers);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('getUserSetting: data', data);
    return data.answer;
  } catch (error) {
    console.error('getUserSetting error', error);
    return {
      status: false,
      message: '알 수 없는 에러 발생, 잠시 후 다시 시도해 주세요.',
    };
  }
};

export const patchUserSetting = async (setting: UserSetting) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/users/setting`,
      {
        method: 'PATCH',
        headers: createAuthHeaders(),
        body: JSON.stringify(setting),
      },
    );

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('patchUserSetting error', error);
    return {
      status: false,
      message: '네트워크 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.',
    };
  }
};
