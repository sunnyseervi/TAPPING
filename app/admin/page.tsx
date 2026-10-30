'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  UserRecord, 
  MetalCardOrder, 
  PaymentRecord, 
  AdminSession, 
  SystemSettings 
} from '@/lib/types';
import { 
  getAdminSession, 
  clearAdminSession, 
  isSuperAdminAuthorized,
  AUTHORIZED_SUPERADMIN_EMAIL,
  getStoredUsers, 
  saveStoredUsers, 
  addStoredUser, 
  updateStoredUser, 
  toggleUserBlock, 
  deleteStoredUser, 
  getStoredOrders, 
  updateOrderStatus, 
  getStoredPayments, 
  getSystemSettings, 
  saveSystemSettings 
} from '@/lib/storage';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminOverviewTab from '@/components/admin/AdminOverviewTab';
import AdminUsersTab from '@/components/admin/AdminUsersTab';
import AdminOrdersTab from '@/components/admin/AdminOrdersTab';
import AdminPaymentsTab from '@/components/admin/AdminPaymentsTab';
import AdminSettingsTab from '@/components/admin/AdminSettingsTab';
import AdminLoginScreen from '@/components/admin/AdminLoginScreen';
import { useToast } from '@/components/ui/Toast';

export default function AdminPage() {
  const router = useRouter();
  const { showToast } = useToast();

  const [session, setSession] = useState<AdminSession | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'orders' | 'payments' | 'settings'>('overview');

  // Core Data States
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [orders, setOrders] = useState<MetalCardOrder[]>([]);
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [settings, setSettings] = useState<SystemSettings>(getSystemSettings());

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (isSuperAdminAuthorized()) {
        const activeSession = getAdminSession();
        setSession(activeSession);
      } else {
        clearAdminSession();
        setSession(null);
      }
      setIsCheckingAuth(false);
      setUsers(getStoredUsers());
      setOrders(getStoredOrders());
      setPayments(getStoredPayments());
      setSettings(getSystemSettings());

      // Listen for cross-tab or studio updates
      const handleUsersUpdate = () => setUsers(getStoredUsers());
      const handleOrdersUpdate = () => setOrders(getStoredOrders());
      window.addEventListener('tapping-users-updated', handleUsersUpdate);
      window.addEventListener('tapping-orders-updated', handleOrdersUpdate);
      return () => {
        window.removeEventListener('tapping-users-updated', handleUsersUpdate);
        window.removeEventListener('tapping-orders-updated', handleOrdersUpdate);
      };
    }
  }, []);

  const handleLogout = () => {
    clearAdminSession();
    setSession(null);
    showToast('Admin Logged Out', 'Session terminated', 'info');
  };

  // User Management Handlers
  const handleAddUser = (newUserData: Partial<UserRecord>) => {
    const created = addStoredUser(newUserData);
    setUsers(getStoredUsers());
  };

  const handleUpdateUser = (userId: string, updates: Partial<UserRecord>) => {
    updateStoredUser(userId, updates);
    setUsers(getStoredUsers());
  };

  const handleToggleBlock = (userId: string) => {
    const isNowBlocked = toggleUserBlock(userId);
    setUsers(getStoredUsers());
    showToast(
      isNowBlocked ? 'User Suspended' : 'User Reinstated',
      isNowBlocked ? 'Public bio link will now show suspension notice' : 'Public access restored',
      isNowBlocked ? 'info' : 'success'
    );
  };

  const handleDeleteUser = (userId: string) => {
    deleteStoredUser(userId);
    setUsers(getStoredUsers());
  };

  // Order Management Handler
  const handleUpdateOrderStatus = (orderId: string, status: MetalCardOrder['status'], trackingNumber?: string) => {
    updateOrderStatus(orderId, status, trackingNumber);
    setOrders(getStoredOrders());
  };

  // Payment & Pass Extension Handler
  const handleExtendUserPass = (userId: string, additionalDays: number) => {
    const target = users.find((u) => u.id === userId);
    if (!target) return;
    const baseDate = target.planExpiresAt ? new Date(target.planExpiresAt).getTime() : Date.now();
    const newExpiry = new Date(Math.max(Date.now(), baseDate) + additionalDays * 24 * 60 * 60 * 1000).toISOString();
    updateStoredUser(userId, { planExpiresAt: newExpiry });
    setUsers(getStoredUsers());
  };

  // Settings Handler
  const handleSaveSettings = (newSettings: SystemSettings) => {
    saveSystemSettings(newSettings);
    setSettings(newSettings);
  };

  // CSV Export for Excel
  const handleExportCsv = () => {
    const headers = [
      'User ID',
      'Username',
      'Display Name',
      'Email',
      'Status',
      'Plan Tier',
      'Plan Expiration',
      'Total Views',
      'Total Clicks',
      'Created Date',
    ];

    const rows = users.map((u) => [
      `"${u.id}"`,
      `"${u.username}"`,
      `"${u.displayName.replace(/"/g, '""')}"`,
      `"${u.email}"`,
      `"${u.status}"`,
      `"${u.plan}"`,
      `"${u.planExpiresAt || 'N/A'}"`,
      u.totalViews || 0,
      u.totalClicks || 0,
      `"${u.createdAt}"`,
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `tapping-users-registry-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('Export Complete', 'Exported master creator registry to Excel CSV', 'success');
  };

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] text-charcoal flex items-center justify-center font-sans text-xs">
        <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
      </div>
    );
  }

  if (!session || !session.isAuthenticated || session.adminEmail.toLowerCase() !== AUTHORIZED_SUPERADMIN_EMAIL.toLowerCase()) {
    return <AdminLoginScreen onLoginSuccess={(sess) => setSession(sess)} />;
  }

  const now = Date.now();
  const expiringCount = users.filter((u) => {
    if (u.plan === 'free' || !u.planExpiresAt) return false;
    const diff = (new Date(u.planExpiresAt).getTime() - now) / (1000 * 60 * 60 * 24);
    return diff > 0 && diff <= 14;
  }).length;

  return (
    <div className="min-h-screen bg-[#F7F5EE] text-charcoal font-sans flex flex-col">
      {/* Top Header */}
      <div className="print:hidden">
        <AdminHeader
          session={session}
          onLogout={handleLogout}
          onOpenLiveSite={() => router.push('/')}
        />
      </div>

      {/* Main Admin Workspace with Sidebar */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Left Sidebar */}
        <div className="print:hidden">
          <AdminSidebar
            activeTab={activeTab}
            onSelectTab={setActiveTab}
            userCount={users.length}
            orderCount={orders.length}
            expiringCount={expiringCount}
          />
        </div>

        {/* Right Active Tab Content */}
        <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full print:p-0 print:m-0 print:max-w-none">
          {activeTab === 'overview' && (
            <AdminOverviewTab
              users={users}
              orders={orders}
              payments={payments}
              onNavigateTab={setActiveTab}
              onAddUserClick={() => setActiveTab('users')}
              onExportCsv={handleExportCsv}
            />
          )}

          {activeTab === 'users' && (
            <AdminUsersTab
              users={users}
              onAddUser={handleAddUser}
              onUpdateUser={handleUpdateUser}
              onToggleBlock={handleToggleBlock}
              onDeleteUser={handleDeleteUser}
              onExportCsv={handleExportCsv}
            />
          )}

          {activeTab === 'orders' && (
            <AdminOrdersTab
              orders={orders}
              onUpdateOrderStatus={handleUpdateOrderStatus}
            />
          )}

          {activeTab === 'payments' && (
            <AdminPaymentsTab
              payments={payments}
              users={users}
              onExtendUserPass={handleExtendUserPass}
            />
          )}

          {activeTab === 'settings' && (
            <AdminSettingsTab
              settings={settings}
              onSaveSettings={handleSaveSettings}
            />
          )}
        </main>
      </div>
    </div>
  );
}
