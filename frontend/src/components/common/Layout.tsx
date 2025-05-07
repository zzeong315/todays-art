import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore.ts';
import LogoutButton from '../buttons/LogoutButton.tsx';

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const { isLoggedIn } = useAuthStore();

  return (
    <div className="min-h-screen bg-white text-black">
      <header className="flex items-center justify-between px-6 py-4 shadow-md">
        <h1 className="text-xl font-bold">Today's Art</h1>
        <div>
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
      <main className="p-6">{children}</main>
    </div>
  );
};
