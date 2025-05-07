import { useTodaysArtworkQuery } from '../queries/useArtworkQuery.ts';
import { useNavigate } from 'react-router-dom';

const TodayArtwork = () => {
  const { data, isLoading } = useTodaysArtworkQuery();
  const navigate = useNavigate();

  console.log(data);
  return (
    <div>
      {isLoading ? (
        'is Loading...'
      ) : (
        <div className={'flex'}>
          <img src={data?.imageUrl} alt={data?.title} />
          <div>
            <div>id: {data?.id}</div>
            <div>artworkId: {data?.artworkId}</div>
            <div>title: {data?.title}</div>
            <div>artwork: {data?.artist}</div>
            <div>date: {data?.date}</div>
            <div>createdAt: {data?.createdAt}</div>
            <button className={'bg-blue-400 p-3'} onClick={() => navigate('/artwork-note')}>
              감상 작성하러 가기!
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TodayArtwork;
