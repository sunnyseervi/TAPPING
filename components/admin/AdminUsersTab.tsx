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
  Lock
} from 'lucide-react';
import { UserRecord, Profile } from '@/lib/types';
import { useToast } from '@/components/ui/Toast';
import { jsPDF } from 'jspdf';
import { checkUsernameAvailability } from '@/lib/storage';

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

  // Modals
  const [selectedUserForDetails, setSelectedUserForDetails] = useState<UserRecord | null>(null);
  const [editingUser, setEditingUser] = useState<UserRecord | null>(null);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);

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

  const handleExportPdfReport = () => {
    const doc = new jsPDF();
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text('TAPPING Platform - Master User Registry', 14, 20);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Generated on: ${new Date().toLocaleString()} | Total Users: ${users.length}`, 14, 28);

    let y = 38;
    doc.setFillColor(20, 21, 24);
    doc.setTextColor(255, 255, 255);
    doc.rect(14, y - 5, 182, 8, 'F');
    doc.text('Username', 16, y);
    doc.text('Display Name', 50, y);
    doc.text('Email', 95, y);
    doc.text('Plan', 145, y);
    doc.text('Status', 170, y);

    y += 8;
    doc.setTextColor(20, 21, 24);

    users.forEach((u) => {
      if (y > 275) {
        doc.addPage();
        y = 20;
      }
      doc.text(u.username, 16, y);
      doc.text(u.displayName.slice(0, 18), 50, y);
      doc.text(u.email.slice(0, 22), 95, y);
      doc.text(u.plan, 145, y);
      doc.text(u.status, 170, y);
      y += 7;
    });

    doc.save('tapping-users-registry.pdf');
    showToast('PDF Ledger Exported', 'Master user registry report saved', 'success');
  };

  return (
    <div className="space-y-6 text-left">
      {/* Top Header & Search Bar */}
      <div className="p-6 rounded-4xl bg-white border border-black/10 shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-charcoal tracking-tight">
            User Directory &amp; Creator Management
          </h2>
          <p className="text-xs text-charcoal/60 mt-1 font-medium">
            Manage profile privileges, view link traffic, block abusive accounts, or export records.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            type="button"
            onClick={() => setIsAddUserModalOpen(true)}
            className="px-4 py-2.5 rounded-2xl bg-[#4F83FF] hover:bg-[#3B6DE6] text-white text-xs font-black flex items-center gap-2 shadow-sm transition-transform active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add User</span>
          </button>

          <button
            type="button"
            onClick={onExportCsv}
            className="px-3.5 py-2.5 rounded-2xl bg-[#FAF7F2] hover:bg-gray-100 text-charcoal text-xs font-bold border border-black/10 flex items-center gap-2 transition-colors cursor-pointer"
            title="Download CSV for Excel"
          >
            <Download className="w-3.5 h-3.5 text-[#4F83FF]" />
            <span>Excel / CSV</span>
          </button>

          <button
            type="button"
            onClick={handleExportPdfReport}
            className="px-3.5 py-2.5 rounded-2xl bg-[#FAF7F2] hover:bg-gray-100 text-charcoal text-xs font-bold border border-black/10 flex items-center gap-2 transition-colors cursor-pointer"
            title="Download Printable PDF Report"
          >
            <Printer className="w-3.5 h-3.5 text-emerald-600" />
            <span>PDF Ledger</span>
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
            placeholder="Search creator by name, handle (@) or email..."
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
                <th className="py-3.5 px-4">Email</th>
                <th className="py-3.5 px-4">Membership Plan</th>
                <th className="py-3.5 px-4">Views &bull; Clicks</th>
                <th className="py-3.5 px-4">Joined Date</th>
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

                      {/* Email & Verified Phone */}
                      <td className="py-3.5 px-4 font-mono text-[11px] text-charcoal/70">
                        <div>{user.email}</div>
                        {user.mobileNumber && (
                          <div className="text-[10px] text-charcoal/50 flex items-center gap-1 mt-0.5 font-sans font-bold">
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

                      {/* Joined Date */}
                      <td className="py-3.5 px-4 text-charcoal/60 font-mono text-[11px]">
                        {joinDate}
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
                          {/* View Full Details */}
                          <button
                            type="button"
                            onClick={() => setSelectedUserForDetails(user)}
                            className="p-1.5 rounded-xl bg-[#FAF7F2] hover:bg-gray-200 text-charcoal transition-colors cursor-pointer"
                            title="Inspect User Details"
                          >
                            <Eye className="w-3.5 h-3.5 text-charcoal" />
                          </button>

                          {/* Open Live Profile */}
                          <a
                            href={`/${user.username}`}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 rounded-xl bg-[#EFF4FF] hover:bg-[#E2ECFF] text-[#4F83FF] transition-colors cursor-pointer"
                            title="Open Live Profile"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>

                          {/* Edit User */}
                          <button
                            type="button"
                            onClick={() => setEditingUser(user)}
                            className="p-1.5 rounded-xl bg-[#FAF7F2] hover:bg-gray-200 text-charcoal transition-colors cursor-pointer"
                            title="Edit User"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          {/* Block / Unblock User */}
                          <button
                            type="button"
                            onClick={() => onToggleBlock(user.id)}
                            className={`p-1.5 rounded-xl transition-colors cursor-pointer ${
                              user.status === 'blocked'
                                ? 'bg-emerald-100 hover:bg-emerald-200 text-emerald-800'
                                : 'bg-amber-100 hover:bg-amber-200 text-amber-800'
                            }`}
                            title={user.status === 'blocked' ? 'Unblock User' : 'Block User Profile'}
                          >
                            <Ban className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete User */}
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm(`Are you sure you want to delete creator @${user.username}?`)) {
                                onDeleteUser(user.id);
                                showToast('User Deleted', `@${user.username} has been removed`, 'info');
                              }
                            }}
                            className="p-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 transition-colors cursor-pointer"
                            title="Delete User"
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

      {/* USER DETAILS INSPECTOR MODAL */}
      {selectedUserForDetails && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-4xl p-6 sm:p-7 max-w-xl w-full border border-black/10 shadow-2xl text-left animate-in fade-in zoom-in-95 duration-200 my-8">
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
                      {selectedUserForDetails.isActivated !== false ? 'Profile Activated (Paid)' : 'Pending Payment'}
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

            <div className="py-4 space-y-4 text-xs max-h-[70vh] overflow-y-auto pr-1">
              {/* Account Meta Grid */}
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
                  <span className="font-black text-base text-[#4F83FF]">{selectedUserForDetails.links?.length || 0}</span>
                </div>
                <div className="p-3 bg-[#FAF7F2] rounded-2xl border border-black/5">
                  <span className="text-[10px] text-charcoal/50 block font-bold">PRODUCTS</span>
                  <span className="font-black text-base text-emerald-600">{selectedUserForDetails.products?.length || 0}</span>
                </div>
              </div>

              {/* Bio & Profile Summary */}
              <div className="p-4 bg-[#FAF7F2] rounded-3xl border border-black/5">
                <span className="text-[10px] font-black uppercase tracking-wider text-charcoal/50 block mb-1">
                  Creator Bio
                </span>
                <p className="text-xs text-charcoal/80 leading-relaxed font-medium">
                  {selectedUserForDetails.profile?.bio || 'No custom bio set yet.'}
                </p>
              </div>

              {/* Links List */}
              <div>
                <span className="text-[11px] font-black uppercase tracking-wider text-charcoal/70 block mb-2">
                  Configured Bio Links ({selectedUserForDetails.links?.length || 0})
                </span>
                {selectedUserForDetails.links?.length === 0 ? (
                  <p className="text-xs text-charcoal/40 italic">No links added yet.</p>
                ) : (
                  <div className="space-y-1.5">
                    {selectedUserForDetails.links?.map((link) => (
                      <div key={link.id} className="p-2.5 rounded-xl bg-white border border-black/10 flex items-center justify-between">
                        <div className="min-w-0">
                          <p className="font-bold text-charcoal truncate">{link.title}</p>
                          <p className="text-[10px] text-charcoal/50 truncate font-mono">{link.url}</p>
                        </div>
                        <span className="text-[10px] font-mono font-bold text-charcoal/60 shrink-0">
                          {link.clickCount || 0} clicks
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Slidable Products List */}
              <div>
                <span className="text-[11px] font-black uppercase tracking-wider text-charcoal/70 block mb-2">
                  Curated Products ({selectedUserForDetails.products?.length || 0})
                </span>
                {selectedUserForDetails.products?.length === 0 ? (
                  <p className="text-xs text-charcoal/40 italic">No products added yet.</p>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    {selectedUserForDetails.products?.map((prod) => (
                      <div key={prod.id} className="p-2.5 rounded-xl bg-white border border-black/10 flex items-center gap-2">
                        <img src={prod.imageUrl} alt="" className="w-8 h-8 rounded-lg object-cover" />
                        <div className="min-w-0">
                          <p className="font-bold text-charcoal truncate">{prod.name}</p>
                          <p className="text-[10px] text-emerald-700 font-bold">&#8377;{prod.price}</p>
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
                className="px-4 py-2.5 rounded-full bg-[#4F83FF] text-white text-xs font-black flex items-center gap-1.5 shadow-sm"
              >
                <span>Open Live Profile</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                type="button"
                onClick={() => setSelectedUserForDetails(null)}
                className="px-4 py-2.5 rounded-full bg-[#141518] text-white text-xs font-black"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT USER MODAL */}
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
                <label className="text-[10px] font-bold text-charcoal/60 block mb-1">Subscription Tier</label>
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
                className="flex-1 py-2.5 rounded-full bg-[#FAF7F2] hover:bg-gray-100 text-xs font-bold text-charcoal border border-black/10"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-full bg-[#4F83FF] hover:bg-[#3B6DE6] text-white text-xs font-black shadow-sm"
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
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF7F2] border border-black/10 text-xs font-bold text-charcoal focus:outline-none"
                >
                  <option value="pro_monthly">Pro Monthly (&#8377;299/mo)</option>
                  <option value="pro_yearly">Pro Annual (&#8377;2,999/yr)</option>
                  <option value="free">Free Plan</option>
                </select>
              </div>
            </div>

            <div className="pt-3 border-t border-black/5 flex gap-2">
              <button
                type="button"
                onClick={() => setIsAddUserModalOpen(false)}
                className="flex-1 py-2.5 rounded-full bg-[#FAF7F2] hover:bg-gray-100 text-xs font-bold text-charcoal border border-black/10"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-full bg-[#4F83FF] hover:bg-[#3B6DE6] text-white text-xs font-black shadow-sm"
              >
                Create Account
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
