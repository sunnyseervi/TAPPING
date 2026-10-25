'use client';

import React, { useState } from 'react';
import { Profile, LinkBlock, StyleVariant, VCardProfile, LinkCardStyleType, StoreConfig, StoreProduct } from '@/lib/types';
import { resolveLinkCardClasses } from '@/lib/themes';
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
  Image as ImageIcon,
  Palette,
  Link2,
  Copy,
  Download,
  QrCode as QrCodeIcon,
  ShoppingBag,
  Tag
} from 'lucide-react';
import QRCode from 'qrcode';
import { useToast } from '@/components/ui/Toast';
import { InstagramIcon, TwitterIcon, LinkedinIcon, GithubIcon } from '@/components/ui/SocialIcons';
import ThemesStudio from '@/components/dashboard/ThemesStudio';
import { compressImageFile, compressAvatarImage, compressLinkCardImage, formatFileSize } from '@/lib/imageCompression';
import { getStoredStore, saveStoredStore } from '@/lib/storage';

interface EditProfileSectionProps {
  profile: Profile;
  vcard?: VCardProfile;
  links: LinkBlock[];
  store?: StoreConfig;
  onUpdateProfile: (updated: Profile) => void;
  onUpdateVCard?: (updated: VCardProfile) => void;
  onUpdateLinks: (newLinks: LinkBlock[]) => void;
  onUpdateStore?: (updated: StoreConfig) => void;
  onLiveChange?: (updated: Profile) => void;
  onLiveVCardChange?: (updated: VCardProfile) => void;
  activeSectionTab?: 'profile' | 'links' | 'products' | 'themes';
  onSectionTabChange?: (tab: 'profile' | 'links' | 'products' | 'themes') => void;
}

