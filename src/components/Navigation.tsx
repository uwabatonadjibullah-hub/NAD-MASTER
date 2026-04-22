import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Calendar, Home, BookOpen, Hand, MessageSquare } from 'lucide-react';
import { cn } from '../lib/utils';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: Calendar, label: 'Schedule', path: '/schedule' },
  { icon: Home, label: 'Home', path: '/' },
  { icon: BookOpen, label: 'Quran', path: '/quran' },
  { icon: Hand, label: 'Dhikr', path: '/dhikr' },
];

export default function Navigation() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 h-20 bg-[#f5f5f0]/90 dark:bg-[#1a120b]/90 backdrop-blur-md border-t border-outline/10 flex justify-around items-center px-4 md:hidden">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "flex flex-col items-center justify-center transition-all duration-200",
              isActive ? "text-primary scale-110" : "text-on-surface-variant/40 hover:text-on-surface"
            )}
          >
            <item.icon size={24} className={cn(isActive && "fill-current")} />
            <span className="text-[10px] uppercase tracking-widest mt-1 font-bold">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
