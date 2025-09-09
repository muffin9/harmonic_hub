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
    );

    const data = await response.json();
    return data.answer;
  } catch (error) {
    console.error('getUserSetting error', error);
    return {
      status: false,
      message: '네트워크 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.',
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
