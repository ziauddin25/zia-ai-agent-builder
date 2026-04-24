import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useCallback } from 'react';
import { Trash2, Upload, FolderOpen, X } from 'lucide-react';
import { Button } from './ui/button';
import Toast from './Toast';
export function SavedAgents({ data, canvasRef, onCountChange }) {
    const [agents, setAgents] = useState([]);
    const [toast, setToast] = useState(null);
    const [expanded, setExpanded] = useState(false);
    const showToast = useCallback((message, type = 'info') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    }, []);
    useEffect(() => {
        const saved = localStorage.getItem('savedAgents');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                setAgents(parsed);
                onCountChange?.(parsed.length);
            }
            catch (e) {
                console.error('Failed to parse saved agents', e);
            }
        }
        else {
            onCountChange?.(0);
        }
    }, [onCountChange]);
    useEffect(() => {
        const handleUpdate = () => {
            const saved = localStorage.getItem('savedAgents');
            if (saved) {
                try {
                    const parsed = JSON.parse(saved);
                    setAgents(parsed);
                    onCountChange?.(parsed.length);
                }
                catch (e) {
                    console.error('Failed to parse saved agents', e);
                }
            }
            else {
                setAgents([]);
                onCountChange?.(0);
            }
        };
        window.addEventListener('savedAgentsUpdated', handleUpdate);
        return () => window.removeEventListener('savedAgentsUpdated', handleUpdate);
    }, [onCountChange]);
    const handleLoad = useCallback((agent) => {
        canvasRef.current?.loadAgent(agent);
    }, [canvasRef]);
    const handleDelete = useCallback((idToRemove) => {
        setAgents((prev) => {
            const updated = prev.filter((agent) => agent.id !== idToRemove);
            localStorage.setItem('savedAgents', JSON.stringify(updated));
            onCountChange?.(updated.length);
            return updated;
        });
    }, [onCountChange]);
    const handleClearAll = useCallback(() => {
        setAgents([]);
        localStorage.removeItem('savedAgents');
        setExpanded(false);
        onCountChange?.(0);
        showToast('All saved agents cleared.', 'info');
    }, [showToast, onCountChange]);
    if (agents.length === 0)
        return null;
    const cardGrid = (_jsx("div", { className: "grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-3 lg:grid-cols-3 xl:grid-cols-4", children: agents.map((agent) => (_jsxs("div", { className: "group rounded-xl border border-slate-800 bg-slate-900 p-3 transition-all duration-200 hover:border-slate-700 hover:shadow-lg hover:shadow-violet-500/5 sm:p-4", children: [_jsx("h3", { className: "text-sm font-semibold text-white", children: agent.name }), _jsxs("div", { className: "mt-2 space-y-0.5 sm:mt-2.5 sm:space-y-1", children: [_jsx(Detail, { label: "Profile", value: data?.agentProfiles.find((p) => p.id === agent.profileId)?.name }), _jsx(Detail, { label: "Skills", value: `${agent.skillIds?.length || 0} added` }), _jsx(Detail, { label: "Layers", value: `${agent.layerIds?.length || 0} added` }), _jsx(Detail, { label: "Provider", value: agent.provider })] }), _jsxs("div", { className: "mt-2.5 flex gap-2 sm:mt-3", children: [_jsxs(Button, { variant: "outline", size: "sm", className: "flex-1 rounded-lg", onClick: () => handleLoad(agent), children: [_jsx(Upload, { className: "h-3 w-3" }), "Load"] }), _jsx(Button, { variant: "ghost", size: "icon", onClick: () => handleDelete(agent.id), className: "text-slate-500 hover:text-rose-400", children: _jsx(Trash2, { className: "h-3.5 w-3.5" }) })] })] }, agent.id))) }));
    return (_jsxs("div", { children: [_jsx(Toast, { toast: toast }), _jsxs("div", { className: "flex items-center justify-between border-t border-slate-800 bg-slate-900 px-3 py-3 lg:px-6 lg:py-4 ", children: [_jsxs("h2", { className: "flex items-center gap-2 text-sm font-semibold text-slate-300", children: [_jsx(FolderOpen, { className: "h-4 w-4 text-violet-400" }), "Saved Agents", _jsx("span", { className: "rounded-full bg-slate-800 px-2 py-0.5 text-xs text-slate-500", children: agents.length })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("button", { onClick: () => setExpanded(!expanded), className: "inline-flex h-8 items-center justify-center gap-1.5 rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-3 text-xs font-medium text-cyan-400 transition-all duration-300 hover:bg-cyan-400/20 cursor-pointer", children: expanded ? _jsx(X, { size: 16 }) : 'View All' }), _jsxs(Button, { variant: "destructive", size: "sm", onClick: handleClearAll, children: [_jsx(Trash2, { className: "h-3.5 w-3.5" }), _jsx("span", { className: "hidden sm:inline", children: "Clear All" })] })] })] }), expanded && (_jsx("div", { className: "max-h-[35vh] overflow-y-auto border-t border-slate-800 bg-slate-950 px-3 py-3 lg:px-6 lg:py-4", children: cardGrid }))] }));
}
function Detail({ label, value }) {
    return (_jsxs("p", { className: "flex items-center gap-1.5 text-xs", children: [_jsxs("span", { className: "text-slate-600", children: [label, ":"] }), _jsx("span", { className: "text-slate-400", children: value || 'None' })] }));
}
