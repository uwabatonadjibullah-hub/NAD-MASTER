import { User } from 'firebase/auth';
import { Menu, MessageSquare, User as UserIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

interface TopAppBarProps {
  user: User;
  onMenuClick: () => void;
}

export default function TopAppBar({ user, onMenuClick }: TopAppBarProps) {
  return (
    <header className="fixed top-0 w-full z-50 h-16 bg-[#f5f5f0] dark:bg-[#1a120b] border-b border-outline/10 flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="text-on-surface hover:bg-primary/10 transition-colors p-2 -ml-2 rounded-full"
          aria-label="Open navigation menu"
        >
          <Menu size={24} />
        </button>
        <h1 className="font-serif text-xl font-bold tracking-[0.2em] uppercase text-on-surface">
          NAD MASTER
        </h1>
      </div>
      
      <div className="flex items-center gap-2">
        <Link to="/chat" className="text-on-surface hover:bg-primary/10 transition-colors p-2 rounded-full">
          <MessageSquare size={24} />
        </Link>
        <button className="text-on-surface hover:bg-primary/10 transition-colors p-2 -mr-2 rounded-full overflow-hidden">
          {user.photoURL ? (
            <img src={user.photoURL} alt="Profile" className="w-8 h-8 rounded-full border border-outline" />
          ) : (
            <UserIcon size={24} />
          )}
        </button>
      </div>
    </header>
  );
}
