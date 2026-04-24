import { Timer, RefreshCw, Menu, X } from 'lucide-react';
import { Button } from './ui/button';

interface HeaderProps {
  onReload: () => void;
  loading: boolean;
  sessionTime: number;
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
}

export default function Header({ onReload, loading, sessionTime, sidebarOpen, onToggleSidebar }: HeaderProps) {
  const minutes = Math.floor(sessionTime / 60);
  const seconds = sessionTime % 60;
  const timeStr = `${minutes}:${seconds.toString().padStart(2, '0')}`;

  return (
    <header className="flex items-center justify-between border-b border-slate-800 px-4 py-3 md:px-6 md:py-4">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white md:hidden"
        >
          {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
        <div>
          <h1 className="text-lg font-bold text-white md:text-xl">
            AI Agent <span className="text-violet-400">Builder</span>
          </h1>
          <p className="hidden text-xs text-slate-500 sm:block">
            Drag components to build your custom agent
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <div className="hidden items-center gap-1.5 text-xs text-slate-500 sm:flex">
          <Timer className="h-3.5 w-3.5" />
          <span className="font-mono">{timeStr}</span>
        </div>

        <Button variant="outline" size="sm" onClick={onReload} disabled={loading}>
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">{loading ? 'Loading...' : 'Reload'}</span>
        </Button>
      </div>
    </header>
  );
}
