import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Calendar, Home, BookOpen, Hand, MessageSquare, X, LogOut } from 'lucide-react';
import { cn } from '../lib/utils';
import { auth } from '../lib/firebase';
import { signOut } from 'firebase/auth';
import { User } from 'firebase/auth';

const navItems = [
  { icon: Home,            label: 'Home',      path: '/' },
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: Calendar,        label: 'Schedule',  path: '/schedule' },
  { icon: BookOpen,        label: 'Quran',     path: '/quran' },
  { icon: Hand,            label: 'Dhikr',     path: '/dhikr' },
  { icon: MessageSquare,   label: 'AI Chat',   path: '/chat' },
];

interface SideDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
}

export default function SideDrawer({ isOpen, onClose, user }: SideDrawerProps) {
  const location = useLocation();

  const handleSignOut = async () => {
    await signOut(auth);
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          'fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300',
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer panel */}
      <aside
        className={cn(
          'fixed top-0 left-0 z-50 h-full w-72 bg-[#1a120b] border-r border-white/10 flex flex-col',
          'transition-transform duration-300 ease-in-out shadow-2xl',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
        aria-label="Navigation drawer"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 h-16 border-b border-white/10 shrink-0">
          <span className="font-serif text-lg font-bold tracking-[0.2em] uppercase text-[#e7e1e0]">
            NAD MASTER
          </span>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-[#e7e1e0]/60 hover:text-[#e7e1e0] hover:bg-white/10 transition-colors"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* User info */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-white/10 shrink-0">
          <div className="w-10 h-10 rounded-full overflow-hidden border border-white/20 shrink-0">
            {user.photoURL ? (
              <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-[#d6c3b5]/20 flex items-center justify-center text-[#d6c3b5] font-bold text-sm">
                {user.displayName?.[0] ?? user.email?.[0] ?? '?'}
              </div>
            )}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-[#e7e1e0] truncate">{user.displayName ?? 'User'}</p>
            <p className="text-xs text-[#e7e1e0]/50 truncate">{user.email}</p>
          </div>
        </div>

        {/* Nav links */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={cn(
                  'flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group',
                  isActive
                    ? 'bg-[#d6c3b5]/15 text-[#d6c3b5]'
                    : 'text-[#e7e1e0]/60 hover:bg-white/5 hover:text-[#e7e1e0]'
                )}
              >
                <item.icon
                  size={20}
                  className={cn(
                    'shrink-0 transition-transform duration-200 group-hover:scale-110',
                    isActive && 'fill-current'
                  )}
                />
                <span className="text-sm font-medium tracking-wide">{item.label}</span>
                {isActive && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#d6c3b5]" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Sign out */}
        <div className="px-3 py-4 border-t border-white/10 shrink-0">
          <button
            onClick={handleSignOut}
            className="flex items-center gap-4 w-full px-4 py-3 rounded-xl text-[#e7e1e0]/50 hover:text-red-400 hover:bg-red-400/10 transition-all duration-200 group"
          >
            <LogOut size={20} className="shrink-0 transition-transform duration-200 group-hover:scale-110" />
            <span className="text-sm font-medium tracking-wide">Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
