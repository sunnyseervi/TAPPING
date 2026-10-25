'use client';

import React, { useRef, useState } from 'react';
import { Check, Eye, EyeOff, Image as ImageIcon, Plus, Store, Trash2, Upload, X } from 'lucide-react';
import { StoreConfig, StoreProduct } from '@/lib/types';
import { useToast } from '@/components/ui/Toast';
import { compressImageFile } from '@/lib/imageCompression';

interface StoreManagerProps {
  store: StoreConfig;
  onUpdateStore: (store: StoreConfig) => void;
  publicUrl: string;
}

const blankProduct = (): StoreProduct => ({
  id: `product_${Date.now()}`,
  name: '',
  description: '',
  price: 0,
  imageUrl: '',
  variants: [],
  isActive: true,
  sortOrder: 0,
});

export default function StoreManager({ store, onUpdateStore, publicUrl }: StoreManagerProps) {
  const { showToast } = useToast();
  const [draft, setDraft] = useState(store);
  const [editing, setEditing] = useState<StoreProduct | null>(null);
  const [variantText, setVariantText] = useState('');
  const [compressing, setCompressing] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const updateDraft = <K extends keyof StoreConfig>(key: K, value: StoreConfig[K]) => {
    setDraft((current) => ({ ...current, [key]: value }));
  };

  const saveStore = () => {
    const normalizedNumber = draft.whatsappNumber.replace(/\D/g, '');
    if (draft.enabled && normalizedNumber.length < 10) {
      showToast('WhatsApp number required', 'Enter the country code and mobile number without spaces.', 'error');
      return;
    }
    const next = { ...draft, whatsappNumber: normalizedNumber };
    setDraft(next);
    onUpdateStore(next);
    showToast('Store published', 'Your catalog and WhatsApp ordering settings are live.', 'success');
  };

  const openProduct = (product?: StoreProduct) => {
    const next = product ? { ...product, variants: [...product.variants] } : { ...blankProduct(), sortOrder: draft.products.length };
    setEditing(next);
    setVariantText(next.variants.join(', '));
  };

  const saveProduct = () => {
    if (!editing || !editing.name.trim() || editing.price <= 0) {
      showToast('Product details needed', 'Add a product name and a price greater than zero.', 'error');
      return;
    }
    const product = {
      ...editing,
      name: editing.name.trim(),
      price: Number(editing.price),
      compareAtPrice: editing.compareAtPrice ? Number(editing.compareAtPrice) : undefined,
      variants: variantText.split(',').map((item) => item.trim()).filter(Boolean),
    };
    const exists = draft.products.some((item) => item.id === product.id);
    updateDraft('products', exists ? draft.products.map((item) => item.id === product.id ? product : item) : [...draft.products, product]);
    setEditing(null);
  };

  const removeProduct = (id: string) => {
    updateDraft('products', draft.products.filter((item) => item.id !== id));
  };

  const uploadProductImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file || !editing) return;
    if (file.size > 15 * 1024 * 1024) {
      showToast('Image is too large', 'Choose an image smaller than 15 MB.', 'error');
      return;
    }
    setCompressing(true);
    try {
      const result = await compressImageFile(file, { maxWidth: 1000, maxHeight: 1000, quality: 0.72 });
      setEditing((current) => current ? { ...current, imageUrl: result.dataUrl } : current);
      const saved = Math.max(0, Math.round((1 - result.compressedBytes / result.originalBytes) * 100));
      showToast('Image ready', `${result.width} by ${result.height} pixels, ${saved}% smaller.`, 'success');
    } catch (error) {
      showToast('Image upload failed', error instanceof Error ? error.message : 'Please try another image.', 'error');
    } finally {
      setCompressing(false);
    }
  };

  const inputClass = 'w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm font-semibold text-charcoal outline-none transition focus:border-[#4F83FF] focus:ring-4 focus:ring-[#4F83FF]/10';

  return (
    <section className="w-full space-y-5">
      <div className="rounded-4xl border border-black/10 bg-white p-5 sm:p-7 shadow-soft">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#FDF166] text-charcoal">
              <Store className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight text-charcoal">WhatsApp Store</h1>
              <p className="mt-1 max-w-2xl text-xs font-semibold leading-relaxed text-charcoal/60">
                Publish products on your profile. Customers build a cart and send the complete order to your WhatsApp. Tapping does not collect payment.
              </p>
            </div>
          </div>
          <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-black/10 bg-[#FAF7F2] px-4 py-3 text-xs font-black">
            <input
              type="checkbox"
              checked={draft.enabled}
              onChange={(event) => updateDraft('enabled', event.target.checked)}
              className="h-4 w-4 accent-[#4F83FF]"
            />
            Store visible
          </label>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <label className="space-y-1.5 text-xs font-black text-charcoal/70">
            Store name
            <input className={inputClass} value={draft.storeName} onChange={(event) => updateDraft('storeName', event.target.value)} />
          </label>
          <label className="space-y-1.5 text-xs font-black text-charcoal/70">
            WhatsApp number with country code
            <input className={inputClass} inputMode="tel" value={draft.whatsappNumber} onChange={(event) => updateDraft('whatsappNumber', event.target.value)} placeholder="919876543210" />
          </label>
          <label className="space-y-1.5 text-xs font-black text-charcoal/70 md:col-span-2">
            Store description
            <textarea className={`${inputClass} min-h-24 resize-y`} value={draft.description} onChange={(event) => updateDraft('description', event.target.value)} />
          </label>
          <label className="space-y-1.5 text-xs font-black text-charcoal/70 md:col-span-2">
            Delivery note
            <input className={inputClass} value={draft.deliveryNote} onChange={(event) => updateDraft('deliveryNote', event.target.value)} />
          </label>
        </div>

        <div className="mt-5 flex flex-col gap-3 border-t border-black/5 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <label className="flex items-center gap-2 text-xs font-bold text-charcoal/70">
            <input type="checkbox" checked={draft.requireAddress} onChange={(event) => updateDraft('requireAddress', event.target.checked)} className="h-4 w-4 accent-[#4F83FF]" />
            Ask for delivery address before WhatsApp
          </label>
          <div className="flex gap-2">
            <a href={publicUrl} target="_blank" rel="noreferrer" className="rounded-2xl border border-black/10 bg-white px-4 py-2.5 text-xs font-black text-charcoal hover:bg-[#FAF7F2]">Preview store</a>
            <button onClick={saveStore} className="flex items-center gap-2 rounded-2xl bg-[#141518] px-5 py-2.5 text-xs font-black text-white hover:bg-black">
              <Check className="h-4 w-4" /> Save and publish
            </button>
          </div>
        </div>
      </div>

      <div className="rounded-4xl border border-black/10 bg-white p-5 sm:p-7 shadow-soft">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-black text-charcoal">Products</h2>
            <p className="mt-1 text-xs font-semibold text-charcoal/55">Price is shown in Indian rupees. Variants are optional.</p>
          </div>
          <button onClick={() => openProduct()} className="flex items-center gap-2 rounded-2xl bg-[#4F83FF] px-4 py-2.5 text-xs font-black text-white hover:bg-[#3B6DE6]">
            <Plus className="h-4 w-4" /> Add product
          </button>
        </div>

        <div className="mt-5 grid gap-3">
          {draft.products.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-black/15 bg-[#FAF7F2] p-8 text-center text-sm font-bold text-charcoal/55">No products added yet.</div>
          ) : draft.products.map((product) => (
            <div key={product.id} className="flex items-center gap-4 rounded-3xl border border-black/8 bg-[#FAF7F2] p-3 sm:p-4">
              <div className="h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-white border border-black/5">
                {product.imageUrl ? <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover" /> : <div className="h-full w-full bg-[#E3DFF8]" />}
              </div>
              <button onClick={() => openProduct(product)} className="min-w-0 flex-1 text-left">
                <p className="truncate text-sm font-black text-charcoal">{product.name}</p>
                <p className="mt-1 text-xs font-bold text-charcoal/55">INR {product.price.toLocaleString('en-IN')}</p>
                {product.variants.length > 0 && <p className="mt-1 truncate text-[11px] font-semibold text-charcoal/45">{product.variants.join(', ')}</p>}
              </button>
              <button
                onClick={() => updateDraft('products', draft.products.map((item) => item.id === product.id ? { ...item, isActive: !item.isActive } : item))}
                className="rounded-xl border border-black/10 bg-white p-2 text-charcoal/60"
                title={product.isActive ? 'Hide product' : 'Show product'}
              >
                {product.isActive ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              </button>
              <button onClick={() => removeProduct(product.id)} className="rounded-xl border border-red-200 bg-white p-2 text-red-600" title="Delete product">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {editing && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/55 p-4 backdrop-blur-sm">
          <div className="max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-4xl border border-black/10 bg-white p-5 shadow-float sm:p-7">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-black text-charcoal">{draft.products.some((item) => item.id === editing.id) ? 'Edit product' : 'Add product'}</h2>
              <button onClick={() => setEditing(null)} className="rounded-full bg-black/5 p-2 text-charcoal"><X className="h-4 w-4" /></button>
            </div>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <label className="space-y-1.5 text-xs font-black text-charcoal/70 sm:col-span-2">Product name<input className={inputClass} value={editing.name} onChange={(event) => setEditing({ ...editing, name: event.target.value })} /></label>
              <label className="space-y-1.5 text-xs font-black text-charcoal/70">Price<input type="number" min="0" className={inputClass} value={editing.price || ''} onChange={(event) => setEditing({ ...editing, price: Number(event.target.value) })} /></label>
              <label className="space-y-1.5 text-xs font-black text-charcoal/70">Original price, optional<input type="number" min="0" className={inputClass} value={editing.compareAtPrice || ''} onChange={(event) => setEditing({ ...editing, compareAtPrice: Number(event.target.value) || undefined })} /></label>
              <label className="space-y-1.5 text-xs font-black text-charcoal/70 sm:col-span-2">Description<textarea className={`${inputClass} min-h-20 resize-y`} value={editing.description} onChange={(event) => setEditing({ ...editing, description: event.target.value })} /></label>
              <div className="space-y-2 sm:col-span-2">
                <p className="text-xs font-black text-charcoal/70">Product image</p>
                <input ref={imageInputRef} type="file" accept="image/png,image/jpeg,image/webp,image/avif" onChange={uploadProductImage} className="hidden" />
                <div className="flex items-center gap-4 rounded-3xl border border-dashed border-black/15 bg-[#FAF7F2] p-3">
                  <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-white">
                    {editing.imageUrl ? <img src={editing.imageUrl} alt="Product preview" className="h-full w-full object-cover" /> : <ImageIcon className="h-6 w-6 text-charcoal/30" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <button type="button" disabled={compressing} onClick={() => imageInputRef.current?.click()} className="flex items-center gap-2 rounded-2xl bg-white px-4 py-2.5 text-xs font-black text-charcoal shadow-xs disabled:opacity-50">
                      <Upload className="h-4 w-4" /> {compressing ? 'Compressing image' : editing.imageUrl ? 'Replace image' : 'Upload image'}
                    </button>
                    <p className="mt-2 text-[11px] font-semibold leading-relaxed text-charcoal/50">JPG, PNG, WebP or AVIF. The image is resized and compressed automatically.</p>
                  </div>
                  {editing.imageUrl && <button type="button" onClick={() => setEditing({ ...editing, imageUrl: '' })} className="rounded-xl bg-white p-2 text-red-600" title="Remove image"><Trash2 className="h-4 w-4" /></button>}
                </div>
              </div>
              <label className="space-y-1.5 text-xs font-black text-charcoal/70 sm:col-span-2">Variants separated by commas<input className={inputClass} value={variantText} onChange={(event) => setVariantText(event.target.value)} placeholder="Small, Medium, Large" /></label>
            </div>
            <button onClick={saveProduct} className="mt-6 w-full rounded-2xl bg-[#141518] px-5 py-3.5 text-sm font-black text-white hover:bg-black">Save product</button>
          </div>
        </div>
      )}
    </section>
  );
}
