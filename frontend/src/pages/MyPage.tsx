import { useGetUserAllNotesQuery } from '../queries/useNoteQuery.ts';
import { useEffect, useState } from 'react';

const MyPage = () => {
  const [user, setUser] = useState({ id: 0, email: 'none', nickname: 'none' });
  const { data: allNotes } = useGetUserAllNotesQuery();
  const userData = localStorage.getItem('user');

  useEffect(() => {
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, [userData]);

  console.log('allNotes', allNotes);

  return (
    <>
      <h1>MyPage</h1>
      <p>{user?.id}</p>
      <p>{user?.nickname}</p>
      <p>{user?.email}</p>
      {allNotes &&
        Array.isArray(allNotes) &&
        allNotes?.map((note) => (
          <div
            key={note.id}
            className="rounded-lg border bg-white p-4 shadow transition duration-200 hover:shadow-md"
          >
            <div className="flex gap-4">
              <img
                src={note.artwork.imageUrl}
                alt={note.artwork.title}
                className="h-auto w-32 rounded-md object-cover"
              />
              <div className="flex flex-col justify-between">
                <div>
                  <h2 className="text-lg font-semibold">{note.artwork.title}</h2>
                  <p className="text-sm text-gray-600">{note.artwork.artist}</p>
                </div>
                <div className="mt-2">
                  <p className="text-sm text-gray-800">{note.content}</p>
                  <p className="mt-1 text-xs text-gray-400">
                    작성일: {new Date(note.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
    </>
  );
};

export default MyPage;
