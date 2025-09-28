import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import {
  getUser,
  isAuthenticated,
  logout as authLogout,
  setUser as authSetUser,
  removeUser as authRemoveUser,
} from '@/lib/auth';

export interface AppUser {
  id: string;
  email: string;
  name: string | null;
  role: string;
  authProvider: string;
}

interface UserState {
  // 상태
  user: AppUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // 액션
  setUser: (user: AppUser | null) => void;
  setLoading: (loading: boolean) => void;
  loadUser: () => void;
  logout: () => void;
  checkAuth: () => boolean;

  // 초기화
  reset: () => void;
}

const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
};

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      ...initialState,

      setUser: (user: AppUser | null) => {
        // auth.ts와 동기화
        if (user) {
          authSetUser(user);
        } else {
          authRemoveUser();
        }

        set({
          user,
          isAuthenticated: !!user,
          isLoading: false,
        });
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      loadUser: () => {
        const isAuth = isAuthenticated();
        if (isAuth) {
          const currentUser = getUser();
          set({
            user: currentUser,
            isAuthenticated: true,
            isLoading: false,
          });
        } else {
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      },

      logout: () => {
        authLogout();
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      },

      checkAuth: () => {
        return isAuthenticated();
      },

      reset: () => {
        set(initialState);
      },
    }),
    {
      name: 'user-storage', // localStorage 키
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        isLoading: state.isLoading,
      }), // user, isAuthenticated, isLoading persist
      onRehydrateStorage: () => (state) => {
        // 새로고침 시 auth.ts의 정보와 동기화
        if (state) {
          const isAuth = isAuthenticated();
          if (isAuth) {
            const currentUser = getUser();
            state.setUser(currentUser);
          } else {
            state.setUser(null);
          }
        }
      },
    },
  ),
);
