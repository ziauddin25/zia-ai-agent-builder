import { useState, useEffect, useCallback, useRef } from 'react';
import { DndContext, DragOverlay } from '@dnd-kit/core';
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { GripVertical, Brain, Zap, Layers, Bot } from 'lucide-react';
import type { AgentData } from './types';
import { cn } from './lib/utils';
import  Header  from './components/Header';
import  SidePanel  from './components/SidePanel';
import  {Canvas}  from './components/Canvas';
import type  {CanvasHandle}  from './components/Canvas';
import { SavedAgents } from './components/SavedAgents';

function App() {
  const [data, setData] = useState<AgentData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionTime, setSessionTime] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const fetchInProgress = useRef(false);
  const canvasRef = useRef<CanvasHandle>(null);
  const [activeItem, setActiveItem] = useState<{ name: string; subtitle?: string; type: string } | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setSessionTime((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchAPI = useCallback(async () => {
    if (fetchInProgress.current) return;

    fetchInProgress.current = true;
    setLoading(true);
    setError(null);
    setSessionTime(0);
    canvasRef.current?.clearCanvas();
    try {
      const delay = Math.floor(Math.random() * 1000) + 1000;
      await new Promise((resolve) => setTimeout(resolve, delay));

      const response = await fetch('/data.json');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const jsonData: AgentData = await response.json();
      setData(jsonData);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to fetch agent data';
      console.error('Error fetching data:', err);
      setError(message);
    } finally {
      setLoading(false);
      fetchInProgress.current = false;
    }
  }, []);

  useEffect(() => {
    fetchAPI();
  }, [fetchAPI]);

  const handleAddItem = useCallback((type: string, id: string) => {
    canvasRef.current?.addItem(type, id);
  }, []);

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const data = event.active.data.current;
    if (data) {
      setActiveItem(data as { name: string; subtitle?: string; type: string });
    }
  }, []);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    setActiveItem(null);
    canvasRef.current?.handleDragEnd(event);
  }, []);

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="flex h-screen flex-col bg-slate-950 text-slate-100">
        <Header
          onReload={fetchAPI}
          loading={loading}
          sessionTime={sessionTime}
          sidebarOpen={sidebarOpen}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />

        <div className="flex flex-1 overflow-hidden">
          <SidePanel
            data={data}
            loading={loading}
            error={error}
            open={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            onAddItem={handleAddItem}
          />

          <main className="flex flex-1 flex-col overflow-hidden p-3 lg:p-6">
            <Canvas ref={canvasRef} data={data}  />
          </main>
        </div>
        <SavedAgents data={data} canvasRef={canvasRef} />
      </div>

      <DragOverlay dropAnimation={null}>
        {activeItem && (
          <DragOverlayItem
            name={activeItem.name}
            subtitle={activeItem.subtitle}
            type={activeItem.type as 'profile' | 'skill' | 'layer' | 'provider'}
          />
        )}
      </DragOverlay>
    </DndContext>
  );
}

export default App;

const overlayTypeConfig = {
  profile: { icon: Brain, color: 'text-violet-400', bg: 'bg-violet-500/10', border: 'border-violet-500/20', shadow: 'shadow-violet-500/20' },
  skill: { icon: Zap, color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20', shadow: 'shadow-cyan-500/20' },
  layer: { icon: Layers, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', shadow: 'shadow-amber-500/20' },
  provider: { icon: Bot, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', shadow: 'shadow-emerald-500/20' },
};

function DragOverlayItem({ name, subtitle, type }: { name: string; subtitle?: string; type: 'profile' | 'skill' | 'layer' | 'provider' }) {
  const config = overlayTypeConfig[type];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        'flex cursor-grabbing items-center gap-3 rounded-lg border p-2.5 shadow-xl overflow-hidden',
        config.shadow,
        config.border,
        config.bg,
      )}
    >
      <GripVertical className="h-3.5 w-3.5 shrink-0 text-slate-400" />
      <Icon className={cn('h-4 w-4 shrink-0', config.color)} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-slate-200">{name}</p>
        {subtitle && (
          <p className="truncate text-xs text-slate-500">{subtitle}</p>
        )}
      </div>
    </div>
  );
}