export default function EditProfileSection({
  profile,
  vcard,
  links,
  store,
  onUpdateProfile,
  onUpdateVCard,
  onUpdateLinks,
  onUpdateStore,
  onLiveChange,
  onLiveVCardChange,
  activeSectionTab = 'profile',
  onSectionTabChange,
}: EditProfileSectionProps) {
  const { showToast } = useToast();
  const [displayHost, setDisplayHost] = useState('tapping.bio');
  const [currentTab, setCurrentTab] = useState<'profile' | 'links' | 'products' | 'themes'>(activeSectionTab || 'profile');

  // Store Management State
  const [localStore, setLocalStore] = useState<StoreConfig>(() => store || getStoredStore());
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [newProdName, setNewProdName] = useState('');
  const [newProdPrice, setNewProdPrice] = useState<number>(499);
  const [newProdComparePrice, setNewProdComparePrice] = useState<number | undefined>(undefined);
  const [newProdLinkUrl, setNewProdLinkUrl] = useState('');
  const [newProdImageUrl, setNewProdImageUrl] = useState('');
  const [newProdDescription, setNewProdDescription] = useState('');
  const [newProdVariants, setNewProdVariants] = useState('');
  const [compressingProdImage, setCompressingProdImage] = useState(false);
  const prodImageInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (store) setLocalStore(store);
  }, [store]);

  const persistStore = (updated: StoreConfig) => {
    setLocalStore(updated);
    saveStoredStore(updated);
    onUpdateStore?.(updated);
  };

  const handleProductImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Invalid File', 'Please select an image file (PNG, JPG, WebP)', 'error');
      return;
    }

    setCompressingProdImage(true);
    try {
      const result = await compressImageFile(file, { maxWidth: 1000, maxHeight: 1000, quality: 0.78 });
      setNewProdImageUrl(result.dataUrl);
      showToast(
        'Product Image Compressed',
        `Reduced from ${formatFileSize(result.originalBytes)} to ${formatFileSize(result.compressedBytes)} (${result.savingsPercent}% data saved)!`,
        'success'
      );
    } catch (err) {
      showToast('Upload Failed', err instanceof Error ? err.message : 'Could not compress image', 'error');
    } finally {
      setCompressingProdImage(false);
    }
  };

  const handleSaveProduct = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newProdName.trim()) {
      showToast('Product Title Required', 'Please enter a name for your product.', 'error');
      return;
    }
    if (!newProdPrice || newProdPrice <= 0) {
      showToast('Price Required', 'Please enter a price in ₹ INR.', 'error');
      return;
    }

    const newProduct: StoreProduct = {
      id: `product_${Date.now()}`,
      name: newProdName.trim(),
      price: Number(newProdPrice),
      compareAtPrice: newProdComparePrice ? Number(newProdComparePrice) : undefined,
      imageUrl: newProdImageUrl || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500',
      linkUrl: newProdLinkUrl.trim() || undefined,
      description: newProdDescription.trim(),
      variants: newProdVariants ? newProdVariants.split(',').map((v) => v.trim()).filter(Boolean) : [],
      isActive: true,
      sortOrder: (localStore.products?.length || 0) + 1,
    };

    const updatedStore: StoreConfig = {
      ...localStore,
      enabled: true,
      products: [newProduct, ...(localStore.products || [])],
    };

    persistStore(updatedStore);

    // Reset fields
    setNewProdName('');
    setNewProdPrice(499);
    setNewProdComparePrice(undefined);
    setNewProdLinkUrl('');
    setNewProdImageUrl('');
    setNewProdDescription('');
    setNewProdVariants('');
    setShowAddProductModal(false);
    showToast('Product Added', `"${newProduct.name}" is now live on your slidable bio store!`, 'success');
  };

  const handleToggleProductActive = (productId: string) => {
    const updatedProducts = (localStore.products || []).map((p) =>
      p.id === productId ? { ...p, isActive: !p.isActive } : p
    );
    persistStore({ ...localStore, products: updatedProducts });
  };

  const handleDeleteProduct = (productId: string) => {
    const updatedProducts = (localStore.products || []).filter((p) => p.id !== productId);
    persistStore({ ...localStore, products: updatedProducts });
    showToast('Product Removed', 'The item has been deleted from your store.', 'info');
  };

  React.useEffect(() => {
    if (activeSectionTab) {
      setCurrentTab(activeSectionTab);
    }
  }, [activeSectionTab]);

  const handleTabSelect = (tab: 'profile' | 'links' | 'products' | 'themes') => {
    setCurrentTab(tab);
    if (onSectionTabChange) {
      onSectionTabChange(tab);
    }
  };

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
  const [avatarFit, setAvatarFit] = useState<'cover' | 'contain'>(profile.avatarFit ?? 'contain');
  const [avatarZoom, setAvatarZoom] = useState(profile.avatarZoom ?? 100);
  const [avatarPosX, setAvatarPosX] = useState(profile.avatarPosX ?? 0);
  const [avatarPosY, setAvatarPosY] = useState(profile.avatarPosY ?? 0);
  const [fontColor, setFontColor] = useState(profile.fontColor || '');
  
  // Contact Details
  const [phone, setPhone] = useState(vcard?.workPhone || vcard?.mobilePhone || profile.socialLinks?.phone || '+91 98765 43210');
  const [organization, setOrganization] = useState(vcard?.organization || 'Tapping Technologies India');
  const [streetAddress, setStreetAddress] = useState(vcard?.streetAddress || 'Indiranagar 100ft Road');
  const [city, setCity] = useState(vcard?.city || 'Bengaluru, Karnataka');
  const [country, setCountry] = useState(vcard?.country || 'India');
  const [website, setWebsite] = useState(vcard?.website || '');

  const [socialLinks, setSocialLinks] = useState({
    instagram: profile.socialLinks?.instagram || '',
    twitter: profile.socialLinks?.twitter || '',
    linkedin: profile.socialLinks?.linkedin || '',
    github: profile.socialLinks?.github || '',
    email: profile.socialLinks?.email || vcard?.workEmail || 'contact@aaravsharma.in',
    phone: profile.socialLinks?.phone || vcard?.workPhone || '+91 98765 43210',
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
        avatarFit,
        avatarZoom,
        avatarPosX,
        avatarPosY,
        fontColor: fontColor || undefined,
        socialLinks: {
          ...socialLinks,
          phone,
        },
        ...partial,
      });
    }
  };

  const notifyVCardLive = (partial: Partial<VCardProfile>) => {
    if (onLiveVCardChange) {
      const parts = displayName.trim().split(' ');
      onLiveVCardChange({
        ...(vcard || { id: 'vc_default', userId: profile.id, note: 'Saved via Tapping Bio' }),
        id: vcard?.id || 'vc_default',
        userId: profile.id,
        firstName: parts[0] || '',
        lastName: parts.slice(1).join(' ') || '',
        organization,
        jobTitle: badgeTitle,
        workPhone: phone,
        mobilePhone: phone,
        workEmail: socialLinks.email,
        website: website || `http://${displayHost}/${username}`,
        streetAddress,
        city,
        country,
        note: vcard?.note || 'Saved via Tapping Bio Space',
        ...partial,
      });
    }
  };

  // Links Form State
  const [isAddingLink, setIsAddingLink] = useState(false);
  const [editingLinkId, setEditingLinkId] = useState<string | null>(null);
  const [modalBlockType, setModalBlockType] = useState<'link' | 'product_slider'>('link');
  const [sliderProductIds, setSliderProductIds] = useState<string[]>([]);
  const [sliderAllProducts, setSliderAllProducts] = useState(true);
  const [linkTitle, setLinkTitle] = useState('');
  const [linkSubtitle, setLinkSubtitle] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [linkIcon, setLinkIcon] = useState('globe');
  const [linkStyle, setLinkStyle] = useState<StyleVariant>('peach');
  const [selectedLinkTheme, setSelectedLinkTheme] = useState<LinkCardStyleType | undefined>(undefined);
  const [linkBgImage, setLinkBgImage] = useState('');
  const [linkBgImageFit, setLinkBgImageFit] = useState<'cover' | 'contain' | 'fill'>('cover');
  const [linkBgColor, setLinkBgColor] = useState('');
  const [linkTextColor, setLinkTextColor] = useState('#141518');
  const linkFileInputRef = React.useRef<HTMLInputElement>(null);
  const avatarFileInputRef = React.useRef<HTMLInputElement>(null);

  // Save Confirmation Popup & Dynamic Generated QR
  const [showSaveConfirmModal, setShowSaveConfirmModal] = useState(false);
  const [confirmQrUrl, setConfirmQrUrl] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Invalid File', 'Please select a PNG, JPG, or SVG image file', 'error');
      return;
    }

    try {
      const result = await compressAvatarImage(file);
      setAvatarUrl(result.dataUrl);
      setAvatarFit('contain');
      setAvatarZoom(100);
      setAvatarPosX(0);
      setAvatarPosY(0);
      notifyLive({ avatarUrl: result.dataUrl, avatarFit: 'contain', avatarZoom: 100, avatarPosX: 0, avatarPosY: 0 });
      showToast(
        'Profile photo compressed',
        `Compressed to ${formatFileSize(result.compressedBytes)} (${result.savingsPercent}% saved). Fits avatar & browser favicon with near-zero storage!`,
        'success'
      );
    } catch (error) {
      showToast('Photo upload failed', error instanceof Error ? error.message : 'Please try another image.', 'error');
    }
  };

  const handleLinkImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Invalid File', 'Please select a PNG, JPG, or SVG image', 'error');
      return;
    }

    try {
      const result = await compressLinkCardImage(file);
      setLinkBgImage(result.dataUrl);
      setLinkTextColor('#FFFFFF');
      showToast(
        'Link Background Compressed',
        `Optimized to ${formatFileSize(result.compressedBytes)} (${result.savingsPercent}% data saved)`,
        'success'
      );
    } catch (error) {
      showToast('Link artwork failed', error instanceof Error ? error.message : 'Please try another image.', 'error');
    }
  };

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
      avatarFit,
      avatarZoom,
      avatarPosX,
      avatarPosY,
      fontColor: fontColor || undefined,
      socialLinks: {
        ...socialLinks,
        phone,
      },
    };
    onUpdateProfile(updatedProfile);

    if (onUpdateVCard) {
      const parts = displayName.trim().split(' ');
      const fName = parts[0] || '';
      const lName = parts.slice(1).join(' ') || '';
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

    // Generate real-time dynamic QR for confirmation popup with user data
    QRCode.toDataURL(`http://${displayHost}/${cleanUsername}`, { width: 360, margin: 2 })
      .then((qr) => setConfirmQrUrl(qr))
      .catch(console.error);

    setShowSaveConfirmModal(true);
    showToast('Profile & Contact Saved', 'Live link and QR code generated with your data', 'success');
  };

  const openAddLinkModal = () => {
    setModalBlockType('link');
    setLinkTitle('');
    setLinkSubtitle('');
    setLinkUrl('https://');
    setLinkIcon('globe');
    setLinkStyle('peach');
    setSelectedLinkTheme(undefined);
    setLinkBgImage('');
    setLinkBgImageFit('cover');
    setLinkBgColor('');
    setLinkTextColor('#141518');
    setEditingLinkId(null);
    setIsAddingLink(true);
  };

  const openAddProductSliderModal = () => {
    setModalBlockType('product_slider');
    setLinkTitle('Featured Products');
    setLinkSubtitle('Slidable Product Showcase');
    setLinkUrl('');
    setLinkIcon('shopping-bag');
    setSliderAllProducts(true);
    setSliderProductIds([]);
    setEditingLinkId(null);
    setIsAddingLink(true);
  };

  const openEditLinkModal = (link: LinkBlock) => {
    if (link.type === 'product_slider') {
      setModalBlockType('product_slider');
      setLinkTitle(link.title || 'Featured Products');
      setLinkSubtitle(link.subtitle || '');
      setSliderProductIds(link.productIds || []);
      setSliderAllProducts(!link.productIds || link.productIds.length === 0);
      setEditingLinkId(link.id);
      setIsAddingLink(true);
      return;
    }

    setModalBlockType('link');
    setLinkTitle(link.title);
    setLinkSubtitle(link.subtitle || '');
    setLinkUrl(link.url);
    setLinkIcon(link.icon || 'globe');
    setLinkStyle(link.styleVariant || 'peach');
    setSelectedLinkTheme(link.linkTheme);
    setLinkBgImage(link.bgImage || '');
    setLinkBgImageFit(link.bgImageFit || 'cover');
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

    if (modalBlockType === 'product_slider') {
      const selectedIds = sliderAllProducts ? [] : sliderProductIds;
      if (editingLinkId) {
        const updated = links.map((l) =>
          l.id === editingLinkId
            ? {
                ...l,
                type: 'product_slider' as const,
                title: linkTitle.trim(),
                subtitle: linkSubtitle.trim() || undefined,
                productIds: selectedIds,
              }
            : l
        );
        onUpdateLinks(updated);
        showToast('Product Slider Updated', `"${linkTitle}" updated`, 'success');
      } else {
        const newBlock: LinkBlock = {
          id: `blk_slider_${Date.now()}`,
          userId: 'current_user',
          type: 'product_slider',
          title: linkTitle.trim(),
          subtitle: linkSubtitle.trim() || undefined,
          url: '',
          icon: 'shopping-bag',
          styleVariant: 'peach',
          isActive: true,
          sortOrder: links.length,
          clickCount: 0,
          productIds: selectedIds,
        };
        onUpdateLinks([...links, newBlock]);
        showToast('Product Slider Block Created', `"${linkTitle}" added to your bio page!`, 'success');
      }
      setIsAddingLink(false);
      setEditingLinkId(null);
      return;
    }

    if (editingLinkId) {
      const updated = links.map((l) =>
        l.id === editingLinkId
          ? { 
              ...l, 
              type: 'link' as const,
              title: linkTitle, 
              subtitle: linkSubtitle, 
              url: linkUrl, 
              icon: linkIcon, 
              styleVariant: linkStyle,
              linkTheme: selectedLinkTheme,
              bgImage: linkBgImage,
              bgImageFit: linkBgImageFit,
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
        linkTheme: selectedLinkTheme,
        bgImage: linkBgImage,
        bgImageFit: linkBgImageFit,
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
      {/* TOP SUB-NAVIGATION TABS */}
      <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-white border border-black/10 shadow-2xs w-full max-w-2xl mx-auto overflow-x-auto">
        <button
          type="button"
          onClick={() => handleTabSelect('profile')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
            currentTab === 'profile'
              ? 'bg-[#4F83FF] text-white shadow-xs'
              : 'text-charcoal/70 hover:text-black hover:bg-black/5'
          }`}
        >
          <User className="w-3.5 h-3.5" />
          <span>Profile & Bio</span>
        </button>

        <button
          type="button"
          onClick={() => handleTabSelect('links')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
            currentTab === 'links'
              ? 'bg-[#4F83FF] text-white shadow-xs'
              : 'text-charcoal/70 hover:text-black hover:bg-black/5'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Links ({links.length})</span>
        </button>

        <button
          type="button"
          onClick={() => handleTabSelect('products')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
            currentTab === 'products'
              ? 'bg-[#4F83FF] text-white shadow-xs'
              : 'text-charcoal/70 hover:text-black hover:bg-black/5'
          }`}
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>Products ({(localStore.products || []).length})</span>
        </button>

        <button
          type="button"
          onClick={() => handleTabSelect('themes')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
            currentTab === 'themes'
              ? 'bg-[#4F83FF] text-white shadow-xs'
              : 'text-charcoal/70 hover:text-black hover:bg-black/5'
          }`}
        >
          <Palette className="w-3.5 h-3.5" />
          <span>Themes</span>
        </button>
      </div>

      {/* SECTION 1: PROFILE DETAILS FORM */}
      {currentTab === 'profile' && (
      <form onSubmit={handleSaveProfile} className="bg-white rounded-4xl p-6 md:p-8 border border-black/5 shadow-soft">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between pb-6 border-b border-black/5 mb-6">
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
          <div className="grid grid-cols-2 gap-2 sm:flex">
            <button type="button" onClick={() => { handleTabSelect('links'); openAddLinkModal(); }} className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-full border border-black/10 bg-white text-charcoal text-xs font-black shadow-xs"><Plus className="w-3.5 h-3.5" /><span>Add Link</span></button>
            <button type="submit" className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[#4F83FF] hover:bg-[#3B6DE6] text-white text-xs font-black shadow-sm transition-transform active:scale-95 shrink-0"><Save className="w-3.5 h-3.5" /><span>Save Profile</span></button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Avatar Photo Upload Column (Self Photo Upload with Zoom & Framing Controls) */}
          <div className="flex flex-col items-center gap-2.5 shrink-0 w-full sm:w-44">
            <div className="w-24 h-24 rounded-3xl overflow-hidden bg-[#FAF7F2] border-2 border-black/10 shadow-soft relative flex items-center justify-center">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={displayName || 'Profile Photo'}
                  className={`w-full h-full transition-transform ${avatarFit === 'contain' ? 'object-contain' : 'object-cover'}`}
                  style={{
                    transform: `scale(${avatarZoom / 100}) translate(${avatarPosX}px, ${avatarPosY}px)`,
                    transformOrigin: 'center center',
                  }}
                />
              ) : (
                <User className="w-10 h-10 text-charcoal/30 stroke-[1.5]" />
              )}
            </div>

            <input
              type="file"
              ref={avatarFileInputRef}
              accept="image/*"
              className="hidden"
              onChange={handleAvatarUpload}
            />

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => avatarFileInputRef.current?.click()}
                className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-gray-50 border border-black/10 text-xs font-black text-charcoal flex items-center gap-1.5 shadow-2xs cursor-pointer transition-colors"
              >
                <Upload className="w-3.5 h-3.5 text-[#4F83FF]" />
                <span>Upload Photo</span>
              </button>

              {avatarUrl && (
                <button
                  type="button"
                  onClick={() => {
                    setAvatarUrl('');
                    notifyLive({ avatarUrl: '' });
                    showToast('Photo Cleared', 'Avatar removed from profile', 'info');
                  }}
                  className="text-[10px] font-bold text-rose-600 hover:text-rose-700 cursor-pointer"
                >
                  Remove
                </button>
              )}
            </div>

            {/* Avatar Framing & Zoom Controls (Fixes Awkward Cropping) */}
            {avatarUrl && (
              <div className="w-full p-2.5 rounded-2xl bg-[#FAF7F2] border border-black/10 flex flex-col gap-2 mt-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-charcoal/70 block text-center">
                  Adjust Framing & Crop
                </span>

                <div className="grid grid-cols-2 gap-1 rounded-xl bg-black/5 p-1">
                  <button type="button" onClick={() => { setAvatarFit('contain'); setAvatarZoom(100); setAvatarPosX(0); setAvatarPosY(0); notifyLive({ avatarFit: 'contain', avatarZoom: 100, avatarPosX: 0, avatarPosY: 0 }); }} className={`rounded-lg px-2 py-1.5 text-[10px] font-black ${avatarFit === 'contain' ? 'bg-white text-charcoal shadow-xs' : 'text-charcoal/50'}`}>Full photo</button>
                  <button type="button" onClick={() => { setAvatarFit('cover'); notifyLive({ avatarFit: 'cover' }); }} className={`rounded-lg px-2 py-1.5 text-[10px] font-black ${avatarFit === 'cover' ? 'bg-white text-charcoal shadow-xs' : 'text-charcoal/50'}`}>Fill frame</button>
                </div>

                {/* Zoom Slider */}
                <div>
                  <div className="flex items-center justify-between text-[10px] font-mono text-charcoal/70 mb-0.5">
                    <span>Zoom</span>
                    <span>{avatarZoom}%</span>
                  </div>
                  <input
                    type="range"
                    min={50}
                    max={250}
                    step={5}
                    value={avatarZoom}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setAvatarZoom(val);
                      notifyLive({ avatarZoom: val });
                    }}
                    className="w-full h-1.5 bg-black/10 rounded-lg appearance-none cursor-pointer accent-[#4F83FF]"
                  />
                </div>

                {/* Vertical Pan Slider (Up/Down) */}
                <div>
                  <div className="flex items-center justify-between text-[10px] font-mono text-charcoal/70 mb-0.5">
                    <span>Vertical (Up/Down)</span>
                    <span>{avatarPosY > 0 ? `+${avatarPosY}` : avatarPosY}px</span>
                  </div>
                  <input
                    type="range"
                    min={-60}
                    max={60}
                    step={1}
                    value={avatarPosY}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setAvatarPosY(val);
                      notifyLive({ avatarPosY: val });
                    }}
                    className="w-full h-1.5 bg-black/10 rounded-lg appearance-none cursor-pointer accent-[#4F83FF]"
                  />
                </div>

                {/* Horizontal Pan Slider (Left/Right) */}
                <div>
                  <div className="flex items-center justify-between text-[10px] font-mono text-charcoal/70 mb-0.5">
                    <span>Horizontal</span>
                    <span>{avatarPosX > 0 ? `+${avatarPosX}` : avatarPosX}px</span>
                  </div>
                  <input
                    type="range"
                    min={-60}
                    max={60}
                    step={1}
                    value={avatarPosX}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setAvatarPosX(val);
                      notifyLive({ avatarPosX: val });
                    }}
                    className="w-full h-1.5 bg-black/10 rounded-lg appearance-none cursor-pointer accent-[#4F83FF]"
                  />
                </div>

                {/* Reset Framing Button */}
                <button
                  type="button"
                  onClick={() => {
                    setAvatarZoom(100);
                    setAvatarPosX(0);
                    setAvatarPosY(0);
                    notifyLive({ avatarZoom: 100, avatarPosX: 0, avatarPosY: 0 });
                  }}
                  className="w-full py-1 text-[10px] font-bold text-charcoal/60 hover:text-black border border-black/10 rounded-lg bg-white cursor-pointer"
                >
                  Reset Framing
                </button>
              </div>
            )}
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
                placeholder="contact@aaravsharma.in"
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
                placeholder="+91 98765 43210"
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
                onChange={(e) => {
                  setOrganization(e.target.value);
                  notifyVCardLive({ organization: e.target.value });
                }}
                placeholder="Tapping Technologies India"
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
                onChange={(e) => {
                  setStreetAddress(e.target.value);
                  notifyVCardLive({ streetAddress: e.target.value });
                }}
                placeholder="Indiranagar 100ft Road"
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
                  onChange={(e) => {
                    setCity(e.target.value);
                    notifyVCardLive({ city: e.target.value });
                  }}
                  placeholder="Bengaluru, Karnataka"
                  className="w-full px-3 py-2.5 rounded-2xl bg-[#FAF7F2] border border-black/10 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-charcoal/20"
                />
                <input
                  type="text"
                  value={country}
                  onChange={(e) => {
                    setCountry(e.target.value);
                    notifyVCardLive({ country: e.target.value });
                  }}
                  placeholder="India"
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
                placeholder="https://aaravsharma.in"
                className="w-full px-3.5 py-2.5 rounded-2xl bg-[#FAF7F2] border border-black/10 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-charcoal/20"
              />
            </div>

            {/* DEDICATED SOCIAL PROFILES SECTION WITH HEADING */}
            <div className="sm:col-span-2 pt-4 border-t border-black/10 mt-2">
              <div className="mb-3">
                <h4 className="text-sm font-black text-charcoal tracking-tight flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#4F83FF]" />
                  <span>Social Media Accounts &amp; Connect Handles</span>
                </h4>
                <p className="text-[11px] text-charcoal/60 font-medium">
                  Attach your Instagram, Twitter/X, LinkedIn, and GitHub profiles with direct clickable icons
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Instagram */}
                <div className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-black/10 flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-charcoal/80 flex items-center gap-1.5">
                    <InstagramIcon className="w-3.5 h-3.5 text-pink-600" />
                    <span>Instagram Profile</span>
                  </label>
                  <div className="flex items-center bg-white rounded-xl border border-black/10 px-3 py-2">
                    <span className="text-xs font-bold text-charcoal/50 mr-1 select-none">@</span>
                    <input
                      type="text"
                      value={socialLinks.instagram}
                      onChange={(e) => {
                        const updatedSocial = { ...socialLinks, instagram: e.target.value };
                        setSocialLinks(updatedSocial);
                        notifyLive({ socialLinks: updatedSocial });
                      }}
                      placeholder="username"
                      className="w-full bg-transparent text-xs font-semibold focus:outline-none"
                    />
                  </div>
                </div>

                {/* Twitter / X */}
                <div className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-black/10 flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-charcoal/80 flex items-center gap-1.5">
                    <TwitterIcon className="w-3.5 h-3.5 text-black" />
                    <span>X / Twitter Profile</span>
                  </label>
                  <div className="flex items-center bg-white rounded-xl border border-black/10 px-3 py-2">
                    <span className="text-xs font-bold text-charcoal/50 mr-1 select-none">@</span>
                    <input
                      type="text"
                      value={socialLinks.twitter}
                      onChange={(e) => {
                        const updatedSocial = { ...socialLinks, twitter: e.target.value };
                        setSocialLinks(updatedSocial);
                        notifyLive({ socialLinks: updatedSocial });
                      }}
                      placeholder="username"
                      className="w-full bg-transparent text-xs font-semibold focus:outline-none"
                    />
                  </div>
                </div>

                {/* GitHub */}
                <div className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-black/10 flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-charcoal/80 flex items-center gap-1.5">
                    <GithubIcon className="w-3.5 h-3.5 text-gray-800" />
                    <span>GitHub Profile</span>
                  </label>
                  <input
                    type="text"
                    value={socialLinks.github}
                    onChange={(e) => {
                      const updatedSocial = { ...socialLinks, github: e.target.value };
                      setSocialLinks(updatedSocial);
                      notifyLive({ socialLinks: updatedSocial });
                    }}
                    placeholder="username or github.com/..."
                    className="w-full px-3 py-2 rounded-xl bg-white border border-black/10 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-charcoal/20"
                  />
                </div>

                {/* LinkedIn */}
                <div className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-black/10 flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-charcoal/80 flex items-center gap-1.5">
                    <LinkedinIcon className="w-3.5 h-3.5 text-blue-600" />
                    <span>LinkedIn Profile</span>
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
                    className="w-full px-3 py-2 rounded-xl bg-white border border-black/10 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-charcoal/20"
                  />
                </div>
              </div>
            </div>

            {/* Bio & Profile Font Color Selector */}
            <div className="sm:col-span-2 pt-4 border-t border-black/10 mt-2">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h4 className="text-sm font-black text-charcoal tracking-tight flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#4F83FF]" />
                    <span>Bio Page Entire Font &amp; Text Color</span>
                  </h4>
                  <p className="text-[11px] text-charcoal/60 font-medium">
                    Sets font &amp; text color across your entire public Bio page (Name, @handle, work badge, location, bio text, and blocks)
                  </p>
                </div>
                {fontColor && (
                  <button
                    type="button"
                    onClick={() => {
                      setFontColor('');
                      notifyLive({ fontColor: '' });
                    }}
                    className="text-[11px] font-bold text-rose-500 hover:underline cursor-pointer"
                  >
                    Reset Auto
                  </button>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-1">
                {[
                  { name: 'Classic Charcoal', hex: '#141518' },
                  { name: 'Pure White', hex: '#FFFFFF' },
                  { name: 'Luxe Gold', hex: '#D4AF37' },
                  { name: 'Cyber Cyan', hex: '#00F0FF' },
                  { name: 'Neon Lime', hex: '#B6F554' },
                  { name: 'Rose Coral', hex: '#FF6B6B' },
                  { name: 'Royal Indigo', hex: '#4F83FF' },
                ].map((c) => (
                  <button
                    key={c.hex}
                    type="button"
                    onClick={() => {
                      setFontColor(c.hex);
                      notifyLive({ fontColor: c.hex });
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      fontColor === c.hex ? 'border-charcoal bg-black/5 ring-2 ring-charcoal' : 'border-black/10 bg-[#FAF7F2] hover:bg-white'
                    }`}
                  >
                    <span className="w-3.5 h-3.5 rounded-full border border-black/15 shrink-0" style={{ backgroundColor: c.hex }} />
                    <span>{c.name}</span>
                  </button>
                ))}
                {/* Custom Color Input */}
                <div className="flex items-center gap-2 bg-[#FAF7F2] hover:bg-white border border-black/10 rounded-xl px-2.5 py-1 shadow-2xs">
                  <input
                    type="color"
                    value={fontColor || '#141518'}
                    onChange={(e) => {
                      setFontColor(e.target.value);
                      notifyLive({ fontColor: e.target.value });
                    }}
                    className="w-5 h-5 rounded cursor-pointer border-0 p-0"
                    title="Pick custom font color"
                  />
                  <span className="text-xs font-mono font-bold text-charcoal">{fontColor || 'Auto'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
      )}

      {/* SECTION 2: LINKS & CONTENT BLOCKS */}
      {currentTab === 'links' && (
        <>
          <div className="bg-white rounded-4xl p-6 md:p-8 border border-black/5 shadow-soft">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-black/5 mb-5 gap-3">
          <div>
            <h3 className="text-xl font-black text-charcoal tracking-tight">Active Link &amp; Product Blocks</h3>
            <p className="text-xs text-charcoal/60 mt-0.5 font-medium">
              Reorder links and product carousels to arrange your bio page exactly how you want
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={openAddProductSliderModal}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-[#141518] hover:bg-black text-white text-xs font-black shadow-sm transition-transform active:scale-95 cursor-pointer shrink-0"
              title="Add slidable product carousel block between links"
            >
              <ShoppingBag className="w-4 h-4 text-[#FDF166]" />
              <span>+ Product Slider</span>
            </button>
            <button
              onClick={openAddLinkModal}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#4F83FF] hover:bg-[#3B6DE6] text-white text-xs font-black shadow-sm transition-transform active:scale-95 cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>+ Add Link</span>
            </button>
          </div>
        </div>

        {/* Link & Product Blocks List */}
        <div className="flex flex-col gap-3">
          {links.map((link, idx) => {
            if (link.type === 'product_slider') {
              const activeStoreCount = (localStore.products || []).filter(p => p.isActive).length;
              const productCountLabel = link.productIds && link.productIds.length > 0 
                ? `${link.productIds.length} chosen products` 
                : `All ${activeStoreCount} active products`;
              return (
                <div
                  key={link.id}
                  className={`p-3.5 sm:p-4 rounded-3xl border transition-all flex items-center justify-between gap-3 relative overflow-hidden ${
                    link.isActive 
                      ? 'bg-gradient-to-r from-[#FAF7F2] to-[#FFF9F5] border-[#D9CFC2] shadow-2xs' 
                      : 'bg-gray-50/80 border-black/5 opacity-60'
                  }`}
                >
                  {/* Left: Reorder buttons + Icon + Info */}
                  <div className="flex items-center gap-3 min-w-0 relative z-10">
                    <div className="flex flex-col gap-0.5 shrink-0">
                      <button
                        onClick={() => handleMove(idx, 'up')}
                        disabled={idx === 0}
                        className="p-1 rounded-lg hover:bg-white/80 disabled:opacity-20 text-charcoal transition-colors cursor-pointer"
                        title="Move up"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleMove(idx, 'down')}
                        disabled={idx === links.length - 1}
                        className="p-1 rounded-lg hover:bg-white/80 disabled:opacity-20 text-charcoal transition-colors cursor-pointer"
                        title="Move down"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="w-10 h-10 rounded-2xl bg-[#A6462D] text-white flex items-center justify-center shrink-0 shadow-xs">
                      <ShoppingBag className="w-5 h-5" />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-xs sm:text-sm font-black text-charcoal truncate">
                          {link.title || 'Featured Products'}
                        </p>
                        <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-[#A6462D]/10 text-[#A6462D] border border-[#A6462D]/20 shrink-0">
                          Product Slider
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white text-charcoal/70 border border-black/10 shrink-0">
                          {productCountLabel}
                        </span>
                      </div>
                      <p className="text-[11px] text-charcoal/60 truncate mt-0.5 font-medium">
                        {link.subtitle || 'Slidable horizontal carousel positioned directly here on your bio page'}
                      </p>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center gap-1.5 shrink-0 relative z-10">
                    <button
                      onClick={() => handleToggleLinkActive(link.id)}
                      className={`p-2 rounded-xl transition-colors cursor-pointer ${
                        link.isActive ? 'hover:bg-white text-charcoal' : 'hover:bg-white text-charcoal/40'
                      }`}
                      title={link.isActive ? 'Hide block' : 'Show block'}
                    >
                      {link.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>

                    <button
                      onClick={() => openEditLinkModal(link)}
                      className="px-3 py-1.5 rounded-xl bg-white hover:bg-gray-50 text-charcoal text-xs font-bold border border-black/10 shadow-xs transition-colors cursor-pointer"
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
            }

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
                  backgroundSize: link.bgImage ? (link.bgImageFit === 'fill' ? '100% 100%' : (link.bgImageFit || 'cover')) : undefined,
                  backgroundRepeat: link.bgImage ? 'no-repeat' : undefined,
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
          {links.length === 0 && (
            <div className="flex flex-col items-center rounded-3xl border border-dashed border-black/15 bg-[#FAF7F2] px-5 py-10 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E3DFF8]"><Link2 className="h-5 w-5 text-charcoal" /></div>
              <h4 className="mt-4 text-sm font-black text-charcoal">Add your first link</h4>
              <p className="mt-1 max-w-sm text-xs font-semibold leading-relaxed text-charcoal/50">Add a website, WhatsApp, Instagram, portfolio, booking page or any custom URL.</p>
              <button onClick={openAddLinkModal} className="mt-4 flex items-center gap-2 rounded-2xl bg-[#4F83FF] px-5 py-3 text-xs font-black text-white"><Plus className="h-4 w-4" /> Add link</button>
            </div>
          )}
        </div>
      </div>

      {/* Add / Edit Block Modal */}
      {isAddingLink && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-4xl p-6 w-full max-w-md shadow-2xl border border-black/10 max-h-[90vh] overflow-y-auto no-scrollbar">
            <div className="flex items-center justify-between pb-3 border-b border-black/5 mb-4">
              <h3 className="text-base font-black text-charcoal">
                {modalBlockType === 'product_slider'
                  ? (editingLinkId ? 'Edit Product Slider Block' : 'Add Product Slider Block')
                  : (editingLinkId ? 'Edit Link Block' : 'Add Link Block')}
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

            {modalBlockType === 'product_slider' ? (
              /* PRODUCT SLIDER BLOCK CONFIGURATION FORM */
              <div className="space-y-4">
                <div className="p-3.5 rounded-2xl bg-[#FFF9F5] border border-[#A6462D]/20 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#A6462D] text-white flex items-center justify-center shrink-0 shadow-xs">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-charcoal">Horizontal Product Slider</h4>
                    <p className="text-[11px] text-charcoal/60 mt-0.5">
                      Renders your store products in a touch-friendly carousel at this exact position.
                    </p>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-charcoal/80 uppercase tracking-wider block mb-1">
                    Slider Heading / Title *
                  </label>
                  <input
                    type="text"
                    value={linkTitle}
                    onChange={(e) => setLinkTitle(e.target.value)}
                    placeholder="e.g. Featured Products, Best Sellers, Merch Drop..."
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
                    placeholder="e.g. Swipe through our newest products and collections"
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-[#FAF7F2] border border-black/10 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-charcoal/20"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-charcoal/80 uppercase tracking-wider block mb-1.5">
                    Products to Include in this Slider
                  </label>
                  <div className="grid grid-cols-2 gap-2 mb-2">
                    <button
                      type="button"
                      onClick={() => setSliderAllProducts(true)}
                      className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer text-center ${
                        sliderAllProducts 
                          ? 'bg-[#141518] text-white shadow-2xs' 
                          : 'bg-[#FAF7F2] text-charcoal/70 border border-black/10 hover:bg-white'
                      }`}
                    >
                      All Active ({(localStore.products || []).filter(p => p.isActive).length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setSliderAllProducts(false)}
                      className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer text-center ${
                        !sliderAllProducts 
                          ? 'bg-[#141518] text-white shadow-2xs' 
                          : 'bg-[#FAF7F2] text-charcoal/70 border border-black/10 hover:bg-white'
                      }`}
                    >
                      Choose Specific
                    </button>
                  </div>

                  {!sliderAllProducts && (
                    <div className="space-y-1.5 max-h-48 overflow-y-auto no-scrollbar p-2 rounded-2xl bg-[#FAF7F2] border border-black/10">
                      {(localStore.products || []).length === 0 ? (
                        <p className="text-center text-xs text-charcoal/50 py-3">No products created in store yet.</p>
                      ) : (
                        (localStore.products || []).map((prod) => {
                          const isChecked = sliderProductIds.includes(prod.id);
                          return (
                            <label key={prod.id} className="flex items-center gap-2.5 p-2 rounded-xl bg-white hover:bg-black/5 transition-colors cursor-pointer border border-black/5">
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => {
                                  if (isChecked) {
                                    setSliderProductIds(sliderProductIds.filter(id => id !== prod.id));
                                  } else {
                                    setSliderProductIds([...sliderProductIds, prod.id]);
                                  }
                                }}
                                className="w-4 h-4 rounded text-[#4F83FF] cursor-pointer"
                              />
                              <div className="w-9 h-9 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                                {prod.imageUrl ? (
                                  <img src={prod.imageUrl} alt="" className="w-full h-full object-cover" />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-[8px] text-charcoal/40">Item</div>
                                )}
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="text-xs font-black text-charcoal truncate">{prod.name}</p>
                                <p className="text-[10px] text-[#A6462D] font-black">₹{prod.price}</p>
                              </div>
                            </label>
                          );
                        })
                      )}
                    </div>
                  )}
                </div>

                <div className="p-3 rounded-2xl bg-[#EFF4FF] border border-[#4F83FF]/20 flex items-center justify-between">
                  <span className="text-xs font-bold text-charcoal">Manage store products &amp; images</span>
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddingLink(false);
                      handleTabSelect('products');
                    }}
                    className="text-xs font-black text-[#4F83FF] hover:underline cursor-pointer"
                  >
                    Open Products Tab &rarr;
                  </button>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-black/5">
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
                    className="flex-1 py-2.5 rounded-2xl bg-[#141518] hover:bg-black text-white text-xs font-black shadow-xs transition-transform active:scale-95 cursor-pointer"
                  >
                    {editingLinkId ? 'Save Slider Changes' : 'Add Product Slider'}
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Live Mini Preview of Link Card */}
                <div className="mb-4">
              <p className="text-[10px] font-black uppercase tracking-wider text-charcoal/50 mb-1.5">
                Live Card Preview
              </p>
              {(() => {
                const previewThemeClass = resolveLinkCardClasses(profile.theme, linkStyle, selectedLinkTheme);
                const hasCustomBg = !!linkBgImage || !!linkBgColor;
                return (
                  <div
                    className={`p-3.5 transition-all relative overflow-hidden flex items-center justify-between ${
                      hasCustomBg ? 'rounded-2xl border border-black/10 shadow-2xs' : previewThemeClass
                    }`}
                    style={{
                      backgroundImage: linkBgImage ? `url(${linkBgImage})` : undefined,
                      backgroundSize: linkBgImage ? (linkBgImageFit === 'fill' ? '100% 100%' : linkBgImageFit) : undefined,
                      backgroundRepeat: linkBgImage ? 'no-repeat' : undefined,
                      backgroundPosition: linkBgImage ? 'center' : undefined,
                      backgroundColor: linkBgColor || undefined,
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
                        {linkSubtitle && (
                          <p className="text-[10px] opacity-80 truncate mt-0.5 font-medium" style={{ color: linkTextColor }}>
                            {linkSubtitle}
                          </p>
                        )}
                      </div>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 shrink-0 opacity-80 relative z-10" style={{ color: linkTextColor }} />
                  </div>
                );
              })()}
            </div>

            <div className="space-y-3.5">
              {/* Quick Social Link Templates: 1-Click Fill */}
              <div className="p-3 rounded-2xl bg-[#FAF7F2] border border-black/10 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-wider text-charcoal/70">
                    Quick Platform Attach Templates
                  </span>
                  <span className="text-[9px] text-charcoal/50">Click to autofill</span>
                </div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {[
                    { name: 'Instagram', title: 'Follow on Instagram', subtitle: 'Photos, stories & creative updates', url: `https://instagram.com/${socialLinks.instagram || 'username'}`, icon: 'globe', style: 'peach' },
                    { name: 'X / Twitter', title: 'Follow on X', subtitle: 'Thoughts, insights & discussions', url: `https://x.com/${socialLinks.twitter || 'username'}`, icon: 'globe', style: 'default' },
                    { name: 'LinkedIn', title: 'Connect on LinkedIn', subtitle: 'Professional network & experience', url: socialLinks.linkedin || 'https://linkedin.com/in/username', icon: 'briefcase', style: 'sky' },
                    { name: 'GitHub', title: 'Open Source GitHub', subtitle: 'Code repositories & open projects', url: `https://github.com/${socialLinks.github || 'username'}`, icon: 'globe', style: 'default' },
                    { name: 'WhatsApp', title: 'Chat on WhatsApp', subtitle: 'Direct message for quick inquiries', url: `https://wa.me/${phone.replace(/[^0-9]/g, '')}`, icon: 'globe', style: 'mint' },
                    { name: 'Portfolio', title: 'Design Portfolio', subtitle: 'Curated projects & client work', url: website || 'https://aaravsharma.in', icon: 'globe', style: 'yellow' },
                  ].map((preset) => (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() => {
                        setLinkTitle(preset.title);
                        setLinkSubtitle(preset.subtitle);
                        setLinkUrl(preset.url);
                        setLinkIcon(preset.icon);
                        setLinkStyle(preset.style as any);
                      }}
                      className="px-2.5 py-1 rounded-xl bg-white hover:bg-[#EFF4FF] hover:border-[#4F83FF]/40 border border-black/10 text-[10px] font-black text-charcoal flex items-center gap-1 transition-all cursor-pointer shadow-2xs"
                    >
                      <span>{preset.name}</span>
                    </button>
                  ))}
                </div>
              </div>

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

              {/* Individual Link Theme & Card Design Selector */}
              <div className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-black/10 flex flex-col gap-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-black text-charcoal uppercase tracking-wider block">
                    Link Card Design Theme
                  </label>
                  <span className="text-[10px] font-mono text-charcoal/60">
                    {selectedLinkTheme || 'Theme Default'}
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 max-h-48 overflow-y-auto no-scrollbar pr-1">
                  {[
                    { id: undefined, name: 'Theme Default', tag: 'Global' },
                    { id: 'comic-brutalist', name: 'Comic Brutalist', tag: 'Marvel' },
                    { id: 'comic-halftone', name: 'Comic Halftone', tag: 'Pop Dots' },
                    { id: 'retro-pixel', name: 'Retro 8-Bit Pixel', tag: 'Arcade' },
                    { id: 'cyber-terminal', name: 'Cyber Terminal', tag: 'Neon Green' },
                    { id: 'vaporwave-gradient', name: 'Vaporwave Sunset', tag: 'Gradient' },
                    { id: 'japanese-wave', name: 'Japanese Wave', tag: 'Indigo' },
                    { id: 'neobrutal-pastel', name: 'Neo-Brutalist', tag: '3px Border' },
                    { id: 'glass-glow', name: 'Frosted Glass', tag: 'Luminous' },
                    { id: 'vintage-ticket', name: 'Vintage Ticket', tag: 'Perforated' },
                    { id: 'y2k-metallic', name: 'Y2K Millennium', tag: 'Chrome' },
                    { id: 'sticker-doodle', name: 'Sticker Doodle', tag: 'Anime' },
                    { id: 'minimal-outline', name: 'Minimal Outline', tag: 'Swiss' },
                    { id: 'solid', name: 'Pastel Bento Solid', tag: 'Classic' },
                    { id: 'bauhaus-colorblock', name: 'Bauhaus Block', tag: 'Geometric' },
                    { id: 'swiss-minimal-mono', name: 'Swiss Minimal', tag: 'Hairline' },
                    { id: 'editorial-magazine', name: 'Haute Editorial', tag: 'Magazine' },
                    { id: 'matte-carbon', name: 'Technical Carbon', tag: 'Stealth' },
                    { id: 'vintage-parchment', name: 'Vintage Parchment', tag: 'Antique' },
                    { id: 'tokyo-neon-noir', name: 'Tokyo Neon Noir', tag: 'Cyber Glow' },
                    { id: 'retro-cassette', name: 'Retro Cassette', tag: 'Mixtape' },
                    { id: 'prismatic-glass', name: 'Prismatic Glass', tag: 'Hologram' },
                    { id: 'claymorphism-soft', name: 'Soft Claymorphic', tag: '3D Tactile' },
                    { id: 'minimal-pill', name: 'Floating Capsule', tag: 'Capsule Pill' },
                  ].map((preset) => (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() => {
                        setSelectedLinkTheme(preset.id as any);
                        if (preset.id === 'cyber-terminal') setLinkTextColor('#00FF66');
                        else if (preset.id === 'japanese-wave' || preset.id === 'vaporwave-gradient' || preset.id === 'matte-carbon' || preset.id === 'tokyo-neon-noir') setLinkTextColor('#FFFFFF');
                        else if (preset.id === 'retro-cassette') setLinkTextColor('#F97316');
                        else setLinkTextColor('#141518');
                      }}
                      className={`p-2 rounded-xl border text-left transition-all cursor-pointer ${
                        selectedLinkTheme === preset.id
                          ? 'bg-[#4F83FF] text-white border-[#4F83FF] shadow-2xs'
                          : 'bg-white text-charcoal border-black/10 hover:bg-gray-50'
                      }`}
                    >
                      <p className="font-black text-[11px] truncate">{preset.name}</p>
                      <p className="text-[9px] opacity-70 truncate">{preset.tag}</p>
                    </button>
                  ))}
                </div>
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

                {/* Artwork Fit & Cropping Mode */}
                {linkBgImage && (
                  <div className="pt-2 border-t border-black/5">
                    <label className="text-[10px] font-black text-charcoal uppercase tracking-wider block mb-1">
                      Artwork Fit & Cropping Mode
                    </label>
                    <div className="grid grid-cols-3 gap-1.5">
                      {[
                        { id: 'cover' as const, label: 'Cover', desc: 'Fill block' },
                        { id: 'contain' as const, label: 'Contain', desc: 'No crop / Logo' },
                        { id: 'fill' as const, label: 'Stretch', desc: 'Fill 100%' },
                      ].map((mode) => (
                        <button
                          key={mode.id}
                          type="button"
                          onClick={() => setLinkBgImageFit(mode.id)}
                          className={`p-1.5 rounded-xl border text-center transition-all cursor-pointer ${
                            linkBgImageFit === mode.id
                              ? 'bg-[#141518] text-white border-black shadow-2xs'
                              : 'bg-white text-charcoal border-black/10 hover:bg-gray-50'
                          }`}
                        >
                          <p className="text-[11px] font-black leading-tight">{mode.label}</p>
                          <p className="text-[9px] opacity-70 leading-tight">{mode.desc}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
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
              </>
            )}
          </div>
        </div>
      )}
        </>
      )}

      {/* SECTION: PRODUCTS & STORE (SLIDABLE BIO STORE) */}
      {currentTab === 'products' && (
        <div className="bg-white rounded-4xl p-6 md:p-8 border border-black/5 shadow-soft flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between pb-6 border-b border-black/5 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#FAF7F2] text-[#A6462D] border border-[#D9CFC2] flex items-center gap-1.5">
                  <ShoppingBag className="w-3 h-3" />
                  <span>Slidable Bio Store</span>
                </span>
                <span className="text-xs font-mono font-bold text-charcoal/50">
                  {(localStore.products || []).filter(p => p.isActive).length} active items
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-charcoal tracking-tight">
                Products &amp; Commerce
              </h1>
              <p className="text-xs text-charcoal/60 mt-1 font-medium">
                Add products or paste direct product links (Amazon, Shopify, Etsy, Gumroad) with picture. Shown in a horizontal slidable carousel on your bio page!
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowAddProductModal(true)}
              className="px-4 py-2.5 rounded-full bg-[#141518] hover:bg-black text-white text-xs font-black flex items-center justify-center gap-2 shadow-sm transition-transform active:scale-95 cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4 text-[#FDF166]" />
              <span>Add Product / Paste Link</span>
            </button>
          </div>

          {/* Quick WhatsApp Configuration for Orders */}
          <div className="p-4 rounded-3xl bg-[#FAF7F2] border border-black/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <p className="text-xs font-black text-charcoal flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-emerald-600" />
                <span>WhatsApp Order Destination</span>
              </p>
              <p className="text-[11px] text-charcoal/60 mt-0.5">
                When visitors tap &ldquo;Add to Bag&rdquo;, their order summary is sent to this WhatsApp number
              </p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="e.g. 919876543210"
                defaultValue={localStore.whatsappNumber}
                onBlur={(e) => {
                  const clean = e.target.value.replace(/\D/g, '');
                  if (clean !== localStore.whatsappNumber) {
                    persistStore({ ...localStore, whatsappNumber: clean });
                    showToast('WhatsApp Number Saved', `Orders will route to +${clean}`, 'success');
                  }
                }}
                className="px-3 py-1.5 rounded-xl border border-black/10 bg-white text-xs font-mono font-bold w-44 outline-none focus:border-[#4F83FF]"
              />
            </div>
          </div>

          {/* ADD / PASTE PRODUCT MODAL */}
          {showAddProductModal && (
            <div className="p-5 sm:p-6 rounded-3xl bg-[#EFF4FF] border border-[#4F83FF]/30 flex flex-col gap-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#4F83FF]/20">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-[#4F83FF] text-white flex items-center justify-center shadow-2xs">
                    <Plus className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-charcoal">Add New Product or Paste Link</h3>
                    <p className="text-[11px] text-charcoal/60">Product picture is compressed automatically for rapid mobile loading</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddProductModal(false)}
                  className="w-7 h-7 rounded-full bg-white/80 hover:bg-white text-charcoal flex items-center justify-center cursor-pointer border border-black/10"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <form onSubmit={handleSaveProduct} className="flex flex-col gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {/* Title */}
                  <div className="flex flex-col gap-1 sm:col-span-2">
                    <label className="text-[11px] font-bold text-charcoal/80">Product Title *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Minimalist Metal Card, Studio Notebook, E-Book..."
                      value={newProdName}
                      onChange={(e) => setNewProdName(e.target.value)}
                      className="px-3.5 py-2.5 rounded-2xl bg-white border border-black/10 text-xs font-bold text-charcoal outline-none focus:border-[#4F83FF]"
                    />
                  </div>

                  {/* Price (₹ INR) */}
                  <div className="flex flex-col gap-1">
                    <label className="text-[11px] font-bold text-charcoal/80">Selling Price (₹ INR) *</label>
                    <input
                      type="number"
                      required
                      min="1"
                      placeholder="e.g. 499"
                      value={newProdPrice}
                      onChange={(e) => setNewProdPrice(Number(e.target.value))}
                      className="px-3.5 py-2.5 rounded-2xl bg-white border border-black/10 text-xs font-mono font-bold text-charcoal outline-none focus:border-[#4F83FF]"
                    />
                  </div>

                  {/* Compare Price */}
                  <div className="flex flex-col gap-1">
                    <label className="text-[11px] font-bold text-charcoal/80">Original / MRP (₹ Strike-through, Optional)</label>
                    <input
                      type="number"
                      min="1"
                      placeholder="e.g. 999"
                      value={newProdComparePrice ?? ''}
                      onChange={(e) => setNewProdComparePrice(e.target.value ? Number(e.target.value) : undefined)}
                      className="px-3.5 py-2.5 rounded-2xl bg-white border border-black/10 text-xs font-mono font-bold text-charcoal outline-none focus:border-[#4F83FF]"
                    />
                  </div>

                  {/* External Product Link URL */}
                  <div className="flex flex-col gap-1 sm:col-span-2">
                    <label className="text-[11px] font-bold text-charcoal/80 flex items-center justify-between">
                      <span>Direct Product Link / URL (Optional)</span>
                      <span className="text-[10px] text-charcoal/50 font-normal">Amazon, Shopify, Etsy, Gumroad, or your site</span>
                    </label>
                    <div className="relative">
                      <ExternalLink className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal/40" />
                      <input
                        type="url"
                        placeholder="https://amazon.in/dp/... or https://yourshop.com/product"
                        value={newProdLinkUrl}
                        onChange={(e) => setNewProdLinkUrl(e.target.value)}
                        className="pl-9 pr-3.5 py-2.5 rounded-2xl bg-white border border-black/10 text-xs font-mono font-bold text-charcoal w-full outline-none focus:border-[#4F83FF]"
                      />
                    </div>
                  </div>

                  {/* Product Picture Upload (Universal Auto-Compression) */}
                  <div className="flex flex-col gap-1.5 sm:col-span-2">
                    <label className="text-[11px] font-bold text-charcoal/80">
                      Product Picture (Auto-Compressed for Ultra-Fast Loading)
                    </label>

                    <input
                      type="file"
                      ref={prodImageInputRef}
                      accept="image/*"
                      className="hidden"
                      onChange={handleProductImageUpload}
                    />

                    <div className="flex items-center gap-3 p-3 rounded-2xl bg-white border border-black/10">
                      <div className="w-16 h-16 rounded-xl bg-black/5 overflow-hidden shrink-0 border border-black/5 flex items-center justify-center">
                        {newProdImageUrl ? (
                          <img src={newProdImageUrl} alt="Product Preview" className="w-full h-full object-cover" />
                        ) : (
                          <ImageIcon className="w-6 h-6 text-charcoal/30" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <button
                          type="button"
                          disabled={compressingProdImage}
                          onClick={() => prodImageInputRef.current?.click()}
                          className="py-2 px-3.5 rounded-xl bg-[#141518] hover:bg-black text-white text-xs font-bold flex items-center gap-1.5 shadow-2xs cursor-pointer transition-all disabled:opacity-50"
                        >
                          <Upload className="w-3.5 h-3.5 text-[#FDF166]" />
                          <span>{compressingProdImage ? 'Compressing...' : newProdImageUrl ? 'Change Picture' : 'Upload Picture'}</span>
                        </button>
                        <p className="text-[10px] text-charcoal/50 mt-1">
                          PNG or JPG. Automatically converted to high-efficiency WebP.
                        </p>
                      </div>

                      {newProdImageUrl && (
                        <button
                          type="button"
                          onClick={() => setNewProdImageUrl('')}
                          className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50"
                          title="Remove image"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Short Description */}
                  <div className="flex flex-col gap-1 sm:col-span-2">
                    <label className="text-[11px] font-bold text-charcoal/80">Short Description</label>
                    <textarea
                      rows={2}
                      placeholder="e.g. Handcrafted matte finish with NFC chip inside. Lifetime guarantee."
                      value={newProdDescription}
                      onChange={(e) => setNewProdDescription(e.target.value)}
                      className="px-3.5 py-2.5 rounded-2xl bg-white border border-black/10 text-xs font-medium text-charcoal outline-none focus:border-[#4F83FF] resize-none"
                    />
                  </div>

                  {/* Variants */}
                  <div className="flex flex-col gap-1 sm:col-span-2">
                    <label className="text-[11px] font-bold text-charcoal/80">Variants (Comma-Separated, Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. Matte Black, Mirror Gold, Gunmetal Steel"
                      value={newProdVariants}
                      onChange={(e) => setNewProdVariants(e.target.value)}
                      className="px-3.5 py-2.5 rounded-2xl bg-white border border-black/10 text-xs font-medium text-charcoal outline-none focus:border-[#4F83FF]"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#4F83FF]/20">
                  <button
                    type="button"
                    onClick={() => setShowAddProductModal(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-charcoal hover:bg-black/5 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-[#4F83FF] hover:bg-[#3B6DE6] text-white text-xs font-black flex items-center gap-1.5 shadow-sm cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5 text-[#FDF166]" />
                    <span>Publish Product</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* LIST OF EXISTING PRODUCTS */}
          <div className="flex flex-col gap-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-charcoal/60">
              Published Products ({(localStore.products || []).length})
            </h3>

            {(localStore.products || []).length === 0 ? (
              <div className="p-8 rounded-3xl bg-[#FAF7F2] border border-black/10 text-center flex flex-col items-center justify-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-white border border-black/10 flex items-center justify-center text-[#A6462D] shadow-2xs">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-charcoal">No Products in Your Store Yet</h4>
                  <p className="text-xs text-charcoal/60 mt-1 max-w-sm">
                    Add physical merchandise, art, services, or paste any external product link to display in a slidable carousel on your bio page.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddProductModal(true)}
                  className="mt-1 px-4 py-2 rounded-full bg-[#141518] hover:bg-black text-white text-xs font-black flex items-center gap-1.5 shadow-2xs cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 text-[#FDF166]" />
                  <span>Add First Product</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {(localStore.products || []).map((product) => (
                  <div
                    key={product.id}
                    className={`p-3.5 rounded-3xl border transition-all flex items-center justify-between gap-3 ${
                      product.isActive ? 'bg-[#FAF7F2] border-black/10' : 'bg-gray-100 border-gray-200 opacity-60'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-14 h-14 rounded-2xl overflow-hidden bg-white border border-black/10 shrink-0">
                        {product.imageUrl ? (
                          <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-[#E3DFF8] flex items-center justify-center text-[10px] font-bold text-charcoal/40">Item</div>
                        )}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className="text-xs font-black text-charcoal truncate">{product.name}</p>
                          {product.linkUrl && (
                            <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-blue-100 text-blue-700 font-bold shrink-0">
                              Link
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-xs font-black text-[#A6462D]">₹{product.price}</span>
                          {product.compareAtPrice && product.compareAtPrice > product.price && (
                            <span className="text-[10px] text-charcoal/40 line-through">₹{product.compareAtPrice}</span>
                          )}
                        </div>
                        {product.description && (
                          <p className="text-[10px] text-charcoal/50 truncate mt-0.5">{product.description}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleToggleProductActive(product.id)}
                        className={`px-2.5 py-1 rounded-xl text-[10px] font-bold border transition-colors cursor-pointer ${
                          product.isActive
                            ? 'bg-emerald-500 text-white border-emerald-600'
                            : 'bg-white text-charcoal border-black/10'
                        }`}
                      >
                        {product.isActive ? 'Active' : 'Hidden'}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteProduct(product.id)}
                        className="p-1.5 rounded-xl hover:bg-rose-50 text-rose-500 transition-colors cursor-pointer"
                        title="Delete product"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* SECTION 3: THEMES & DESIGN SYSTEM (Theme Menu Inside Editing Menu) */}
      {currentTab === 'themes' && (
        <ThemesStudio
          profile={profile}
          onUpdateProfile={(updated) => {
            onUpdateProfile(updated);
            onLiveChange?.(updated);
          }}
          onLivePreviewChange={(updated) => {
            onLiveChange?.(updated);
          }}
        />
      )}

      {/* THEME-BASED SAVE CONFIRMATION POPUP WITH GENERATED LINK & REAL DATA QR */}
      {showSaveConfirmModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-4xl p-6 sm:p-8 w-full max-w-md shadow-2xl border border-black/10 flex flex-col items-center text-center animate-in fade-in zoom-in-95 duration-200">
            <div className="w-14 h-14 rounded-3xl bg-emerald-100 border border-emerald-300 text-emerald-700 flex items-center justify-center mb-4 shadow-sm">
              <Check className="w-7 h-7 stroke-[2.8]" />
            </div>

            <h3 className="text-2xl font-black text-charcoal tracking-tight">
              Profile Saved Successfully
            </h3>
            <p className="text-xs text-charcoal/65 mt-1 font-medium max-w-xs">
              Your public link-in-bio and dynamic contact QR code have been generated with your live data.
            </p>

            {/* Generated Profile Link Box */}
            <div className="w-full mt-5 p-3.5 rounded-2xl bg-[#FAF7F2] border border-black/10 flex items-center justify-between gap-2">
              <div className="text-left min-w-0 flex-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-charcoal/50 block">
                  Public Profile URL
                </span>
                <p className="text-xs font-mono font-bold text-charcoal truncate">
                  {displayHost}/{username}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(`http://${displayHost}/${username}`);
                  setCopiedLink(true);
                  setTimeout(() => setCopiedLink(false), 2000);
                  showToast('Link Copied', 'Profile URL copied to clipboard', 'success');
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                  copiedLink
                    ? 'bg-emerald-600 text-white'
                    : 'bg-white hover:bg-gray-100 text-charcoal border border-black/10 shadow-2xs'
                }`}
              >
                {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedLink ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            {/* Dynamic Generated QR Code Card */}
            {confirmQrUrl && (
              <div className="mt-4 p-4 rounded-3xl bg-white border border-black/10 shadow-soft flex flex-col items-center">
                <img
                  src={confirmQrUrl}
                  alt="Profile QR Code"
                  className="w-40 h-40 rounded-2xl border border-black/5"
                />
                <span className="text-[10px] font-mono text-charcoal/50 mt-2">
                  Dynamic QR for @{username}
                </span>

                <a
                  href={confirmQrUrl}
                  download={`${username}_qr.png`}
                  className="mt-2 text-[11px] font-black text-[#4F83FF] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Download className="w-3 h-3" />
                  <span>Download QR Image</span>
                </a>
              </div>
            )}

            {/* Modal Actions */}
            <div className="grid grid-cols-2 gap-2.5 w-full mt-6">
              <a
                href={`/${username}`}
                target="_blank"
                rel="noreferrer"
                className="py-3 px-4 rounded-2xl bg-[#FAF7F2] hover:bg-[#F2ECE1] border border-black/10 text-xs font-black text-charcoal flex items-center justify-center gap-1.5 transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Open Live Bio</span>
              </a>
              <button
                type="button"
                onClick={() => setShowSaveConfirmModal(false)}
                className="py-3 px-4 rounded-2xl bg-[#141518] hover:bg-black text-white text-xs font-black shadow-sm transition-transform active:scale-95 cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
