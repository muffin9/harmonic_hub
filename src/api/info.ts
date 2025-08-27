import { apiAuthFetch } from './auth';

export const getMusicSheetsInfo = async (
  categoryId: number,
  subGenreId: number,
  scaleId: number,
) => {
  try {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/music-sheets/info?big=${categoryId}&small=${subGenreId}&scale=${scaleId}`;

    const response = await apiAuthFetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('get music sheets info error');
  }
};
