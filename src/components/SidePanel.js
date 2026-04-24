import { Brain, Zap, Layers, Bot, X, } from 'lucide-react';
import DraggableItem from './DraggableItem';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from './ui/accordion';
export default function SidePanel({ data, loading, error, open, onClose, onAddItem, }) {
    const providers = ['Gemini', 'ChatGPT', 'Kimi', 'Claude', 'DeepSeek'];
    const content = (<>
      {loading && (<div className="p-4">
          <div className="animate-pulse space-y-3">
            {[1, 2, 3, 4].map((i) => (<div key={i} className="h-10 rounded-lg bg-slate-800"/>))}
          </div>
        </div>)}

      {error && (<div className="p-4">
          <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 p-3 text-sm text-rose-400">
            {error}
          </div>
        </div>)}

      {!data && !loading && !error && (<div className="p-4">
          <p className="text-sm text-slate-500">No data loaded.</p>
        </div>)}

      {data && !loading && (<Accordion type="single" collapsible defaultValue="profile">
          <AccordionItem value="profile">
            <AccordionTrigger>
              <div className="flex items-center justify-between w-full">
                <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  <Brain className="h-3.5 w-3.5"/>
                  Profiles
                </span>

                <span className="mr-1.5 rounded-full bg-slate-800 px-2 py-0.5 text-xs text-slate-500">
                  {data.agentProfiles.length}
                </span>

              </div>
            </AccordionTrigger>
            <AccordionContent>
              {data.agentProfiles.map((p) => (<DraggableItem key={p.id} id={p.id} name={p.name} subtitle={p.description} type="profile" onSelect={() => onAddItem?.('profile', p.id)}/>))}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="skill">
            <AccordionTrigger>
              <div className="flex items-center justify-between w-full">
              <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                <Zap className="h-3.5 w-3.5"/>
                Skills
              </span>
              <span className="mr-1.5 rounded-full bg-slate-800 px-2 py-0.5 text-xs text-slate-500">
                {data.skills.length}
              </span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              {data.skills.map((s) => (<DraggableItem key={s.id} id={s.id} name={s.name} subtitle={s.category} type="skill" onSelect={() => onAddItem?.('skill', s.id)}/>))}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="layer">
            <AccordionTrigger>
              <div className="flex items-center justify-between w-full">
              <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                <Layers className="h-3.5 w-3.5"/>
                Layers
              </span>
              <span className="mr-1 rounded-full bg-slate-800 px-2 py-0.5 text-xs text-slate-500">
                {data.layers.length}
              </span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              {data.layers.map((l) => (<DraggableItem key={l.id} id={l.id} name={l.name} subtitle={l.type} type="layer" onSelect={() => onAddItem?.('layer', l.id)}/>))}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="provider">
            <AccordionTrigger>
              <div className="flex items-center justify-between w-full">
              <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                <Bot className="h-3.5 w-3.5"/>
                Providers
              </span>
              <span className="mr-1 rounded-full bg-slate-800 px-2 py-0.5 text-xs text-slate-500">
                {providers.length}
              </span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              {providers.map((p) => (<DraggableItem key={p} id={p} name={p} type="provider" onSelect={() => onAddItem?.('provider', p)}/>))}
            </AccordionContent>
          </AccordionItem>
        </Accordion>)}
    </>);
    return (<>
      {/* Desktop sidebar */}
      <aside className="hidden w-72 shrink-0 overflow-y-auto border-r border-slate-800 md:block">
        {content}
      </aside>

      {/* Mobile device */}
      {open && (<>
          <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden" onClick={onClose}/>
          <aside className="fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-slate-800 bg-slate-950 shadow-2xl md:hidden">
            <div className="flex shrink-0 items-center justify-between border-b border-slate-800 px-4 py-3">
              <span className="text-sm font-semibold text-white">Components</span>
              <button onClick={onClose} className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white">
                <X size={20}/>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              {content}
            </div>
          </aside>
        </>)}
    </>);
}
