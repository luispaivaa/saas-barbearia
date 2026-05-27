import { Outlet } from 'react-router';
import { Header } from '../components/Header';
import { Toaster } from '../components/ui/sonner';

export function RootLayout() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Header />
      <main>
        <Outlet />
      </main>
      <Toaster />
    </div>
  );
}
