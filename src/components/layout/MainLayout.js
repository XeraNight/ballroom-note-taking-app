'use client';

import { Sidebar } from './Sidebar';
import { usePathname } from 'next/navigation';

export function MainLayout({ children }) {
  const pathname = usePathname();
  
  // Public Access Version: We removed login/register.
  // The only full-page route left is the entry/select-dance route if desired.
  const isFullPage = pathname === '/' || pathname === '/select-dance';

  if (isFullPage) {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#0a0a0a]">
      <Sidebar />
      <main className="flex-1 ml-[320px] relative overflow-hidden h-full flex flex-col">
        {children}
      </main>
    </div>
  );
}
