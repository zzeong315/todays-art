import { Header } from './Header.tsx';

export const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-white text-black">
      <Header />
      <main className="p-6">{children}</main>
    </div>
  );
};
