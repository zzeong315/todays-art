import publicApi from '../api/publicApi.ts';
import { TodaysArtworkTypes } from '../types/artwork.ts';

export const todaysArtwork = async (): Promise<TodaysArtworkTypes> => {
  const response = await publicApi.get('/artwork/today');
  return response.data;
};
