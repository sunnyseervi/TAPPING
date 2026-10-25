'use client';

import React, { useState } from 'react';
import { 
  Package, 
  Truck, 
  Check, 
  Clock, 
  MapPin, 
  ExternalLink, 
  Edit2, 
  Printer, 
  Search,
  Filter,
  CheckCircle2,
  X
} from 'lucide-react';
import { MetalCardOrder } from '@/lib/types';
import { useToast } from '@/components/ui/Toast';

interface AdminOrdersTabProps {
  orders: MetalCardOrder[];
  onUpdateOrderStatus: (orderId: string, status: MetalCardOrder['status'], trackingNumber?: string) => void;
}

export default function AdminOrdersTab({
  orders,
  onUpdateOrderStatus,
}: AdminOrdersTabProps) {
  const { showToast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrderForTracking, setSelectedOrderForTracking] = useState<MetalCardOrder | null>(null);
  const [trackingInput, setTrackingInput] = useState('');

  const filteredOrders = orders.filter((o) => {
    const matchSearch =
      o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.userEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.engravedName.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchSearch) return false;
    if (statusFilter !== 'all' && o.status !== statusFilter) return false;
    return true;
  });

  const handleUpdateStatus = (orderId: string, newStatus: MetalCardOrder['status']) => {
    onUpdateOrderStatus(orderId, newStatus);
    showToast('Order Status Updated', `Status changed to ${newStatus.toUpperCase()}`, 'success');
  };

  const handleSaveTracking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrderForTracking) return;
    onUpdateOrderStatus(selectedOrderForTracking.id, 'shipped', trackingInput);
    showToast('Tracking Saved & Dispatched', `Tracking ID ${trackingInput} assigned`, 'success');
    setSelectedOrderForTracking(null);
  };

  return (
    <div className="space-y-6 text-left">
      {/* Header Card */}
      <div className="p-6 rounded-4xl bg-white border border-black/10 shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#B6F554] text-charcoal border border-black/10 text-[10px] font-black uppercase tracking-wider mb-2">
            <Package className="w-3.5 h-3.5" />
            <span>Fulfillment Pipeline</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-charcoal tracking-tight">
            Laser-Engraved Metal NFC Card Orders
          </h2>
          <p className="text-xs text-charcoal/60 mt-1 font-medium">
            Manage production blueprints, laser etching queue, tracking IDs, and courier delivery.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="p-3 bg-[#FAF7F2] rounded-2xl border border-black/5 text-right">
            <span className="text-[10px] font-bold text-charcoal/50 uppercase block">Active Queue</span>
            <span className="text-lg font-black text-charcoal">
              {orders.filter((o) => o.status !== 'delivered').length} Orders
            </span>
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-charcoal/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by order #, recipient name, or engraved text..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-black/10 text-xs font-bold text-charcoal placeholder:text-charcoal/40 focus:outline-none focus:ring-1 focus:ring-[#4F83FF] shadow-2xs"
          />
        </div>

        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-white border border-black/10 shadow-2xs overflow-x-auto no-scrollbar">
          {[
            { id: 'all', label: `All Orders (${orders.length})` },
            { id: 'pending', label: 'Pending' },
            { id: 'in_production', label: 'In Production' },
            { id: 'shipped', label: 'Shipped' },
            { id: 'delivered', label: 'Delivered' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                statusFilter === tab.id
                  ? 'bg-[#141518] text-white shadow-2xs'
                  : 'text-charcoal/60 hover:text-black'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-4xl border border-black/10 shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF7F2] border-b border-black/10 text-[10px] font-black uppercase tracking-wider text-charcoal/60">
              <tr>
                <th className="py-3.5 px-5">Order ID &bull; Date</th>
                <th className="py-3.5 px-4">Customer Details</th>
                <th className="py-3.5 px-4">Card Hardware &bull; Engraving</th>
                <th className="py-3.5 px-4">Shipping Destination</th>
                <th className="py-3.5 px-4">Courier &bull; Tracking</th>
                <th className="py-3.5 px-4">Status &bull; Price</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5 font-medium">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-charcoal/50 font-bold">
                    No hardware orders found.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const dateStr = new Date(order.createdAt).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  });

                  return (
                    <tr key={order.id} className="hover:bg-[#FAF7F2]/60 transition-colors">
                      {/* Order # and Date */}
                      <td className="py-3.5 px-5">
                        <span className="font-mono font-black text-charcoal block">{order.orderNumber}</span>
                        <span className="text-[10px] text-charcoal/50 font-mono">{dateStr}</span>
                      </td>

                      {/* Customer Details */}
                      <td className="py-3.5 px-4">
                        <p className="font-black text-charcoal">{order.userName}</p>
                        <p className="text-[10px] text-charcoal/50 font-mono truncate">{order.userEmail}</p>
                        <p className="text-[10px] text-charcoal/50">{order.userPhone}</p>
                      </td>

                      {/* Card Hardware & Engraving */}
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#141518] text-white text-[10px] font-black">
                          {order.material.replace('_', ' ').toUpperCase()}
                        </span>
                        <p className="text-xs font-black text-charcoal mt-1">
                          {order.engravedName}
                        </p>
                        <p className="text-[10px] text-charcoal/60 truncate font-mono">
                          {order.engravedTagline}
                        </p>
                      </td>

                      {/* Shipping Address */}
                      <td className="py-3.5 px-4 max-w-xs text-[11px] text-charcoal/70">
                        <div className="flex items-start gap-1">
                          <MapPin className="w-3 h-3 text-rose-500 shrink-0 mt-0.5" />
                          <span className="leading-tight">
                            {order.shippingAddress?.street}, {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zip}
                          </span>
                        </div>
                      </td>

                      {/* Tracking Number */}
                      <td className="py-3.5 px-4">
                        {order.trackingNumber ? (
                          <div>
                            <span className="font-mono font-bold text-charcoal text-[11px] block">
                              {order.trackingNumber}
                            </span>
                            <span className="text-[10px] text-charcoal/50">
                              {order.shippingCarrier || 'Delhivery Express'}
                            </span>
                          </div>
                        ) : (
                          <span className="text-[10px] font-mono text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                            Awaiting Tracking
                          </span>
                        )}
                      </td>

                      {/* Status & Price */}
                      <td className="py-3.5 px-4">
                        <span className="font-black text-charcoal block">&#8377;{order.amount} (Paid)</span>
                        <select
                          value={order.status}
                          onChange={(e) => handleUpdateStatus(order.id, e.target.value as any)}
                          className={`mt-1 text-[10px] font-black px-2 py-1 rounded-xl border focus:outline-none cursor-pointer ${
                            order.status === 'delivered'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                              : order.status === 'shipped'
                              ? 'bg-[#EFF4FF] text-[#4F83FF] border-[#4F83FF]/30'
                              : 'bg-[#FDF166] text-charcoal border-black/10'
                          }`}
                        >
                          <option value="pending">Pending</option>
                          <option value="in_production">In Production</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-5 text-right">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedOrderForTracking(order);
                            setTrackingInput(order.trackingNumber || '');
                          }}
                          className="px-3 py-1.5 rounded-xl bg-[#FAF7F2] hover:bg-gray-200 text-charcoal text-xs font-bold transition-colors cursor-pointer"
                          title="Assign Tracking ID"
                        >
                          Edit Tracking
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* EDIT TRACKING MODAL */}
      {selectedOrderForTracking && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleSaveTracking} className="bg-white rounded-4xl p-6 max-w-sm w-full border border-black/10 shadow-2xl text-left animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-black/5">
              <h3 className="font-black text-sm text-charcoal">
                Tracking for {selectedOrderForTracking.orderNumber}
              </h3>
              <button
                type="button"
                onClick={() => setSelectedOrderForTracking(null)}
                className="p-1 rounded-lg hover:bg-gray-100 text-charcoal/60 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-4 space-y-3 text-xs">
              <div>
                <label className="text-[10px] font-bold text-charcoal/60 block mb-1">
                  Courier Tracking ID (Delhivery, BlueDart, SpeedPost)
                </label>
                <input
                  type="text"
                  value={trackingInput}
                  onChange={(e) => setTrackingInput(e.target.value)}
                  placeholder="e.g. DEL-992817401"
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF7F2] border border-black/10 text-xs font-bold text-charcoal font-mono focus:outline-none focus:ring-1 focus:ring-[#4F83FF]"
                  required
                />
              </div>
            </div>

            <div className="pt-3 border-t border-black/5 flex gap-2">
              <button
                type="button"
                onClick={() => setSelectedOrderForTracking(null)}
                className="flex-1 py-2.5 rounded-full bg-[#FAF7F2] text-xs font-bold text-charcoal border border-black/10"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-full bg-[#4F83FF] hover:bg-[#3B6DE6] text-white text-xs font-black shadow-sm"
              >
                Save &amp; Mark Shipped
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
