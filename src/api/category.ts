import { apiAuthFetch } from './auth';

export const getMusicCategories = async () => {
  try {
    const response = await apiAuthFetch(
      `${process.env.NEXT_PUBLIC_API_URL}/bigs`,
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('get music categories error');
  }
};

export const getSubGenres = async (categoryId: number) => {
  try {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/smalls?big=${categoryId}`;

    const response = await apiAuthFetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('get sub genres error');
  }
};

export const getScales = async (categoryId: number, subGenreId: number) => {
  try {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/scales?big=${categoryId}&small=${subGenreId}`;

    const response = await apiAuthFetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('get scales error');
  }
};
