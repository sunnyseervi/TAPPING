'use client';

import React, { useState } from 'react';
import { Profile, LinkBlock, StyleVariant, VCardProfile } from '@/lib/types';
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
  Edit2,
  Phone,
  Building2,
  MapPin,
  Upload,
  Image as ImageIcon
} from 'lucide-react';
import { useToast } from '@/components/ui/Toast';
import { InstagramIcon, TwitterIcon, LinkedinIcon, GithubIcon } from '@/components/ui/SocialIcons';

interface EditProfileSectionProps {
  profile: Profile;
  vcard?: VCardProfile;
  links: LinkBlock[];
  onUpdateProfile: (updated: Profile) => void;
  onUpdateVCard?: (updated: VCardProfile) => void;
  onUpdateLinks: (newLinks: LinkBlock[]) => void;
  onLiveChange?: (updated: Profile) => void;
}

export default function EditProfileSection({
  profile,
  vcard,
  links,
  onUpdateProfile,
  onUpdateVCard,
  onUpdateLinks,
  onLiveChange,
}: EditProfileSectionProps) {
  const { showToast } = useToast();
  const [displayHost, setDisplayHost] = useState('tapping.bio');

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      setDisplayHost(window.location.host);
    }
  }, []);

  // Profile & Contact Details State
  const [displayName, setDisplayName] = useState(profile.displayName);
  const [username, setUsername] = useState(profile.username);
  const [badgeTitle, setBadgeTitle] = useState(profile.badgeTitle || vcard?.jobTitle || 'Product Designer');
  const [bio, setBio] = useState(profile.bio);
  const [avatarUrl, setAvatarUrl] = useState(profile.avatarUrl);
  
  // Contact Details
  const [phone, setPhone] = useState(vcard?.workPhone || vcard?.mobilePhone || profile.socialLinks?.phone || '+1 (415) 890-2200');
  const [organization, setOrganization] = useState(vcard?.organization || 'Tapping Technologies');
  const [streetAddress, setStreetAddress] = useState(vcard?.streetAddress || '742 Market Street');
  const [city, setCity] = useState(vcard?.city || 'San Francisco, CA');
  const [country, setCountry] = useState(vcard?.country || 'United States');
  const [website, setWebsite] = useState(vcard?.website || '');

  const [socialLinks, setSocialLinks] = useState({
    instagram: profile.socialLinks?.instagram || '',
    twitter: profile.socialLinks?.twitter || '',
    linkedin: profile.socialLinks?.linkedin || '',
    github: profile.socialLinks?.github || '',
    email: profile.socialLinks?.email || vcard?.workEmail || 'contact@alexmorgan.design',
    phone: profile.socialLinks?.phone || vcard?.workPhone || '+1 (415) 890-2200',
  });

  const notifyLive = (partial: Partial<Profile>) => {
    if (onLiveChange) {
      onLiveChange({
        ...profile,
        displayName,
        username,
        badgeTitle,
        bio,
        avatarUrl,
        socialLinks: {
          ...socialLinks,
          phone,
        },
        ...partial,
      });
    }
  };

  // Links Form State
  const [isAddingLink, setIsAddingLink] = useState(false);
  const [editingLinkId, setEditingLinkId] = useState<string | null>(null);
  const [linkTitle, setLinkTitle] = useState('');
  const [linkSubtitle, setLinkSubtitle] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [linkIcon, setLinkIcon] = useState('globe');
  const [linkStyle, setLinkStyle] = useState<StyleVariant>('peach');
  const [linkBgImage, setLinkBgImage] = useState('');
  const [linkBgColor, setLinkBgColor] = useState('');
  const [linkTextColor, setLinkTextColor] = useState('#141518');
  const linkFileInputRef = React.useRef<HTMLInputElement>(null);

  const handleLinkImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Invalid File', 'Please select a PNG, JPG, or SVG image', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setLinkBgImage(dataUrl);
      setLinkTextColor('#FFFFFF');
      showToast('Link Background Uploaded', 'Custom artwork applied to link card', 'success');
    };
    reader.readAsDataURL(file);
  };

  const avatarPresets = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400',
  ];

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUsername = username.toLowerCase().replace(/[^a-z0-9_-]/g, '') || 'creator';
    const updatedProfile: Profile = {
      ...profile,
      displayName,
      username: cleanUsername,
      badgeTitle,
      bio,
      avatarUrl,
      socialLinks: {
        ...socialLinks,
        phone,
      },
    };
    onUpdateProfile(updatedProfile);

    if (onUpdateVCard) {
      const parts = displayName.trim().split(' ');
      const fName = parts[0] || 'Alex';
      const lName = parts.slice(1).join(' ') || 'Morgan';
      const updatedVCard: VCardProfile = {
        ...(vcard || {
          id: 'vc_default',
          userId: profile.id,
          note: 'Saved via Tapping Bio',
        }),
        id: vcard?.id || 'vc_default',
        userId: profile.id,
        firstName: fName,
        lastName: lName,
        organization,
        jobTitle: badgeTitle,
        workPhone: phone,
        mobilePhone: phone,
        workEmail: socialLinks.email,
        website: website || `http://${displayHost}/${cleanUsername}`,
        streetAddress,
        city,
        country,
        note: vcard?.note || 'Saved via Tapping Bio Space',
      };
      onUpdateVCard(updatedVCard);
    }

    showToast('Profile & Contact Saved', 'Your bio and contact details have been updated', 'success');
  };

  const openAddLinkModal = () => {
    setLinkTitle('');
    setLinkSubtitle('');
    setLinkUrl('https://');
    setLinkIcon('globe');
    setLinkStyle('peach');
    setLinkBgImage('');
    setLinkBgColor('');
    setLinkTextColor('#141518');
    setEditingLinkId(null);
    setIsAddingLink(true);
  };

  const openEditLinkModal = (link: LinkBlock) => {
    setLinkTitle(link.title);
    setLinkSubtitle(link.subtitle || '');
    setLinkUrl(link.url);
    setLinkIcon(link.icon || 'globe');
    setLinkStyle(link.styleVariant || 'peach');
    setLinkBgImage(link.bgImage || '');
    setLinkBgColor(link.bgColor || '');
    setLinkTextColor(link.textColor || (link.bgImage ? '#FFFFFF' : '#141518'));
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
          ? { 
              ...l, 
              title: linkTitle, 
              subtitle: linkSubtitle, 
              url: linkUrl, 
              icon: linkIcon, 
              styleVariant: linkStyle,
              bgImage: linkBgImage,
              bgColor: linkBgColor,
              textColor: linkTextColor,
            }
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
        bgImage: linkBgImage,
        bgColor: linkBgColor,
        textColor: linkTextColor,
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
                  onClick={() => {
                    setAvatarUrl(preset);
                    notifyLive({ avatarUrl: preset });
                  }}
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
                onChange={(e) => {
                  setDisplayName(e.target.value);
                  notifyLive({ displayName: e.target.value });
                }}
                required
                className="w-full px-3.5 py-2.5 rounded-2xl bg-[#FAF7F2] border border-black/10 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-charcoal/20"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-charcoal/80 uppercase tracking-wider block mb-1">
                Username (@handle)
              </label>
              <div className="flex items-center bg-[#FAF7F2] rounded-2xl border border-black/10 px-3.5 py-2.5">
                <span className="text-xs font-bold text-charcoal/50 select-none mr-1">{displayHost}/</span>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    notifyLive({ username: e.target.value });
                  }}
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
                onChange={(e) => {
                  setBadgeTitle(e.target.value);
                  notifyLive({ badgeTitle: e.target.value });
                }}
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
                onChange={(e) => {
                  const updatedSocial = { ...socialLinks, email: e.target.value };
                  setSocialLinks(updatedSocial);
                  notifyLive({ socialLinks: updatedSocial });
                }}
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
                onChange={(e) => {
                  setBio(e.target.value);
                  notifyLive({ bio: e.target.value });
                }}
                rows={2}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-[#FAF7F2] border border-black/10 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-charcoal/20 resize-none"
              />
            </div>

            {/* Direct Contact & Work Information */}
            <div>
              <label className="text-[11px] font-bold text-charcoal/80 uppercase tracking-wider block mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  notifyLive({ socialLinks: { ...socialLinks, phone: e.target.value } });
                }}
                placeholder="+1 (415) 890-2200"
                className="w-full px-3.5 py-2.5 rounded-2xl bg-[#FAF7F2] border border-black/10 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-charcoal/20"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-charcoal/80 uppercase tracking-wider block mb-1">
                Company / Organization
              </label>
              <input
                type="text"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                placeholder="Tapping Technologies"
                className="w-full px-3.5 py-2.5 rounded-2xl bg-[#FAF7F2] border border-black/10 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-charcoal/20"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-charcoal/80 uppercase tracking-wider block mb-1">
                Street Address
              </label>
              <input
                type="text"
                value={streetAddress}
                onChange={(e) => setStreetAddress(e.target.value)}
                placeholder="742 Market Street"
                className="w-full px-3.5 py-2.5 rounded-2xl bg-[#FAF7F2] border border-black/10 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-charcoal/20"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-charcoal/80 uppercase tracking-wider block mb-1">
                City & Country
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="San Francisco, CA"
                  className="w-full px-3 py-2.5 rounded-2xl bg-[#FAF7F2] border border-black/10 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-charcoal/20"
                />
                <input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="United States"
                  className="w-full px-3 py-2.5 rounded-2xl bg-[#FAF7F2] border border-black/10 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-charcoal/20"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="text-[11px] font-bold text-charcoal/80 uppercase tracking-wider block mb-1">
                Website
              </label>
              <input
                type="url"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="https://alexmorgan.design"
                className="w-full px-3.5 py-2.5 rounded-2xl bg-[#FAF7F2] border border-black/10 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-charcoal/20"
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
                  onChange={(e) => {
                    const updatedSocial = { ...socialLinks, instagram: e.target.value };
                    setSocialLinks(updatedSocial);
                    notifyLive({ socialLinks: updatedSocial });
                  }}
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
                  onChange={(e) => {
                    const updatedSocial = { ...socialLinks, twitter: e.target.value };
                    setSocialLinks(updatedSocial);
                    notifyLive({ socialLinks: updatedSocial });
                  }}
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
                onChange={(e) => {
                  const updatedSocial = { ...socialLinks, github: e.target.value };
                  setSocialLinks(updatedSocial);
                  notifyLive({ socialLinks: updatedSocial });
                }}
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
                onChange={(e) => {
                  const updatedSocial = { ...socialLinks, linkedin: e.target.value };
                  setSocialLinks(updatedSocial);
                  notifyLive({ socialLinks: updatedSocial });
                }}
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
          {links.map((link, idx) => {
            const hasCustomBg = !!link.bgImage || !!link.bgColor;
            return (
              <div
                key={link.id}
                className={`p-3.5 sm:p-4 rounded-3xl border transition-all flex items-center justify-between gap-3 relative overflow-hidden ${
                  hasCustomBg
                    ? 'border-black/15 shadow-2xs'
                    : link.isActive ? getStyleClass(link.styleVariant) : 'bg-gray-50/80 border-black/5 opacity-60'
                }`}
                style={{
                  backgroundImage: link.bgImage ? `url(${link.bgImage})` : undefined,
                  backgroundSize: link.bgImage ? 'cover' : undefined,
                  backgroundPosition: link.bgImage ? 'center' : undefined,
                  backgroundColor: link.bgColor || undefined,
                  color: link.textColor || (link.bgImage ? '#FFFFFF' : undefined),
                }}
              >
                {link.bgImage && (
                  <div className="absolute inset-0 bg-black/45 backdrop-blur-[0.5px] pointer-events-none z-0" />
                )}

                {/* Left: Reorder buttons + Icon + Info */}
                <div className="flex items-center gap-3 min-w-0 relative z-10">
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
                      <p 
                        className="text-xs sm:text-sm font-black truncate"
                        style={link.textColor ? { color: link.textColor } : (link.bgImage ? { color: '#FFFFFF' } : undefined)}
                      >
                        {link.title}
                      </p>
                      {link.bgImage && (
                        <span className="text-[9px] font-mono px-2 py-0.2 rounded-full bg-white/20 text-white border border-white/20 shrink-0">
                          Custom Art
                        </span>
                      )}
                      <span className="text-[10px] font-mono px-2 py-0.2 rounded-full bg-white/80 text-charcoal/70 border border-black/5 shrink-0">
                        {link.clickCount} clicks
                      </span>
                    </div>
                    {link.subtitle && (
                      <p 
                        className="text-[11px] opacity-80 truncate mt-0.5 font-medium"
                        style={link.textColor ? { color: link.textColor } : (link.bgImage ? { color: '#FFFFFF' } : undefined)}
                      >
                        {link.subtitle}
                      </p>
                    )}
                    <p className="text-[10px] opacity-60 truncate font-mono mt-0.5">
                      {link.url}
                    </p>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-1.5 shrink-0 relative z-10">
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
                    className="px-3 py-1.5 rounded-xl bg-white/90 hover:bg-white text-charcoal text-xs font-bold border border-black/5 shadow-xs transition-colors cursor-pointer"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDeleteLink(link.id)}
                    className="p-2 rounded-xl hover:bg-rose-100 text-charcoal/60 hover:text-rose-600 transition-colors cursor-pointer"
                    title="Delete block"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add / Edit Block Modal */}
      {isAddingLink && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-4xl p-6 w-full max-w-md shadow-2xl border border-black/10 max-h-[90vh] overflow-y-auto no-scrollbar">
            <div className="flex items-center justify-between pb-3 border-b border-black/5 mb-4">
              <h3 className="text-base font-black text-charcoal">
                {editingLinkId ? 'Edit Block' : 'Add Link Block'}
              </h3>
              <button
                onClick={() => {
                  setIsAddingLink(false);
                  setEditingLinkId(null);
                }}
                className="p-1.5 rounded-xl hover:bg-black/5 text-charcoal/60 hover:text-charcoal cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Live Mini Preview of Link Card */}
            <div className="mb-4">
              <p className="text-[10px] font-black uppercase tracking-wider text-charcoal/50 mb-1.5">
                Live Card Preview
              </p>
              <div
                className="p-3.5 rounded-2xl border border-black/10 shadow-2xs relative overflow-hidden flex items-center justify-between"
                style={{
                  backgroundImage: linkBgImage ? `url(${linkBgImage})` : undefined,
                  backgroundSize: linkBgImage ? 'cover' : undefined,
                  backgroundPosition: linkBgImage ? 'center' : undefined,
                  backgroundColor: linkBgColor || (linkStyle === 'sky' ? '#4F83FF' : linkStyle === 'yellow' ? '#FDF166' : linkStyle === 'mint' ? '#B6F554' : linkStyle === 'peach' ? '#EFF4FF' : '#FFFFFF'),
                  color: linkTextColor,
                }}
              >
                {linkBgImage && (
                  <div className="absolute inset-0 bg-black/45 backdrop-blur-[0.5px] pointer-events-none z-0" />
                )}
                <div className="flex items-center gap-3 min-w-0 relative z-10">
                  <div className="w-8 h-8 rounded-xl bg-white/90 border border-black/5 flex items-center justify-center shrink-0 shadow-2xs text-charcoal">
                    {renderIcon(linkIcon)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-black truncate leading-tight" style={{ color: linkTextColor }}>
                      {linkTitle || 'Your Link Title'}
                    </p>
                    <p className="text-[10px] opacity-80 truncate mt-0.5 font-medium" style={{ color: linkTextColor }}>
                      {linkSubtitle || 'Subtitle or description preview'}
                    </p>
                  </div>
                </div>
                <ExternalLink className="w-3.5 h-3.5 shrink-0 opacity-80 relative z-10" style={{ color: linkTextColor }} />
              </div>
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

              {/* Custom Uploaded Link Background Image */}
              <div className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-black/10 flex flex-col gap-2.5">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-[11px] font-black text-charcoal uppercase tracking-wider block">
                      Custom Link Background
                    </label>
                    <p className="text-[10px] text-charcoal/60">
                      Upload any image or artwork to display behind this block
                    </p>
                  </div>
                  {linkBgImage && (
                    <button
                      type="button"
                      onClick={() => setLinkBgImage('')}
                      className="px-2 py-0.5 rounded-lg bg-rose-50 text-rose-600 text-[10px] font-bold border border-rose-200 cursor-pointer"
                    >
                      Clear
                    </button>
                  )}
                </div>

                <input
                  type="file"
                  ref={linkFileInputRef}
                  accept="image/*"
                  className="hidden"
                  onChange={handleLinkImageUpload}
                />

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => linkFileInputRef.current?.click()}
                    className="flex-1 py-2 px-3 rounded-xl bg-white hover:bg-gray-50 border border-black/10 text-xs font-bold text-charcoal flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5 text-[#4F83FF]" />
                    <span>Upload Image (PNG/JPG)</span>
                  </button>
                </div>

                {/* Quick Artwork Background Presets */}
                <div className="grid grid-cols-3 gap-1 pt-1">
                  {[
                    { name: 'Pop Art', url: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=500&auto=format&fit=crop&q=80' },
                    { name: 'Neon Grid', url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=500&auto=format&fit=crop&q=80' },
                    { name: 'Dark Marble', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop&q=80' },
                  ].map((p) => (
                    <button
                      key={p.name}
                      type="button"
                      onClick={() => {
                        setLinkBgImage(p.url);
                        setLinkTextColor('#FFFFFF');
                      }}
                      className="p-1 rounded-lg border border-black/10 bg-white hover:bg-gray-50 text-[10px] font-bold text-charcoal truncate shadow-2xs flex items-center gap-1 cursor-pointer"
                    >
                      <span className="w-3.5 h-3.5 rounded-xs bg-cover bg-center shrink-0" style={{ backgroundImage: `url(${p.url})` }} />
                      <span className="truncate">{p.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Text Contrast Color */}
              <div>
                <label className="text-[11px] font-bold text-charcoal/80 uppercase tracking-wider block mb-1.5">
                  Link Text Color
                </label>
                <div className="flex items-center gap-2">
                  {[
                    { label: 'Dark Text', hex: '#141518', bg: 'bg-[#141518] text-white' },
                    { label: 'White Text', hex: '#FFFFFF', bg: 'bg-white text-charcoal border border-black/20' },
                    { label: 'Gold Text', hex: '#FACC15', bg: 'bg-[#FACC15] text-black' },
                    { label: 'Electric Blue', hex: '#4F83FF', bg: 'bg-[#4F83FF] text-white' },
                  ].map((c) => (
                    <button
                      key={c.hex}
                      type="button"
                      onClick={() => setLinkTextColor(c.hex)}
                      className={`px-2.5 py-1 rounded-xl text-[10px] font-bold transition-all cursor-pointer ${c.bg} ${
                        linkTextColor === c.hex ? 'ring-2 ring-charcoal scale-105 shadow-xs' : 'opacity-80'
                      }`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Theme Block Fallback */}
              <div>
                <label className="text-[11px] font-bold text-charcoal/80 uppercase tracking-wider block mb-1.5">
                  Color Theme Palette
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
                      onClick={() => {
                        setLinkStyle(v.id);
                        if (!linkBgImage) {
                          setLinkTextColor(v.id === 'sky' ? '#FFFFFF' : '#141518');
                        }
                      }}
                      className={`h-9 rounded-xl border border-black/10 flex items-center justify-center transition-all cursor-pointer ${v.bg} ${
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
                  className="flex-1 py-2.5 rounded-2xl border border-black/10 text-xs font-bold text-charcoal/70 hover:bg-black/5 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveLink}
                  className="flex-1 py-2.5 rounded-2xl bg-[#4F83FF] hover:bg-[#3B6DE6] text-white text-xs font-black shadow-xs transition-transform active:scale-95 cursor-pointer"
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