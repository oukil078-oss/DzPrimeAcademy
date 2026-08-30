'use client';

import React, { useEffect, useState } from 'react';
import { Package, Plus, Trash2, Pencil, ToggleLeft, ToggleRight } from 'lucide-react';
import { formatDZD } from '@/lib/format';

interface BundlesTabProps {
  locale: string;
}

const emptyForm = {
  titleAr: '',
  titleFr: '',
  descriptionAr: '',
  descriptionFr: '',
  track: 'BAC' as const,
  badge: '',
  hours: 24,
  lecturesCount: 3,
  originalPriceDzd: 5000,
  currentPriceDzd: 4000,
  colorTheme: 'gold',
  isActive: true,
  sortOrder: 0,
};

export const BundlesTab: React.FC<BundlesTabProps> = ({ locale }) => {
  const [bundles, setBundles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  const load = () => {
    fetch('/api/bundles?all=true')
      .then((r) => r.json())
      .then(setBundles)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editingId ? `/api/bundles/${editingId}` : '/api/bundles';
    const method = editingId ? 'PUT' : 'POST';
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    if (res.ok) {
      setForm(emptyForm);
      setShowForm(false);
      setEditingId(null);
      load();
    }
  };

  const startEdit = (b: any) => {
    setForm({
      titleAr: b.titleAr,
      titleFr: b.titleFr || '',
      descriptionAr: b.descriptionAr,
      descriptionFr: b.descriptionFr || '',
      track: b.track,
      badge: b.badge || '',
      hours: b.hours,
      lecturesCount: b.lecturesCount,
      originalPriceDzd: b.originalPriceDzd,
      currentPriceDzd: b.currentPriceDzd,
      colorTheme: b.colorTheme,
      isActive: b.isActive,
      sortOrder: b.sortOrder,
    });
    setEditingId(b.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/bundles/${id}`, { method: 'DELETE' });
    load();
  };

  const toggleActive = async (b: any) => {
    await fetch(`/api/bundles/${b.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...b, isActive: !b.isActive }) });
    load();
  };

  return (
    <div className="space-y-4" data-testid="bundles-tab">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h3 className="text-sm font-black text-white flex items-center gap-2">
          <Package className="w-4 h-4 text-lime-400" />
          {locale === 'ar' ? 'حزم الامتحانات القابلة للشراء' : "Bundles d'Examens (Achetables)"}
        </h3>
        <button
          data-testid="add-bundle-btn"
          onClick={() => {
            setForm(emptyForm);
            setEditingId(null);
            setShowForm(!showForm);
          }}
          className="px-3.5 py-2 rounded-xl bg-lime-400 text-slate-950 font-bold text-xs flex items-center gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{locale === 'ar' ? 'إضافة باقة' : 'Ajouter'}</span>
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} data-testid="add-bundle-form" className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <input required placeholder={locale === 'ar' ? 'العنوان (عربي)' : 'Titre (AR)'} value={form.titleAr} onChange={(e) => setForm({ ...form, titleAr: e.target.value })} className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-gray-500 sm:col-span-2" />
          <input placeholder={locale === 'ar' ? 'شعار (مثال BAC 2026)' : 'Badge'} value={form.badge} onChange={(e) => setForm({ ...form, badge: e.target.value })} className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-gray-500" />
          <textarea required placeholder={locale === 'ar' ? 'الوصف (عربي)' : 'Description (AR)'} value={form.descriptionAr} onChange={(e) => setForm({ ...form, descriptionAr: e.target.value })} className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-gray-500 sm:col-span-3" rows={2} />
          <select value={form.track} onChange={(e) => setForm({ ...form, track: e.target.value as any })} className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-gray-200">
            <option value="BAC">BAC</option>
            <option value="UNIVERSITY_LMD">University LMD</option>
            <option value="MEDICAL">Medical</option>
          </select>
          <input type="number" placeholder={locale === 'ar' ? 'الساعات' : 'Heures'} value={form.hours} onChange={(e) => setForm({ ...form, hours: Number(e.target.value) })} className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-gray-500" />
          <input type="number" placeholder={locale === 'ar' ? 'عدد المحاضرات' : 'Nb. Lectures'} value={form.lecturesCount} onChange={(e) => setForm({ ...form, lecturesCount: Number(e.target.value) })} className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-gray-500" />
          <input required type="number" placeholder={locale === 'ar' ? 'السعر الأصلي (DZD)' : 'Prix original (DZD)'} value={form.originalPriceDzd} onChange={(e) => setForm({ ...form, originalPriceDzd: Number(e.target.value) })} className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-gray-500" />
          <input required type="number" placeholder={locale === 'ar' ? 'السعر الحالي (DZD)' : 'Prix actuel (DZD)'} value={form.currentPriceDzd} onChange={(e) => setForm({ ...form, currentPriceDzd: Number(e.target.value) })} className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-gray-500" />
          <button type="submit" data-testid="submit-bundle-btn" className="py-2 rounded-xl bg-lime-400 text-slate-950 font-bold text-xs">
            {editingId ? (locale === 'ar' ? 'حفظ التعديلات' : 'Enregistrer') : (locale === 'ar' ? 'إنشاء الباقة' : 'Créer')}
          </button>
        </form>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {!loading && bundles.map((b) => (
          <div key={b.id} data-testid={`bundle-card-${b.id}`} className={`p-4 rounded-2xl bg-white/[0.04] border space-y-2 ${b.isActive ? 'border-white/10' : 'border-rose-500/30 opacity-60'}`}>
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded-lg bg-lime-400/10 text-lime-300 text-[10px] font-bold">{b.badge || b.track}</span>
              <div className="flex items-center gap-1">
                <button data-testid={`toggle-bundle-${b.id}`} onClick={() => toggleActive(b)} className="p-1 rounded hover:bg-white/10 text-gray-400">
                  {b.isActive ? <ToggleRight className="w-4 h-4 text-lime-400" /> : <ToggleLeft className="w-4 h-4" />}
                </button>
                <button data-testid={`edit-bundle-${b.id}`} onClick={() => startEdit(b)} className="p-1 rounded hover:bg-white/10 text-gray-400">
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                <button data-testid={`delete-bundle-${b.id}`} onClick={() => handleDelete(b.id)} className="p-1 rounded hover:bg-rose-500/20 text-gray-500 hover:text-rose-400">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            <h4 className="text-xs font-bold text-white leading-snug">{locale === 'ar' ? b.titleAr : b.titleFr || b.titleAr}</h4>
            <p className="text-[10px] text-gray-500">{b.hours}h • {b.lecturesCount} {locale === 'ar' ? 'محاضرات' : 'lectures'}</p>
            <p className="text-xs font-mono font-bold text-lime-400">
              {formatDZD(b.currentPriceDzd, locale)} <span className="text-gray-500 line-through">{formatDZD(b.originalPriceDzd, locale)}</span>
            </p>
            <p className="text-[10px] text-gold-400 font-bold" data-testid={`bundle-purchases-count-${b.id}`}>
              {b.purchasesCount || 0} {locale === 'ar' ? 'عملية شراء (تجريبي)' : 'achats (démo)'}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
