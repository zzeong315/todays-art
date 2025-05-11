import { useAuthStore } from '../../store/useAuthStore.ts';
import { useNavigate } from 'react-router-dom';

const LogoutButton = () => {
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
  };

  return <button onClick={handleLogout}>로그아웃</button>;
};

export default LogoutButton;
