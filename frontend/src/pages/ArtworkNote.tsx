import { useForm } from 'react-hook-form';
import { useTodaysArtworkQuery } from '../queries/useArtworkQuery.ts';
import { useGetUserTodayNoteQuery, useNoteMutation } from '../queries/useNoteQuery.ts';
import { NoteTypes } from '../types/note.ts';

const ArtworkNote = () => {
  const { data: artwork, isLoading: artworkLoading } = useTodaysArtworkQuery();
  const { data: todayNote, isLoading: todayNoteLoading } = useGetUserTodayNoteQuery();
  const { mutate } = useNoteMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<{ content: string }>();

  const onSubmit = (data: NoteTypes) => {
    console.log('data', data);
    mutate(data, {
      onSuccess: () => {
        reset();
      },
    });
  };

  if (artworkLoading) return <p>로딩 중...</p>;
  if (!artwork) return <p>작품 정보를 불러올 수 없습니다.</p>;

  return (
    <div className="mx-auto max-w-xl space-y-6 p-4">
      <div>
        <img src={artwork.imageUrl} alt={artwork.title} className="h-auto w-full rounded-xl" />
        <h2 className="mt-2 text-xl font-semibold">{artwork.title}</h2>
        <p className="text-gray-500">{artwork.artist}</p>
      </div>

      {todayNote ? (
        <div className="rounded-lg bg-gray-100 p-4">
          <h3 className="mb-2 font-bold">내 감상일기</h3>
          <p>{todayNoteLoading ? 'Loading...' : todayNote.content}</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <textarea
            className="w-full rounded-lg border p-3"
            rows={5}
            placeholder="오늘의 감상을 적어보세요"
            {...register('content', { required: true })}
          />
          <button
            type="submit"
            className="rounded bg-black px-4 py-2 text-white"
            disabled={isSubmitting}
          >
            제출하기
          </button>
        </form>
      )}
    </div>
  );
};

export default ArtworkNote;
