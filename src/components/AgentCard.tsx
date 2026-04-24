import { Brain, Zap, Layers, Bot, X, GripVertical } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { cn } from '../lib/utils';

interface AgentCardProps {
  id: string;
  type: 'profile' | 'skill' | 'layer' | 'provider';
  name: string;
  subtitle?: string;
  onRemove: () => void;
}

const typeConfig = {
  profile: { icon: Brain, color: 'text-violet-400', bg: 'bg-violet-500/10', border: 'border-violet-500/30', ring: 'ring-violet-500/20' },
  skill: { icon: Zap, color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/30', ring: 'ring-cyan-500/20' },
  layer: { icon: Layers, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30', ring: 'ring-amber-500/20' },
  provider: { icon: Bot, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', ring: 'ring-emerald-500/20' },
};

export default function AgentCard({ id, type, name, subtitle, onRemove }: AgentCardProps) {
  const {
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const config = typeConfig[type];
  const Icon = config.icon;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'group relative flex items-center gap-2 rounded-xl border p-2.5 transition-all duration-200 lg:gap-3 lg:p-3',
        config.border,
        config.bg,
        isDragging && `z-50 scale-105 shadow-xl ring-2 ${config.ring}`,
      )}
    >
      <GripVertical className="h-4 w-4 shrink-0 text-slate-600 group-hover:text-slate-400" />
      <Icon className={cn('h-4 w-4 shrink-0 lg:h-5 lg:w-5', config.color)} />

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-slate-100">{name}</p>
        {subtitle && (
          <p className="truncate text-xs text-slate-500">{subtitle}</p>
        )}
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        className="shrink-0 rounded-md p-1 text-slate-600 transition-colors cursor-pointer hover:bg-slate-700 hover:text-slate-300"
      >
        <X size={14}  />
      </button>
    </div>
  );
}
