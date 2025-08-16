import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore.ts';
import LogoutButton from '../buttons/LogoutButton.tsx';

export const Header = () => {
  const { isLoggedIn } = useAuthStore();

  return (
    <header className="flex items-center justify-between px-6 py-4 shadow-md">
      <Link to="/" className="text-xl font-bold text-black hover:text-gray-700">
        Today's Art
      </Link>
      <div className={'space-x-4'}>
        {isLoggedIn ? (
          <>
            <Link to="/mypage" className="font-medium text-blue-600">
              마이페이지
            </Link>
            <LogoutButton />
          </>
        ) : (
          <Link to="/login" className="font-medium text-blue-600">
            로그인
          </Link>
        )}
      </div>
    </header>
  );
};
