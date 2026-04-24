import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../lib/utils';
function Accordion(props) {
    return _jsx(AccordionPrimitive.Root, { ...props });
}
function AccordionItem({ className, ...props }) {
    return (_jsx(AccordionPrimitive.Item, { className: cn('border-b border-slate-800/50', className), ...props }));
}
function AccordionTrigger({ className, children, ...props }) {
    return (_jsx(AccordionPrimitive.Header, { className: "flex", children: _jsxs(AccordionPrimitive.Trigger, { className: cn('flex w-full cursor-pointer items-center justify-between px-4 py-3 text-left transition-colors hover:bg-slate-800/30 [&[data-state=open]>svg]:rotate-180', className), ...props, children: [children, _jsx(ChevronDown, { className: "h-3.5 w-3.5 shrink-0 text-slate-500 transition-transform duration-200" })] }) }));
}
function AccordionContent({ className, children, ...props }) {
    return (_jsx(AccordionPrimitive.Content, { className: cn('overflow-hidden transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down', className), ...props, children: _jsx("div", { className: "flex flex-col gap-1.5 px-3 pb-3 pt-3", children: children }) }));
}
export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
