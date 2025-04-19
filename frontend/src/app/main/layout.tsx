'use client';

import { Sidebar } from './components/Sidebar';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Redirección si el usuario no está autenticado
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin h-10 w-10 border-4 border-blue-500 rounded-full border-t-transparent"></div>
    </div>;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activeRoute={pathname} />
      <div className="flex-1 overflow-auto">
        <main className="p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}