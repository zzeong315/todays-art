import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div>
      <Link to={'/today-artwork'}>
        <button>오늘의 작품 감상하러 가기</button>
      </Link>
    </div>
  );
};

export default Home;
