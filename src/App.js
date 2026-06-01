import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useCallback, useRef } from 'react';
import { DndContext, DragOverlay } from '@dnd-kit/core';
import { GripVertical, Brain, Zap, Layers, Bot } from 'lucide-react';
import { cn } from './lib/utils';
import Header from './components/Header';
import SidePanel from './components/SidePanel';
import { Canvas } from './components/Canvas';
import { SavedAgents } from './components/SavedAgents';
function App() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [sessionTime, setSessionTime] = useState(0);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const fetchInProgress = useRef(false);
    const canvasRef = useRef(null);
    const [activeItem, setActiveItem] = useState(null);
    useEffect(() => {
        const interval = setInterval(() => {
            setSessionTime((prev) => prev + 1);
        }, 1000);
        return () => clearInterval(interval);
    }, []);
    const fetchAPI = useCallback(async () => {
        if (fetchInProgress.current)
            return;
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
            const jsonData = await response.json();
            setData(jsonData);
        }
        catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to fetch agent data';
            console.error('Error fetching data:', err);
            setError(message);
        }
        finally {
            setLoading(false);
            fetchInProgress.current = false;
        }
    }, []);
    useEffect(() => {
        fetchAPI();
    }, [fetchAPI]);
    const handleAddItem = useCallback((type, id) => {
        canvasRef.current?.addItem(type, id);
    }, []);
    const handleDragStart = useCallback((event) => {
        const data = event.active.data.current;
        if (data) {
            setActiveItem(data);
        }
    }, []);
    const handleDragEnd = useCallback((event) => {
        setActiveItem(null);
        canvasRef.current?.handleDragEnd(event);
    }, []);
    return (_jsxs(DndContext, { onDragStart: handleDragStart, onDragEnd: handleDragEnd, children: [_jsxs("div", { className: "flex h-screen flex-col bg-slate-950 text-slate-100", children: [_jsx(Header, { onReload: fetchAPI, loading: loading, sessionTime: sessionTime, sidebarOpen: sidebarOpen, onToggleSidebar: () => setSidebarOpen(!sidebarOpen) }), _jsxs("div", { className: "flex flex-1 overflow-hidden", children: [_jsx(SidePanel, { data: data, loading: loading, error: error, open: sidebarOpen, onClose: () => setSidebarOpen(false), onAddItem: handleAddItem }), _jsx("main", { className: "flex flex-1 flex-col overflow-hidden p-3 lg:p-6", children: _jsx(Canvas, { ref: canvasRef, data: data }) })] }), _jsx(SavedAgents, { data: data, canvasRef: canvasRef })] }), _jsx(DragOverlay, { dropAnimation: null, children: activeItem && (_jsx(DragOverlayItem, { name: activeItem.name, subtitle: activeItem.subtitle, type: activeItem.type })) })] }));
}
export default App;
const overlayTypeConfig = {
    profile: { icon: Brain, color: 'text-violet-400', bg: 'bg-violet-500/10', border: 'border-violet-500/20', shadow: 'shadow-violet-500/20' },
    skill: { icon: Zap, color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20', shadow: 'shadow-cyan-500/20' },
    layer: { icon: Layers, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', shadow: 'shadow-amber-500/20' },
    provider: { icon: Bot, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', shadow: 'shadow-emerald-500/20' },
};
function DragOverlayItem({ name, subtitle, type }) {
    const config = overlayTypeConfig[type];
    const Icon = config.icon;
    return (_jsxs("div", { className: cn('flex cursor-grabbing items-center gap-3 rounded-lg border p-2.5 shadow-xl overflow-hidden', config.shadow, config.border, config.bg), children: [_jsx(GripVertical, { className: "h-3.5 w-3.5 shrink-0 text-slate-400" }), _jsx(Icon, { className: cn('h-4 w-4 shrink-0', config.color) }), _jsxs("div", { className: "min-w-0 flex-1", children: [_jsx("p", { className: "truncate text-sm font-medium text-slate-200", children: name }), subtitle && (_jsx("p", { className: "truncate text-xs text-slate-500", children: subtitle }))] })] }));
}
