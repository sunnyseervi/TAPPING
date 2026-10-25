'use client';

import React, { useState } from 'react';
import { Profile, LinkBlock, StyleVariant } from '@/lib/types';
import { 
  User, 
  Plus, 
  Trash2, 
  Eye, 
  EyeOff, 
  ArrowUp, 
  ArrowDown, 
  Layers, 
  Check, 
  X, 
  Globe, 
  Briefcase, 
  Calendar, 
  Headphones, 
  UserCheck, 
  Save, 
  ExternalLink,
  Edit2
} from 'lucide-react';
import { useToast } from '@/components/ui/Toast';
import { InstagramIcon, TwitterIcon, LinkedinIcon, GithubIcon } from '@/components/ui/SocialIcons';

interface EditProfileSectionProps {
  profile: Profile;
  links: LinkBlock[];
  onUpdateProfile: (updated: Profile) => void;
  onUpdateLinks: (newLinks: LinkBlock[]) => void;
}

export default function EditProfileSection({
  profile,
  links,
  onUpdateProfile,
  onUpdateLinks,
}: EditProfileSectionProps) {
  const { showToast } = useToast();

  // Profile Form State
  const [displayName, setDisplayName] = useState(profile.displayName);
  const [username, setUsername] = useState(profile.username);
  const [badgeTitle, setBadgeTitle] = useState(profile.badgeTitle || 'Product Designer');
  const [bio, setBio] = useState(profile.bio);
  const [avatarUrl, setAvatarUrl] = useState(profile.avatarUrl);
  const [socialLinks, setSocialLinks] = useState({
    instagram: profile.socialLinks?.instagram || '',
    twitter: profile.socialLinks?.twitter || '',
    linkedin: profile.socialLinks?.linkedin || '',
    github: profile.socialLinks?.github || '',
    email: profile.socialLinks?.email || '',
    phone: profile.socialLinks?.phone || '',
  });

  // Links Form State
  const [isAddingLink, setIsAddingLink] = useState(false);
  const [editingLinkId, setEditingLinkId] = useState<string | null>(null);
  const [linkTitle, setLinkTitle] = useState('');
  const [linkSubtitle, setLinkSubtitle] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [linkIcon, setLinkIcon] = useState('globe');
  const [linkStyle, setLinkStyle] = useState<StyleVariant>('peach');

  const avatarPresets = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400',
  ];

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUsername = username.toLowerCase().replace(/[^a-z0-9_-]/g, '') || 'creator';
    const updated: Profile = {
      ...profile,
      displayName,
      username: cleanUsername,
      badgeTitle,
      bio,
      avatarUrl,
      socialLinks,
    };
    onUpdateProfile(updated);
    showToast('Profile Updated', 'Your profile details have been saved', 'success');
  };

  const openAddLinkModal = () => {
    setLinkTitle('');
    setLinkSubtitle('');
    setLinkUrl('https://');
    setLinkIcon('globe');
    setLinkStyle('peach');
    setEditingLinkId(null);
    setIsAddingLink(true);
  };

  const openEditLinkModal = (link: LinkBlock) => {
    setLinkTitle(link.title);
    setLinkSubtitle(link.subtitle || '');
    setLinkUrl(link.url);
    setLinkIcon(link.icon || 'globe');
    setLinkStyle(link.styleVariant || 'peach');
    setEditingLinkId(link.id);
    setIsAddingLink(true);
  };

  const handleSaveLink = () => {
    if (!linkTitle.trim()) {
      showToast('Validation Error', 'Please enter a title for the block', 'error');
      return;
    }

    if (editingLinkId) {
      const updated = links.map((l) =>
        l.id === editingLinkId
          ? { ...l, title: linkTitle, subtitle: linkSubtitle, url: linkUrl, icon: linkIcon, styleVariant: linkStyle }
          : l
      );
      onUpdateLinks(updated);
      showToast('Block Updated', `"${linkTitle}" updated`, 'success');
    } else {
      const newBlock: LinkBlock = {
        id: `blk_${Date.now()}`,
        userId: 'current_user',
        type: 'link',
        title: linkTitle,
        subtitle: linkSubtitle,
        url: linkUrl,
        icon: linkIcon,
        styleVariant: linkStyle,
        isActive: true,
        sortOrder: links.length,
        clickCount: 0,
      };
      onUpdateLinks([...links, newBlock]);
      showToast('Block Created', `"${linkTitle}" added`, 'success');
    }

    setIsAddingLink(false);
    setEditingLinkId(null);
  };

  const handleToggleLinkActive = (id: string) => {
    const updated = links.map((l) => (l.id === id ? { ...l, isActive: !l.isActive } : l));
    onUpdateLinks(updated);
    const target = links.find((l) => l.id === id);
    showToast(
      target?.isActive ? 'Block Hidden' : 'Block Visible',
      `"${target?.title}" is now ${target?.isActive ? 'hidden' : 'visible'}`,
      'info'
    );
  };

  const handleDeleteLink = (id: string) => {
    const target = links.find((l) => l.id === id);
    onUpdateLinks(links.filter((l) => l.id !== id));
    showToast('Block Deleted', `Removed "${target?.title}"`, 'info');
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const newIdx = direction === 'up' ? index - 1 : index + 1;
    if (newIdx < 0 || newIdx >= links.length) return;
    const reordered = [...links];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(newIdx, 0, moved);
    onUpdateLinks(reordered);
  };

  const getStyleClass = (variant: StyleVariant) => {
    switch (variant) {
      case 'peach':
        return 'bg-[#EFF4FF] border-[#4F83FF]/30 text-charcoal';
      case 'lavender':
        return 'bg-[#FDF166] border-black/10 text-charcoal';
      case 'yellow':
        return 'bg-[#FDF166] border-black/10 text-charcoal';
      case 'mint':
        return 'bg-[#B6F554] border-black/10 text-charcoal';
      case 'sky':
        return 'bg-[#4F83FF] border-black/10 text-white';
      default:
        return 'bg-white border-black/10 text-charcoal';
    }
  };

  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'briefcase':
        return <Briefcase className="w-4 h-4 text-charcoal stroke-[2.2]" />;
      case 'calendar':
        return <Calendar className="w-4 h-4 text-charcoal stroke-[2.2]" />;
      case 'user-check':
        return <UserCheck className="w-4 h-4 text-charcoal stroke-[2.2]" />;
      case 'headphones':
        return <Headphones className="w-4 h-4 text-charcoal stroke-[2.2]" />;
      default:
        return <Globe className="w-4 h-4 text-charcoal stroke-[2.2]" />;
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* SECTION 1: PROFILE DETAILS FORM */}
      <form onSubmit={handleSaveProfile} className="bg-white rounded-4xl p-6 md:p-8 border border-black/5 shadow-soft">
        <div className="flex items-start justify-between pb-6 border-b border-black/5 mb-6">
          <div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-charcoal tracking-tight leading-none">
              Check Your
            </h1>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-charcoal/35 tracking-tight leading-none mt-1">
              Profile Space
            </h2>
            <p className="text-xs text-charcoal/60 mt-2 font-medium">
              Configure your public creator identity, username, and contact handles
            </p>
          </div>
          <button
            type="submit"
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#4F83FF] hover:bg-[#3B6DE6] text-white text-xs font-black shadow-sm transition-transform active:scale-95 shrink-0"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Profile</span>
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Avatar Column */}
          <div className="flex flex-col items-center gap-3 shrink-0">
            <div className="w-24 h-24 rounded-3xl overflow-hidden bg-[#FDF166] border-2 border-white shadow-soft relative group">
              <img
                src={avatarUrl}
                alt={displayName}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-[10px] font-bold text-charcoal/60 uppercase tracking-wider">
              Photo Presets
            </span>
            <div className="flex items-center gap-2">
              {avatarPresets.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setAvatarUrl(preset)}
                  className={`w-7 h-7 rounded-xl overflow-hidden border transition-all ${
                    avatarUrl === preset ? 'ring-2 ring-charcoal border-white scale-105' : 'border-black/10 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={preset} alt="preset" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Form Fields Column */}
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-bold text-charcoal/80 uppercase tracking-wider block mb-1">
                Display Name
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-2xl bg-[#FAF7F2] border border-black/10 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-charcoal/20"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-charcoal/80 uppercase tracking-wider block mb-1">
                Username (@handle)
              </label>
              <div className="flex items-center bg-[#FAF7F2] rounded-2xl border border-black/10 px-3.5 py-2.5">
                <span className="text-xs font-bold text-charcoal/50 select-none mr-1">tapping.bio/</span>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="w-full bg-transparent text-xs font-bold focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-charcoal/80 uppercase tracking-wider block mb-1">
                Professional Title / Badge
              </label>
              <input
                type="text"
                value={badgeTitle}
                onChange={(e) => setBadgeTitle(e.target.value)}
                placeholder="Product Designer"
                className="w-full px-3.5 py-2.5 rounded-2xl bg-[#FAF7F2] border border-black/10 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-charcoal/20"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-charcoal/80 uppercase tracking-wider block mb-1">
                Work Email
              </label>
              <input
                type="email"
                value={socialLinks.email}
                onChange={(e) => setSocialLinks({ ...socialLinks, email: e.target.value })}
                placeholder="contact@alexmorgan.design"
                className="w-full px-3.5 py-2.5 rounded-2xl bg-[#FAF7F2] border border-black/10 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-charcoal/20"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-[11px] font-bold text-charcoal/80 uppercase tracking-wider block mb-1">
                Bio Description
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={2}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-[#FAF7F2] border border-black/10 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-charcoal/20 resize-none"
              />
            </div>

            {/* Social Handles */}
            <div>
              <label className="text-[11px] font-bold text-charcoal/80 uppercase tracking-wider block mb-1">
                Instagram Username
              </label>
              <div className="flex items-center bg-[#FAF7F2] rounded-2xl border border-black/10 px-3.5 py-2.5">
                <span className="text-xs font-bold text-charcoal/50 mr-1 select-none">@</span>
                <input
                  type="text"
                  value={socialLinks.instagram}
                  onChange={(e) => setSocialLinks({ ...socialLinks, instagram: e.target.value })}
                  placeholder="alexmorgan"
                  className="w-full bg-transparent text-xs font-semibold focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-charcoal/80 uppercase tracking-wider block mb-1">
                X / Twitter Username
              </label>
              <div className="flex items-center bg-[#FAF7F2] rounded-2xl border border-black/10 px-3.5 py-2.5">
                <span className="text-xs font-bold text-charcoal/50 mr-1 select-none">@</span>
                <input
                  type="text"
                  value={socialLinks.twitter}
                  onChange={(e) => setSocialLinks({ ...socialLinks, twitter: e.target.value })}
                  placeholder="alexmorgan"
                  className="w-full bg-transparent text-xs font-semibold focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-charcoal/80 uppercase tracking-wider block mb-1">
                GitHub Username
              </label>
              <input
                type="text"
                value={socialLinks.github}
                onChange={(e) => setSocialLinks({ ...socialLinks, github: e.target.value })}
                placeholder="alexmorgan"
                className="w-full px-3.5 py-2.5 rounded-2xl bg-[#FAF7F2] border border-black/10 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-charcoal/20"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-charcoal/80 uppercase tracking-wider block mb-1">
                LinkedIn Profile URL
              </label>
              <input
                type="text"
                value={socialLinks.linkedin}
                onChange={(e) => setSocialLinks({ ...socialLinks, linkedin: e.target.value })}
                placeholder="https://linkedin.com/in/..."
                className="w-full px-3.5 py-2.5 rounded-2xl bg-[#FAF7F2] border border-black/10 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-charcoal/20"
              />
            </div>
          </div>
        </div>
      </form>

      {/* SECTION 2: LINKS & CONTENT BLOCKS */}
      <div className="bg-white rounded-4xl p-6 md:p-8 border border-black/5 shadow-soft">
        <div className="flex items-center justify-between pb-4 border-b border-black/5 mb-5">
          <div>
            <h3 className="text-xl font-black text-charcoal tracking-tight">Active Link Blocks</h3>
            <p className="text-xs text-charcoal/60 mt-0.5 font-medium">
              Reorder and style your content tiles with high-contrast color blocks
            </p>
          </div>
          <button
            onClick={openAddLinkModal}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#4F83FF] hover:bg-[#3B6DE6] text-white text-xs font-black shadow-sm transition-transform active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add Block</span>
          </button>
        </div>

        {/* Link Blocks List */}
        <div className="flex flex-col gap-3">
          {links.map((link, idx) => (
            <div
              key={link.id}
              className={`p-3.5 sm:p-4 rounded-3xl border transition-all flex items-center justify-between gap-3 ${
                link.isActive ? getStyleClass(link.styleVariant) : 'bg-gray-50/80 border-black/5 opacity-60'
              }`}
            >
              {/* Left: Reorder buttons + Icon + Info */}
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex flex-col gap-0.5 shrink-0">
                  <button
                    onClick={() => handleMove(idx, 'up')}
                    disabled={idx === 0}
                    className="p-1 rounded-lg hover:bg-white/80 disabled:opacity-20 text-charcoal transition-colors"
                    title="Move up"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleMove(idx, 'down')}
                    disabled={idx === links.length - 1}
                    className="p-1 rounded-lg hover:bg-white/80 disabled:opacity-20 text-charcoal transition-colors"
                    title="Move down"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center shrink-0 shadow-xs border border-white/60">
                  {renderIcon(link.icon)}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-xs sm:text-sm font-black text-charcoal truncate">
                      {link.title}
                    </p>
                    <span className="text-[10px] font-mono px-2 py-0.2 rounded-full bg-white/80 text-charcoal/70 border border-black/5 shrink-0">
                      {link.clickCount} clicks
                    </span>
                  </div>
                  {link.subtitle && (
                    <p className="text-[11px] text-charcoal/70 truncate mt-0.5 font-medium">
                      {link.subtitle}
                    </p>
                  )}
                  <p className="text-[10px] text-charcoal/50 truncate font-mono mt-0.5">
                    {link.url}
                  </p>
                </div>
              </div>

              {/* Right: Actions */}
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => handleToggleLinkActive(link.id)}
                  className={`p-2 rounded-xl transition-colors ${
                    link.isActive ? 'hover:bg-white/80 text-charcoal' : 'hover:bg-white text-charcoal/40'
                  }`}
                  title={link.isActive ? 'Hide block' : 'Show block'}
                >
                  {link.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>

                <button
                  onClick={() => openEditLinkModal(link)}
                  className="px-3 py-1.5 rounded-xl bg-white/90 hover:bg-white text-charcoal text-xs font-bold border border-black/5 shadow-xs transition-colors"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDeleteLink(link.id)}
                  className="p-2 rounded-xl hover:bg-rose-100 text-charcoal/60 hover:text-rose-600 transition-colors"
                  title="Delete block"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add / Edit Block Modal */}
      {isAddingLink && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-4xl p-6 w-full max-w-md shadow-2xl border border-black/10">
            <div className="flex items-center justify-between pb-3 border-b border-black/5 mb-4">
              <h3 className="text-base font-black text-charcoal">
                {editingLinkId ? 'Edit Block' : 'Add Link Block'}
              </h3>
              <button
                onClick={() => {
                  setIsAddingLink(false);
                  setEditingLinkId(null);
                }}
                className="p-1.5 rounded-xl hover:bg-black/5 text-charcoal/60 hover:text-charcoal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3.5">
              <div>
                <label className="text-[11px] font-bold text-charcoal/80 uppercase tracking-wider block mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={linkTitle}
                  onChange={(e) => setLinkTitle(e.target.value)}
                  placeholder="e.g., Portfolio & Works"
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-[#FAF7F2] border border-black/10 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-charcoal/20"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-charcoal/80 uppercase tracking-wider block mb-1">
                  Subtitle (Optional)
                </label>
                <input
                  type="text"
                  value={linkSubtitle}
                  onChange={(e) => setLinkSubtitle(e.target.value)}
                  placeholder="e.g., Case studies and selected client projects"
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-[#FAF7F2] border border-black/10 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-charcoal/20"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-charcoal/80 uppercase tracking-wider block mb-1">
                  Destination URL
                </label>
                <input
                  type="url"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-[#FAF7F2] border border-black/10 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-charcoal/20"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-charcoal/80 uppercase tracking-wider block mb-1.5">
                  Color Theme Block
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {[
                    { id: 'sky' as StyleVariant, name: 'Cobalt', bg: 'bg-[#4F83FF]' },
                    { id: 'yellow' as StyleVariant, name: 'Butter', bg: 'bg-[#FDF166]' },
                    { id: 'mint' as StyleVariant, name: 'Lime', bg: 'bg-[#B6F554]' },
                    { id: 'peach' as StyleVariant, name: 'Soft Blue', bg: 'bg-[#EFF4FF]' },
                    { id: 'lavender' as StyleVariant, name: 'White', bg: 'bg-white' },
                  ].map((v) => (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => setLinkStyle(v.id)}
                      className={`h-9 rounded-xl border border-black/10 flex items-center justify-center transition-all ${v.bg} ${
                        linkStyle === v.id ? 'ring-2 ring-charcoal scale-105 shadow-xs' : 'opacity-80 hover:opacity-100'
                      }`}
                      title={v.name}
                    >
                      {linkStyle === v.id && (
                        <Check className={`w-4 h-4 ${v.id === 'sky' ? 'text-white' : 'text-charcoal'}`} />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddingLink(false);
                    setEditingLinkId(null);
                  }}
                  className="flex-1 py-2.5 rounded-2xl border border-black/10 text-xs font-bold text-charcoal/70 hover:bg-black/5"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveLink}
                  className="flex-1 py-2.5 rounded-2xl bg-[#4F83FF] hover:bg-[#3B6DE6] text-white text-xs font-black shadow-xs transition-transform active:scale-95"
                >
                  {editingLinkId ? 'Save Changes' : 'Create Block'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}