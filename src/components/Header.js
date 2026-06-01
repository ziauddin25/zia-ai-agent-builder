import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Timer, RefreshCw, Menu, X } from 'lucide-react';
import { Button } from './ui/button';
export default function Header({ onReload, loading, sessionTime, sidebarOpen, onToggleSidebar }) {
    const minutes = Math.floor(sessionTime / 60);
    const seconds = sessionTime % 60;
    const timeStr = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    return (_jsxs("header", { className: "flex items-center justify-between border-b border-slate-800 px-4 py-3 md:px-6 md:py-4", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("button", { onClick: onToggleSidebar, className: "rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white md:hidden", children: sidebarOpen ? _jsx(X, { className: "h-5 w-5" }) : _jsx(Menu, { className: "h-5 w-5" }) }), _jsxs("div", { children: [_jsxs("h1", { className: "text-lg font-bold text-white md:text-xl", children: ["AI Agent ", _jsx("span", { className: "text-violet-400", children: "Builder" })] }), _jsx("p", { className: "hidden text-xs text-slate-500 sm:block", children: "Drag components to build your custom agent" })] })] }), _jsxs("div", { className: "flex items-center gap-2 md:gap-4", children: [_jsxs("div", { className: "hidden items-center gap-1.5 text-xs text-slate-500 sm:flex", children: [_jsx(Timer, { className: "h-3.5 w-3.5" }), _jsx("span", { className: "font-mono", children: timeStr })] }), _jsxs(Button, { variant: "outline", size: "sm", onClick: onReload, disabled: loading, children: [_jsx(RefreshCw, { className: `h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}` }), _jsx("span", { className: "hidden sm:inline", children: loading ? 'Loading...' : 'Reload' })] })] })] }));
}
