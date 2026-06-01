import { jsx as _jsx } from "react/jsx-runtime";
const toastStyles = {
    success: 'bg-emerald-600/90 border-emerald-500/50',
    error: 'bg-rose-600/90 border-rose-500/50',
    info: 'bg-violet-600/90 border-violet-500/50',
};
export default function Toast({ toast }) {
    if (!toast)
        return null;
    return (_jsx("div", { className: `fixed bottom-4 right-4 z-50 rounded-lg border px-6 py-3 text-sm font-medium text-white shadow-2xl backdrop-blur-sm transition-all duration-300 ${toastStyles[toast.type]}`, children: toast.message }));
}
