import privateApi from '../api/privateApi.ts';
import { AllNotesTypes, NoteTypes } from '../types/note.ts';

export const setArtworkNote = (data: NoteTypes) => privateApi.post('/diaries', data);

export const getUserAllNotes = (): Promise<AllNotesTypes[]> => privateApi.get('/diaries/me');

export const getUserTodayNote = (): Promise<AllNotesTypes> => privateApi.get('/diaries/me/today');
