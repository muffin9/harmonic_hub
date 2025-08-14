import { create } from 'zustand';

export interface MusicCategory {
  id: number;
  nameKo: string;
  nameEn: string;
  parentId: number | null;
}

export interface SubGenre {
  id: number;
  nameKo: string;
  nameEn: string;
  parentId: number | null;
}

export interface Scale {
  id: number;
  nameKo: string;
  nameEn: string;
  value: string;
  imageUrl: string;
  isActive: boolean;
}

interface MusicState {
  // 상태
  selectedCategory: string;
  selectedSubGenre: string;
  selectedScale: string;
  tempo: number;
  categories: MusicCategory[];
  subGenres: SubGenre[];
  scales: Scale[];

  // 로딩 상태
  isCategoriesLoading: boolean;
  isSubGenresLoading: boolean;
  isScalesLoading: boolean;

  // 액션
  setSelectedCategory: (category: string) => void;
  setSelectedSubGenre: (subGenre: string) => void;
  setSelectedScale: (scale: string) => void;
  setTempo: (tempo: number) => void;
  setCategories: (categories: MusicCategory[]) => void;
  setSubGenres: (subGenres: SubGenre[]) => void;
  setScales: (scales: Scale[]) => void;
  setCategoriesLoading: (loading: boolean) => void;
  setSubGenresLoading: (loading: boolean) => void;
  setScalesLoading: (loading: boolean) => void;

  // 초기화
  reset: () => void;
}

const initialState = {
  selectedCategory: 'All',
  selectedSubGenre: 'Bossanova',
  selectedScale: 'dorian',
  tempo: 120,
  categories: [],
  subGenres: [],
  scales: [],
  isCategoriesLoading: true,
  isSubGenresLoading: false,
  isScalesLoading: false,
};

export const useMusicStore = create<MusicState>((set, get) => ({
  ...initialState,

  setSelectedCategory: (category: string) => {
    set({ selectedCategory: category });
    // 카테고리가 변경되면 관련 서브장르와 스케일도 초기화
    set({
      selectedSubGenre: 'Bossanova',
      selectedScale: 'dorian',
    });
  },

  setSelectedSubGenre: (subGenre: string) => {
    set({ selectedSubGenre: subGenre });
  },

  setSelectedScale: (scale: string) => {
    set({ selectedScale: scale });
  },

  setTempo: (tempo: number) => {
    set({ tempo });
  },

  setCategories: (categories: MusicCategory[]) => {
    set({ categories });
    // 첫 번째 카테고리를 기본 선택으로 설정
    if (categories.length > 0) {
      set({ selectedCategory: categories[0].nameEn });
    }
  },

  setSubGenres: (subGenres: SubGenre[]) => {
    set({ subGenres });
  },

  setScales: (scales: Scale[]) => {
    set({ scales });
  },

  setCategoriesLoading: (loading: boolean) => {
    set({ isCategoriesLoading: loading });
  },

  setSubGenresLoading: (loading: boolean) => {
    set({ isSubGenresLoading: loading });
  },

  setScalesLoading: (loading: boolean) => {
    set({ isScalesLoading: loading });
  },

  reset: () => {
    set(initialState);
  },
}));
