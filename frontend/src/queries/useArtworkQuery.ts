import { todaysArtwork } from '../services/artworkService.ts';
import { useQuery } from '@tanstack/react-query';
import { TodaysArtworkTypes } from '../types/artwork.ts';

export const useTodaysArtworkQuery = () =>
  useQuery<TodaysArtworkTypes>({
    queryKey: ['todaysArtwork'],
    queryFn: todaysArtwork,
  });
