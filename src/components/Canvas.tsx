import { useState, useEffect, useCallback, forwardRef, useImperativeHandle } from 'react';
import { useDroppable } from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { arrayMove } from '@dnd-kit/sortable';
import { Plus, Brain, Zap, Layers, Bot, Save } from 'lucide-react';
import { cn } from '../lib/utils';
import AgentCard  from './AgentCard';
import { Button } from './ui/button';
import { Input } from './ui/input';
import Toast from './Toast';
import type { AgentProfile, Skill, Layer, SavedAgent, ToastMessage } from '../types';

interface CanvasProps {
  data: {
    agentProfiles: AgentProfile[];
    skills: Skill[];
    layers: Layer[];
  } | null;
  hasSavedAgents?: boolean;
}

export interface CanvasHandle {
  loadAgent: (agent: SavedAgent) => void;
  addItem: (type: string, id: string) => void;
  handleDragEnd: (event: DragEndEvent) => void;
  clearCanvas: () => void;
}

export const Canvas = forwardRef<CanvasHandle, CanvasProps>(function Canvas(
  { data },
  ref, 
) {
  const [selectedProfile, setSelectedProfile] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedLayers, setSelectedLayers] = useState<string[]>([]);
  const [selectedProvider, setSelectedProvider] = useState('');
  const [agentName, setAgentName] = useState('');
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const showToast = useCallback((message: string, type: ToastMessage['type'] = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const clearCanvas = useCallback(() => {
    setSelectedProfile('');
    setSelectedSkills([]);
    setSelectedLayers([]);
    setSelectedProvider('');
    setAgentName('');
  }, []);

  const handleAddItem = useCallback(
    (type: string, itemId: string) => {
      switch (type) {
        case 'profile':
          setSelectedProfile(itemId);
          showToast('Profile added', 'success');
          break;
        case 'skill':
          setSelectedSkills((prev) => {
            if (prev.includes(itemId)) return prev;
            showToast('Skill added', 'success');
            return [...prev, itemId];
          });
          break;
        case 'layer':
          setSelectedLayers((prev) => {
            if (prev.includes(itemId)) return prev;
            showToast('Layer added', 'success');
            return [...prev, itemId];
          });
          break;
        case 'provider':
          setSelectedProvider(itemId);
          showToast('Provider added', 'success');
          break;
      }
    },
    [showToast],
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      const activeId = active.id as string;

      if (activeId.includes(':') && !activeId.includes('-card:')) {
        const [type, itemId] = activeId.split(':');
        handleAddItem(type, itemId);
        return;
      }

      if (over && active.id !== over.id) {
        const activeIdStr = active.id as string;
        const overIdStr = over.id as string;

        if (activeIdStr.startsWith('skill-card:') && overIdStr.startsWith('skill-card:')) {
          const activeSkillId = activeIdStr.replace('skill-card:', '');
          const overSkillId = overIdStr.replace('skill-card:', '');
          setSelectedSkills((prev) => {
            const oldIndex = prev.indexOf(activeSkillId);
            const newIndex = prev.indexOf(overSkillId);
            return arrayMove(prev, oldIndex, newIndex);
          });
        }

        if (activeIdStr.startsWith('layer-card:') && overIdStr.startsWith('layer-card:')) {
          const activeLayerId = activeIdStr.replace('layer-card:', '');
          const overLayerId = overIdStr.replace('layer-card:', '');
          setSelectedLayers((prev) => {
            const oldIndex = prev.indexOf(activeLayerId);
            const newIndex = prev.indexOf(overLayerId);
            return arrayMove(prev, oldIndex, newIndex);
          });
        }
      }
    },
    [handleAddItem],
  );

  useImperativeHandle(ref, () => ({
    loadAgent: (agent: SavedAgent) => {
      setSelectedProfile(agent.profileId || '');
      setSelectedSkills([...(agent.skillIds || [])]);
      setSelectedLayers([...(agent.layerIds || [])]);
      setSelectedProvider(agent.provider || '');
      setAgentName(agent.name);
    },
    addItem: handleAddItem,
    handleDragEnd,
    clearCanvas,
  }));

  const handleSaveAgent = useCallback(() => {
    if (!agentName.trim()) {
      showToast('Please enter a name for your agent.', 'error');
      return;
    }

    const newAgent: SavedAgent = {
      id: crypto.randomUUID(),
      name: agentName,
      profileId: selectedProfile,
      skillIds: [...selectedSkills],
      layerIds: [...selectedLayers],
      provider: selectedProvider,
    };

    const saved = localStorage.getItem('savedAgents');
    const agents: SavedAgent[] = saved ? JSON.parse(saved) : [];
    agents.push(newAgent);
    localStorage.setItem('savedAgents', JSON.stringify(agents));

    clearCanvas();
    showToast(`Agent "${newAgent.name}" saved!`, 'success');

    window.dispatchEvent(new Event('savedAgentsUpdated'));
  }, [agentName, selectedProfile, selectedSkills, selectedLayers, selectedProvider, showToast, clearCanvas]);

  const handleRemoveProfile = useCallback(() => setSelectedProfile(''), []);
  const handleRemoveSkill = useCallback(
    (id: string) => setSelectedSkills((prev) => prev.filter((s) => s !== id)),
    [],
  );
  const handleRemoveLayer = useCallback(
    (id: string) => setSelectedLayers((prev) => prev.filter((l) => l !== id)),
    [],
  );
  const handleRemoveProvider = useCallback(() => setSelectedProvider(''), []);

  const { setNodeRef, isOver } = useDroppable({ id: 'canvas' });

  const hasItems =
    selectedProfile || selectedSkills.length > 0 || selectedLayers.length > 0 || selectedProvider;

  const profile = data?.agentProfiles.find((p) => p.id === selectedProfile);

  const skillIds = selectedSkills.map((id) => `skill-card:${id}`);
  const layerIds = selectedLayers.map((id) => `layer-card:${id}`);

 useEffect(() => {
  if (hasItems && profile) {
    setAgentName(`${profile.name} Agent`);
  }
}, [profile, hasItems]);

  return (
    <>
      <Toast toast={toast} />

      <div className="mb-3 flex flex-col gap-2 sm:mb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-semibold text-white md:text-lg">Agent Canvas</h2>
          <p className="text-xs text-slate-500">
            Drop components here to configure your agent
          </p>
        </div>

        {hasItems && (
          <div className="flex items-center gap-2">
            <Input
              placeholder="Agent name..."
              value={agentName}
              onChange={(e) => setAgentName(e.target.value)}
              className="w-full sm:w-48"
            />
            <Button onClick={handleSaveAgent}>
              <Save className="h-4 w-4" />
              <span className="hidden sm:inline">Save</span>
            </Button>
          </div>
        )}
      </div>

      <div
        ref={setNodeRef}
        className={cn(
          'flex flex-1 flex-col overflow-y-auto rounded-2xl border-2 border-dashed p-3 transition-all duration-300 w-full lg:flex-1 lg:p-5',
          hasItems && 'h-auto flex-1' ,
          isOver
            ? 'border-violet-500/60 bg-violet-500/5 shadow-lg shadow-violet-500/10'
            : hasItems
              ? 'border-slate-700/50 bg-slate-900/50'
              : 'border-slate-800 bg-slate-900/30',
        )}
      >
        {!hasItems && (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 text-slate-600">
            <div className="rounded-full border-2 border-dashed border-slate-700 p-4">
              <Plus className="h-8 w-8" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-slate-400">Drop components here</p>
              <p className="mt-1 text-xs text-slate-600">
                Drag items from the sidebar to build your agent
              </p>
            </div>
          </div>
        )}

        {hasItems && (
          <div className="flex flex-col gap-4 pb-2">
            {selectedProfile && profile && (
              <div>
                <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  <Brain className="h-3 w-3" /> Profile
                </p>
                <AgentCard
                  id={`profile-card:${selectedProfile}`}
                  type="profile"
                  name={profile.name}
                  subtitle={profile.description}
                  onRemove={handleRemoveProfile}
                />
              </div>
            )}

            {selectedSkills.length > 0 && (
              <div>
                <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  <Zap className="h-3 w-3" /> Skills ({selectedSkills.length})
                </p>
                <SortableContext items={skillIds} strategy={verticalListSortingStrategy}>
                  <div className="flex flex-col gap-2">
                    {selectedSkills.map((skillId) => {
                      const skill = data?.skills.find((s) => s.id === skillId);
                      return (
                        <AgentCard
                          key={skillId}
                          id={`skill-card:${skillId}`}
                          type="skill"
                          name={skill?.name || skillId}
                          subtitle={skill?.category}
                          onRemove={() => handleRemoveSkill(skillId)}
                        />
                      );
                    })}
                  </div>
                </SortableContext>
              </div>
            )}

            {selectedLayers.length > 0 && (
              <div>
                <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  <Layers className="h-3 w-3" /> Layers ({selectedLayers.length})
                </p>
                <SortableContext items={layerIds} strategy={verticalListSortingStrategy}>
                  <div className="flex flex-col gap-2">
                    {selectedLayers.map((layerId) => {
                      const layer = data?.layers.find((l) => l.id === layerId);
                      return (
                        <AgentCard
                          key={layerId}
                          id={`layer-card:${layerId}`}
                          type="layer"
                          name={layer?.name || layerId}
                          subtitle={layer?.type}
                          onRemove={() => handleRemoveLayer(layerId)}
                        />
                      );
                    })}
                  </div>
                </SortableContext>
              </div>
            )}

            {selectedProvider && (
              <div>
                <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  <Bot className="h-3 w-3" /> Provider
                </p>
                <AgentCard
                  id={`provider-card:${selectedProvider}`}
                  type="provider"
                  name={selectedProvider}
                  onRemove={handleRemoveProvider}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
});
