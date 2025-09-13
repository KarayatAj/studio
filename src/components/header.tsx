import Link from 'next/link';
import Logo from './logo';
import UserNav from './user-nav';
import { useAuth } from '@/hooks/use-auth';

export default function Header() {
  const { user } = useAuth();
  
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <Link href="/" className="flex items-center space-x-3">
          <Logo />
          <span className="text-xl font-bold font-headline tracking-tight">
            Reflect Daily
          </span>
        </Link>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-1">
            {user && <UserNav user={user} />}
          </nav>
        </div>
      </div>
    </header>
  );
}
