'use client';

import React, { useState } from 'react';
import { LinkBlock, StyleVariant } from '@/lib/types';
import { 
  Plus, 
  Trash2, 
  Eye, 
  EyeOff, 
  ArrowUp, 
  ArrowDown, 
  ExternalLink, 
  Layers, 
  Check, 
  X,
  Briefcase,
  Globe,
  UserCheck,
  Calendar,
  Headphones,
  GripVertical
} from 'lucide-react';
import { useToast } from '@/components/ui/Toast';

interface LinksManagerProps {
  links: LinkBlock[];
  onUpdateLinks: (newLinks: LinkBlock[]) => void;
}

export default function LinksManager({ links, onUpdateLinks }: LinksManagerProps) {
  const { showToast } = useToast();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  // Form state for adding/editing
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [url, setUrl] = useState('');
  const [icon, setIcon] = useState('globe');
  const [styleVariant, setStyleVariant] = useState<StyleVariant>('peach');

  const openAddModal = () => {
    setTitle('');
    setSubtitle('');
    setUrl('https://');
    setIcon('globe');
    setStyleVariant('peach');
    setEditingId(null);
    setIsAdding(true);
  };

  const handleSave = () => {
    if (!title.trim()) {
      showToast('Validation Error', 'Please enter a title for the link', 'error');
      return;
    }

    if (editingId) {
      // Edit existing
      const updated = links.map((l) =>
        l.id === editingId
          ? { ...l, title, subtitle, url, icon, styleVariant }
          : l
      );
      onUpdateLinks(updated);
      showToast('Block Updated', `"${title}" saved successfully`, 'success');
    } else {
      // Add new
      const newBlock: LinkBlock = {
        id: `blk_${Date.now()}`,
        userId: 'current_user',
        type: 'link',
        title,
        subtitle,
        url,
        icon,
        styleVariant,
        isActive: true,
        sortOrder: links.length,
        clickCount: 0,
      };
      onUpdateLinks([...links, newBlock]);
      showToast('Block Added', `"${title}" added to your bio`, 'success');
    }

    setIsAdding(false);
    setEditingId(null);
  };

  const handleToggleActive = (id: string) => {
    const updated = links.map((l) => (l.id === id ? { ...l, isActive: !l.isActive } : l));
    onUpdateLinks(updated);
    const target = links.find((l) => l.id === id);
    showToast(
      target?.isActive ? 'Block Hidden' : 'Block Activated',
      `"${target?.title}" is now ${target?.isActive ? 'hidden from' : 'visible on'} your public profile`,
      'info'
    );
  };

  const handleDelete = (id: string) => {
    const target = links.find((l) => l.id === id);
    const updated = links.filter((l) => l.id !== id);
    onUpdateLinks(updated);
    showToast('Block Removed', `"${target?.title}" deleted`, 'info');
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    const reordered = [...links];
    const temp = reordered[index - 1];
    reordered[index - 1] = reordered[index];
    reordered[index] = temp;
    onUpdateLinks(reordered);
    showToast('Order Updated', 'Link position moved up', 'info');
  };

  const moveDown = (index: number) => {
    if (index === links.length - 1) return;
    const reordered = [...links];
    const temp = reordered[index + 1];
    reordered[index + 1] = reordered[index];
    reordered[index] = temp;
    onUpdateLinks(reordered);
    showToast('Order Updated', 'Link position moved down', 'info');
  };

  const handleDrop = (dropIndex: number) => {
    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }
    const reordered = [...links];
    const [moved] = reordered.splice(draggedIndex, 1);
    reordered.splice(dropIndex, 0, moved);
    onUpdateLinks(reordered);
    showToast('Link Reordered', `Moved "${moved.title}" to position ${dropIndex + 1}`, 'info');
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const styleVariants: { label: string; value: StyleVariant; bg: string }[] = [
    { label: 'Peach', value: 'peach', bg: 'bg-pastel-peach' },
    { label: 'Lavender', value: 'lavender', bg: 'bg-pastel-lavender' },
    { label: 'Yellow', value: 'yellow', bg: 'bg-pastel-yellow' },
    { label: 'Mint', value: 'mint', bg: 'bg-pastel-mint' },
    { label: 'Sky', value: 'sky', bg: 'bg-pastel-sky' },
  ];

  return (
    <div className="bg-white rounded-4xl p-5 md:p-6 border border-black/5 shadow-soft">
      {/* Top Header Row */}
      <div className="flex items-center justify-between pb-4 border-b border-black/5">
        <div>
          <h2 className="text-lg font-extrabold text-charcoal">Links & Blocks Manager</h2>
          <p className="text-xs text-charcoal-muted">
            Drag, toggle, and customize your cards with pastel bento styles
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-4 py-2 rounded-full bg-[#1F2024] hover:bg-black text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-transform active:scale-95"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Block</span>
        </button>
      </div>

      {/* Add / Edit Form Modal */}
      {isAdding && (
        <div className="my-4 p-4 rounded-3xl bg-pastel-peach-light border border-pastel-peach-border text-left animate-fadeIn">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold text-charcoal uppercase tracking-wider">
              {editingId ? 'Edit Block' : 'Create New Link Block'}
            </h3>
            <button
              onClick={() => setIsAdding(false)}
              className="text-charcoal-muted hover:text-charcoal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="font-semibold text-charcoal block mb-1">Title</label>
              <input
                type="text"
                placeholder="e.g. My Design Portfolio"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white border border-black/10 focus:outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="font-semibold text-charcoal block mb-1">Target URL</label>
              <input
                type="text"
                placeholder="https://..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white border border-black/10 focus:outline-none focus:border-black font-mono text-[11px]"
              />
            </div>

            <div>
              <label className="font-semibold text-charcoal block mb-1">Subtitle / Note</label>
              <input
                type="text"
                placeholder="e.g. Selected Case Studies 2026"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white border border-black/10 focus:outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="font-semibold text-charcoal block mb-1">Card Pastel Color</label>
              <div className="flex items-center gap-2 pt-1">
                {styleVariants.map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => setStyleVariant(item.value)}
                    className={`w-7 h-7 rounded-full ${item.bg} border-2 transition-transform ${
                      styleVariant === item.value
                        ? 'border-charcoal scale-110 shadow-xs'
                        : 'border-transparent hover:scale-105'
                    }`}
                    title={item.label}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-4 pt-2 border-t border-black/5">
            <button
              onClick={() => setIsAdding(false)}
              className="px-3 py-1.5 rounded-full bg-white text-xs font-semibold text-charcoal border border-black/10"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-1.5 rounded-full bg-[#1F2024] hover:bg-black text-white text-xs font-semibold flex items-center gap-1 shadow-sm"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Save Block</span>
            </button>
          </div>
        </div>
      )}

      {/* List of existing link blocks */}
      <div className="flex flex-col gap-2.5 mt-4">
        {links.map((link, index) => (
          <div
            key={link.id}
            draggable
            onDragStart={(e) => {
              setDraggedIndex(index);
              e.dataTransfer.effectAllowed = 'move';
            }}
            onDragOver={(e) => {
              e.preventDefault();
              e.dataTransfer.dropEffect = 'move';
              if (dragOverIndex !== index) setDragOverIndex(index);
            }}
            onDrop={(e) => {
              e.preventDefault();
              handleDrop(index);
            }}
            onDragEnd={() => {
              setDraggedIndex(null);
              setDragOverIndex(null);
            }}
            className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 cursor-grab active:cursor-grabbing group ${
              draggedIndex === index
                ? 'opacity-40 scale-[0.98] border-dashed border-[#4F83FF]'
                : dragOverIndex === index
                ? 'border-2 border-[#4F83FF] bg-[#EFF4FF] shadow-xs'
                : link.isActive
                ? 'bg-[#FAF7F2] border-black/5 hover:border-black/20'
                : 'bg-black/[0.02] border-dashed border-black/10 opacity-60'
            }`}
          >
            {/* Left: Drag Handle, Reorder arrows & Title */}
            <div className="flex items-center gap-2.5 min-w-0">
              <div 
                className="p-1 text-charcoal/30 group-hover:text-charcoal/70 transition-colors shrink-0"
                title="Drag to reorder link"
              >
                <GripVertical className="w-4 h-4" />
              </div>

              <div className="flex flex-col gap-0.5">
                <button
                  disabled={index === 0}
                  onClick={() => moveUp(index)}
                  className="p-1 rounded-md hover:bg-black/10 disabled:opacity-20 text-charcoal"
                  title="Move Up"
                >
                  <ArrowUp className="w-3 h-3" />
                </button>
                <button
                  disabled={index === links.length - 1}
                  onClick={() => moveDown(index)}
                  className="p-1 rounded-md hover:bg-black/10 disabled:opacity-20 text-charcoal"
                  title="Move Down"
                >
                  <ArrowDown className="w-3 h-3" />
                </button>
              </div>

              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                  link.styleVariant === 'peach'
                    ? 'bg-pastel-peach'
                    : link.styleVariant === 'lavender'
                    ? 'bg-pastel-lavender'
                    : link.styleVariant === 'yellow'
                    ? 'bg-pastel-yellow'
                    : link.styleVariant === 'mint'
                    ? 'bg-pastel-mint'
                    : 'bg-pastel-sky'
                }`}
              >
                <Layers className="w-4 h-4 text-charcoal" />
              </div>

              <div className="min-w-0 text-left">
                <div className="flex items-center gap-2">
                  <p className="text-xs font-bold text-charcoal truncate">{link.title}</p>
                  <span className="text-[10px] px-2 py-0.2 rounded-full bg-white text-charcoal/70 border border-black/5 font-mono">
                    {link.clickCount} clicks
                  </span>
                </div>
                {link.subtitle && (
                  <p className="text-[11px] text-charcoal-muted truncate">{link.subtitle}</p>
                )}
                <span className="text-[10px] text-charcoal/50 font-mono block truncate max-w-xs">
                  {link.url}
                </span>
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={() => handleToggleActive(link.id)}
                className={`p-1.5 rounded-full border transition-colors ${
                  link.isActive
                    ? 'bg-white hover:bg-gray-100 text-charcoal border-black/10'
                    : 'bg-black/5 text-charcoal/40 border-transparent'
                }`}
                title={link.isActive ? 'Hide block' : 'Show block'}
              >
                {link.isActive ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
              </button>

              <button
                onClick={() => {
                  setTitle(link.title);
                  setSubtitle(link.subtitle || '');
                  setUrl(link.url);
                  setIcon(link.icon);
                  setStyleVariant(link.styleVariant);
                  setEditingId(link.id);
                  setIsAdding(true);
                }}
                className="px-2.5 py-1 rounded-full bg-white hover:bg-gray-100 text-[11px] font-semibold text-charcoal border border-black/10"
              >
                Edit
              </button>

              <button
                onClick={() => handleDelete(link.id)}
                className="p-1.5 rounded-full hover:bg-red-50 text-red-500 transition-colors"
                title="Delete block"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
