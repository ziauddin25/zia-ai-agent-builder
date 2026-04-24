import { useDraggable } from '@dnd-kit/core';
import { GripVertical, Plus, Brain, Zap, Layers, Bot } from 'lucide-react';
import { cn } from '../lib/utils';
import { useIsMobile } from '../hooks/useIsMobile';
const typeConfig = {
    profile: { icon: Brain, color: 'text-violet-400', bg: 'bg-violet-500/10', hover: 'hover:bg-violet-500/25', border: 'border-violet-500/20', shadow: 'shadow-violet-500/20' },
    skill: { icon: Zap, color: 'text-cyan-400', bg: 'bg-cyan-500/10', hover: 'hover:bg-cyan-500/25', border: 'border-cyan-500/20', shadow: 'shadow-cyan-500/20' },
    layer: { icon: Layers, color: 'text-amber-400', bg: 'bg-amber-500/10', hover: 'hover:bg-amber-500/25', border: 'border-amber-500/20', shadow: 'shadow-amber-500/20' },
    provider: { icon: Bot, color: 'text-emerald-400', bg: 'bg-emerald-500/10', hover: 'hover:bg-emerald-500/25', border: 'border-emerald-500/20', shadow: 'shadow-emerald-500/20' },
};
export default function DraggableItem({ id, name, subtitle, type, onSelect }) {
    const isMobile = useIsMobile();
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: `${type}:${id}`,
        data: { name, subtitle, type },
    });
    const config = typeConfig[type];
    const Icon = config.icon;
    const style = transform
        ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
        : undefined;
    if (isMobile) {
        return (<button onClick={onSelect} className={cn('group flex w-full cursor-pointer items-center gap-3 rounded-lg border p-2.5 text-left transition-all duration-150', config.border, `${config.bg} ${config.hover} active:scale-95`)}>
        <Plus className="h-3.5 w-3.5 shrink-0 text-slate-500 group-hover:text-slate-300"/>
        <Icon className={cn('h-4 w-4 shrink-0', config.color)}/>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-slate-200">{name}</p>
          {subtitle && (<p className="truncate text-xs text-slate-500">{subtitle}</p>)}
        </div>
      </button>);
    }
    return (<div ref={setNodeRef} style={style} {...listeners} {...attributes} className={cn('group flex cursor-grab items-center gap-3 rounded-lg border p-2.5 transition-all duration-150 active:cursor-grabbing', config.border, isDragging
            ? `z-50 scale-105 opacity-90 shadow-lg ${config.shadow}`
            : `${config.bg} ${config.hover}`)}>
      <GripVertical className="h-3.5 w-3.5 shrink-0 text-slate-600 group-hover:text-slate-400"/>
      <Icon className={cn('h-4 w-4 shrink-0', config.color)}/>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-slate-200">{name}</p>
        {subtitle && (<p className="truncate text-xs text-slate-500">{subtitle}</p>)}
      </div>
    </div>);
}
