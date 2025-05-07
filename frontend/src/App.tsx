import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home.tsx';
import Login from './pages/Login.tsx';
import Signup from './pages/Signup.tsx';
import TodayArtwork from './pages/TodayArtwork.tsx';
import ArtworkNote from './pages/ArtworkNote.tsx';
import MyPage from './pages/MyPage.tsx';
import { ProtectedRoute } from './components/ProtectedRoute.tsx';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/today-artwork" element={<TodayArtwork />} />
      <Route
        path="/artwork-note"
        element={
          <ProtectedRoute>
            <ArtworkNote />
          </ProtectedRoute>
        }
      />
      <Route
        path="/mypage"
        element={
          <ProtectedRoute>
            <MyPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
