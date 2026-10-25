'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowRight, Heart, Minus, Plus, ShoppingBag, Tag, Trash2, X } from 'lucide-react';
import { StoreConfig, StoreProduct } from '@/lib/types';
import { useToast } from '@/components/ui/Toast';
import { getStoredStore, saveStoredStore } from '@/lib/storage';

interface CartLine {
  key: string;
  product: StoreProduct;
  variant: string;
  quantity: number;
}

interface PublicStoreProps {
  store: StoreConfig;
  sellerName: string;
  dark: boolean;
}

const formatPrice = (value: number) => `₹${value.toLocaleString('en-IN')}`;

export default function PublicStore({ store, sellerName, dark }: PublicStoreProps) {
  const { showToast } = useToast();
  const [cart, setCart] = useState<CartLine[]>([]);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const [cartOpen, setCartOpen] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [customerNote, setCustomerNote] = useState('');
  const visitRecorded = useRef(false);

  const products = store.products.filter((product) => product.isActive).sort((a, b) => a.sortOrder - b.sortOrder);
  const itemCount = cart.reduce((sum, line) => sum + line.quantity, 0);
  const total = cart.reduce((sum, line) => sum + line.product.price * line.quantity, 0);
  const panelClass = dark ? 'border-white/15 bg-white/[0.08] text-white' : 'border-[#D9CFC2] bg-white text-charcoal';

  useEffect(() => {
    if (visitRecorded.current) return;
    visitRecorded.current = true;
    const current = getStoredStore();
    saveStoredStore({
      ...current,
      storeVisits: (current.storeVisits || 0) + 1,
      products: current.products.map((item) => item.isActive ? { ...item, viewCount: (item.viewCount || 0) + 1 } : item),
    });
  }, []);

  const addToCart = (product: StoreProduct) => {
    const variant = selectedVariants[product.id] || product.variants[0] || '';
    const key = `${product.id}:${variant}`;
    setCart((current) => {
      const existing = current.find((line) => line.key === key);
      if (existing) return current.map((line) => line.key === key ? { ...line, quantity: line.quantity + 1 } : line);
      return [...current, { key, product, variant, quantity: 1 }];
    });
    const current = getStoredStore();
    saveStoredStore({ ...current, products: current.products.map((item) => item.id === product.id ? { ...item, cartAdds: (item.cartAdds || 0) + 1 } : item) });
    showToast('Added to cart', product.name, 'success');
  };

  const changeQuantity = (key: string, change: number) => {
    setCart((current) => current
      .map((line) => line.key === key ? { ...line, quantity: line.quantity + change } : line)
      .filter((line) => line.quantity > 0));
  };

  const orderMessage = useMemo(() => {
    const orderReference = `TAP-${Date.now().toString().slice(-8)}`;
    const lines = cart.flatMap((line, index) => [
      `${index + 1}. ${line.product.name}`,
      ...(line.variant ? [`Variant: ${line.variant}`] : []),
      `Quantity: ${line.quantity}`,
      `Price: ${formatPrice(line.product.price)} each`,
      `Line total: ${formatPrice(line.product.price * line.quantity)}`,
      '',
    ]);
    return [
      `Hello ${sellerName}, I would like to place an order.`,
      '',
      ...lines,
      `Order total: ${formatPrice(total)}`,
      `Order reference: ${orderReference}`,
      '',
      `Customer name: ${customerName.trim()}`,
      ...(customerPhone.trim() ? [`Customer phone: ${customerPhone.trim()}`] : []),
      ...(customerAddress.trim() ? [`Delivery address: ${customerAddress.trim()}`] : []),
      ...(customerNote.trim() ? [`Order note: ${customerNote.trim()}`] : []),
      '',
      'Please confirm availability, delivery charges and payment instructions.',
    ].join('\n');
  }, [cart, customerAddress, customerName, customerNote, customerPhone, sellerName, total]);

  const sendOrder = () => {
    if (cart.length === 0) {
      showToast('Cart is empty', 'Add at least one product before ordering.', 'error');
      return;
    }
    if (!customerName.trim()) {
      showToast('Name required', 'Enter your name so the seller can identify the order.', 'error');
      return;
    }
    if (store.requireAddress && !customerAddress.trim()) {
      showToast('Address required', 'Enter the delivery address before continuing.', 'error');
      return;
    }
    const number = store.whatsappNumber.replace(/\D/g, '');
    if (number.length < 10) {
      showToast('Store unavailable', 'The seller has not configured a valid WhatsApp number.', 'error');
      return;
    }
    const current = getStoredStore();
    saveStoredStore({ ...current, whatsappOrders: (current.whatsappOrders || 0) + 1 });
    window.open(`https://wa.me/${number}?text=${encodeURIComponent(orderMessage)}`, '_blank', 'noopener,noreferrer');
  };

  if (!store.enabled || products.length === 0) return null;

  return (
    <section className="flex flex-col gap-6 text-left">
      <div className="flex items-end justify-between gap-3 px-1">
        <div>
          <p className={`flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.18em] ${dark ? 'text-white/60' : 'text-[#A6462D]'}`}><Tag className="h-3.5 w-3.5" /> Featured Products</p>
          <h2 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">Made with intention.</h2>
          {store.description && <p className={`mt-2 max-w-xl text-xs font-semibold leading-relaxed sm:text-sm ${dark ? 'text-white/65' : 'text-charcoal/55'}`}>{store.description}</p>}
        </div>
        <button onClick={() => setCartOpen(true)} className="relative flex shrink-0 items-center gap-2 rounded-full bg-[#A6462D] px-4 py-3 text-xs font-black text-white shadow-lg transition-transform hover:-translate-y-0.5">
          <ShoppingBag className="h-4 w-4" /> Bag
          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#FDF166] px-1 text-[9px] text-charcoal">{itemCount}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {products.map((product, index) => (
          <article key={product.id} className={`group overflow-hidden rounded-[2rem] border shadow-[0_16px_50px_rgba(68,45,34,0.08)] transition-all hover:-translate-y-1 hover:shadow-[0_22px_60px_rgba(68,45,34,0.14)] ${panelClass}`}>
            <div className={`relative aspect-[16/9] sm:aspect-[4/3] w-full overflow-hidden ${dark ? 'bg-white/10' : 'bg-[#EAE1D5]'}`}>
              {product.imageUrl ? <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" /> : <div className="h-full w-full bg-[#E3DFF8]" />}
              <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1.5 text-[9px] font-black uppercase tracking-wider text-charcoal shadow-sm backdrop-blur">{index === 0 ? 'Studio favourite' : 'Small batch'}</span>
            </div>
            <div className="p-4 sm:p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-sm font-black leading-tight sm:text-base">{product.name}</h3>
                  {product.description && <p className={`mt-1.5 text-xs font-semibold leading-relaxed line-clamp-2 ${dark ? 'text-white/60' : 'text-charcoal/50'}`}>{product.description}</p>}
                </div>
                <span className="shrink-0 text-sm font-black">{formatPrice(product.price)}</span>
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                {product.compareAtPrice && product.compareAtPrice > product.price && <span className={`text-[11px] font-bold line-through ${dark ? 'text-white/40' : 'text-charcoal/35'}`}>{formatPrice(product.compareAtPrice)}</span>}
              </div>
              {product.variants.length > 0 && (
                <select
                  value={selectedVariants[product.id] || product.variants[0]}
                  onChange={(event) => setSelectedVariants((current) => ({ ...current, [product.id]: event.target.value }))}
                  className={`mt-3 w-full rounded-2xl border px-3.5 py-2.5 text-xs font-bold outline-none ${dark ? 'border-white/15 bg-white/10 text-white' : 'border-[#D9CFC2] bg-[#FAF7F2] text-charcoal'}`}
                >
                  {product.variants.map((variant) => <option key={variant} value={variant}>{variant}</option>)}
                </select>
              )}
              <button 
                onClick={() => addToCart(product)} 
                className="mt-3.5 flex w-full items-center justify-between rounded-2xl bg-[#A6462D] px-4 py-3 text-xs font-black text-white transition-all hover:bg-[#873721] active:scale-98 cursor-pointer shadow-sm"
              >
                <span className="flex items-center gap-1.5">
                  <ShoppingBag className="h-3.5 w-3.5" />
                  <span>Add to Bag</span>
                </span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </article>
        ))}
      </div>

      {cartOpen && (
        <div className="fixed inset-0 z-[80] flex items-end justify-center bg-black/60 p-0 backdrop-blur-sm sm:items-center sm:p-4">
          <div className="max-h-[94vh] w-full max-w-xl overflow-y-auto rounded-t-4xl bg-white p-5 text-charcoal shadow-float sm:rounded-4xl sm:p-7">
            <div className="flex items-center justify-between border-b border-black/5 pb-4">
              <div>
                <h2 className="text-lg font-black">Your cart</h2>
                <p className="mt-1 text-xs font-semibold text-charcoal/55">Review the order before opening WhatsApp.</p>
              </div>
              <button onClick={() => setCartOpen(false)} className="rounded-full bg-black/5 p-2"><X className="h-4 w-4" /></button>
            </div>

            <div className="mt-4 space-y-3">
              {cart.length === 0 ? <div className="rounded-3xl bg-[#FAF7F2] p-8 text-center text-sm font-bold text-charcoal/50">Your cart is empty.</div> : cart.map((line) => (
                <div key={line.key} className="flex items-center gap-3 rounded-3xl border border-black/8 bg-[#FAF7F2] p-3">
                  <div className="h-14 w-14 shrink-0 overflow-hidden rounded-2xl bg-white">{line.product.imageUrl && <img src={line.product.imageUrl} alt="" className="h-full w-full object-cover" />}</div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-black">{line.product.name}</p>
                    {line.variant && <p className="mt-0.5 text-[11px] font-semibold text-charcoal/50">{line.variant}</p>}
                    <p className="mt-1 text-xs font-black">{formatPrice(line.product.price * line.quantity)}</p>
                  </div>
                  <div className="flex items-center rounded-xl border border-black/10 bg-white">
                    <button onClick={() => changeQuantity(line.key, -1)} className="p-2" title="Decrease quantity">{line.quantity === 1 ? <Trash2 className="h-3.5 w-3.5 text-red-600" /> : <Minus className="h-3.5 w-3.5" />}</button>
                    <span className="min-w-7 text-center text-xs font-black">{line.quantity}</span>
                    <button onClick={() => changeQuantity(line.key, 1)} className="p-2" title="Increase quantity"><Plus className="h-3.5 w-3.5" /></button>
                  </div>
                </div>
              ))}
            </div>

            {cart.length > 0 && (
              <>
                <div className="mt-5 flex items-center justify-between border-y border-black/8 py-4 text-sm font-black"><span>Order total</span><span>{formatPrice(total)}</span></div>
                <div className="mt-5 grid gap-3">
                  <input value={customerName} onChange={(event) => setCustomerName(event.target.value)} placeholder="Your name" className="rounded-2xl border border-black/10 px-4 py-3 text-sm font-semibold outline-none focus:border-[#4F83FF]" />
                  <input value={customerPhone} onChange={(event) => setCustomerPhone(event.target.value)} placeholder="Your phone number, optional" inputMode="tel" className="rounded-2xl border border-black/10 px-4 py-3 text-sm font-semibold outline-none focus:border-[#4F83FF]" />
                  {store.requireAddress && <textarea value={customerAddress} onChange={(event) => setCustomerAddress(event.target.value)} placeholder="Delivery address" className="min-h-20 resize-y rounded-2xl border border-black/10 px-4 py-3 text-sm font-semibold outline-none focus:border-[#4F83FF]" />}
                  <textarea value={customerNote} onChange={(event) => setCustomerNote(event.target.value)} placeholder="Order note, optional" className="min-h-16 resize-y rounded-2xl border border-black/10 px-4 py-3 text-sm font-semibold outline-none focus:border-[#4F83FF]" />
                </div>
                {store.deliveryNote && <p className="mt-4 rounded-2xl bg-[#FEF9DB] p-3 text-[11px] font-bold leading-relaxed text-charcoal/70">{store.deliveryNote}</p>}
                <button onClick={sendOrder} className="mt-4 w-full rounded-2xl bg-[#1F8A4C] px-5 py-3.5 text-sm font-black text-white hover:bg-[#17743F]">Send order on WhatsApp</button>
                <p className="mt-3 text-center text-[10px] font-semibold text-charcoal/45">The seller confirms availability, payment and delivery directly with you.</p>
              </>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
