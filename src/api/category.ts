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

export const getSubGenres = async (big: string) => {
  try {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/smalls?big=${big}`;

    const response = await apiAuthFetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('get sub genres error');
  }
};

export const getScales = async (big: string, small: string) => {
  try {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/scales?big=${big}&small=${small}`;

    const response = await apiAuthFetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('get scales error');
  }
};
