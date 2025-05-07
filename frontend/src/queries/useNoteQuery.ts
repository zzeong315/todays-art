import { useMutation, useQuery } from '@tanstack/react-query';
import { getUserAllNotes, getUserTodayNote, setArtworkNote } from '../services/noteService.ts';
import { AllNotesTypes, NoteTypes } from '../types/note.ts';

export const useNoteMutation = () =>
  useMutation({
    mutationFn: (data: NoteTypes) => setArtworkNote(data),
    onSuccess: () => {
      alert('기록 등록 성공');
    },
    onError: (error, variables, context) => {
      console.log('error', error);
      console.log('variables', variables);
      console.log('context', context);
    },
  });

export const useGetUserAllNotesQuery = () =>
  useQuery<AllNotesTypes[]>({
    queryKey: ['userAllNotes'],
    queryFn: getUserAllNotes,
  });

export const useGetUserTodayNoteQuery = () =>
  useQuery<AllNotesTypes>({
    queryKey: ['userTodayNote'],
    queryFn: getUserTodayNote,
  });
