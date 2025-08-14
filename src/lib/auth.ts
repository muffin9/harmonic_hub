// 토큰 관리
export const setTokens = (accessToken: string, refreshToken: string) => {
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      localStorage.setItem('access_token', accessToken);
      localStorage.setItem('refresh_token', refreshToken);
    } catch (error) {
      console.error('Failed to set tokens:', error);
    }
  }
};

export const getAccessToken = (): string | null => {
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      return localStorage.getItem('access_token');
    } catch (error) {
      console.error('Failed to get access token:', error);
      return null;
    }
  }
  return null;
};

export const getRefreshToken = (): string | null => {
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      return localStorage.getItem('refresh_token');
    } catch (error) {
      console.error('Failed to get refresh token:', error);
      return null;
    }
  }
  return null;
};

export const removeTokens = () => {
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    } catch (error) {
      console.error('Failed to remove tokens:', error);
    }
  }
};

// 유저 정보 관리
export const setUser = (user: any) => {
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      localStorage.setItem('user', JSON.stringify(user));
    } catch (error) {
      console.error('Failed to set user:', error);
    }
  }
};

export const getUser = (): any | null => {
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error('Failed to get user:', error);
      return null;
    }
  }
  return null;
};

export const removeUser = () => {
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      localStorage.removeItem('user');
    } catch (error) {
      console.error('Failed to remove user:', error);
    }
  }
};

// 로그아웃
export const logout = () => {
  removeTokens();
  removeUser();
  if (typeof window !== 'undefined') {
    window.location.href = '/';
  }
};

// API 요청 시 토큰 자동 첨부
export const createAuthHeaders = (): HeadersInit => {
  const token = getAccessToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// 토큰 만료 체크 (JWT 디코딩)
export const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
};

// 인증 상태 체크
export const isAuthenticated = (): boolean => {
  const token = getAccessToken();
  if (!token) return false;

  return !isTokenExpired(token);
};
