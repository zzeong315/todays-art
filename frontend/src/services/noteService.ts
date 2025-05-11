import privateApi from '../api/privateApi.ts';
import { AllNotesTypes, NoteTypes } from '../types/note.ts';

export const setArtworkNote = (data: NoteTypes) => privateApi.post('/diaries', data);

export const getUserAllNotes = async (): Promise<AllNotesTypes[]> => {
  const response = await privateApi.get('/diaries/me');
  return response.data;
};

export const getUserTodayNote = async (): Promise<AllNotesTypes> => {
  const response = await privateApi.get('/diaries/me/today');
  return response.data;
};
