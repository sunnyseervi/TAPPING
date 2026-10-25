'use client';

import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  Download, 
  ExternalLink, 
  Edit3, 
  Ban, 
  CheckCircle, 
  Trash2, 
  Eye, 
  EyeOff,
  Calendar, 
  Clock, 
  Layers, 
  ShoppingBag, 
  X, 
  Check, 
  Printer, 
  Filter,
  UserCheck,
  Phone,
  Lock,
  Globe,
  Link as LinkIcon
} from 'lucide-react';
import { UserRecord, Profile, LinkBlock } from '@/lib/types';
import { useToast } from '@/components/ui/Toast';
import { jsPDF } from 'jspdf';
import { 
  checkUsernameAvailability, 
  updateUserLink, 
  deleteUserLink, 
  addUserLink,
  getStoredUsers 
} from '@/lib/storage';
import ConfirmModal from '@/components/ui/ConfirmModal';

interface AdminUsersTabProps {
  users: UserRecord[];
  onAddUser: (user: Partial<UserRecord>) => void;
  onUpdateUser: (userId: string, updates: Partial<UserRecord>) => void;
  onToggleBlock: (userId: string) => void;
  onDeleteUser: (userId: string) => void;
  onExportCsv: () => void;
}

export default function AdminUsersTab({
  users,
  onAddUser,
  onUpdateUser,
  onToggleBlock,
  onDeleteUser,
  onExportCsv,
}: AdminUsersTabProps) {
  const { showToast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'blocked' | 'pro' | 'free'>('all');

  // Modals State
  const [selectedUserForDetails, setSelectedUserForDetails] = useState<UserRecord | null>(null);
  const [editingUser, setEditingUser] = useState<UserRecord | null>(null);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);

  // Link Editor inside User Details Modal
  const [editingLink, setEditingLink] = useState<{ userId: string; link: LinkBlock } | null>(null);
  const [isAddingLinkForUser, setIsAddingLinkForUser] = useState<string | null>(null);
  const [newLinkTitle, setNewLinkTitle] = useState('');
  const [newLinkUrl, setNewLinkUrl] = useState('');

  // Confirmation Modal State
  const [confirmModalConfig, setConfirmModalConfig] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    variant: 'danger' | 'warning' | 'primary';
    action: () => void;
  }>({
    isOpen: false,
    title: '',
    description: '',
    variant: 'primary',
    action: () => {},
  });

  // New User Form State
  const [newUsername, setNewUsername] = useState('');
  const [newDisplayName, setNewDisplayName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('+91 98000 00000');
  const [newPlan, setNewPlan] = useState<'free' | 'pro_monthly' | 'pro_yearly'>('pro_monthly');

  // Filter users
  const filteredUsers = users.filter((u) => {
    const matchSearch =
      u.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.mobileNumber && u.mobileNumber.includes(searchQuery));

    if (!matchSearch) return false;

    if (statusFilter === 'active') return u.status === 'active';
    if (statusFilter === 'blocked') return u.status === 'blocked';
    if (statusFilter === 'pro') return u.plan !== 'free';
    if (statusFilter === 'free') return u.plan === 'free';
    return true;
  });

  // Create User with confirmation
  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUsername.trim() || !newEmail.trim()) {
      showToast('Validation Error', 'Username and email are required', 'error');
      return;
    }
    const availability = checkUsernameAvailability(newUsername);
    if (!availability.available) {
      showToast('Username Error', availability.reason || 'This handle is unavailable', 'error');
      return;
    }

    onAddUser({
      username: availability.normalized,
      displayName: newDisplayName.trim() || availability.normalized,
      email: newEmail.trim(),
      mobileNumber: newPhone.trim() || '+91 98000 00000',
      plan: newPlan,
      status: 'active',
      isActivated: true,
    });
    showToast('User Created', `Creator @${availability.normalized} successfully registered`, 'success');
    setIsAddUserModalOpen(false);
    setNewUsername('');
    setNewDisplayName('');
    setNewEmail('');
    setNewPhone('+91 98000 00000');
  };

  // Save Edit User
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    onUpdateUser(editingUser.id, {
      displayName: editingUser.displayName,
      email: editingUser.email,
      mobileNumber: editingUser.mobileNumber,
      plan: editingUser.plan,
      planExpiresAt: editingUser.planExpiresAt,
      status: editingUser.status,
    });
    showToast('User Updated', `Updated settings for @${editingUser.username}`, 'success');
    setEditingUser(null);
  };

  // Link Management Handlers
  const handleToggleLinkActive = (userId: string, linkId: string, currentActive: boolean) => {
    updateUserLink(userId, linkId, { isActive: !currentActive });
    // Update local state in drawer
    if (selectedUserForDetails && selectedUserForDetails.id === userId) {
      const updatedLinks = (selectedUserForDetails.links || []).map((l) =>
        l.id === linkId ? { ...l, isActive: !currentActive } : l
      );
      setSelectedUserForDetails({ ...selectedUserForDetails, links: updatedLinks });
    }
    showToast('Link Updated', `Link status set to ${!currentActive ? 'Active' : 'Hidden'}`, 'success');
  };

  const handleDeleteUserLink = (userId: string, linkId: string, linkTitle: string) => {
    setConfirmModalConfig({
      isOpen: true,
      title: 'Delete Customer Link?',
      description: `Are you sure you want to delete "${linkTitle}" from this creator's profile? This will immediately remove it from their live bio page.`,
      variant: 'danger',
      action: () => {
        deleteUserLink(userId, linkId);
        if (selectedUserForDetails && selectedUserForDetails.id === userId) {
          const updatedLinks = (selectedUserForDetails.links || []).filter((l) => l.id !== linkId);
          setSelectedUserForDetails({ ...selectedUserForDetails, links: updatedLinks });
        }
        showToast('Link Deleted', `Removed "${linkTitle}" from user profile`, 'info');
        setConfirmModalConfig((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  const handleSaveEditedLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLink) return;
    updateUserLink(editingLink.userId, editingLink.link.id, {
      title: editingLink.link.title,
      url: editingLink.link.url,
      bgColor: editingLink.link.bgColor,
      textColor: editingLink.link.textColor,
    });
    if (selectedUserForDetails && selectedUserForDetails.id === editingLink.userId) {
      const updatedLinks = (selectedUserForDetails.links || []).map((l) =>
        l.id === editingLink.link.id ? editingLink.link : l
      );
      setSelectedUserForDetails({ ...selectedUserForDetails, links: updatedLinks });
    }
    showToast('Link Updated', `Link "${editingLink.link.title}" successfully saved`, 'success');
    setEditingLink(null);
  };

  const handleAddNewLinkForUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAddingLinkForUser || !newLinkTitle.trim()) return;
    const newL = addUserLink(isAddingLinkForUser, {
      title: newLinkTitle.trim(),
      url: newLinkUrl.trim() || 'https://tapping.bio',
    });
    if (selectedUserForDetails && newL) {
      setSelectedUserForDetails({
        ...selectedUserForDetails,
        links: [...(selectedUserForDetails.links || []), newL],
      });
    }
    showToast('Link Added', `"${newLinkTitle}" added to creator profile`, 'success');
    setIsAddingLinkForUser(null);
    setNewLinkTitle('');
    setNewLinkUrl('');
  };

  // Safe Deletion with Theme-Based ConfirmModal
  const confirmDeleteUser = (user: UserRecord) => {
    setConfirmModalConfig({
      isOpen: true,
      title: `Delete Creator @${user.username}?`,
      description: `This will permanently delete ${user.displayName}'s profile, all their links, click telemetry, and public URL. This action cannot be reversed.`,
      variant: 'danger',
      action: () => {
        onDeleteUser(user.id);
        showToast('User Deleted', `@${user.username} has been removed from platform`, 'info');
        setConfirmModalConfig((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  // Safe Block / Unblock with Theme-Based ConfirmModal
  const confirmToggleBlock = (user: UserRecord) => {
    const isCurrentlyBlocked = user.status === 'blocked';
    setConfirmModalConfig({
      isOpen: true,
      title: isCurrentlyBlocked ? `Unblock @${user.username}?` : `Suspend / Block @${user.username}?`,
      description: isCurrentlyBlocked
        ? `This will restore public access to @${user.username}'s bio page and reactivate their profile.`
        : `This will immediately block public access to @${user.username}'s bio page and show an administrative suspension notice.`,
      variant: isCurrentlyBlocked ? 'primary' : 'warning',
      action: () => {
        onToggleBlock(user.id);
        showToast(
          isCurrentlyBlocked ? 'User Unblocked' : 'User Suspended',
          `Status for @${user.username} updated to ${isCurrentlyBlocked ? 'Active' : 'Blocked'}`,
          'success'
        );
        setConfirmModalConfig((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  const handleExportPdfReport = () => {
    const doc = new jsPDF();
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text('Tapping Platform - Master User Registry', 14, 20);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Generated on: ${new Date().toLocaleString()} | Total Users: ${users.length}`, 14, 28);

    let y = 38;
    doc.setFont('helvetica', 'bold');
    doc.text('Handle', 14, y);
    doc.text('Display Name', 45, y);
    doc.text('Mobile Phone', 85, y);
    doc.text('Plan', 125, y);
    doc.text('Views', 155, y);
    doc.text('Status', 180, y);

    doc.line(14, y + 2, 196, y + 2);
    y += 8;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    users.forEach((u) => {
      if (y > 275) {
        doc.addPage();
        y = 20;
      }
      doc.text(`@${u.username}`, 14, y);
      doc.text(u.displayName.slice(0, 18), 45, y);
      doc.text(u.mobileNumber || '-', 85, y);
      doc.text(u.plan, 125, y);
      doc.text(String(u.totalViews || 0), 155, y);
      doc.text(u.status, 180, y);
      y += 7;
    });

    doc.save(`tapping-users-registry-${new Date().toISOString().slice(0, 10)}.pdf`);
    showToast('PDF Exported', 'Master ledger printed successfully', 'success');
  };

  return (
    <div className="space-y-6 text-left">
      {/* Top Header Card in Clean Light Mode */}
      <div className="p-6 md:p-8 rounded-4xl bg-white border border-black/10 shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="text-[10px] font-mono font-black uppercase tracking-wider px-3 py-1 rounded-full bg-[#FAF7F2] text-charcoal border border-black/10">
            CREATOR DIRECTORY &bull; {users.length} REGISTERED
          </span>
          <h1 className="text-2xl sm:text-3xl font-black mt-2 tracking-tight text-charcoal">
            User &amp; Bio Link Management
          </h1>
          <p className="text-xs text-charcoal/60 mt-1 max-w-xl font-medium">
            Full administrative control over all creator accounts, personal links, published carousels, pass expirations, and status shields.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            type="button"
            onClick={() => setIsAddUserModalOpen(true)}
            className="px-4 py-2.5 rounded-2xl bg-[#141518] hover:bg-black text-white text-xs font-black flex items-center gap-2 shadow-sm transition-transform active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4 text-[#FDF166]" />
            <span>Add Creator</span>
          </button>

          <button
            type="button"
            onClick={onExportCsv}
            className="px-4 py-2.5 rounded-2xl bg-[#FAF7F2] hover:bg-black/5 text-charcoal text-xs font-bold border border-black/10 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-[#4F83FF]" />
            <span>Excel (.CSV)</span>
          </button>

          <button
            type="button"
            onClick={handleExportPdfReport}
            className="px-4 py-2.5 rounded-2xl bg-[#FAF7F2] hover:bg-black/5 text-charcoal text-xs font-bold border border-black/10 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-charcoal" />
            <span>Print PDF</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-charcoal/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search creator by name, handle (@), email, or mobile..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-black/10 text-xs font-bold text-charcoal placeholder:text-charcoal/40 focus:outline-none focus:ring-1 focus:ring-[#4F83FF] shadow-2xs"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-white border border-black/10 shadow-2xs overflow-x-auto no-scrollbar">
          {[
            { id: 'all', label: `All (${users.length})` },
            { id: 'active', label: 'Active' },
            { id: 'blocked', label: 'Blocked' },
            { id: 'pro', label: 'Pro Members' },
            { id: 'free', label: 'Free' },
          ].map((pill) => (
            <button
              key={pill.id}
              type="button"
              onClick={() => setStatusFilter(pill.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                statusFilter === pill.id
                  ? 'bg-[#141518] text-white shadow-2xs'
                  : 'text-charcoal/60 hover:text-black'
              }`}
            >
              {pill.label}
            </button>
          ))}
        </div>
      </div>

      {/* Users Data Table */}
      <div className="bg-white rounded-4xl border border-black/10 shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF7F2] border-b border-black/10 text-[10px] font-black uppercase tracking-wider text-charcoal/60">
              <tr>
                <th className="py-3.5 px-5">Creator</th>
                <th className="py-3.5 px-4">Contact</th>
                <th className="py-3.5 px-4">Membership Plan</th>
                <th className="py-3.5 px-4">Views &bull; Clicks</th>
                <th className="py-3.5 px-4">Links</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5 font-medium">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-charcoal/50 font-bold">
                    No creators match the current filter criteria.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const joinDate = new Date(user.createdAt).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  });

                  return (
                    <tr key={user.id} className="hover:bg-[#FAF7F2]/60 transition-colors">
                      {/* Creator Info */}
                      <td className="py-3.5 px-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-2xl overflow-hidden bg-[#FAF7F2] border border-black/10 shrink-0">
                            <img src={user.avatarUrl} alt={user.displayName} className="w-full h-full object-cover" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-black text-charcoal truncate">{user.displayName}</p>
                            <a
                              href={`/${user.username}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[11px] text-[#4F83FF] hover:underline font-mono truncate block"
                            >
                              @{user.username}
                            </a>
                          </div>
                        </div>
                      </td>

                      {/* Email & Phone */}
                      <td className="py-3.5 px-4 font-mono text-[11px] text-charcoal/70">
                        <div>{user.email}</div>
                        {user.mobileNumber && (
                          <div className="text-[10px] text-charcoal/60 flex items-center gap-1 mt-0.5 font-sans font-bold">
                            <Phone className="w-2.5 h-2.5 text-emerald-600 shrink-0" />
                            <span>{user.mobileNumber}</span>
                          </div>
                        )}
                      </td>

                      {/* Plan & Expiry */}
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black inline-block ${
                          user.plan === 'pro_yearly'
                            ? 'bg-[#141518] text-white'
                            : user.plan === 'pro_monthly'
                            ? 'bg-[#EFF4FF] text-[#4F83FF] border border-[#4F83FF]/20'
                            : user.plan === 'metal_bundle'
                            ? 'bg-[#B6F554] text-charcoal'
                            : 'bg-black/5 text-charcoal'
                        }`}>
                          {user.plan.replace('_', ' ').toUpperCase()}
                        </span>
                        {user.planExpiresAt && (
                          <span className="block text-[9px] text-charcoal/50 mt-1">
                            Exp: {new Date(user.planExpiresAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
                          </span>
                        )}
                      </td>

                      {/* Views & Clicks */}
                      <td className="py-3.5 px-4">
                        <span className="font-black text-charcoal">{user.totalViews.toLocaleString()}</span>
                        <span className="text-[10px] text-charcoal/40 ml-1">views</span>
                        <span className="block text-[10px] text-charcoal/60 font-mono">
                          {user.totalClicks.toLocaleString()} clicks
                        </span>
                      </td>

                      {/* Links Count */}
                      <td className="py-3.5 px-4">
                        <span className="text-xs font-black text-charcoal">
                          {(user.links || []).length}
                        </span>
                        <span className="text-[10px] text-charcoal/50 ml-1">links</span>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black ${
                          user.status === 'blocked'
                            ? 'bg-rose-100 text-rose-800 border border-rose-300'
                            : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        }`}>
                          {user.status.toUpperCase()}
                        </span>
                      </td>

                      {/* Action Buttons */}
                      <td className="py-3.5 px-5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Inspect & Manage Full Data & Links */}
                          <button
                            type="button"
                            onClick={() => setSelectedUserForDetails(user)}
                            className="p-1.5 rounded-xl bg-[#FAF7F2] hover:bg-gray-200 text-charcoal transition-colors cursor-pointer"
                            title="Inspect & Edit All Customer Data & Links"
                          >
                            <Eye className="w-3.5 h-3.5 text-charcoal" />
                          </button>

                          {/* Open Live Profile */}
                          <a
                            href={`/${user.username}`}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 rounded-xl bg-[#EFF4FF] hover:bg-[#E2ECFF] text-[#4F83FF] transition-colors cursor-pointer"
                            title="Open Live Bio Profile"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>

                          {/* Edit User Account */}
                          <button
                            type="button"
                            onClick={() => setEditingUser(user)}
                            className="p-1.5 rounded-xl bg-[#FAF7F2] hover:bg-gray-200 text-charcoal transition-colors cursor-pointer"
                            title="Edit User Profile"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          {/* Block / Unblock User with ConfirmModal */}
                          <button
                            type="button"
                            onClick={() => confirmToggleBlock(user)}
                            className={`p-1.5 rounded-xl transition-colors cursor-pointer ${
                              user.status === 'blocked'
                                ? 'bg-emerald-100 hover:bg-emerald-200 text-emerald-800'
                                : 'bg-amber-100 hover:bg-amber-200 text-amber-800'
                            }`}
                            title={user.status === 'blocked' ? 'Unblock User' : 'Block / Suspend User Profile'}
                          >
                            <Ban className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete User with ConfirmModal */}
                          <button
                            type="button"
                            onClick={() => confirmDeleteUser(user)}
                            className="p-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 transition-colors cursor-pointer"
                            title="Delete User Permanently"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* COMPREHENSIVE USER DETAILS & FULL LINK CONTROL DRAWER */}
      {selectedUserForDetails && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-4xl p-6 sm:p-8 max-w-2xl w-full border border-black/10 shadow-2xl text-left animate-in fade-in zoom-in-95 duration-200 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-black/5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl overflow-hidden bg-white border border-black/10 shrink-0">
                  <img src={selectedUserForDetails.avatarUrl} alt="" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="font-black text-base text-charcoal">{selectedUserForDetails.displayName}</h3>
                  <p className="text-xs text-charcoal/60 font-mono">@{selectedUserForDetails.username} &bull; {selectedUserForDetails.email}</p>
                  <p className="text-[11px] text-charcoal/60 flex items-center gap-2 mt-0.5 font-bold">
                    <span className="flex items-center gap-1 text-charcoal/80">
                      <Phone className="w-3 h-3 text-emerald-600" />
                      {selectedUserForDetails.mobileNumber || '+91 98000 00000'}
                    </span>
                    &bull;
                    <span className={selectedUserForDetails.isActivated !== false ? 'text-emerald-700' : 'text-amber-700'}>
                      {selectedUserForDetails.isActivated !== false ? 'Profile Active' : 'Pending Payment'}
                    </span>
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedUserForDetails(null)}
                className="p-1 rounded-xl hover:bg-gray-100 text-charcoal/60 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-5 text-xs max-h-[70vh] overflow-y-auto pr-1">
              {/* Account Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                <div className="p-3 bg-[#FAF7F2] rounded-2xl border border-black/5">
                  <span className="text-[10px] text-charcoal/50 block font-bold">TOTAL VIEWS</span>
                  <span className="font-black text-base text-charcoal">{selectedUserForDetails.totalViews.toLocaleString()}</span>
                </div>
                <div className="p-3 bg-[#FAF7F2] rounded-2xl border border-black/5">
                  <span className="text-[10px] text-charcoal/50 block font-bold">TOTAL CLICKS</span>
                  <span className="font-black text-base text-charcoal">{selectedUserForDetails.totalClicks.toLocaleString()}</span>
                </div>
                <div className="p-3 bg-[#FAF7F2] rounded-2xl border border-black/5">
                  <span className="text-[10px] text-charcoal/50 block font-bold">ACTIVE LINKS</span>
                  <span className="font-black text-base text-[#4F83FF]">{(selectedUserForDetails.links || []).length}</span>
                </div>
                <div className="p-3 bg-[#FAF7F2] rounded-2xl border border-black/5">
                  <span className="text-[10px] text-charcoal/50 block font-bold">STATUS</span>
                  <span className={`font-black text-base ${selectedUserForDetails.status === 'blocked' ? 'text-rose-600' : 'text-emerald-600'}`}>
                    {selectedUserForDetails.status.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Bio & Details */}
              <div className="p-4 bg-[#FAF7F2] rounded-3xl border border-black/5">
                <span className="text-[10px] font-black uppercase tracking-wider text-charcoal/50 block mb-1">
                  Creator Bio
                </span>
                <p className="text-xs text-charcoal/80 leading-relaxed font-medium">
                  {selectedUserForDetails.profile?.bio || 'No custom bio set yet.'}
                </p>
              </div>

              {/* ADMIN LINK CONTROL & EDITING SECTION */}
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-black/5">
                  <div>
                    <h4 className="font-black text-sm text-charcoal">Customer Links Control Hub</h4>
                    <p className="text-[11px] text-charcoal/50 font-medium">
                      Admin has full power to edit, toggle, add, or delete any link on this creator profile
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsAddingLinkForUser(selectedUserForDetails.id)}
                    className="px-3 py-1.5 rounded-xl bg-[#141518] hover:bg-black text-white text-xs font-black flex items-center gap-1.5 shadow-2xs cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5 text-[#FDF166]" />
                    <span>Add Link</span>
                  </button>
                </div>

                {/* Form to Add New Link */}
                {isAddingLinkForUser === selectedUserForDetails.id && (
                  <form onSubmit={handleAddNewLinkForUser} className="p-4 rounded-2xl bg-[#EFF4FF]/50 border border-[#4F83FF]/30 space-y-2.5">
                    <p className="text-xs font-black text-charcoal">Add New Link for @{selectedUserForDetails.username}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={newLinkTitle}
                        onChange={(e) => setNewLinkTitle(e.target.value)}
                        placeholder="Link Title (e.g. Portfolio / Store)"
                        className="px-3 py-2 rounded-xl bg-white border border-black/10 text-xs font-bold text-charcoal focus:outline-none"
                        required
                      />
                      <input
                        type="url"
                        value={newLinkUrl}
                        onChange={(e) => setNewLinkUrl(e.target.value)}
                        placeholder="https://..."
                        className="px-3 py-2 rounded-xl bg-white border border-black/10 text-xs font-mono font-bold text-charcoal focus:outline-none"
                        required
                      />
                    </div>
                    <div className="flex gap-2 justify-end pt-1">
                      <button
                        type="button"
                        onClick={() => setIsAddingLinkForUser(null)}
                        className="px-3 py-1.5 rounded-xl bg-white hover:bg-gray-100 text-xs font-bold text-charcoal border border-black/10 cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-1.5 rounded-xl bg-[#4F83FF] hover:bg-[#3B6DE6] text-white text-xs font-black shadow-xs cursor-pointer"
                      >
                        Save Link to Profile
                      </button>
                    </div>
                  </form>
                )}

                {/* Links Table / List with Full Edit Actions */}
                {(selectedUserForDetails.links || []).length === 0 ? (
                  <p className="text-xs text-charcoal/40 italic p-4 text-center bg-[#FAF7F2] rounded-2xl">
                    No links added yet by this creator.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {(selectedUserForDetails.links || []).map((link) => (
                      <div
                        key={link.id}
                        className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                          link.isActive ? 'bg-[#FAF7F2] border-black/8' : 'bg-gray-50 border-black/5 opacity-60'
                        }`}
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-black text-charcoal truncate text-xs">{link.title}</p>
                            {link.bgColor && (
                              <span
                                className="w-2.5 h-2.5 rounded-full border border-black/20 shrink-0"
                                style={{ backgroundColor: link.bgColor }}
                                title={`Custom Card Color: ${link.bgColor}`}
                              />
                            )}
                            <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-black/5 text-charcoal/60">
                              {link.clickCount || 0} clicks
                            </span>
                            {!link.isActive && (
                              <span className="text-[9px] font-black px-1.5 py-0.2 rounded bg-amber-100 text-amber-800">
                                Hidden
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-charcoal/50 truncate font-mono mt-0.5">{link.url}</p>
                        </div>

                        {/* Admin Action Controls for this specific link */}
                        <div className="flex items-center gap-1.5 shrink-0">
                          {/* Toggle Active */}
                          <button
                            type="button"
                            onClick={() => handleToggleLinkActive(selectedUserForDetails.id, link.id, link.isActive)}
                            className="p-1.5 rounded-xl bg-white hover:bg-gray-100 text-charcoal border border-black/5 cursor-pointer"
                            title={link.isActive ? 'Hide link from public bio' : 'Show link on public bio'}
                          >
                            {link.isActive ? <Eye className="w-3.5 h-3.5 text-emerald-600" /> : <EyeOff className="w-3.5 h-3.5 text-charcoal/40" />}
                          </button>

                          {/* Edit Link */}
                          <button
                            type="button"
                            onClick={() => setEditingLink({ userId: selectedUserForDetails.id, link: { ...link } })}
                            className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-gray-100 text-charcoal border border-black/10 font-bold text-[11px] cursor-pointer"
                            title="Edit this link title or URL"
                          >
                            Edit
                          </button>

                          {/* Delete Link */}
                          <button
                            type="button"
                            onClick={() => handleDeleteUserLink(selectedUserForDetails.id, link.id, link.title)}
                            className="p-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 cursor-pointer"
                            title="Delete this link permanently"
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

            <div className="pt-4 border-t border-black/5 flex items-center justify-between">
              <a
                href={`/${selectedUserForDetails.username}`}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-xl bg-[#FAF7F2] hover:bg-black/5 text-charcoal text-xs font-bold border border-black/10 flex items-center gap-1.5"
              >
                <span>View Public Bio Page</span>
                <ExternalLink className="w-3.5 h-3.5 text-[#4F83FF]" />
              </a>

              <button
                type="button"
                onClick={() => setSelectedUserForDetails(null)}
                className="px-5 py-2.5 rounded-xl bg-[#141518] hover:bg-black text-white text-xs font-black cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT SINGLE LINK MODAL FOR ADMIN */}
      {editingLink && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleSaveEditedLink} className="bg-white rounded-4xl p-6 sm:p-7 max-w-md w-full border border-black/10 shadow-2xl text-left animate-in fade-in zoom-in-95 duration-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-black/5">
              <h3 className="font-black text-base text-charcoal">Edit Customer Link</h3>
              <button
                type="button"
                onClick={() => setEditingLink(null)}
                className="p-1 rounded-xl hover:bg-gray-100 text-charcoal/60 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-[10px] font-bold text-charcoal/60 block mb-1">Link Title</label>
                <input
                  type="text"
                  value={editingLink.link.title}
                  onChange={(e) =>
                    setEditingLink({
                      ...editingLink,
                      link: { ...editingLink.link, title: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF7F2] border border-black/10 text-xs font-bold text-charcoal focus:outline-none focus:ring-1 focus:ring-[#4F83FF]"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-charcoal/60 block mb-1">Destination URL</label>
                <input
                  type="url"
                  value={editingLink.link.url}
                  onChange={(e) =>
                    setEditingLink({
                      ...editingLink,
                      link: { ...editingLink.link, url: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF7F2] border border-black/10 text-xs font-mono font-bold text-charcoal focus:outline-none focus:ring-1 focus:ring-[#4F83FF]"
                  required
                />
              </div>

              {/* Card Color Theme Controls */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <div>
                  <label className="text-[10px] font-bold text-charcoal/60 block mb-1">Card Background Color</label>
                  <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#FAF7F2] border border-black/10">
                    <input
                      type="color"
                      value={editingLink.link.bgColor || '#FFFFFF'}
                      onChange={(e) =>
                        setEditingLink({
                          ...editingLink,
                          link: { ...editingLink.link, bgColor: e.target.value },
                        })
                      }
                      className="w-6 h-6 rounded cursor-pointer border-0 p-0"
                    />
                    <input
                      type="text"
                      value={editingLink.link.bgColor || ''}
                      placeholder="#FFFFFF"
                      onChange={(e) =>
                        setEditingLink({
                          ...editingLink,
                          link: { ...editingLink.link, bgColor: e.target.value },
                        })
                      }
                      className="bg-transparent text-[11px] font-mono font-bold w-full focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-charcoal/60 block mb-1">Card Text Color</label>
                  <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#FAF7F2] border border-black/10">
                    <input
                      type="color"
                      value={editingLink.link.textColor || '#141518'}
                      onChange={(e) =>
                        setEditingLink({
                          ...editingLink,
                          link: { ...editingLink.link, textColor: e.target.value },
                        })
                      }
                      className="w-6 h-6 rounded cursor-pointer border-0 p-0"
                    />
                    <input
                      type="text"
                      value={editingLink.link.textColor || ''}
                      placeholder="#141518"
                      onChange={(e) =>
                        setEditingLink({
                          ...editingLink,
                          link: { ...editingLink.link, textColor: e.target.value },
                        })
                      }
                      className="bg-transparent text-[11px] font-mono font-bold w-full focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-black/5 flex gap-2">
              <button
                type="button"
                onClick={() => setEditingLink(null)}
                className="flex-1 py-2.5 rounded-xl bg-[#FAF7F2] hover:bg-gray-100 text-xs font-bold text-charcoal border border-black/10 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl bg-[#4F83FF] hover:bg-[#3B6DE6] text-white text-xs font-black shadow-xs cursor-pointer"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}

      {/* EDIT USER ACCOUNT MODAL */}
      {editingUser && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleSaveEdit} className="bg-white rounded-4xl p-6 sm:p-7 max-w-md w-full border border-black/10 shadow-2xl text-left animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-black/5">
              <h3 className="font-black text-base text-charcoal">Edit Creator @{editingUser.username}</h3>
              <button
                type="button"
                onClick={() => setEditingUser(null)}
                className="p-1 rounded-xl hover:bg-gray-100 text-charcoal/60 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-4 space-y-3 text-xs">
              <div>
                <label className="text-[10px] font-bold text-charcoal/60 block mb-1">Display Name</label>
                <input
                  type="text"
                  value={editingUser.displayName}
                  onChange={(e) => setEditingUser({ ...editingUser, displayName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF7F2] border border-black/10 text-xs font-bold text-charcoal focus:outline-none focus:ring-1 focus:ring-[#4F83FF]"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-charcoal/60 block mb-1">Email</label>
                <input
                  type="email"
                  value={editingUser.email}
                  onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF7F2] border border-black/10 text-xs font-bold text-charcoal focus:outline-none focus:ring-1 focus:ring-[#4F83FF]"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-charcoal/60 block mb-1">Mobile Number</label>
                <input
                  type="tel"
                  value={editingUser.mobileNumber || ''}
                  onChange={(e) => setEditingUser({ ...editingUser, mobileNumber: e.target.value })}
                  placeholder="+91 98765 43210"
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF7F2] border border-black/10 text-xs font-mono font-bold text-charcoal focus:outline-none focus:ring-1 focus:ring-[#4F83FF]"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-charcoal/60 block mb-1">Subscription Plan</label>
                <select
                  value={editingUser.plan}
                  onChange={(e) => setEditingUser({ ...editingUser, plan: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF7F2] border border-black/10 text-xs font-bold text-charcoal focus:outline-none focus:ring-1 focus:ring-[#4F83FF]"
                >
                  <option value="free">Free Starter Plan</option>
                  <option value="pro_monthly">Pro Monthly Membership (&#8377;299/mo)</option>
                  <option value="pro_yearly">Pro Annual Membership (&#8377;2,999/yr)</option>
                  <option value="metal_bundle">Metal NFC Hardware Bundle</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-charcoal/60 block mb-1">Account Status</label>
                <select
                  value={editingUser.status}
                  onChange={(e) => setEditingUser({ ...editingUser, status: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF7F2] border border-black/10 text-xs font-bold text-charcoal focus:outline-none focus:ring-1 focus:ring-[#4F83FF]"
                >
                  <option value="active">Active (Public profile accessible)</option>
                  <option value="blocked">Blocked (Suspended / Inaccessible)</option>
                </select>
              </div>
            </div>

            <div className="pt-3 border-t border-black/5 flex gap-2">
              <button
                type="button"
                onClick={() => setEditingUser(null)}
                className="flex-1 py-2.5 rounded-full bg-[#FAF7F2] hover:bg-gray-100 text-xs font-bold text-charcoal border border-black/10 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-full bg-[#4F83FF] hover:bg-[#3B6DE6] text-white text-xs font-black shadow-sm cursor-pointer"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ADD USER MODAL */}
      {isAddUserModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleCreateUser} className="bg-white rounded-4xl p-6 sm:p-7 max-w-md w-full border border-black/10 shadow-2xl text-left animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-black/5">
              <h3 className="font-black text-base text-charcoal">Add New Creator Manually</h3>
              <button
                type="button"
                onClick={() => setIsAddUserModalOpen(false)}
                className="p-1 rounded-xl hover:bg-gray-100 text-charcoal/60 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-4 space-y-3 text-xs">
              <div>
                <label className="text-[10px] font-bold text-charcoal/60 block mb-1">Username (Handle)</label>
                <div className="flex items-center px-3 py-2 rounded-xl bg-[#FAF7F2] border border-black/10">
                  <span className="text-charcoal/40 font-mono font-bold mr-1">@</span>
                  <input
                    type="text"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    placeholder="creatorname"
                    className="w-full bg-transparent text-xs font-bold text-charcoal focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-charcoal/60 block mb-1">Display Name</label>
                <input
                  type="text"
                  value={newDisplayName}
                  onChange={(e) => setNewDisplayName(e.target.value)}
                  placeholder="Full Name / Brand"
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF7F2] border border-black/10 text-xs font-bold text-charcoal focus:outline-none focus:ring-1 focus:ring-[#4F83FF]"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-charcoal/60 block mb-1">Email</label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="creator@example.com"
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF7F2] border border-black/10 text-xs font-bold text-charcoal focus:outline-none focus:ring-1 focus:ring-[#4F83FF]"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-charcoal/60 block mb-1">Mobile Number (India / Global)</label>
                <input
                  type="tel"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF7F2] border border-black/10 text-xs font-mono font-bold text-charcoal focus:outline-none focus:ring-1 focus:ring-[#4F83FF]"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-charcoal/60 block mb-1">Initial Membership Plan</label>
                <select
                  value={newPlan}
                  onChange={(e) => setNewPlan(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF7F2] border border-black/10 text-xs font-bold text-charcoal focus:outline-none focus:ring-1 focus:ring-[#4F83FF]"
                >
                  <option value="pro_monthly">Pro Monthly (&#8377;299/mo)</option>
                  <option value="pro_yearly">Pro Annual (&#8377;2,999/yr)</option>
                  <option value="free">Free Starter Plan</option>
                </select>
              </div>
            </div>

            <div className="pt-3 border-t border-black/5 flex gap-2">
              <button
                type="button"
                onClick={() => setIsAddUserModalOpen(false)}
                className="flex-1 py-2.5 rounded-full bg-[#FAF7F2] hover:bg-gray-100 text-xs font-bold text-charcoal border border-black/10 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-full bg-[#141518] hover:bg-black text-white text-xs font-black shadow-sm cursor-pointer"
              >
                Register Creator
              </button>
            </div>
          </form>
        </div>
      )}

      {/* THEME-BASED CONFIRMATION POP-UP */}
      <ConfirmModal
        isOpen={confirmModalConfig.isOpen}
        title={confirmModalConfig.title}
        description={confirmModalConfig.description}
        variant={confirmModalConfig.variant}
        confirmLabel="Yes, Proceed"
        cancelLabel="Cancel"
        onConfirm={confirmModalConfig.action}
        onCancel={() => setConfirmModalConfig((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
}
