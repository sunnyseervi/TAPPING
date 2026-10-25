'use client';

import React, { useState } from 'react';
import { NFCCardDesign, Subscription } from '@/lib/types';
import { Check, Truck, AlertTriangle } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';

interface OrdersPlansProps {
  nfcCard: NFCCardDesign;
  subscription: Subscription;
  onUpdateSubscription: (sub: Subscription) => void;
}

export default function OrdersPlansView({
  nfcCard,
  subscription,
  onUpdateSubscription,
}: OrdersPlansProps) {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'plans' | 'orders'>('plans');

  const plans = [
    {
      id: 'free',
      name: 'Starter Creator',
      price: '\u20B90',
      period: 'forever',
      desc: 'Essential link in bio profiles and standard QR codes',
      features: [
        'Unlimited basic link blocks',
        'Mobile responsive bio page',
        'Basic click counters',
        'Community support',
      ],
      current: subscription.tier === 'free',
    },
    {
      id: 'pro',
      name: 'Pro Monthly',
      price: '\u20B9299',
      period: 'per month',
      desc: 'Complete digital business card with vCard and advanced analytics',
      features: [
        'Digital business card and vCard 3.0 export',
        'Permanent dynamic vector QR codes',
        'Hourly visitor traffic flow analytics',
        '13 Full-System Themes with custom colors',
        'Zero platform branding',
      ],
      popular: true,
      current: subscription.tier === 'pro',
    },
    {
      id: 'pro_annual',
      name: 'Pro Annual (Best Value)',
      price: '\u20B92,999',
      period: 'per year (\u20B9250/mo)',
      desc: 'Full 12-month membership with 16% savings and custom domain',
      features: [
        'Everything in Pro Monthly included',
        'Custom domain mapping (yourname.com)',
        '20% exclusive discount on Metal NFC Cards',
        '300 DPI Vector PDF Visiting Card exporter',
        'Priority verified creator support',
      ],
      current: false,
    },
    {
      id: 'metal_bundle',
      name: 'Metal NFC Hardware Bundle',
      price: '\u20B91,499',
      period: 'one-time purchase',
      desc: 'Physical laser engraved metal NFC business card delivered to your door',
      features: [
        'Heavyweight laser engraved metal card',
        'One year of Pro Creator included',
        'Tracked delivery across India included',
        'Lifetime NFC chip warranty',
        'Instant smartphone contact beam',
      ],
      current: subscription.tier === 'metal_bundle',
    },
  ];

  const handleSelectPlan = (tierId: string) => {
    onUpdateSubscription({
      tier: tierId as any,
      status: 'active',
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
    });
    showToast('Subscription Updated', `Selected tier updated`, 'success');
  };

  return (
    <div className="bg-white rounded-4xl p-5 md:p-6 border border-black/5 shadow-soft">
      {/* Header with Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-black/5">
        <div>
          <h2 className="text-lg font-extrabold text-charcoal">Plans, Billing, and Card Orders</h2>
          <p className="text-xs text-charcoal-muted">
            Manage your subscription tier, Razorpay gateway, and hardware fulfillment
          </p>
        </div>

        <div className="flex items-center gap-1 bg-[#FAF7F2] p-1 rounded-full border border-black/5 text-xs">
          <button
            onClick={() => setActiveTab('plans')}
            className={`px-3 py-1.5 rounded-full font-semibold transition-all ${
              activeTab === 'plans' ? 'bg-[#1F2024] text-white shadow-xs' : 'text-charcoal/70'
            }`}
          >
            Subscription Plans
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-3 py-1.5 rounded-full font-semibold transition-all ${
              activeTab === 'orders' ? 'bg-[#1F2024] text-white shadow-xs' : 'text-charcoal/70'
            }`}
          >
            NFC Card Orders
          </button>
        </div>
      </div>

      {/* Gateway Environment Notification */}
      <div className="mt-4 p-3 rounded-2xl bg-pastel-yellow-light border border-pastel-yellow-border flex items-start gap-2.5 text-xs text-charcoal">
        <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
        <div>
          <p className="font-bold">Razorpay Gateway Integration Notice</p>
          <p className="text-[11px] text-charcoal/80 mt-0.5">
            Razorpay Sandbox test key active. Processing operates in test mode until live credentials are added in .env.local.
          </p>
        </div>
      </div>

      {activeTab === 'plans' ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`p-5 rounded-3xl border flex flex-col justify-between text-left relative ${
                plan.popular
                  ? 'border-charcoal bg-pastel-peach-light/50 ring-2 ring-charcoal'
                  : 'border-black/10 bg-[#FAF7F2]'
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-[#1F2024] text-white text-[10px] font-bold shadow-xs">
                  MOST POPULAR
                </span>
              )}

              <div>
                <h3 className="font-black text-base text-charcoal">{plan.name}</h3>
                <div className="flex items-baseline gap-1 my-2">
                  <span className="text-3xl font-black text-charcoal">{plan.price}</span>
                  <span className="text-xs text-charcoal-muted font-medium">{plan.period}</span>
                </div>
                <p className="text-xs text-charcoal-muted leading-relaxed mb-4">
                  {plan.desc}
                </p>

                <div className="space-y-2 pt-3 border-t border-black/5 text-xs">
                  {plan.features.map((f, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="text-charcoal/80">{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                disabled={plan.current}
                onClick={() => handleSelectPlan(plan.id)}
                className={`w-full mt-6 py-2.5 px-4 rounded-full text-xs font-semibold transition-all ${
                  plan.current
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 cursor-default'
                    : 'bg-[#1F2024] hover:bg-black text-white shadow-sm'
                }`}
              >
                {plan.current ? 'Current Plan' : `Select ${plan.name}`}
              </button>
            </div>
          ))}
        </div>
      ) : (
        /* Orders Fulfillment Tracking */
        <div className="mt-6 text-left text-xs">
          <div className="p-4 rounded-3xl bg-[#FAF7F2] border border-black/5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-black/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-pastel-sky flex items-center justify-center">
                  <Truck className="w-5 h-5 text-charcoal" />
                </div>
                <div>
                  <h4 className="font-extrabold text-charcoal text-sm">
                    Order TAP-9948201
                  </h4>
                  <p className="text-charcoal-muted text-[11px]">
                    Matte Stealth Black NFC Metal Business Card
                  </p>
                </div>
              </div>

              <span className="px-3 py-1 rounded-full bg-pastel-yellow text-charcoal font-bold text-[11px] border border-pastel-yellow-border self-start sm:self-auto">
                In Production
              </span>
            </div>

            <div className="grid grid-cols-4 gap-2 pt-4 pb-2 text-center">
              <div>
                <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto text-[10px] font-bold">
                  1
                </div>
                <p className="font-bold text-[11px] text-charcoal mt-1">Design Blueprint</p>
              </div>

              <div>
                <div className="w-6 h-6 rounded-full bg-charcoal text-white flex items-center justify-center mx-auto text-[10px] font-bold animate-pulse">
                  2
                </div>
                <p className="font-bold text-[11px] text-charcoal mt-1">Laser Etching</p>
              </div>

              <div>
                <div className="w-6 h-6 rounded-full bg-black/10 text-charcoal/40 flex items-center justify-center mx-auto text-[10px] font-bold">
                  3
                </div>
                <p className="font-semibold text-[11px] text-charcoal/40 mt-1">Chip Encoding</p>
              </div>

              <div>
                <div className="w-6 h-6 rounded-full bg-black/10 text-charcoal/40 flex items-center justify-center mx-auto text-[10px] font-bold">
                  4
                </div>
                <p className="font-semibold text-[11px] text-charcoal/40 mt-1">Shipping Dispatch</p>
              </div>
            </div>

            <div className="mt-3 p-3 bg-white rounded-2xl border border-black/5 flex justify-between items-center text-[11px]">
              <div>
                <span className="text-charcoal-muted">Tracking Reference: </span>
                <span className="font-mono font-bold text-charcoal">{nfcCard.trackingNumber}</span>
              </div>
              <span className="text-emerald-700 font-semibold">Estimated Delivery: 3 to 5 business days</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
